//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.events.Event
 */
net.user1.orbiter.AccountEvent = function (type, 
                                           status,
                                           userID,
                                           clientID,
                                           role) {
  net.user1.events.Event.call(this, type);
  
  this.status = status;
  this.userID = userID;
  this.clientID = clientID;
  this.role = role;
  this.account = null;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.AccountEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.AccountEvent.LOGIN_RESULT = "LOGIN_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.LOGIN  = "LOGIN";
/** @constant */
net.user1.orbiter.AccountEvent.LOGOFF_RESULT = "LOGOFF_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.LOGOFF = "LOGOFF";
/** @constant */
net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT = "CHANGE_PASSWORD_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.CHANGE_PASSWORD = "CHANGE_PASSWORD";
/** @constant */
net.user1.orbiter.AccountEvent.OBSERVE = "OBSERVE";
/** @constant */
net.user1.orbiter.AccountEvent.STOP_OBSERVING = "STOP_OBSERVING";
/** @constant */
net.user1.orbiter.AccountEvent.OBSERVE_RESULT = "OBSERVE_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT = "STOP_OBSERVING_RESULT";    
/** @constant */
net.user1.orbiter.AccountEvent.ADD_ROLE_RESULT = "ADD_ROLE_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.REMOVE_ROLE_RESULT = "REMOVE_ROLE_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.SYNCHRONIZE = "SYNCHRONIZE";

  
//==============================================================================
// INSTANCE METHODS
//==============================================================================    
net.user1.orbiter.AccountEvent.prototype.getAccount = function () {
  if (this.target instanceof net.user1.orbiter.AccountManager) {
    return this.account;
  } else if (this.target instanceof net.user1.orbiter.UserAccount) {
    return this.target;
  } else {
    throw new Error("[AccountEvent] Unexpected target type: " + this.target);
  }
};

/**
 * @private
 */    
net.user1.orbiter.AccountEvent.prototype.setAccount = function (value) {
  this.account = value;
};

net.user1.orbiter.AccountEvent.prototype.getUserID = function () {
  return this.userID;
};

net.user1.orbiter.AccountEvent.prototype.getRole = function () {
  return this.role;
};

net.user1.orbiter.AccountEvent.prototype.getClientID = function () {
  return this.clientID;
};

net.user1.orbiter.AccountEvent.prototype.getStatus = function () {
  return this.status;
};

net.user1.orbiter.AccountEvent.prototype.toString = function () {
  return "[object AccountEvent]";
};