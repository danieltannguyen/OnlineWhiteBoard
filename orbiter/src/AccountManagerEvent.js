//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.AccountManagerEvent = function (type, 
                                                  userID,
                                                  account,
                                                  status) {
  net.user1.events.Event.call(this, type);
  
  this.account = account;
  this.userID = userID;
  this.status = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.AccountManagerEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.AccountManagerEvent.CREATE_ACCOUNT_RESULT = "CREATE_ACCOUNT_RESULT";
/** @constant */
net.user1.orbiter.AccountManagerEvent.REMOVE_ACCOUNT_RESULT = "REMOVE_ACCOUNT_RESULT";
/** @constant */
net.user1.orbiter.AccountManagerEvent.ACCOUNT_ADDED = "ACCOUNT_ADDED";
/** @constant */
net.user1.orbiter.AccountManagerEvent.ACCOUNT_REMOVED = "ACCOUNT_REMOVED";    
/** @constant */
net.user1.orbiter.AccountManagerEvent.WATCH_FOR_ACCOUNTS_RESULT = "WATCH_FOR_ACCOUNTS_RESULT";
/** @constant */
net.user1.orbiter.AccountManagerEvent.STOP_WATCHING_FOR_ACCOUNTS_RESULT = "STOP_WATCHING_FOR_ACCOUNTS_RESULT";
/** @constant */
net.user1.orbiter.AccountManagerEvent.SYNCHRONIZE = "SYNCHRONIZE";    

//==============================================================================
// INSTANCE METHODS
//==============================================================================   
net.user1.orbiter.AccountManagerEvent.prototype.getStatus = function () {
  return this.status;
};
   
net.user1.orbiter.AccountManagerEvent.prototype.getUserID = function () {
  return this.userID;
};

net.user1.orbiter.AccountManagerEvent.prototype.getAccount = function () {
  return this.account;
};

net.user1.orbiter.AccountManagerEvent.prototype.toString = function () {
  return "[object AccountManagerEvent]";
};
