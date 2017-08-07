//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The Client class dispatches the following events:

<ul class="summary">
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.JOIN_ROOM}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.LEAVE_ROOM}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.OBSERVE_ROOM}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.STOP_OBSERVING_ROOM}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.OBSERVE}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.STOP_OBSERVING}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.OBSERVE_RESULT}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGIN}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGOFF}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.SYNCHRONIZE}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.DELETE}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.UPDATE}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.SET_RESULT}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.DELETE_RESULT}</li> 
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.Client = function (clientID, 
                                     clientManager,
                                     messageManager,
                                     roomManager,
                                     connectionManager,
                                     server,
                                     log) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);

  this.clientID = "";
  this._isSelf = false;
  this.account = null;
  this.disposed = false;
  
  this.messageManager    = messageManager;
  this.clientManager     = clientManager;
  this.roomManager       = roomManager;
  this.connectionManager = connectionManager;
  this.server            = server;
  this.log               = log;
  this.occupiedRoomIDs   = new Array();
  this.observedRoomIDs   = new Array();
  this.customClients     = new Object();
  this.attributeManager  = new net.user1.orbiter.AttributeManager(this, this.messageManager, this.log);
  this.connectionState   = net.user1.orbiter.ConnectionState.UNKNOWN;

  this.setClientID(clientID);
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.Client, net.user1.events.EventDispatcher);
    
//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @private */    
net.user1.orbiter.Client.FLAG_ADMIN = 1 << 2;
    
// =============================================================================
// CLIENT ID
// =============================================================================
net.user1.orbiter.Client.prototype.getClientID = function () {
  return this.clientID;
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.setClientID = function (id) {
  if (this.clientID != id) {
    this.clientID = id;
  }
};

net.user1.orbiter.Client.prototype.isSelf = function () {
  return this._isSelf;
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.setIsSelf = function () {
  this._isSelf = true;
};

// =============================================================================
// CONNECTION STATUS
// =============================================================================

net.user1.orbiter.Client.prototype.getConnectionState = function () {
  if (this.isSelf()) {
    if (this.disposed
        || this.clientManager.getInternalClient(this.getClientID()) == null) {
      return net.user1.orbiter.ConnectionState.NOT_CONNECTED;
    } else {
      return this.account != null ? this.account.getConnectionState() : this.connectionManager.getConnectionState();
    }
  } else {
    if (this.connectionState != net.user1.orbiter.ConnectionState.UNKNOWN) {
      return this.connectionState;
    } else if (this.disposed
               || this.clientManager.getInternalClient(this.getClientID()) == null) {
      return net.user1.orbiter.ConnectionState.UNKNOWN;
    } else {
      return this.account != null ? this.account.getConnectionState() : net.user1.orbiter.ConnectionState.READY;
    }
  }
};

// Normally, this client's connection state is not assigned directly; it 
// it is deduced within getConnectionState(). But when Union
// sends a u103, we know that this client has definitely disconnected from 
// the server, and this client object will never be reused, so CoreMessageListener
// permanently assigns its connection state to NOT_CONNECTED.
net.user1.orbiter.Client.prototype.setConnectionState = function (newState) {
  this.connectionState = newState;
};

// =============================================================================
// ROLES
// =============================================================================
net.user1.orbiter.Client.prototype.isAdmin = function () {
  var rolesAttr = this.getAttribute(Tokens.ROLES_ATTR);
  var roles;
  if (rolesAttr != null) {
    return parseInt(rolesAttr) & net.user1.orbiter.Client.FLAG_ADMIN;
  } else {
    this.log.warn("[" + this.toString() + "] Could not determine admin status because the client is not synchronized.");
    return false;
  }
};

// =============================================================================
// OBSERVATION
// =============================================================================

net.user1.orbiter.Client.prototype.observe = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.OBSERVE_CLIENT, this.clientID);
};

net.user1.orbiter.Client.prototype.stopObserving = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_OBSERVING_CLIENT, this.clientID);
};

// =============================================================================
// KICK / BAN
// =============================================================================

net.user1.orbiter.Client.prototype.kick = function () {
  if (this.getClientID() == null) {
    this.log.warn(this + " Kick attempt failed. Client not currently connected.");
  }
  this.messageManager.sendUPC(net.user1.orbiter.UPC.KICK_CLIENT, getClientID());
};

