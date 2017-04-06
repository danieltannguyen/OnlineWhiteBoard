//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.orbiter.System = function (window) {
  this.window = window;
  this.clientType     = net.user1.orbiter.Product.clientType;
  this.clientVersion  = net.user1.orbiter.Product.clientVersion;
  this.upcVersion     = net.user1.orbiter.Product.upcVersion;
}

//==============================================================================
// INSTANCE METHODS
//==============================================================================  
net.user1.orbiter.System.prototype.getClientType = function () {
  return this.clientType;
}

/** @returns net.user1.orbiter.VersionNumber */
net.user1.orbiter.System.prototype.getClientVersion = function () {
  return this.clientVersion;
}
    
/** @returns net.user1.orbiter.VersionNumber */
net.user1.orbiter.System.prototype.getUPCVersion = function () {
  return this.upcVersion;
}
    
/** @returns Boolean */
net.user1.orbiter.System.prototype.isJavaScriptCompatible = function () {
  // Assume non-browser environments can do cross-origin XMLHttpRequests
  if (this.window == null && typeof XMLHttpRequest != "undefined") {
    return true;
  }
  
  if (this.window != null) {
    // Standards-based browsers that support cross-origin requests
    if (typeof XMLHttpRequest != "undefined" 
        && typeof new XMLHttpRequest().withCredentials != "undefined") {
        return true;
    }
  
    // Versions of IE that support proprietary cross-origin requests
    if (typeof XDomainRequest != "undefined" 
        && this.window.location.protocol != "file:") {
      return true;
    }

    // Browsers that can communicate between windows
    if (this.window.postMessage != null) {
      return true;
    }
  }
  
  // This environment has no way to connect to Union Server
  return false;
}

/** 
 * <p>
 * Returns true if the host environment supports direct cross-origin HTTP
 * requests using CORS (see: <a href="http://www.w3.org/TR/cors/">http://www.w3.org/TR/cors/</a>).
 * When hasHTTPDirectConnection() returns true, then Orbiter can safely use
 * the HTTPDirectConnection class to communicate with Union Server over HTTP. When
 * hasHTTPDirectConnection() returns false, Orbiter cannot use
 * HTTPDirectConnection, and must instead use the HTTPIFrameConnection class to
 * communicate with Union Server over HTTP. 
 * </p>
 * 
 * <p>
 * Note that Orbiter applications that use Orbiter's connect() or setServer()
 * methods to connect to Union Server do not need to perform a capabilities check
 * via hasHTTPDirectConnection(). The connect() and setServer() methods check
 * the host environment's capabilities automatically, and choose the appropriate
 * connection type for the environment. The hasHTTPDirectConnection() method is 
 * required in one situation only: when the application explicitly wishes to 
 * communicate over HTTP without trying a WebSocket connection first.
 * </p>
 * 
 * @returns Boolean 
 * 
 * @see net.user1.orbiter.HTTPDirectConnection
 * @see net.user1.orbiter.HTTPIFrameConnection
 * @see net.user1.orbiter.Orbiter#connect
 * @see net.user1.orbiter.Orbiter#setServer
 **/
net.user1.orbiter.System.prototype.hasHTTPDirectConnection = function() {
  // -If XHR has a "withCredentials" flag then CORS is supported.
  // -In IE, if XDomainRequest is available, and the file wasn't loaded 
  //    locally, then CORS is supported
  // -In non-browser environments, assume cross-origin XMLHttpRequests are allowed
  if ((typeof XMLHttpRequest != "undefined" && typeof new XMLHttpRequest().withCredentials != "undefined")
       || (typeof XDomainRequest != "undefined" && this.window != null && this.window.location.protocol != "file:")
       || (this.window == null && typeof XMLHttpRequest != "undefined")) {
    return true;
  } else {
    return false;
  }
}

/** 
 * <p>
 * Returns true if the host environment supports WebSocket connections.
 * When hasWebSocket() returns true, then Orbiter can safely use
 * the WebSocketConnection class to communicate with Union Server over a 
 * persistent TCP/IP socket. When hasWebSocket() returns false, Orbiter cannot use
 * WebSocketConnection, and must instead use HTTP communications (via either the
 * HTTPDirectConnection class or the HTTPIFrameConnection class). 
 * </p>
 * 
 * <p>
 * Note that Orbiter applications that use Orbiter's connect() or setServer()
 * methods to connect to Union Server do not need to perform a capabilities check
 * via hasWebSocket(). The connect() and setServer() methods check
 * the host environment's capabilities automatically, and choose the appropriate
 * connection type for the environment. The hasWebSocket() method is 
 * required in one situation only: when the application explicitly wishes to 
 * determine whether WebSocket is supported for the purpose of application flow
 * or user feedback.
 * </p>
 * 
 * @returns Boolean 
 * 
 * @see net.user1.orbiter.WebSocketConnection
 * @see net.user1.orbiter.Orbiter#connect
 **/
net.user1.orbiter.System.prototype.hasWebSocket = function() {
  return (typeof WebSocket !== "undefined" || typeof MozWebSocket !== "undefined");
}

net.user1.orbiter.System.prototype.toString = function () {
  return "[object System]";
}  