//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.ServerModuleListSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.moduleList = null;
  this.method = net.user1.orbiter.UPC.GET_SERVERMODULELIST_SNAPSHOT;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.ServerModuleListSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================         
/**
 * @private
 */    
net.user1.orbiter.snapshot.ServerModuleListSnapshot.prototype.setModuleList = function (value) {
  this.moduleList = value;
}

net.user1.orbiter.snapshot.ServerModuleListSnapshot.prototype.getModuleList = function () {
  if (!this.moduleList) {
    return null;
  }
  return this.moduleList.slice();
};