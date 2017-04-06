//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.RoomManagerEvent = function (type,
                                               roomID, 
                                               status,
                                               roomIdQualifier,
                                               room,
                                               numRooms) {
  net.user1.events.Event.call(this, type);

  this.roomID = roomID;
  this.status = status;
  this.roomIdQualifier  = roomIdQualifier;
  this.room = room;
  this.numRooms = numRooms;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.RoomManagerEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.RoomManagerEvent.CREATE_ROOM_RESULT = "CREATE_ROOM_RESULT";
/** @constant */
net.user1.orbiter.RoomManagerEvent.REMOVE_ROOM_RESULT = "REMOVE_ROOM_RESULT";
/** @constant */
net.user1.orbiter.RoomManagerEvent.WATCH_FOR_ROOMS_RESULT = "WATCH_FOR_ROOMS_RESULT";
/** @constant */
net.user1.orbiter.RoomManagerEvent.STOP_WATCHING_FOR_ROOMS_RESULT = "STOP_WATCHING_FOR_ROOMS_RESULT";
/** @constant */
net.user1.orbiter.RoomManagerEvent.ROOM_ADDED = "ROOM_ADDED";
/** @constant */
net.user1.orbiter.RoomManagerEvent.ROOM_REMOVED = "ROOM_REMOVED";
/** @constant */
net.user1.orbiter.RoomManagerEvent.ROOM_COUNT = "ROOM_COUNT";

net.user1.orbiter.RoomManagerEvent.prototype.getRoomIdQualifier = function () {
  if (this.roomIdQualifier == null && this.room != null) {
    return this.room.getQualifier();
  } else {
    return this.roomIdQualifier;
  }
};

net.user1.orbiter.RoomManagerEvent.prototype.getRoomID = function () {
  var fullRoomID;
  var qualifier;
  
  if (this.room != null) {
    return this.room.getRoomID();
  } else if (this.roomID == null) {
    return null;
  } else {
    qualifier = this.getRoomIdQualifier();
    fullRoomID = qualifier == "" || qualifier == null 
                 ? this.roomID
                 : qualifier + "." + this.roomID;
    return fullRoomID;
  }
};

net.user1.orbiter.RoomManagerEvent.prototype.getSimpleRoomID = function () {
  if (this.roomID == null && this.room != null) {
    return this.room.getSimpleRoomID();
  } else {
    return this.roomID;
  }
};

net.user1.orbiter.RoomManagerEvent.prototype.getRoom = function () {
  return this.room;
}

net.user1.orbiter.RoomManagerEvent.prototype.getStatus = function () {
  return this.status;
}

net.user1.orbiter.RoomManagerEvent.prototype.getNumRooms = function () {
  return this.numRooms;
}

net.user1.orbiter.RoomManagerEvent.prototype.toString = function () {
  return "[object RoomManagerEvent]";
};
