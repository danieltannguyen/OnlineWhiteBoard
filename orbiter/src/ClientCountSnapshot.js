//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.ClientCountSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.count = 0;
  this.method = net.user1.orbiter.UPC.GET_CLIENTCOUNT_SNAPSHOT;
  this.hasStatus = true;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.ClientCountSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================
/**
 * @private
 */    
net.user1.orbiter.snapshot.ClientCountSnapshot.prototype.setCount = function (value) {
  this.count = value;
};

net.user1.orbiter.snapshot.ClientCountSnapshot.prototype.getCount = function () {
  return this.count;
};
