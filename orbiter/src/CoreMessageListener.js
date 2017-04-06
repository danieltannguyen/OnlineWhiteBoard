//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * The CoreMessageListener class is an internal class that responds to the 
 * built-in UPC messages sent by the Union Server to the Orbiter. The 
 * CoreMessageListener class does not define any public methods or variables.
 * 
 * @private
 */
net.user1.orbiter.CoreMessageListener = function (orbiter) {
  /**
   * @type net.user1.orbiter.Orbiter
   */
  this.orbiter = orbiter;
  this.log = orbiter.getLog();      
  this.registerCoreListeners();
  this.orbiter.getConnectionManager().addEventListener(net.user1.orbiter.ConnectionManagerEvent.SELECT_CONNECTION, 
                                                       this.selectConnectionListener, this);

  this.roomMan = this.orbiter.getRoomManager();
  this.accountMan = this.orbiter.getAccountManager();
  this.clientMan = this.orbiter.getClientManager();
  this.snapshotMan = this.orbiter.getSnapshotManager();
};

//==============================================================================
// INSTANCE METHODS
//==============================================================================
net.user1.orbiter.CoreMessageListener.prototype.registerCoreListeners = function () {
  var msgMan = this.orbiter.getMessageManager();
  msgMan.addMessageListener(net.user1.orbiter.UPC.JOINED_ROOM, this.u6, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.RECEIVE_MESSAGE, this.u7, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_ATTR_UPDATE, this.u8, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_ATTR_UPDATE, this.u9, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_METADATA, this.u29, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CREATE_ROOM_RESULT, this.u32, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.REMOVE_ROOM_RESULT, this.u33, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENTCOUNT_SNAPSHOT, this.u34, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_ADDED_TO_ROOM, this.u36, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_REMOVED_FROM_ROOM, this.u37, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOMLIST_SNAPSHOT, this.u38, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_ADDED, this.u39, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_REMOVED, this.u40, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.WATCH_FOR_ROOMS_RESULT, this.u42, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_WATCHING_FOR_ROOMS_RESULT, this.u43, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LEFT_ROOM, this.u44, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CHANGE_ACCOUNT_PASSWORD_RESULT, this.u46, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CREATE_ACCOUNT_RESULT, this.u47, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.REMOVE_ACCOUNT_RESULT, this.u48, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LOGIN_RESULT, this.u49, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_SNAPSHOT, this.u54, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVED_ROOM, this.u59, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GET_ROOM_SNAPSHOT_RESULT, this.u60, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOPPED_OBSERVING_ROOM, this.u62, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.SERVER_HELLO, this.u66, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.JOIN_ROOM_RESULT, this.u72, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.SET_CLIENT_ATTR_RESULT, this.u73, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.SET_ROOM_ATTR_RESULT, this.u74, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GET_CLIENTCOUNT_SNAPSHOT_RESULT, this.u75, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LEAVE_ROOM_RESULT, this.u76, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVE_ROOM_RESULT, this.u77, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_OBSERVING_ROOM_RESULT, this.u78, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_ATTR_REMOVED, this.u79, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.REMOVE_ROOM_ATTR_RESULT, this.u80, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_ATTR_REMOVED, this.u81, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.REMOVE_CLIENT_ATTR_RESULT, this.u82, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.SESSION_TERMINATED, this.u84, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LOGOFF_RESULT, this.u87, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LOGGED_IN, this.u88, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LOGGED_OFF, this.u89, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ACCOUNT_PASSWORD_CHANGED, this.u90, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENTLIST_SNAPSHOT, this.u101, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_ADDED_TO_SERVER, this.u102, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_REMOVED_FROM_SERVER, this.u103, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_SNAPSHOT, this.u104, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVE_CLIENT_RESULT, this.u105, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_OBSERVING_CLIENT_RESULT, this.u106, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.WATCH_FOR_CLIENTS_RESULT, this.u107, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_WATCHING_FOR_CLIENTS_RESULT, this.u108, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.WATCH_FOR_ACCOUNTS_RESULT, this.u109, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_WATCHING_FOR_ACCOUNTS_RESULT, this.u110, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ACCOUNT_ADDED, this.u111, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ACCOUNT_REMOVED, this.u112, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.JOINED_ROOM_ADDED_TO_CLIENT, this.u113, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.JOINED_ROOM_REMOVED_FROM_CLIENT, this.u114, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GET_CLIENT_SNAPSHOT_RESULT, this.u115, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GET_ACCOUNT_SNAPSHOT_RESULT, this.u116, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVED_ROOM_ADDED_TO_CLIENT, this.u117, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVED_ROOM_REMOVED_FROM_CLIENT, this.u118, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_OBSERVED, this.u119, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOPPED_OBSERVING_CLIENT, this.u120, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVE_ACCOUNT_RESULT, this.u123, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ACCOUNT_OBSERVED, this.u124, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_OBSERVING_ACCOUNT_RESULT, this.u125, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOPPED_OBSERVING_ACCOUNT, this.u126, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ACCOUNT_LIST_UPDATE, this.u127, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.UPDATE_LEVELS_UPDATE, this.u128, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_OBSERVED_ROOM, this.u129, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_STOPPED_OBSERVING_ROOM, this.u130, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_OCCUPANTCOUNT_UPDATE, this.u131, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_OBSERVERCOUNT_UPDATE, this.u132, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ADD_ROLE_RESULT, this.u134, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.REMOVE_ROLE_RESULT, this.u136, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.BAN_RESULT, this.u138, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.UNBAN_RESULT, this.u140, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.BANNED_LIST_SNAPSHOT, this.u142, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.WATCH_FOR_BANNED_ADDRESSES_RESULT, this.u144, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT, this.u146, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.BANNED_ADDRESS_ADDED, this.u147, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.BANNED_ADDRESS_REMOVED, this.u148, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.KICK_CLIENT_RESULT, this.u150, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.SERVERMODULELIST_SNAPSHOT, this.u152, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GET_UPC_STATS_SNAPSHOT_RESULT, this.u155, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.UPC_STATS_SNAPSHOT, this.u156, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.RESET_UPC_STATS_RESULT, this.u158, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.WATCH_FOR_PROCESSED_UPCS_RESULT, this.u160, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.PROCESSED_UPC_ADDED, this.u161, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT, this.u163, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.NODELIST_SNAPSHOT, this.u166, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GATEWAYS_SNAPSHOT, this.u168, this);
}

net.user1.orbiter.CoreMessageListener.prototype.createHashFromArg = function (arg) {
  var list = arg.split(net.user1.orbiter.Tokens.RS);
  var hash = new Object();

  for (var i = 0; i < list.length; i += 2) {
    hash[list[i]] = list[i+1];
  }
  return hash;
};

net.user1.orbiter.CoreMessageListener.prototype.selectConnectionListener = function (e) {
  var msgMan = this.orbiter.getMessageManager();
  if (msgMan.removeListenersOnDisconnect) {
    this.registerCoreListeners();
  }
};
  
/**
 * Room joined.
 */
net.user1.orbiter.CoreMessageListener.prototype.u6 = function (roomID) {
  // Add the room to the occupied room list
  var room = this.roomMan.addOccupiedRoom(roomID);
  // Tell the room to do its join duties
  room.doJoin();
  // Fire JOIN through the client
  var selfClient = this.clientMan.self();
  if (selfClient) {
    selfClient.fireJoinRoom(room, roomID);
  }
};

/**
 * Handles sendMessage() calls sent by other clients.
 */
