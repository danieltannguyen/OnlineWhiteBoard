//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.ClientManagerEvent = function (type,
                                                 clientID,
                                                 client,
                                                 address,
                                                 status) {
  net.user1.events.Event.call(this, type);
  
  this.clientID = clientID;
  this.client   = client;
  this.address  = address;
  this.status   = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.ClientManagerEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @constant */
net.user1.orbiter.ClientManagerEvent.WATCH_FOR_CLIENTS_RESULT = "WATCH_FOR_CLIENTS_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_CLIENTS_RESULT = "STOP_WATCHING_FOR_CLIENTS_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.CLIENT_DISCONNECTED = "CLIENT_DISCONNECTED";
/** @constant */
net.user1.orbiter.ClientManagerEvent.CLIENT_CONNECTED = "CLIENT_CONNECTED";
/** @constant */
net.user1.orbiter.ClientManagerEvent.KICK_RESULT = "KICK_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.BAN_RESULT = "BAN_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.UNBAN_RESULT = "UNBAN_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.WATCH_FOR_BANNED_ADDRESSES_RESULT = "WATCH_FOR_BANNED_ADDRESSES_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT = "STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.ADDRESS_BANNED = "ADDRESS_BANNED";
/** @constant */
net.user1.orbiter.ClientManagerEvent.ADDRESS_UNBANNED = "ADDRESS_UNBANNED";
/** @constant */
net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE_BANLIST = "SYNCHRONIZE_BANLIST"; 
/** @constant */
net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE = "SYNCHRONIZE"; 
    
net.user1.orbiter.ClientManagerEvent.prototype.getClientID = function () {
  return this.clientID;
};

net.user1.orbiter.ClientManagerEvent.prototype.getClient = function () {
  return this.client;
};

net.user1.orbiter.ClientManagerEvent.prototype.getAddress = function () {
  return this.address;
};

net.user1.orbiter.ClientManagerEvent.prototype.getStatus = function () {
  return this.status;
};

net.user1.orbiter.ClientManagerEvent.prototype.toString = function () {
  return "[object ClientManagerEvent]";
};
