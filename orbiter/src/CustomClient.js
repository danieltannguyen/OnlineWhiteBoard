//==============================================================================
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 */
net.user1.orbiter.CustomClient = function () {
  this.client = null;
};

/**
 * An initialization method invoked when this CustomClient object is ready
 * for use. Subclasses wishing to perform initialization tasks that require
 * this CustomClient's composed Client object should override this method. 
 * 
 * @since Orbiter 1.0.0
 */
net.user1.orbiter.CustomClient.prototype.init = function () {
};

net.user1.orbiter.CustomClient.prototype.addEventListener = function (type, 
                                                           listener,
                                                           thisArg,
                                                           priority) {
  this.client.addEventListener(type, listener, thisArg, priority);
};

net.user1.orbiter.CustomClient.prototype.dispatchEvent = function (event) {
  return this.client.dispatchEvent(event);
};

net.user1.orbiter.CustomClient.prototype.hasEventListener = function (type) {
  return this.client.hasEventListener(type);
};

net.user1.orbiter.CustomClient.prototype.removeEventListener = function (type, 
                                                                         listener,
                                                                         thisObj) {
  this.client.removeEventListener(type, listener, thisObj);
};

net.user1.orbiter.CustomClient.prototype.willTrigger = function (type) {
  return this.client.willTrigger(type);
};

net.user1.orbiter.CustomClient.prototype.setClient = function (client) {
  this.client = client;
};

net.user1.orbiter.CustomClient.prototype.getClientID = function () {
  return this.client.getClientID();
};

net.user1.orbiter.CustomClient.prototype.getConnectionState = function () {
  return this.client.getConnectionState();
};

net.user1.orbiter.CustomClient.prototype.isSelf = function () {
  return this.client.isSelf();
};

net.user1.orbiter.CustomClient.prototype.setClientClass = function (scope, 
                               clientClass) {
  var fallbackClasses = Array.prototype.slice.call(arguments).slice(2);
  this.client.setClientClass.apply(this.client, [scope, clientClass].concat(fallbackClasses));
};

net.user1.orbiter.CustomClient.prototype.isInRoom = function (roomID) {
  return this.client.isInRoom(roomID);
};

net.user1.orbiter.CustomClient.prototype.isObservingRoom = function (roomID) {
  return this.client.isObservingRoom(roomID);
};

net.user1.orbiter.CustomClient.prototype.getOccupiedRoomIDs = function () {
  return this.client.getOccupiedRoomIDs();
};

net.user1.orbiter.CustomClient.prototype.getObservedRoomIDs = function () {
  return this.client.getObservedRoomIDs();
};

net.user1.orbiter.CustomClient.prototype.getIP = function () {
  return this.client.getIP();
};

net.user1.orbiter.CustomClient.prototype.getConnectTime = function () {
  return this.client.getConnectTime();
};

net.user1.orbiter.CustomClient.prototype.getPing = function () {
  return this.client.getPing();
};

net.user1.orbiter.CustomClient.prototype.getTimeOnline = function () {
  return this.client.getTimeOnline();
};

net.user1.orbiter.CustomClient.prototype.sendMessage = function (messageName) {
  var args = Array.prototype.slice.call(arguments).slice(0);
  this.client.sendMessage.apply(this.client, args);
};

net.user1.orbiter.CustomClient.prototype.setAttribute = function (attrName, 
                                                                  attrValue, 
                                                                  attrScope, 
                                                                  isShared, 
                                                                  evaluate) {
  this.client.setAttribute(attrName, attrValue, attrScope, isShared, evaluate);
};

net.user1.orbiter.CustomClient.prototype.deleteAttribute = function (attrName, attrScope) {
  this.client.deleteAttribute(attrName, attrScope);
};

net.user1.orbiter.CustomClient.prototype.getAttribute = function (attrName, attrScope) {
  return this.client.getAttribute(attrName, attrScope);
};

net.user1.orbiter.CustomClient.prototype.getAttributes = function () {
  return this.client.getAttributes();
};

net.user1.orbiter.CustomClient.prototype.getAttributesByScope = function (scope) {
  return this.client.getAttributesByScope();
};

net.user1.orbiter.CustomClient.prototype.getClientManager = function () {
  return this.client.getClientManager();
};

net.user1.orbiter.CustomClient.prototype.getAccount = function () {
  return this.client.getAccount();
};

net.user1.orbiter.CustomClient.prototype.kick = function () {
  this.client.kick();
};

net.user1.orbiter.CustomClient.prototype.ban = function (duration, reason) {
  this.client.ban(duration, reason);
};

net.user1.orbiter.CustomClient.prototype.observe = function () {
  this.client.observe();
};

net.user1.orbiter.CustomClient.prototype.stopObserving = function () {
  this.client.stopObserving();
};

net.user1.orbiter.CustomClient.prototype.isAdmin = function () {
  return this.client.isAdmin();
};

net.user1.orbiter.CustomClient.prototype.toString = function () {
  return "[object CustomClient, ID: " + this.getClientID() + "]";
};