net.user1.orbiter.CoreMessageListener.prototype.u7 = function (message,
                                                               broadcastType,
                                                               fromClientID,
                                                               toRoomID) {
  var msgMan = this.orbiter.getMessageManager();
  var listenerError;
  var fromClient;
  var toRoom;
  var args;  // Args passed to the messsage listener
  var userDefinedArgs = Array.prototype.slice.call(arguments).slice(4);

  // Retrieve the Room object for the recipient room. 
  toRoom = this.roomMan.getRoom(toRoomID);
  
  // Retrieve the Client object for the sender
  if (fromClientID == "") {
    // No client ID was supplied, so the message was generated by the
    // server, not by a client, so set fromClient to null.
    fromClient = null;
  } else {
    // A valid ID was supplied, so find or create the matching IClient object
    fromClient = this.clientMan.getClient(fromClientID);
    fromClient = fromClient == null ? this.clientMan.requestClient(fromClientID) : fromClient;
  }

  // ===== To Clients, or To Server =====
  // If the message was sent to a specific client, a list of specific clients,
  // or to the whole server, then args passed to registered message listeners 
  // are: the Client object plus all user-defined arguments originally passed
  // to sendMessage().       
  if (broadcastType != net.user1.orbiter.ReceiveMessageBroadcastType.TO_ROOMS) {
    args = [fromClient].concat(userDefinedArgs);
    try {
      msgMan.notifyMessageListeners(message, args);
    } catch (e) {
      listenerError = e;
    }
  } else {
  
    // ===== To Rooms =====
    // Check if the room is valid
    if (toRoom == null) { 
      this.log.warn("Message (u7) received for unknown room: [" + toRoomID + "]"
        + "Message: [" + message + "]");
      return;
    }
  
    // RECEIVE_MESSAGE was a response to SEND_MESSAGE_TO_ROOMS, so 
    // we notify listeners only if they asked to be told about messages 
    // sent to the recipient room.

    // First, get the list of messsage listeners for this message
    var listeners = msgMan.getMessageListeners(message);

    // Split the recipient room ID into two parts
    var toRoomSimpleID  = net.user1.orbiter.RoomIDParser.getSimpleRoomID(toRoomID);
    var toRoomQualifier = net.user1.orbiter.RoomIDParser.getQualifier(toRoomID);

    // If the message can be dispatched, set to true.
    var listenerFound; 
    // If the listener isn't interested in messages sent to the 
    // recipient room, set to true.
    var listenerIgnoredMessage;
                                         
    // ===== Run once for each message listener =====
    var messageListener;
    for (var i = 0; i < listeners.length; i++) {
      messageListener = listeners[i];
      
      // Assume this listener ignored the message until we prove it didn't
      listenerIgnoredMessage = true;
      
      // --- Has no "forRoomIDs" filter ---
      // If the listener doesn't specify any forRoomIDs, then 
      // just send it the message notification. (No-rooms-specified
      // means the listener wants all of these messages, no matter
      // which room they were sent to.) This listener is told which 
      // room the message was sent to via args[1] (toRoomID).
      if (messageListener.getForRoomIDs() == null) {
        args = [fromClient, toRoom].concat(userDefinedArgs);
        try {
          messageListener.getListenerFunction().apply(messageListener.getThisArg(), args);
        } catch (e) {
          listenerError = e;
        }
        listenerFound = true;
        listenerIgnoredMessage = false;
        continue;  // Done with this listener. On to the next.
      }
      
      // --- Has a "forRoomIDs" filter ---
      // If the message was sent to any of the rooms the listener is 
      // interested in, then notify that listener. Note that a listener 
      // for messages sent to room foo.* means the listener wants 
      // notifications for all rooms whose ids start with foo.
      var listenerRoomIDs  = messageListener.getForRoomIDs();
      var listenerRoomQualifier;
      var listenerRoomSimpleID;
      // ===== Run once for each room id =====
      var listenerRoomIDString;
      for (var j = 0; j < listenerRoomIDs.length; j++) {
        listenerRoomIDString = listenerRoomIDs[j];
        // Split the room id
        listenerRoomQualifier = net.user1.orbiter.RoomIDParser.getQualifier(listenerRoomIDString);
        listenerRoomSimpleID  = net.user1.orbiter.RoomIDParser.getSimpleRoomID(listenerRoomIDString);

        // Check if the listener is interested in the recipient room...
        if (listenerRoomQualifier == toRoomQualifier
            && 
            (listenerRoomSimpleID == toRoomSimpleID
             || listenerRoomSimpleID == "*")) {
          // Found a match. Notify the listener...
            
          // Prepare args.
          if (listenerRoomIDs.length == 1) {
            // The listener is interested in messages sent to a 
            // specific room only, so omit the "toRoom" arg.
            // (The listener already knows the target room because 
            // it's only notified if the message was sent to that room.)
            args = [fromClient].concat(userDefinedArgs);
          } else {
            // The listener is interested in messages sent to 
            // multiple rooms. In this case, we have to 
            // include the "toRoom" arg so the listener knows 
            // which room received the message.
            args = [fromClient, toRoom].concat(userDefinedArgs);
          }
          
          try {
            messageListener.getListenerFunction().apply(messageListener.getThisArg(), args);
          } catch (e) {
            listenerError = e;
          }
          listenerFound = true;
          listenerIgnoredMessage = false;
          break; // Stop looking at this listener's room ids
        }
      } // Done looking at this listener's room ids
      if (listenerIgnoredMessage) {
        this.log.debug("Message listener ignored message: " + message + ". "
                       + "Listener registered to receive " 
                       + "messages sent to: " + messageListener.getForRoomIDs() 
                       + ", but message was sent to: " + toRoomID);
      }
    } 
    if (!listenerFound) {
      this.log.warn("No message listener handled incoming message: " 
                    + message + ", sent to: " + toRoomID);
    }
  } // Done looking at listeners for the incoming message
  
  if (listenerError != null) {
    throw new Error("A message listener for incoming message [" + message + "]" +
      (fromClient == null ? "" : ", received from client [" + fromClient.getClientID() + "],") + 
      " encountered an error:\n\n" + listenerError.toString() +
      "\n\nEnsure that all [" + message + "] listeners supply a first" +
      " parameter whose datatype is Client (or a compatible type). Listeners" +
      " that registered for the message via MessageManager's addMessageListener()" +
      " with anything other than a single roomID for the toRoomIDs parameter must" +
      " also define a second paramter whose" +
      " datatype is Room (or a compatible type). Finally, ensure that" +
      " the listener's declared message parameters match the following actual message" +
      " arguments:\n    " + userDefinedArgs
      + (typeof listenerError.stack === "undefined" ? "" : "\n\nStack trace follows:\n" + listenerError.stack)
      );
  }
}

/**
 * Client attribute update
 */
net.user1.orbiter.CoreMessageListener.prototype.u8 = function (attrScope,
                                                               clientID,
                                                               userID,
                                                               attrName,
                                                               attrVal,
                                                               attrOptions) { 
  var client;
  var account;
  var options = parseInt(attrOptions);
  
  if (options &net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT) {
    account = this.accountMan.getAccount(userID);
    if (account != null) {
      account.getAttributeManager().setAttributeLocal(attrName, attrVal, attrScope);
    } else {
      throw new Error("[CORE_MESSAGE_LISTENER] Received an attribute update for "
        + " an unknown user account [" + userID + "]. Please report this error with"
        + " the following log to union@user1.net.\n" 
        + this.log.getHistory().join("\n"));
    }
  } else {
    client = this.clientMan.getInternalClient(clientID);
    if (client != null) {
      client.getAttributeManager().setAttributeLocal(attrName, attrVal, attrScope);
    } else {
      throw new Error("[CORE_MESSAGE_LISTENER] Received an attribute update for "
        + " an unknown client [" + clientID + "]. Please report this error with"
        + " the following log to union@user1.net.\n" 
        + this.log.getHistory().join("\n"));
    }
  }
};

/**
 * Room attribute update
 */
net.user1.orbiter.CoreMessageListener.prototype.u9 = function (roomID, 
                                                               byClientID,
                                                               attrName,
                                                               attrVal) {
  var theRoom = this.roomMan.getRoom(roomID);
  var byClient;
  
  // Quit if the room isn't found
  if (theRoom == null) {
    this.log.warn("Room attribute update received for server-side room with no" + 
             " matching client-side Room object. Room ID [" +
             roomID + "]. Attribute: [" + attrName + "].");
    return;
  }

  // Retrieve the Client object for the sender
  if (byClientID == "") {
    // No client ID was supplied, so the message was generated by the
    // server, not by a client, so set fromClient to null.
    byClient = null;
  } else {
    // A valid ID was supplied, so find or create the matching IClient object
    byClient = this.clientMan.getClient(byClientID);
    byClient = byClient == null ? this.clientMan.requestClient(byClientID) : byClient;
  }

  theRoom.getAttributeManager().setAttributeLocal(attrName, attrVal, net.user1.orbiter.Tokens.GLOBAL_ATTR, byClient);
};

