//==============================================================================
// CLASS DECLARATION
//==============================================================================
/**
* @private
*/
net.user1.orbiter.AttributeManager = function (owner,
                                               messageManager,
                                               log) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
  
  this.attributes = null;
  this.owner = owner;
  this.messageManager = messageManager;
  this.log = log;
  this.setAttributeCollection(new net.user1.orbiter.AttributeCollection());
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.AttributeManager, net.user1.events.EventDispatcher);

//==============================================================================
// DEPENDENCIES
//==============================================================================

net.user1.orbiter.AttributeManager.prototype.getAttributeCollection = function () {
  return this.attributes;
};

net.user1.orbiter.AttributeManager.prototype.setAttributeCollection = function (value) {
  this.unregisterAttributeListeners();
  this.attributes = value;
  this.registerAttributeListeners();
};

//==============================================================================
// SERVER-SIDE ASSIGNMENT
//==============================================================================

net.user1.orbiter.AttributeManager.prototype.setAttribute = function (setRequest) {
  this.messageManager.sendUPCObject(setRequest);
}

//==============================================================================
// SERVER-SIDE DELETION
//==============================================================================

net.user1.orbiter.AttributeManager.prototype.deleteAttribute = function (deleteRequest) {
  this.messageManager.sendUPCObject(deleteRequest);
}

//==============================================================================
// LOCAL RETRIEVAL
//==============================================================================

net.user1.orbiter.AttributeManager.prototype.getAttribute = function (attrName, attrScope) {
  // Quit if there are no attrbutes.
  if (this.attributes == null) {
    return null;
  } else {
    return this.attributes.getAttribute(attrName, attrScope);
  }
};

net.user1.orbiter.AttributeManager.prototype.getAttributes = function () {
  return this.attributes.getAll();
}  

net.user1.orbiter.AttributeManager.prototype.getAttributesByScope = function (scope) {
  return this.attributes.getByScope(scope);
};

//==============================================================================
// LOCAL ASSIGNMENT
//==============================================================================

/**
 * @private
 */        
net.user1.orbiter.AttributeManager.prototype.setAttributeLocal = function (attrName, 
                                                                           attrVal,
                                                                           attrScope,
                                                                           byClient) {
  var changed = this.attributes.setAttribute(attrName, attrVal, attrScope, byClient);
  if (!changed) {
    this.log.info(this.owner + " New attribute value for [" + attrName + "] matches old value. Not changed.");
  }
};

//==============================================================================
// LOCAL REMOVAL
//==============================================================================
  
/**
 * @private
 */        
net.user1.orbiter.AttributeManager.prototype.removeAttributeLocal = function (attrName,
                                                                              attrScope,
                                                                              byClient) {
  var deleted = this.attributes.deleteAttribute(attrName, attrScope, byClient);
  if (!deleted) {
    this.log.info(owner + " Delete attribute failed for [" + attrName + "]. No such attribute.");
  }
};
  
/**
 * @private
 */        
net.user1.orbiter.AttributeManager.prototype.removeAll = function () {
  this.attributes.clear();
}

//==============================================================================
// EVENT REGISTRATION
//==============================================================================

net.user1.orbiter.AttributeManager.prototype.registerAttributeListeners = function () {
  if (this.attributes != null) {
    // Can't use migrateListeners() here because we need to specify the listener priority (int.MAX_VALUE)
    this.attributes.addEventListener(net.user1.orbiter.AttributeEvent.UPDATE, this.updateAttributeListener, this, net.user1.utils.integer.MAX_VALUE);
    this.attributes.addEventListener(net.user1.orbiter.AttributeEvent.DELETE, this.deleteAttributeListener, this, net.user1.utils.integer.MAX_VALUE);
  }
};

net.user1.orbiter.AttributeManager.prototype.unregisterAttributeListeners = function () {
  if (this.attributes != null) {
    this.attributes.removeEventListener(net.user1.orbiter.AttributeEvent.UPDATE, this.updateAttributeListener, this);
    this.attributes.removeEventListener(net.user1.orbiter.AttributeEvent.DELETE, this.deleteAttributeListener, this);
  }
}

//==============================================================================
// EVENT LISTENERS
//==============================================================================

net.user1.orbiter.AttributeManager.prototype.updateAttributeListener = function (e) {
  var attr = e.getChangedAttr();
  
  this.log.info(this.owner + " Setting attribute [" 
                + ((attr.scope == null) ? "" : attr.scope + ".") 
                + attr.name + "]. New value: [" + attr.value + "]. Old value: [" 
                + attr.oldValue + "].");
  this.owner.dispatchEvent(e);
};

net.user1.orbiter.AttributeManager.prototype.deleteAttributeListener = function (e) {
  this.owner.dispatchEvent(e);
}

//==============================================================================
// EVENT DISPATCHING
//==============================================================================

/**
 * @private
 */        
net.user1.orbiter.AttributeManager.prototype.fireSetAttributeResult = function (attrName,
                                                                                attrScope,
                                                                                status) {
  var attr = new net.user1.orbiter.Attribute(attrName, null, null, attrScope);

  // Trigger event on listeners.
  var e = new net.user1.orbiter.AttributeEvent(net.user1.orbiter.AttributeEvent.SET_RESULT,
                                               attr, status);
  this.owner.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AttributeManager.prototype.fireDeleteAttributeResult = function (attrName,
                                                                                   attrScope, 
                                                                                   status) {
  var attr = new net.user1.orbiter.Attribute(attrName, null, null, attrScope);
  
  // Trigger event on listeners.
  var e = new net.user1.orbiter.AttributeEvent(net.user1.orbiter.AttributeEvent.DELETE_RESULT,
                                               attr, status);
  this.owner.dispatchEvent(e);
};

// =============================================================================
// DISPOSAL
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.AttributeManager.prototype.dispose = function () {
  this.messageManager = null;  
  this.attributes = null;
  this.owner = null;
  this.log = null;
};
