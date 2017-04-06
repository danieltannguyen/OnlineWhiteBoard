//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 *
 * HTTPConnection is the abstract superclass of HTTPDirectConnection and
 * HTTPIFrameConnection; it is used internally by Orbiter, and is not intended
 * for direct use by Orbiter developers. For information on HTTP communication
 * with Union Server, see the HTTPDirectConnection and HTTPIFrameConnection classes.
 *
 * For a list of events dispatched by HTTPConnection, see HTTPConnection's
 * superclass, {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.Connection
 *
 *
 * @see net.user1.orbiter.HTTPDirectConnection
 * @see net.user1.orbiter.HTTPIFrameConnection
 */
net.user1.orbiter.HTTPConnection = function (host, port, type) {
  // Invoke superclass constructor
  net.user1.orbiter.Connection.call(this, host, port, type || net.user1.orbiter.ConnectionType.HTTP);

  // Instance variables
  this.url = "";
  this.sendDelayTimerEnabled = true;
  this.sendDelayTimeoutID = -1;
  this.sendDelayTimerRunning = false;
  this.sendDelay = net.user1.orbiter.HTTPConnection.DEFAULT_SEND_DELAY;
  
  this.messageQueue = new Array();
  
  this.retryDelay = 500;
  this.retryHelloTimeoutID = -1;
  this.retryIncomingTimeoutID = -1;
  this.retryOutgoingTimeoutID = -1;

  this.helloResponsePending = false;
  this.outgoingResponsePending = false;
  
  // Initialization
  this.addEventListener(net.user1.orbiter.ConnectionEvent.SESSION_TERMINATED, this.sessionTerminatedListener, this);
  this.addEventListener(net.user1.orbiter.ConnectionEvent.SESSION_NOT_FOUND, this.sessionNotFoundListener, this);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.HTTPConnection, net.user1.orbiter.Connection);

//==============================================================================    
// STATIC VARIABLES
//==============================================================================    
/** @constant */
net.user1.orbiter.HTTPConnection.DEFAULT_SEND_DELAY = 300;
    
//==============================================================================    
// ABSTRACT METHODS (MUST BE IMPLEMENTED BY SUBCLASSES)
//==============================================================================    
    
net.user1.orbiter.HTTPConnection.prototype.doRequestDeactivation = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doSendHello = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doRetryHello = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doSendOutgoing = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doRetryOutgoing = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doSendIncoming = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doRetryIncoming = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doDispose = net.user1.utils.abstractError;
    
//==============================================================================    
// CONNECTION AND DISCONNECTION
//==============================================================================    
net.user1.orbiter.HTTPConnection.prototype.connect = function () {
  net.user1.orbiter.Connection.prototype.connect.call(this);
};
    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.deactivateConnection = function () {
  this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Deactivating...");
  this.connectionState = net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS;
  this.stopSendDelayTimer();
  if (this.retryHelloTimeoutID != -1) {
    this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Cancelling scheduled hello-request retry.");
    clearTimeout(this.retryHelloTimeoutID);
    this.retryHelloTimeoutID = -1
  }
  if (this.retryIncomingTimeoutID != -1) {
    this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Cancelling scheduled incoming-request retry.");
    clearTimeout(this.retryIncomingTimeoutID);
    this.retryIncomingTimeoutID = -1
  }
  if (this.retryOutgoingTimeoutID != -1) {
    this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Cancelling scheduled outgoing-request retry.");
    clearTimeout(this.retryOutgoingTimeoutID);
    this.retryOutgoingTimeoutID = -1
  }
  this.deactivateHTTPRequests();
  net.user1.orbiter.Connection.prototype.deactivateConnection.call(this);
};
    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.deactivateHTTPRequests = function () {
  this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Closing all pending HTTP requests.");
  this.doRequestDeactivation();
  this.helloResponsePending = false;
  this.outgoingResponsePending = false;
};

//==============================================================================    
// SESSION MANAGEMENT
//==============================================================================     

/** @private */
net.user1.orbiter.HTTPConnection.prototype.sessionTerminatedListener = function (e) {
  var state = this.connectionState;
  this.deactivateConnection();
  
  if (state == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.dispatchConnectFailure("Server terminated session before READY state was achieved.");
  } else {
    this.dispatchServerKillConnect();
  }
};

/** @private */
net.user1.orbiter.HTTPConnection.prototype.sessionNotFoundListener = function (e) {
  var state = this.connectionState;
  
  this.deactivateConnection();
  
  if (state == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.dispatchConnectFailure("Client attempted to reestablish an expired session"
                                + " or establish an unknown session.");
  } else {
    this.dispatchServerKillConnect();
  }
}

    
//==============================================================================    
// SERVER ASSIGNMENT
//==============================================================================    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.setServer = function (host, port) {
  try {
    net.user1.orbiter.Connection.prototype.setServer.call(this, host, port);
  } finally {
    this.buildURL();
  }
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.buildURL = function () {
  this.url = "http://" + this.host + ":" + this.port;
}

//==============================================================================    
// OUTGOING DELAY TIMER
//==============================================================================    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.sendDelayTimerListener = function () {
  this.sendDelayTimerRunning = false;
  if (this.messageQueue.length > 0) {
    this.flushMessageQueue();
  } else {
    // No messages in queue, so take no action.
  }
}
    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.stopSendDelayTimer = function () {
  this.sendDelayTimerRunning = false;
  if (this.sendDelayTimeoutID != -1) {
    clearTimeout(this.sendDelayTimeoutID);
  }
  this.sendDelayTimeoutID = -1;
}
    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.startSendDelayTimer = function () {
  this.stopSendDelayTimer();
  var currentObj = this;
  var callback   = this.sendDelayTimerListener;
  this.sendDelayTimerRunning = true;
  this.sendDelayTimeoutID = setTimeout(function () {
    callback.call(currentObj);
  }, this.sendDelay);
}
    
