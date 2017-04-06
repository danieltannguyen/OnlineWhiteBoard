//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 *
 * <p>
 * The WebSocketConnection class is used by Orbiter to communicate with
 * Union Server over a persistent TCP/IP socket. Normally, developers need not
 * use the WebSocketConnection class directly, and should instead make connections
 * via the Orbiter class's connect() method. However, the
 * WebSocketConnection class is required for fine-grained connection configuration,
 * such as defining failover socket connections for multiple Union Servers
 * running at different host addresses.
 * </p>
 *
 * <p>
 * By default, Orbiter uses WebSocketConnection connections to communicate
 * with Union Server. WebSocketConnection connections offer faster response times than
 * HTTP connections, but occupy an operating-system-level socket continuously
 * for the duration of the connection. If a WebSocketConnection connection
 * cannot be established (due to, say, a restrictive firewall), Orbiter
 * automatically attempts to communicate using HTTP requests sent via an
 * HTTPDirectConnection or HTTPIFrameConnection. Developers can override
 * Orbiter's default connection failover system by manually configuring
 * connections using the ConnectionManager class and Orbiter's
 * disableHTTPFailover() method.</p>
 *
 * <p>
 * For secure WebSocket and HTTP communications, see SecureWebSocketConnection,
 * SecureHTTPDirectConnection, and SecureHTTPIFrameConnection.
 * </p>
 *
 * For a list of events dispatched by WebSocketConnection, see
 * WebSocketConnection's superclass, {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.Connection
 *
 * @see net.user1.orbiter.Orbiter#connect
 * @see net.user1.orbiter.Orbiter#secureConnect
 * @see net.user1.orbiter.SecureWebSocketConnection
 * @see net.user1.orbiter.SecureHTTPDirectConnection
 * @see net.user1.orbiter.SecureHTTPIFrameConnection
 */
net.user1.orbiter.WebSocketConnection = function (host, port, type) {
  // Invoke superclass constructor
  net.user1.orbiter.Connection.call(this, host, port, type || net.user1.orbiter.ConnectionType.WEBSOCKET);
  
  this.socket = null;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.WebSocketConnection, net.user1.orbiter.Connection);
    
//==============================================================================    
// SOCKET OBJECT MANAGEMENT
//==============================================================================
/** @private */     
net.user1.orbiter.WebSocketConnection.prototype.getNewSocket = function () {
  // Deactivate the old socket
  this.deactivateSocket(this.socket);
  
  // Create the new socket
  if (typeof MozWebSocket != "undefined") {
    // Firefox 6
    this.socket = new MozWebSocket(this.buildURL());
  } else {
    // Other browsers
    this.socket = new WebSocket(this.buildURL());
  }

  // Register for socket events
  var self = this;
  this.socket.onopen = function (e) {self.connectListener(e)};
  this.socket.onmessage = function (e) {self.dataListener(e)};
  this.socket.onclose = function (e) {self.closeListener(e)};
  this.socket.onerror = function (e) {self.ioErrorListener(e)};
};

/** @private */
net.user1.orbiter.WebSocketConnection.prototype.buildURL = function () {
  return "ws://" + this.host + ":" + this.port;
};

/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.deactivateSocket = function (oldSocket) {
  if (oldSocket == null) {
    return;
  }
  
  this.socket.onopen = null;
  this.socket.onmessage = null;
  this.socket.onclose = null;
  this.socket.onerror = null;
  
  try {
    oldSocket.close()
  } catch (e) {
    // Do nothing
  }
  
  this.socket = null;
};
    
//==============================================================================    
// CONNECTION AND DISCONNECTION
//==============================================================================    
  
net.user1.orbiter.WebSocketConnection.prototype.connect = function () {
  net.user1.orbiter.Connection.prototype.connect.call(this);
      
  // Attempt to connect
  try {
    this.getNewSocket();
  } catch (e) {
    // Socket could not be opened
    this.deactivateConnection();
    this.dispatchConnectFailure(e.toString());
  }
};

/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.deactivateConnection = function () {
  this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Deactivating...");
  this.connectionState = net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS;
  this.deactivateSocket(this.socket);
  net.user1.orbiter.Connection.prototype.deactivateConnection.call(this);
};    

//==============================================================================    
// SOCKET CONNECTION LISTENERS
//==============================================================================
/** @private */     
net.user1.orbiter.WebSocketConnection.prototype.connectListener = function (e) {
  if (this.disposed) return;
  
  this.orbiter.getLog().debug(this.toString() + " Socket connected.");
  this.beginReadyHandshake();
}
  
/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.closeListener = function (e) {
  if (this.disposed) return;
  
  var state = this.connectionState;
  this.deactivateConnection();
  
  if (state == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.dispatchConnectFailure("WebSocket onclose: Server closed connection before READY state was achieved.");
  } else {
    this.dispatchServerKillConnect();
  }
};

/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.ioErrorListener = function (e) {
  if (this.disposed) return;
  
  var state = this.connectionState;
  this.deactivateConnection();
  
  // Note: when Union closes the connection, Firefox 7 dispatches onerror, not 
  // onclose, so treat onerror like an onclose event
  if (state == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.dispatchConnectFailure("WebSocket onerror: Server closed connection before READY state was achieved.");
  } else {
    this.dispatchServerKillConnect();
  }
};

//==============================================================================    
// DATA RECEIVING AND SENDING
//==============================================================================  
/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.dataListener = function (dataEvent) {
  if (this.disposed) return;

  var data = dataEvent.data;
  this.dispatchReceiveData(data);

  if (data.indexOf("<U>") == 0) {
    this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(
                                      net.user1.orbiter.ConnectionEvent.RECEIVE_UPC, 
                                      data));
  } else {
    // The message isn't UPC. Must be an error...
    this.orbiter.getLog().error(this.toString() + " Received invalid message" 
                               + " (not UPC or malformed UPC): " + data);
  }
};

/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.send = function (data) {
  this.dispatchSendData(data);
  this.socket.send(data);
};
    
// =============================================================================
// DISPOSAL
// =============================================================================
/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.dispose = function () {
  net.user1.orbiter.Connection.prototype.dispose.call(this);
  this.deactivateSocket(this.socket);
};