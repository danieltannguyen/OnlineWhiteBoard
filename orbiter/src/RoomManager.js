//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The RoomManager class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.WATCH_FOR_ROOMS_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.STOP_WATCHING_FOR_ROOMS_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.CREATE_ROOM_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.REMOVE_ROOM_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.ROOM_ADDED}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.ROOM_REMOVED}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.ROOM_COUNT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.JOIN_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.LEAVE_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.OBSERVE_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT}</li>   
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.RoomManager = function (orbiter) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
    
  this.watchedQualifiers = [];
  
  this.cachedRooms = new net.user1.orbiter.RoomList();
  this.occupiedRooms = new net.user1.orbiter.RoomList();
  this.observedRooms = new net.user1.orbiter.RoomList();
  this.watchedRooms = new net.user1.orbiter.RoomList();
  
  this.cachedRooms.addEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.occupiedRooms.addEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.occupiedRooms.addEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.observedRooms.addEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.observedRooms.addEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.watchedRooms.addEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.watchedRooms.addEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  
  this.orbiter = orbiter;

  this.addEventListener(net.user1.orbiter.RoomManagerEvent.WATCH_FOR_ROOMS_RESULT,
                        this.watchForRoomsResultListener, this);
  this.addEventListener(net.user1.orbiter.RoomManagerEvent.STOP_WATCHING_FOR_ROOMS_RESULT,
                        this.stopWatchingForRoomsResultListener, this);
                                                 

  this.roomClassRegistry = new net.user1.orbiter.RoomClassRegistry();
                             
  // Store a reference to the this.log.
  this.log = this.orbiter.getLog();
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.RoomManager, net.user1.events.EventDispatcher);    

//==============================================================================
// ROOM CREATION AND REMOVAL
//==============================================================================
/**
* @param attributes An array of JavaScript objects that describes the initial room 
* attributes for the room in the following format (note that this format differs
* from the XML format used for createRoom() by Reactor, Union's Flash client framework):
* 
* [
*   attribute: {
*     name:"attrName1",
*     value:"attrValue1",
*     shared:true,
*     persistent:false,
*     immutable:false
*   },
*   attribute: {
*     name:"attrName2",
*     value:"attrValue2",
*     shared:true,
*     persistent:false,
*     immutable:false
*   }
* ]
* </listing>
*/

net.user1.orbiter.RoomManager.prototype.createRoom = function (roomID, 
                                                               roomSettings,
                                                               attributes,
                                                               modules) {
  // GET ROOM SETTINGS
  if (roomSettings == null) {
    roomSettings = new net.user1.orbiter.RoomSettings();
  }
  
  // GET ROOM MODULES
  if (modules == null) {
    modules = new net.user1.orbiter.RoomModules();
  }

  // ERROR CHECKING
  
  // Abort if invalid module name found.
  var moduleIDs = modules.getIdentifiers();
  var moduleID;
  for (var i = moduleIDs.length; --i >= 0;) {
    var moduleID = moduleIDs[i];
    if (!net.user1.orbiter.Validator.isValidModuleName(moduleID)) {
      throw new Error("[ROOM_MANAGER] createRoom() failed. Illegal room module name: ["
                      + moduleID + "]. See net.user1.orbiter.Validator.isValidModuleName().");
    }
  }

  // If a roomID is specified, we must validated it
  if (roomID != null) {
    // Abort if the supplied id can't be resolved to a single room
    if (!net.user1.orbiter.Validator.isValidResolvedRoomID(roomID)) {
      throw new Error("[ROOM_MANAGER] createRoom() failed. Illegal room id: ["
                + roomID + "]. See net.user1.orbiter.Validator.isValidResolvedRoomID().");
    }
  }

  // MAKE THE ROOM LOCALLY
  
  // Send "" as the roomID if no roomID is specified. When the server
  // receives a request to create a roomID of "", it auto-generates
  // the id, and returns it via RoomManagerEvent.CREATE_ROOM_RESULT.
  if (roomID == null) {
    // Don't make the local room. Instead wait for the server to
    // report the new room via u39.
    roomID = "";
  } else {
    // Make the local room.
    this.addCachedRoom(roomID);
  }

  // TELL THE SERVER TO MAKE THE ROOM

  // Create attributes
  if (attributes != null) {
    var attr;
    var attrArg = "";
    for (var i = 0; i < attributes.length; i++) {
      attr = attributes[i];
      attrSettings = 0;
      attrSettings |= attr.shared ? AttributeOptions.FLAG_SHARED : 0;
      attrSettings |= attr.persistent ? AttributeOptions.FLAG_PERSISTENT : 0;
      attrSettings |= attr.immutable ? AttributeOptions.FLAG_IMMUTABLE : 0;
      attrArg += attr.NAME 
              + net.user1.orbiter.Tokens.RS + attr.VALUE
              + net.user1.orbiter.Tokens.RS + attrSettings.toString();
              
      if (i < attributes.length-1) {
        attrArg += Tokens.RS;
      }
    }
  }

  // Send the create room request to the server.
  var msgMan = this.orbiter.getMessageManager();
  msgMan.sendUPC(net.user1.orbiter.UPC.CREATE_ROOM, 
                 roomID, 
                 roomSettings.serialize(), 
                 attrArg, 
                 modules.serialize());

  // RETURN A REFERENCE TO THE LOCAL ROOM, IF ONE WAS CREATED
  if (roomID == "") {
    return null;
  } else {
    return this.getRoom(roomID);
  }
};

