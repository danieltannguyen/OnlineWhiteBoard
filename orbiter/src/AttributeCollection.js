//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The AttributeCollection class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.UPDATE}</li>
<li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.DELETE}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.AttributeCollection = function () {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
  
  this.attributes = new Object();
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.AttributeCollection, net.user1.events.EventDispatcher);

// =============================================================================
// ATTRIBUTE ASSIGNMENT
// =============================================================================
/**
 * @private
 */    
net.user1.orbiter.AttributeCollection.prototype.setAttribute = function (name, value, scope, byClient) {
  var scopeExists
  var attrExists;
  var oldVal;
 
  // null scope means global scope
  scope = scope == null ? net.user1.orbiter.Tokens.GLOBAL_ATTR : scope;
  // Check if the scope and attr exist already
  scopeExists =  this.attributes.hasOwnProperty(scope);
  attrExists  = scopeExists ? this.attributes[scope].hasOwnProperty(name) : false;
  
  // Find old value, if any
  if (attrExists) {
    oldVal = this.attributes[scope][name];
    if (oldVal == value) {
      // Attribute value is unchanged, so abort
      return false;
    }
  }

  // Make the scope record if necessary
  if (!scopeExists) {
    this.attributes[scope] = new Object();
  }
  
  // Set the attribute value
  this.attributes[scope][name] = value;
  
  // Notify listeners
  this.fireUpdateAttribute(name, value, scope, oldVal, byClient);
  
  return true;
};

// =============================================================================
// ATTRIBUTE DELETION
// =============================================================================
/**
 * @private
 */
net.user1.orbiter.AttributeCollection.prototype.deleteAttribute = function (name, scope, byClient) {
  var lastAttr = true;
  var value;

  // If the attribute exists...
  if (this.attributes.hasOwnProperty(scope) 
      && this.attributes[scope].hasOwnProperty(name)) {
    value = this.attributes[scope][name];
    delete this.attributes[scope][name];
    // Check if this is the last attribute. If it is, remove the room scope object.
    for (var p in this.attributes[scope]) {
      lastAttr = false;
      break;
    }
    if (lastAttr) {
      delete this.attributes[scope];
    }
    
    // Notify listeners
    this.fireDeleteAttribute(name, value, scope, byClient);
    return true;
  }
  return false;
};

/**
 * @private
 */
net.user1.orbiter.AttributeCollection.prototype.clear = function () {
  this.attributes = new Object();
};

// =============================================================================
// ATTRIBUTE RETRIEVAL
// =============================================================================

net.user1.orbiter.AttributeCollection.prototype.getByScope = function (scope) {
  var obj = new Object();

  if (scope == null) {
    for (var attrscope in this.attributes) {
      obj[attrscope] = new Object();
      for (var attrname in this.attributes[attrscope]) {
        obj[attrscope][attrname] = this.attributes[attrscope][attrname];
      }
    }
  } else {
    for (var name in this.attributes[scope]) {
      obj[name] = this.attributes[scope][name];
    }
  }

  return obj;
};

net.user1.orbiter.AttributeCollection.prototype.getAttributesNamesForScope = function (scope) {
  var names = new Array();
  for (var name in this.attributes[scope]) {
    names.push(name);
  }
  return names;
};

net.user1.orbiter.AttributeCollection.prototype.getAll = function () {
  var attrs = new Object();
  for (var attrScope in this.attributes) {
    for (var attrName in this.attributes[attrScope]) {
      attrs[attrScope == net.user1.orbiter.Tokens.GLOBAL_ATTR ? attrName : (attrScope + "." + attrName)] = this.attributes[attrScope][attrName];
    }
  }
  return attrs;
}  

net.user1.orbiter.AttributeCollection.prototype.getAttribute = function (attrName, attrScope) {
  // Use the global scope when no scope is specified
  if (attrScope == null) {
    attrScope = net.user1.orbiter.Tokens.GLOBAL_ATTR;
  }
  
  // Find and return the attribute.
  if (this.attributes.hasOwnProperty(attrScope) 
      && this.attributes[attrScope].hasOwnProperty(attrName)) {
    return this.attributes[attrScope][attrName];
  } else {
    // No attribute was found, so quit.
    return null;
  }
};

net.user1.orbiter.AttributeCollection.prototype.getScopes = function () {
  var scopes = new Array();
  for (var scope in this.attributes) {
    scopes.push(scope);
  }
  return scopes;
};

// =============================================================================
// COLLECTION INSPECTION
// =============================================================================

net.user1.orbiter.AttributeCollection.prototype.contains = function (name, scope) {
  return this.attributes.hasOwnProperty(scope) ? this.attributes[scope].hasOwnProperty(name) : false;
};

// =============================================================================
// MERGING
// =============================================================================

/**
 * @private
 */    
net.user1.orbiter.AttributeCollection.prototype.add = function (collection) {
  var scopes = collection.getScopes();
  var scope;
  
  var names;
  var name;
  
  for (var i = 0; i <= scopes.length; i++) {
    scope = scopes[i];
    names = collection.getAttributesNamesForScope(scope);
    for (var j = 0; j < names.length; j++) {
      name = names[j];
      this.setAttribute(name, collection.getAttribute(name, scope), scope);
    }
  }
};

/**
 * @private
 */    
net.user1.orbiter.AttributeCollection.prototype.synchronizeScope = function (scope,
                                                                             collection) {
  // Delete all existing attributes that are not in the new collection
  var names = this.getAttributesNamesForScope(scope);
  var name;
  
  for (var i = 0; i < names.length; i++) {
    name = names[i];
    if (!collection.contains(name, scope)) {
      this.deleteAttribute(name, scope);
    }
  }
  
  // Set all new attributes (unchanged attributes are ignored)
  var names = collection.getAttributesNamesForScope(scope);
  for (i = 0; i < names.length; i++) {
    name = names[i];
    this.setAttribute(name, collection.getAttribute(name, scope), scope);
  } 
};

// =============================================================================
// EVENT DISPATCHING
// =============================================================================
/**
 * @private
 */
net.user1.orbiter.AttributeCollection.prototype.fireUpdateAttribute = function (attrName, 
                                                                                attrVal, 
                                                                                attrScope,
                                                                                oldVal,
                                                                                byClient) {
  var changedAttr = new net.user1.orbiter.Attribute(attrName, attrVal, oldVal, attrScope, byClient);
  var e = new net.user1.orbiter.AttributeEvent(net.user1.orbiter.AttributeEvent.UPDATE,
                                               changedAttr);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AttributeCollection.prototype.fireDeleteAttribute = function (attrName,
                                                                                attrValue,
                                                                                attrScope,
                                                                                byClient) {
  var changedAttr = new net.user1.orbiter.Attribute(attrName, null, attrValue, attrScope, byClient);
  var e = new net.user1.orbiter.AttributeEvent(net.user1.orbiter.AttributeEvent.DELETE,
                                               changedAttr);
  this.dispatchEvent(e);
};