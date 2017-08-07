//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.events.Event
 */
net.user1.orbiter.snapshot.SnapshotEvent = function (type,
                                            snapshot) {
  net.user1.events.Event.call(this, type);
  this.snapshot = snapshot;
};
  
//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.SnapshotEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.snapshot.SnapshotEvent.LOAD = "LOAD";
/** @constant */
net.user1.orbiter.snapshot.SnapshotEvent.STATUS = "STATUS";

net.user1.orbiter.snapshot.SnapshotEvent.prototype.toString = function () {
  return "[object SnapshotEvent]";
};