net.user1.orbiter.RoomManager.prototype.removeRoom = function (roomID, password) {
  // Quit if no room specified.
  if (roomID == null || !net.user1.orbiter.Validator.isValidResolvedRoomID(roomID)) {
    throw new Error("Invalid room id supplied to removeRoom(): ["
                    + roomID + "]. Request not sent.");
  }
  
  if (password == null) {
    password = "";
  }

  var msgMan = this.orbiter.getMessageManager();  
  msgMan.sendUPC(net.user1.orbiter.UPC.REMOVE_ROOM,
                 roomID,
                 password);
};

//==============================================================================
// ROOM OBSERVATION
//==============================================================================

net.user1.orbiter.RoomManager.prototype.observeRoom = function (roomID,
                                                                password,
                                                                updateLevels) {
  var theRoom;
  
  // If the room is not valid, quit
  if (!net.user1.orbiter.Validator.isValidResolvedRoomID(roomID)) {
    throw new Error("Invalid room id supplied to observeRoom(): ["
              + roomID + "]. Request not sent."
              + " See net.user1.orbiter.Validator.isValidResolvedRoomID().");
  }

  // Try to get a reference to the room
  theRoom = this.getRoom(roomID);
    
  // If the room exists
  if (theRoom != null) {
    if (theRoom.clientIsObservingRoom()) {
      this.log.warn("[ROOM_MANAGER] Room observe attempt ignored. Already observing room: '" 
               + roomID + "'.");
      return null;
    } 
  } else {
    // Make the local room
    theRoom = this.addCachedRoom(roomID);
  }
    
  // Validate the password
  if (password == null) {
    password = "";
  }
  if (!net.user1.orbiter.Validator.isValidPassword(password)) {
    throw new Error("Invalid room password supplied to observeRoom(). "
              + " Room ID: [" + roomID + "], password: [" + password + "]." 
              + " See net.user1.orbiter.Validator.isValidPassword().");
  }

    // If update levels were specified for this room, send them now.
  if (updateLevels != null) {
    theRoom.setUpdateLevels(updateLevels);
  }

  // Send the UPC only if at least one valid room was found      
  var msgMan = this.orbiter.getMessageManager();  
  msgMan.sendUPC(net.user1.orbiter.UPC.OBSERVE_ROOM, 
                 roomID,
                 password);
  
  return theRoom; 
};

//==============================================================================
// WATCHING FOR ROOMS
//==============================================================================

net.user1.orbiter.RoomManager.prototype.watchForRooms = function (roomQualifier) {
  var recursive = false;
  
  // null means watch the whole server
  if (roomQualifier == null) {
    roomQualifier = "";
    recursive = true;
  }

  var msgMan = this.orbiter.getMessageManager();
  msgMan.sendUPC(net.user1.orbiter.UPC.WATCH_FOR_ROOMS,
                 roomQualifier,
                 recursive.toString());
};

