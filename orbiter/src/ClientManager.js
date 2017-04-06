//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The ClientManager class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.CREATE_ACCOUNT_RESULT}</li>
  
<li class="fixedFont">{@link net.user1.orbiter.ClientEvent.OBSERVE}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientEvent.STOP_OBSERVING}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.CLIENT_CONNECTED}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.CLIENT_DISCONNECTED}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_CLIENTS_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.WATCH_FOR_CLIENTS_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientEvent.OBSERVE_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.KICK_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.BAN_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.UNBAN_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.WATCH_FOR_BANNED_ADDRESSES_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.ADDRESS_BANNED}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.ADDRESS_UNBANNED}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE_BANLIST}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/  
net.user1.orbiter.ClientManager = function (roomManager, 
                                            accountManager,
                                            connectionManager,
                                            messageManager,
                                            server,
                                            log) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
  
  this.selfReference = null;
  this.defaultClientClass = null;
  this.lifetimeClientsRequested = 0;
  
  this._isWatchingForClients;
  this._isWatchingForUsers;
  this._isWatchingForBannedAddresses;
  
  this.watchedClients  = new net.user1.orbiter.ClientSet();
  this.observedClients = new net.user1.orbiter.ClientSet();
  this.bannedAddresses = [];
  this.clientCache     = new net.user1.utils.LRUCache(5000);
  
  this.roomManager       = roomManager;
  this.accountManager    = accountManager;
  this.connectionManager = connectionManager;
  this.messageManager    = messageManager;
  this.server            = server;
  this.log               = log;
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.ClientManager, net.user1.events.EventDispatcher);

//==============================================================================
// CLIENT OBJECT CREATION AND ACCESS
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.requestClient = function (clientID) {
  var client;
  
  if (clientID == null || clientID === "") {
    throw new Error("[CLIENT_MANAGER] requestClient() called with empty clientID.");
  }
  
  client = this.getInternalClient(clientID);
  
  // If the client isn't already known
  if (client === null) {
    client = new net.user1.orbiter.Client(clientID, this, this.messageManager, this.roomManager, this.connectionManager, this.server, this.log);
    this.lifetimeClientsRequested++;
    this.clientCache.put(clientID, client);
  }

  return client;
}

net.user1.orbiter.ClientManager.prototype.getClient = function (clientID, scope) {
  var theClient;
  var theCustomClient;
  
  if (clientID === "" || clientID == null) {
    throw new Error("ClientManager.getClient() failed. Client ID must not be null or the" + 
                    " empty string.");
  }

  theClient = this.getInternalClient(clientID);
  if (theClient === null) {
    this.log.debug("[CLIENT_MANAGER] getClient() called for unknown client ID ["
              + clientID + "]."); 
    return null;
  } else {
    theCustomClient = theClient.getCustomClient(scope);
    return theCustomClient === null ? theClient : theCustomClient;
  }
};

net.user1.orbiter.ClientManager.prototype.getClients = function () {
  // Get all internal clients
  var clients = this.getInternalClients();
  var clientsList  = new Array();
  var customClient;
  
  // Replace internal clients with custom clients where available
  var client;
  for (var clientID in clients) {
    client = clients[clientID];
    customClient = client.getCustomClient(null);
    if (customClient != null) {
      clientsList.push(customClient);
    } else {
      clientsList.push(client);
    }
  }
  return clientsList;
}

net.user1.orbiter.ClientManager.prototype.getInternalClients = function () {
  var clients = net.user1.utils.ObjectUtil.combine(this.roomManager.getAllClients(),
                                                   this.accountManager.getClientsForObservedAccounts(),
                                                   this.observedClients.getAll(),
                                                   this.watchedClients.getAll());
  if (this.selfReference != null) {
    clients[this.selfReference.getClientID()] = this.selfReference;
  }
  return clients;
};

net.user1.orbiter.ClientManager.prototype.getInternalClient = function (clientID) {
  var theClient;
  
  // Error checking
  if (clientID === "" || clientID == null) {
    throw new Error("[CLIENT_MANAGER] this.getInternalClient() failed. Client ID must not be null or the" + 
                    " empty string.");
  }
  
  theClient = this.clientCache.get(clientID);
  
  if (theClient != null) {
    return theClient;
  } else {
    // Find the client...
    
    // Look in rooms
    var clients = this.roomManager.getAllClients(); 
    theClient = clients[clientID];
    if (theClient != null) {
      this.clientCache.put(clientID, theClient);
      return theClient;
    }
    
    // Look in observed accounts
    clients = this.accountManager.getClientsForObservedAccounts();
    theClient = clients[clientID];
    if (theClient != null) {
      this.clientCache.put(clientID, theClient);
      return theClient;
    }

    // Look in observed clients
    theClient = this.observedClients.getByClientID(clientID);
    if (theClient != null) {
      this.clientCache.put(clientID, theClient);
      return theClient;
    }

    // Look in watched clients
    theClient = this.watchedClients.getByClientID(clientID);
    if (theClient != null) {
      this.clientCache.put(clientID, theClient);
      return theClient;
    }
  }
  
  // Client not found
  return null;
}

