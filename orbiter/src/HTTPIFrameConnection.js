//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 *
 * The HTTPIFrameConnection class is used by Orbiter to communicate with
 * Union Server over HTTP in browsers that do not support CORS.
 * Rather than using CORS, HTTPIFrameConnection bypasses cross-origin restrictions
 * by proxying communications through a hidden HTML iframe.
 *
 * For a list of events dispatched by HTTPDirectConnection,
 * {@link net.user1.orbiter.Connection}.
 *
 * For more information on HTTP communication with Union Server, see
 * the HTTPDirectConnection class.
 *
 * @extends net.user1.orbiter.HTTPConnection
 *
 * @see net.user1.orbiter.HTTPDirectConnection
 * @see net.user1.orbiter.WebSocketConnection
 * @see net.user1.orbiter.SecureHTTPDirectConnection
 * @see net.user1.orbiter.SecureHTTPIFrameConnection
 * @see net.user1.orbiter.SecureWebSocketConnection
 */
net.user1.orbiter.HTTPIFrameConnection = function (host, port, type) {
  // Invoke superclass constructor
  net.user1.orbiter.HTTPConnection.call(this, host, port, type || net.user1.orbiter.ConnectionType.HTTP);
  this.postMessageInited = false;
  this.iFrameReady = false;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.HTTPIFrameConnection, net.user1.orbiter.HTTPConnection);

//==============================================================================    
// POSTMESSAGE INITIALIZATION
//==============================================================================   
/** @private */ 
net.user1.orbiter.HTTPIFrameConnection.prototype.initPostMessage = function () {
  if (this.postMessageInited) {
    throw new Error("[HTTPIFrameConnection] Illegal duplicate initialization attempt.");
  }
  var self = this;
  var win = this.orbiter.window;
  var errorMsg = null;
  
  if (win == null) {
    errorMsg = "[HTTPIFrameConnection] Unable to create connection." 
               + " No window object found.";
  } else {
    if (typeof win.addEventListener != "undefined") {
      // ...the standard way 
      win.addEventListener("message", postMessageListener, false);
    } else if (typeof win.attachEvent != "undefined") {
      // ...the IE-specific way 
      win.attachEvent("onmessage", postMessageListener);
    } else {
      errorMsg = "[HTTPIFrameConnection] Unable to create connection."
               + " No event listener registration method found on window object.";
    }
  }
  
  if (errorMsg != null) {
    this.orbiter.getLog().error(errorMsg);
    throw new Error(errorMsg);
  }

  /** @private */
  function postMessageListener (e) {
    // The connection's host might have been reassigned (normally to an ip) due
    // to server affinity in a clustered deployment, so allow for posts from both the
    // requestedHost and the host.
    if (e.origin.indexOf("//" + self.host + (self.port == 80 ? "" : (":" + self.port))) == -1
        && e.origin.indexOf("//" + self.requestedHost + (self.port == 80 ? "" : (":" + self.port))) == -1) {
      self.orbiter.getLog().error("[CONNECTION] " + self.toString()
        + " Ignored message from unknown origin: " + e.origin);
      return;
    }
    
    self.processPostMessage(e.data);
  }
  
  this.postMessageInited = true;
};

