//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The Server class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.ServerEvent.TIME_SYNC}</li> 
<li class="fixedFont">{@link net.user1.orbiter.ServerEvent.UPC_PROCESSED}</li> 
<li class="fixedFont">{@link net.user1.orbiter.ServerEvent.WATCH_FOR_PROCESSED_UPCS_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.ServerEvent.STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT}</li> 
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

@extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.Server = function (orbiter) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);

  this.orbiter = orbiter;
  this.version = null;
  this.upcVersion = null;
  this.localAgeAtLastSync = NaN;
  this.lastKnownServerTime = NaN;
  this._isWatchingForProcessedUPCs = false;
  
  this.log = orbiter.getLog();
  
  orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.READY, this.readyListener, this);
}

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.Server, net.user1.events.EventDispatcher);

// =============================================================================
// SERVER-WIDE MESSAGING
// =============================================================================
net.user1.orbiter.Server.prototype.sendMessage = function (messageName, 
                                                           includeSelf,
                                                           filters) {
  var rest = Array.prototype.slice.call(arguments).slice(3);
  var args;

  if (messageName == null || messageName == "") {
    this.log.warn("Server.sendMessage() failed. No messageName supplied.");
    return;
  }

  var msgMan = this.orbiter.getMessageManager();
  args = [net.user1.orbiter.UPC.SEND_MESSAGE_TO_SERVER, 
          messageName, 
          includeSelf.toString(),
          filters != null ? filters.toXMLString() : ""];
  msgMan.sendUPC.apply(msgMan, args.concat(rest));
};

// =============================================================================
// SERVER MODULES
// =============================================================================
net.user1.orbiter.Server.prototype.sendModuleMessage = function (moduleID,
                                                                 messageName, 
                                                                 messageArguments) {
  var sendupcArgs = [net.user1.orbiter.UPC.SEND_SERVERMODULE_MESSAGE, moduleID, messageName];
  
  for (var arg in messageArguments) {
    sendupcArgs.push(arg + net.user1.orbiter.Tokens.RS + messageArguments[arg]);
  }
        
  this.orbiter.getMessageManager().sendUPC.apply(this.orbiter.getMessageManager(), sendupcArgs);
};

net.user1.orbiter.Server.prototype.clearModuleCache = function () {
  this.orbiter.getMessageManager().sendUPC(net.user1.orbiter.UPC.CLEAR_MODULE_CACHE);
};

// =============================================================================
// VERSION ACCESS
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.Server.prototype.setVersion = function (value) {
  this.version = value;
};

net.user1.orbiter.Server.prototype.getVersion = function () {
  return this.version;
};

/**
 * @private
 */
net.user1.orbiter.Server.prototype.setUPCVersion = function (value) {
  this.upcVersion = value;
};

net.user1.orbiter.Server.prototype.getUPCVersion = function () {
  return this.upcVersion;
};

// =============================================================================
// UPC STATS AND PROCESSING
// =============================================================================

net.user1.orbiter.Server.prototype.resetUPCStats = function () {
  this.orbiter.getMessageManager().sendUPC(UPC.RESET_UPC_STATS);
};

net.user1.orbiter.Server.prototype.watchForProcessedUPCs = function () {
  this.orbiter.getMessageManager().sendUPC(net.user1.orbiter.UPC.WATCH_FOR_PROCESSED_UPCS);
};

net.user1.orbiter.Server.prototype.stopWatchingForProcessedUPCs = function () {
  this.orbiter.getMessageManager().sendUPC(net.user1.orbiter.UPC.STOP_WATCHING_FOR_PROCESSED_UPCS);
};

net.user1.orbiter.Server.prototype.isWatchingForProcessedUPCs = function () {
  return this._isWatchingForProcessedUPCs;
};

net.user1.orbiter.Server.prototype.setIsWatchingForProcessedUPCs = function (value) {
  this._isWatchingForProcessedUPCs = value;
};

// =============================================================================
// TIME RETRIEVAL METHODS
// =============================================================================
net.user1.orbiter.Server.prototype.getServerTime = function () {
  var self = this.orbiter.self();
  var lastServerTime = NaN;
  var estimatedServerTime = NaN;
  
  if (self != null) {
    lastServerTime = isNaN(this.lastKnownServerTime) 
                     ? self.getConnectTime() 
                     : this.lastKnownServerTime;
                     
    estimatedServerTime = isNaN(lastServerTime) 
                         ? NaN
                         : (lastServerTime + (new Date().getTime()-this.localAgeAtLastSync));
  }
 
  if (estimatedServerTime == 0) {
    log.warn("Server time requested, but is unknown.");
  }
  
  return estimatedServerTime;
};

net.user1.orbiter.Server.prototype.syncTime = function () {
  var msgMan = this.orbiter.getMessageManager();
  msgMan.sendUPC(net.user1.orbiter.UPC.SYNC_TIME);
};

/**
 * @private 
 */ 
net.user1.orbiter.Server.prototype.readyListener = function (e) {
  this.orbiter.getMessageManager().addMessageListener(net.user1.orbiter.UPC.SERVER_TIME_UPDATE, this.u50);  
  this.localAgeAtLastSync = new Date().getTime();;
};

// =============================================================================
// EVENT DISPATCHING
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.Server.prototype.fireTimeSync = function () {
  this.dispatchEvent(new net.user1.orbiter.ServerEvent(ServerEvent.TIME_SYNC));
};

/**
 * @private
 */
net.user1.orbiter.Server.prototype.dispatchWatchForProcessedUPCsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ServerEvent(net.user1.orbiter.ServerEvent.WATCH_FOR_PROCESSED_UPCS_RESULT,
                     null, status));
};

/**
 * @private
 */
net.user1.orbiter.Server.prototype.dispatchStopWatchingForProcessedUPCsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ServerEvent(net.user1.orbiter.ServerEvent.STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT,
                     null, status));
};

/**
 * @private
 */
net.user1.orbiter.Server.prototype.dispatchUPCProcessed = function (record) {
  this.dispatchEvent(new net.user1.orbiter.ServerEvent(net.user1.orbiter.ServerEvent.UPC_PROCESSED, record));
};

/**
 * @private
 */
net.user1.orbiter.Server.prototype.dispatchResetUPCStatsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ServerEvent(net.user1.orbiter.ServerEvent.RESET_UPC_STATS_RESULT,
                     null, status));
};

//==============================================================================
// UPC LISTENERS
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.Server.prototype.u50 = function (newTime) {             // SERVER_TIME
  this.lastKnownServerTime = Number(newTime);
  this.localAgeAtLastSync  = new Date().getTime();
  this.fireTimeSync();
}

//==============================================================================
// CLEANUP AND DISPOSAL
//==============================================================================  
/**
 * @private
 */    
net.user1.orbiter.Server.prototype.cleanup = function () {
  this.log.info("[SERVER] Cleaning resources.");
  this.setIsWatchingForProcessedUPCs(false);
}