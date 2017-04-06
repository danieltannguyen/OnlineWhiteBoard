//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.RoomListSnapshot = function (qualifier, 
                                                        recursive) {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.roomList = null;
  this.qualifier = null;
  this.recursive = null;
  this.method = net.user1.orbiter.UPC.GET_ROOMLIST_SNAPSHOT;
  this.args   = [qualifier,
                 recursive];
};
    
//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.RoomListSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================                
/**
 * @private
 */    
net.user1.orbiter.snapshot.RoomListSnapshot.prototype.setRoomList = function (value) {
  this.roomList = value;
};

net.user1.orbiter.snapshot.RoomListSnapshot.prototype.getRoomList = function () {
  if (!this.roomList) {
    return null;
  }
  return this.roomList.slice();
};
    
net.user1.orbiter.snapshot.RoomListSnapshot.prototype.getQualifier = function () {
  return this.qualifier;
};
        
    /**
     * @private
     */        
net.user1.orbiter.snapshot.RoomListSnapshot.prototype.setQualifier = function (value) {
  this.qualifier = value;
};
    
net.user1.orbiter.snapshot.RoomListSnapshot.prototype.getRecursive = function () {
  return this.recursive;
};
        
/**
 * @private
 */    
net.user1.orbiter.snapshot.RoomListSnapshot.prototype.setRecursive = function (value) {
  this.recursive = value;
};