//==============================================================================    
// IFRAME MANAGEMENT
//==============================================================================    
/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.makeIFrame = function () {
  if (typeof this.orbiter.window.document == "undefined") {
    var errorMsg = "[HTTPIFrameConnection] Unable to create connection."
                 + " No document object found.";
    this.orbiter.getLog().error(errorMsg);
    throw new Error(errorMsg);
  }
  var doc = this.orbiter.window.document;
  
  this.iFrameReady = false;
  if (this.iframe != null) {
    this.postToIFrame("dispose");
    doc.body.removeChild(this.iframe);
  }
  this.iframe = doc.createElement('iframe');
  this.iframe.width = "0px";
  this.iframe.height = "0px";
  this.iframe.border = "0px";
  this.iframe.frameBorder = "0";
  this.iframe.style.visibility = "hidden";
  this.iframe.style.display = "none";
  this.iframe.src = this.url + "/orbiter";
  doc.body.appendChild(this.iframe);
}

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.onIFrameReady = function () {
  this.beginReadyHandshake();
}

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.postToIFrame = function (cmd, data) {
  if (this.iframe && this.iFrameReady) {
    data = data == undefined ? "" : data;
    // In order to post to the iframe, the targetOrigin must match the iframe's origin
    this.iframe.contentWindow.postMessage(cmd + "," + data, this.iframe.contentWindow.location.href);
  }  
}

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.processPostMessage = function (postedData) {
  var delimiterIndex = postedData.indexOf(",");
  var cmd  = postedData.substring(0, delimiterIndex);
  var data = postedData.substring(delimiterIndex+1);
  
  switch (cmd) {
    case"ready":
      this.iFrameReady = true;
      this.onIFrameReady();
      break;
      
    case "hellocomplete":
      this.helloCompleteListener(data);
      break;
    
    case "helloerror":
      this.helloErrorListener();
      break;
    
    case "outgoingcomplete":
      this.outgoingCompleteListener();
      break;
    
    case "outgoingerror":
      this.outgoingErrorListener();
      break;
    
    case "incomingcomplete":
      this.incomingCompleteListener(data);
      break;
    
    case "incomingerror":
      this.incomingErrorListener();
      break;
  }
}

//==============================================================================    
// CONNECTION AND DISCONNECTION
//==============================================================================    
net.user1.orbiter.HTTPIFrameConnection.prototype.connect = function () {
  if (!this.postMessageInited) {
    this.initPostMessage();
  }
  
  net.user1.orbiter.HTTPConnection.prototype.connect.call(this);
  this.makeIFrame();
};

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doRequestDeactivation = function() {
  this.postToIFrame("deactivate");
};

//==============================================================================    
// UPC LISTENERS (IFRAME-SPECIFIC IMPLEMENTATION)
//==============================================================================

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.u66 = function (serverVersion, 
                                                           sessionID, 
                                                           upcVersion, 
                                                           protocolCompatible) {
  net.user1.orbiter.Connection.prototype.u66.call(this,
                                                  serverVersion,
                                                  sessionID,
                                                  upcVersion,
                                                  protocolCompatible);
  if (this.iframe != null) {
    this.postToIFrame("sessionid", sessionID);
  }
}

//==============================================================================    
// HELLO REQUEST MANAGEMENT
//==============================================================================  

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doSendHello = function (helloString) {
  this.postToIFrame("sendhello", helloString);
};

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doRetryHello = function () {
  this.postToIFrame("retryhello");
}

//==============================================================================    
// OUTGOING REQUEST MANAGEMENT
//==============================================================================

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doSendOutgoing = function (data) {
  this.postToIFrame("sendoutgoing", data);
};

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doRetryOutgoing = function () {
  this.postToIFrame("retryoutgoing");
};

//==============================================================================    
// INCOMING REQUEST MANAGEMENT
//==============================================================================  

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doSendIncoming = function () {
  this.postToIFrame("sendincoming");
};

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doRetryIncoming = function () {
  this.postToIFrame("retryincoming");
};
    
//==============================================================================    
// TOSTRING
//==============================================================================     
net.user1.orbiter.HTTPIFrameConnection.prototype.toString = function () {
  var s = "[HTTPIFrameConnection, requested host: " + this.requestedHost 
          + ", host: " + (this.host == null ? "" : this.host) 
          + ", port: " + this.port 
          + ", send-delay: " + this.getSendDelay() + "]";
  return s;
};
    
//==============================================================================
// DISPOSAL
//==============================================================================
/** @private */ 
net.user1.orbiter.HTTPIFrameConnection.prototype.doDispose = function () {
  this.postToIFrame("dispose");
};
