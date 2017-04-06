//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
 * Connection is the abstract superclass of HTTPConnection and WebSocketConnection;
 * it is used internally by Orbiter, and is not intended for direct use by Orbiter
 * developers. For information on communication with Union Server, see
 * Orbiter's connect() method, the WebSocketConnection class and the
 * HTTPDirectConnection and HTTPIFrameConnection classes.
 *
 * The Connection class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.BEGIN_CONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.BEGIN_HANDSHAKE}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.READY}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.CLIENT_KILL_CONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.SERVER_KILL_CONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.DISCONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.RECEIVE_UPC}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.SEND_DATA}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.RECEIVE_DATA}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.SESSION_TERMINATED}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.SESSION_NOT_FOUND}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher

 *
 * @see net.user1.orbiter.Orbiter#connect
 * @see net.user1.orbiter.Orbiter#secureConnect
 * @see net.user1.orbiter.HTTPDirectConnection
 * @see net.user1.orbiter.HTTPIFrameConnection
 * @see net.user1.orbiter.WebSocketConnection
 * @see net.user1.orbiter.SecureHTTPDirectConnection
 * @see net.user1.orbiter.SecureHTTPIFrameConnection
 * @see net.user1.orbiter.SecureWebSocketConnection
 */
net.user1.orbiter.Connection = function (host, port, type) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);

  // Variables
  this.mostRecentConnectAchievedReady = false;
  this.mostRecentConnectTimedOut = false;
  this.readyCount = 0;
  this.connectAttemptCount = 0;
  this.connectAbortCount = 0;
  this.readyTimeoutID = 0;
  this.readyTimeout = 0;
  this.orbiter = null;
  this.disposed = false;
  this.requestedHost = null;
  
  // Initialization
  this.setServer(host, port);
  this.connectionType = type;
  this.connectionState = net.user1.orbiter.ConnectionState.NOT_CONNECTED;
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.Connection, net.user1.events.EventDispatcher);

//==============================================================================    
// DEPENDENCIES
//============================================================================== 
/** @private */
net.user1.orbiter.Connection.prototype.setOrbiter = function (orbiter) {
  if (this.orbiter != null) {
    this.orbiter.getMessageManager().removeMessageListener("u63", this.u63);
    this.orbiter.getMessageManager().removeMessageListener("u66", this.u66);
    this.orbiter.getMessageManager().removeMessageListener("u84", this.u84);
    this.orbiter.getMessageManager().removeMessageListener("u85", this.u85);
  }
  this.orbiter = orbiter;
}
  
//==============================================================================    
// CONNECT/DISCONNECT
//============================================================================== 
net.user1.orbiter.Connection.prototype.connect = function () {
  this.disconnect();
  this.applyAffinity();
  this.orbiter.getLog().info(this.toString() + " Attempting connection...");
  this.connectAttemptCount++;
  this.mostRecentConnectAchievedReady = false;
  this.mostRecentConnectTimedOut = false;
  this.connectionState = net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS;
  // Start the ready timer. Ready state must be achieved before the timer
  // completes or the connection will auto-disconnect.
  this.startReadyTimer();
  this.dispatchBeginConnect();
}
  
net.user1.orbiter.Connection.prototype.disconnect = function () {
  var state = this.connectionState;
 
  if (state != net.user1.orbiter.ConnectionState.NOT_CONNECTED) {
    this.deactivateConnection();
 
    if (state == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
      this.connectAbortCount++;
      this.dispatchConnectFailure("Client closed connection before READY state was achieved.");
    } else {
      this.dispatchClientKillConnect();
    }
  }
}
    
/** @private */
net.user1.orbiter.Connection.prototype.deactivateConnection = function () {
  this.connectionState = net.user1.orbiter.ConnectionState.NOT_CONNECTED;
  this.stopReadyTimer();
  this.orbiter.setSessionID("");
}
  
//==============================================================================    
// CONNECTION CONFIGURATION
//==============================================================================    
net.user1.orbiter.Connection.prototype.setServer = function (host,
                                                             port) {
  this.requestedHost = host;
      
  // Check for valid ports
  if (port < 1 || port > 65536) {
    throw new Error("Illegal port specified [" + port + "]. Must be greater than 0 and less than 65537.");
  }
  this.port  = port;
}