/**
 * CLIENT_METADATA
 */
net.user1.orbiter.CoreMessageListener.prototype.u29 = function (id) {
  var theClient = this.clientMan.requestClient(id);
  this.clientMan.setSelf(theClient);
};

/**
 * CREATE_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u32 = function (roomID, status) {
  var theRoom = this.roomMan.getRoom(roomID);
  switch (status) {
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ROOM_EXISTS:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.roomMan.fireCreateRoomResult(net.user1.orbiter.RoomIDParser.getQualifier(roomID),
                                        net.user1.orbiter.RoomIDParser.getSimpleRoomID(roomID),
                                        status);
      break;
    
    default: 
      this.log.warn("Unrecognized status code for u32."
               + " Room ID: [" + roomID + "], status: [" + status + "].");
  }
};

/**
 * REMOVE_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u33 = function (roomID, status) {
  this.roomMan.fireRemoveRoomResult(net.user1.orbiter.RoomIDParser.getQualifier(roomID),
                                    net.user1.orbiter.RoomIDParser.getSimpleRoomID(roomID),
                                    status);
  switch (status) {
    case net.user1.orbiter.Status.ERROR: 
      this.log.warn("Server error for room removal attempt: " + roomID);
      break;
    case net.user1.orbiter.Status.PERMISSION_DENIED: 
      this.log.info("Attempt to remove room [" + roomID 
               + "] failed. Permission denied. See server log for details.");
      break;
      
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
      if (this.roomMan.getRoom(roomID) != null) {
        this.roomMan.disposeRoom(roomID);
      }
      break;
    
    case net.user1.orbiter.Status.AUTHORIZATION_REQUIRED:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
      break;
    
    default: 
      this.log.warn("Unrecognized status code for u33."
               + " Room ID: [" + roomID + "], status: [" + status + "].");
  }
};

/**
 * CLIENTCOUNT_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u34 = function (requestID,
                                                                numClients) {
  this.snapshotMan.receiveClientCountSnapshot(requestID, parseInt(numClients));
};

/**
 * CLIENT_ADDED_TO_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u36 = function (roomID,
                                                     clientID,
                                                     userID,
                                                     globalAttributes,
                                                     roomAttributes) {
  var theClient = this.clientMan.requestClient(clientID);
  var account = this.accountMan.requestAccount(userID);
  var clientManifest;
  if (account != null
      && theClient.getAccount() != account) {
    theClient.setAccount(account);
  }

  // If it's not the current client, set the client's attributes. 
  // (The current client obtains its own attributes through separate u8s.)
  var theRoom = this.roomMan.getRoom(roomID);
  if (!theClient.isSelf()) {
    clientManifest = new net.user1.orbiter.ClientManifest();
    clientManifest.deserialize(clientID, userID, null, 
                               null, globalAttributes, [roomID, roomAttributes]);
    theClient.synchronize(clientManifest);
    
    // If the client is observed, don't fire JOIN; observed clients always
    // fire JOIN based on observation updates. Likewise, don't fire JOIN
    // on self; self fires JOIN when it receives a u6.
    if (!this.clientMan.isObservingClient(clientID)) {
      theClient.fireJoinRoom(theRoom, roomID);
    }
  }

  // Add the client to the given room.
  theRoom.addOccupant(theClient);
};

/**
 * CLIENT_REMOVED_FROM_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u37 = function (roomID, 
                                                                clientID) {
  // Remove the room from the client's list of occupied rooms
  var theClient = this.clientMan.requestClient(clientID);
  var theRoom = this.roomMan.getRoom(roomID);

  // Remove the client from the given room
  theRoom.removeOccupant(clientID);
  
  // Don't fire LEAVE on self; self fires LEAVE when it receives a u44.
  if (!theClient.isSelf()) {
    // If the client is observed, don't fire LEAVE; observed clients always
    // fire LEAVE based on observation updates.
    if (!this.clientMan.isObservingClient(clientID)) {
      theClient.fireLeaveRoom(theRoom, roomID);
    }
  }
};

/**
 * ROOMLIST_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u38 = function (requestID,
                                                                requestedRoomIDQualifier, 
                                                                recursive) {
  var args = Array.prototype.slice.call(arguments).slice(3);
  var roomQualifier;
  var roomIDs;
  var roomList = [];
  
  if (requestID == "") {
    // Synchronize
    for (var i = 0; i < args.length; i+=2) {
      roomQualifier = args[i];
      roomIDs       = args[i+1].split(net.user1.orbiter.Tokens.RS);
      
      this.roomMan.setWatchedRooms(roomQualifier, roomIDs);
    }
  } else {
    // Snapshot
    for (i = 0; i < args.length; i+=2) {
      roomQualifier = args[i];
      roomIDs = args[i+1].split(net.user1.orbiter.Tokens.RS);
      for (var j = 0; j < roomIDs.length; j++) {
        roomList.push(roomQualifier + (roomQualifier == "" ? "" : ".") + roomIDs[j]);
      }
    }
    this.snapshotMan.receiveRoomListSnapshot(requestID, roomList, requestedRoomIDQualifier, recursive == "true");
  }
};

/**
 * ROOM_ADDED
 */
net.user1.orbiter.CoreMessageListener.prototype.u39 = function (roomID) { 
  // Add the room 
  this.roomMan.addWatchedRoom(roomID);
};

