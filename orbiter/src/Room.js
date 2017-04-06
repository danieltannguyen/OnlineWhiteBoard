//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The Room class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.JOIN}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.JOIN_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.LEAVE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.LEAVE_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.ADD_OCCUPANT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.ADD_OBSERVER}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.REMOVE_OBSERVER}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.UPDATE_CLIENT_ATTRIBUTE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.DELETE_CLIENT_ATTRIBUTE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.OCCUPANT_COUNT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.OSERVER_COUNT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.SYNCHRONIZE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.OBSERVE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.OBSERVE_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.STOP_OBSERVING}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.REMOVED}</li> 
<li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.DELETE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.UPDATE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.SET_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.DELETE_RESULT}</li> 
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.Room = function (id,
                                   roomManager,
                                   messageManager,
                                   clientManager,
                                   accountManager,
                                   log) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);

  // Variables
  this.disposed = false;
  this.id = null;
  this.syncState = null;
  this._clientIsInRoom = false;
  this._clientIsObservingRoom = false;
  this.numOccupants = 0;
  this.numObservers = 0;
  this.defaultClientClass = null;

  // Initialization  
  this.setRoomID(id);
  this.roomManager    = roomManager;
  this.messageManager = messageManager;
  this.clientManager  = clientManager;
  this.accountManager = accountManager;
  this.log = log;

  this.occupantList     = new net.user1.orbiter.ClientSet();
  this.observerList     = new net.user1.orbiter.ClientSet();
  this.attributeManager = new net.user1.orbiter.AttributeManager(this, this.messageManager, this.log);

  this.setSyncState(net.user1.orbiter.SynchronizationState.NOT_SYNCHRONIZED);
}

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.Room, net.user1.events.EventDispatcher);

// =============================================================================
// DEPENDENCIES
// =============================================================================
/** @private */
net.user1.orbiter.Room.prototype.getAttributeManager = function () {
  return this.attributeManager;
};   

// =============================================================================
// ROOM ID MANAGEMENT
// =============================================================================

 /**
  * @private
  */
net.user1.orbiter.Room.prototype.setRoomID = function (roomID) {
  var errorMsg;
  if (!net.user1.orbiter.Validator.isValidResolvedRoomID(roomID)) {
    errorMsg = "Invalid room ID specified during room creation. Offending ID: " + roomID;
    this.log.error(errorMsg);
    throw new Error(errorMsg);
  }
  this.id = roomID;
};
  
net.user1.orbiter.Room.prototype.getRoomID = function () {
  return this.id;
};

net.user1.orbiter.Room.prototype.getSimpleRoomID = function () {
  return net.user1.orbiter.RoomIDParser.getSimpleRoomID(this.id);
};

net.user1.orbiter.Room.prototype.getQualifier = function () {
  return net.user1.orbiter.RoomIDParser.getQualifier(this.id);
};
  
// =============================================================================
// JOIN/LEAVE
// =============================================================================
  
net.user1.orbiter.Room.prototype.join = function (password,
                                                  updateLevels) {
  if (this.disposed) return;
  
  // Client can't join a room the its already in.
  if (this.clientIsInRoom()) {
    this.log.warn(this + "Room join attempt aborted. Already in room.");
    return;
  }
  // Validate the password
  if (password == null) {
    password = "";
  }
  if (!net.user1.orbiter.Validator.isValidPassword(password)) {
    this.log.error(this + "Invalid room password supplied to join(). "
                   + " Join request not sent. See Validator.isValidPassword().");
    return;
  }
  
  // If any update levels are specified, send them before joining.
  if (updateLevels != null) {
    this.setUpdateLevels(updateLevels);
  }

  this.messageManager.sendUPC(net.user1.orbiter.UPC.JOIN_ROOM, 
                              this.getRoomID(), 
                              password);
};
  
