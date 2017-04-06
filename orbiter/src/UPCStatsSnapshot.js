//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.UPCStatsSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.totalUPCsProcessed;
  this.numUPCsInQueue;
  this.lastQueueWaitTime;
  this.longestUPCProcesses;
  this.method = net.user1.orbiter.UPC.GET_UPC_STATS_SNAPSHOT;
  this.hasStatus = true;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.UPCStatsSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================         
/**
 * @private
 */
net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.setTotalUPCsProcessed = function (value) {
  this.totalUPCsProcessed = value;
};
    
net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.getTotalUPCsProcessed = function () {
  return this.totalUPCsProcessed;
};
        
/**
 * @private
 */
net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.setNumUPCsInQueue = function (value) {
  this.numUPCsInQueue = value;
};

net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.getNumUPCsInQueue = function () {
  return this.numUPCsInQueue;
};
    
/**
 * @private
 */
net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.setLastQueueWaitTime = function (value) {
  this.lastQueueWaitTime = value;
};

net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.getLastQueueWaitTime = function () {
  return this.lastQueueWaitTime;
};
    
/**
 * @private
 */
net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.setLongestUPCProcesses = function (value) {
  this.longestUPCProcesses = value;
};

net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.getLongestUPCProcesses = function () {
  if (!this.longestUPCProcesses) {
    return null;
  }
  return this.longestUPCProcesses.slice();
};
