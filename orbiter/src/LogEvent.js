//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.logger.LogEvent = function (type, message, level, timeStamp) {
  net.user1.events.Event.call(this, type);

  this.message = message;
  this.level = level;
  this.timeStamp = timeStamp;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.logger.LogEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @constant */
net.user1.logger.LogEvent.UPDATE = "UPDATE";
/** @constant */
net.user1.logger.LogEvent.LEVEL_CHANGE = "LEVEL_CHANGE";
  
//==============================================================================
// INSTANCE METHODS
//==============================================================================
net.user1.logger.LogEvent.prototype.getMessage = function () {
  return this.message;
};
  
net.user1.logger.LogEvent.prototype.getLevel = function () {
  return this.level;
};
  
net.user1.logger.LogEvent.prototype.getTimeStamp = function () {
  return this.timeStamp;
};

net.user1.logger.LogEvent.prototype.toString = function () {
  return "[object LogEvent]";
};

