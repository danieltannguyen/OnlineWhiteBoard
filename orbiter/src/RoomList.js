//==============================================================================
// CLASS DECLARATION
//==============================================================================
  /**
   * @private
   */  
net.user1.orbiter.RoomList = function () {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
    
  this.rooms = new Array();
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.RoomList, net.user1.events.EventDispatcher);  

//==============================================================================    
// INSTANCE METHODS
//============================================================================== 
net.user1.orbiter.RoomList.prototype.add = function (room) {
  if (!this.contains(room)) {
    this.rooms.push(room);
    this.dispatchAddItem(room);
    return room;
  } else {
    return null;
  }
};

net.user1.orbiter.RoomList.prototype.remove = function (room) {
  var index = net.user1.utils.ArrayUtil.indexOf(this.rooms, room);
  if (index != -1) {
    this.rooms.splice(index, 1)[0];
    this.dispatchRemoveItem(room);
    return room;
  } else {
    return null;
  }
};

net.user1.orbiter.RoomList.prototype.removeAll = function () {
  var room;
  for (var i = this.rooms.length; --i >= 0; ) {
    room = this.rooms.splice(i, 1)[0];
    this.dispatchRemoveItem(room);
  }
};

net.user1.orbiter.RoomList.prototype.removeByRoomID = function (roomID) {
  var room;
  for (var i = this.rooms.length; --i >= 0; ) {
    if (this.rooms[i].getRoomID() == roomID) {
      room = this.rooms.splice(i, 1)[0];
      this.dispatchRemoveItem(room);
      return room;
    }
  }
  return null;
};

net.user1.orbiter.RoomList.prototype.contains = function (room) {
  return net.user1.utils.ArrayUtil.indexOf(this.rooms, room) != -1;
}

net.user1.orbiter.RoomList.prototype.containsRoomID = function (roomID) {
  if (roomID == "" || roomID == null) {
    return false;
  }
  return this.getByRoomID(roomID) != null;
}

net.user1.orbiter.RoomList.prototype.getByRoomID = function (roomID) {
  var room;
  for (var i = this.rooms.length; --i >= 0;) {
    room = this.rooms[i];
    if (room.getRoomID() == roomID) {
      return room;
    }
  }
  return null;
};

net.user1.orbiter.RoomList.prototype.getAll = function () {
  return this.rooms.slice(0);
};

net.user1.orbiter.RoomList.prototype.length = function () {
  return this.rooms.length;
}

net.user1.orbiter.RoomList.prototype.dispatchAddItem = function (item) {
  this.dispatchEvent(new net.user1.orbiter.CollectionEvent(net.user1.orbiter.CollectionEvent.ADD_ITEM, item));
};

net.user1.orbiter.RoomList.prototype.dispatchRemoveItem = function (item) {
  this.dispatchEvent(new net.user1.orbiter.CollectionEvent(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, item));
};
