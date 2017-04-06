//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.AccountListSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.accountList = null;
  this.method = net.user1.orbiter.UPC.GET_ACCOUNTLIST_SNAPSHOT;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.AccountListSnapshot, net.user1.orbiter.snapshot.Snapshot);
    
//==============================================================================
// INSTANCE METHODS
//==============================================================================
/**
 * @private
 */    
net.user1.orbiter.snapshot.AccountListSnapshot.prototype.setAccountList = function (value) {
  this.accountList = value;
}

net.user1.orbiter.snapshot.AccountListSnapshot.prototype.getAccountList = function () {
  if (!this.accountList) {
    return null;
  }
  return this.accountList.slice();
}
