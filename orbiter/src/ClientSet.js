//==============================================================================
// CLASS DECLARATION
//==============================================================================
/**
 * @private
 */  
net.user1.orbiter.ClientSet = function () {
  this.clients = new net.user1.utils.UDictionary();
};

net.user1.orbiter.ClientSet.prototype.add = function (client) {
  this.clients[client.getClientID()] = client;
};

net.user1.orbiter.ClientSet.prototype.remove = function (client) {
  var client = clients[client.getClientID()];
  delete this.clients[client.getClientID()];
  return client;
};

net.user1.orbiter.ClientSet.prototype.removeAll = function () {
  this.clients = new net.user1.utils.UDictionary();
}

net.user1.orbiter.ClientSet.prototype.removeByClientID = function (clientID) {
  var client = this.clients[clientID];
  delete this.clients[clientID];
  return client;
};

net.user1.orbiter.ClientSet.prototype.contains = function (client) {
  return this.clients[client.getClientID()] != null;
};

net.user1.orbiter.ClientSet.prototype.containsClientID = function (clientID) {
  if (clientID == "" || clientID == null) {
    return false;
  }
  return this.getByClientID(clientID) != null;
};

net.user1.orbiter.ClientSet.prototype.getByClientID = function (clientID) {
  return this.clients[clientID];
};

net.user1.orbiter.ClientSet.prototype.getByUserID = function (userID) {
  var account;
  
  var client;
  for (var clientID in this.clients) {
    client = this.clients[clientID];
    account = client.getAccount();
    if (account != null && account.getUserID() == userID) {
      return client;
    }
  }
  return null;
};

net.user1.orbiter.ClientSet.prototype.getAll = function () {
  return this.clients;
}

net.user1.orbiter.ClientSet.prototype.getAllIDs = function () {
  var ids = [];
  for (var clientID in this.clients) {
    ids.push(clientID);
  }
  return ids;
};

net.user1.orbiter.ClientSet.prototype.length = function () {
  return net.user1.utils.ObjectUtil.length(this.clients);
};