/**
 * ROOM_REMOVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u40 = function (roomID) {
  this.roomMan.removeWatchedRoom(roomID);
  if (this.roomMan.getRoom(roomID) != null) {
    this.roomMan.disposeRoom(roomID);
  }
};

/**
 * WATCH_FOR_ROOMS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u42 = function (roomIdQualifier, recursive, status) { 
  // Broadcast the result of the observation attempt.
  this.roomMan.fireWatchForRoomsResult(roomIdQualifier, status);
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.INVALID_QUALIFIER:
    case net.user1.orbiter.Status.ALREADY_WATCHING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      break;
      
    default: 
      this.log.warn("Unrecognized status code for u42."
        + " Room ID Qualifier: [" + roomIdQualifier + "], recursive: [" 
        + recursive + "], status: [" + status + "].");
  }
};

/**
 * STOP_WATCHING_FOR_ROOMS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u43 = function (roomIdQualifier, recursive, status) {
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
      if (roomIdQualifier == "" && recursive == "true") {
        this.roomMan.removeAllWatchedRooms();
      } else {
        // Remove all watched rooms for the qualifier
        this.roomMan.setWatchedRooms(roomIdQualifier, []);
      }
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_WATCHING:
    case net.user1.orbiter.Status.INVALID_QUALIFIER:
      this.roomMan.fireStopWatchingForRoomsResult(roomIdQualifier, status);
      break;
      
    default: 
      this.log.warn("Unrecognized status code for u43."
        + " Room ID Qualifier: [" + roomIdQualifier + "], recursive: [" 
        + recursive + "], status: [" + status + "].");
  }
};

/**
 * LEFT_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u44 = function (roomID) {
  var leftRoom = this.roomMan.getRoom(roomID);
  this.roomMan.removeOccupiedRoom(roomID);
  if (leftRoom != null) {
    leftRoom.doLeave();
    this.clientMan.self().fireLeaveRoom(leftRoom, roomID);
  }
};

/**
 * CHANGE_ACCOUNT_PASSWORD_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u46 = function (userID, status) {
  var account = this.accountMan.getAccount(userID); 
  if (account != null) {
    account.fireChangePasswordResult(status);
  }
  this.accountMan.fireChangePasswordResult(userID, status);
};

/**
 * CREATE_ACCOUNT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u47 = function (userID, status) {
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ACCOUNT_EXISTS:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
     this.orbiter.getAccountManager().fireCreateAccountResult(userID, status);
      break;
    default: 
      this.log.warn("Unrecognized status code for u47."
        + " Account: [" + userID + "], status: [" + status + "].");
  }
};

/**
 * REMOVE_ACCOUNT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u48 = function (userID, status) {
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
     this.orbiter.getAccountManager().fireRemoveAccountResult(userID, status);
      break;
    default: 
      this.log.warn("Unrecognized status code for u48."
        + " Account: [" + userID + "], status: [" + status + "].");
  }
};

/**
 * LOGIN_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u49 = function (userID, status) {
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_LOGGED_IN:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.orbiter.getAccountManager().fireLoginResult(userID, status);
      break;
    default:
      this.log.warn("Unrecognized status code for u49."
        + " Account: [" + userID + "], status: [" + status + "].");
  }          
};

/**
 * ROOM_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u54 = function (requestID,
                                                                roomID,
                                                                occupantCount,
                                                                observerCount,
                                                                roomAttributes) {
  var clientList = Array.prototype.slice.call(arguments).slice(5);
  var clientManifest;
  var roomManifest = new net.user1.orbiter.RoomManifest();
  var theRoom;
  roomManifest.deserialize(roomID, 
                           roomAttributes, 
                           clientList, 
                           parseInt(occupantCount), 
                           parseInt(observerCount));
  
  if (requestID == "") {
    // Synchronize
    theRoom = this.roomMan.getRoom(roomID);

    if (theRoom == null) { 
      // If the server makes the current client join or observe a room, it
      // will first send a u54 before sending the u6 or u59 notice. In that
      // case, the room might be unknown briefly, so create a cached room
      // then wait for the u6 or u59 to arrive.
      theRoom = this.roomMan.addCachedRoom(roomID); 
    }
    
    theRoom.synchronize(roomManifest);
  } else {
    // Snapshot
    this.snapshotMan.receiveRoomSnapshot(requestID, roomManifest);
  }
};


/**
 * OBSERVED_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u59 = function (roomID) {
  // Add the room to the observed room list
  var room = this.roomMan.addObservedRoom(roomID);
  // Tell the room to do its join duties
  room.doObserve();
  // Fire OBSERVE through the client
  this.clientMan.self().fireObserveRoom(room, roomID);
};

/**
 * GET_ROOM_SNAPSHOT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u60 = function (requestID,
                                                                roomID,
                                                                status) {
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
    case net.user1.orbiter.Status.AUTHORIZATION_REQUIRED:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.snapshotMan.receiveSnapshotResult(requestID, status);
      break;
    default:
      this.log.warn("Unrecognized status code for u60."
        + " Request ID: [" + requestID + "], Room ID: [" 
        + roomID + "], status: [" + status + "].");
  } 
};

/**
 * STOPPED_OBSERVING_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u62 = function (roomID) {
  var theRoom = this.roomMan.getRoom(roomID);
  this.roomMan.removeObservedRoom(roomID);
  if (theRoom != null) {
    theRoom.doStopObserving();
    // self() might return null if a STOP_OBSERVING listener has closed the connection
    if (this.clientMan.self() != null) {   
      this.clientMan.self().fireStopObservingRoom(theRoom, roomID);
    }
  }
};

/**
 * SERVER_HELLO
 */
net.user1.orbiter.CoreMessageListener.prototype.u66 = function (serverVersion, 
                                                                sessionID,
                                                                serverUPCVersionString,
                                                                protocolCompatible,
                                                                affinityAddress,
                                                                affinityDuration) {
  this.log.info("[ORBITER] Server version: " + serverVersion);
  this.log.info("[ORBITER] Server UPC version: " + serverUPCVersionString);
  
  var serverUPCVersion = new net.user1.orbiter.VersionNumber();
  serverUPCVersion.fromVersionString(serverUPCVersionString);
  this.orbiter.getServer().setVersion(serverVersion);
  this.orbiter.getServer().setUPCVersion(serverUPCVersion);


  var inProgressConnection = this.orbiter.getConnectionManager().getInProgressConnection();
  var inProgressConnectionHost = inProgressConnection.getHost();
  if (affinityAddress != ""  
      && typeof affinityAddress !== "undefined"
      && affinityAddress != inProgressConnectionHost) {
    this.orbiter.getConnectionManager().setAffinity(inProgressConnectionHost, 
                                                    affinityAddress, 
                                                    parseFloat(affinityDuration));
    inProgressConnection.applyAffinity();
  }
};


/**
 * JOIN_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u72 = function (roomID,
                                                               status) {
  var theRoom = this.roomMan.getRoom(roomID);
  switch (status) {
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
      if (this.roomMan.getRoom(roomID) != null) {
        this.roomMan.disposeRoom(roomID);
      }
    
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ROOM_FULL:
    case net.user1.orbiter.Status.AUTHORIZATION_REQUIRED:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ALREADY_IN_ROOM:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.roomMan.fireJoinRoomResult(roomID, status);
      if (theRoom != null) {
        theRoom.doJoinResult(status);
      }
      break;
    
    default: 
      this.log.warn("Unrecognized status code for u72."
        + " Room ID: [" + roomID + "], status: [" + status + "].");
  }
};

/**
 * SET_CLIENT_ATTR_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u73 = function (attrScope,
                                                                clientID,
                                                                userID,
                                                                attrName,
                                                                attrOptions,
                                                                status) { 
  var theClient;
  var theAccount;
  
  switch (status) {
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
      break;
      
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.DUPLICATE_VALUE:
    case net.user1.orbiter.Status.IMMUTABLE:
    case net.user1.orbiter.Status.SERVER_ONLY:
    case net.user1.orbiter.Status.EVALUATION_FAILED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      if (parseInt(attrOptions) & net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT) {
        // Persistent attr
        theAccount = this.accountMan.requestAccount(userID);
        theAccount.getAttributeManager().fireSetAttributeResult(attrName, attrScope, status);
      } else {
        // Non-persistent attr
        theClient = this.clientMan.requestClient(clientID);
        theClient.getAttributeManager().fireSetAttributeResult(attrName, attrScope, status);
      }
      break;
      
    default:
      this.log.warn("Unrecognized status received for u73: " + status);
  }
};

/**
 * SET_ROOM_ATTR_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u74 = function (roomID, 
                                                                attrName,
                                                                status) {
  var theRoom = this.roomMan.getRoom(roomID);
  
  // Quit if the room isn't found
  if (theRoom == null) {
    this.log.warn("Room attribute update received for room with no" + 
      " client-side Room object. Room ID [" +
      roomID + "]. Attribute: [" + attrName + "]. Status: ["
      + status + "].");
    return;
  }
  
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.IMMUTABLE:
    case net.user1.orbiter.Status.SERVER_ONLY:
    case net.user1.orbiter.Status.EVALUATION_FAILED:
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      theRoom.getAttributeManager().fireSetAttributeResult(attrName, 
                                                           net.user1.orbiter.Tokens.GLOBAL_ATTR,
                                                           status);
      break;
    
    default:
      this.log.warn("Unrecognized status received for u74: " + status);
  }
};

/**
 * GET_CLIENTCOUNT_SNAPSHOT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u75 = function (requestID,
                                                                status) {
  this.snapshotMan.receiveSnapshotResult(requestID, status);
};

/**
 * LEAVE_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u76 = function (roomID, 
                                                                status) {
  var leftRoom = this.roomMan.getRoom(roomID);
  
  switch (status) {
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
      if (leftRoom != null) {
        this.roomMan.disposeRoom(roomID);
      }
      
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_IN_ROOM:
      this.roomMan.fireLeaveRoomResult(roomID, status);
      if (leftRoom != null) {
        leftRoom.doLeaveResult(status);
      }
      break;
    
    default: 
      this.log.warn("Unrecognized status code for u76."
        + " Room ID: [" + roomID + "]. Status: [" + status + "].");        
  }
};

/**
 * OBSERVE_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u77 = function (roomID,
                      status) {
  var theRoom = this.roomMan.getRoom(roomID);
  switch (status) { 
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
      if (theRoom != null) {
        this.roomMan.disposeRoom(roomID);
      }
    
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.AUTHORIZATION_REQUIRED:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ALREADY_OBSERVING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.roomMan.fireObserveRoomResult(roomID, status);
      
      if (theRoom) {
        theRoom.doObserveResult(status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u77."
        + " Room ID: [" + roomID + "], status: " + status + ".");
  }
}    

/**
 * STOP_OBSERVING_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u78 = function (roomID, 
                                                                status) {
  var theRoom = this.roomMan.getRoom(roomID);
  
  switch (status) {
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
      if (theRoom != null) {
        this.roomMan.disposeRoom(roomID);
      }
    
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_OBSERVING:
      this.roomMan.fireStopObservingRoomResult(roomID, status);
      
      if (theRoom != null) {
        theRoom.doStopObservingResult(status);
      }
      break;
    
    default: 
      this.log.warn("Unrecognized status code for u78."
        + " Room ID: [" + roomID + "], status: " + status + ".");        
  }
};

/**
 * ROOM_ATTR_REMOVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u79 = function (roomID,
                                                                byClientID,
                                                                attrName) {
  var theRoom = this.roomMan.getRoom(roomID);
  var theClient;
  
  // Quit if the room isn't found
  if (theRoom == null) {
    this.log.warn("Room attribute removal notification received for room with no" + 
      " client-side Room object. Room ID [" +
      roomID + "]. Attribute: [" + attrName + "].");
    return;
  }
  
  // If the clientID is "", the server removed the room, so there's no
  // corresponding client.
  theClient = byClientID == "" ? null : this.clientMan.requestClient(byClientID);
  theRoom.getAttributeManager().removeAttributeLocal(attrName, net.user1.orbiter.Tokens.GLOBAL_ATTR, theClient)
}

/**
 * REMOVE_ROOM_ATTR_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u80 = function (roomID,
                                                                attrName,
                                                                status) {
  var theRoom = this.roomMan.getRoom(roomID);      
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.IMMUTABLE:
    case net.user1.orbiter.Status.SERVER_ONLY:
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
    case net.user1.orbiter.Status.ATTR_NOT_FOUND:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      if (theRoom != null) {
        theRoom.getAttributeManager().fireDeleteAttributeResult(attrName,
                                                                net.user1.orbiter.Tokens.GLOBAL_ATTR,
                                                                status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status received for u80: " + status);
  }
};  

/**
 * CLIENT_ATTR_REMOVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u81 = function (attrScope,
                                                                clientID,
                                                                userID, 
                                                                attrName,
                                                                attrOptions) {
  var client;
  var account;
  
  if (parseInt(attrOptions) & net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT) {
    // Persistent attr
    account = this.accountMan.requestAccount(userID);
    account.getAttributeManager().removeAttributeLocal(attrName, attrScope);
  } else {
    // Non-persistent attr
    client = this.clientMan.requestClient(clientID);
    client.getAttributeManager().removeAttributeLocal(attrName, attrScope);
  }
};

/**
 * REMOVE_CLIENT_ATTR_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u82 = function (attrScope,
                                                                clientID,
                                                                userID,
                                                                attrName,
                                                                attrOptions,
                                                                status) { 
  var client;
  var account;
  
  
  switch (status) {
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
      break;
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.IMMUTABLE:
    case net.user1.orbiter.Status.SERVER_ONLY:
    case net.user1.orbiter.Status.ATTR_NOT_FOUND: 
    case net.user1.orbiter.Status.EVALUATION_FAILED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      if (parseInt(attrOptions) & net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT) {
        // Persistent attr
        account = this.accountMan.requestAccount(userID);
        account.getAttributeManager().fireDeleteAttributeResult(attrName, attrScope, status);
      } else {
        // Non-persistent attr
        client = this.clientMan.requestClient(clientID);
        client.getAttributeManager().fireDeleteAttributeResult(attrName, attrScope, status);
      }
      break;
      
    default:
      this.log.warn("Unrecognized status received for u82: " + status);
  }
};

/**
 * SESSION_TERMINATED
 */