net.user1.orbiter.ClientManager.prototype.getClientByUserID = function (userID, scope) {
  var theClient;
  var theCustomClient;
  var account;
  
  if (userID === "" || userID == null) {
    throw new Error("ClientManager.getClientByUserID() failed. User ID must not be null or the" + 
                    " empty string.");
  }

  // Search for the client in all known clients
  var client;
  var clients = this.getInternalClients();
  for (var clientID in clients) {
    client = clients[clientID];
    account = client.getAccount();
    if (account != null && account.getUserID() === userID) {
      theClient = client;
      break;
    }
  }
  
  if (theClient === null) {
    this.log.debug("[CLIENT_MANAGER] getClientByUserID() called for unknown user ID ["
              + userID + "]."); 
    return null;
  } else {
    theCustomClient = theClient.getCustomClient(scope);
    return theCustomClient === null ? theClient : theCustomClient;
  }
};

net.user1.orbiter.ClientManager.prototype.getClientByAttribute  = function (attributeName,
                                                                            attributeValue,
                                                                            attributeScope,
                                                                            roomScope) {
  var theCustomClient;
  
  // Validate
  if (attributeName == null || attributeName === "") {
    return null;
  }
  
  // Search for the client in all known clients
  var client;
  var clients = this.getInternalClients();
  for (var clientID in clients) {
    client = clients[clientID];
    if (client.getAttribute(attributeName, attributeScope)
        === attributeValue) {
      theCustomClient = client.getCustomClient(roomScope);
      return theCustomClient === null ? client : theCustomClient;
    }
  }
  return null;
};

net.user1.orbiter.ClientManager.prototype.clientIsKnown = function (clientID) {
  return this.getInternalClients()[clientID] !== null;
};

// =============================================================================
// WATCHED CLIENTS
// =============================================================================

net.user1.orbiter.ClientManager.prototype.watchForClients = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.WATCH_FOR_CLIENTS);
};   

net.user1.orbiter.ClientManager.prototype.stopWatchingForClients = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_WATCHING_FOR_CLIENTS);
};     

net.user1.orbiter.ClientManager.prototype.isWatchingForClients = function () {
  return this._isWatchingForClients;
};

net.user1.orbiter.ClientManager.prototype.hasWatchedClient = function (clientID) {
  return this.watchedClients.containsClientID(clientID);
};
    
/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.setIsWatchingForClients = function (value) {
  this._isWatchingForClients = value;
};
    
/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.addWatchedClient = function (client) {
  var customClient = client.getCustomClient(null);
  this.watchedClients.add(client);
  this.fireClientConnected(customClient === null ? client : customClient);      
};

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.removeWatchedClient = function (clientID) {
  this.watchedClients.removeByClientID(clientID);
};

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.removeAllWatchedClients = function () {
  this.watchedClients.removeAll();
};
    
/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.deserializeWatchedClients = function (ids) {
  var idList = ids.split(net.user1.orbiter.Tokens.RS);
  var idHash = new Object();
  var localClients = this.watchedClients.getAll();
  var len = idList.length;
  var theClient;
  var accountID;
  
  // Client list received, so set isWatchingForClients now, otherwise, code 
  // with side-effects may take action against the clients being added
   this.setIsWatchingForClients(true);
  
  // Generate a hash of clientID keys to accountID values
  for (var i = len-2; i >= 0; i-=2) {
    idHash[idList[i]] = idList[i+1]; 
  }
  
  // Remove all local clients that are not in the new list from the server
  var clientStillExists;
  for (var clientID in localClients) {
    if (!idHash.hasOwnProperty(clientID)) {
      // For best performance, use direct access rather than removeByClientID()
      delete localClients[clientID];
    }
  }      
  
  // Add all new clients that are not in the local set
  for (clientID in idHash) {
    if (clientID != "") {
      if (!this.watchedClients.containsClientID(clientID)) {
        theClient = this.requestClient(clientID);
        accountID = idHash[clientID]; 
        if (accountID != "") {
          theClient.setAccount(this.accountManager.requestAccount(accountID));
        }
        this.addWatchedClient(theClient);
      }
    } else {
      throw new Error("[CLIENT_MANAGER] Received empty client id in client list (u101).");
    }
  }
  
  this.fireSynchronize();
};

