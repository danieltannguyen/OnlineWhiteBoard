//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class 
 * A minimal version of the browser localStorage object,
 * for use in environments without native localStorage support.
 * Provides in-memory storage only, with no persistence.
 */
net.user1.utils.LocalStorage = function () {
  this.data = new net.user1.utils.MemoryStore();
};

net.user1.utils.LocalStorage.prototype.setItem = function (key, value) {
  this.data.write("localStorage", key, value);
};
  
net.user1.utils.LocalStorage.prototype.getItem = function (key) {
  return this.data.read("localStorage", key);
};

net.user1.utils.LocalStorage.prototype.removeItem = function (key) {
  this.data.remove("localStorage", key);
};