//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.events.Event = function (type) {
  if (type !== undefined) {
    this.type = type;
  } else {
    throw new Error("Event creation failed. No type specified. Event: " + this);
  }
  this.target = null;
};
    
net.user1.events.Event.prototype.toString = function () {
  return "[object Event]";
};