net.user1.orbiter.Connection.prototype.getRequestedHost = function () {
  return this.requestedHost;
};

net.user1.orbiter.Connection.prototype.getHost = function () {
  if (this.host == null) {
    return this.getRequestedHost();
  } else {
    return this.host;
  }
};

net.user1.orbiter.Connection.prototype.getPort = function () {
  return this.port;
};

net.user1.orbiter.Connection.prototype.getType = function () {
  return this.connectionType;
};
    
//==============================================================================
// READY HANDSHAKE
//==============================================================================
/** @private */
net.user1.orbiter.Connection.prototype.beginReadyHandshake = function () {
  this.dispatchBeginHandshake();
  
  if (!this.orbiter.getMessageManager().hasMessageListener("u63", this.u63)) {
    this.orbiter.getMessageManager().addMessageListener("u63", this.u63, this);
    this.orbiter.getMessageManager().addMessageListener("u66", this.u66, this);
    this.orbiter.getMessageManager().addMessageListener("u84", this.u84, this);
    this.orbiter.getMessageManager().addMessageListener("u85", this.u85, this);
  }
  
  this.sendHello();
}

/** @private */
net.user1.orbiter.Connection.prototype.sendHello = function() {
  var helloString = this.buildHelloMessage();
  this.orbiter.getLog().debug(this.toString() + " Sending CLIENT_HELLO: " + helloString);
  this.transmitHelloMessage(helloString);
}

/** @private */
net.user1.orbiter.Connection.prototype.buildHelloMessage = function () {
  var helloString = "<U><M>u65</M>"
    + "<L>"
    + "<A>" + this.orbiter.getSystem().getClientType() + "</A>"
    + "<A>" + (typeof navigator != "undefined" ? navigator.userAgent + ";" : "") 
    + this.orbiter.getSystem().getClientVersion().toStringVerbose() + "</A>"
    + "<A>" + this.orbiter.getSystem().getUPCVersion().toString() + "</A></L></U>";
  return helloString;
}

/** @private */
net.user1.orbiter.Connection.prototype.transmitHelloMessage = function (helloString) {
  this.send(helloString);
}
    
//==============================================================================
// READY TIMER
//==============================================================================
/** @private */
net.user1.orbiter.Connection.prototype.readyTimerListener = function () {
  this.stopReadyTimer();
  if (this.connectionState == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.orbiter.getLog().warn("[CONNECTION] " + this.toString() + " Failed to achieve" + 
            " ready state after " + this.readyTimeout + "ms. Aborting connection...");
    this.mostRecentConnectTimedOut = true;
    this.disconnect();
  }
}

/** @private */
net.user1.orbiter.Connection.prototype.stopReadyTimer = function () {
  if (this.readyTimeoutID != -1) {
    clearTimeout(this.readyTimeoutID);
  }
}

/** @private */
net.user1.orbiter.Connection.prototype.startReadyTimer = function () {
  var currentObj = this;
  var callback   = this.readyTimerListener;
  this.stopReadyTimer();
  this.readyTimeout = this.orbiter.getConnectionManager().getReadyTimeout();
  var self = this;
  this.readyTimeoutID = setTimeout (function () {
    callback.call(currentObj);
  }, self.readyTimeout);
}

//==============================================================================
// READY STATE ACCESS
//==============================================================================
/** @private */
net.user1.orbiter.Connection.prototype.getReadyCount = function () {
  return this.readyCount;
}
    
net.user1.orbiter.Connection.prototype.isReady = function () {
  return this.connectionState == net.user1.orbiter.ConnectionState.READY;
}

