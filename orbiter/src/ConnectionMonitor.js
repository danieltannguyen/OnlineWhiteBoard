//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.orbiter.ConnectionMonitor = function (orbiter) {
  // Instance variables
  this.connectionTimeout = 0;
  this.heartbeatIntervalID = -1;
  this.heartbeatCounter = 0;
  this.heartbeatEnabled = true;
  this.heartbeats = new net.user1.utils.UDictionary();
  
  this.oldestHeartbeat = 0;
  this.heartBeatFrequency = -1;
  
  this.sharedPing = false;

  this.autoReconnectMinMS = 0;
  this.autoReconnectMaxMS = 0;
  this.autoReconnectFrequency = -1;
  this.autoReconnectDelayFirstAttempt = false;
  this.autoReconnectTimeoutID = -1;
  this.autoReconnectAttemptLimit = -1;
  
  this.orbiter = orbiter;
  this.msgManager = orbiter.getMessageManager();
  this.log = orbiter.getLog();
  
  this.disposed = false;
  
  // Initialization
  this.orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.READY, this.connectReadyListener, this);
  this.orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.CLOSE, this.connectCloseListener, this);
  this.disableHeartbeatLogging();
};

//==============================================================================
// STATIC VARIABLES
//==============================================================================
net.user1.orbiter.ConnectionMonitor.DEFAULT_HEARTBEAT_FREQUENCY = 10000;
net.user1.orbiter.ConnectionMonitor.MIN_HEARTBEAT_FREQUENCY = 20;
net.user1.orbiter.ConnectionMonitor.DEFAULT_AUTORECONNECT_FREQUENCY = -1;
net.user1.orbiter.ConnectionMonitor.DEFAULT_AUTORECONNECT_ATTEMPT_LIMIT = -1;
net.user1.orbiter.ConnectionMonitor.DEFAULT_CONNECTION_TIMEOUT = 60000;