net.user1.orbiter.HTTPConnection.prototype.setSendDelay = function (milliseconds) {
  if (milliseconds > 0) {
    if ((milliseconds != this.sendDelay)) {
      this.sendDelay = milliseconds;
      this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Send delay set to: ["
                             + milliseconds + "]."); 
    }
    this.sendDelayTimerEnabled = true;
  } else if (milliseconds == -1) {
    this.orbiter.getLog().debug("[CONNECTION] " + toString() + " Send delay disabled.");
    this.sendDelayTimerEnabled = false;
    this.stopSendDelayTimer();
  } else {
    throw new Error("[CONNECTION]" + this.toString() + " Invalid send-delay specified: [" 
                    + milliseconds + "]."); 
  }
}
    
net.user1.orbiter.HTTPConnection.prototype.getSendDelay = function () {
  return this.sendDelay;
}

//==============================================================================    
// RETRY DELAY
//============================================================================== 
net.user1.orbiter.HTTPConnection.prototype.setRetryDelay = function (milliseconds) {
  if (milliseconds > -1) {
    if (milliseconds != this.retryDelay) {
      this.retryDelay = milliseconds;
      this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Retry delay set to: ["
                                  + milliseconds + "]."); 
    }
  } else {
    throw new Error("[CONNECTION]" + this.toString() + " Invalid retry delay specified: [" 
                    + milliseconds + "]."); 
  }
}

//==============================================================================    
// DATA SENDING AND QUEUING
//==============================================================================  
    
net.user1.orbiter.HTTPConnection.prototype.send = function (data) {
  // If the timer isn't running...
  if (!this.sendDelayTimerRunning) {
    // ...it is either disabled or expired. Either way, it's time to 
    // attempt to flush the queue.
    this.messageQueue.push(data);
    this.flushMessageQueue();
  } else {
    // The send-delay timer is running, so we can't send yet. Just queue the message.
    this.messageQueue.push(data);
  }
}
    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.flushMessageQueue = function () {
  if (!this.outgoingResponsePending) {
    this.openNewOutgoingRequest(this.messageQueue.join(""));
    this.messageQueue = new Array();
  } else {
    // AN OUTGOING RESPONSE IS STILL PENDING, SO DON'T SEND A NEW ONE
  }
}

//==============================================================================    
// HELLO REQUEST MANAGEMENT
//==============================================================================  

/** @private */
net.user1.orbiter.HTTPConnection.prototype.transmitHelloMessage = function (helloString) {
  this.dispatchSendData(helloString);
  this.helloResponsePending = true;
  this.doSendHello(helloString);
}    

/** @private */
net.user1.orbiter.HTTPConnection.prototype.helloCompleteListener = function (data) {
  if (this.disposed) return;
  
  if (this.helloResponsePending) {
    this.helloResponsePending = false;
    this.processIncomingData(data);
    
    // Don't immediately open a request in the complete handler due to Win IE bug
    var self = this;
    setTimeout(function () {
      self.openNewIncomingRequest();
    }, 0);
  } else {
    if (this.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED) {
      this.orbiter.getLog().error("[CONNECTION]" + toString() + " u66 (SERVER_HELLO) received, but client is not connected. Ignoring.");
    } else {
      this.orbiter.getLog().error("[CONNECTION]" + toString() + " Redundant u66 (SERVER_HELLO) received. Ignoring.");
    }
  }
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.helloErrorListener = function () {
  if (this.disposed) return;
  // There's already a retry scheduled
  if (this.retryHelloTimeoutID != -1) return;  
  // The connection attempt has been aborted
  if (this.connectionState != net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " u65 (CLIENT_HELLO) request failed."
                                + " Connection is no longer in progress, so no retry scheduled."); 
    return;
  }
  
  this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " u65 (CLIENT_HELLO) request failed."
                              + " Retrying in " +  this.retryDelay + "ms."); 
  
  // Retry
  var self = this;
  this.retryHelloTimeoutID = setTimeout(function () {
    self.retryHelloTimeoutID = -1;
    self.doRetryHello();
  }, this.retryDelay);
}

//==============================================================================    
// OUTGOING REQUEST MANAGEMENT
//==============================================================================

