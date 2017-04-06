//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.BannedListSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.bannedList = null;
  this.method = net.user1.orbiter.UPC.GET_BANNED_LIST_SNAPSHOT;
}

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.BannedListSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================
/**
 * @private
 */    
net.user1.orbiter.snapshot.BannedListSnapshot.prototype.setBannedList = function (value) {
  this.bannedList = value;
};

net.user1.orbiter.snapshot.BannedListSnapshot.prototype.getBannedList = function () {
  if (!this.bannedList) {
    return null;
  }
  return this.bannedList.slice();
};
