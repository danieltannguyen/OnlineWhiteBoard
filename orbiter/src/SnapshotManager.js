//==============================================================================
// CLASS DECLARATION
//==============================================================================
  /**
   * @private 
   */  
net.user1.orbiter.SnapshotManager = function (messageManager) {
  this.messageManager = messageManager;
  this.pendingSnapshots = new Object();
  this.requestIDCounter = 0;
};
    
//==============================================================================
// UPDATE SNAPSHOT
//==============================================================================    
    
net.user1.orbiter.SnapshotManager.prototype.updateSnapshot = function (snapshot) {
  var args;
  if (snapshot != null) {
    if (!snapshot.updateInProgress()) {
      this.requestIDCounter++;
      snapshot.setUpdateInProgress(true);
      snapshot.loaded = false;
      snapshot.statusReceived = false;
      snapshot.setStatus(null);
      this.pendingSnapshots[this.requestIDCounter.toString()] = snapshot;
      args = snapshot.args.slice(0);
      args.unshift(this.requestIDCounter);
      args.unshift(snapshot.method);
      this.messageManager.sendUPC.apply(this.messageManager, args);
    }
  }
};

//==============================================================================
// RECEIVE SNAPSHOT RESULT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveSnapshotResult = function (requestID, status) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received snapshot result for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setStatus(status);
  this.setStatusReceived(snapshot, requestID);
};

//==============================================================================
// RECEIVE CLIENTCOUNT SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveClientCountSnapshot =  function (requestID,
                                                                                    numClients) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received client-count snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setCount(numClients);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE CLIENT SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveClientSnapshot = function (requestID, manifest) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received client snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setManifest(manifest);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE ACCOUNT SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveAccountSnapshot = function (requestID, manifest) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received account snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setManifest(manifest);
  this.setLoaded(snapshot, requestID);
}

//==============================================================================
// RECEIVE ROOMLIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveRoomListSnapshot = function (requestID,
                                                                                roomList, 
                                                                                qualifier,
                                                                                recursive) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received roomlist snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setRoomList(roomList);
  snapshot.setQualifier(qualifier == "" ? null : qualifier);
  snapshot.setRecursive(recursive);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE ROOM SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveRoomSnapshot = function (requestID, manifest) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received room snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setManifest(manifest);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE CLIENTLIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveClientListSnapshot = function (requestID, clientList) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received clientlist snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setClientList(clientList);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE ACCOUNTLIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveAccountListSnapshot = function (requestID, accountList) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received accountlist snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setAccountList(accountList);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE BANNEDLIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveBannedListSnapshot = function (requestID, bannedList) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received bannedlist snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setBannedList(bannedList);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE SERVERMODULELIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveServerModuleListSnapshot = function (requestID, moduleList) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received server module list snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setModuleList(moduleList);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE UPCSTATS SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveUPCStatsSnapshot = function (requestID, 
                                                                                totalUPCsProcessed,
                                                                                numUPCsInQueue,
                                                                                lastQueueWaitTime,
                                                                                longestUPCProcesses) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received UPC stats snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setTotalUPCsProcessed(totalUPCsProcessed);
  snapshot.setNumUPCsInQueue(numUPCsInQueue);
  snapshot.setLastQueueWaitTime(lastQueueWaitTime);
  snapshot.setLongestUPCProcesses(longestUPCProcesses);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE NODELIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveNodeListSnapshot = function (requestID, nodeList) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received server node list snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setNodeList(nodeList);
  this.setLoaded(snapshot, requestID);
};


//==============================================================================
// RECEIVE GATEWAYS SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveGatewaysSnapshot = function (requestID, gateways) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received gateways snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setGateways(gateways);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// LOADED AND STATUS ASSIGNMENT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.setLoaded = function (snapshot, requestID) {
  snapshot.loaded = true;
  if (snapshot.hasStatus == false
      || (snapshot.hasStatus == true && snapshot.statusReceived)) {
    snapshot.setUpdateInProgress(false);
    delete this.pendingSnapshots[requestID];
  }
  
  if (snapshot.hasOwnProperty("onLoad")) {
    snapshot["onLoad"]();
  }
  snapshot.dispatchLoaded();
};
    
net.user1.orbiter.SnapshotManager.prototype.setStatusReceived = function (snapshot, requestID) {
  if (snapshot.loaded) {
    snapshot.setUpdateInProgress(false);
    delete this.pendingSnapshots[requestID];
  }
  snapshot.dispatchStatus();
};


















