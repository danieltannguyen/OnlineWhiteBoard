//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.ClientListSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.clientList;
  this.method = net.user1.orbiter.UPC.GET_CLIENTLIST_SNAPSHOT;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.ClientListSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================
/**
 * @private
 */          
net.user1.orbiter.snapshot.ClientListSnapshot.prototype.setClientList = function (value) {
  this.clientList = value;
};

net.user1.orbiter.snapshot.ClientListSnapshot.prototype.getClientList = function () {
  if (!this.clientList) {
    return null;
  }
  return this.clientList.slice();
}