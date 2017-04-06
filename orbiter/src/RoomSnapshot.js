//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.RoomSnapshot = function (roomID, password, updateLevels) {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.manifest = null;
  this.method = net.user1.orbiter.UPC.GET_ROOM_SNAPSHOT;
  this.args   = [roomID, password, updateLevels != null ? updateLevels.toInt() : ""];
  this.hasStatus = true;
};
//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.RoomSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================                
/**
 * @private
 */    
net.user1.orbiter.snapshot.RoomSnapshot.prototype.setManifest = function (value) {
  this.manifest = value;
};
    
net.user1.orbiter.snapshot.RoomSnapshot.prototype.getAttribute = function (name) {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.attributes.getAttribute(name, net.user1.orbiter.Tokens.GLOBAL_ATTR);
};

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getAttributes = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.attributes.getByScope(net.user1.orbiter.Tokens.GLOBAL_ATTR);
};

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getRoomID = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.roomID;
};

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getOccupants = function () {
  return this.manifest.occupants.slice();
}

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getObservers = function () {
  return this.manifest.observers.slice();
}

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getOccupant = function (clientID) {
  var client;
  for (var i = this.manifest.occupants.length; --i >= 0;) {
    if (this.manifest.occupants[i].clientID == clientID) {
      return this.manifest.occupants[i];
    } 
  }
  return null;
};

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getObserver = function (clientID) {
  var client;
  for (var i = this.manifest.observers.length; --i >= 0;) {
    if (this.manifest.observers[i].clientID == clientID) {
      return this.manifest.observers[i];
    } 
  }
  return null;
};

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getNumOccupants = function () {
  return Math.max(this.manifest.occupants.length, this.manifest.occupantCount);
}

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getNumObservers = function () {
  return Math.max(this.manifest.observers.length, this.manifest.observerCount);
}