//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.events.EventDispatcher = function (target) {
  this.listeners = new Object();
  
  if (typeof target !== "undefined") {
    this.target = target;
  } else {
    this.target = this;
  }
};

//==============================================================================
// INSTANCE METHODS
//==============================================================================
/**
 * Registers a function or method to be invoked when the specified event type
 * occurs.
 *
 * @param type The string name of the event (for example, "READY")
 * @param listener A reference to the function or method to invoke.
 * @param thisArg A reference to the object on which the listener will be invoked
 *                (i.e., the value of "this" within the listener's function body).
 * @param priority An integer indicating the listener's priority. Listeners with
 *                 higher priority are invoked before listeners with lower priority.
 *                 Listeners with equal priority are invoked in the order they were
 *                 added. Listener priority defaults to 0.
 * @return {Boolean} true if the listener was added; false if the listener was
 *                        already registered for the event.
 *
 * @example
 * <pre>
 * // Invoke readyListener() on 'this' when READY occurs:
 * orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.READY, readyListener, this);
 * </pre>
 */
net.user1.events.EventDispatcher.prototype.addEventListener = function (type, 
                                                                        listener,
                                                                        thisArg,
                                                                        priority) {
  if (typeof this.listeners[type] === "undefined") {
    this.listeners[type] = new Array();
  } 
  var listenerArray = this.listeners[type];
  
  if (this.hasListener(type, listener, thisArg)) {
    return false;
  }
  priority = priority || 0;
  
  var newListener = new net.user1.events.EventListener(listener,
                                                       thisArg,
                                                       priority);
  var added = false;
  var thisListener;
  for (var i = listenerArray.length; --i >= 0;) {
    thisListener = listenerArray[i];
    if (priority <= thisListener.getPriority()) {
      listenerArray.splice(i+1, 0, newListener);
      added = true;
      break;
    }
  }
  if (!added) {
    listenerArray.unshift(newListener);
  }
  return true;      
};

net.user1.events.EventDispatcher.prototype.removeEventListener = function (type,
                                                                           listener,
                                                                           thisArg) {
  var listenerArray = this.listeners[type];
  if (typeof listenerArray === "undefined") {
    return false;
  } 
  
  var foundListener = false;
  for (var i = 0; i < listenerArray.length; i++) {
    if (listenerArray[i].getListenerFunction() === listener
        && listenerArray[i].getThisArg() === thisArg) {
      foundListener = true;
      listenerArray.splice(i, 1);
      break;
    }
  }
  
  if (listenerArray.length == 0) {
    delete this.listeners[type];
  }
  
  return foundListener;      
};
    
net.user1.events.EventDispatcher.prototype.hasListener = function (type, 
                                                                   listener,
                                                                   thisArg) {
  var listenerArray = this.listeners[type];
  if (typeof listenerArray === "undefined") {
    return false;
  } 
      
  for (var i = 0; i < listenerArray.length; i++) {
    if (listenerArray[i].getListenerFunction() === listener
        && listenerArray[i].getThisArg() === thisArg) {
      return true;
    }
  }
  return false;
};
    
net.user1.events.EventDispatcher.prototype.getListeners = function (type) {
  return this.listeners[type];
};

net.user1.events.EventDispatcher.prototype.dispatchEvent = function (event) {
  var listenerArray = this.listeners[event.type];
  if (typeof listenerArray === "undefined") {
    return;
  }
  if (typeof event.type === "undefined") {
    throw new Error("Event dispatch failed. No event name specified by " + event);
  }
  event.target = this.target;
  var numListeners = listenerArray.length;
  for (var i = 0; i < numListeners; i++) {
    listenerArray[i].getListenerFunction().apply(listenerArray[i].getThisArg(), [event]);
  }
};

//==============================================================================    
// TOSTRING
//==============================================================================

net.user1.events.EventDispatcher.prototype.toString = function () {
  return "[object EventDispatcher]";
};