//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.orbiter.MessageManager = function (log, connectionManager) {
  this.log = log;
  this.messageListeners = new Object();
  this.removeListenersOnDisconnect = true;
  this.numMessagesSent = 0;
  this.numMessagesReceived = 0;
  this.currentConnection = null;
  this.connectionManager = connectionManager;
  this.connectionManager.addEventListener(net.user1.orbiter.ConnectionManagerEvent.SELECT_CONNECTION,
                                          this.selectConnectionListener, this);
};

//==============================================================================
// INSTANCE METHODS
//==============================================================================
net.user1.orbiter.MessageManager.prototype.getNumMessagesReceived = function () {
  return this.numMessagesReceived;
}
  
net.user1.orbiter.MessageManager.prototype.getNumMessagesSent = function () {
  return this.numMessagesSent;
}
  
net.user1.orbiter.MessageManager.prototype.getTotalMessages = function () {
  return this.numMessagesSent + this.numMessagesReceived;
}
  
/** @private */
net.user1.orbiter.MessageManager.prototype.selectConnectionListener = function (e) {
  if (this.currentConnection != null) {
    this.currentConnection.removeEventListener(net.user1.orbiter.ConnectionEvent.RECEIVE_UPC, 
                                          this.upcReceivedListener, this);
    this.currentConnection.removeEventListener(net.user1.orbiter.ConnectionEvent.DISCONNECT,
                                          this.disconnectListener, this);
    this.currentConnection.removeEventListener(net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE,
                                          this.connectFailureListener, this);
  }

  this.currentConnection = e.getConnection(); 

  this.currentConnection.addEventListener(net.user1.orbiter.ConnectionEvent.RECEIVE_UPC, 
                                        this.upcReceivedListener, this);
  this.currentConnection.addEventListener(net.user1.orbiter.ConnectionEvent.DISCONNECT,
                                        this.disconnectListener, this);
  this.currentConnection.addEventListener(net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE,
                                        this.connectFailureListener, this);
}
  
/** @private */
net.user1.orbiter.MessageManager.prototype.disconnectListener = function (e) {
  this.cleanupAfterClosedConnection(e.target);
}
    
/** @private */
net.user1.orbiter.MessageManager.prototype.connectFailureListener = function (e) {
  this.cleanupAfterClosedConnection(e.target);
}
    
/** @private */
net.user1.orbiter.MessageManager.prototype.cleanupAfterClosedConnection = function (connection) {
  var listenerList;
  if (this.removeListenersOnDisconnect) {
    this.log.info("[MESSAGE_MANAGER] Removing registered message listeners.");
    for (var message in this.messageListeners) {
      listenerList = this.messageListeners[message];
      for (var p in listenerList) {
        this.removeMessageListener(message, listenerList[p].getListenerFunction());
      } 
    }
  } else {
    this.log.warn("[MESSAGE_MANAGER] Leaving message listeners registered. \n"
      + "Be sure to remove any unwanted message listeners manually.");
  }
  
  this.numMessagesReceived = 0;
  this.numMessagesSent = 0;
}
  
net.user1.orbiter.MessageManager.prototype.sendUPC = function (message) {
  // Quit if the connection isn't ready...
  if (!this.connectionManager.isReady()) {
    this.log.warn("[MESSAGE_MANAGER] Connection not ready. UPC not sent. Message: " 
    + message);
    return;
  }

  // Build the UPC to send.
  var theUPC = "<U><M>" + message + "</M>";
  var a;
  
  if (arguments.length > 1) {
    theUPC += "<L>";
    for (var i = 1; i < arguments.length; i++) {
      a = arguments[i];
      a = a == undefined ? "" : a.toString();
      // Wrap any non-filter argument that contains a start tag ("<") in CDATA
      if (a.indexOf("<") != -1) {
        if (a.indexOf('<f t=') != 0) {
          a = "<![CDATA[" + a + "]]>";
        }
      }
      theUPC += "<A>" + a + "</A>";
    }
    theUPC += "</L>";
  }
  theUPC += "</U>";

  // Count the message
  this.numMessagesSent++;
  
  // Send the UPC to the server
  this.log.debug("[MESSAGE_MANAGER] UPC sent: " + theUPC);
  this.connectionManager.getActiveConnection().send(theUPC);
};

/** @private */
net.user1.orbiter.MessageManager.prototype.sendUPCObject = function (upc) {
  var args = upc.args.slice();
  args.unshift(upc.method);
  this.sendUPC.apply(this, args);
};

