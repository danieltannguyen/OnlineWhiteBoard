//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/** @class
 * <p>
 * The SecureHTTPDirectConnection class is identical to HTTPDirectConnection
 * except that it performs communications over HTTPS (i.e., an encrypted TLS or
 * SSL connection) rather than plain HTTP.</p>
 *
 * For a list of events dispatched by SecureHTTPDirectConnection, see
 * {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.HTTPDirectConnection
 *
 * @see net.user1.orbiter.HTTPDirectConnection
 */
net.user1.orbiter.SecureHTTPDirectConnection = function (host, port) {
  // Invoke superclass constructor
  net.user1.orbiter.HTTPDirectConnection.call(this, host, port, net.user1.orbiter.ConnectionType.SECURE_HTTP);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.SecureHTTPDirectConnection, net.user1.orbiter.HTTPDirectConnection);

/** @private */
net.user1.orbiter.SecureHTTPDirectConnection.prototype.buildURL = function () {
  this.url = "https://" + this.host + ":" + this.port;
};

//==============================================================================
// TOSTRING
//==============================================================================
net.user1.orbiter.SecureHTTPDirectConnection.prototype.toString = function () {
  var s = "[SecureHTTPDirectConnection, requested host: " + this.requestedHost
          + ", host: " + (this.host == null ? "" : this.host)
          + ", port: " + this.port
          + ", send-delay: " + this.getSendDelay() + "]";
  return s;
};