net.user1.orbiter.CoreMessageListener.prototype.u84 = function () {
  this.orbiter.getConnectionManager().dispatchSessionTerminated();
};

/**
 * LOGOFF_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u87 = function (userID, status) {
  var account = this.accountMan.getAccount(userID);

  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.NOT_LOGGED_IN:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      if (account != null) {
        account.fireLogoffResult(status);
      }
      // Tell the account manager
      this.accountMan.fireLogoffResult(userID, status);
      break;
    default:
      this.log.warn("Unrecognized status received for u87: " + status);
  }
};

/**
 * LOGGED_IN
 */
net.user1.orbiter.CoreMessageListener.prototype.u88 = function (clientID, 
                                                                userID,
                                                                globalAttrs) {
  var roomAttrs = Array.prototype.slice.call(arguments).slice(3);
  var account = this.accountMan.requestAccount(userID);
  var client = this.clientMan.requestClient(clientID);
  var clientManifest = new net.user1.orbiter.ClientManifest();
  clientManifest.deserialize(clientID, userID, null, null, globalAttrs, roomAttrs);      
  // Update the account
  var scopes = clientManifest.persistentAttributes.getScopes();
  var accountAttrs = account.getAttributeManager().getAttributeCollection();
  for (var i = scopes.length; --i >= 0;) {
    accountAttrs.synchronizeScope(scopes[i], clientManifest.persistentAttributes);
  }
  
  if (client.getAccount() == null) {
    // Client doesn't know about this account yet
    client.setAccount(account);
    client.fireLogin();
    account.doLoginTasks();
    this.accountMan.fireLogin(account, clientID);
  } else {
    // Do nothing if the account is known. Logins are reported for 
    // observe-account, observe-client, and watch-for-clients, so a 
    // client might receive multiple login notifications.
  }
};

/**
 * LOGGED_OFF
 */
net.user1.orbiter.CoreMessageListener.prototype.u89 = function (clientID, userID) {
  var client = this.clientMan.getInternalClient(clientID);
  var account = this.accountMan.getAccount(userID);
  
  if (account != null) {
    if (account.getConnectionState() == net.user1.orbiter.ConnectionState.LOGGED_IN) {
      if (client != null) {
        client.fireLogoff(userID);
      }
      account.doLogoffTasks();
      this.accountMan.fireLogoff(account, clientID);
    } else {
      // Do nothing if the account is unknown. Logoffs are reported for 
      // observe-account, observe-client, and watch-for-clients, so a 
      // client might receive multiple logoff notifications.
    }
  } else {
    throw new Error("LOGGED_OFF (u89) received for an unknown user: [" + userID + "].");
  }
}

/**
 * PASSWORD_CHANGED
 */
net.user1.orbiter.CoreMessageListener.prototype.u90 = function () {
  var self = this.orbiter.self();
  var selfAccount = self.getAccount();
  if (selfAccount != null) {
    selfAccount.fireChangePassword();
  }
  this.accountMan.fireChangePassword(selfAccount ? selfAccount.getUserID() : null);
};

/**
 * CLIENTLIST_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u101 = function (requestID, serializedIDs) {
  var ids = serializedIDs.split(net.user1.orbiter.Tokens.RS);
  var clientList;
  var thisUserID;
  
  if (requestID == "") {
    // Synchronize
    this.clientMan.deserializeWatchedClients(serializedIDs);
  } else {
    // Snapshot
    clientList = [];
    for (var i = ids.length-1; i >= 0; i-=2) {
      thisUserID = ids[i];
      thisUserID = thisUserID == "" ? null : thisUserID;
      clientList.push({clientID:ids[i-1], userID:thisUserID});
    }
    this.snapshotMan.receiveClientListSnapshot(requestID, clientList);
  }      
};    

/**
 * CLIENT_ADDED_TO_SERVER
 */
net.user1.orbiter.CoreMessageListener.prototype.u102 = function (clientID) {
  this.clientMan.addWatchedClient(this.clientMan.requestClient(clientID));
};

/**
 * CLIENT_REMOVED_FROM_SERVER
 */
