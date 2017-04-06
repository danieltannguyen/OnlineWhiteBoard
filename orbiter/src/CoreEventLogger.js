//==============================================================================
// CLASS DECLARATION
//==============================================================================
/**
* @private
*/
net.user1.orbiter.CoreEventLogger = function (log,
                                              connectionMan,
                                              roomMan,
                                              accountMan,
                                              server,
                                              clientMan,
                                              orbiter) {
  this.log = log;

  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.STOP_WATCHING_FOR_ROOMS_RESULT,
                           this.stopWatchingForRoomsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.WATCH_FOR_ROOMS_RESULT,
                           this.watchForRoomsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.CREATE_ROOM_RESULT,
                           this.createRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.REMOVE_ROOM_RESULT,
                           this.removeRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.ROOM_ADDED,
                           this.roomAddedListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.ROOM_REMOVED,
                           this.roomRemovedListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.ROOM_COUNT,
                           this.roomCountListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomEvent.JOIN_RESULT,
                           this.joinRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomEvent.LEAVE_RESULT,
                           this.leaveRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomEvent.OBSERVE_RESULT,
                           this.observeRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT,
                           this.stopObservingRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.CREATE_ACCOUNT_RESULT, 
                              this.createAccountResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.REMOVE_ACCOUNT_RESULT,
                              this.removeAccountResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT,
                              this.changePasswordResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.ACCOUNT_ADDED,
                              this.accountAddedListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.ACCOUNT_REMOVED,
                              this.accountRemovedListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.LOGOFF_RESULT,
                              this.logoffResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.LOGOFF,
                              this.logoffListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.LOGIN_RESULT,
                              this.loginResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.LOGIN,
                              this.loginListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD,
                              this.changePasswordListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.OBSERVE,
                              this.observeAccountListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.STOP_OBSERVING,
                              this.stopObservingAccountListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.STOP_WATCHING_FOR_ACCOUNTS_RESULT,
                              this.stopWatchingForAccountsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.WATCH_FOR_ACCOUNTS_RESULT,
                              this.watchForAccountsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.OBSERVE_RESULT,
                              this.observeAccountResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT,
                              this.stopObservingAccountResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.SYNCHRONIZE,
                              this.synchronizeAccountsListener, this, net.user1.utils.integer.MAX_VALUE);

  server.addEventListener(net.user1.orbiter.ServerEvent.TIME_SYNC, this.timeSyncListener, this, net.user1.utils.integer.MAX_VALUE);

  connectionMan.addEventListener(net.user1.orbiter.ConnectionManagerEvent.CONNECT_FAILURE,
                                 this.connectFailureListener, this, net.user1.utils.integer.MAX_VALUE);
  connectionMan.addEventListener(net.user1.orbiter.ConnectionManagerEvent.CLIENT_KILL_CONNECT,
                                 this.clientKillConnectListener, this, net.user1.utils.integer.MAX_VALUE);
  connectionMan.addEventListener(net.user1.orbiter.ConnectionManagerEvent.SERVER_KILL_CONNECT,
                                 this.serverKillConnectListener, this, net.user1.utils.integer.MAX_VALUE);
  
  clientMan.addEventListener(net.user1.orbiter.ClientEvent.OBSERVE,
                             this.observeClientListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientEvent.STOP_OBSERVING,
                             this.stopObservingClientListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.CLIENT_CONNECTED,
                             this.clientConnectedListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.CLIENT_DISCONNECTED,
                             this.clientDisconnectedListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_CLIENTS_RESULT,
                             this.stopWatchingForClientsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.WATCH_FOR_CLIENTS_RESULT,
                             this.watchForClientsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientEvent.OBSERVE_RESULT,
                             this.observeClientResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT,
                             this.stopObservingClientResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE,
                             this.synchronizeClientsListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.ADDRESS_BANNED,
                             this.addressBannedListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.ADDRESS_UNBANNED,
                             this.addressUnbannedListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT,
                             this.stopWatchingForBannedAddressesResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.WATCH_FOR_BANNED_ADDRESSES_RESULT,
                             this.watchForBannedAddressesResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE_BANLIST,
                             this.synchronizeBanlistListener, this, net.user1.utils.integer.MAX_VALUE);
  
                           
  orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.READY, this.readyListener, this, net.user1.utils.integer.MAX_VALUE);
  orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.PROTOCOL_INCOMPATIBLE, this.protocolIncompatibleListener, this, net.user1.utils.integer.MAX_VALUE);
  orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.CONNECT_REFUSED, this.connectRefusedListener, this, net.user1.utils.integer.MAX_VALUE);
        
  this.log.addEventListener(net.user1.logger.LogEvent.LEVEL_CHANGE, this.logLevelChangeListener, this, net.user1.utils.integer.MAX_VALUE);
};    

        
// =============================================================================
// Logger EVENT LISTENERS
// =============================================================================
  
