//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.ServerEvent = function (type, 
                                          upcProcessingRecord,
                                          status) {
  net.user1.events.Event.call(this, type);
  
  this.upcProcessingRecord = upcProcessingRecord;
  this.status = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.ServerEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.ServerEvent.TIME_SYNC = "TIME_SYNC";
/** @constant */
net.user1.orbiter.ServerEvent.UPC_PROCESSED = "UPC_PROCESSED";
/** @constant */
net.user1.orbiter.ServerEvent.WATCH_FOR_PROCESSED_UPCS_RESULT = "WATCH_FOR_PROCESSED_UPCS_RESULT";
/** @constant */
net.user1.orbiter.ServerEvent.STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT = "STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT";
/** @constant */
net.user1.orbiter.ServerEvent.RESET_UPC_STATS_RESULT = "RESET_UPC_STATS_RESULT";

//==============================================================================
// VARIABLES
//==============================================================================
net.user1.orbiter.ServerEvent.prototype.getUPCProcessingRecord = function () {
  return upcProcessingRecord;
}
  
net.user1.orbiter.ServerEvent.prototype.getStatus = function () {
  return status;
}
    

net.user1.orbiter.ServerEvent.prototype.toString = function () {
  return "[object ServerEvent]";
};