/** @private */
net.user1.orbiter.HTTPConnection.prototype.openNewOutgoingRequest = function (data) {
  this.dispatchSendData(data);
  this.outgoingResponsePending = true;
  this.doSendOutgoing(data);
  if (this.sendDelayTimerEnabled == true) {
    this.startSendDelayTimer();
  }
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.outgoingCompleteListener = function () {
  if (this.disposed) return;
  
  this.outgoingResponsePending = false;
  
  if (!this.sendDelayTimerRunning && this.messageQueue.length > 0) {
    // Don't immediately open a request in the complete handler due to Win IE bug
    var self = this;
    setTimeout(function () {
      self.flushMessageQueue();
    }, 0);
  }
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.outgoingErrorListener = function () {
  if (this.disposed) return;
  // There's already a retry scheduled
  if (this.retryOutgoingTimeoutID != -1) return;  
  // The connection has been closed
  if (this.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
      || this.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
    this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " Outgoing request failed."
                                + " Connection is closed, so no retry scheduled."); 
    return;
  } 
  
  this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " Outgoing request failed."
                              + " Retrying in " +  this.retryDelay + "ms.");  
      
  // Retry
  var self = this;
  this.retryOutgoingTimeoutID = setTimeout(function () {
    self.retryOutgoingTimeoutID = -1;
    if (self.disposed
        || self.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
        || self.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
      return;
    }
    self.doRetryOutgoing();
  }, this.retryDelay);
}

//==============================================================================    
// INCOMING REQUEST MANAGEMENT
//==============================================================================  

/** @private */
net.user1.orbiter.HTTPConnection.prototype.openNewIncomingRequest = function () {
  this.doSendIncoming();
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.incomingCompleteListener = function (data) {
  if (this.disposed
      || this.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
      || this.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
    // Incoming request complete, but connection is closed. Ignore content.
    return;
  }
  
  // Don't immediately open a request in the complete handler due to Win IE bug
  var self = this;
  setTimeout(function () {
    self.processIncomingData(data);
    // A message listener might have closed this connection in response to an incoming
    // message. Do not open a new incoming request unless the connection is still open.
    if (self.disposed
        || self.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
        || self.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
      return;
    }
    self.openNewIncomingRequest();
  }, 0);
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.incomingErrorListener = function () {
  if (this.disposed) return;
  // There's already a retry scheduled
  if (this.retryIncomingTimeoutID != -1) return;  
  // The connection has been closed
  if (this.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
      || this.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
    this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " Incoming request failed."
                                + " Connection is closed, so no retry scheduled."); 
    return;
  } 

  this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " Incoming request failed." 
                              + " Retrying in " +  this.retryDelay + "ms."); 
      
  // Retry
  var self = this;
  this.retryIncomingTimeoutID = setTimeout(function () {
    self.retryIncomingTimeoutID = -1;
    if (self.disposed
        || self.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
        || self.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
      return;
    }
    self.doRetryIncoming();
  }, this.retryDelay);
}
    
//==============================================================================    
// PROCESS DATA FROM THE SERVER
//==============================================================================
 
/** @private */
net.user1.orbiter.HTTPConnection.prototype.processIncomingData = function (data) {
  if (this.disposed) return;
  var listeners;
  
  this.dispatchReceiveData(data);
  
  var upcs = new Array();
  var upcEndTagIndex = data.indexOf("</U>");
  // Empty responses are valid.
  if (upcEndTagIndex == -1 && data.length > 0) {
    this.orbiter.getLog().error("Invalid message received. No UPC found: [" + data + "]");
    if (!this.isReady()) {
      // If invalid XML is received prior to achieving ready, then this
      // probably isn't a Union server, so disconnect.
      this.disconnect();
      return;
    }
  }
  
  while (upcEndTagIndex != -1) {
    upcs.push(data.substring(0, upcEndTagIndex+4));
    data = data.substring(upcEndTagIndex+4);
    upcEndTagIndex = data.indexOf("</U>");
  }
  for (var i = 0; i < upcs.length; i++) {
    this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.RECEIVE_UPC, upcs[i]));
  }
}

//==============================================================================    
// SERVER AFFINITY
//==============================================================================
/** @private */ 
net.user1.orbiter.HTTPConnection.prototype.applyAffinity = function (data) {
  net.user1.orbiter.Connection.prototype.applyAffinity.call(this);
  this.buildURL();
};

//==============================================================================    
// TOSTRING
//==============================================================================     
net.user1.orbiter.HTTPConnection.prototype.toString = function () {
  var s = "[" + this.connectionType + ", requested host: " + this.requestedHost 
          + ", host: " + (this.host == null ? "" : this.host) 
          + ", port: " + this.port 
          + ", send-delay: " + this.getSendDelay() + "]";
  return s;
}
    
// =============================================================================
// DISPOSAL
// =============================================================================
/** @private */ 
net.user1.orbiter.HTTPConnection.prototype.dispose = function () {
  this.doDispose();
  this.stopSendDelayTimer();
  net.user1.orbiter.Connection.prototype.dispose.call(this);
}
