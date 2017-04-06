//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/** @class
 *
 * <p>
 * The SecureWebSocketConnection class is identical to WebSocketConnection
 * except that it performs communications over WSS (i.e., an encrypted TLS or
 * SSL socket connection) rather than plain WebSocket.</p>
 *
 * For a list of events dispatched by SecureWebSocketConnection, see
 * {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.WebSocketConnection
 *
 * @see net.user1.orbiter.WebSocketConnection
 */
net.user1.orbiter.SecureWebSocketConnection = function (host, port) {
  // Invoke superclass constructor
  net.user1.orbiter.WebSocketConnection.call(this, host, port, net.user1.orbiter.ConnectionType.SECURE_WEBSOCKET);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.SecureWebSocketConnection, net.user1.orbiter.WebSocketConnection);
    
/** @private */
net.user1.orbiter.SecureWebSocketConnection.prototype.buildURL = function () {
  return "wss://" + this.host + ":" + this.port;
};