net.user1.orbiter.CoreMessageListener.prototype.u103 = function (clientID) {
  var client = this.clientMan.getInternalClient(clientID);
  
  if (this.clientMan.hasWatchedClient(clientID)) {
    this.clientMan.removeWatchedClient(clientID);
  }
  if (this.clientMan.isObservingClient(clientID)) {
    this.clientMan.removeObservedClient(clientID);
  }
  
  // If the current client is both observing a client and watching for clients,
  // it will receive two u103 notifications. When the second one arrives, the
  // client will be unknown, so no disconnection event should be dispatched.
  if (client != null) {
    client.setConnectionState(net.user1.orbiter.ConnectionState.NOT_CONNECTED);
    // Retrieve the client reference using getClient() here so that the
    // ClientManagerEvent.CLIENT_DISCONNECTED event provides the application
    // with access to the custom client, if available.
    this.clientMan.fireClientDisconnected(this.clientMan.getClient(clientID));
  }
};

/**
 * CLIENT_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u104 = function (requestID,
                                                                 clientID,
                                                                 userID,
                                                                 serializedOccupiedRoomIDs,
                                                                 serializedObservedRoomIDs,
                                                                 globalAttrs) {
  var roomAttrs = Array.prototype.slice.call(arguments).slice(7);
  var theClient;
  var account = this.accountMan.requestAccount(userID);
  var clientManifest = new net.user1.orbiter.ClientManifest();
  clientManifest.deserialize(clientID, userID, serializedOccupiedRoomIDs, 
                             serializedObservedRoomIDs, globalAttrs, roomAttrs);
  var scopes; // Used with UserAccount only
  
  if (clientID != "") {  
    // --- Client update ---
    
    if (requestID == "") {
      // Synchronize
      theClient = this.clientMan.requestClient(clientID);
      theClient.setAccount(account);
      theClient.synchronize(clientManifest);
      theClient.fireSynchronize();
    } else {
      // Snapshot
      this.snapshotMan.receiveClientSnapshot(requestID, clientManifest);
    }
  } else {  
    // --- User account update ---

    if (requestID == "") {
      // Synchronize
      scopes = clientManifest.persistentAttributes.getScopes();
      for (var i = scopes.length; --i >= 0;) {
        account.getAttributeManager().getAttributeCollection().synchronizeScope(scopes[i], clientManifest.persistentAttributes);
      }
      account.fireSynchronize();
    } else {
      // Snapshot
      this.snapshotMan.receiveAccountSnapshot(requestID, clientManifest);
    }
  }
};

/**
 * OBSERVE_CLIENT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u105 = function (clientID, status) {
  var theClient = this.clientMan.getInternalClient(clientID);
  switch (status) { 
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_OBSERVING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.clientMan.fireObserveClientResult(clientID, status);
      if (theClient != null) {
        theClient.fireObserveResult(status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u105."
               + " Client ID: [" + clientID + "], status: [" + status + "].");
  }
};    

/**
 * STOP_OBSERVING_CLIENT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u106 = function (clientID, status) {
  var theClient = this.clientMan.getInternalClient(clientID);
  switch (status) { 
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_OBSERVING:
      this.clientMan.fireStopObservingClientResult(clientID, status);
      if (theClient != null) {
        theClient.fireStopObservingResult(status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u106."
               + " Client ID: [" + clientID + "], status: [" + status + "].");
  }
};

/**
 * WATCH_FOR_CLIENTS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u107 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_WATCHING:
      this.clientMan.fireWatchForClientsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u107."
                    + "Status: [" + status + "].");
  }
};

/**
 * STOP_WATCHING_FOR_CLIENTS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u108 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
      this.clientMan.setIsWatchingForClients(false);
      this.clientMan.removeAllWatchedClients();
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_WATCHING:
      this.clientMan.fireStopWatchingForClientsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u108."
               + "Status: [" + status + "].");
  }
};    

/**
 * WATCH_FOR_USERS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u109 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
      this.accountMan.setIsWatchingForAccounts(true);
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_WATCHING:
      this.accountMan.fireWatchForAccountsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u109."
               + "Status: [" + status + "].");
  }
};  

/**
 * STOP_WATCHING_FOR_USERS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u110 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
      this.accountMan.setIsWatchingForAccounts(false);
      this.accountMan.removeAllWatchedAccounts();
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_WATCHING:
      this.accountMan.fireStopWatchingForAccountsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u110."
               + "Status: [" + status + "].");
  }
};    

/**
 * USER_ADDED
 */
net.user1.orbiter.CoreMessageListener.prototype.u111 = function (userID) {
  this.accountMan.addWatchedAccount(this.accountMan.requestAccount(userID));
};    

/**
 * USER_REMOVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u112 = function (userID) {
  var account;
  if (this.accountMan.hasWatchedAccount(userID)) {
    account = this.accountMan.removeWatchedAccount(userID);
  }
  if (this.accountMan.isObservingAccount(userID)) {
    account = this.accountMan.removeObservedAccount(userID);
  }
  this.accountMan.fireAccountRemoved(userID, account);
};    

/**
 * JOINED_ROOM_ADDED_TO_CLIENT
 */
net.user1.orbiter.CoreMessageListener.prototype.u113 = function (clientID, roomID) {
  var client = this.clientMan.requestClient(clientID);
  client.addOccupiedRoomID(roomID);
  client.fireJoinRoom(this.roomMan.getRoom(roomID), roomID);
}    

/**
 * JOINED_ROOM_REMOVED_FROM_CLIENT
 */
net.user1.orbiter.CoreMessageListener.prototype.u114 = function (clientID, roomID) {
  var client = this.clientMan.requestClient(clientID);
  client.removeOccupiedRoomID(roomID);
  client.fireLeaveRoom(this.roomMan.getRoom(roomID), roomID);
};    

/**
 * GET_CLIENT_SNAPSHOT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u115 = function (requestID,
                                                                 clientID, 
                                                                 status) {
  this.snapshotMan.receiveSnapshotResult(requestID, status);
};

/**
 * GET_ACCOUNT_SNAPSHOT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u116 = function (requestID,
                                                                 userID, 
                                                                 status) {
  this.snapshotMan.receiveSnapshotResult(requestID, status);
};

/**
 * OBSERVED_ROOM_ADDED_TO_CLIENT
 */
net.user1.orbiter.CoreMessageListener.prototype.u117 = function (clientID, roomID) {
  var client = this.clientMan.requestClient(clientID);
  client.addObservedRoomID(roomID);
  client.fireObserveRoom(this.roomMan.getRoom(roomID), roomID);
};    

/**
 * OBSERVED_ROOM_REMOVED_FROM_CLIENT
 */
net.user1.orbiter.CoreMessageListener.prototype.u118 = function (clientID, roomID) {
  var client = this.clientMan.requestClient(clientID);
  client.removeObservedRoomID(roomID);
  client.fireStopObservingRoom(this.roomMan.getRoom(roomID), roomID);
}    

/**
 * CLIENT_OBSERVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u119 = function (clientID) {
  var client = this.clientMan.requestClient(clientID);
  this.clientMan.addObservedClient(client);
  client.fireObserve();
};

/**
 * STOPPED_OBSERVING_CLIENT
 */
net.user1.orbiter.CoreMessageListener.prototype.u120 = function (clientID) {
  var client = this.clientMan.getInternalClient(clientID)
  this.clientMan.removeObservedClient(clientID);
  if (client != null) {
    client.fireStopObserving();
  }
};

/**
 * OBSERVE_ACCOUNT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u123 = function (userID, status) {
  var theAccount = this.accountMan.getAccount(userID);
  switch (status) { 
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_OBSERVING:
      this.accountMan.fireObserveAccountResult(userID, status);
      if (theAccount) {
        theAccount.fireObserveResult(status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u123."
               + " User ID: [" + userID + "], status: [" + status + "].");
  }
};

/**
 * ACCOUNT_OBSERVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u124 = function (userID) {
  var theAccount = this.accountMan.requestAccount(userID);
  this.accountMan.addObservedAccount(theAccount);
  theAccount.fireObserve();
};

/**
 * STOP_OBSERVING_ACCOUNT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u125 = function (userID, status) {
  var theAccount = this.accountMan.getAccount(userID);
  switch (status) { 
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_OBSERVING:
      this.accountMan.fireStopObservingAccountResult(userID, status);
      if (theAccount) {
        theAccount.fireStopObservingResult(status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u125."
               + " User ID: [" + userID + "], status: [" + status + "].");
  }
};

/**
 * STOPPED_OBSERVING_ACCOUNT
 */
