//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.ConnectionEvent = function (type, upc, data, connection, status) {
  net.user1.events.Event.call(this, type);
  
  this.upc = upc;
  this.data = data;
  this.connection = connection
  this.status = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.ConnectionEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.ConnectionEvent.BEGIN_CONNECT = "BEGIN_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionEvent.BEGIN_HANDSHAKE = "BEGIN_HANDSHAKE";
/** @constant */
net.user1.orbiter.ConnectionEvent.READY = "READY";
/** @constant */
net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE = "CONNECT_FAILURE";
/** @constant */
net.user1.orbiter.ConnectionEvent.CLIENT_KILL_CONNECT = "CLIENT_KILL_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionEvent.SERVER_KILL_CONNECT = "SERVER_KILL_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionEvent.DISCONNECT = "DISCONNECT";
/** @constant */
net.user1.orbiter.ConnectionEvent.RECEIVE_UPC = "RECEIVE_UPC";
/** @constant */
net.user1.orbiter.ConnectionEvent.SEND_DATA = "SEND_DATA";
/** @constant */
net.user1.orbiter.ConnectionEvent.RECEIVE_DATA = "RECEIVE_DATA";
/** @constant */
net.user1.orbiter.ConnectionEvent.SESSION_TERMINATED = "SESSION_TERMINATED";
/** @constant */
net.user1.orbiter.ConnectionEvent.SESSION_NOT_FOUND = "SESSION_NOT_FOUND";
  
//==============================================================================
// INSTANCE METHODS
//==============================================================================

net.user1.orbiter.ConnectionEvent.prototype.getUPC = function () {
  return this.upc;
}

net.user1.orbiter.ConnectionEvent.prototype.getData = function () {
  return this.data;
}

net.user1.orbiter.ConnectionEvent.prototype.getStatus = function () {
  return this.status;
}

net.user1.orbiter.ConnectionEvent.prototype.toString = function () {
  return "[object ConnectionEvent]";
}  

