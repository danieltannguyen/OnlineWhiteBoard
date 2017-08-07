//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @private
 */
net.user1.orbiter.CollectionEvent = function (type, item) {
  net.user1.events.Event.call(this, type);
  
  this.item = item;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.CollectionEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.CollectionEvent.REMOVE_ITEM = "REMOVE_ITEM";
/** @constant */
net.user1.orbiter.CollectionEvent.ADD_ITEM = "ADD_ITEM";
    
net.user1.orbiter.CollectionEvent.prototype.getItem = function () {
  return this.item;
};

net.user1.orbiter.CollectionEvent.prototype.toString = function () {
  return "[object CollectionEvent]";
};