net.user1.orbiter.CoreMessageListener.prototype.u126 = function (userID) {
  var account = this.accountMan.getAccount(userID);
  this.accountMan.removeObservedAccount(userID);
  if (account != null) {
    account.fireStopObserving();
  }
};

/**
 * ACCOUNT_LIST_UPDATE
 */
net.user1.orbiter.CoreMessageListener.prototype.u127 = function (requestID, serializedIDs) {
  var ids = serializedIDs.split(net.user1.orbiter.Tokens.RS);
  var accountList;
  
  if (requestID == "") {
    // Synchronize
    this.accountMan.deserializeWatchedAccounts(serializedIDs);
  } else {
    // Snapshot
    accountList = [];
    for (var i = ids.length; --i >= 0;) {
      accountList.push(ids[i]);
    }
    this.snapshotMan.receiveAccountListSnapshot(requestID, accountList);
  }  
};

/**
 * UPDATE_LEVELS_UPDATE
 */
net.user1.orbiter.CoreMessageListener.prototype.u128 = function (updateLevels, roomID) {
  var room = this.roomMan.getRoom(roomID);
  var levels = new net.user1.orbiter.UpdateLevels();
  levels.fromInt(parseInt(updateLevels));
  if (room != null) {
    if (!levels.occupantList) {
      var occupantID;
      var occupantIDs = room.getOccupantIDs();
      var numOccupantIDs = occupantIDs.length;
      for (var i = 0; i < numOccupantIDs; i++) {
        occupantID = occupantIDs[i];
        room.removeOccupant(occupantID);
      }
    }
    if (!levels.observerList) {
      var observerID;
      var observerIDs = room.getObserverIDs();
      var numObserverIDs = observerIDs.length;
      for (i = 0; i < numObserverIDs; i++) {
        observerID = observerIDs[i];
        room.removeObserver(observerID);
      }
    }
    if (!levels.sharedRoomAttributes
        && !levels.allRoomAttributes) {
      room.getAttributeManager().removeAll();
    }
  }
};

/**
 * CLIENT_OBSERVED_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u129 = function (roomID,
                                                                 clientID,
                                                                 userID,
                                                                 globalAttributes,
                                                                 roomAttributes) {
  var theClient = this.clientMan.requestClient(clientID);
  var account = this.accountMan.requestAccount(userID);
  var clientManifest;
  if (account != null
      && theClient.getAccount() != account) {
    theClient.setAccount(account);
  }

  // If it's not the current client, set the client's attributes. 
  // (The current client obtains its own attributes through separate u8s.)
  var theRoom = this.roomMan.getRoom(roomID);
  if (!theClient.isSelf()) {
    clientManifest = new net.user1.orbiter.ClientManifest();
    clientManifest.deserialize(clientID, userID, null, 
                               null, globalAttributes, [roomID, roomAttributes]);
    theClient.synchronize(clientManifest);
    
    // If the client is observed, don't fire OBSERVE_ROOM; observed clients always
    // fire OBSERVE_ROOM based on observation updates. Likewise, don't fire OBSERVE_ROOM
    // on self; self fires OBSERVE_ROOM when it receives a u59.
    if (!this.clientMan.isObservingClient(clientID)) {
      theClient.fireObserveRoom(theRoom, roomID);
    }
  }

  // Add the client to the room's observer list
  theRoom.addObserver(theClient);
};

/**
 * CLIENT_STOPPED_OBSERVING_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u130 = function (roomID, 
                                                                 clientID) {
  // Remove the room from the client's list of observed rooms
  var theClient = this.clientMan.requestClient(clientID);
  var theRoom = this.roomMan.getRoom(roomID);

  // Remove the client from the given room
  theRoom.removeObserver(clientID);
  
  // Don't fire STOP_OBSERVING_ROOM on self; self fires STOP_OBSERVING_ROOM
  // when it receives a u62.
  if (!theClient.isSelf()) {
    // If the client is observed, don't fire STOP_OBSERVING_ROOM; observed 
    // clients always fire STOP_OBSERVING_ROOM based on observation updates.
    if (!this.clientMan.isObservingClient(clientID)) {
      theClient.fireStopObservingRoom(theRoom, roomID);
    }
  }
};

/**
 * ROOM_OCCUPANTCOUNT_UPDATE
 */
net.user1.orbiter.CoreMessageListener.prototype.u131 = function (roomID, 
                                                                 numClients) {
  var levels = this.clientMan.self().getUpdateLevels(roomID);
  
  if (levels != null) {
    if (!levels.occupantList) {
      this.roomMan.getRoom(roomID).setNumOccupants(parseInt(numClients));
    }
  } else {
    throw new Error("[CORE_MESSAGE_LISTENER] Received a room occupant count" +
      " update (u131), but update levels are unknown for the room. Synchronization" +
      " error. Please report this error to union@user1.net.");
  }
};

/**
 * ROOM_OBSERVERCOUNT_UPDATE
 */
net.user1.orbiter.CoreMessageListener.prototype.u132 = function (roomID,  
                                                                 numClients) {
  var levels = this.clientMan.self().getUpdateLevels(roomID);
  
  if (levels != null) {
    if (!levels.observerList) {
      this.roomMan.getRoom(roomID).setNumObservers(parseInt(numClients));
    }
  } else {
    throw new Error("[CORE_MESSAGE_LISTENER] Received a room observer count" +
      " update (u132), but update levels are unknown for the room. Synchronization" +
      " error. Please report this error to union@user1.net.");
  }
}

/**
 * ADD_ROLE_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u134 = function (userID, role, status) {
  var theAccount = this.accountMan.getAccount(userID);
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.ROLE_NOT_FOUND:
    case net.user1.orbiter.Status.ALREADY_ASSIGNED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.accountMan.fireAddRoleResult(userID, role, status);
      if (theAccount) {
        theAccount.fireAddRoleResult(role, status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u134."
               + " User ID: [" + userID + "], role: [" + role 
               + "], status: [" + status + "].");
  }
};

/**
 * REMOVE_ROLE_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u136 = function (userID, role, status) {
  var theAccount = this.accountMan.getAccount(userID);
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.ROLE_NOT_FOUND:
    case net.user1.orbiter.Status.NOT_ASSIGNED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.accountMan.fireRemoveRoleResult(userID, role, status);
      if (theAccount) {
        theAccount.fireRemoveRoleResult(role, status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u136."
               + " User ID: [" + userID + "], role: [" + role 
               + "], status: [" + status + "].");
  }
};

/**
 * BAN_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u138 = function (address, clientID, status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.ALREADY_BANNED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.clientMan.fireBanClientResult(address, clientID, status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u138."
               + " Address: [" + address + "], clientID: [" + clientID 
               + "], status: [" + status + "].");
  }
};

/**
 * UNBAN_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u140 = function (address, status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_BANNED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.clientMan.fireUnbanClientResult(address, status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u140."
               + " Address: [" + address + "],"
               + " status: [" + status + "].");
  }
};

/**
 * BANNED_LIST_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u142 = function (requestID, bannedListSource) {
  var bannedList = bannedListSource == "" ? [] : bannedListSource.split(net.user1.orbiter.Tokens.RS);
  
  if (requestID == "") {
    this.clientMan.setWatchedBannedAddresses(bannedList);
  } else {
    // Snapshot
    this.snapshotMan.receiveBannedListSnapshot(requestID, bannedList);
  }
};

/**
 * WATCH_FOR_BANNED_ADDRESSES_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u144 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_WATCHING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.clientMan.fireWatchForBannedAddressesResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u144:"
               + " [" + status + "].");
  }
};

/**
 * STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u146 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_WATCHING:
      this.clientMan.fireStopWatchingForBannedAddressesResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u146:"
               + " [" + status + "].");
  }
};

/**
 * BANNED_ADDRESS_ADDED
 */
net.user1.orbiter.CoreMessageListener.prototype.u147 = function (address) {
  this.clientMan.addWatchedBannedAddress(address);
};

