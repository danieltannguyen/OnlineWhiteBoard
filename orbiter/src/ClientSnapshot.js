//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.ClientSnapshot = function (clientID) {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.manifest = null;
  this.method = net.user1.orbiter.UPC.GET_CLIENT_SNAPSHOT;
  this.args   = [clientID];
  this.hasStatus = true;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.ClientSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================        
/**
 * @private
 */    
net.user1.orbiter.snapshot.ClientSnapshot.prototype.setManifest = function (value) {
  this.manifest = value;
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getAttribute = function (name, scope) {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.transientAttributes.getAttribute(name, scope);
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getAttributes = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.transientAttributes.getAll();
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getClientID = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.clientID;
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getUserID = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.userID;
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getOccupiedRoomIDs = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.occupiedRoomIDs.slice();
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getObservedRoomIDs = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.observedRoomIDs.slice();
}