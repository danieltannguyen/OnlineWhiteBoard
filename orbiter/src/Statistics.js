//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * 
 * Note: Due to JavaScript's lack of memory measurement APIs and byte-measurement 
 * APIs, Orbiter's Statistics class does not include many of the statistics found
 * in the equivalent Reactor Statistics class.
 */
net.user1.orbiter.Statistics = function (orbiter) {
  this.statsTimer;
  this.lastTick = NaN;
  this.lastTotalMessages = 0;
  this.messagesPerSecond = 0;
  
  // Peaks
  this.peakMessagesPerSecond = 0;

  this.orbiter = null;
  this.connection = null;
  
  this.statsIntervalID = -1;
  
  this.init(orbiter);
};

/**
 * @private
 */
net.user1.orbiter.Statistics.prototype.init = function (orbiter) {
  this.setOrbiter(orbiter);
  this.start();
};

/**
 * @private
 */
net.user1.orbiter.Statistics.prototype.setOrbiter = function (orbiter) {
  // Register new orbiter
  this.orbiter = orbiter;
};

net.user1.orbiter.Statistics.prototype.start = function () {
  this.stop();
  
  this.statsIntervalID = setInterval(statsTimerListener, 1000);
  
  this.lastTick = new Date().getTime();
  this.lastTotalMessages = this.getTotalMessages();
};

net.user1.orbiter.Statistics.prototype.stop = function () {
  clearInterval(statsIntervalID);
  this.clearStats();
};

/**
 * @private 
 */
net.user1.orbiter.Statistics.prototype.clearStats = function () {
  this.lastTick = 0;
  this.lastTotalMessages = 0;
  this.messagesPerSecond = 0;
  this.peakMessagesPerSecond = 0;
};

net.user1.orbiter.Statistics.prototype.getLifetimeNumClientsConnected = function () {
  return this.orbiter.getClientManager().getLifetimeNumClientsKnown();
};

net.user1.orbiter.Statistics.prototype.getCurrentNumClientsConnected = function () {
  return this.orbiter.getClientManager().getNumClients();
};

net.user1.orbiter.Statistics.prototype.getTotalMessagesReceived = function () {
  return this.orbiter.getMessageManager().getNumMessagesReceived();
}

net.user1.orbiter.Statistics.prototype.getTotalMessagesSent = function () {
  return this.orbiter.getMessageManager().getNumMessagesSent();
};

net.user1.orbiter.Statistics.prototype.getTotalMessages = function () {
  return this.getTotalMessagesReceived() + this.getTotalMessagesSent();
};

net.user1.orbiter.Statistics.prototype.getMessagesPerSecond = function () {
  return this.messagesPerSecond;
};

//==============================================================================
// PEAK MESSAGES PER SECOND
//==============================================================================

net.user1.orbiter.Statistics.prototype.getPeakMessagesPerSecond = function () {
  return this.peakMessagesPerSecond;
};

// =============================================================================
// TIMER LISTENER
// =============================================================================

/**
 * @private 
 */
net.user1.orbiter.Statistics.prototype.statsTimerListener = function (e) {
  // Check elapsed time
  var now = new Date().getTime();
  var elapsed = now - lastTick;
  lastTick = now;
  
  // Calculate number of messages sent and received since last tick
  var totalMessages = this.getTotalMessages();
  var tickNumMsgs   = totalMessages - this.lastTotalMessages;
  this.lastTotalMessages        = totalMessages;
  this.messagesPerSecond        = Math.round((1000/elapsed) * tickNumMsgs);
  if (this.messagesPerSecond > this.peakMessagesPerSecond) {
    this.peakMessagesPerSecond = this.messagesPerSecond;
  }
};