/**
 * BANNED_ADDRESS_REMOVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u148 = function (address) {
  this.clientMan.removeWatchedBannedAddress(address);
};

/**
 * KICK_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u150 = function (clientID, status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.clientMan.fireKickClientResult(clientID, status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u150:"
               + " [" + status + "].");
  }
};

/**
 * SERVERMODULELIST_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u152 = function (requestID, serverModuleListSource) {
  var moduleListArray = serverModuleListSource == "" ? [] : serverModuleListSource.split(net.user1.orbiter.Tokens.RS);
  var moduleList = [];
  for (var i = 0; i < moduleListArray.length; i+= 3) {
    moduleList.push(new ModuleDefinition(moduleListArray[i],
                                         moduleListArray[i+1],
                                         moduleListArray[i+2]));
  }
  
  if (requestID == "") {
    this.log.warn("Incoming SERVERMODULELIST_SNAPSHOT UPC missing required requestID. Ignoring message.");
  } else {
    // Snapshot
    this.snapshotMan.receiveServerModuleListSnapshot(requestID, moduleList);
  }
};

/**
 * GET_UPC_STATS_SNAPSHOT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u155 = function (requestID,
                                                                 status) {
  this.snapshotMan.receiveSnapshotResult(requestID, status);
};

/**
 * UPC_STATS_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u156 = function (requestID,
                                                                 totalUPCsProcessed,
                                                                 numUPCsInQueue,
                                                                 lastQueueWaitTime) {
  var longestUPCProcesses = Array.prototype.slice.call(arguments).slice(5);
  var upcProcessingRecord;
  for (var i = 0; i < longestUPCProcesses.length; i++) {
    upcProcessingRecord = new net.user1.orbiter.UPCProcessingRecord();
    upcProcessingRecord.deserialize(longestUPCProcesses[i]);
    longestUPCProcesses[i] = upcProcessingRecord;
  }
  
  this.snapshotMan.receiveUPCStatsSnapshot(requestID, 
                                           parseFloat(totalUPCsProcessed),
                                           parseFloat(numUPCsInQueue),
                                           parseFloat(lastQueueWaitTime),
                                           longestUPCProcesses);
};

/**
 * RESET_UPC_STATS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u158 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
     this.orbiter.getServer().dispatchResetUPCStatsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u158."
               + "Status: [" + status + "].");
  }
};

/**
 * WATCH_FOR_PROCESSED_UPCS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u160 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
      this.orbiter.getServer().setIsWatchingForProcessedUPCs(true);
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_WATCHING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.orbiter.getServer().dispatchWatchForProcessedUPCsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u160."
               + "Status: [" + status + "].");
  }
};

/**
 * PROCESSED_UPC_ADDED
 */
net.user1.orbiter.CoreMessageListener.prototype.u161 = function (fromClientID,
                                                                 fromUserID,
                                                                 fromClientAddress,
                                                                 queuedAt,
                                                                 processingStartedAt,
                                                                 processingFinishedAt,
                                                                 source) {
  var upcProcessingRecord = new net.user1.orbiter.UPCProcessingRecord();
  upcProcessingRecord.deserializeParts(fromClientID,
                                       fromUserID,
                                       fromClientAddress,
                                       queuedAt,
                                       processingStartedAt,
                                       processingFinishedAt,
                                       source);
  this.orbiter.getServer().dispatchUPCProcessed(upcProcessingRecord);
};

/**
 * STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u163 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
      this.orbiter.getServer().setIsWatchingForProcessedUPCs(false);
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_WATCHING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.orbiter.getServer().dispatchStopWatchingForProcessedUPCsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u163."
               + "Status: [" + status + "].");
  }
};

    
/**
 * NODELIST_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u166 = function (requestID, nodeListSource) {
  var nodeIDs = nodeListSource == "" ? [] : nodeListSource.split(net.user1.orbiter.Tokens.RS);
  
  if (requestID == "") {
    this.log.warn("Incoming NODELIST_SNAPSHOT UPC missing required requestID. Ignoring message.");
  } else {
    // Snapshot
    this.snapshotMan.receiveNodeListSnapshot(requestID, nodeIDs);
  }
};

/**
 * GATEWAYS_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u168 = function (requestID) {
  var gatewayListSource = Array.prototype.slice.call(arguments).slice(1);
  var gateways = [];

  var gateway;
  var gatewayBandwidth;
  var gatewayBandwidthSource;
  var gatewayIntervalSource;
  for (var i = 0; i < gatewayListSource.length; i+=8) {
    gateway = new net.user1.orbiter.Gateway();
    gateway.id = gatewayListSource[i];
    gateway.type = gatewayListSource[i+1];

    gateway.lifetimeConnectionsByCategory = gatewayListSource[i+2] === "" ? {} : this.createHashFromArg(gatewayListSource[i+2]);
    for (var p in gateway.lifetimeConnectionsByCategory) {
      gateway.lifetimeConnectionsByCategory[p] = parseFloat(gateway.lifetimeConnectionsByCategory[p]);
    }
    gateway.lifetimeClientsByType = gatewayListSource[i+3] === "" ? {} : this.createHashFromArg(gatewayListSource[i+3]);
    for (p in gateway.lifetimeClientsByType) {
      gateway.lifetimeClientsByType[p] = parseFloat(gateway.lifetimeClientsByType[p]);
    }
    gateway.lifetimeClientsByUPCVersion = gatewayListSource[i+4] === "" ? {} : this.createHashFromArg(gatewayListSource[i+4]);
    for (p in gateway.lifetimeClientsByUPCVersion) {
      gateway.lifetimeClientsByUPCVersion[p] = parseFloat(gateway.lifetimeClientsByUPCVersion[p]);
    }
    gateway.attributes = gatewayListSource[i+5] === "" ? {} : this.createHashFromArg(gatewayListSource[i+5]);

    gatewayIntervalSource = gatewayListSource[i+6].split(net.user1.orbiter.Tokens.RS);
    gateway.connectionsPerSecond = parseFloat(gatewayIntervalSource[0]);
    gateway.maxConnectionsPerSecond = parseFloat(gatewayIntervalSource[1]);
    gateway.clientsPerSecond = parseFloat(gatewayIntervalSource[2]);
    gateway.maxClientsPerSecond = parseFloat(gatewayIntervalSource[3]);

    gatewayBandwidth = new net.user1.orbiter.GatewayBandwidth();
    gatewayBandwidthSource = gatewayListSource[i+7].split(net.user1.orbiter.Tokens.RS);
    gatewayBandwidth.lifetimeRead = gatewayBandwidthSource[0] === "" ? 0 : parseFloat(gatewayBandwidthSource[0]);
    gatewayBandwidth.lifetimeWritten = gatewayBandwidthSource[1] === "" ? 0 : parseFloat(gatewayBandwidthSource[1]);
    gatewayBandwidth.averageRead = gatewayBandwidthSource[2] === "" ? 0 : parseFloat(gatewayBandwidthSource[2]);
    gatewayBandwidth.averageWritten = gatewayBandwidthSource[3] === "" ? 0 : parseFloat(gatewayBandwidthSource[3]);
    gatewayBandwidth.intervalRead = gatewayBandwidthSource[4] === "" ? 0 : parseFloat(gatewayBandwidthSource[4]);
    gatewayBandwidth.intervalWritten = gatewayBandwidthSource[5] === "" ? 0 : parseFloat(gatewayBandwidthSource[5]);
    gatewayBandwidth.maxIntervalRead = gatewayBandwidthSource[6] === "" ? 0 : parseFloat(gatewayBandwidthSource[6]);
    gatewayBandwidth.maxIntervalWritten = gatewayBandwidthSource[7] === "" ? 0 : parseFloat(gatewayBandwidthSource[7]);
    gatewayBandwidth.scheduledWrite = gatewayBandwidthSource[8] === "" ? 0 : parseFloat(gatewayBandwidthSource[8]);
    gateway.bandwidth = gatewayBandwidth;
    gateways.push(gateway);
  }

  if (requestID == "") {
    this.log.warn("Incoming GATEWAYS_SNAPSHOT UPC missing required requestID. Ignoring message.");
  } else {
    // Snapshot
    this.snapshotMan.receiveGatewaysSnapshot(requestID, gateways);
  }
};
