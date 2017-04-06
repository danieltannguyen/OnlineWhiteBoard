//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The AccountManager class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.CREATE_ACCOUNT_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.REMOVE_ACCOUNT_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.ACCOUNT_ADDED}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.ACCOUNT_REMOVED}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGOFF_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGOFF}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGIN_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGIN}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.CHANGE_PASSWORD}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.OBSERVE}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.STOP_OBSERVING}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.STOP_WATCHING_FOR_ACCOUNTS_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.WATCH_FOR_ACCOUNTS_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.OBSERVE_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.SYNCHRONIZE}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.ADD_ROLE_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.REMOVE_ROLE_RESULT}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.AccountManager = function (log) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
  
  this.watchedAccounts   = new net.user1.orbiter.AccountSet();
  this.observedAccounts  = new net.user1.orbiter.AccountSet();
  this.accountCache      = new net.user1.utils.LRUCache(10000);
  this.log               = log;
  this._isWatchingForAccounts = false;
  this.accountCache;
  this.messageManager;
  this.clientManager;
  this.roomManager;
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.AccountManager, net.user1.events.EventDispatcher);

// =============================================================================
// DEPENDENCIES
// =============================================================================
    /**
     * @private
     */    
net.user1.orbiter.AccountManager.prototype.setMessageManager = function (value) {
  this.messageManager = value;
}

/**
 * @private
 */    
net.user1.orbiter.AccountManager.prototype.setClientManager = function (value) {
  this.clientManager = value;
}

/**
 * @private
 */    
net.user1.orbiter.AccountManager.prototype.setRoomManager = function (value) {
  this.roomManager = value;
}
    
// =============================================================================
// REMOTE ACCOUNT CREATION/REMOVAL
// =============================================================================
    
net.user1.orbiter.AccountManager.prototype.createAccount = function (userID, password) {
  if (userID == null || userID == "") {
    this.log.warn("[ACCOUNT_MANAGER] Create account failed. No userID supplied.");
  } else if (password == null) {
    this.log.warn("[ACCOUNT_MANAGER] Create account failed. No password supplied.");
  } else {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.CREATE_ACCOUNT, userID, password);
  }
};
    
net.user1.orbiter.AccountManager.prototype.removeAccount = function (userID, password) {
  if (userID == null || userID == "") {
    this.log.warn("[ACCOUNT_MANAGER] Remove account failed. No userID supplied.");
  } else {
    if (password == null) {
      this.log.warn("[ACCOUNT_MANAGER] Remove account: no password supplied." +
                            " Removal will fail unless sender is an administrator.");
    } 
    this.messageManager.sendUPC(net.user1.orbiter.UPC.REMOVE_ACCOUNT, userID, password);
  }
}  
    
// =============================================================================
// CHANGE PASSWORD
// =============================================================================
    
net.user1.orbiter.AccountManager.prototype.changePassword = function (userID, newPassword, oldPassword) {
  if (userID == null || userID == "") {
    this.log.warn("[ACCOUNT_MANAGER] Change password failed. No userID supplied.");
  } else if (newPassword == null || newPassword == "") {
    this.log.warn("[ACCOUNT_MANAGER] Change password failed for account [" 
                          + userID + "]. No new password supplied.");
  } else {
    if (oldPassword == null || oldPassword == "") {
      this.log.warn("[ACCOUNT_MANAGER] Change account password for account ["
                            + userID + "]: no old password supplied."
                            + " Operation will fail unless sender is an administrator.");
      oldPassword = "";
    }
    this.messageManager.sendUPC(net.user1.orbiter.UPC.CHANGE_ACCOUNT_PASSWORD, userID, oldPassword, newPassword);
  }
};
    
// =============================================================================
// ADD/REMOVE ROLE
// =============================================================================
    
net.user1.orbiter.AccountManager.prototype.addRole = function (userID, role) {
  if (userID == null || userID == "") {
    this.log.warn("[ACCOUNT_MANAGER] Add role failed. No userID supplied.");
  } else if (role == null || role == "") {
    this.log.warn("[ACCOUNT_MANAGER] Add role failed for account [" 
                          + userID + "]. No role supplied.");
  } else {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.ADD_ROLE, userID, role);
  }
};
    
