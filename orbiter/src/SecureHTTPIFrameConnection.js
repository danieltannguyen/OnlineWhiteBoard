//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 *
 * <p>
 * The SecureHTTPIFrameConnection class is identical to HTTPIFrameConnection
 * except that it performs communications over HTTPS (i.e., an encrypted TLS or
 * SSL connection) rather than plain HTTP.</p>
 *
 * For a list of events dispatched by SecureHTTPIFrameConnection,
 * see {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.HTTPIFrameConnection
 *
 * @see net.user1.orbiter.HTTPIFrameConnection
 */
net.user1.orbiter.SecureHTTPIFrameConnection = function (host, port) {
  // Invoke superclass constructor
  net.user1.orbiter.HTTPIFrameConnection.call(this, host, port, net.user1.orbiter.ConnectionType.SECURE_HTTP);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.SecureHTTPIFrameConnection, net.user1.orbiter.HTTPIFrameConnection);

/** @private */
net.user1.orbiter.SecureHTTPIFrameConnection.prototype.buildURL = function () {
  this.url = "https://" + this.host + ":" + this.port;
};

//==============================================================================
// TOSTRING
//==============================================================================
net.user1.orbiter.SecureHTTPIFrameConnection.prototype.toString = function () {
  var s = "[SecureHTTPIFrameConnection, requested host: " + this.requestedHost
          + ", host: " + (this.host == null ? "" : this.host)
          + ", port: " + this.port
          + ", send-delay: " + this.getSendDelay() + "]";
  return s;
};