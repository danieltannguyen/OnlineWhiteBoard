//==============================================================================
// CLASS DECLARATION
//==============================================================================
/**
 * @private
 */
net.user1.orbiter.AccountSet = function () {
  this.accounts = new net.user1.utils.UDictionary();
};
    
net.user1.orbiter.AccountSet.prototype.add = function (account) {
  this.accounts[account.getUserID()] = account;
};

net.user1.orbiter.AccountSet.prototype.remove = function (account) {
  var account = this.accounts[account.getUserID()]; 
  delete this.accounts[account.getUserID()];
  return account;
}

net.user1.orbiter.AccountSet.prototype.removeAll = function () {
  this.accounts = new net.user1.utils.UDictionary();
}

net.user1.orbiter.AccountSet.prototype.removeByUserID = function (userID) {
  var account = this.accounts[userID]; 
  delete this.accounts[userID];
  return account;
}

net.user1.orbiter.AccountSet.prototype.contains = function (account) {
  return this.accounts[account.getUserID()] != null;
}

net.user1.orbiter.AccountSet.prototype.containsUserID = function (userID) {
  if (userID == "" || userID == null) {
    return false;
  }
  return this.getByUserID(userID) != null;
}

net.user1.orbiter.AccountSet.prototype.getByUserID = function (userID) {
  return this.accounts[userID];
}

net.user1.orbiter.AccountSet.prototype.getByClient = function (client) {
  var account;
  for (var userID in this.accounts) {
    account = this.accounts[userID];
    if (account.getInternalClient() == client) {
      return account;
    }
  }
  return null;
}

net.user1.orbiter.AccountSet.prototype.getAll = function () {
  return this.accounts;
}

net.user1.orbiter.AccountSet.prototype.length = function () {
  var count;
  for (var userID in this.accounts) {
    count++;
  }
  return count;
}