net.user1.orbiter.AccountManager.prototype.removeRole = function (userID, role) {
  if (userID == null || userID == "") {
    this.log.warn("[ACCOUNT_MANAGER] Remove role failed. No userID supplied.");
  } else if (role == null || role == "") {
    this.log.warn("[ACCOUNT_MANAGER] Remove role failed for account [" 
                          + userID + "]. No role supplied.");
  } else {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.REMOVE_ROLE, userID, role);
  }
};
    
// =============================================================================
// LOCAL ACCOUNT CREATION/REMOVAL
// =============================================================================
    
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.requestAccount = function (userID) {
  var account;
  
  if (userID == null || userID == "") {
    return null;
  } else {
    account = this.getAccount(userID);
    if (account == null) {
      account = new net.user1.orbiter.UserAccount(userID, this.log, this, this.clientManager, this.roomManager);
      account.setAttributeManager(new net.user1.orbiter.AttributeManager(account, this.messageManager, this.log));
      this.accountCache.put(userID, account);
    }
    return account;
  }
};
    
/**
 * @private
 */            
net.user1.orbiter.AccountManager.prototype.deserializeWatchedAccounts = function (ids) {
  var idList = ids.split(Tokens.RS);
  var idHash = new net.user1.utils.UDictionary();
  var len = idList.length;
  
  // Generate a hash of clientID keys to dummy values for quick lookup
  for (var i = len; --i >= 0;) {
    idHash[idList[i]] = 1; 
  }
  
  // Remove all local accounts that are not in the new list from the server
  var accountStillExists;
  for (var accountID in watchedAccounts.getAll()) {
    if (!idHash.hasOwnProperty(accountID)) {
      removeWatchedAccount(accountID);
    }
  }
      
  // Add accounts from the new list that are not known locally. Do not add
  // clients for the accounts because "watch for accounts" does not
  // include client knowledge.
  if (ids != "") {  // Empty string means no accounts are on the server
    for (accountID in idHash) {
      if (accountID != "") {
        if (!this.watchedAccounts.containsUserID(accountID)) { 
          this.addWatchedAccount(this.requestAccount(accountID));
        }
      } else {
        throw new Error("[CORE_MESSAGE_LISTENER] Received empty account id in user list (u127).");
      }
    }
  }
  
  this.fireSynchronize();
};
    
// =============================================================================
// OBSERVED ACCOUNTS
// =============================================================================
    
net.user1.orbiter.AccountManager.prototype.observeAccount = function (userID) {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.OBSERVE_ACCOUNT, userID);
};      
    
// This method is internal because the developer is expected to access
// stopObserving() through the UserAccount directly. AccountManager's 
// observeAccount() exists only to allow developers to observe a
// user that is currently unknown.
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.stopObservingAccount = function (userID) {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_OBSERVING_ACCOUNT, userID);
};      
    
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.addObservedAccount = function (account) {
  this.observedAccounts.add(account);
  this.fireObserveAccount(account.getUserID());
}
    
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.removeObservedAccount = function (userID) {
  var account = this.observedAccounts.removeByUserID(userID);
  this.fireStopObservingAccount(userID);
  return account;
}
    
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.removeAllObservedAccounts = function () {
  this.observedAccounts.removeAll();
}

net.user1.orbiter.AccountManager.prototype.isObservingAccount = function (userID) {
  return this.observedAccounts.containsUserID(userID);
}
    
//==============================================================================
// WATCH FOR ACCOUNTS
//==============================================================================

net.user1.orbiter.AccountManager.prototype.watchForAccounts = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.WATCH_FOR_ACCOUNTS);
}      

net.user1.orbiter.AccountManager.prototype.stopWatchingForAccounts = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_WATCHING_FOR_ACCOUNTS_RESULT);
}      

