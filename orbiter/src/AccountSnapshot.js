//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.AccountSnapshot = function (userID) {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.manifest = null;
  this.method = net.user1.orbiter.UPC.GET_ACCOUNT_SNAPSHOT;
  this.args   = [userID];
  this.hasStatus = true;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.AccountSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================
/**
 * @private
 */    
net.user1.orbiter.snapshot.AccountSnapshot.prototype.setManifest = function (value) {
  this.manifest = value;
};

net.user1.orbiter.snapshot.AccountSnapshot.prototype.getAttribute = function (name, scope) {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.persistentAttributes.getAttribute(name, scope);
};

net.user1.orbiter.snapshot.AccountSnapshot.prototype.getAttributes = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.persistentAttributes.getAll();
};

net.user1.orbiter.snapshot.AccountSnapshot.prototype.getUserID = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.userID;
};
