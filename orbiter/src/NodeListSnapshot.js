//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.NodeListSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.nodeList = null;
  this.method = net.user1.orbiter.UPC.GET_NODELIST_SNAPSHOT;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.NodeListSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================         
/**
 * @private
 */    
net.user1.orbiter.snapshot.NodeListSnapshot.prototype.setNodeList = function (value) {
  this.nodeList = value;
}

net.user1.orbiter.snapshot.NodeListSnapshot.prototype.getNodeList = function () {
  if (!this.nodeList) {
    return null;
  }
  return this.nodeList.slice();
};