net.user1.orbiter.AccountManager.prototype.isWatchingForAccounts = function () {
  return this._isWatchingForAccounts;
}
    
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.setIsWatchingForAccounts = function (value) {
  this._isWatchingForAccounts = value;
}

/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.addWatchedAccount = function (account) {
  this.watchedAccounts.add(account);
  this.fireAccountAdded(account.getUserID(), account);
}

/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.removeWatchedAccount = function (userID) {
  return this.watchedAccounts.removeByUserID(userID);
}

/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.removeAllWatchedAccounts = function () {
  this.watchedAccounts.removeAll();
}

net.user1.orbiter.AccountManager.prototype.hasWatchedAccount = function (userID) {
  return this.watchedAccounts.containsUserID(userID);
}
    
// =============================================================================
// CLIENT ACCESS
// =============================================================================
        
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.getClientsForObservedAccounts = function () {
  var clients = new Object();
  var client;
  
  var accounts = this.observedAccounts.getAll();
  var account;
  for (var userID in accounts) {
    account = accounts[userID];
    client = account.getInternalClient();
    if (client != null) {
      clients[client.getClientID()] = client;
    }
  }
  
  return clients;
}
    
// =============================================================================
// LOCAL ACCOUNT ACCESS
// =============================================================================
    
net.user1.orbiter.AccountManager.prototype.getAccount = function (userID) {
  // Look in account cache
  var account = this.accountCache.get(userID);
  if (account) {
    return account;
  }
  
  // Look in observed accounts
  account = this.observedAccounts.getByUserID(userID);
  if (account) {
    return account;
  }
  
  // Look in watched accounts
  account = this.watchedAccounts.getByUserID(userID);
  if (account) {
    return account;
  }

  // Look in connected accounts
  var connectedAccounts = new Object();
  var clients = this.clientManager.getInternalClients();
  var client;
  for (var clientID in clients) {
    account = clients[clientID].getAccount();
    if (account != null && account.getUserID() == userID) {
      return account;
    }
  }
  
  return null;
};
    
net.user1.orbiter.AccountManager.prototype.selfAccount = function () {
  return this.clientManager.self().getAccount();
};
    
net.user1.orbiter.AccountManager.prototype.getAccounts = function () {
  var connectedAccounts = new Object();
  var account;
  
  var clients = this.clientManager.getInternalClients();
  var client;
  for (var clientID in clients) {
    account = client.getAccount();
    if (account != null) {
      connectedAccounts[account.getUserID()] = account;
    }
  }
  
  return net.user1.utils.ObjectUtil.combine(connectedAccounts, this.observedAccounts.getAll(), this.watchedAccounts.getAll());
};
    
net.user1.orbiter.AccountManager.prototype.accountIsKnown = function (userID) {
  for (var knownUserID in this.getAccounts()) {
    if (knownUserID == userID) {
      return true;
    }
  }
  return false;
};
    
net.user1.orbiter.AccountManager.prototype.getNumAccounts = function () {
  return this.getAccounts().length;
};

net.user1.orbiter.AccountManager.prototype.getNumAccountsOnServer = function () {
  return this.watchedAccounts.length();
};
    
net.user1.orbiter.AccountManager.prototype.getNumLoggedInAccounts = function () {
  var count; 
  var account;
  var accounts = this.getAccounts();
  for (var userID in accounts) {
    account = accounts[userID];
    if (account.isLoggedIn()) {
      count++;
    }
  }
  return count;
};
    
// =============================================================================
// LOGIN/LOGOFF
// =============================================================================

net.user1.orbiter.AccountManager.prototype.login = function (userID, password) {
  if (this.clientManager.self().getConnectionState() == net.user1.orbiter.ConnectionState.LOGGED_IN) {
    this.log.warn("[ACCOUNT_MANAGER] User [" + userID + "]: Login attempt" 
             + " ignored. Already logged in. Current client must logoff before"
             + " logging in again.");
    this.fireLoginResult(userID, net.user1.orbiter.Status.ERROR);
  } else if (userID == null) { 
    this.log.warn("[ACCOUNT_MANAGER] Login attempt" 
                  + " failed. No userID supplied.");
  } else if (password == null) {
    this.log.warn("[ACCOUNT_MANAGER] Login attempt failed for user " 
                          + "[" + userID + "] failed. No password supplied.");
  } else {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.LOGIN, userID, password);
  }
};
    