net.user1.orbiter.Client.prototype.ban = function (duration, reason) {
  if (this.getClientID() == null) {
    this.log.warn(this + " Ban attempt failed. Client not currently connected.");
  }
  this.messageManager.sendUPC(net.user1.orbiter.UPC.BAN, null, getClientID(), duration.toString(), reason);
};

// =============================================================================
// CUSTOM CLASS MANAGEMENT
// =============================================================================

net.user1.orbiter.Client.prototype.setClientClass = function (scope, 
                                                              clientClass) {
  var fallbackClasses = Array.prototype.slice.call(arguments).slice(2);
  if (!this.isSelf()) {
    throw new Error("Custom client class assignment failed for : "
                    + clientClass + ". A custom" 
                    + " class can be set for the current client ("
                    + " i.e., ClientManager.self()) only.");
  }
  
  fallbackClasses.unshift(clientClass);
  var classList = fallbackClasses.join(" ");
  setAttribute(Tokens.CUSTOM_CLASS_ATTR, classList, scope);
};

/**
 * @private
 */    
net.user1.orbiter.Client.prototype.getCustomClient = function (scope) {
  var customClient;

  // If the custom client already exists for the specified scope, return it.
  customClient = this.customClients[scope];
  if (customClient != null) {
    return customClient;
  }
  
  // Look for a custom class for the given scope, and create a custom client
  if (scope == null) {
    return this.setGlobalCustomClient();
  } else {
    return this.setCustomClientForScope(scope);
  }
};

/**
 * @private
 */    
net.user1.orbiter.Client.prototype.setGlobalCustomClient = function () {
  var defaultClientClass;
  var globalDefaultClientClass;
  var customClient;
  
  // If this client has a default custom client class, use it
  defaultClientClass = this.getClientClass(null);
  if (defaultClientClass != null) {
    return this.createCustomClient(defaultClientClass, null);
  }          
  
  // No global class was set on the client, so check for a system-wide default
  globalDefaultClientClass = this.clientManager.getDefaultClientClass();
  if (globalDefaultClientClass == null) {
    // No global custom client class exists
    return null;
  } else {
    // Global default class exists
    return this.createCustomClient(globalDefaultClientClass, null);
  }
};

/**
 * @private
 */    
net.user1.orbiter.Client.prototype.setCustomClientForScope = function (scope) {
  var theRoom;
  var clientClass;
  var roomDefaultClientClass;
  var globalDefaultClientClass;
  
  // If this client has a default custom client class, use it
  clientClass = this.getClientClass(scope);
  if (clientClass != null) {
    return this.createCustomClient(clientClass, scope);
  }          
  
  // No class was set on the client for the scope, so check for a room default
  theRoom = this.roomManager.getRoom(scope);
  if (theRoom != null) {
    roomDefaultClientClass = theRoom.getDefaultClientClass();
    if (roomDefaultClientClass != null) {
      return this.createCustomClient(roomDefaultClientClass, scope);
    }
  }
  
  // No class was set on the room for the scope, so check for a system-wide default
  // If a custom global client already exists, return it.
  var customClient = this.customClients[null];
  if (customClient != null) {
    return customClient;
  } else {
    globalDefaultClientClass = this.clientManager.getDefaultClientClass();
    if (globalDefaultClientClass == null) {
      // No global custom client class exists
      return null;
    } else {
      // Global default class exists
      return this.createCustomClient(globalDefaultClientClass, null);
    }
  }
};

/**
 * @private
 */    
net.user1.orbiter.Client.prototype.getClientClass = function (scope) {
  var clientClassNames = this.getAttribute(net.user1.orbiter.Tokens.CUSTOM_CLASS_ATTR, scope);
  var clientClassList;

  // Convert the custom class names to an array for processing
  if (clientClassNames != null) {
    clientClassList = clientClassNames.split(" ");
  }

  // Search for a matching class definition. The first definition that's 
  // found is returned.
  var className;
  if (clientClassList != null) {
    for (var i = 0; i < clientClassList.length; i++) {
      try {
        var theClass = net.user1.utils.resolveMemberExpression(className);
        if (!theClass instanceof Function) {
          this.log.debug(this.toString() + ": Definition for client class [" + className + "] is not a constructor function.");
          continue;
        }
        return theClass;
      } catch (e) {
        this.log.debug(this.toString() + ": No definition found for client class [" + className + "]");
        continue;
      }
    }
  }
  return null;
};

/**
 * @private
 */    