// =============================================================================
// OBSERVED CLIENTS
// =============================================================================

net.user1.orbiter.ClientManager.prototype.observeClient = function (clientID) {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.OBSERVE_CLIENT, clientID);
};      

net.user1.orbiter.ClientManager.prototype.isObservingClient = function (clientID) {
  return this.observedClients.containsClientID(clientID);
}

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.addObservedClient = function (client) {
  var customClient = client.getCustomClient(null);
  this.observedClients.add(client);
  this.fireObserveClient(customClient === null ? client : customClient);
};

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.removeObservedClient = function (clientID) {
  var client = this.observedClients.removeByClientID(clientID);
  var customClient;
  if (client != null) {
    customClient = client.getCustomClient(null);
    this.fireStopObservingClient(customClient === null ? client : customClient);
  }
};

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.removeAllObservedClients = function () {
  this.observedClients.removeAll();
};

//==============================================================================
// CLIENT ATTRIBUTE ACCESS
//==============================================================================

net.user1.orbiter.ClientManager.prototype.getAttributeForClients = function (clientIDs,
                                                                             attrName, 
                                                                             attrScope) {
  var clientAttributes = new Array();
  var thisClient;
  
  for (var i = 0; i < clientIDs.length; i++) {
    thisClient = this.getInternalClient(clientIDs[i]);
    if (thisClient != null) {
      clientAttributes.push({clientID: clientIDs[i],
          value: thisClient.getAttribute(attrName, attrScope)});
    } else {
      this.log.debug("[CLIENT_MANAGER] Attribute retrieval failed during "
                + " getAttributeForClients(). Unknown client ID [" + clientIDs[i] + "]");
    }
  }
  return clientAttributes;
};

//==============================================================================
// CUSTOM CLIENT MANAGEMENT
//==============================================================================

net.user1.orbiter.ClientManager.prototype.setDefaultClientClass = function (defaultClass) {
  this.defaultClientClass = defaultClass;
};

net.user1.orbiter.ClientManager.prototype.getDefaultClientClass = function () {
  return this.defaultClientClass;
};

//==============================================================================
// CURRENT CLIENT ASSIGNMENT AND ACCESS
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.self = function () {
  return this.selfReference;
}

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.setSelf = function (client) {
  this.selfReference = client;
  client.setIsSelf();
}

//==============================================================================
// CLIENT MESSAGING
//==============================================================================

net.user1.orbiter.ClientManager.prototype.sendMessage = function (messageName, 
                                                                  clientIDs,
                                                                  filters) {
  var rest = Array.prototype.slice.call(arguments).slice(3);
  
  // An array of arguments to send to the server.
  var args;

  // Can't continue without a valid methodName.
  if (messageName == null || messageName == "") {
    this.log.warn("[CLIENT_MANAGER] sendMessage() failed. No messageName supplied.");
    return;
  }
  
  // Send the UPC.
  args = [net.user1.orbiter.UPC.SEND_MESSAGE_TO_CLIENTS, 
          messageName, 
          clientIDs.join(net.user1.orbiter.Tokens.RS),
          filters != null ? filters.toXMLString() : ""];
  this.messageManager.sendUPC.apply(this.messageManager, args.concat(rest));
};

// =============================================================================
// BAN / UNBAN / KICK
// =============================================================================

net.user1.orbiter.ClientManager.prototype.ban = function (address, duration, reason) {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.BAN, address, null, duration.toString(), reason);
};

net.user1.orbiter.ClientManager.prototype.unban = function (address) {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.UNBAN, address);
};

net.user1.orbiter.ClientManager.prototype.kickClient = function (clientID) {
  if (clientID == null || clientID == "") {
    this.log.warn("[CLIENT_MANAGER] Kick attempt failed. No clientID supplied.");
  }
  this.messageManager.sendUPC(net.user1.orbiter.UPC.KICK_CLIENT, clientID);
}

// =============================================================================
// WATCH BANNED ADDRESSES
// =============================================================================

net.user1.orbiter.ClientManager.prototype.watchForBannedAddresses = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.WATCH_FOR_BANNED_ADDRESSES);
};

net.user1.orbiter.ClientManager.prototype.stopWatchingForBannedAddresses = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_WATCHING_FOR_BANNED_ADDRESSES);
};

/**
 * @private
 */  
