//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The ConsoleLogger class outputs Orbiter's log to the host environment's console,
if a console is available.

*/
net.user1.logger.ConsoleLogger = function (log) {
  this.log = log;
  this.log.addEventListener(net.user1.logger.LogEvent.UPDATE, this.updateListener, this);
  // Print all messages already in the log
  var history = this.log.getHistory();
  for (var i = 0; i < history.length; i++) {
    this.out(history[i]);
  }
};
    
//==============================================================================
// INSTANCE METHODS
//==============================================================================
/** @private */ 
net.user1.logger.ConsoleLogger.prototype.updateListener = function (e) {
  var timeStamp = e.getTimeStamp();
  var level = e.getLevel();
  var bufferSpace = (level == net.user1.logger.Logger.INFO 
                     || level == net.user1.logger.Logger.WARN) ? " " : "";

  this.out(timeStamp + (timeStamp == "" ? "" : " ") 
           + e.getLevel() + ": " + bufferSpace + e.getMessage());
};

/** @private */ 
net.user1.logger.ConsoleLogger.prototype.out = function (value) {
  if (typeof console === "undefined" || typeof console.log === "undefined") {
    return;
  }
  console.log(value);
};

/** @private */ 
net.user1.logger.ConsoleLogger.prototype.dispose = function () {
  this.log.removeEventListener(net.user1.logger.LogEvent.UPDATE, this.updateListener, this);
  this.log = log = null;
};