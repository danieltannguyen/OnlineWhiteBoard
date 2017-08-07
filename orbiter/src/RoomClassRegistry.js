//==============================================================================
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 */
net.user1.orbiter.RoomClassRegistry = function () {
  this.registry = new Object();
};

net.user1.orbiter.RoomClassRegistry.prototype.setRoomClass = function (roomID, roomClass) {
  this.registry[roomID] = roomClass;
};

net.user1.orbiter.RoomClassRegistry.prototype.clearRoomClass = function (roomID) {
  delete this.registry[roomID];
};


net.user1.orbiter.RoomClassRegistry.prototype.getRoomClass = function (roomID) {
  return this.registry[roomID] ? this.registry[roomID] : net.user1.orbiter.Room;
};