/** @private */
net.user1.orbiter.Connection.prototype.isValid = function () {
  if (this.mostRecentConnectAchievedReady) {
    this.orbiter.getLog().debug(this.toString() + " Connection is"
      + " valid because its last connection attempt succeeded.");
    return true;
  }
  
  if (this.connectAttemptCount == 0) {
    this.orbiter.getLog().debug(this.toString() + " Connection is"
      + " valid because it has either never attempted to connect, or has not"
      + " attempted to connect since its last successful connection.");
    return true;
  }
  
  if ((this.connectAttemptCount > 0) && 
      (this.connectAttemptCount == this.connectAbortCount)
      && !this.mostRecentConnectTimedOut) {
    this.orbiter.getLog().debug(this.toString() + " Connection is"
      + " valid because either all connection attempts ever or all"
      + " connection attempts since its last successful connection were"
      + " aborted before the ready timeout was reached.");
    return true;
  }
  
  this.orbiter.getLog().debug(this.toString() + " Connection is not"
    + " valid; its most recent connection failed to achieve a ready state.");
  return false;
}

    
//==============================================================================
// UPC LISTENERS
//==============================================================================
/** @private */
net.user1.orbiter.Connection.prototype.u63 = function () {
  this.stopReadyTimer();
  this.connectionState = net.user1.orbiter.ConnectionState.READY;
  this.mostRecentConnectAchievedReady = true;
  this.readyCount++;
  this.connectAttemptCount = 0;
  this.connectAbortCount   = 0;
  this.dispatchReady();
}    

/** @private */
net.user1.orbiter.Connection.prototype.u66 = function (serverVersion, 
                                                       sessionID, 
                                                       upcVersion, 
                                                       protocolCompatible,
                                                       affinityAddress,
                                                       affinityDuration) {
  this.orbiter.setSessionID(sessionID);
};

/** @private */
net.user1.orbiter.Connection.prototype.u84 = function () {
  this.dispatchSessionTerminated();
}    

/** @private */
net.user1.orbiter.Connection.prototype.u85 = function () {
  this.dispatchSessionNotFound();
}    

//==============================================================================    
// SERVER AFFINITY
//==============================================================================
/** @private */
net.user1.orbiter.Connection.prototype.applyAffinity = function () {
  var affinityAddress = this.orbiter.getConnectionManager().getAffinity(this.requestedHost);
  if (affinityAddress == this.requestedHost) {
    this.orbiter.getLog().info(this.toString() + " No affinity address found for requested host [" 
                               + this.requestedHost + "]. Using requested host for next connection attempt.");
  } else {
    this.orbiter.getLog().info(this.toString() + " Applying affinity address [" + affinityAddress + "] for supplied host [" + this.requestedHost + "].");
  }
  this.host = affinityAddress;
}

//==============================================================================    
// TOSTRING
//==============================================================================     
net.user1.orbiter.Connection.prototype.toString = function () {
  var s = "[" + this.connectionType + ", requested host: " + this.requestedHost 
          + ", host: " + (this.host == null ? "" : this.host) 
          + ", port: " + this.port + "]";
  return s;
}
    
//==============================================================================    
// EVENT DISPATCHING
//==============================================================================  
/** @private */
net.user1.orbiter.Connection.prototype.dispatchSendData = function (data) {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.SEND_DATA,
                                    null, data, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchReceiveData = function (data) {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.RECEIVE_DATA,
                                    null, data, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchConnectFailure = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE,
                                    null, null, this, status));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchBeginConnect = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.BEGIN_CONNECT,
                                    null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchBeginHandshake = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.BEGIN_HANDSHAKE,
                                    null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchReady = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.READY,
                                    null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchServerKillConnect  = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.SERVER_KILL_CONNECT,
                                    null, null, this));
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.DISCONNECT,
                                    null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchClientKillConnect = function () {
    this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.CLIENT_KILL_CONNECT,
                                      null, null, this));
    this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.DISCONNECT,
                                      null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchSessionTerminated = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.SESSION_TERMINATED,
                                    null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchSessionNotFound = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.SESSION_NOT_FOUND,
                                    null, null, this));
}

//==============================================================================    
// DISPOSAL
//==============================================================================  
/** @private */
net.user1.orbiter.Connection.prototype.dispose = function () {
  this.disposed = true;
  this.messageManager.removeMessageListener("u63", this.u63);
  this.messageManager.removeMessageListener("u66", this.u66);
  this.messageManager.removeMessageListener("u84", this.u84);
  this.messageManager.removeMessageListener("u85", this.u85);
  this.stopReadyTimer();
  this.readyTimer = null;
  this.orbiter = null;
}