/** @private */
net.user1.orbiter.MessageManager.prototype.upcReceivedListener = function (e) {
  this.numMessagesReceived++;
  
  var upc = e.getUPC();
  this.log.debug("[MESSAGE_MANAGER] UPC received: " + upc );
  
  var method;
  var upcArgs = new Array();
  
  var closeMTagIndex = upc.indexOf("</M>");
  method = upc.substring(6, closeMTagIndex);
  
  var searchBeginIndex = upc.indexOf("<A>", closeMTagIndex);
  var closeATagIndex;
  var arg;
  while (searchBeginIndex != -1) {
    closeATagIndex = upc.indexOf("</A>", searchBeginIndex);
    arg = upc.substring(searchBeginIndex+3, closeATagIndex);
    if (arg.indexOf("<![CDATA[") == 0) {
      arg = arg.substr(9, arg.length-12);
    }
    upcArgs.push(arg);
    searchBeginIndex = upc.indexOf("<A>", closeATagIndex);
  }     
  
  this.notifyMessageListeners(method, upcArgs);
};

net.user1.orbiter.MessageManager.prototype.addMessageListener = function (message, 
                                                                          listener,
                                                                          thisArg,
                                                                          forRoomIDs) {
  if (forRoomIDs != null) {
    var typeString = Object.prototype.toString.call(forRoomIDs);
    if (typeString != "[object Array]") {
      throw new Error("[MESSAGE_MANAGER] Illegal argument type " + typeString
                      + " supplied for addMessageListener()'s forRoomIDs"
                      + " parameter. Value must be an Array.");
    }
  }
  
  // Each message gets a list of MessageListener objects. 
  // If this message has no such list, make one.
  if (this.messageListeners[message] === undefined) {
    this.messageListeners[message] = new Array();
  } 
  var listenerArray = this.messageListeners[message];
  
  // Quit if the listener is already registered
  if (this.hasMessageListener(message, listener)) {
    return false;
  }
  
  // Add the listener
  var newListener = new net.user1.orbiter.MessageListener(listener,
                                            forRoomIDs === undefined ? null : forRoomIDs,
                                            thisArg);
  listenerArray.push(newListener);
  return true;      
};

net.user1.orbiter.MessageManager.prototype.removeMessageListener = function (message,
                                                           listener) {
  // Quit if the message has no listeners
  var listenerArray = this.messageListeners[message];
  if (listenerArray == null) {
    return false;
  } 
  
  // Remove the listener
  var foundListener;
  for (var i = 0; i < listenerArray.length; i++) {
    if (listenerArray[i].getListenerFunction() == listener) {
      foundListener = true;
      listenerArray.splice(i, 1);
      break;
    }
  }
  
  // Delete the listeners array if it's now empty
  if (listenerArray.length == 0) {
    delete this.messageListeners[message];
  }
  
  return foundListener;      
};
    
net.user1.orbiter.MessageManager.prototype.hasMessageListener = function (message, 
                                                        listener) {
  // Quit if the message has no listeners
  var listenerArray = this.messageListeners[message];
  if (listenerArray == null) {
    return false;
  } 
      
   // Check for the listener
  for (var i = 0; i < listenerArray.length; i++) {
    if (listenerArray[i].getListenerFunction() 
      == listener) {
      return true;
    }
  }
  return false;
};
    
net.user1.orbiter.MessageManager.prototype.getMessageListeners = function (message) {
  return this.messageListeners[message] != undefined ? this.messageListeners[message] : [];
};

/** @private */
net.user1.orbiter.MessageManager.prototype.notifyMessageListeners = function (message, args) {
  // Retrieve the list of listeners for this message.
  var listeners = this.messageListeners[message];
  // If there are no listeners registered, then quit
  if (listeners === undefined) {
    // Log a warning if it's not a UPC
    if (!(message.charAt(0) == "u" && parseInt(message.substring(1)) > 1)) {
      this.log.warn("Message delivery failed. No listeners found. Message: " + 
               message + ". Arguments: " + args.join());
    }
    return;
  } else {
    listeners = listeners.slice(0);    
  }
  var numListeners = listeners.length; 
  for (var i = 0; i < numListeners; i++) {
    listeners[i].getListenerFunction().apply(listeners[i].getThisArg(), args);
  }
};

net.user1.orbiter.MessageManager.prototype.dispose = function () {
  this.log.info("[MESSAGE_MANAGER] Disposing resources.");
  this.log = null;
  this.orbiter = null;
  this.messageListeners = null;
  this.numMessagesSent = 0;
  this.numMessagesReceived = 0;
  this.currentConnection = null;
}
  
net.user1.orbiter.MessageManager.prototype.toString = function () {
  return "[object MessageManager]";
};