net.user1.orbiter.Client.prototype.createCustomClient = function (wrapperClass, scope) {
  var customClient;

  // Wrap the client
  customClient = new wrapperClass();
  this.customClients[scope] = customClient;
  
  // Do custom client setup
  if (customClient instanceof CustomClient) {
    customClient.setClient(this);
    customClient.init();
    return customClient;
  } else {
    this.log.debug("[CLIENT_MANAGER] Custom client class [" + wrapperClass + "] does not "  
           + " extend CustomClient. Assuming specified class will manually "  
           + " compose its own Client instance for client ID: " + clientID
           + ". See Client.setClientClass()."); 
    return customClient;
  }
};

// =============================================================================
// ROOM MANAGEMENT
// =============================================================================
  
/**
 * @private
 */
net.user1.orbiter.Client.prototype.removeOccupiedRoomID = function (roomID) {
  if (this.isInRoom(roomID) && roomID != null) {
    this.occupiedRoomIDs.splice(net.user1.utils.ArrayUtil.indexOf(this.occupiedRoomIDs, roomID), 1);
    return true;
  } else {
    return false;
  }
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.removeObservedRoomID = function (roomID) {
  if (this.isObservingRoom(roomID) && roomID != null) {
    this.observedRoomIDs.splice(net.user1.utils.ArrayUtil.indexOf(this.observedRoomIDs, roomID), 1);
    return true;
  } else {
    return false;
  }
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.addOccupiedRoomID = function (roomID) {
  if (!this.isInRoom(roomID) && roomID != null) {
    this.log.info(this.toString() + " added occupied room ID [" + roomID + "].");
    this.occupiedRoomIDs.push(roomID);
  }
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.addObservedRoomID = function (roomID) {
  if (!this.isObservingRoom(roomID) && roomID != null) {
    this.log.info("Client [" + this.getClientID() + "] added observed room ID [" + roomID + "].");
    this.observedRoomIDs.push(roomID);
  }
};

net.user1.orbiter.Client.prototype.isInRoom = function (roomID) {
  return net.user1.utils.ArrayUtil.indexOf(this.getOccupiedRoomIDs(), roomID) != -1;
};

net.user1.orbiter.Client.prototype.isObservingRoom = function (roomID) {
  return net.user1.utils.ArrayUtil.indexOf(this.getObservedRoomIDs(), roomID) != -1;
};

net.user1.orbiter.Client.prototype.getOccupiedRoomIDs = function () {
  var ids;
  if (this.clientManager.isObservingClient(this.getClientID())) {
    // This client is under observation, so its occupiedRoomIDs array is
    // 100% accurate.
    return this.occupiedRoomIDs == null ? [] : this.occupiedRoomIDs.slice(0);
  } else {
    // This client is not under observation, so the current client can only
    // deduce this client's occupied room list based on its current sphere of awareness.
    ids = [];
    var knownRooms = this.roomManager.getRooms();
    var numKnownRooms = knownRooms.length;
    var room;
    for (var i = 0; i < numKnownRooms; i++) {
      room = knownRooms[i];
      if (room.clientIsInRoom(this.getClientID())) {
        ids.push(room.getRoomID());
      }
    }
    return ids;
  }
};

net.user1.orbiter.Client.prototype.getObservedRoomIDs = function () {
  var ids;
  if (this.clientManager.isObservingClient(this.getClientID())) {
    // This client is under observation, so its occupiedRoomIDs array is
    // 100% accurate.
    return this.observedRoomIDs == null ? [] : this.observedRoomIDs.slice(0);
  } else {
    // This client is not under observation, so the current client can only
    // deduce this client's occupied room list based on its current sphere of awareness.
    ids = [];
    var knownRooms = this.roomManager.getRooms();
    var numKnownRooms = knownRooms.length;
    var room;
    for (var i = 0; i < numKnownRooms; i++) {
      room = knownRooms[i];
      if (room.clientIsObservingRoom(this.getClientID())) {
        ids.push(room.getRoomID());
      }
    }
    return ids;
  }
};

net.user1.orbiter.Client.prototype.getUpdateLevels = function (roomID) {
  var levels;
  var levelsAttr = this.getAttribute("_UL", roomID);
  
  if (levelsAttr != null) {
    levels = new net.user1.orbiter.UpdateLevels();
    levels.fromInt(parseInt(levelsAttr));
    return levels;
  } else {
    return null;
  }
};

// =============================================================================
// BUILT-IN ATTRIBUTE RETRIEVAL
// =============================================================================

net.user1.orbiter.Client.prototype.getIP = function () {
  return this.getAttribute("_IP");
};

net.user1.orbiter.Client.prototype.getConnectTime = function () {
  var ct = this.getAttribute("_CT");
  return ct == null ? NaN : parseFloat(ct);
};

net.user1.orbiter.Client.prototype.getPing = function () {
  var ping = this.getAttribute("_PING");
  return ping == null ? -1 : parseInt(ping);
};

net.user1.orbiter.Client.prototype.getTimeOnline = function () {
  return this.server == null ? NaN : this.server.getServerTime() - this.getConnectTime();
};

// =============================================================================
// MESSAGING
// ============================================================================= 

net.user1.orbiter.Client.prototype.sendMessage = function (messageName) {
  if (this.clientManager == null) {
    return;
  }
  // Delegate to ClientManager
  var rest = Array.prototype.slice.call(arguments).slice(1);
  var args = [messageName, 
              [this.getClientID()],
              null];
  this.clientManager.sendMessage.apply(this.clientManager, args.concat(rest));
};

// =============================================================================
// ATTRIBUTES: PUBLIC API
// =============================================================================
net.user1.orbiter.Client.prototype.setAttribute = function (attrName, 
                                                            attrValue, 
                                                            attrScope, 
                                                            isShared, 
                                                            evaluate) {
  attrScope = attrScope == undefined ? null : attrScope;
  isShared = isShared == undefined ? true : isShared;
  evaluate = evaluate == undefined ? false : evaluate;

  // Create an integer to hold the attribute options.
  var attrOptions = (isShared     ? net.user1.orbiter.AttributeOptions.FLAG_SHARED     : 0) 
                    | (evaluate     ? net.user1.orbiter.AttributeOptions.FLAG_EVALUATE   : 0);
  // Make the SetClientAttr UPC first so inputs are validated
  var setClientAttr = new net.user1.orbiter.upc.SetClientAttr(attrName, attrValue, attrOptions, attrScope, this.getClientID());
  
  // Set the attribute locally now, unless:
  // -it is another client's attribute
  // -it is the current client's attribute, and the value has changed
  if (!(!this.isSelf() || evaluate)) {
    // Set the attribute locally
    this.attributeManager.setAttributeLocal(attrName, attrValue, attrScope, this);
  }

  // Set the attribute on the server.
  this.messageManager.sendUPCObject(setClientAttr);
};

net.user1.orbiter.Client.prototype.deleteAttribute = function (attrName, attrScope) {
  var deleteRequest = new net.user1.orbiter.upc.RemoveClientAttr(this.getClientID(), null, attrName, attrScope);
  this.attributeManager.deleteAttribute(deleteRequest);
};

net.user1.orbiter.Client.prototype.getAttribute = function (attrName, attrScope) {
  return this.attributeManager.getAttribute(attrName, attrScope);
};

net.user1.orbiter.Client.prototype.getAttributes = function () {
  return this.attributeManager.getAttributes();
};

net.user1.orbiter.Client.prototype.getAttributesByScope = function (scope) {
  return this.attributeManager.getAttributesByScope(scope);
};

// =============================================================================
// SYNCHRONIZATION
// =============================================================================
  
/**
 * @private
 */        
net.user1.orbiter.Client.prototype.synchronize = function (clientManifest) {
  var scopes;
  this.synchronizeOccupiedRoomIDs(clientManifest.occupiedRoomIDs);
  this.synchronizeObservedRoomIDs(clientManifest.observedRoomIDs);
  
  // Synchronize Client attributes
  scopes = clientManifest.transientAttributes.getScopes();
  for (var i = scopes.length; --i >= 0;) {
    this.attributeManager.getAttributeCollection().synchronizeScope(scopes[i], clientManifest.transientAttributes);
  }
  // Synchronize UserAccount attributes
  if (this.account != null) {
    scopes = clientManifest.persistentAttributes.getScopes();
    for (i = scopes.length; --i >= 0;) {
      this.account.getAttributeManager().getAttributeCollection().synchronizeScope(scopes[i], clientManifest.persistentAttributes);
    }
  }
};
    
/**
 * @private
 */        
net.user1.orbiter.Client.prototype.synchronizeOccupiedRoomIDs = function (newOccupiedRoomIDs) {
  if (newOccupiedRoomIDs == null) {
    // Nothing to synchronize
    return;
  }
  
  // Remove any rooms that are not in the new list
  var roomID;
  for (var i = this.occupiedRoomIDs.length; --i >= 0;) {
    roomID = this.occupiedRoomIDs[i];
    if (net.user1.utils.ArrayUtil.indexOf(newOccupiedRoomIDs, roomID) == -1) {
      this.removeOccupiedRoomID(roomID);
    }
  }
  
  // Add any rooms that are not in the old list (existing room IDs are ignored)
  for (i = newOccupiedRoomIDs.length; --i >= 0;) {
    roomID = newOccupiedRoomIDs[i];
    this.addOccupiedRoomID(roomID);
  }
};
    
/**
 * @private
 */        
net.user1.orbiter.Client.prototype.synchronizeObservedRoomIDs = function (newObservedRoomIDs) {
  if (newObservedRoomIDs == null) {
    // Nothing to synchronize
    return;
  }
  // Remove any rooms that are not in the new list
  var roomID;
  for (var i = this.observedRoomIDs.length; --i >= 0;) {
    roomID = this.observedRoomIDs[i];
    if (net.user1.utils.ArrayUtil.indexOf(newObservedRoomIDs, roomID) == -1) {
      this.removeObservedRoomID(roomID);
    }
  }
  
  // Add any rooms that are not in the old list (existing room IDs are ignored)
  for (i = newObservedRoomIDs.length; --i >= 0;) {
    roomID = newObservedRoomIDs[i];
    this.addObservedRoomID(roomID);
  }
};

// =============================================================================
// DEPENDENCIES
// =============================================================================

/**
 * @private
 */        
net.user1.orbiter.Client.prototype.getAttributeManager = function () {
  return this.attributeManager;
};

net.user1.orbiter.Client.prototype.getClientManager = function () {
  return this.clientManager;
};

net.user1.orbiter.Client.prototype.getAccount = function () {
  return this.account;
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.setAccount = function (value) {
  if (value == null) {
    this.account = null;
  } else {
    if (this.account != value) {
      this.account = value;
      this.account.setClient(this);
    }
  }
};

// =============================================================================
// TOSTRING
// =============================================================================

net.user1.orbiter.Client.prototype.toString = function () {
  return "[CLIENT clientID: " + this.getClientID() + ", userID: " + (this.account == null ? "" : this.account.getUserID())  + "]";
};

// =============================================================================
// EVENT DISPATCHING
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireJoinRoom = function (room, roomID) {
  this.log.debug(this + " triggering ClientEvent.JOIN_ROOM event.");
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.JOIN_ROOM,
                                            null, room, roomID, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireLeaveRoom = function (room, roomID) {
  this.log.debug(this + " triggering ClientEvent.LEAVE_ROOM event.");
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.LEAVE_ROOM,
                                            null, room, roomID, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireObserveRoom = function (room, roomID) {
  this.log.debug(this + " triggering ClientEvent.OBSERVE_ROOM event.");
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.OBSERVE_ROOM,
                                            null, room, roomID, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireStopObservingRoom = function (room, roomID) {
  this.log.debug(this + " triggering ClientEvent.STOP_OBSERVING_ROOM event.");
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.STOP_OBSERVING_ROOM,
                                            null, room, roomID, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireObserve = function () {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.OBSERVE, null, null, null, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireStopObserving = function () {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.STOP_OBSERVING, null, null, null, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireObserveResult = function (status) {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.OBSERVE_RESULT,
                                            null, null, null, this, status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireStopObservingResult = function (status) {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT,
                                            null, null, null, this, status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireLogin = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGIN,
                                             net.user1.orbiter.Status.SUCCESS, this.getAccount().getUserID(), this.getClientID());
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireLogoff = function (userID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGOFF,
                                             net.user1.orbiter.Status.SUCCESS, userID, this.getClientID());
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireSynchronize = function () {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.SYNCHRONIZE, null, null, null, this);
  this.dispatchEvent(e);
};

// =============================================================================
// DISPOSAL
// =============================================================================

net.user1.orbiter.Client.prototype.dispose = function () {
  this.occupiedRoomIDs = null;
  this.attributeManager.dispose();
  this.attributeManager = null;
  this.clientID = null;
  this.log = null;
  this.account = null;
  this.customClients = null;
  this.messageManager = null;
  this.clientManager = null;
  this.roomManager = null;
  this.server = null;
  this.disposed = true;
};