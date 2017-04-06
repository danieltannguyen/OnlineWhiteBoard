//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class A minimal in-memory storage map to mirror LocalData's persistent map. */
net.user1.utils.MemoryStore = function () {
  this.clear();
};

net.user1.utils.MemoryStore.prototype.write = function (record, field, value) {
  if (typeof this.data[record] === "undefined") {
    this.data[record] = new Object();
  }
  this.data[record][field] = value
};
  
net.user1.utils.MemoryStore.prototype.read = function (record, field) {
  if (typeof this.data[record] !== "undefined"
      && typeof this.data[record][field] !== "undefined") {
    return this.data[record][field];
  } else {
    return null;
  }
};

net.user1.utils.MemoryStore.prototype.remove = function (record, field) {
  if (typeof this.data[record] !== "undefined") {
    delete this.data[record][field];
  }
};

net.user1.utils.MemoryStore.prototype.clear = function () {
  this.data = new Object();
};