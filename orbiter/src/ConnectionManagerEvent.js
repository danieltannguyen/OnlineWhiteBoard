//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.ConnectionManagerEvent = function (type, connection, status) {
  net.user1.events.Event.call(this, type);
  
  this.connection = connection
  this.status = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.ConnectionManagerEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.ConnectionManagerEvent.BEGIN_CONNECT = "BEGIN_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.SELECT_CONNECTION = "SELECT_CONNECTION";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.READY = "READY";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.CONNECT_FAILURE = "CONNECT_FAILURE";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.CLIENT_KILL_CONNECT = "CLIENT_KILL_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.SERVER_KILL_CONNECT = "SERVER_KILL_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.DISCONNECT = "DISCONNECT";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.CONNECTION_STATE_CHANGE = "CONNECTION_STATE_CHANGE";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.SESSION_TERMINATED = "SESSION_TERMINATED";
  
//==============================================================================
// INSTANCE METHODS
//==============================================================================

net.user1.orbiter.ConnectionManagerEvent.prototype.getConnection = function () {
  return this.connection;
}

net.user1.orbiter.ConnectionManagerEvent.prototype.getStatus = function () {
  return this.status;
}

net.user1.orbiter.ConnectionManagerEvent.prototype.toString = function () {
  return "[object ConnectionManagerEvent]";
}  

