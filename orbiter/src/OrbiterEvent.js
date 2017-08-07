//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.OrbiterEvent = function (type, 
                                           serverUPCVersion,
                                           connectionRefusal) {
  net.user1.events.Event.call(this, type);

  this.serverUPCVersion = serverUPCVersion;
  this.connectionRefusal = connectionRefusal;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.OrbiterEvent, net.user1.events.Event);
 
//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @constant */
net.user1.orbiter.OrbiterEvent.READY = "READY";
/** @constant */
net.user1.orbiter.OrbiterEvent.CLOSE = "CLOSE";
/** @constant */
net.user1.orbiter.OrbiterEvent.PROTOCOL_INCOMPATIBLE = "PROTOCOL_INCOMPATIBLE";
/** @constant */
net.user1.orbiter.OrbiterEvent.CONNECT_REFUSED = "CONNECT_REFUSED";

//==============================================================================
// INSTANCE METHODS
//==============================================================================  
net.user1.orbiter.OrbiterEvent.prototype.getServerUPCVersion = function () {
  return this.serverUPCVersion;
}

net.user1.orbiter.OrbiterEvent.prototype.getConnectionRefusal = function () {
  return this.connectionRefusal;
}

net.user1.orbiter.OrbiterEvent.prototype.toString = function () {
  return "[object OrbiterEvent]";
}  