/**
 * @private
 */        
net.user1.orbiter.CoreEventLogger.prototype.logLevelChangeListener = function (e) {
  this.log.info("[LOGGER] Log level set to: [" + e.getLevel() + "].");
};

// =============================================================================
// Orbiter EVENT LISTENERS
// =============================================================================
  
/**
 * @private
 */        
net.user1.orbiter.CoreEventLogger.prototype.readyListener = function (e) {
  this.log.info("[ORBITER] Orbiter now connected and ready.");
};
  
/**
 * @private
 */        
net.user1.orbiter.CoreEventLogger.prototype.protocolIncompatibleListener = function (e) {
  this.log.warn("[ORBITER] Orbiter UPC protocol incompatibility detected. Client "
           + "UPC version: " + e.target.getSystem().getUPCVersion().toString()
           + ". Server version: " + e.getServerUPCVersion().toString() + ".");
};

/**
 * @private
 */        
net.user1.orbiter.CoreEventLogger.prototype.connectRefusedListener = function (e) {
  if (e.getConnectionRefusal().reason == net.user1.orbiter.ConnectionRefusalReason.BANNED) {
    this.log.warn("[ORBITER] Union Server refused the connection because the"
             + " client address is banned for the following reason: [" 
             + e.getConnectionRefusal().banReason + "]. The ban started at: ["
             + new Date(e.getConnectionRefusal().bannedAt) + "]. The ban duration is: ["
             + net.user1.utils.NumericFormatter.msToElapsedDayHrMinSec(e.getConnectionRefusal().banDuration*1000) + "].");
  } else {
    this.log.warn("[ORBITER] Union Server refused the connection. Reason: [" 
             + e.getConnectionRefusal().reason + "]. Description: ["
             + e.getConnectionRefusal().description + "].");
  }
}

// =============================================================================
// Server EVENT LISTENERS
// =============================================================================

net.user1.orbiter.CoreEventLogger.prototype.timeSyncListener = function (e) {
  this.log.info("[SERVER] Server time synchronized with client. Approximate time on " + 
      "server is now: " + new Date(e.target.getServerTime()));
};

// =============================================================================
// AccountManager EVENT LISTENERS 
// =============================================================================
net.user1.orbiter.CoreEventLogger.prototype.createAccountResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Result for createAccount(). Account: " 
           + e.getUserID() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.removeAccountResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Result for removeAccount(). Account: "
           + e.getUserID() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.changePasswordResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Result for changePassword(). Account: "
           + e.getUserID() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.accountAddedListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Account added: " + e.getAccount());
};

net.user1.orbiter.CoreEventLogger.prototype.accountRemovedListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Account removed: " + e.getAccount());
};

net.user1.orbiter.CoreEventLogger.prototype.logoffResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Result for logoff(). Account: "
           + e.getAccount() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.logoffListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Account logged off: " + e.getAccount());
};

net.user1.orbiter.CoreEventLogger.prototype.loginResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Result for login(). Account: "
           + e.getAccount() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.loginListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Account logged in: " + e.getAccount());
};

net.user1.orbiter.CoreEventLogger.prototype.changePasswordListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Password changed for account: " + e.getUserID());
};

