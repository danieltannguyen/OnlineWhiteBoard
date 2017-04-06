//==============================================================================
// EVENT UTILITIES
//==============================================================================
/** @class */
net.user1.utils.EventUtil = new Object();

net.user1.utils.EventUtil.migrateListeners = function (oldObject, 
                                                       newObject,
                                                       events,
                                                       thisObj) {
  var len = events.length
  for (var i = 0; i < len; i += 2) {
    if (oldObject != null) {
      oldObject.removeEventListener(events[i], events[i+1], thisObj);
    }
    if (newObject != null) {
      newObject.addEventListener(events[i], events[i+1], thisObj);
    }
  }
};