//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.ClientEvent = function (type,
                                          changedAttr,
                                          room,
                                          roomID,
                                          client,
                                          status,
                                          clientID) {
  net.user1.events.Event.call(this, type);
  
  this.changedAttr = changedAttr;
  this.room = room;
  this.roomID = roomID;
  this.client = client;
  this.status = status;
  this.clientID = clientID;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.ClientEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @constant */
net.user1.orbiter.ClientEvent.JOIN_ROOM = "JOIN_ROOM";
/** @constant */
net.user1.orbiter.ClientEvent.LEAVE_ROOM = "LEAVE_ROOM";
/** @constant */
net.user1.orbiter.ClientEvent.OBSERVE_ROOM = "OBSERVE_ROOM";
/** @constant */
net.user1.orbiter.ClientEvent.STOP_OBSERVING_ROOM = "STOP_OBSERVING_ROOM";
/** @constant */
net.user1.orbiter.ClientEvent.OBSERVE = "OBSERVE";
/** @constant */
net.user1.orbiter.ClientEvent.STOP_OBSERVING = "STOP_OBSERVING";
/** @constant */
net.user1.orbiter.ClientEvent.OBSERVE_RESULT = "OBSERVE_RESULT";
/** @constant */
net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT = "STOP_OBSERVING_RESULT";
/** @constant */
net.user1.orbiter.ClientEvent.SYNCHRONIZE = "SYNCHRONIZE";

net.user1.orbiter.ClientEvent.prototype.getClient = function () {
  return this.client;
};

net.user1.orbiter.ClientEvent.prototype.getClientID = function () {
  if (this.client != null) {
    return this.client.getClientID();
  } else {
    return this.clientID;
  }
};

net.user1.orbiter.ClientEvent.prototype.getRoom = function () {
  return this.room;
};

net.user1.orbiter.ClientEvent.prototype.getRoomID = function () {
  return this.roomID;
}

net.user1.orbiter.ClientEvent.prototype.getStatus = function () {
  return this.status;
};

net.user1.orbiter.ClientEvent.prototype.toString = function () {
  return "[object ClientEvent]";
};