net.user1.orbiter.RoomManager.prototype.stopWatchingForRooms = function (roomQualifier) {
  var recursive = false;
  // null means whole server
  if (roomQualifier == null) {
    roomQualifier = "";
    recursive = true;
  }

  var msgMan = this.orbiter.getMessageManager();
  msgMan.sendUPC(net.user1.orbiter.UPC.STOP_WATCHING_FOR_ROOMS, 
                 roomQualifier,
                 recursive.toString());
};

net.user1.orbiter.RoomManager.prototype.isWatchingQualifier = function (qualifier) {
  return net.user1.utils.ArrayUtil.indexOf(this.watchedQualifiers, qualifier) != -1;
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.watchForRoomsResultListener = function (e) {
  if (e.getStatus() == net.user1.orbiter.Status.SUCCESS) {
    this.watchedQualifiers.push(e.getRoomIdQualifier());
  }
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.stopWatchingForRoomsResultListener = function (e) {
  var unwatchedQualifier = e.getRoomIdQualifier();
  var unwatchedQualifierIndex;
  
  if (e.getStatus() == net.user1.orbiter.Status.SUCCESS) {
    unwatchedQualifierIndex = net.user1.utils.ArrayUtil.indexOf(watchedQualifiers, unwatchedQualifier);
    if (unwatchedQualifierIndex != -1) {
      watchedQualifiers.splice(unwatchedQualifierIndex, 1);
    }
  }
};

//==============================================================================
// SENDING MESSAGES
//==============================================================================

net.user1.orbiter.RoomManager.prototype.sendMessage = function (messageName, 
                                                                rooms,
                                                                includeSelf,
                                                                filters) {
  var rest = Array.prototype.slice.call(arguments).slice(4);
  
  // An array of arguments to send to the server.
  var args;

  // Can't continue without a valid messageName.
  if (messageName == null || messageName == "") {
    this.log.warn("[ROOM_MANAGER]  sendMessage() failed. No messageName supplied.");
    return;
  }
  
  // Send the UPC.
  var msgMan = this.orbiter.getMessageManager();
  args = [net.user1.orbiter.UPC.SEND_MESSAGE_TO_ROOMS, 
          messageName, 
          rooms.join(net.user1.orbiter.Tokens.RS),
          String(includeSelf),
          filters != null ? filters.toXMLString() : ""];
  msgMan.sendUPC.apply(msgMan, args.concat(rest));
}


//==============================================================================
// JOINING ROOMS
//==============================================================================

net.user1.orbiter.RoomManager.prototype.joinRoom = function (roomID, 
                                                             password,
                                                             updateLevels) {
  if (!this.orbiter.isReady()) { 
    this.log.warn("[ROOM_MANAGER] Connection not open. Request to join room ["
              + roomID + "] could not be sent.");
    return null;
  }
  
  // If the room ID is not valid, quit
  if (!net.user1.orbiter.Validator.isValidResolvedRoomID(roomID)) {
    this.log.error("[ROOM_MANAGER] Invalid room id supplied to joinRoom(): ["
                   + roomID + "]. Join request not sent."
                   + " See net.user1.orbiter.Validator.isValidResolvedRoomID().");
    return null;
  }
  
  // Try to get a reference to the room
  var theRoom = this.getRoom(roomID);
    
  // If the room exists
  if (theRoom != null) {
    // Can't join a room you're already in.
    if (theRoom.clientIsInRoom()) {
      this.log.warn("[ROOM_MANAGER] Room join attempt aborted. Already in room: [" 
                    + theRoom.getRoomID() + "].");
      return theRoom;
    }
  } else {
    // Make the local room.
    theRoom = this.addCachedRoom(roomID);
  }
    
  // Validate the password
  if (password == null) {
    password = "";
  }
  if (!net.user1.orbiter.Validator.isValidPassword(password)) {
    this.log.error("[ROOM_MANAGER] Invalid room password supplied to joinRoom(): ["
                   + roomID + "]. Join request not sent." 
                   + " See net.user1.orbiter.Validator.isValidPassword().");
    return theRoom;
  }

  
  // If any update levels are specified, send them before joining.
  if (updateLevels != null) {
    theRoom.setUpdateLevels(updateLevels);
  }
  
  var msgMan = this.orbiter.getMessageManager();
  msgMan.sendUPC(net.user1.orbiter.UPC.JOIN_ROOM, 
                 roomID, 
                 password);
  return theRoom;
};

// =============================================================================
// ROOM OBJECT CREATION/DISPOSAL
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.requestRoom = function (roomID) {
  if (roomID == "") {
    this.log.warn("[ROOM_MANAGER] requestRoom() failed. Supplied room ID was empty.");
    return null;
  }
  
  var theRoom = this.getRoom(roomID);
  if (theRoom != null) {
    return theRoom;
  } else {
    this.log.debug("[ROOM_MANAGER] Creating new room object for id: [" + roomID + "]");
    var RoomClass = this.roomClassRegistry.getRoomClass(roomID);
    theRoom = new RoomClass(roomID, 
                            this, 
                            this.orbiter.getMessageManager(), 
                            this.orbiter.getClientManager(), 
                            this.orbiter.getAccountManager(), 
                            this.log);
    return theRoom;
  }
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.disposeRoom = function (roomID) {
  var room = this.getRoom(roomID);
  if (room != null) {
    this.log.debug("[ROOM_MANAGER] Disposing room: " + room);
    this.removeCachedRoom(roomID);
    this.removeWatchedRoom(roomID);
    this.removeOccupiedRoom(roomID);
    this.removeObservedRoom(roomID);
  } else {
    this.log.debug("[ROOM_MANAGER] disposeRoom() called for unknown room: [" + roomID + "]");
  }
};

/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeAllRooms = function () {
  this.log.debug("[ROOM_MANAGER] Removing all local room object references.");
  this.cachedRooms.removeAll();
  this.watchedRooms.removeAll();
  this.occupiedRooms.removeAll();
  this.observedRooms.removeAll();
};

// =============================================================================
// CACHED ROOMS
// =============================================================================

/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.addCachedRoom = function (roomID) {
  var cachedRoom = this.cachedRooms.getByRoomID(roomID);
  if (cachedRoom == null) {
    this.log.debug("[ROOM_MANAGER] Adding cached room: [" + roomID + "]"); 
    return this.cachedRooms.add(this.requestRoom(roomID));
  } else {
    return cachedRoom;
  }
};

/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeCachedRoom = function (roomID) {
  if (this.cachedRooms.containsRoomID(roomID)) {
    this.cachedRooms.removeByRoomID(roomID);
  } else {
    throw new Error("[ROOM_MANAGER] Could not remove cached room: [" + roomID + "]." 
                    + " Room not found.");
  }
};

net.user1.orbiter.RoomManager.prototype.hasCachedRoom = function (roomID) {
  return this.cachedRooms.containsRoomID(roomID);
};

net.user1.orbiter.RoomManager.prototype.disposeCachedRooms = function () {
  var room;
  var rooms = cachedRooms.getAll();
  for (var i = 0; i <= rooms.length; i++) {
    room = rooms[i];
    removeCachedRoom(room.getRoomID());
  }
};

// =============================================================================
// WATCHED ROOMS
// =============================================================================
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.addWatchedRoom = function (roomID) {
  this.log.debug("[ROOM_MANAGER] Adding watched room: [" + roomID + "]"); 
  var room = this.watchedRooms.add(this.requestRoom(roomID));
  room.updateSyncState();
};
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeWatchedRoom = function (roomID) {
  var room = this.watchedRooms.removeByRoomID(roomID);
  if (room != null) {
    room.updateSyncState();
  } else {
    this.log.debug("[ROOM_MANAGER] Request to remove watched room [" 
              + roomID + "] ignored; room not in watched list.");
  }
};
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeAllWatchedRooms = function () {
  var rooms = this.watchedRooms.getAll();
  var room;
  for (var i = 0; i <= rooms.length; i++) {
    room = rooms[i];
    removeWatchedRoom(room.getRoomID());
    room.updateSyncState();
  }
};
  
/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.setWatchedRooms = function (qualifier, newRoomIDs) {
  // Remove rooms from local list
  var rooms = this.getRoomsWithQualifier(qualifier);
  var room;
  for (var i = 0; i < rooms.length; i++) {
    room = rooms[i];
    if (net.user1.utils.ArrayUtil.indexOf(newRoomIDs, room.getSimpleRoomID()) == -1) {
      this.removeWatchedRoom(room.getRoomID());
    }
  }
  // Add rooms to local list
  var fullRoomID;
  var roomID;
  for (var i = 0; i < newRoomIDs.length; i++) {
    roomID = newRoomIDs[i];
    fullRoomID = qualifier + (qualifier != "" ? "." : "") + roomID;
    if (!this.watchedRooms.containsRoomID(fullRoomID)) {
      this.addWatchedRoom(fullRoomID);
    }
  }
};

net.user1.orbiter.RoomManager.prototype.hasWatchedRoom = function (roomID) {
  return this.watchedRooms.containsRoomID(roomID);
}

// =============================================================================
// OCCUPIED ROOMS
// =============================================================================
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.addOccupiedRoom = function (roomID) {
  this.log.debug("[ROOM_MANAGER] Adding occupied room: [" + roomID + "]"); 
  var room = this.occupiedRooms.add(this.requestRoom(roomID));
  room.updateSyncState();
  return room;
};
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeOccupiedRoom = function (roomID) {
  var room = this.occupiedRooms.removeByRoomID(roomID);
  if (room != null) {
    room.updateSyncState();
  } else {
    this.log.debug("[ROOM_MANAGER] Request to remove occupied room [" 
              + roomID + "] ignored; client is not in room."); 
  }
};

net.user1.orbiter.RoomManager.prototype.hasOccupiedRoom = function (roomID) {
  return this.occupiedRooms.containsRoomID(roomID);
};
  
// =============================================================================
// OBSERVED ROOMS
// =============================================================================
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.addObservedRoom = function (roomID) {
  this.log.debug("[ROOM_MANAGER] Adding observed room: [" + roomID + "]");
  var room = this.observedRooms.add(this.requestRoom(roomID));
  room.updateSyncState();
  return room;
};
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeObservedRoom = function (roomID) {
  var room = this.observedRooms.removeByRoomID(roomID);
  if (room != null) {
    room.updateSyncState();
  } else {
    this.log.debug("[ROOM_MANAGER] Request to remove observed room [" 
              + roomID + "] ignored; client is not observing room."); 
  }
};

net.user1.orbiter.RoomManager.prototype.hasObservedRoom = function (roomID) {
  return this.observedRooms.containsRoomID(roomID);
};

//==============================================================================
// ROOM LIST LISTENERS
//==============================================================================

/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.addRoomListener = function (e) {
  var room = e.getItem();
  
  // Only trigger added for first known reference
  if (this.getKnownReferenceCount(room.getRoomID()) == 1) {
    this.fireRoomAdded(room.getQualifier(), room.getRoomID(), room);
    this.fireRoomCount(this.getNumRooms());
  }
};

/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeRoomListener = function (e) {
  var room = e.getItem();
  var knownReferenceCount = this.getKnownReferenceCount(room.getRoomID());
  
  switch (e.target) {
    case this.occupiedRooms:
      this.log.debug("[ROOM_MANAGER] Removed occupied room: " + room);
      if (knownReferenceCount == 0) {
        this.fireRoomRemoved(room.getQualifier(), room.getRoomID(), room);
        this.fireRoomCount(this.getNumRooms());
      }
      break;
    
    case this.observedRooms:
      this.log.debug("[ROOM_MANAGER] Removed observed room: " + room); 
      if (knownReferenceCount == 0) {
        this.fireRoomRemoved(room.getQualifier(), room.getRoomID(), room);
        this.fireRoomCount(this.getNumRooms());
      }
      break;
    
    case this.watchedRooms:
      this.log.debug("[ROOM_MANAGER] Removed watched room: " + room); 
      if (knownReferenceCount == 0) {
        this.fireRoomRemoved(room.getQualifier(), room.getRoomID(), room);
        this.fireRoomCount(this.getNumRooms());
      }
      break;
    
    case this.cachedRooms:
      this.log.debug("[ROOM_MANAGER] Removed cached room: " + room); 
      break;
  }
  
  // When the RoomManager has no more references to the room, shut it down
  if (knownReferenceCount == 0 && !this.cachedRooms.contains(room)) {
    room.shutdown();
  }
};

//==============================================================================
// ROOM ACCESS
//==============================================================================

/**
 * @private 
 */    
net.user1.orbiter.RoomManager.prototype.getKnownReferenceCount = function (roomID) {
  var count = 0;
  count += this.hasObservedRoom(roomID) ? 1 : 0;
  count += this.hasOccupiedRoom(roomID) ? 1 : 0;
  count += this.hasWatchedRoom(roomID) ? 1 : 0;
  return count;
}

net.user1.orbiter.RoomManager.prototype.getRooms = function () {
  var roomlist = net.user1.utils.ArrayUtil.combine(this.occupiedRooms.getAll(),
                                                   this.observedRooms.getAll(),
                                                   this.watchedRooms.getAll());
  return roomlist;
};

net.user1.orbiter.RoomManager.prototype.roomIsKnown = function (roomID) {
  var rooms = this.getRooms();
  var room;
  for (var i = rooms.length; --i >= 0;) {
    room = rooms[i];
    if (room.getRoomID() == roomID) {
      return true;
    }
  }
  return false;
};

net.user1.orbiter.RoomManager.prototype.getRoomIDs = function () {
  var roomIDs = new Array();
  var rooms = this.getRooms();

  for (var i = 0; i <= rooms.length; i++) {
    roomIDs.push(rooms[i].getRoomID());
  }

  return roomIDs;
};

net.user1.orbiter.RoomManager.prototype.getAllRooms = function () {
  var roomlist = net.user1.utils.ArrayUtil.combine(this.occupiedRooms.getAll(),
                                                   this.observedRooms.getAll(),
                                                   this.watchedRooms.getAll(),
                                                   this.cachedRooms.getAll());
  
  return roomlist;
};

net.user1.orbiter.RoomManager.prototype.getRoomsWithQualifier = function (qualifier) {
  if (qualifier == null)  {
    return this.getRooms();
  }
  
  var roomlist = [];
  var rooms = this.getRooms();
  var room;
  for (var i = 0; i < rooms.length; i++) {
    room = rooms[i];
    if (net.user1.orbiter.RoomIDParser.getQualifier(room.getRoomID()) == qualifier) {
      roomlist.push(room);
    }
  }
  
  return roomlist;
};

net.user1.orbiter.RoomManager.prototype.getNumRooms = function (qualifier) {
  return this.getRoomsWithQualifier(qualifier).length;
}

net.user1.orbiter.RoomManager.prototype.getRoom = function (roomID) {
  var rooms = this.getAllRooms();
  var room;
  for (var i = rooms.length; --i >= 0;) {
    room = rooms[i];
    if (room.getRoomID() == roomID) {
      return room;
    }
  }
  return null;
};

// =============================================================================
// ROOM CLASS REGISTRY
// =============================================================================

net.user1.orbiter.RoomManager.prototype.getRoomClassRegistry = function () {
  return this.roomClassRegistry;
};

// =============================================================================
// CLIENT ACCESS
// =============================================================================

/**
 * @private
 */        
net.user1.orbiter.RoomManager.prototype.getAllClients = function () {
  var clientSets = [];
  var rooms = this.getRooms();
  var room;
  for (var i = rooms.length; --i >= 0;) {
    room = rooms[i];
    clientSets.push(room.getOccupantsInternal());
    clientSets.push(room.getObserversInternal());
  }
  return net.user1.utils.ObjectUtil.combine(clientSets);
};

net.user1.orbiter.RoomManager.prototype.clientIsKnown = function (clientID) {
  var clientSets = [];
  
  var rooms = this.getRooms();
  var room;
  for (var i = rooms.length; --i >= 0;) {
    room = rooms[i];
    clientSets.push(room.getOccupantsInternal());
    clientSets.push(room.getObserversInternal());
  }
  
  for (var i = clientSets.length; --i >= 0;) {
    if (clientSets[i][clientID] != null) {
      return true;
    }
  }
  return false;
};

// =============================================================================
// EVENT DISPATCHING
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireWatchForRoomsResult = function (roomIDQualifier,
                                                                            status) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                              net.user1.orbiter.RoomManagerEvent.WATCH_FOR_ROOMS_RESULT,
                              null, status, roomIDQualifier);
  this.dispatchEvent(e);  
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireStopWatchingForRoomsResult = function (roomIDQualifier,
                                                                                   status) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                            net.user1.orbiter.RoomManagerEvent.STOP_WATCHING_FOR_ROOMS_RESULT,
                            null, status, roomIDQualifier);
  this.dispatchEvent(e);  
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireCreateRoomResult = function (roomIDQualifier, 
                                                                         roomID,
                                                                         status) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                                       net.user1.orbiter.RoomManagerEvent.CREATE_ROOM_RESULT,
                                       roomID, status, roomIDQualifier);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireRemoveRoomResult = function (roomIDQualifier, 
                                                                         roomID,
                                                                         status) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                                       net.user1.orbiter.RoomManagerEvent.REMOVE_ROOM_RESULT, 
                                       roomID, status, roomIDQualifier);

  this.dispatchEvent(e);
}

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireRoomAdded = function (roomIDQualifier, 
                                                                  roomID,
                                                                  theRoom) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                                     net.user1.orbiter.RoomManagerEvent.ROOM_ADDED, 
                                     roomID, null, roomIDQualifier, theRoom);
  this.dispatchEvent(e);
}

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireRoomRemoved = function (roomIDQualifier, 
                                                                    roomID,
                                                                    theRoom) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                                     net.user1.orbiter.RoomManagerEvent.ROOM_REMOVED, 
                                     roomID, 
                                     null,
                                     roomIDQualifier,
                                     theRoom);
  this.dispatchEvent(e);
}

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireRoomCount = function (numRooms) {
  this.dispatchEvent(new net.user1.orbiter.RoomManagerEvent(net.user1.orbiter.RoomManagerEvent.ROOM_COUNT, 
                                                            null, null, null, null, numRooms));
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireJoinRoomResult = function (roomID, status) {
  this.dispatchEvent(new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.JOIN_RESULT, null, null, 
                                                     status, null, 0, roomID));
}

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireLeaveRoomResult = function (roomID, status) {
  this.dispatchEvent(new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.LEAVE_RESULT, null, null, 
                                                     status, null, 0, roomID));
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireObserveRoomResult = function (roomID, status) {
  this.dispatchEvent(new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.OBSERVE_RESULT, null, null, 
                                                     status, null, 0, roomID));
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireStopObservingRoomResult = function (roomID, status) {
  this.dispatchEvent(new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT, null, null, 
                                                     status, null, 0, roomID));
};


// =============================================================================
// CLEANUP and DISPOSAL
// =============================================================================

/**
 * @private
 * 
 * Clears all resources. The object remains alive, and can be reused. To 
 * permanently deactivate this object, use dispose().
 */
net.user1.orbiter.RoomManager.prototype.cleanup = function () {
  this.log.info("[ROOM_MANAGER] Cleaning resources.");
  this.removeAllRooms();
  this.watchedQualifiers = [];
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.dispose = function () {
  this.log.info("[ROOM_MANAGER] Disposing resources.");
  this.watchedQualifiers = null;
  var room;
  var rooms = this.getAllRooms();
  for (var i = this.getAllRooms().length; --i >= 0;) {
    room = rooms[i];
    room.dispose();
  }
  this.cachedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.occupiedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.occupiedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.observedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.observedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.watchedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.watchedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.occupiedRooms = null;
  this.observedRooms = null;
  this.watchedRooms  = null;
  this.cachedRooms  = null;
  this.log = null;
  this.orbiter = null;
  this.roomClassRegistry = null;
};