net.user1.orbiter.ClientManager.prototype.setWatchedBannedAddresses = function (bannedList) {
  this.bannedAddresses = bannedList;
  this.fireSynchronizeBanlist();
};

/**
 * @private
 */  
net.user1.orbiter.ClientManager.prototype.addWatchedBannedAddress = function (address) {
  this.bannedAddresses.push(address);
  this.fireAddressBanned(address);
};

/**
 * @private
 */  
net.user1.orbiter.ClientManager.prototype.removeWatchedBannedAddress = function (address) {
  var idx = net.user1.util.ArrayUtil.indexOf(bannedAddresses, address);
  if (idx === -1) {
    this.log.warn("[CLIENT_MANAGER] Request to remove watched banned address failed."
             + " Address not found.");
  }
  this.bannedAddresses.splice(idx, 1);
  this.fireAddressUnbanned(address);
}

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.setIsWatchingForBannedAddresses = function (value) {
  this._isWatchingForBannedAddresses = value;
};

net.user1.orbiter.ClientManager.prototype.isWatchingForBannedAddresses = function () {
  return this._isWatchingForBannedAddresses;
};

net.user1.orbiter.ClientManager.prototype.getBannedAddresses = function () {
  return this.bannedAddresses.slice(0);
};

//==============================================================================
// STATISTICS
//==============================================================================

net.user1.orbiter.ClientManager.prototype.getLifetimeNumClientsKnown = function () {
  // -1 for each "ready" state the connection has achieved because we don't
  // count the current client ("self")
  return this.lifetimeClientsRequested-this.connectionManager.getReadyCount();
};

net.user1.orbiter.ClientManager.prototype.getNumClients = function () {
  return net.user1.utils.ObjectUtil.length(this.getInternalClients());
};

net.user1.orbiter.ClientManager.prototype.getNumClientsOnServer = function () {
  return this.watchedClients.length();
}

//==============================================================================
// EVENT DISPATCHING
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireObserveClient = function (client) {
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.OBSERVE, null, null, null, client);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireStopObservingClient = function (client) {
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.STOP_OBSERVING, null, null, null, client);
  this.dispatchEvent(e);
}; 

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireClientConnected = function (client) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.CLIENT_CONNECTED, 
                                                              client.getClientID(), client));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireClientDisconnected = function (client) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.CLIENT_DISCONNECTED, 
                                                              client.getClientID(), client));
};   

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireStopWatchingForClientsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_CLIENTS_RESULT, 
                                                              null, null, null, status));
};   

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireWatchForClientsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.WATCH_FOR_CLIENTS_RESULT, 
                                                              null, null, null, status));
};   

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireObserveClientResult = function (clientID, status) {
  this.dispatchEvent(new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.OBSERVE_RESULT, 
                                       null, null, null, this.getClient(clientID), status, clientID));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireStopObservingClientResult = function (clientID, status) {
  this.dispatchEvent(new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT, 
                                                       null, null, null, this.getClient(clientID), status, clientID));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireKickClientResult = function (clientID, status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.KICK_RESULT, 
                                                              clientID, null, null, status));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireBanClientResult = function (address, clientID, status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.BAN_RESULT, 
                                                              clientID, null, address, status));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireUnbanClientResult = function (address, status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.UNBAN_RESULT, 
                                                              null, null, address, status));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireWatchForBannedAddressesResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.WATCH_FOR_BANNED_ADDRESSES_RESULT, 
                                                              null, null, null, status));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireStopWatchingForBannedAddressesResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT, 
                                                              null, null, null, status));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireAddressBanned = function (address) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.ADDRESS_BANNED, 
                                                              null, null, address));
}; 

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireAddressUnbanned = function (address) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.ADDRESS_UNBANNED, 
                                                              null, null, address));
}; 

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireSynchronizeBanlist = function () {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE_BANLIST));
};        

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireSynchronize = function () {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE));
};        

//==============================================================================
// CLEANUP AND DISPOSAL
//==============================================================================

/**
 * @private
 */    
net.user1.orbiter.ClientManager.prototype.cleanup = function () {
  this.log.info("[CLIENT_MANAGER] Cleaning resources.");
  this.selfReference = null;
  this.removeAllObservedClients();
  this.removeAllWatchedClients();
  this.setIsWatchingForClients(false);
};   

net.user1.orbiter.ClientManager.prototype.dispose = function () {
  this.log.info("[CLIENT_MANAGER] Disposing resources.");
  this.watchedClients = null;
  this.observedClients = null;
  this.defaultClientClass = null;
};
