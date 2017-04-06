//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 * <p>
 * The HTTPDirectConnection class is used by Orbiter to communicate with
 * Union Server over HTTP; it uses CORS to bypass cross-origin restrictions
 * when Union Server is hosted on a domain that does not match the domain at
 * which the Orbiter client is hosted. Normally, developers need not use the
 * HTTPDirectConnection class directly, and should instead make connections
 * via the Orbiter class's connect() method. However, the
 * HTTPDirectConnection class is required for fine-grained connection configuration,
 * such as defining failover connections for multiple Union Servers
 * running at different host addresses.
 * </p>
 *
 * <p>
 * By default, Orbiter uses the WebSocketConnection class, not the
 * HTTPDirectConnection class, to communicate with Union Server. The
 * HTTPDirectConnection class is used as a backup connection
 * when the primary WebSocketConnection connection is blocked by a firewall.
 * However, on a very heavily loaded server with limited persistent socket
 * connections available, communicating with Union Server over HTTP--which uses
 * short-lived socket connections--can improve performance at the
 * expense of realtime responsiveness. To reduce server load when communicating
 * over HTTP, use HTTPDirectConnection's setSendDelay() method to decrease the
 * frequency of Orbiter's requests for updates from Union Server. Developers
 * that wish to use HTTP connections as the primary form of communication with
 * Union Server must do so by manually configuring connections via the
 * ConnectionManager class's addConnection() method.</p>
 *
 * <p>
 * In environments that do not support CORS (such as IE8 on Windows), Orbiter
 * conducts HTTP communications using HTTPIFrameConnection instead of HTTPDirectConnection.
 * </p>
 *
 * <p>
 * For secure HTTP and WebSocket communications, see SecureHTTPDirectConnection,
 * SecureHTTPIFrameConnection, and SecureWebSocketConnection.
 * </p>
 *
 *
 * For a list of events dispatched by HTTPDirectConnection,
 * {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.HTTPConnection
 *
 * @see net.user1.orbiter.Orbiter#connect
 * @see net.user1.orbiter.Orbiter#secureConnect
 *
 * @see net.user1.orbiter.SecureHTTPDirectConnection
 * @see net.user1.orbiter.SecureHTTPIFrameConnection
 * @see net.user1.orbiter.SecureWebSocketConnection
 */
net.user1.orbiter.HTTPDirectConnection = function (host, port, type) {
  // Invoke superclass constructor
  net.user1.orbiter.HTTPConnection.call(this, host, port, type || net.user1.orbiter.ConnectionType.HTTP);
  
  this.outgoingRequestID = 0;
  this.incomingRequestID = 0;
  
  this.lastOutgoingPostData = null;
  this.lastIncomingPostData = null;
  this.lastHelloPostData    = null;
  
  this.pendingRequests = [];
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.HTTPDirectConnection, net.user1.orbiter.HTTPConnection);


//==============================================================================    
// CONNECTION AND DISCONNECTION
//==============================================================================    
net.user1.orbiter.HTTPDirectConnection.prototype.connect = function () {
  net.user1.orbiter.HTTPConnection.prototype.connect.call(this);
  this.beginReadyHandshake();
};

//==============================================================================    
// HELLO REQUEST MANAGEMENT
//==============================================================================  

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doSendHello = function (helloString) {
  this.newHelloRequest(helloString);
};

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doRetryHello = function () {
  this.retryHello();
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.newHelloRequest = function (data) {
  this.lastHelloPostData = this.createHelloPostData(encodeURIComponent(data));
  this.transmitRequest(this.lastHelloPostData, 
                       net.user1.orbiter.HTTPDirectConnection.helloRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.helloRequestErrorListener);
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.createHelloPostData = function (data) {
  return "mode=d" + "&data=" + data;
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.retryHello = function () {
  this.transmitRequest(this.lastHelloPostData, 
                       net.user1.orbiter.HTTPDirectConnection.helloRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.helloRequestErrorListener);
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.helloRequestReadystatechangeListener = function (xhr, connection) {
  if (xhr.readyState == 4) {
    connection.removePendingRequest(xhr);
    if (xhr.status >= 200 && xhr.status <= 299) {
      connection.helloCompleteListener(xhr.responseText);
    } else {
      connection.helloErrorListener();
    }
  }
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.helloRequestErrorListener = function (xhr, connection) {
  connection.removePendingRequest(xhr);
  connection.helloErrorListener();
}

//==============================================================================    
// OUTGOING REQUEST MANAGEMENT
//==============================================================================

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doSendOutgoing = function (data) {
  this.newOutgoingRequest(data);
};

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doRetryOutgoing = function () {
  this.retryOutgoing();
};

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.newOutgoingRequest = function (data) {
  this.lastOutgoingPostData = this.createOutgoingPostData(encodeURIComponent(data));
  this.transmitRequest(this.lastOutgoingPostData, 
                       net.user1.orbiter.HTTPDirectConnection.outgoingRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.outgoingRequestErrorListener);
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.createOutgoingPostData = function (data) {
  this.outgoingRequestID++;
  return "rid=" + this.outgoingRequestID + "&sid=" + this.orbiter.getSessionID() + "&mode=s" + "&data=" + data;
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.retryOutgoing = function () {
  this.transmitRequest(this.lastOutgoingPostData, 
                       net.user1.orbiter.HTTPDirectConnection.outgoingRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.outgoingRequestErrorListener);
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.outgoingRequestReadystatechangeListener = function (xhr, connection) {
  if (xhr.readyState == 4) {
    connection.removePendingRequest(xhr);
    if (xhr.status >= 200 && xhr.status <= 299) {
      connection.outgoingCompleteListener();
    } else {
      connection.outgoingErrorListener();
    }
  }
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.outgoingRequestErrorListener = function (xhr, connection) {
  connection.removePendingRequest(xhr);
  connection.outgoingErrorListener();
}

//==============================================================================    
// INCOMING REQUEST MANAGEMENT
//==============================================================================  

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doSendIncoming = function () {
  this.newIncomingRequest();
};

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doRetryIncoming = function () {
  this.retryIncoming();
};

/** @private */ 
net.user1.orbiter.HTTPDirectConnection.prototype.newIncomingRequest = function () {
  this.lastIncomingPostData = this.createIncomingPostData();
  this.transmitRequest(this.lastIncomingPostData,
                       net.user1.orbiter.HTTPDirectConnection.incomingRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.incomingRequestErrorListener);
}

/** @private */ 
net.user1.orbiter.HTTPDirectConnection.prototype.createIncomingPostData = function () {
  this.incomingRequestID++;
  return "rid=" + this.incomingRequestID + "&sid=" + this.orbiter.getSessionID() + "&mode=c";
}

/** @private */ 
net.user1.orbiter.HTTPDirectConnection.prototype.retryIncoming = function () {
  this.transmitRequest(this.lastIncomingPostData,
                       net.user1.orbiter.HTTPDirectConnection.incomingRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.incomingRequestErrorListener);
}

/** @private */ 
net.user1.orbiter.HTTPDirectConnection.incomingRequestReadystatechangeListener = function (xhr, connection) {
  if (xhr.readyState == 4) {
    connection.removePendingRequest(xhr);
    if (xhr.status >= 200 && xhr.status <= 299) {
      connection.incomingCompleteListener(xhr.responseText);
    } else {
      connection.incomingErrorListener();
    }
  }
}

/** @private */ 
net.user1.orbiter.HTTPDirectConnection.incomingRequestErrorListener = function (xhr, connection) {
  connection.removePendingRequest(xhr);
  connection.incomingErrorListener();
}

//==============================================================================
// XHR MANAGEMENT
//==============================================================================
/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.transmitRequest = function (data, 
                                                      readystatechangeListener, 
                                                      errorListener) {
  var self = this;
  var request;
  
  if (typeof XDomainRequest != "undefined") {
    // IE
    request = new XDomainRequest();
    request.onload = function () {
      request.readyState = 4;  // Emulate standards-based API
      request.status = 200;
      readystatechangeListener(this, self)
    };
    request.onerror = function () {
      errorListener(this, self);
    };
    request.ontimeout = function () {
      errorListener(this, self);
    };
    request.onprogress = function () {}; // Do nothing (required)
  } else {
    // All other standards-based browsers
    var request = new XMLHttpRequest();
    this.pendingRequests.push(request);
    request.onreadystatechange = function () {
      readystatechangeListener(this, self);
    };
    request.onerror = function () {
      errorListener(this, self);
    };
  }
  // Call open before setting header
  request.open("POST", this.url);
  // Standards-based browsers (IE doesn't allow the setting of headers)
  if (typeof request.setRequestHeader != "undefined") {
    request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
  }
  request.send(data);
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.removePendingRequest = function (request) {
  for (var i = this.pendingRequests.length; --i >= 0; ) {
    if (this.pendingRequests[i] === request) {
      this.pendingRequests.splice(i, 1);
    }
  }
}

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doRequestDeactivation = function () {
  for (var i = this.pendingRequests.length; --i >= 0;) {
    try {
      this.pendingRequests[i].abort();
    } catch (e) {
      // Do nothing
    }
  }
  this.pendingRequests = [];
}
    
//==============================================================================    
// TOSTRING
//==============================================================================     
net.user1.orbiter.HTTPDirectConnection.prototype.toString = function () {
  var s = "[HTTPDirectConnection, requested host: " + this.requestedHost 
          + ", host: " + (this.host == null ? "" : this.host) 
          + ", port: " + this.port 
          + ", send-delay: " + this.getSendDelay() + "]";
  return s;
};
    
//==============================================================================
// DISPOSAL
//==============================================================================
/** @private */ 
net.user1.orbiter.HTTPDirectConnection.prototype.doDispose = function () {
  this.deactivateHTTPRequests();
};
