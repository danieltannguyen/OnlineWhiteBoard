//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 */
net.user1.utils.LRUCache = function (maxLength) {
  this.maxLength = maxLength;
  this.length = 0;
  this.hash = new net.user1.utils.UDictionary();
  this.first = null;
  this.last = null;
};
    
net.user1.utils.LRUCache.prototype.get = function (key) {
  var node = this.hash[key];
  
  if (node != null) {
    this.moveToHead(node);
    return node.value;
  } else {
    return null;
  }
};

net.user1.utils.LRUCache.prototype.put = function (key, value) {
  var node = this.hash[key];
  if (node == null) {
    if (this.length >= this.maxLength) {
      this.removeLast();
    } else {
      this.length++;
    }
    node = new net.user1.utils.CacheNode();
  }
  
  node.value = value;
  node.key = key;
  this.moveToHead(node);
  this.hash[key] = node;
};

net.user1.utils.LRUCache.prototype.remove = function (key) {
  var node = this.hash[key];
  if (node != null) {
    if (node.prev != null) {
      node.prev.next = node.next;
    }
    if (node.next != null) {
      node.next.prev = node.prev;
    }
    if (this.last == node) {
      this.last = node.prev;
    }
    if (this.first == node) {
      this.first = node.next;
    }
  }
  return node;
}

net.user1.utils.LRUCache.prototype.clear = function () {
  this.first = null;
  this.last = null;
  this.length = 0;
  this.hash = new net.user1.utils.UDictionary();
};

/**
 * @private
 */
net.user1.utils.LRUCache.prototype.removeLast = function () {
  if (this.last != null) {
    delete this.hash[this.last.key];
    if (this.last.prev != null) {
      this.last.prev.next = null;
    } else {
      this.first = null;
    }
    this.last = this.last.prev;
  }
};

/**
 * @private
 */
net.user1.utils.LRUCache.prototype.moveToHead = function (node) {
  if (node == this.first) {
    return;
  }
  if (node.prev != null) {
    node.prev.next = node.next;
  }
  if (node.next != null) {
    node.next.prev = node.prev;
  }
  if (this.last == node) {
    this.last = node.prev;
  }
  if (this.first != null) {
    node.next = this.first;
    this.first.prev = node;
  }
  this.first = node;
  node.prev = null;
  if (this.last == null) {
    this.last = this.first;
  }
};
