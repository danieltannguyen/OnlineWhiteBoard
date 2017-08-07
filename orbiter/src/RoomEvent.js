//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.RoomEvent = function (type,
                                        client,
                                        clientID, 
                                        status, 
                                        changedAttr, 
                                        numClients,
                                        roomID) {
  net.user1.events.Event.call(this, type);
  
  this.client = client;
  this.clientID = clientID == "" ? null : clientID;
  this.status = status;
  this.changedAttr = changedAttr;
  this.numClients = numClients;
  this.roomID = roomID;
};


//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.RoomEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.RoomEvent.JOIN = "JOIN";
/** @constant */
net.user1.orbiter.RoomEvent.JOIN_RESULT = "JOIN_RESULT";
/** @constant */
net.user1.orbiter.RoomEvent.LEAVE = "LEAVE";
/** @constant */
net.user1.orbiter.RoomEvent.LEAVE_RESULT = "LEAVE_RESULT";
/** @constant */
net.user1.orbiter.RoomEvent.OBSERVE = "OBSERVE";
/** @constant */
net.user1.orbiter.RoomEvent.OBSERVE_RESULT = "OBSERVE_RESULT";    
/** @constant */
net.user1.orbiter.RoomEvent.STOP_OBSERVING = "STOP_OBSERVING";
/** @constant */
net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT = "STOP_OBSERVING_RESULT";        
/** @constant */
net.user1.orbiter.RoomEvent.SYNCHRONIZE = "SYNCHRONIZE";
/** @constant */
net.user1.orbiter.RoomEvent.UPDATE_CLIENT_ATTRIBUTE = "UPDATE_CLIENT_ATTRIBUTE";
/** @constant */
net.user1.orbiter.RoomEvent.DELETE_CLIENT_ATTRIBUTE = "DELETE_CLIENT_ATTRIBUTE";
/** @constant */
net.user1.orbiter.RoomEvent.ADD_OCCUPANT = "ADD_OCCUPANT";
/** @constant */
net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT = "REMOVE_OCCUPANT";
/** @constant */
net.user1.orbiter.RoomEvent.ADD_OBSERVER = "ADD_OBSERVER";
/** @constant */
net.user1.orbiter.RoomEvent.REMOVE_OBSERVER = "REMOVE_OBSERVER";
/** @constant */
net.user1.orbiter.RoomEvent.OCCUPANT_COUNT = "OCCUPANT_COUNT";
/** @constant */
net.user1.orbiter.RoomEvent.OBSERVER_COUNT = "OBSERVER_COUNT";
/** @constant */
net.user1.orbiter.RoomEvent.REMOVED = "REMOVED";


net.user1.orbiter.RoomEvent.prototype.getRoomID = function () {
  return this.roomID;
};

net.user1.orbiter.RoomEvent.prototype.getClient = function () {
  return this.client;
};

net.user1.orbiter.RoomEvent.prototype.getClientID = function () {
  return this.clientID;
};

net.user1.orbiter.RoomEvent.prototype.getStatus = function () {
  return this.status;
};

net.user1.orbiter.RoomEvent.prototype.getNumClients = function () {
  return this.numClients;
};

net.user1.orbiter.RoomEvent.prototype.getChangedAttr = function () {
  return this.changedAttr;
};

net.user1.orbiter.RoomEvent.prototype.toString = function () {
  return "[object RoomEvent]";
};  