//==============================================================================
// CONNECTION MONITORING
//==============================================================================
/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.connectReadyListener = function (e) {
  this.msgManager.addMessageListener(net.user1.orbiter.Messages.CLIENT_HEARTBEAT, this.heartbeatMessageListener, this);
  this.startHeartbeat();
  this.stopReconnect();
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.connectCloseListener = function (e) {
  this.stopHeartbeat();

  var numAttempts = this.orbiter.getConnectionManager().getConnectAttemptCount();
  if (numAttempts == 0) {
    this.selectReconnectFrequency();
  }

  if (this.autoReconnectFrequency > -1) {
    if (this.autoReconnectTimeoutID != -1) {
      return;
    } else {
      // Defer reconnection until after all other listeners have processed the
      // CLOSE event
      var self = this;
      setTimeout(function () {
        // If another listener disposed of Orbiter, or disabled autoreconnect, quit
        if (!self.disposed && self.autoReconnectFrequency != -1) {
          self.log.warn("[CONNECTION_MONITOR] Disconnection detected.");
          if (self.autoReconnectDelayFirstAttempt
              && (
                  (numAttempts == 0)
                  ||
                  (numAttempts == 1 && self.orbiter.getConnectionManager().getReadyCount() == 0)
                 )
             ) {
            self.log.info("[CONNECTION_MONITOR] Delaying reconnection attempt"
              + " by " + self.autoReconnectFrequency + " ms...");
            self.scheduleReconnect(self.autoReconnectFrequency);
          } else {
            self.doReconnect();
          }
        }
      }, 1);
    }
  }
}
    
//==============================================================================
// HEARTBEAT
//==============================================================================

net.user1.orbiter.ConnectionMonitor.prototype.enableHeartbeat = function () {
  this.log.info("[CONNECTION_MONITOR] Heartbeat enabled.");
  this.heartbeatEnabled = true;
  this.startHeartbeat();
}

net.user1.orbiter.ConnectionMonitor.prototype.disableHeartbeat = function () {
  this.log.info("[CONNECTION_MONITOR] Heartbeat disabled.");
  this.heartbeatEnabled = false;
  this.stopHeartbeat();
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.startHeartbeat = function () {
  if (!this.heartbeatEnabled) {
    this.log.info("[CONNECTION_MONITOR] Heartbeat is currently disabled. Ignoring start request.");
    return;
  }
  
  this.stopHeartbeat();
  
  this.heartbeats = new net.user1.utils.UDictionary();
  
  var currentObj = this;
  var callback   = this.heartbeatTimerListener;
  this.heartbeatIntervalID = setInterval(function () {
    callback.call(currentObj);
  }, this.heartBeatFrequency);
  
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.stopHeartbeat = function () {
  clearInterval(this.heartbeatIntervalID);
  this.heartbeats = null;
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.heartbeatTimerListener = function () {
  if (!this.orbiter.isReady()) {
    this.log.info("[CONNECTION_MONITOR] Orbiter is not connected. Stopping heartbeat.");
    this.stopHeartbeat();
    return;
  }

  var timeSinceOldestHeartbeat;
  var now = new Date().getTime();
  
  this.heartbeats[this.heartbeatCounter] = now;
  this.orbiter.getMessageManager().sendUPC("u2",
                                 net.user1.orbiter.Messages.CLIENT_HEARTBEAT, 
                                 this.orbiter.getClientID(),
                                 "",
                                 this.heartbeatCounter);
  this.heartbeatCounter++;
  
  // Assign the oldest heartbeat
  if (net.user1.utils.ObjectUtil.length(this.heartbeats) == 1) {
    this.oldestHeartbeat = now;
  } else { 
    this.oldestHeartbeat = Number.MAX_VALUE;
    for (var p in this.heartbeats) {
      if (this.heartbeats[p] < this.oldestHeartbeat) {
        this.oldestHeartbeat = this.heartbeats[p];
      }
    }
  }
  // Close connection if too much time has passed since the last response
  timeSinceOldestHeartbeat = now - this.oldestHeartbeat;
  if (timeSinceOldestHeartbeat > this.connectionTimeout) {
    this.log.warn("[CONNECTION_MONITOR] No response from server in " + 
                  timeSinceOldestHeartbeat + "ms. Starting automatic disconnect.");
    this.orbiter.disconnect();
  }
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.heartbeatMessageListener = function (fromClientID, id) {
  var ping = new Date().getTime() - this.heartbeats[parseInt(id)];
  if (typeof this.orbiter.self().setAttribute === "undefined") {
    // OrbiterMicro
    this.orbiter.self().ping = ping;
    this.orbiter.getMessageManager().sendUPC("u3",
                                             this.orbiter.getClientID(),
                                             "",
                                             "_PING",
                                             ping.toString(),
                                             "",
                                             this.sharedPing ? "4" : "0");
  } else {
    // Orbiter
    this.orbiter.self().setAttribute("_PING",
                                     ping.toString(),
                                     null,
                                     this.sharedPing);
  }
  delete this.heartbeats[parseInt(id)];
}

//==============================================================================
// RECONNECTION
//==============================================================================
/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.reconnectTimerListener = function (e) {
  this.stopReconnect();
  if (this.orbiter.getConnectionManager().connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED) {
    this.doReconnect();
  }
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.stopReconnect = function () {
  clearTimeout(this.autoReconnectTimeoutID);
  this.autoReconnectTimeoutID = -1
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.scheduleReconnect = function (milliseconds) {
  // Reset the timer
  this.stopReconnect();
  var currentObj = this;
  var callback   = this.reconnectTimerListener;
  this.autoReconnectTimeoutID = setTimeout(function () {
    currentObj.autoReconnectTimeoutID = -1;
    callback.call(currentObj);
  }, milliseconds);
};

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.selectReconnectFrequency = function () {
  if (this.autoReconnectMinMS == -1) {
    this.autoReconnectFrequency = -1;
  } else if (this.autoReconnectMinMS == this.autoReconnectMaxMS) {
    this.autoReconnectFrequency = this.autoReconnectMinMS;
  } else {
    this.autoReconnectFrequency = getRandInt(this.autoReconnectMinMS, this.autoReconnectMaxMS);
    this.log.info("[CONNECTION_MONITOR] Random auto-reconnect frequency selected: [" +
                  this.autoReconnectFrequency + "] ms.");
  }

  function getRandInt (min, max) {
    return min + Math.floor(Math.random()*(max+1 - min));
  }
};

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.doReconnect = function () {
  var numActualAttempts = this.orbiter.getConnectionManager().getConnectAttemptCount();
  var numReconnectAttempts;

  if (this.orbiter.getConnectionManager().getReadyCount() == 0) {
    numReconnectAttempts = numActualAttempts - 1;
  } else {
    numReconnectAttempts = numActualAttempts;
  }

  if (this.autoReconnectAttemptLimit != -1
      && numReconnectAttempts > 0
      && numReconnectAttempts % (this.autoReconnectAttemptLimit) == 0) {
    this.log.warn("[CONNECTION_MONITOR] Automatic reconnect attempt limit reached."
                  + " No further automatic connection attempts will be made until"
                  + " the next manual connection attempt.");
    return;
  }

  this.scheduleReconnect(this.autoReconnectFrequency);

  this.log.warn("[CONNECTION_MONITOR] Attempting automatic reconnect. (Next attempt in "
                + this.autoReconnectFrequency + "ms.)");
  this.orbiter.connect();
}

//==============================================================================
// CONFIGURATION
//==============================================================================

net.user1.orbiter.ConnectionMonitor.prototype.restoreDefaults = function () {
  this.setAutoReconnectFrequency(net.user1.orbiter.ConnectionMonitor.DEFAULT_AUTORECONNECT_FREQUENCY);
  this.setAutoReconnectAttemptLimit(net.user1.orbiter.ConnectionMonitor.DEFAULT_AUTORECONNECT_ATTEMPT_LIMIT);
  this.setConnectionTimeout(net.user1.orbiter.ConnectionMonitor.DEFAULT_CONNECTION_TIMEOUT);
  this.setHeartbeatFrequency(net.user1.orbiter.ConnectionMonitor.DEFAULT_HEARTBEAT_FREQUENCY);
}

net.user1.orbiter.ConnectionMonitor.prototype.setHeartbeatFrequency = function (milliseconds) {
  if (milliseconds >= net.user1.orbiter.ConnectionMonitor.MIN_HEARTBEAT_FREQUENCY) {
    this.heartBeatFrequency = milliseconds;
    this.log.info("[CONNECTION_MONITOR] Heartbeat frequency set to " 
                  + milliseconds + " ms.");
    // Log a warning for low heartbeat frequencies...
    if (milliseconds >= net.user1.orbiter.ConnectionMonitor.MIN_HEARTBEAT_FREQUENCY && milliseconds < 1000) {
      this.log.info("[CONNECTION_MONITOR] HEARTBEAT FREQUENCY WARNING: " 
               + milliseconds + " ms. Current frequency will generate "
               + (Math.floor((1000/milliseconds)*10)/10) 
               + " messages per second per connected client.");
    }
    
    // If the connection is ready, then restart
    // the heartbeat when the heartbeat frequency changes.
    if (this.orbiter.isReady()) {
      this.startHeartbeat();
    }
  } else {
    this.log.warn("[CONNECTION_MONITOR] Invalid heartbeat frequency specified: " 
             + milliseconds + ". Frequency must be "
             + net.user1.orbiter.ConnectionMonitor.MIN_HEARTBEAT_FREQUENCY + " or greater.");
  }
}

net.user1.orbiter.ConnectionMonitor.prototype.getHeartbeatFrequency = function () {
  return this.heartBeatFrequency;
}

net.user1.orbiter.ConnectionMonitor.prototype.setAutoReconnectFrequency = function (minMS, maxMS, delayFirstAttempt) {
  maxMS = (typeof maxMS == "undefined") ? -1 : maxMS;
  delayFirstAttempt = (typeof delayFirstAttempt == "undefined") ? false : delayFirstAttempt;

  if (minMS == 0 || minMS < -1) {
    this.log.warn("[CONNECTION_MONITOR] Invalid auto-reconnect minMS specified: ["
      + minMS + "]. Value must not be zero or less than -1. Value adjusted"
      + " to [-1] (no reconnect).");
    minMS = -1;
  }
  if (minMS == -1) {
    this.stopReconnect();
  } else {
    if (maxMS == -1) {
      maxMS = minMS;
    }
    if (maxMS < minMS) {
      this.log.warn("[CONNECTION_MONITOR] Invalid auto-reconnect maxMS specified: ["
                    + maxMS + "]." + " Value of maxMS must be greater than or equal "
                    + "to minMS. Value adjusted to [" + minMS + "].");
      maxMS = minMS;
    }
  }

  this.autoReconnectDelayFirstAttempt = delayFirstAttempt;
  this.autoReconnectMinMS = minMS;
  this.autoReconnectMaxMS = maxMS;

  this.log.info("[CONNECTION_MONITOR] Assigning auto-reconnect frequency settings: [minMS: "
                + minMS + ", maxMS: " + maxMS + ", delayFirstAttempt: "
                + delayFirstAttempt.toString() + "].");
  if (minMS > 0 && minMS < 1000) {
    this.log.info("[CONNECTION_MONITOR] RECONNECT FREQUENCY WARNING: "
                  + minMS + " minMS specified. Current frequency will cause "
                  + (Math.floor((1000/minMS)*10)/10).toString()
                  + " reconnection attempts per second.");
  }
  this.selectReconnectFrequency();
}

net.user1.orbiter.ConnectionMonitor.prototype.getAutoReconnectFrequency = function () {
  return this.autoReconnectFrequency;
}

net.user1.orbiter.ConnectionMonitor.prototype.setAutoReconnectAttemptLimit = function (attempts) {
  if (attempts < -1 || attempts == 0) {
    this.log.warn("[CONNECTION_MONITOR] Invalid Auto-reconnect attempt limit specified: " 
             + attempts + ". Limit must -1 or greater than 1.");
    return;
  }
    
  this.autoReconnectAttemptLimit = attempts;
  
  if (attempts == -1) {
    this.log.info("[CONNECTION_MONITOR] Auto-reconnect attempt limit set to none."); 
  } else {
    this.log.info("[CONNECTION_MONITOR] Auto-reconnect attempt limit set to " 
                  + attempts + " attempt(s).");
  }
};
    
net.user1.orbiter.ConnectionMonitor.prototype.getAutoReconnectAttemptLimit = function () {
  return this.autoReconnectAttemptLimit;
}

net.user1.orbiter.ConnectionMonitor.prototype.setConnectionTimeout = function (milliseconds) {
  if (milliseconds > 0) {
    this.connectionTimeout = milliseconds;
    this.log.info("[CONNECTION_MONITOR] Connection timeout set to " 
                  + milliseconds + " ms.");
  } else {
    this.log.warn("[CONNECTION_MONITOR] Invalid connection timeout specified: " 
                             + milliseconds + ". Frequency must be greater " 
                             + "than zero.");
  }
}

net.user1.orbiter.ConnectionMonitor.prototype.getConnectionTimeout = function () {
  return this.connectionTimeout;
}

net.user1.orbiter.ConnectionMonitor.prototype.sharePing = function (share) {
  this.sharedPing = share;
}

net.user1.orbiter.ConnectionMonitor.prototype.isPingShared = function () {
  return this.sharedPing;
}

net.user1.orbiter.ConnectionMonitor.prototype.disableHeartbeatLogging = function () {
  this.log.addSuppressionTerm("<A>CLIENT_HEARTBEAT</A>");
  this.log.addSuppressionTerm("<A>_PING</A>");
  this.log.addSuppressionTerm("[_PING]");
  this.log.addSuppressionTerm("<![CDATA[_PING]]>");
}

net.user1.orbiter.ConnectionMonitor.prototype.enableHeartbeatLogging = function () {
  this.log.removeSuppressionTerm("<A>CLIENT_HEARTBEAT</A>");
  this.log.removeSuppressionTerm("<A>_PING</A>");
  this.log.removeSuppressionTerm("[_PING]");
  this.log.removeSuppressionTerm("<![CDATA[_PING]]>");
}

// =============================================================================
// DISPOSAL
// =============================================================================

net.user1.orbiter.ConnectionMonitor.prototype.dispose = function () {
  this.disposed = true;
  
  this.stopHeartbeat();
  this.stopReconnect();

  this.heartbeats = null;
  
  this.orbiter.removeEventListener(net.user1.orbiter.OrbiterEvent.READY, this.connectReadyListener, this);
  this.orbiter.removeEventListener(net.user1.orbiter.OrbiterEvent.CLOSE, this.connectCloseListener, this);
  this.orbiter = null;
  this.msgManager.removeMessageListener("u7", this.u7);
  this.msgManager(null);
  this.log = null;
};

