net.user1.orbiter.AccountManager.prototype.logoff = function (userID, password) {
  if (userID == null) {
    // Current client
    if (this.clientManager.self().getConnectionState() != net.user1.orbiter.ConnectionState.LOGGED_IN) {
      this.log.warn("[ACCOUNT_MANAGER] Logoff failed. The current user is not logged in.");
    } else {
      this.clientManager.self().getAccount().logoff();
    }
  } else if (userID == "") {
    // Invalid client
    this.log.warn("[ACCOUNT_MANAGER] Logoff failed. Supplied userID must not be the empty string.");
  } else {
    // UserID supplied
    if (password == null || password == "") {
      if (this.clientManager.self().getConnectionState() != net.user1.orbiter.ConnectionState.LOGGED_IN) {
        this.log.warn("[ACCOUNT_MANAGER] Logoff: no password supplied." +
                      " Operation will fail unless sender is an administrator.");
      }
      password = "";
    }
    this.messageManager.sendUPC(net.user1.orbiter.UPC.LOGOFF, userID, password);
  }
}  
    
//==============================================================================
// EVENT DISPATCHING
//==============================================================================
    
/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireCreateAccountResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.CREATE_ACCOUNT_RESULT, 
                                  userID, this.getAccount(userID), status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireRemoveAccountResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.REMOVE_ACCOUNT_RESULT, 
                                  userID, this.getAccount(userID), status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireChangePasswordResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT, 
                           status, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireAccountAdded = function (userID, account) {
  this.dispatchEvent(new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.ACCOUNT_ADDED, 
                                       userID, account));
};   

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireAccountRemoved = function (userID, account) {
  this.dispatchEvent(new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.ACCOUNT_REMOVED, 
                         userID, account));
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireLogoffResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGOFF_RESULT, 
                           status, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};  

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireLogoff = function (account, clientID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGOFF,
                           net.user1.orbiter.Status.SUCCESS, account.getUserID(), clientID);
  e.setAccount(account);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireLoginResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGIN_RESULT,
                           status, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireLogin = function (account, clientID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGIN,
                                             net.user1.orbiter.Status.SUCCESS, account.getUserID(), clientID);
  e.setAccount(account);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireChangePassword = function (userID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD,
                                             net.user1.orbiter.Status.SUCCESS, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireObserveAccount = function (userID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.OBSERVE, 
                           null, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireStopObservingAccount = function (userID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.STOP_OBSERVING, 
                           null, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireStopWatchingForAccountsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.STOP_WATCHING_FOR_ACCOUNTS_RESULT, 
                     null, null, status));
}    

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireWatchForAccountsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.WATCH_FOR_ACCOUNTS_RESULT, 
                     null, null, status));
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireObserveAccountResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.OBSERVE_RESULT, 
                           status, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireStopObservingAccountResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT, 
                           status, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireAddRoleResult = function (userID, role, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.ADD_ROLE_RESULT, 
                           status, userID, null, role);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireRemoveRoleResult  = function (userID, role, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.REMOVE_ROLE_RESULT, 
                           status, userID, null, role);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireSynchronize = function () {
  this.dispatchEvent(new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.SYNCHRONIZE));
}    
    
//==============================================================================
// CLEANUP AND DISPOSAL
//==============================================================================

/**
 * @private
 */    
net.user1.orbiter.AccountManager.prototype.cleanup = function () {
  this.log.info("[ACCOUNT_MANAGER] Cleaning resources.");
  this.removeAllObservedAccounts();
  this.removeAllWatchedAccounts();
  this.setIsWatchingForAccounts(false);
};
    