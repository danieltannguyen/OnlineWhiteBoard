//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.AttributeEvent = function (type, 
                                             changedAttr,
                                             status) {
  net.user1.events.Event.call(this, type);
  
  this.changedAttr = changedAttr;
  this.status = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.AttributeEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.AttributeEvent.UPDATE = "UPDATE";
/** @constant */
net.user1.orbiter.AttributeEvent.DELETE = "DELETE";
/** @constant */
net.user1.orbiter.AttributeEvent.DELETE_RESULT = "DELETE_RESULT";
/** @constant */
net.user1.orbiter.AttributeEvent.SET_RESULT = "SET_RESULT";

//==============================================================================
// INSTANCE METHODS
//==============================================================================   
net.user1.orbiter.AttributeEvent.prototype.getChangedAttr = function () {
  return this.changedAttr;
}

net.user1.orbiter.AttributeEvent.prototype.getStatus = function () {
  return this.status;
}

net.user1.orbiter.AttributeEvent.prototype.toString = function () {
  return "[object AttributeEvent]";
}  