net.user1.orbiter.CoreEventLogger.prototype.observeAccountListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Account observed: " + e.getAccount());
};

net.user1.orbiter.CoreEventLogger.prototype.stopObservingAccountListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Stopped observing account: " + e.getUserID());
};

net.user1.orbiter.CoreEventLogger.prototype.stopWatchingForAccountsResultListener = function (e) {
  this.log.info("[SERVER] 'Stop watching for accounts' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.watchForAccountsResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] 'Watch for accounts' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.observeAccountResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] 'Observe account result' for account: "
           + e.getAccount() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.stopObservingAccountResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] 'Stop observing account result' for account: "
           + e.getUserID() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.synchronizeAccountsListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] User account list synchronized with server.");
};

// =============================================================================
// CONNECTION EVENT LISTENERS
// =============================================================================

net.user1.orbiter.CoreEventLogger.prototype.connectFailureListener = function (e) {
  this.log.info("[CONNECTION_MANAGER] " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.serverKillConnectListener = function (e) {
  this.log.info("[CONNECTION_MANAGER] Server closed the connection.");
};

net.user1.orbiter.CoreEventLogger.prototype.clientKillConnectListener = function (e) {
  this.log.info("[CONNECTION_MANAGER] Connection to server closed by client.");
};

// =============================================================================
// RoomManager EVENT LISTENERS
// =============================================================================

net.user1.orbiter.CoreEventLogger.prototype.watchForRoomsResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] 'Watch for rooms' result for qualifier [" 
            + e.getRoomIdQualifier() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.stopWatchingForRoomsResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] 'Stop watching for rooms' result for"
            + " qualifier [" + e.getRoomIdQualifier() 
            + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.createRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Room creation result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.removeRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Room removal result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.roomAddedListener = function (e) {
  this.log.info("[ROOM_MANAGER] Room added: " + e.getRoom() + ".");
};

net.user1.orbiter.CoreEventLogger.prototype.roomRemovedListener = function (e) {
  this.log.info("[ROOM_MANAGER] Room removed: " + e.getRoom() + ".");
};

net.user1.orbiter.CoreEventLogger.prototype.roomCountListener = function (e) {
  this.log.info("[ROOM_MANAGER] New room count: " + e.getNumRooms() + ".");
};

net.user1.orbiter.CoreEventLogger.prototype.joinRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Join result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.leaveRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Leave result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.observeRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Observe result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.stopObservingRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Stop observing result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

// =============================================================================
// ClientManager EVENT LISTENERS
// =============================================================================

net.user1.orbiter.CoreEventLogger.prototype.observeClientListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Client observed: " + e.getClient());
};

net.user1.orbiter.CoreEventLogger.prototype.stopObservingClientListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Stopped observing client: " + e.getClient());
};

net.user1.orbiter.CoreEventLogger.prototype.clientConnectedListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Foreign client connected. ClientID: [" + e.getClientID() 
           + "].");
};

net.user1.orbiter.CoreEventLogger.prototype.clientDisconnectedListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Foreign client disconnected. ClientID: [" + e.getClientID() 
           + "].");
};

net.user1.orbiter.CoreEventLogger.prototype.stopWatchingForClientsResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Stop watching for clients' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.watchForClientsResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Watch for clients' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.observeClientResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Observe client' result for client: " 
           + e.getClient() + ", status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.stopObservingClientResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Stop observing client' result for client: " 
           + e.getClient() + ", status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.synchronizeClientsListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Client list synchronized with server.");
};

net.user1.orbiter.CoreEventLogger.prototype.addressBannedListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Client address banned: [" + e.getAddress() 
           + "].");
};

net.user1.orbiter.CoreEventLogger.prototype.addressUnbannedListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Client address unbanned. ClientID: [" + e.getAddress() 
           + "].");
};

net.user1.orbiter.CoreEventLogger.prototype.stopWatchingForBannedAddressesResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Stop watching for banned addresses' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.watchForBannedAddressesResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Watch for banned addresses' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.synchronizeBanlistListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Banned list synchronized with server.");
};





