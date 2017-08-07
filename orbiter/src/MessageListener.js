//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @private */
net.user1.orbiter.MessageListener = function (listener,
                                              forRoomIDs,
                                              thisArg) {
  this.listener   = listener;
  this.forRoomIDs = forRoomIDs;
  this.thisArg    = thisArg;
};

//==============================================================================
// INSTANCE METHODS
//==============================================================================
/** @private */
net.user1.orbiter.MessageListener.prototype.getListenerFunction = function () {
  return this.listener;
};
    
/** @private */
net.user1.orbiter.MessageListener.prototype.getForRoomIDs = function () {
  return this.forRoomIDs;
};
    
/** @private */
net.user1.orbiter.MessageListener.prototype.getThisArg = function () {
  return this.thisArg;
};

/** @private */
net.user1.orbiter.MessageListener.prototype.toString = function () {
  return "[object MessageListener]";
};