net.user1.orbiter.Room.prototype.leave = function () {
  if (this.disposed) return;
  
  if (this.clientIsInRoom()) {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.LEAVE_ROOM, this.getRoomID());
  } else {
    this.log.debug(this + " Leave-room request ignored. Not in room.");
  }
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.doJoin = function () {
  this._clientIsInRoom = true;
  this.fireJoin();
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.doJoinResult = function (status) {
  this.fireJoinResult(status);
};
    
    /**
     * @private
     */
net.user1.orbiter.Room.prototype.doLeave = function () {
  var rid = this.getRoomID();

  // If the client is not observing the room, then dispose
  // of all of the room's information.
  if (!this.clientIsObservingRoom()) {
    this.purgeRoomData();
  }
    
  // Note that the client is no longer in this room.
  this._clientIsInRoom = false;
  this.fireLeave();
}

/**
 * @private
 */
net.user1.orbiter.Room.prototype.doLeaveResult = function (status) {
  this.fireLeaveResult(status);
};
    
//==============================================================================
// MESSAGING
//==============================================================================

net.user1.orbiter.Room.prototype.sendMessage = function (messageName, 
                                                         includeSelf,
                                                         filters) {
  if (this.disposed) return;
  
  // Delegate to RoomManager.sendMessage()
  var rest = Array.prototype.slice.call(arguments).slice(3)
  var roomMan = this.roomManager;
  var args = [messageName, 
             [this.getRoomID()],
             includeSelf,
             filters != null ? filters : null];
  roomMan.sendMessage.apply(roomMan, args.concat(rest));
};

net.user1.orbiter.Room.prototype.addMessageListener = function (message, listener, thisArg) {
  if (this.messageManager != null) {
    this.messageManager.addMessageListener(message,
                                           listener, 
                                           thisArg,
                                           [this.getRoomID()]);
  }
};

net.user1.orbiter.Room.prototype.removeMessageListener = function (message, listener) {
  if (this.messageManager != null) {
    this.messageManager.removeMessageListener(message, 
                                              listener);
  }
};

net.user1.orbiter.Room.prototype.hasMessageListener = function (message,
                                                                listener) {
  // First, get the list of messsage listeners for this message
  var listeners = this.messageManager.getMessageListeners(message);
  var messageListener;
  for (var i = 0; i < listeners.length; i++) {
    messageListener = listeners[i];
    var listenerRoomIDs = messageListener.getForRoomIDs();
    // ===== Run once for each room id =====
    var listenerRoomID;
    for (var j = 0; j < listenerRoomIDs.length; j++) {
      listenerRoomID = listenerRoomIDs[i];
      if (listenerRoomID == this.getRoomID()) {
        return true;
      }
    }
  }
  return false;
};

//==============================================================================
// SYNCHRONIZATION
//==============================================================================
    
/**
 * @private
 */        
net.user1.orbiter.Room.prototype.synchronize = function (manifest) {
  var oldSyncState = this.getSyncState();
  this.log.debug(this + " Begin synchronization.");
  this.setSyncState(net.user1.orbiter.SynchronizationState.SYNCHRONIZING);

  // SYNC ROOM ATTRIBUTES
  this.getAttributeManager().getAttributeCollection().synchronizeScope(net.user1.orbiter.Tokens.GLOBAL_ATTR, manifest.attributes);
  if (this.disposed) {
    return;
  }

  // SYNC OCCUPANT LIST
  var oldOccupantList = this.getOccupantIDs();
  var newOccupantList = [];
  var thisOccupantClientID;
  var thisOccupantUserID;
  var thisOccupant;
  var thisOccupantAccount;
  
  // Add all unknown occupants to the room's occupant list, and
  // synchronize all existing occupants.
  for (var i = manifest.occupants.length; --i >= 0;) {
    thisOccupantClientID = manifest.occupants[i].clientID;
    thisOccupantUserID = manifest.occupants[i].userID;
    
    newOccupantList.push(thisOccupantClientID);
    
    thisOccupant = this.clientManager.requestClient(thisOccupantClientID);
    // Init user account, if any
    thisOccupantAccount = this.accountManager.requestAccount(thisOccupantUserID);
    if (thisOccupantAccount != null) {
      thisOccupant.setAccount(thisOccupantAccount);
    }
    
    // If it's not the current client, update it.
    // The current client obtains its attributes through separate u8s.
    if (!thisOccupant.isSelf()) {
      thisOccupant.synchronize(manifest.occupants[i]);
    }
    
    this.addOccupant(thisOccupant);
    if (this.disposed) {
      return;
    }
  }
  
  // Remove occupants that are now gone...
  var oldClientID;
  for (i = oldOccupantList.length; --i >= 0;) {
    oldClientID = oldOccupantList[i];
    if (net.user1.utils.ArrayUtil.indexOf(newOccupantList, oldClientID) == -1) {
      this.removeOccupant(oldClientID);
      if (this.disposed) {
        return;
      }
    }
  }

  // SYNC OBSERVER LIST
  var oldObserverList = this.getObserverIDs();
  var newObserverList = [];
  var thisObserverClientID;
  var thisObserverUserID;
  var thisObserver;
  var thisObserverAccount;
  
  // Add all unknown observers to the room's observer list, and
  // synchronize all existing observers.
  for (i = manifest.observers.length; --i >= 0;) {
    thisObserverClientID = manifest.observers[i].clientID;
    thisObserverUserID = manifest.observers[i].userID;
    
    newObserverList.push(thisObserverClientID);
    
    thisObserver = this.clientManager.requestClient(thisObserverClientID);
    // Init user account, if any
    thisObserverAccount = this.accountManager.requestAccount(thisObserverUserID);
    if (thisObserverAccount != null) {
      thisObserver.setAccount(thisObserverAccount);
    }
    
    // If it's not the current client, update it.
    // The current client obtains its attributes through separate u8s.
    if (!thisObserver.isSelf()) {
      thisObserver.synchronize(manifest.observers[i]);
    }
    
    this.addObserver(thisObserver);
    if (this.disposed) {
      return;
    }
  }
  
  // Remove observers that are now gone...
  var oldClientID;
  for (i = oldObserverList.length; --i >= 0;) {
    oldClientID = oldObserverList[i]
    if (net.user1.utils.ArrayUtil.indexOf(newObserverList, oldClientID) == -1) {
      this.removeObserver(oldClientID);
      if (this.disposed) {
        return;
      }
    }
  }
  
  // UPDATE CLIENT COUNTS
  //   If a client list is available, use its length to calculate the
  //   client count. That way, the list length and the "get count" method
  //   return values will be the same (e.g., getOccupants().length and
  //   getNumOccupants()). Otherwise, rely on the server's reported count.
  var levels = this.clientManager.self().getUpdateLevels(this.getRoomID());
  if (levels.occupantList) {
    this.setNumOccupants(this.occupantList.length());
  } else if (levels.occupantCount) {
    this.setNumOccupants(manifest.occupantCount);
  }
  if (levels.observerList) {
    this.setNumObservers(this.observerList.length());
  } else if (levels.observerCount) {
    this.setNumObservers(manifest.observerCount);
  }
  
  // Update sync state 
  this.setSyncState(oldSyncState);
  
  // Tell listeners that synchronization is complete
  this.fireSynchronize(net.user1.orbiter.Status.SUCCESS);
}
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.setSyncState = function (newSyncState) {
  this.syncState = newSyncState;
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.updateSyncState = function () {
  if (this.disposed) {
    this.setSyncState(net.user1.orbiter.SynchronizationState.NOT_SYNCHRONIZED);
  } else {
    if (this.roomManager.hasObservedRoom(this.getRoomID()) 
        || this.roomManager.hasOccupiedRoom(this.getRoomID())
        || this.roomManager.hasWatchedRoom(this.getRoomID())) {
      this.setSyncState(net.user1.orbiter.SynchronizationState.SYNCHRONIZED);
    } else {
      this.setSyncState(net.user1.orbiter.SynchronizationState.NOT_SYNCHRONIZED);
    }
  }
}

net.user1.orbiter.Room.prototype.getSyncState = function () {
  return this.syncState;
};

//==============================================================================
// UPDATE LEVELS
//==============================================================================

net.user1.orbiter.Room.prototype.setUpdateLevels = function (updateLevels) {
  if (this.messageManager) {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.SET_ROOM_UPDATE_LEVELS,
                                this.getRoomID(),
                                updateLevels.toInt());
  }
};

//==============================================================================
// OBSERVATION
//==============================================================================
   
net.user1.orbiter.Room.prototype.observe = function (password,
                                                     updateLevels) {
  if (this.disposed) return;
  
  this.roomManager.observeRoom(this.getRoomID(), 
                               password,
                               updateLevels);
};
  
   
net.user1.orbiter.Room.prototype.stopObserving = function () {
  if (this.disposed) return;
  
  if (this.clientIsObservingRoom()) {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_OBSERVING_ROOM, this.getRoomID());
  } else {
    this.log.debug(this + " Stop-observing-room request ignored. Not observing room.");
  }
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.doObserve = function () {
  this._clientIsObservingRoom = true;
  this.fireObserve();
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.doObserveResult = function (status) {
  this.fireObserveResult(status);
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.doStopObserving = function () {
  var rid = this.getRoomID();

  // If the client is not in the room, then we dispose
  // of all of the room's information.
  if (!this.clientIsInRoom()) {
    this.purgeRoomData();
  }
    
  this._clientIsObservingRoom = false;
  
  this.fireStopObserving();
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.doStopObservingResult = function (status) {
  this.fireStopObservingResult(status);
}
    
//==============================================================================
// OCCUPANT MANAGEMENT
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.Room.prototype.addOccupant = function (client) {
  // Don't add the client if it's already in the list.
  if (this.occupantList.contains(client)) {
      this.log.info(this + " ignored addOccupant() request. Occupant list" +
                    " already contains client:" + client + ".");
      return;
  }

  // Add the client
  this.occupantList.add(client);
  
  // Update the number of clients in the room
  this.setNumOccupants(this.occupantList.length());  
  
  // Register for attribute change events
  if (!this.observerList.contains(client)) {
    this.addClientAttributeListeners(client);
  }
  
  // Tell listeners an occupant was added
  this.fireAddOccupant(client.getClientID());  
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.removeOccupant = function (clientID) {
  var client = this.occupantList.removeByClientID(clientID);
  var clientFound = client != null;
  
  // Update the number of clients in the room
  this.setNumOccupants(this.occupantList.length());
  
  // Unregister for attribute change events
  if (!this.observerList.contains(client)) {
    this.removeClientAttributeListeners(client);
  }
  
  // Tell listeners an occupant was removed
  var customClient = client.getCustomClient(this.getRoomID());
  this.fireRemoveOccupant(customClient != null ? customClient : client);

  if (!clientFound) {
    this.log.debug(this + " could not remove occupant: " 
                   + clientID + ". No such client in the room's occupant list.");
  }
};

net.user1.orbiter.Room.prototype.getOccupantIDs = function () {
  if (this.disposed) return null;
  
  return this.occupantList.getAllIDs();
}

net.user1.orbiter.Room.prototype.getOccupants = function () {
  if (this.disposed) return null;
  
  var occupants = this.occupantList.getAll();
  var occupantsList = new Array();
  var customClient;
  var occupant;
  
  for (var clientID in occupants) {
    occupant = occupants[clientID];
    customClient = occupant.getCustomClient(this.getRoomID());
    if (customClient != null) {
      occupantsList.push(customClient);
    } else {
      occupantsList.push(occupant);
    }
  }
  return occupantsList;
}
        
/**
 * @private
 */        
net.user1.orbiter.Room.prototype.getOccupantsInternal = function () {
  return this.occupantList.getAll();
}

net.user1.orbiter.Room.prototype.clientIsInRoom = function (clientID) {
  if (this.disposed) return false;
      
  if (clientID == null) {
    return this._clientIsInRoom;
  }
  return this.occupantList.containsClientID(clientID);
};
    
net.user1.orbiter.Room.prototype.getNumOccupants = function () {
  if (this.disposed) return 0;
  
  var levels = this.clientManager.self().getUpdateLevels(this.getRoomID());;
  if (levels != null) {
    if (levels.occupantCount || levels.occupantList) {
      return this.numOccupants;
    } else {
      this.log.warn(this + " getNumOccupants() called, but no occupant count is " +
                    "available. To enable occupant count, turn on occupant list" +
                    " updates or occupant count updates via the Room's setUpdateLevels()" +
                    " method.");
      return 0;
    }
  } else {
    this.log.debug(this + " getNumOccupants() called, but the current client's update"
                   + " levels for the room are unknown. To determine the room's"
                   + " occupant count, first join or observe the room.");
    return 0;
  }
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.setNumOccupants = function (newNumOccupants) {
  var oldNumClients = this.numOccupants;
  this.numOccupants = newNumOccupants;

  // Tell listeners that the number of clients in the room has changed.
  if (oldNumClients != newNumOccupants) {
    this.fireOccupantCount(newNumOccupants);
  }
};
    
//==============================================================================
// ROOM SETTINGS
//==============================================================================

net.user1.orbiter.Room.prototype.getRoomSettings = function () {
  if (this.disposed) return null;
  
  var settings = new net.user1.orbiter.RoomSettings();
  var maxClients = this.getAttribute(net.user1.orbiter.Tokens.MAX_CLIENTS_ATTR);
  var removeOnEmpty = this.getAttribute(net.user1.orbiter.Tokens.REMOVE_ON_EMPTY_ATTR);
  
  settings.maxClients = maxClients == null ? null : maxClients;
  switch (removeOnEmpty) {
    case null:
      settings.removeOnEmpty = null;
      break;
      
    case "true":
      settings.removeOnEmpty = true;
      break;
      
    case "false":
      settings.removeOnEmpty = false;
      break;
  }
  
  return settings;
};

net.user1.orbiter.Room.prototype.setRoomSettings = function (settings) {
  if (this.disposed) return;
  
  if (settings.maxClients != null) {
    this.setAttribute(net.user1.orbiter.Tokens.MAX_CLIENTS_ATTR, settings.maxClients.toString());
  } 
  if (settings.password != null) {
    this.setAttribute(net.user1.orbiter.Tokens.PASSWORD_ATTR, settings.password);
  } 
  if (settings.removeOnEmpty != null) {
    this.setAttribute(net.user1.orbiter.Tokens.REMOVE_ON_EMPTY_ATTR, settings.removeOnEmpty.toString());
  } 
};
    
//==============================================================================
// OBSERVER MANAGEMENT
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.Room.prototype.addObserver = function (client) {
  // Don't add the client if it's already in the list.
  if (this.observerList.contains(client)) {
      this.log.info(this + " ignored addObserver() request. Observer list" +
                    " already contains client:" + client + ".");
      return;
  }

  // Add the client
  this.observerList.add(client);
  
  // Update the number of clients in the room
  this.setNumObservers(this.observerList.length());  
  
  // Register for attribute change events
  if (!this.occupantList.contains(client)) {
    this.addClientAttributeListeners(client);
  }
  
  // Tell listeners an observer was added
  this.fireAddObserver(client.getClientID());  
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.removeObserver = function (clientID) {
  var client = this.observerList.removeByClientID(clientID);
  var clientFound = client != null;
  
  // Update the number of clients in the room
  this.setNumObservers(this.observerList.length());
  
  // Unregister for attribute change events
  if (!this.occupantList.contains(client)) {
    this.removeClientAttributeListeners(client);
  }
  
  // Tell listeners an observer was removed
  var customClient = client.getCustomClient(this.getRoomID());
  this.fireRemoveObserver(customClient != null ? customClient : client);

  if (!clientFound) {
    this.log.debug(this + " could not remove observer: " 
                   + clientID + ". No such client in the room's observer list.");
  }
};

net.user1.orbiter.Room.prototype.getObserverIDs = function () {
  if (this.disposed) return null;
  
  return this.observerList.getAllIDs();
};

net.user1.orbiter.Room.prototype.getObservers = function () {
  if (this.disposed) return null;
  
  var observers = this.observerList.getAll();
  var observersList = new Array();
  var customClient;
  var observer;
  
  for (var clientID in observers) {
    observer = observers[clientID];
    customClient = observer.getCustomClient(this.getRoomID());
    if (customClient != null) {
      observersList.push(customClient);
    } else {
      observersList.push(observer);
    }
  }
  return observersList;
};
    
/**
 * @private
 */        
net.user1.orbiter.Room.prototype.getObserversInternal = function () {
  return this.observerList.getAll();
}

net.user1.orbiter.Room.prototype.clientIsObservingRoom = function (clientID) {
  if (this.disposed) return false;
  
  if (clientID == null) {
    return this._clientIsObservingRoom;
  }
  return this.observerList.containsClientID(clientID);
}
    
net.user1.orbiter.Room.prototype.getNumObservers = function () {
  if (this.disposed) return 0;
  
  var levels = this.clientManager.self().getUpdateLevels(this.getRoomID());
  if (levels != null) {
    if (levels.observerCount || levels.observerList) {
      return this.numObservers;
    } else {
      this.log.warn(this + " getNumObservers() called, but no observer count is " +
               "available. To enable observer count, turn on observer list" +
               " updates or observer count updates via the Room's setUpdateLevels()" +
               " method.");
      return 0;
    }
  } else {
    this.log.warn(this + " getNumObservers() called, but the current client's update "
      + " levels for the room are unknown. Please report this issue to union@user1.net.");
    return 0;
  }
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.setNumObservers = function (newNumObservers) {
  var oldNumClients = this.numObservers;
  this.numObservers = newNumObservers;

  // Tell listeners that the number of clients in the room has changed.
  if (oldNumClients != newNumObservers) {
    this.fireObserverCount(newNumObservers);
  }
};
    
//==============================================================================
// CLIENT ACCESS
//==============================================================================

net.user1.orbiter.Room.prototype.getClient = function (id) {
  if (this.disposed) return null;
  
  var customClient;
  var client = this.occupantList.getByClientID(id);
  client = (client == null) ? this.observerList.getByClientID(id) : client;
  
  if (client != null) {
    customClient = client.getCustomClient(this.getRoomID());
  }
  return customClient == null ? client : customClient;
};
    
//==============================================================================
// CLIENT ATTRIBUTE LISTENERS
//==============================================================================
/** private */
net.user1.orbiter.Room.prototype.addClientAttributeListeners = function (client) {
  client.addEventListener(net.user1.orbiter.AttributeEvent.UPDATE, this.updateClientAttributeListener, this);
  client.addEventListener(net.user1.orbiter.AttributeEvent.DELETE, this.deleteClientAttributeListener, this);
};
    
/** private */
net.user1.orbiter.Room.prototype.removeClientAttributeListeners = function (client) {
  client.removeEventListener(net.user1.orbiter.AttributeEvent.UPDATE, this.updateClientAttributeListener, this);
  client.removeEventListener(net.user1.orbiter.AttributeEvent.DELETE, this.deleteClientAttributeListener, this);
};
    
/** private */
net.user1.orbiter.Room.prototype.updateClientAttributeListener = function (e) {
  var attr = e.getChangedAttr();
  var client = e.target;
  var customClient = client.getCustomClient(this.getRoomID());
  
  this.fireUpdateClientAttribute(customClient == null ? client : customClient,
                                 attr.scope, attr.name, attr.value, attr.oldValue);
};
    
/** private */
net.user1.orbiter.Room.prototype.deleteClientAttributeListener = function (e) {
  var attr = e.getChangedAttr();
  var client = e.target;
  var customClient = client.getCustomClient(this.getRoomID());
  
  this.fireDeleteClientAttribute(customClient == null ? client : customClient,
                                 attr.scope, attr.name, attr.value);
}
    
//==============================================================================
// CLIENT CLASS
//==============================================================================

net.user1.orbiter.Room.prototype.setDefaultClientClass = function (defaultClass) {
  this.defaultClientClass = defaultClass;
};
    
net.user1.orbiter.Room.prototype.getDefaultClientClass = function () {
  return this.defaultClientClass;
}
    
//==============================================================================
// ATTRIBUTES
//==============================================================================

net.user1.orbiter.Room.prototype.setAttribute = function (attrName,
                                  attrValue, 
                                  isShared,
                                  isPersistent,
                                  evaluate) {
  if (this.disposed) return;
  
  if (isShared !== false) {
    isShared = true;
  }
  
  // Create an integer to hold the attribute options.
  var attrOptions = (isShared     ? net.user1.orbiter.AttributeOptions.FLAG_SHARED     : 0) 
                    | (isPersistent ? net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT : 0)
                    | (evaluate     ? net.user1.orbiter.AttributeOptions.FLAG_EVALUATE   : 0);
  this.attributeManager.setAttribute(new net.user1.orbiter.upc.SetRoomAttr(attrName, attrValue, attrOptions, this.getRoomID()));
}
  
net.user1.orbiter.Room.prototype.deleteAttribute = function (attrName) {
  if (this.disposed) return;
  
  var deleteRequest = new net.user1.orbiter.upc.RemoveRoomAttr(this.getRoomID(), attrName);
  this.attributeManager.deleteAttribute(deleteRequest);
};
  
net.user1.orbiter.Room.prototype.getAttribute = function (attrName) {
  if (this.disposed) return null;
  
  return this.attributeManager.getAttribute(attrName);
};
  
net.user1.orbiter.Room.prototype.getAttributes = function () {
  if (this.disposed) return null;
  
  // Room attributes are considered global
  return this.attributeManager.getAttributesByScope(net.user1.orbiter.Tokens.GLOBAL_ATTR);
}

// =============================================================================
// ROOM MODULES
// =============================================================================

net.user1.orbiter.Room.prototype.sendModuleMessage = function (messageName, 
                                                               messageArguments) {
  if (this.disposed) return;
  
  var sendupcArgs = [net.user1.orbiter.UPC.SEND_ROOMMODULE_MESSAGE, this.getRoomID(), messageName];
  
  for (var arg in messageArguments) {
    sendupcArgs.push(arg + "|" + messageArguments[arg]);
  }
        
  this.messageManager.sendUPC.apply(this.messageManager, sendupcArgs);
};

// =============================================================================
// ROOM REMOVAL
// =============================================================================

net.user1.orbiter.Room.prototype.remove = function (password) {
  if (this.disposed) return;
  
  this.roomManager.removeRoom(this.getRoomID(), password);
};

// =============================================================================
// TOSTRING
// =============================================================================

net.user1.orbiter.Room.prototype.toString = function () {
  return "[ROOM id: " + this.getRoomID() + "]";
};
    
    
// =============================================================================
// EVENT DISPATCHING
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireJoin = function () {
  if (this.log) this.log.info(this + " Room joined.");

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.JOIN);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireJoinResult = function (status) {
  if (this.log) this.log.info(this + " Join result: " + status);

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.JOIN_RESULT, 
                                  null,  null, status);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireLeave = function () {
  if (this.log) this.log.info(this + " Room left.");
  
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.LEAVE);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireLeaveResult = function (status) {
  if (this.log) this.log.info(this + " Leave result: " + status);
  
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.LEAVE_RESULT, 
                                  null, null, status);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireAddOccupant = function (id) {
  if (this.log) this.log.info(this + " Added occupant: [" + id + "].");

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, 
                                  this.getClient(id),
                                  id);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireRemoveOccupant = function (client) {
  if (this.log) this.log.info(this + " Removed occupant: " + client + ".");

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT,
                                  client,
                                  client.getClientID());
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireAddObserver = function (id) {
  if (this.log) this.log.info(this + " Added observer: [" + id + "].");

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.ADD_OBSERVER, 
                                  this.getClient(id),
                                  id);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireRemoveObserver = function (client) {
  if (this.log) this.log.info(this + " Removed observer: " + client + ".");

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.REMOVE_OBSERVER,
                                  client,
                                  client.getClientID());
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireUpdateClientAttribute = function (client, 
                                             scope,
                                             attrName,
                                             attrVal, 
                                             oldVal) {
  if (this.log) this.log.info(this + " Client attribute updated on " + client + "."
            + " Attribute [" + attrName + "] is now: [" 
            + attrVal + "]. Old value was: [" + oldVal + "].");

  var changedAttr = new net.user1.orbiter.Attribute (attrName, 
                                             attrVal, 
                                             oldVal, 
                                             scope);
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.UPDATE_CLIENT_ATTRIBUTE,
                                  client,
                                  client.getClientID(), 
                                  null, 
                                  changedAttr);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireDeleteClientAttribute = function (client, 
                                                 scope,
                                                 attrName,
                                                 attrValue) {
  if (this.log) this.log.info(this + " Client attribute deleted from " + client + "."
           + " Deleted attribute: [" + attrName + "].");

  var deletedAttr = new net.user1.orbiter.Attribute(attrName, attrValue, null, scope);

  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.DELETE_CLIENT_ATTRIBUTE,
                                  client,
                                  client.getClientID(),
                                  null,
                                  deletedAttr);
  this.dispatchEvent(e);
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireOccupantCount = function (newNumClients) {
  if (this.log) this.log.info(this + " New occupant count: " + newNumClients);

  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.OCCUPANT_COUNT, 
                             null, null, null, null, newNumClients);
  this.dispatchEvent(e);
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireObserverCount = function (newNumClients) {
  if (this.log) this.log.info(this + " New observer count: " + newNumClients);

  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.OBSERVER_COUNT, 
                             null, null, null, null, newNumClients);
  this.dispatchEvent(e);
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireSynchronize = function (status) {
  if (this.log) this.log.info(this + " Synchronization complete.");
  
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.SYNCHRONIZE,
                                          null, null, status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireObserve = function () {
  if (this.log) this.log.info(this + " Room observed.");
  
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.OBSERVE);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireObserveResult = function (status) {
  if (this.log) this.log.info(this + " Observe result: " + status);
  
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.OBSERVE_RESULT, null, null, status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireStopObserving = function () {
  if (this.log) this.log.info(this + " Observation stopped.");
  
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.STOP_OBSERVING);
  this.dispatchEvent(e);
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireStopObservingResult = function (status) {
  if (this.log) this.log.info(this + "Stop observing result:  " + 
           status);
  
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT,
                                  null, null, status);
  this.dispatchEvent(e);
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireRemoved = function () {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.REMOVED);
  this.dispatchEvent(e);
};

//==============================================================================
// CLEANUP and DISPOSAL
//==============================================================================
/** private */
net.user1.orbiter.Room.prototype.purgeRoomData = function () {
  if (this.disposed) return;
  
  // Clear the client lists
  this.log.debug(this + " Clearing occupant list.");
  for (var occupantID in this.occupantList.getAll()) {
    this.removeClientAttributeListeners(this.occupantList.getByClientID(occupantID));
  }
  this.occupantList.removeAll();
  
  this.log.debug(this + " Clearing observer list.");
  for (var observerID in this.observerList.getAll()) {
    this.removeClientAttributeListeners(this.observerList.getByClientID(observerID));
  }
  this.observerList.removeAll();
      
  // Clear room attributes.
  this.log.debug(this + " Clearing room attributes.");
  this.attributeManager.removeAll();
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.shutdown = function () {
  if (this.disposed) return;
  
  // Store a temp reference to the log for use in this method after
  // the room has released all its resources.
  var theLog = this.log;
  
  theLog.debug(this + " Shutdown started.");

  // Notify the room's listeners that the client left the room.
  if (this.clientIsInRoom()) {
    theLog.info(this + " Current client is in the room. Forcing the client to leave...");
    this.doLeave();
  }

  // Notify the room's listeners that the client stopped observing the room.
  if (this.clientIsObservingRoom()) {
    theLog.info(this + " Current client is observing the room. Forcing the client to stop observing...");
    this.doStopObserving();
  }
  
  theLog.info(this + " Dereferencing resources.");
  
  // Dereference objects.
  this.purgeRoomData();
  
  this.attributeManager.dispose();
  // Fire removed before nulling the MessageManager object so that listeners have a
  // last chance to respond by communicating with the server (or by
  // removing themselves from the connection's listener list)
  this.fireRemoved();  
  this.dispose();

  theLog.info(this + " Shutdown complete.");
}

/**
 * @private
 */
net.user1.orbiter.Room.prototype.dispose = function () {
  this.log = null;
  this.syncState = null;
  this.occupantList = null;
  this.observerList = null;
  this.attributeManager = null;
  this.numOccupants = 0;
  this.defaultClientClass = null
  this.messageManager = null;
  this.roomManager = null;
  this.disposed = true;
};
