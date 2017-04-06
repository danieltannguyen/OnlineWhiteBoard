//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The UserAccount class dispatches the following events:

<ul class="summary">
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGIN}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGOFF_RESULT}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGOFF}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.CHANGE_PASSWORD}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.SYNCHRONIZE}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.OBSERVE}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.OBSERVE_RESULT}</li>  
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.STOP_OBSERVING}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.ADD_ROLE_RESULT}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.REMOVE_ROLE_RESULT}</li>    
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/

net.user1.orbiter.UserAccount = function (userID, 
                                          log,
                                          accountManager,
                                          clientManager,
                                          roomManager) {
  net.user1.events.EventDispatcher.call(this);
  
  this.userID = userID;
  this.attributeManager = null;
  this.connectionState = 0;
  this.password = null;
  this.lastAttemptedPassword = null;
  this._client = null;
  this._accountManager = null;
  this._clientManager = null;
  this._roomManager = null;
  this._log = null;
  
  this.setLog(log);
  this.setAccountManager(accountManager);
  this.setClientManager(clientManager);
  this.setRoomManager(roomManager);
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.UserAccount, net.user1.events.EventDispatcher);

//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @private */    
net.user1.orbiter.UserAccount.FLAG_MODERATOR = 1 << 1;
    
//==============================================================================
// DEPENDENCIES
//==============================================================================

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getAttributeCollection = function () {
  return this.attributeManager.getAttributeCollection();
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setAttributeManager = function (value) {
  this.attributeManager = value;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getAttributeManager = function () {
  return this.attributeManager;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getClientManager = function () {
  return this._clientManager;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setClientManager = function (value) {
  this._clientManager = value;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getRoomManager = function () {
  return this._roomManager;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setRoomManager = function (value) {
  this._roomManager = value;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getLog = function () {
  return this._log;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setLog = function (value) {
  this._log = value;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getAccountManager = function () {
  return this._accountManager;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setAccountManager = function (value) {
  this._accountManager = value;
};

net.user1.orbiter.UserAccount.prototype.getClient = function () {
  var customClient;
  this.validateClientReference();
  if (this._client != null) {
    customClient = this._client.getCustomClient(null);
    return customClient == null ? this._client : customClient;
  } else {
    return null;
  }
};

net.user1.orbiter.UserAccount.prototype.getInternalClient = function () {
  this.validateClientReference();
  return this._client;
}

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setClient = function (value) {
  if (value == null) {
    this._client = null;
  } else {
    if (this._client != value) {
      this._client = value;
      this._client.setAccount(this);
    }
  }
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.validateClientReference = function () {
  if (this._client != null) {
    if (!this._client.isSelf()
        && !this._clientManager.isWatchingForClients()
        && !this._accountManager.isObservingAccount(this.getUserID()) 
        && !this._clientManager.isObservingClient(this._client.getClientID())
        && !this._roomManager.clientIsKnown(this._client.getClientID())) {
      this.setClient(null);
    }
  }
};

//==============================================================================
// IS SELF
//==============================================================================

net.user1.orbiter.UserAccount.prototype.isSelf = function () {
  return this._client == null ? false : this._client.isSelf();
};

//==============================================================================
// CONNECTION STATE
//==============================================================================

net.user1.orbiter.UserAccount.prototype.getConnectionState = function () {
  if (this.getInternalClient() != null) {
    return net.user1.orbiter.ConnectionState.LOGGED_IN;
  } else if (!this._accountManager.isObservingAccount(this.getUserID())) {
      return net.user1.orbiter.ConnectionState.NOT_CONNECTED;
  } else if (this._clientManager.isWatchingForClients()) {
    return net.user1.orbiter.ConnectionState.NOT_CONNECTED;
  } else {
    // Not observing this user, not watching for clients, and no client means
    // this account's state is unknown. (This happens when watching for user
    // accounts).
    return net.user1.orbiter.ConnectionState.UNKNOWN;
  }
};

net.user1.orbiter.UserAccount.prototype.isLoggedIn = function () {
  return this.getConnectionState() == net.user1.orbiter.ConnectionState.LOGGED_IN;
};

//==============================================================================
// USER ID
//==============================================================================

net.user1.orbiter.UserAccount.prototype.getUserID = function () {
  return this.userID;
};

/**
 * @private
 */ 
net.user1.orbiter.UserAccount.prototype.setUserID = function (userID) {
  if (this.userID != userID) {
    this.userID = userID;
  }
};

// =============================================================================
// LOGOFF
// =============================================================================

net.user1.orbiter.UserAccount.prototype.logoff = function (password) {
  this._accountManager.logoff(this.getUserID(), password);
};

// =============================================================================
// CHANGE PASSWORD
// =============================================================================

net.user1.orbiter.UserAccount.prototype.changePassword = function (newPassword, oldPassword) {
  this._accountManager.changePassword(this.getUserID(), newPassword, oldPassword);
};

// =============================================================================
// ROLES
// =============================================================================

net.user1.orbiter.UserAccount.prototype.addRole = function (role) {
  this._accountManager.addRole(this.getUserID(), role);
};

net.user1.orbiter.UserAccount.prototype.removeRole = function (userID, role) {
  this._accountManager.removeRole(this.getUserID(), role);
};

net.user1.orbiter.UserAccount.prototype.isModerator = function () {
  var rolesAttr = this.getAttribute(net.user1.orbiter.Tokens.ROLES_ATTR);
  var roles;
  if (rolesAttr != null) {
    return (parseInt(rolesAttr) & UserAccount.FLAG_MODERATOR) > 0;
  } else {
    this.getLog().warn(this.toString() + " Could not determine moderator status because the account is not synchronized.");
    return false;
  }
};

// =============================================================================
// LOGIN/LOGOFF TASKS
// =============================================================================

/**
 * @private
 */ 
net.user1.orbiter.UserAccount.prototype.doLoginTasks = function () {
  this.fireLogin();
};

/**
 * @private
 */ 
net.user1.orbiter.UserAccount.prototype.doLogoffTasks = function () {
  this.setClient(null);
  this.fireLogoff();
};

// =============================================================================
// OBSERVATION
// =============================================================================

net.user1.orbiter.UserAccount.prototype.observe = function () {
  this._accountManager.observeAccount(this.getUserID());
};

net.user1.orbiter.UserAccount.prototype.stopObserving = function () {
  this._accountManager.stopObservingAccount(this.getUserID());
};

// =============================================================================
// ATTRIBUTES: PUBLIC API
// =============================================================================

net.user1.orbiter.UserAccount.prototype.setAttribute = function (attrName, 
                                                                 attrValue, 
                                                                 attrScope, 
                                                                 isShared, 
                                                                 evaluate) {
  // Create an integer to hold the attribute options
  var attrOptions = net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT
                      | (isShared     ? net.user1.orbiter.AttributeOptions.FLAG_SHARED     : 0) 
                      | (evaluate     ? net.user1.orbiter.AttributeOptions.FLAG_EVALUATE   : 0);
  
  // Set the attribute on the server.
  this.attributeManager.setAttribute(new net.user1.orbiter.upc.SetClientAttr(attrName, attrValue, attrOptions, attrScope, null, this.getUserID()));
};

net.user1.orbiter.UserAccount.prototype.deleteAttribute = function (attrName, attrScope) {
  var deleteRequest = new net.user1.orbiter.upc.RemoveClientAttr(null, this.getUserID(), attrName, attrScope);
  this.attributeManager.deleteAttribute(deleteRequest);
};

net.user1.orbiter.UserAccount.prototype.getAttribute = function (attrName, attrScope) {
  return this.attributeManager.getAttribute(attrName, attrScope);
};

net.user1.orbiter.UserAccount.prototype.getAttributes = function () {
  return this.attributeManager.getAttributes();
}; 

net.user1.orbiter.UserAccount.prototype.getAttributesByScope = function (scope) {
  return this.attributeManager.getAttributesByScope(scope);
};

//==============================================================================
// TOSTRING
//==============================================================================

net.user1.orbiter.UserAccount.prototype.toString = function () {
  return "[USER_ACCOUNT userid: " + this.getUserID() + ", clientid: " + (this._client == null ? "" : this._client.getClientID()) + "]";
};

//==============================================================================
// EVENT DISPATCHING
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireLogin = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGIN,
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};    

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireLogoffResult = function (status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGOFF_RESULT,
                                             status, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};    

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireLogoff = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGOFF,
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};    

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireChangePasswordResult = function (status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT,
                                             status, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};    

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireChangePassword = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD,
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};    

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireSynchronize = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.SYNCHRONIZE, 
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireObserve = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.OBSERVE, 
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireObserveResult = function (status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.OBSERVE_RESULT, 
                                             status, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireStopObserving = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.STOP_OBSERVING, 
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireStopObservingResult = function (status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT, 
                                             status, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireAddRoleResult = function (role, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.ADD_ROLE_RESULT, 
                                             status, this.getUserID(), 
                                             (this._client == null ? null : this._client.getClientID()), role);
  this.dispatchEvent(e);
}

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireRemoveRoleResult = function (role, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.REMOVE_ROLE_RESULT, 
                                             status, this.getUserID(), 
                                             (this._client == null ? null : this._client.getClientID()), role);
  this.dispatchEvent(e);
}













