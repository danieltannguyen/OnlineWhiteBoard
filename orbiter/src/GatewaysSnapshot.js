//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.GatewaysSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.gateways = null;
  this.method = net.user1.orbiter.UPC.GET_GATEWAYS_SNAPSHOT;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.GatewaysSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================         
/**
 * @private
 */    
net.user1.orbiter.snapshot.GatewaysSnapshot.prototype.setGateways = function (value) {
  this.gateways = value;
};

net.user1.orbiter.snapshot.GatewaysSnapshot.prototype.getGateways = function () {
  if (!this.gateways) {
    return [];
  }
  return this.gateways.slice();
};
