//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The Logger class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.logger.LogEvent.LEVEL_CHANGE}</li>
<li class="fixedFont">{@link net.user1.logger.LogEvent.UPDATE}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.


    @extends net.user1.events.EventDispatcher
*/
net.user1.logger.Logger = function (historyLength) {
  // Invoke superclass constructor
  net.user1.events.EventDispatcher.call(this);
  
  // Instance variables
  this.suppressionTerms = new Array(); 
  this.timeStampEnabled = false;
  this.logLevel = 0;
  this.messages = new Array();
  this.historyLength = 0;

  // Initialization
  this.setHistoryLength(historyLength == null ? 100 : historyLength);
  this.enableTimeStamp(); 
  this.setLevel(net.user1.logger.Logger.INFO);
};  

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.logger.Logger, net.user1.events.EventDispatcher);
  
//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @constant */
net.user1.logger.Logger.FATAL = "FATAL"; 
/** @constant */
net.user1.logger.Logger.ERROR = "ERROR"; 
/** @constant */
net.user1.logger.Logger.WARN  = "WARN"; 
/** @constant */
net.user1.logger.Logger.INFO  = "INFO"; 
/** @constant */
net.user1.logger.Logger.DEBUG = "DEBUG";
net.user1.logger.Logger.logLevels = new Array(net.user1.logger.Logger.FATAL,
                                              net.user1.logger.Logger.ERROR, 
                                              net.user1.logger.Logger.WARN, 
                                              net.user1.logger.Logger.INFO, 
                                              net.user1.logger.Logger.DEBUG);

//==============================================================================
// INSTANCE METHODS
//==============================================================================
net.user1.logger.Logger.prototype.setLevel = function (level) {
  if (level !== undefined) {
    for (var i = 0; i < net.user1.logger.Logger.logLevels.length; i++) {
      if (net.user1.logger.Logger.logLevels[i].toLowerCase() == level.toLowerCase()) {
        this.logLevel = i;
        this.dispatchEvent(new net.user1.logger.LogEvent(net.user1.logger.LogEvent.LEVEL_CHANGE, null, level));
        return;
      }
    }
  }

  this.warn("Invalid log level specified: " + level);
};

net.user1.logger.Logger.prototype.getLevel = function () {
  return net.user1.logger.Logger.logLevels[this.logLevel];
};

net.user1.logger.Logger.prototype.fatal = function (msg) {
  this.addEntry(0, net.user1.logger.Logger.FATAL, msg);
};

net.user1.logger.Logger.prototype.error = function (msg) {
  this.addEntry(1, net.user1.logger.Logger.ERROR, msg);
};

net.user1.logger.Logger.prototype.warn = function (msg) {
  this.addEntry(2, net.user1.logger.Logger.WARN, msg);
};

net.user1.logger.Logger.prototype.info = function (msg) {
  this.addEntry(3, net.user1.logger.Logger.INFO, msg);
};

net.user1.logger.Logger.prototype.debug = function (msg) {
  this.addEntry(4, net.user1.logger.Logger.DEBUG, msg);
};

net.user1.logger.Logger.prototype.addSuppressionTerm = function (term) {
  this.debug("Added suppression term. Log messages containing '" 
             + term + "' will now be ignored.");
  this.suppressionTerms.push(term);
};

net.user1.logger.Logger.prototype.removeSuppressionTerm = function (term) {
  var termIndex = net.user1.utils.ArrayUtil.indexOf(this.suppressionTerms, term);
  if (termIndex != -1) {
    this.suppressionTerms.splice(termIndex, 1);
    this.debug("Removed suppression term. Log messages containing '" 
               + term + "' will now be shown.");
    return true;
  }
  return false;
};

/** @private */
net.user1.logger.Logger.prototype.addEntry = function (level, levelName, msg) {
  var timeStamp = "";
  var time;
  
  // Abort if the log's level is lower than the message's level.
  if (this.logLevel < level) {
    return;
  }
  
  // Don't log messages if they contain any of the suppression terms.
  for (var i = this.suppressionTerms.length; --i >= 0;) {
    if (msg.indexOf(this.suppressionTerms[i]) != -1) {
      return;
    }
  }

  if (this.timeStampEnabled) {
    time = new Date();
    timeStamp = time.getMonth()+1 + "/" + String(time.getDate())
              + "/" + String(time.getFullYear()).substr(2)
              + " " + net.user1.utils.NumericFormatter.dateToLocalHrMinSecMs(time) 
              + " UTC" + (time.getTimezoneOffset() >= 0 ? "-" : "+") 
              + Math.abs(time.getTimezoneOffset() / 60);
  }
  
  // Log the message.
  this.addToHistory(levelName, msg, timeStamp);

  var e = new net.user1.logger.LogEvent(net.user1.logger.LogEvent.UPDATE,
                                        msg, levelName, timeStamp);
  this.dispatchEvent(e);
};

/** @private */ 
net.user1.logger.Logger.prototype.setHistoryLength = function (newHistoryLength) {
  this.historyLength = newHistoryLength;
  
  if (this.messages.length > this.historyLength) {
    this.messages.splice(this.historyLength);
  }
};

net.user1.logger.Logger.prototype.getHistoryLength = function () {
  return this.historyLength;
};

/** @private */ 
net.user1.logger.Logger.prototype.addToHistory = function (level, msg, timeStamp) {
  this.messages.push(timeStamp + (timeStamp == "" ? "" : " ") + level + ": " + msg);
  if (this.messages.length > this.historyLength) {
    this.messages.shift();
  }
};

net.user1.logger.Logger.prototype.getHistory = function () {
  return this.messages.slice(0);
};

net.user1.logger.Logger.prototype.enableTimeStamp = function () {
  this.timeStampEnabled = true;
};

net.user1.logger.Logger.prototype.disableTimeStamp = function () {
  this.timeStampEnabled = false;
};

net.user1.logger.Logger.prototype.toString = function () {
  return "[object Logger]";
};
