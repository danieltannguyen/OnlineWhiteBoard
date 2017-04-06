//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.orbiter.RoomSettings = function () {
  this.removeOnEmpty = null;
  this.maxClients = null; 
  this.password = null;
};

net.user1.orbiter.RoomSettings.prototype.serialize = function () {
  var RS = net.user1.orbiter.Tokens.RS;
  var settingsString =
      net.user1.orbiter.Tokens.REMOVE_ON_EMPTY_ATTR + RS + 
      (this.removeOnEmpty == null ? "true" : this.removeOnEmpty.toString()) 
      + RS + net.user1.orbiter.Tokens.MAX_CLIENTS_ATTR + RS + 
      (this.maxClients == null ? "-1" : this.maxClients.toString()) 
      + RS + net.user1.orbiter.Tokens.PASSWORD_ATTR + RS +
      (this.password == null ? "" : this.password);
  return settingsString;
}