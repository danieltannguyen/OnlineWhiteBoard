//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.events.EventListener = function (listener,
                                           thisArg,
                                           priority) {
  this.listener   = listener;
  this.thisArg    = thisArg;
  this.priority   = priority;
};

//==============================================================================
// INSTANCE METHODS
//==============================================================================
net.user1.events.EventListener.prototype.getListenerFunction = function () {
  return this.listener;
};
    
net.user1.events.EventListener.prototype.getThisArg = function () {
  return this.thisArg;
};
    
net.user1.events.EventListener.prototype.getPriority = function () {
  return this.priority;
};

net.user1.events.EventListener.prototype.toString = function () {
  return "[object EventListener]";
};
