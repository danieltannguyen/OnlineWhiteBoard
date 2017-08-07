//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
 *
 * @example
 * var modules = new net.user1.orbiter.RoomModules();
 * modules.addModule("com.business.StockTickerListener", net.user1.orbiter.ModuleType.CLASS);
 * orbiter.getRoomManager().createRoom("someRoomID",
 *                           null,
 *                           null,
 *                           modules);
 */
net.user1.orbiter.RoomModules = function () {
  this.modules = new Array();
};

net.user1.orbiter.RoomModules.prototype.addModule = function (identifier, 
                                                  type) {
  this.modules.push([type, identifier]);
};

net.user1.orbiter.RoomModules.prototype.serialize = function () {
  var modulesString = "";

  var numModules = this.modules.length;
  for (var i = 0; i < numModules; i++) {
    modulesString += this.modules[i][0] + net.user1.orbiter.Tokens.RS + this.modules[i][1];
    if (i < numModules-1) {
      modulesString += net.user1.orbiter.Tokens.RS;
    } 
  }

  return modulesString;
};

net.user1.orbiter.RoomModules.prototype.getIdentifiers = function () {
  var ids = new Array();
  
  var module;
  for (var i = 0; i < this.modules.length; i++) {
    module = this.modules[i];
    ids.push(module[1]);
  }
  return ids;
};
