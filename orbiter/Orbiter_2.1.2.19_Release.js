//==============================================================================
// Orbiter_2.1.2.19_Release
// www.unionplatform.com
// Release Date: 9-April-2016
// (c) Copyright USER1 Subsystems Corporation
//==============================================================================

(function (globalObject) {
//==============================================================================
// PACKAGE MANAGEMENT
//==============================================================================

// JSDOC helpers

/** @namespace 
    @name net
    @private */
/** @namespace 
    @name net.user1
    @private */
/** @namespace 
    @name net.user1.events
    @private */
/** @namespace 
    @name net.user1.logger
    @private */
/** @namespace 
    @name net.user1.orbiter
 */
/** @namespace 
    @name net.user1.utils
 */

// create utils package
if (typeof globalObject.net == "undefined") {
  globalObject.net = {};
}
var net = globalObject.net;
net.user1 = net.user1 ? net.user1 : {};
net.user1.utils = net.user1.utils ? net.user1.utils : {};

//  Convenience method to create packages
/** @function */
net.user1.utils.createPackage = function (packageName) {
  var parts = packageName.split(".");
  var part = globalObject;
  
  for (var i = 0; i < parts.length; i++) {
    part = part[parts[i]] === undefined ? (part[parts[i]] = {}) : part[parts[i]];
  }
};
//==============================================================================
// PACKAGE DECLARATIONS
//==============================================================================
net.user1.utils.createPackage("net.user1.logger");
net.user1.utils.createPackage("net.user1.events");
net.user1.utils.createPackage("net.user1.orbiter");
net.user1.utils.createPackage("net.user1.orbiter.filters");
net.user1.utils.createPackage("net.user1.orbiter.snapshot");
net.user1.utils.createPackage("net.user1.orbiter.upc");
net.user1.utils.createPackage("net.user1.utils");
/** @function */
net.user1.utils.extend = function (subclass, superclass) {
  function superclassConstructor () {};
  superclassConstructor.prototype = superclass.prototype;
  subclass.superclass = superclass.prototype;
  subclass.prototype = new superclassConstructor();
  subclass.prototype.constructor = subclass;
};
//==============================================================================
// ABSTRACT ERROR FUNCTION
//==============================================================================

// JSDOC helpers

/** @private */
net.user1.utils.abstractError = function () {
  throw new Error("Could not invoke abstract method. This method must be implemented by a subclass.");
};
//==============================================================================
// CONNECTION REFUSAL REASON CONSTANTS
//==============================================================================
/** @class */
net.user1.orbiter.ConnectionRefusalReason = new Object();
/** @constant */
net.user1.orbiter.ConnectionRefusalReason.BANNED = "BANNED";
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.orbiter.ConnectionRefusal = function (reason,
                                                description) {
  /**
   * @field
   */
  this.bannedAt = NaN;
  /**
   * @field
   */
  this.banDuration = NaN;
  /**
   * @field
   */
  this.banReason = null;
  /**
   * @field
   */
  this.reason = reason;
  /**
   * @field
   */
  this.description = description;

  var banDetails;
  switch (reason) {
    case net.user1.orbiter.ConnectionRefusalReason.BANNED:
      banDetails = description.split(net.user1.orbiter.Tokens.RS);
      this.bannedAt = parseFloat(banDetails[0]);
      this.banDuration = parseFloat(banDetails[1]);
      this.banReason = banDetails[2];
      break;
  }
}
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.orbiter.VersionNumber = function (major, minor, revision, build) {
  this.major    = major;
  this.minor    = minor;
  this.revision = revision;
  this.build    = build == undefined ? -1 : build;
};

//==============================================================================
// INSTANCE METHODS
//==============================================================================  
net.user1.orbiter.VersionNumber.prototype.fromVersionString = function (value) {
  var upcVersionParts = value.split(".");      
  this.major    = upcVersionParts[0];
  this.minor    = upcVersionParts[1];
  this.revision = upcVersionParts[2];
  this.build    = upcVersionParts.length == 4 ? upcVersionParts[4] : -1;
}

net.user1.orbiter.VersionNumber.prototype.toStringVerbose = function () {
  var versionString = this.major + "." + this.minor + "." + this.revision
            + ((this.build == -1) ? "" : " (Build " + this.build + ")");
  return versionString;
}
    
net.user1.orbiter.VersionNumber.prototype.toString = function () {
  var versionString = this.major + "." + this.minor + "." + this.revision
            + ((this.build == -1) ? "" : "." + this.build);
  return versionString;
}
//==============================================================================
// PRODUCT CONSTANTS
//==============================================================================
/** @class
    @private */
net.user1.orbiter.Product = new Object();

/** @private */
net.user1.orbiter.Product.clientType     = "Orbiter";
net.user1.orbiter.Product.clientVersion  = new net.user1.orbiter.VersionNumber(2,1,2,19);
net.user1.orbiter.Product.upcVersion     = new net.user1.orbiter.VersionNumber(1,10,3);
//==============================================================================
// A COLLECTION OF OBJECT UTILITIES
//==============================================================================
/** @class */
net.user1.utils.ObjectUtil = new Object();

net.user1.utils.ObjectUtil.combine = function () {
  var source = arguments.length == 1 ? arguments[0] : arguments;
  var master = new Object();
  
  var object;
  for (var i = 0; i < source.length; i++) {
    object = source[i];
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        master[key] = object[key];
      }
    }
  }
  return master;
};

net.user1.utils.ObjectUtil.length = function (object) {
  var len = 0;
  for (var p in object) {
    len++;
  } 
  return len;
};

//==============================================================================
// A COLLECTION OF ARRAY UTILITIES
//==============================================================================
/** @class */
net.user1.utils.ArrayUtil = new Object();

net.user1.utils.ArrayUtil.indexOf = function (arr, obj) {
  if (arr.indexOf ) {
    return arr.indexOf(obj);
  }

  for (var i = arr.length; --i >= 0; ) {
    if (arr[i] === obj) {
      return i;
    }
  }
  
  return -1;
};

net.user1.utils.ArrayUtil.remove = function (array, item) {
  var itemIndex;
  
  if (item == null) {
    return false;
  } else {
    itemIndex = net.user1.utils.ArrayUtil.indexOf(array, item);
    if (itemIndex == -1) {
      return false;
    } else {
      array.splice(itemIndex, 1);
      return true;
    }
  }
};

net.user1.utils.ArrayUtil.isArray = function (value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};
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
//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/** @class*/
net.user1.utils.LocalData = new Object();

if (typeof localStorage === "undefined") {
  net.user1.utils.LocalData.data = new net.user1.utils.LocalStorage();
} else {
  net.user1.utils.LocalData.data = localStorage;
}

net.user1.utils.LocalData.write = function (record, field, value) {
  // localStorage can't store objects, so combine record and field for keys
  net.user1.utils.LocalData.data.setItem(record+field, value);
};
  
net.user1.utils.LocalData.read = function (record, field) {
  var value = net.user1.utils.LocalData.data.getItem(record+field);
  return value == null ? null : value;
};

net.user1.utils.LocalData.remove = function (record, field) {
  var value = net.user1.utils.LocalData.data.getItem(record+field);
  if (value != null) {
    this.data.removeItem(record+field);
  }
};
//==============================================================================
// MESSAGE CONSTANTS
//==============================================================================
/** @class */
net.user1.orbiter.Messages = new Object();
/** @constant */
net.user1.orbiter.Messages.CLIENT_HEARTBEAT = "CLIENT_HEARTBEAT";
//==============================================================================
// RECEIVE MESSAGE BROADCAST TYPE CONSTANTS
//==============================================================================
/** @class
    @private */
net.user1.orbiter.ReceiveMessageBroadcastType = new Object();
net.user1.orbiter.ReceiveMessageBroadcastType.TO_SERVER  = "0";
net.user1.orbiter.ReceiveMessageBroadcastType.TO_ROOMS   = "1";
net.user1.orbiter.ReceiveMessageBroadcastType.TO_CLIENTS = "2";
//==============================================================================
// ROOM ID PARSING UTILITIES
//==============================================================================
/** @class */
net.user1.orbiter.RoomIDParser = new Object();

net.user1.orbiter.RoomIDParser.getSimpleRoomID = function (fullRoomID) {
  if (fullRoomID.indexOf(".") == -1) {
    return fullRoomID;
  } else {
    return fullRoomID.slice(fullRoomID.lastIndexOf(".")+1);
  }
};

net.user1.orbiter.RoomIDParser.getQualifier = function (fullRoomID) {
  if (fullRoomID.indexOf(".") == -1) {
    return "";
  } else {
    return fullRoomID.slice(0, fullRoomID.lastIndexOf("."));
  }
};

net.user1.orbiter.RoomIDParser.splitID = function (fullRoomID) {
  return [getQualifier(fullRoomID), getSimpleRoomID(fullRoomID)];
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.utils.UDictionary = function () {
};
//==============================================================================
// TOKEN CONSTANTS
//==============================================================================
/** @class
    @private */
net.user1.orbiter.Tokens = new Object();

/** @private */
net.user1.orbiter.Tokens.RS = "|";  
/** @private */
net.user1.orbiter.Tokens.WILDCARD = "*";
/** @private */
net.user1.orbiter.Tokens.GLOBAL_ATTR = "";
/** @private */
net.user1.orbiter.Tokens.CUSTOM_CLASS_ATTR = "_CLASS";
/** @private */
net.user1.orbiter.Tokens.MAX_CLIENTS_ATTR = "_MAX_CLIENTS";
/** @private */
net.user1.orbiter.Tokens.REMOVE_ON_EMPTY_ATTR = "_DIE_ON_EMPTY";
/** @private */
net.user1.orbiter.Tokens.PASSWORD_ATTR = "_PASSWORD";
/** @private */
net.user1.orbiter.Tokens.ROLES_ATTR = "_ROLES";
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.orbiter.System = function (window) {
  this.window = window;
  this.clientType     = net.user1.orbiter.Product.clientType;
  this.clientVersion  = net.user1.orbiter.Product.clientVersion;
  this.upcVersion     = net.user1.orbiter.Product.upcVersion;
}

//==============================================================================
// INSTANCE METHODS
//==============================================================================  
net.user1.orbiter.System.prototype.getClientType = function () {
  return this.clientType;
}

/** @returns net.user1.orbiter.VersionNumber */
net.user1.orbiter.System.prototype.getClientVersion = function () {
  return this.clientVersion;
}
    
/** @returns net.user1.orbiter.VersionNumber */
net.user1.orbiter.System.prototype.getUPCVersion = function () {
  return this.upcVersion;
}
    
/** @returns Boolean */
net.user1.orbiter.System.prototype.isJavaScriptCompatible = function () {
  // Assume non-browser environments can do cross-origin XMLHttpRequests
  if (this.window == null && typeof XMLHttpRequest != "undefined") {
    return true;
  }
  
  if (this.window != null) {
    // Standards-based browsers that support cross-origin requests
    if (typeof XMLHttpRequest != "undefined" 
        && typeof new XMLHttpRequest().withCredentials != "undefined") {
        return true;
    }
  
    // Versions of IE that support proprietary cross-origin requests
    if (typeof XDomainRequest != "undefined" 
        && this.window.location.protocol != "file:") {
      return true;
    }

    // Browsers that can communicate between windows
    if (this.window.postMessage != null) {
      return true;
    }
  }
  
  // This environment has no way to connect to Union Server
  return false;
}

/** 
 * <p>
 * Returns true if the host environment supports direct cross-origin HTTP
 * requests using CORS (see: <a href="http://www.w3.org/TR/cors/">http://www.w3.org/TR/cors/</a>).
 * When hasHTTPDirectConnection() returns true, then Orbiter can safely use
 * the HTTPDirectConnection class to communicate with Union Server over HTTP. When
 * hasHTTPDirectConnection() returns false, Orbiter cannot use
 * HTTPDirectConnection, and must instead use the HTTPIFrameConnection class to
 * communicate with Union Server over HTTP. 
 * </p>
 * 
 * <p>
 * Note that Orbiter applications that use Orbiter's connect() or setServer()
 * methods to connect to Union Server do not need to perform a capabilities check
 * via hasHTTPDirectConnection(). The connect() and setServer() methods check
 * the host environment's capabilities automatically, and choose the appropriate
 * connection type for the environment. The hasHTTPDirectConnection() method is 
 * required in one situation only: when the application explicitly wishes to 
 * communicate over HTTP without trying a WebSocket connection first.
 * </p>
 * 
 * @returns Boolean 
 * 
 * @see net.user1.orbiter.HTTPDirectConnection
 * @see net.user1.orbiter.HTTPIFrameConnection
 * @see net.user1.orbiter.Orbiter#connect
 * @see net.user1.orbiter.Orbiter#setServer
 **/
net.user1.orbiter.System.prototype.hasHTTPDirectConnection = function() {
  // -If XHR has a "withCredentials" flag then CORS is supported.
  // -In IE, if XDomainRequest is available, and the file wasn't loaded 
  //    locally, then CORS is supported
  // -In non-browser environments, assume cross-origin XMLHttpRequests are allowed
  if ((typeof XMLHttpRequest != "undefined" && typeof new XMLHttpRequest().withCredentials != "undefined")
       || (typeof XDomainRequest != "undefined" && this.window != null && this.window.location.protocol != "file:")
       || (this.window == null && typeof XMLHttpRequest != "undefined")) {
    return true;
  } else {
    return false;
  }
}

/** 
 * <p>
 * Returns true if the host environment supports WebSocket connections.
 * When hasWebSocket() returns true, then Orbiter can safely use
 * the WebSocketConnection class to communicate with Union Server over a 
 * persistent TCP/IP socket. When hasWebSocket() returns false, Orbiter cannot use
 * WebSocketConnection, and must instead use HTTP communications (via either the
 * HTTPDirectConnection class or the HTTPIFrameConnection class). 
 * </p>
 * 
 * <p>
 * Note that Orbiter applications that use Orbiter's connect() or setServer()
 * methods to connect to Union Server do not need to perform a capabilities check
 * via hasWebSocket(). The connect() and setServer() methods check
 * the host environment's capabilities automatically, and choose the appropriate
 * connection type for the environment. The hasWebSocket() method is 
 * required in one situation only: when the application explicitly wishes to 
 * determine whether WebSocket is supported for the purpose of application flow
 * or user feedback.
 * </p>
 * 
 * @returns Boolean 
 * 
 * @see net.user1.orbiter.WebSocketConnection
 * @see net.user1.orbiter.Orbiter#connect
 **/
net.user1.orbiter.System.prototype.hasWebSocket = function() {
  return (typeof WebSocket !== "undefined" || typeof MozWebSocket !== "undefined");
}

net.user1.orbiter.System.prototype.toString = function () {
  return "[object System]";
}  
//==============================================================================
// A COLLECTION OF NUMERIC FORMATTING FUNCTIONS
//==============================================================================
/** @class */
net.user1.utils.NumericFormatter = new Object();

net.user1.utils.NumericFormatter.dateToLocalHrMinSec = function (date) {
  var timeString = net.user1.utils.NumericFormatter.addLeadingZero(date.getHours()) + ":" 
                 + net.user1.utils.NumericFormatter.addLeadingZero(date.getMinutes()) + ":" 
                 + net.user1.utils.NumericFormatter.addLeadingZero(date.getSeconds());
  return timeString;
}
    
net.user1.utils.NumericFormatter.dateToLocalHrMinSecMs = function (date) {
  return net.user1.utils.NumericFormatter.dateToLocalHrMinSec(date) + "." + net.user1.utils.NumericFormatter.addTrailingZeros(date.getMilliseconds());
}
    
net.user1.utils.NumericFormatter.addLeadingZero = function (n) {
  return ((n>9)?"":"0")+n;
}
    
net.user1.utils.NumericFormatter.addTrailingZeros = function (n) {
  var ns = n.toString();
  
  if (ns.length == 1) {
    return ns + "00";
  } else if (ns.length == 2) {
    return ns + "0";
  } else {
    return ns;
  }
}

net.user1.utils.NumericFormatter.msToElapsedDayHrMinSec = function (ms) {
  var sec = Math.floor(ms/1000);
 
  var min = Math.floor(sec/60);
  sec = sec % 60;
  var timeString = net.user1.utils.NumericFormatter.addLeadingZero(sec);
  
  var hr = Math.floor(min/60);
  min = min % 60;
  timeString = net.user1.utils.NumericFormatter.addLeadingZero(min) + ":" + timeString;
  
  var day = Math.floor(hr/24);
  hr = hr % 24;
  timeString = net.user1.utils.NumericFormatter.addLeadingZero(hr) + ":" + timeString;
  
  if (day > 0) {      
    timeString = day + "d " + timeString;
  }
  
  return timeString;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.events.EventListener = function (listener,
                                           thisArg,
                                           priority) {
  this.listener   = listener;
  this.thisArg    = thisArg;
  this.priority   = priority;
};

//==============================================================================
// INSTANCE METHODS
//==============================================================================
net.user1.events.EventListener.prototype.getListenerFunction = function () {
  return this.listener;
};
    
net.user1.events.EventListener.prototype.getThisArg = function () {
  return this.thisArg;
};
    
net.user1.events.EventListener.prototype.getPriority = function () {
  return this.priority;
};

net.user1.events.EventListener.prototype.toString = function () {
  return "[object EventListener]";
};
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
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.events.Event = function (type) {
  if (type !== undefined) {
    this.type = type;
  } else {
    throw new Error("Event creation failed. No type specified. Event: " + this);
  }
  this.target = null;
};
    
net.user1.events.Event.prototype.toString = function () {
  return "[object Event]";
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The ConsoleLogger class outputs Orbiter's log to the host environment's console,
if a console is available.

*/
net.user1.logger.ConsoleLogger = function (log) {
  this.log = log;
  this.log.addEventListener(net.user1.logger.LogEvent.UPDATE, this.updateListener, this);
  // Print all messages already in the log
  var history = this.log.getHistory();
  for (var i = 0; i < history.length; i++) {
    this.out(history[i]);
  }
};
    
//==============================================================================
// INSTANCE METHODS
//==============================================================================
/** @private */ 
net.user1.logger.ConsoleLogger.prototype.updateListener = function (e) {
  var timeStamp = e.getTimeStamp();
  var level = e.getLevel();
  var bufferSpace = (level == net.user1.logger.Logger.INFO 
                     || level == net.user1.logger.Logger.WARN) ? " " : "";

  this.out(timeStamp + (timeStamp == "" ? "" : " ") 
           + e.getLevel() + ": " + bufferSpace + e.getMessage());
};

/** @private */ 
net.user1.logger.ConsoleLogger.prototype.out = function (value) {
  if (typeof console === "undefined" || typeof console.log === "undefined") {
    return;
  }
  console.log(value);
};

/** @private */ 
net.user1.logger.ConsoleLogger.prototype.dispose = function () {
  this.log.removeEventListener(net.user1.logger.LogEvent.UPDATE, this.updateListener, this);
  this.log = log = null;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.logger.LogEvent = function (type, message, level, timeStamp) {
  net.user1.events.Event.call(this, type);

  this.message = message;
  this.level = level;
  this.timeStamp = timeStamp;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.logger.LogEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @constant */
net.user1.logger.LogEvent.UPDATE = "UPDATE";
/** @constant */
net.user1.logger.LogEvent.LEVEL_CHANGE = "LEVEL_CHANGE";
  
//==============================================================================
// INSTANCE METHODS
//==============================================================================
net.user1.logger.LogEvent.prototype.getMessage = function () {
  return this.message;
};
  
net.user1.logger.LogEvent.prototype.getLevel = function () {
  return this.level;
};
  
net.user1.logger.LogEvent.prototype.getTimeStamp = function () {
  return this.timeStamp;
};

net.user1.logger.LogEvent.prototype.toString = function () {
  return "[object LogEvent]";
};

//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The Logger class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.logger.LogEvent.LEVEL_CHANGE}</li>
<li class="fixedFont">{@link net.user1.logger.LogEvent.UPDATE}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.


    @extends net.user1.events.EventDispatcher
*/
net.user1.logger.Logger = function (historyLength) {
  // Invoke superclass constructor
  net.user1.events.EventDispatcher.call(this);
  
  // Instance variables
  this.suppressionTerms = new Array(); 
  this.timeStampEnabled = false;
  this.logLevel = 0;
  this.messages = new Array();
  this.historyLength = 0;

  // Initialization
  this.setHistoryLength(historyLength == null ? 100 : historyLength);
  this.enableTimeStamp(); 
  this.setLevel(net.user1.logger.Logger.INFO);
};  

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.logger.Logger, net.user1.events.EventDispatcher);
  
//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @constant */
net.user1.logger.Logger.FATAL = "FATAL"; 
/** @constant */
net.user1.logger.Logger.ERROR = "ERROR"; 
/** @constant */
net.user1.logger.Logger.WARN  = "WARN"; 
/** @constant */
net.user1.logger.Logger.INFO  = "INFO"; 
/** @constant */
net.user1.logger.Logger.DEBUG = "DEBUG";
net.user1.logger.Logger.logLevels = new Array(net.user1.logger.Logger.FATAL,
                                              net.user1.logger.Logger.ERROR, 
                                              net.user1.logger.Logger.WARN, 
                                              net.user1.logger.Logger.INFO, 
                                              net.user1.logger.Logger.DEBUG);

//==============================================================================
// INSTANCE METHODS
//==============================================================================
net.user1.logger.Logger.prototype.setLevel = function (level) {
  if (level !== undefined) {
    for (var i = 0; i < net.user1.logger.Logger.logLevels.length; i++) {
      if (net.user1.logger.Logger.logLevels[i].toLowerCase() == level.toLowerCase()) {
        this.logLevel = i;
        this.dispatchEvent(new net.user1.logger.LogEvent(net.user1.logger.LogEvent.LEVEL_CHANGE, null, level));
        return;
      }
    }
  }

  this.warn("Invalid log level specified: " + level);
};

net.user1.logger.Logger.prototype.getLevel = function () {
  return net.user1.logger.Logger.logLevels[this.logLevel];
};

net.user1.logger.Logger.prototype.fatal = function (msg) {
  this.addEntry(0, net.user1.logger.Logger.FATAL, msg);
};

net.user1.logger.Logger.prototype.error = function (msg) {
  this.addEntry(1, net.user1.logger.Logger.ERROR, msg);
};

net.user1.logger.Logger.prototype.warn = function (msg) {
  this.addEntry(2, net.user1.logger.Logger.WARN, msg);
};

net.user1.logger.Logger.prototype.info = function (msg) {
  this.addEntry(3, net.user1.logger.Logger.INFO, msg);
};

net.user1.logger.Logger.prototype.debug = function (msg) {
  this.addEntry(4, net.user1.logger.Logger.DEBUG, msg);
};

net.user1.logger.Logger.prototype.addSuppressionTerm = function (term) {
  this.debug("Added suppression term. Log messages containing '" 
             + term + "' will now be ignored.");
  this.suppressionTerms.push(term);
};

net.user1.logger.Logger.prototype.removeSuppressionTerm = function (term) {
  var termIndex = net.user1.utils.ArrayUtil.indexOf(this.suppressionTerms, term);
  if (termIndex != -1) {
    this.suppressionTerms.splice(termIndex, 1);
    this.debug("Removed suppression term. Log messages containing '" 
               + term + "' will now be shown.");
    return true;
  }
  return false;
};

/** @private */
net.user1.logger.Logger.prototype.addEntry = function (level, levelName, msg) {
  var timeStamp = "";
  var time;
  
  // Abort if the log's level is lower than the message's level.
  if (this.logLevel < level) {
    return;
  }
  
  // Don't log messages if they contain any of the suppression terms.
  for (var i = this.suppressionTerms.length; --i >= 0;) {
    if (msg.indexOf(this.suppressionTerms[i]) != -1) {
      return;
    }
  }

  if (this.timeStampEnabled) {
    time = new Date();
    timeStamp = time.getMonth()+1 + "/" + String(time.getDate())
              + "/" + String(time.getFullYear()).substr(2)
              + " " + net.user1.utils.NumericFormatter.dateToLocalHrMinSecMs(time) 
              + " UTC" + (time.getTimezoneOffset() >= 0 ? "-" : "+") 
              + Math.abs(time.getTimezoneOffset() / 60);
  }
  
  // Log the message.
  this.addToHistory(levelName, msg, timeStamp);

  var e = new net.user1.logger.LogEvent(net.user1.logger.LogEvent.UPDATE,
                                        msg, levelName, timeStamp);
  this.dispatchEvent(e);
};

/** @private */ 
net.user1.logger.Logger.prototype.setHistoryLength = function (newHistoryLength) {
  this.historyLength = newHistoryLength;
  
  if (this.messages.length > this.historyLength) {
    this.messages.splice(this.historyLength);
  }
};

net.user1.logger.Logger.prototype.getHistoryLength = function () {
  return this.historyLength;
};

/** @private */ 
net.user1.logger.Logger.prototype.addToHistory = function (level, msg, timeStamp) {
  this.messages.push(timeStamp + (timeStamp == "" ? "" : " ") + level + ": " + msg);
  if (this.messages.length > this.historyLength) {
    this.messages.shift();
  }
};

net.user1.logger.Logger.prototype.getHistory = function () {
  return this.messages.slice(0);
};

net.user1.logger.Logger.prototype.enableTimeStamp = function () {
  this.timeStampEnabled = true;
};

net.user1.logger.Logger.prototype.disableTimeStamp = function () {
  this.timeStampEnabled = false;
};

net.user1.logger.Logger.prototype.toString = function () {
  return "[object Logger]";
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.ConnectionManagerEvent = function (type, connection, status) {
  net.user1.events.Event.call(this, type);
  
  this.connection = connection
  this.status = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.ConnectionManagerEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.ConnectionManagerEvent.BEGIN_CONNECT = "BEGIN_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.SELECT_CONNECTION = "SELECT_CONNECTION";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.READY = "READY";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.CONNECT_FAILURE = "CONNECT_FAILURE";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.CLIENT_KILL_CONNECT = "CLIENT_KILL_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.SERVER_KILL_CONNECT = "SERVER_KILL_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.DISCONNECT = "DISCONNECT";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.CONNECTION_STATE_CHANGE = "CONNECTION_STATE_CHANGE";
/** @constant */
net.user1.orbiter.ConnectionManagerEvent.SESSION_TERMINATED = "SESSION_TERMINATED";
  
//==============================================================================
// INSTANCE METHODS
//==============================================================================

net.user1.orbiter.ConnectionManagerEvent.prototype.getConnection = function () {
  return this.connection;
}

net.user1.orbiter.ConnectionManagerEvent.prototype.getStatus = function () {
  return this.status;
}

net.user1.orbiter.ConnectionManagerEvent.prototype.toString = function () {
  return "[object ConnectionManagerEvent]";
}  

//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The ConnectionManager class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.ConnectionManagerEvent.BEGIN_CONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionManagerEvent.SELECT_CONNECTION}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionManagerEvent.CONNECT_FAILURE}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionManagerEvent.DISCONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionManagerEvent.SERVER_KILL_CONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionManagerEvent.CLIENT_KILL_CONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionManagerEvent.READY}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher

 * @see net.user1.orbiter.Orbiter#connect
 */
net.user1.orbiter.ConnectionManager = function (orbiter) {
    // Call superconstructor
    net.user1.events.EventDispatcher.call(this);
    
    // Variables
    this.orbiter             = orbiter;
    this.connectAttemptCount = 0;
    this.connectAbortCount   = 0;
    this.readyCount          = 0;      
    this.connectFailedCount  = 0;
    this.setConnectionState(net.user1.orbiter.ConnectionState.NOT_CONNECTED);
    this.readyTimeout        = 0;
    this.connections         = new Array();
    this.activeConnection    = null;
    this.inProgressConnection = null;
    this.currentConnectionIndex = 0;
    this.attemptedConnections = null;
    this.setReadyTimeout(net.user1.orbiter.ConnectionManager.DEFAULT_READY_TIMEOUT);
    
    // Initialization
    // Make all Orbiter instances in this VM share the same server affinity 
    this.setGlobalAffinity(true);  
};
    
//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.ConnectionManager, net.user1.events.EventDispatcher);

//==============================================================================
// STATIC VARIABLES
//==============================================================================
net.user1.orbiter.ConnectionManager.DEFAULT_READY_TIMEOUT = 10000;

// =============================================================================
// CONNECT AND DISCONNECT
// =============================================================================
net.user1.orbiter.ConnectionManager.prototype.connect = function () {
  if (this.connections.length == 0) {
    this.orbiter.getLog().error("[CONNECTION_MANAGER] No connections defined. Connection request ignored.");
    return;
  }
  
  this.connectAttemptCount++;
  this.attemptedConnections = new Array();

  switch (this.connectionState) {
    case net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS:
      this.orbiter.getLog().info("[CONNECTION_MANAGER] Connection attempt already in " 
                            + "progress. Existing attempt must be aborted before"  
                            + " new connection attempt begins...");
      this.disconnect();
      break;

    case net.user1.orbiter.ConnectionState.READY:
      this.orbiter.getLog().info("[CONNECTION_MANAGER] Existing connection to Union" 
                            + " must be disconnected before new connection" 
                            + " attempt begins.");
      this.disconnect();
      break;
  }
  this.setConnectionState(net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS);
  
  this.orbiter.getLog().debug("[CONNECTION_MANAGER] Searching for most recent valid connection.");
  var originalConnectionIndex = this.currentConnectionIndex;
  while (!this.getCurrentConnection().isValid()) {
    this.advance();
    if (this.currentConnectionIndex == originalConnectionIndex) {
      // Couldn't find a valid connection, so start the connection with
      // the first connection in the connection list
      this.orbiter.getLog().debug("[CONNECTION_MANAGER] No valid connection found. Starting connection attempt with first connection.");
      this.currentConnectionIndex = 0;
      break;
    }
  }  
  
  this.dispatchBeginConnect();
  this.connectCurrentConnection();
};

net.user1.orbiter.ConnectionManager.prototype.disconnect = function () {
  if (this.connections.length == 0) {
    this.dispatchConnectFailure("No connections defined. Disconnection attempt failed.");
    return;
  }
  
  switch (this.connectionState) {
    // Currently connected
    case net.user1.orbiter.ConnectionState.READY:
      this.orbiter.getLog().info("[CONNECTION_MANAGER] Closing existing connection: "
                            + this.getActiveConnection().toString());
      this.setConnectionState(net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS);
      this.disconnectConnection(this.getActiveConnection());
      break;

    // Currently attempting to connect
    case net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS:
      this.orbiter.getLog().info("[CONNECTION_MANAGER] Aborting existing connection attempt: "
                            + this.getInProgressConnection().toString());
      this.connectAbortCount++;
      this.setConnectionState(net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS);
      this.disconnectConnection(this.getInProgressConnection());
      this.orbiter.getLog().info("[CONNECTION_MANAGER] Connection abort complete.");
      break;

    // Currently attempting to disconnect
    case net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS:
      this.orbiter.getLog().info("[CONNECTION_MANAGER] Disconnection request ignored."
                            + " Already disconnecting.");
      break;
  }
};
    
/** @private */
net.user1.orbiter.ConnectionManager.prototype.disconnectConnection = function (connection) {
  connection.disconnect();
};
    
/** @private */
net.user1.orbiter.ConnectionManager.prototype.connectCurrentConnection = function () {
  // If there are no Connections defined, fail immediately 
  if (this.connections.length == 0) {
    this.setConnectionState(net.user1.orbiter.ConnectionState.NOT_CONNECTED);
    this.connectFailedCount++;
    this.dispatchConnectFailure("No connections defined. Connection attempt failed.");
    return;
  }
  
  this.inProgressConnection = this.getCurrentConnection();
  
  // If the requested connection has already been attempted this round,
  // ignore it.
  if (net.user1.utils.ArrayUtil.indexOf(this.attemptedConnections, this.inProgressConnection) != -1) {
    this.advanceAndConnect();
    return;
  }
  
  this.dispatchSelectConnection(this.inProgressConnection);
  this.orbiter.getLog().info("[CONNECTION_MANAGER] Attempting connection via "
                        + this.inProgressConnection.toString() + ". (Connection "
                        + (this.attemptedConnections.length+1) + " of "
                        + this.connections.length + ". Attempt " + this.connectAttemptCount +" since last successful connection).");
  this.addConnectionListeners(this.inProgressConnection);
  this.inProgressConnection.connect();
};

/** @private */
net.user1.orbiter.ConnectionManager.prototype.advanceAndConnect = function () {
  if (!this.connectAttemptComplete()) {
    this.advance();
    this.connectCurrentConnection();
  } else {
    // Tried all connections, so give up and dispatch CONNECT_FAILURE
    this.connectFailedCount++;
    this.setConnectionState(net.user1.orbiter.ConnectionState.NOT_CONNECTED);
    this.orbiter.getLog().info("[CONNECTION_MANAGER] Connection failed for all specified hosts and ports.");
    this.dispatchConnectFailure("Connection failed for all specified hosts and ports.");
  }
};
    
/** @private */
net.user1.orbiter.ConnectionManager.prototype.connectAttemptComplete = function () {
  return this.attemptedConnections.length == this.connections.length;
};

/** @private */
net.user1.orbiter.ConnectionManager.prototype.advance = function () {
  this.currentConnectionIndex++;
  if (this.currentConnectionIndex == this.connections.length) {
    this.currentConnectionIndex = 0;
  }
};
    
// =============================================================================
// CONNECTION OBJECT MANAGEMENT
// =============================================================================
net.user1.orbiter.ConnectionManager.prototype.addConnection = function (connection) {
  if (connection != null) {
    this.orbiter.getLog().info("[CONNECTION_MANAGER] New connection added. "
                          + connection.toString() + ".");
    connection.setOrbiter(this.orbiter);
    this.connections.push(connection);
  }
};
    
net.user1.orbiter.ConnectionManager.prototype.removeConnection = function (connection) {
  if (connection != null) {
    connection.disconnect();
    this.removeConnectionListeners(connection);
    return net.user1.utils.ArrayUtil.remove(this.connections, connection);
  } else {
    return false;
  }
};

net.user1.orbiter.ConnectionManager.prototype.removeAllConnections = function () {
  if (this.connections.length == 0) {
    this.orbiter.getLog().info("[CONNECTION_MANAGER] removeAllConnections() ignored. " +
                               " No connections to remove.");
    return;
  }
  
  this.orbiter.getLog().info("[CONNECTION_MANAGER] Removing all connections...");
  this.disconnect();
  while (this.connections.length > 0) {
    this.removeConnection(this.connections[0]);
  }
  this.currentConnectionIndex = 0;
  this.orbiter.getLog().info("[CONNECTION_MANAGER] All connections removed.");
};
    
// =============================================================================
// CONNECTION ACCESS
// =============================================================================
net.user1.orbiter.ConnectionManager.prototype.getActiveConnection = function () {
  return this.activeConnection;
};
    
net.user1.orbiter.ConnectionManager.prototype.getInProgressConnection = function () {
  return this.inProgressConnection;
};
    
net.user1.orbiter.ConnectionManager.prototype.getConnections = function () {
  return this.connections.slice();
};

/** @private */    
net.user1.orbiter.ConnectionManager.prototype.getCurrentConnection = function () {
  return this.connections[this.currentConnectionIndex];
};
    
// =============================================================================
// CONNECTION LISTENER REGISTRATION
// =============================================================================
/** @private */
net.user1.orbiter.ConnectionManager.prototype.addConnectionListeners = function(connection) {
  if (connection != null) {
    connection.addEventListener(net.user1.orbiter.ConnectionEvent.READY,               this.readyListener, this);
    connection.addEventListener(net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE,     this.connectFailureListener, this);
    connection.addEventListener(net.user1.orbiter.ConnectionEvent.DISCONNECT,          this.disconnectListener, this);
    connection.addEventListener(net.user1.orbiter.ConnectionEvent.CLIENT_KILL_CONNECT, this.clientKillConnectListener, this);
    connection.addEventListener(net.user1.orbiter.ConnectionEvent.SERVER_KILL_CONNECT, this.serverKillConnectListener, this);
  }
};
    
/** @private */    
net.user1.orbiter.ConnectionManager.prototype.removeConnectionListeners = function (connection) {
  if (connection != null) {
    connection.removeEventListener(net.user1.orbiter.ConnectionEvent.READY,               this.readyListener, this);
    connection.removeEventListener(net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE,     this.connectFailureListener, this);
    connection.removeEventListener(net.user1.orbiter.ConnectionEvent.DISCONNECT,          this.disconnectListener, this);
    connection.removeEventListener(net.user1.orbiter.ConnectionEvent.CLIENT_KILL_CONNECT, this.clientKillConnectListener, this);
    connection.removeEventListener(net.user1.orbiter.ConnectionEvent.SERVER_KILL_CONNECT, this.serverKillConnectListener, this);
  }
};
    
// =============================================================================
// CONNECTION STATE ACCESS
// =============================================================================
net.user1.orbiter.ConnectionManager.prototype.isReady = function () {
  return this.connectionState == net.user1.orbiter.ConnectionState.READY;
}

net.user1.orbiter.ConnectionManager.prototype.setConnectionState = function (state) {
  var changed = false;
  if (state != this.connectionState) {
    changed = true;
  }
  this.connectionState = state;
  if (changed) {
    this.dispatchConnectionStateChange();
  }
};

net.user1.orbiter.ConnectionManager.prototype.getConnectionState = function () {
  return this.connectionState;
};
    
// =============================================================================
// CONNECTION COUNT MANAGEMENT
// =============================================================================
net.user1.orbiter.ConnectionManager.prototype.getReadyCount = function () {
  return this.readyCount;
};
  
net.user1.orbiter.ConnectionManager.prototype.getConnectFailedCount = function () {
  return this.connectFailedCount;
};
  
net.user1.orbiter.ConnectionManager.prototype.getConnectAttemptCount = function () {
  return this.connectAttemptCount;
};
  
net.user1.orbiter.ConnectionManager.prototype.getConnectAbortCount = function () {
  return this.connectAbortCount;
};
    
// =============================================================================
// CURRENT CONNECTION LISTENERS
// =============================================================================
/** @private */
net.user1.orbiter.ConnectionManager.prototype.readyListener = function (e) {
  this.setConnectionState(net.user1.orbiter.ConnectionState.READY);
  this.inProgressConnection = null;
  this.activeConnection = e.target;
  this.readyCount++;
  this.connectFailedCount = 0;
  this.connectAttemptCount = 0;
  this.connectAbortCount = 0;
  this.dispatchReady();
};

/** @private */
net.user1.orbiter.ConnectionManager.prototype.connectFailureListener = function (e) {
  var failedConnection = e.target;
  this.orbiter.getLog().warn("[CONNECTION_MANAGER] Connection failed for "
                        + failedConnection.toString() 
                        + ". Status: [" + e.getStatus() + "]");
  
  this.removeConnectionListeners(failedConnection);
  this.inProgressConnection = null;
  
  if (this.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
    this.dispatchConnectFailure("Connection closed by client.");
  } else {
    if (failedConnection.getHost() != failedConnection.getRequestedHost()) {
      this.orbiter.getLog().info("[CONNECTION_MANAGER] Connection failed for affinity address [" + failedConnection.getHost() + "]. Removing affinity.");
      this.clearAffinity(failedConnection.getRequestedHost());
    }

    this.attemptedConnections.push(failedConnection);
    this.advanceAndConnect();
  }
};

/** @private */
net.user1.orbiter.ConnectionManager.prototype.disconnectListener = function (e) {
  this.setConnectionState(net.user1.orbiter.ConnectionState.NOT_CONNECTED);
  this.removeConnectionListeners(e.target);
  this.activeConnection = null;
  this.dispatchDisconnect(e.target);
};

/** @private */
net.user1.orbiter.ConnectionManager.prototype.clientKillConnectListener = function (e) {
  this.dispatchClientKillConnect(e.target);
  // This event is always followed by a DISCONNECT event
};

/** @private */
net.user1.orbiter.ConnectionManager.prototype.serverKillConnectListener = function (e) {
  this.dispatchServerKillConnect(e.target);
  // This event is always followed by a DISCONNECT event
};

// =============================================================================
// READY TIMEOUT MANAGEMENT
// =============================================================================
    
net.user1.orbiter.ConnectionManager.prototype.setReadyTimeout = function (milliseconds) {
  if (milliseconds > 0) {
    this.readyTimeout = milliseconds;
    this.orbiter.getLog().info("[CONNECTION_MANAGER] Ready timeout set to " + milliseconds + " ms.");
    if (milliseconds < 3000) {
      this.orbiter.getLog().warn("[CONNECTION_MANAGER] Current ready timeout (" 
                           + milliseconds + ") may not allow sufficient time"
                           + " to connect to Union Server over a typical"
                           + " internet connection.");
    }
  } else {
    this.orbiter.getLog().warn("[CONNECTION_MANAGER] Invalid ready timeout specified: " 
             + milliseconds + ". Duration must be greater than zero.");
  }
};
    
net.user1.orbiter.ConnectionManager.prototype.getReadyTimeout = function () {
  return this.readyTimeout;
};

// =============================================================================
// SERVER AFFINITY
// =============================================================================
net.user1.orbiter.ConnectionManager.prototype.getAffinity = function (host) {
  var address = this.affinityData.read("affinity", host+"address");
  var until = parseFloat(this.affinityData.read("affinity", host+"until"));
  
  if (address != null) {
    var now = new Date().getTime();
    if (now >= until) {
      this.orbiter.getLog().warn("[CONNECTION_MANAGER] Affinity duration expired for address [" 
                                 + address + "], host [" + host + "]. Removing affinity.");
      this.clearAffinity(host);
    } else {
      return address;
    }
  }

  return host;
};

/**
 * @private
 */
net.user1.orbiter.ConnectionManager.prototype.setAffinity = function (host, address, duration) {
  var until = new Date().getTime() + (duration*60*1000);
  // Don't use JSON stringify for affinity values because not all JavaScript
  // environments support JSON natively (e.g., non-browser VMs)
  this.affinityData.write("affinity", host+"address", address);
  this.affinityData.write("affinity", host+"until", until);

  this.orbiter.getLog().info("[CONNECTION_MANAGER] Assigning affinity address [" 
    + address + "] for supplied host [" +host + "]. Duration (minutes): "
    + duration);
};

/**
 * @private
 */
net.user1.orbiter.ConnectionManager.prototype.clearAffinity = function (host) {
  this.affinityData.remove("affinity", host+"address");
  this.affinityData.remove("affinity", host+"until");
};
    
net.user1.orbiter.ConnectionManager.prototype.setGlobalAffinity = function (enabled) {
  if (enabled) {
    this.orbiter.getLog().info("[CONNECTION_MANAGER] Global server affinity selected."
     + " Using current environment's shared server affinity."); 
    this.affinityData = net.user1.utils.LocalData;
  } else {
    this.orbiter.getLog().info("[CONNECTION_MANAGER] Local server affinity selected."
     + " The current client will maintain its own, individual server affinity."); 
    this.affinityData = new net.user1.utils.MemoryStore();
  }
};

// =============================================================================
// EVENT DISPATCHING
// =============================================================================
    
/** @private */
net.user1.orbiter.ConnectionManager.prototype.dispatchBeginConnect = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionManagerEvent(net.user1.orbiter.ConnectionManagerEvent.BEGIN_CONNECT));
};
    
/** @private */
net.user1.orbiter.ConnectionManager.prototype.dispatchSelectConnection = function (connection) {
  this.dispatchEvent(new net.user1.orbiter.ConnectionManagerEvent(net.user1.orbiter.ConnectionManagerEvent.SELECT_CONNECTION,
      connection));
};
    
/** @private */
net.user1.orbiter.ConnectionManager.prototype.dispatchConnectFailure = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ConnectionManagerEvent(net.user1.orbiter.ConnectionManagerEvent.CONNECT_FAILURE,
      null, status));
};
    
/** @private */
net.user1.orbiter.ConnectionManager.prototype.dispatchDisconnect = function (connection) {
  this.dispatchEvent(new net.user1.orbiter.ConnectionManagerEvent(net.user1.orbiter.ConnectionManagerEvent.DISCONNECT,
      connection));
};
    
/** @private */
net.user1.orbiter.ConnectionManager.prototype.dispatchServerKillConnect = function (connection) {
  this.dispatchEvent(new net.user1.orbiter.ConnectionManagerEvent(net.user1.orbiter.ConnectionManagerEvent.SERVER_KILL_CONNECT,
      connection));
};
    
/** @private */
net.user1.orbiter.ConnectionManager.prototype.dispatchClientKillConnect = function (connection) {
  this.dispatchEvent(new net.user1.orbiter.ConnectionManagerEvent(net.user1.orbiter.ConnectionManagerEvent.CLIENT_KILL_CONNECT,
      connection));
};
    
/** @private */
net.user1.orbiter.ConnectionManager.prototype.dispatchReady = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionManagerEvent(net.user1.orbiter.ConnectionManagerEvent.READY));
};

/** @private */
net.user1.orbiter.ConnectionManager.prototype.dispatchConnectionStateChange = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionManagerEvent(net.user1.orbiter.ConnectionManagerEvent.CONNECTION_STATE_CHANGE));
};

/** @private */
net.user1.orbiter.ConnectionManager.prototype.dispatchSessionTerminated = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionManagerEvent(net.user1.orbiter.ConnectionManagerEvent.SESSION_TERMINATED));
};

// =============================================================================
// DISPOSAL
// =============================================================================    
net.user1.orbiter.ConnectionManager.prototype.dispose = function () {
  this.removeAllConnections();
  this.attemptedConnections = null;
  this.activeConnection = null;
  this.inProgressConnection = null;
  this.connections = null;
};






















//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.orbiter.ConnectionMonitor = function (orbiter) {
  // Instance variables
  this.connectionTimeout = 0;
  this.heartbeatIntervalID = -1;
  this.heartbeatCounter = 0;
  this.heartbeatEnabled = true;
  this.heartbeats = new net.user1.utils.UDictionary();
  
  this.oldestHeartbeat = 0;
  this.heartBeatFrequency = -1;
  
  this.sharedPing = false;

  this.autoReconnectMinMS = 0;
  this.autoReconnectMaxMS = 0;
  this.autoReconnectFrequency = -1;
  this.autoReconnectDelayFirstAttempt = false;
  this.autoReconnectTimeoutID = -1;
  this.autoReconnectAttemptLimit = -1;
  
  this.orbiter = orbiter;
  this.msgManager = orbiter.getMessageManager();
  this.log = orbiter.getLog();
  
  this.disposed = false;
  
  // Initialization
  this.orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.READY, this.connectReadyListener, this);
  this.orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.CLOSE, this.connectCloseListener, this);
  this.disableHeartbeatLogging();
};

//==============================================================================
// STATIC VARIABLES
//==============================================================================
net.user1.orbiter.ConnectionMonitor.DEFAULT_HEARTBEAT_FREQUENCY = 10000;
net.user1.orbiter.ConnectionMonitor.MIN_HEARTBEAT_FREQUENCY = 20;
net.user1.orbiter.ConnectionMonitor.DEFAULT_AUTORECONNECT_FREQUENCY = -1;
net.user1.orbiter.ConnectionMonitor.DEFAULT_AUTORECONNECT_ATTEMPT_LIMIT = -1;
net.user1.orbiter.ConnectionMonitor.DEFAULT_CONNECTION_TIMEOUT = 60000;

//==============================================================================
// CONNECTION MONITORING
//==============================================================================
/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.connectReadyListener = function (e) {
  this.msgManager.addMessageListener(net.user1.orbiter.Messages.CLIENT_HEARTBEAT, this.heartbeatMessageListener, this);
  this.startHeartbeat();
  this.stopReconnect();
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.connectCloseListener = function (e) {
  this.stopHeartbeat();

  var numAttempts = this.orbiter.getConnectionManager().getConnectAttemptCount();
  if (numAttempts == 0) {
    this.selectReconnectFrequency();
  }

  if (this.autoReconnectFrequency > -1) {
    if (this.autoReconnectTimeoutID != -1) {
      return;
    } else {
      // Defer reconnection until after all other listeners have processed the
      // CLOSE event
      var self = this;
      setTimeout(function () {
        // If another listener disposed of Orbiter, or disabled autoreconnect, quit
        if (!self.disposed && self.autoReconnectFrequency != -1) {
          self.log.warn("[CONNECTION_MONITOR] Disconnection detected.");
          if (self.autoReconnectDelayFirstAttempt
              && (
                  (numAttempts == 0)
                  ||
                  (numAttempts == 1 && self.orbiter.getConnectionManager().getReadyCount() == 0)
                 )
             ) {
            self.log.info("[CONNECTION_MONITOR] Delaying reconnection attempt"
              + " by " + self.autoReconnectFrequency + " ms...");
            self.scheduleReconnect(self.autoReconnectFrequency);
          } else {
            self.doReconnect();
          }
        }
      }, 1);
    }
  }
}
    
//==============================================================================
// HEARTBEAT
//==============================================================================

net.user1.orbiter.ConnectionMonitor.prototype.enableHeartbeat = function () {
  this.log.info("[CONNECTION_MONITOR] Heartbeat enabled.");
  this.heartbeatEnabled = true;
  this.startHeartbeat();
}

net.user1.orbiter.ConnectionMonitor.prototype.disableHeartbeat = function () {
  this.log.info("[CONNECTION_MONITOR] Heartbeat disabled.");
  this.heartbeatEnabled = false;
  this.stopHeartbeat();
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.startHeartbeat = function () {
  if (!this.heartbeatEnabled) {
    this.log.info("[CONNECTION_MONITOR] Heartbeat is currently disabled. Ignoring start request.");
    return;
  }
  
  this.stopHeartbeat();
  
  this.heartbeats = new net.user1.utils.UDictionary();
  
  var currentObj = this;
  var callback   = this.heartbeatTimerListener;
  this.heartbeatIntervalID = setInterval(function () {
    callback.call(currentObj);
  }, this.heartBeatFrequency);
  
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.stopHeartbeat = function () {
  clearInterval(this.heartbeatIntervalID);
  this.heartbeats = null;
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.heartbeatTimerListener = function () {
  if (!this.orbiter.isReady()) {
    this.log.info("[CONNECTION_MONITOR] Orbiter is not connected. Stopping heartbeat.");
    this.stopHeartbeat();
    return;
  }

  var timeSinceOldestHeartbeat;
  var now = new Date().getTime();
  
  this.heartbeats[this.heartbeatCounter] = now;
  this.orbiter.getMessageManager().sendUPC("u2",
                                 net.user1.orbiter.Messages.CLIENT_HEARTBEAT, 
                                 this.orbiter.getClientID(),
                                 "",
                                 this.heartbeatCounter);
  this.heartbeatCounter++;
  
  // Assign the oldest heartbeat
  if (net.user1.utils.ObjectUtil.length(this.heartbeats) == 1) {
    this.oldestHeartbeat = now;
  } else { 
    this.oldestHeartbeat = Number.MAX_VALUE;
    for (var p in this.heartbeats) {
      if (this.heartbeats[p] < this.oldestHeartbeat) {
        this.oldestHeartbeat = this.heartbeats[p];
      }
    }
  }
  // Close connection if too much time has passed since the last response
  timeSinceOldestHeartbeat = now - this.oldestHeartbeat;
  if (timeSinceOldestHeartbeat > this.connectionTimeout) {
    this.log.warn("[CONNECTION_MONITOR] No response from server in " + 
                  timeSinceOldestHeartbeat + "ms. Starting automatic disconnect.");
    this.orbiter.disconnect();
  }
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.heartbeatMessageListener = function (fromClientID, id) {
  var ping = new Date().getTime() - this.heartbeats[parseInt(id)];
  if (typeof this.orbiter.self().setAttribute === "undefined") {
    // OrbiterMicro
    this.orbiter.self().ping = ping;
    this.orbiter.getMessageManager().sendUPC("u3",
                                             this.orbiter.getClientID(),
                                             "",
                                             "_PING",
                                             ping.toString(),
                                             "",
                                             this.sharedPing ? "4" : "0");
  } else {
    // Orbiter
    this.orbiter.self().setAttribute("_PING",
                                     ping.toString(),
                                     null,
                                     this.sharedPing);
  }
  delete this.heartbeats[parseInt(id)];
}

//==============================================================================
// RECONNECTION
//==============================================================================
/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.reconnectTimerListener = function (e) {
  this.stopReconnect();
  if (this.orbiter.getConnectionManager().connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED) {
    this.doReconnect();
  }
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.stopReconnect = function () {
  clearTimeout(this.autoReconnectTimeoutID);
  this.autoReconnectTimeoutID = -1
}

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.scheduleReconnect = function (milliseconds) {
  // Reset the timer
  this.stopReconnect();
  var currentObj = this;
  var callback   = this.reconnectTimerListener;
  this.autoReconnectTimeoutID = setTimeout(function () {
    currentObj.autoReconnectTimeoutID = -1;
    callback.call(currentObj);
  }, milliseconds);
};

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.selectReconnectFrequency = function () {
  if (this.autoReconnectMinMS == -1) {
    this.autoReconnectFrequency = -1;
  } else if (this.autoReconnectMinMS == this.autoReconnectMaxMS) {
    this.autoReconnectFrequency = this.autoReconnectMinMS;
  } else {
    this.autoReconnectFrequency = getRandInt(this.autoReconnectMinMS, this.autoReconnectMaxMS);
    this.log.info("[CONNECTION_MONITOR] Random auto-reconnect frequency selected: [" +
                  this.autoReconnectFrequency + "] ms.");
  }

  function getRandInt (min, max) {
    return min + Math.floor(Math.random()*(max+1 - min));
  }
};

/** @private */
net.user1.orbiter.ConnectionMonitor.prototype.doReconnect = function () {
  var numActualAttempts = this.orbiter.getConnectionManager().getConnectAttemptCount();
  var numReconnectAttempts;

  if (this.orbiter.getConnectionManager().getReadyCount() == 0) {
    numReconnectAttempts = numActualAttempts - 1;
  } else {
    numReconnectAttempts = numActualAttempts;
  }

  if (this.autoReconnectAttemptLimit != -1
      && numReconnectAttempts > 0
      && numReconnectAttempts % (this.autoReconnectAttemptLimit) == 0) {
    this.log.warn("[CONNECTION_MONITOR] Automatic reconnect attempt limit reached."
                  + " No further automatic connection attempts will be made until"
                  + " the next manual connection attempt.");
    return;
  }

  this.scheduleReconnect(this.autoReconnectFrequency);

  this.log.warn("[CONNECTION_MONITOR] Attempting automatic reconnect. (Next attempt in "
                + this.autoReconnectFrequency + "ms.)");
  this.orbiter.connect();
}

//==============================================================================
// CONFIGURATION
//==============================================================================

net.user1.orbiter.ConnectionMonitor.prototype.restoreDefaults = function () {
  this.setAutoReconnectFrequency(net.user1.orbiter.ConnectionMonitor.DEFAULT_AUTORECONNECT_FREQUENCY);
  this.setAutoReconnectAttemptLimit(net.user1.orbiter.ConnectionMonitor.DEFAULT_AUTORECONNECT_ATTEMPT_LIMIT);
  this.setConnectionTimeout(net.user1.orbiter.ConnectionMonitor.DEFAULT_CONNECTION_TIMEOUT);
  this.setHeartbeatFrequency(net.user1.orbiter.ConnectionMonitor.DEFAULT_HEARTBEAT_FREQUENCY);
}

net.user1.orbiter.ConnectionMonitor.prototype.setHeartbeatFrequency = function (milliseconds) {
  if (milliseconds >= net.user1.orbiter.ConnectionMonitor.MIN_HEARTBEAT_FREQUENCY) {
    this.heartBeatFrequency = milliseconds;
    this.log.info("[CONNECTION_MONITOR] Heartbeat frequency set to " 
                  + milliseconds + " ms.");
    // Log a warning for low heartbeat frequencies...
    if (milliseconds >= net.user1.orbiter.ConnectionMonitor.MIN_HEARTBEAT_FREQUENCY && milliseconds < 1000) {
      this.log.info("[CONNECTION_MONITOR] HEARTBEAT FREQUENCY WARNING: " 
               + milliseconds + " ms. Current frequency will generate "
               + (Math.floor((1000/milliseconds)*10)/10) 
               + " messages per second per connected client.");
    }
    
    // If the connection is ready, then restart
    // the heartbeat when the heartbeat frequency changes.
    if (this.orbiter.isReady()) {
      this.startHeartbeat();
    }
  } else {
    this.log.warn("[CONNECTION_MONITOR] Invalid heartbeat frequency specified: " 
             + milliseconds + ". Frequency must be "
             + net.user1.orbiter.ConnectionMonitor.MIN_HEARTBEAT_FREQUENCY + " or greater.");
  }
}

net.user1.orbiter.ConnectionMonitor.prototype.getHeartbeatFrequency = function () {
  return this.heartBeatFrequency;
}

net.user1.orbiter.ConnectionMonitor.prototype.setAutoReconnectFrequency = function (minMS, maxMS, delayFirstAttempt) {
  maxMS = (typeof maxMS == "undefined") ? -1 : maxMS;
  delayFirstAttempt = (typeof delayFirstAttempt == "undefined") ? false : delayFirstAttempt;

  if (minMS == 0 || minMS < -1) {
    this.log.warn("[CONNECTION_MONITOR] Invalid auto-reconnect minMS specified: ["
      + minMS + "]. Value must not be zero or less than -1. Value adjusted"
      + " to [-1] (no reconnect).");
    minMS = -1;
  }
  if (minMS == -1) {
    this.stopReconnect();
  } else {
    if (maxMS == -1) {
      maxMS = minMS;
    }
    if (maxMS < minMS) {
      this.log.warn("[CONNECTION_MONITOR] Invalid auto-reconnect maxMS specified: ["
                    + maxMS + "]." + " Value of maxMS must be greater than or equal "
                    + "to minMS. Value adjusted to [" + minMS + "].");
      maxMS = minMS;
    }
  }

  this.autoReconnectDelayFirstAttempt = delayFirstAttempt;
  this.autoReconnectMinMS = minMS;
  this.autoReconnectMaxMS = maxMS;

  this.log.info("[CONNECTION_MONITOR] Assigning auto-reconnect frequency settings: [minMS: "
                + minMS + ", maxMS: " + maxMS + ", delayFirstAttempt: "
                + delayFirstAttempt.toString() + "].");
  if (minMS > 0 && minMS < 1000) {
    this.log.info("[CONNECTION_MONITOR] RECONNECT FREQUENCY WARNING: "
                  + minMS + " minMS specified. Current frequency will cause "
                  + (Math.floor((1000/minMS)*10)/10).toString()
                  + " reconnection attempts per second.");
  }
  this.selectReconnectFrequency();
}

net.user1.orbiter.ConnectionMonitor.prototype.getAutoReconnectFrequency = function () {
  return this.autoReconnectFrequency;
}

net.user1.orbiter.ConnectionMonitor.prototype.setAutoReconnectAttemptLimit = function (attempts) {
  if (attempts < -1 || attempts == 0) {
    this.log.warn("[CONNECTION_MONITOR] Invalid Auto-reconnect attempt limit specified: " 
             + attempts + ". Limit must -1 or greater than 1.");
    return;
  }
    
  this.autoReconnectAttemptLimit = attempts;
  
  if (attempts == -1) {
    this.log.info("[CONNECTION_MONITOR] Auto-reconnect attempt limit set to none."); 
  } else {
    this.log.info("[CONNECTION_MONITOR] Auto-reconnect attempt limit set to " 
                  + attempts + " attempt(s).");
  }
};
    
net.user1.orbiter.ConnectionMonitor.prototype.getAutoReconnectAttemptLimit = function () {
  return this.autoReconnectAttemptLimit;
}

net.user1.orbiter.ConnectionMonitor.prototype.setConnectionTimeout = function (milliseconds) {
  if (milliseconds > 0) {
    this.connectionTimeout = milliseconds;
    this.log.info("[CONNECTION_MONITOR] Connection timeout set to " 
                  + milliseconds + " ms.");
  } else {
    this.log.warn("[CONNECTION_MONITOR] Invalid connection timeout specified: " 
                             + milliseconds + ". Frequency must be greater " 
                             + "than zero.");
  }
}

net.user1.orbiter.ConnectionMonitor.prototype.getConnectionTimeout = function () {
  return this.connectionTimeout;
}

net.user1.orbiter.ConnectionMonitor.prototype.sharePing = function (share) {
  this.sharedPing = share;
}

net.user1.orbiter.ConnectionMonitor.prototype.isPingShared = function () {
  return this.sharedPing;
}

net.user1.orbiter.ConnectionMonitor.prototype.disableHeartbeatLogging = function () {
  this.log.addSuppressionTerm("<A>CLIENT_HEARTBEAT</A>");
  this.log.addSuppressionTerm("<A>_PING</A>");
  this.log.addSuppressionTerm("[_PING]");
  this.log.addSuppressionTerm("<![CDATA[_PING]]>");
}

net.user1.orbiter.ConnectionMonitor.prototype.enableHeartbeatLogging = function () {
  this.log.removeSuppressionTerm("<A>CLIENT_HEARTBEAT</A>");
  this.log.removeSuppressionTerm("<A>_PING</A>");
  this.log.removeSuppressionTerm("[_PING]");
  this.log.removeSuppressionTerm("<![CDATA[_PING]]>");
}

// =============================================================================
// DISPOSAL
// =============================================================================

net.user1.orbiter.ConnectionMonitor.prototype.dispose = function () {
  this.disposed = true;
  
  this.stopHeartbeat();
  this.stopReconnect();

  this.heartbeats = null;
  
  this.orbiter.removeEventListener(net.user1.orbiter.OrbiterEvent.READY, this.connectReadyListener, this);
  this.orbiter.removeEventListener(net.user1.orbiter.OrbiterEvent.CLOSE, this.connectCloseListener, this);
  this.orbiter = null;
  this.msgManager.removeMessageListener("u7", this.u7);
  this.msgManager(null);
  this.log = null;
};

















//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.OrbiterEvent = function (type, 
                                           serverUPCVersion,
                                           connectionRefusal) {
  net.user1.events.Event.call(this, type);

  this.serverUPCVersion = serverUPCVersion;
  this.connectionRefusal = connectionRefusal;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.OrbiterEvent, net.user1.events.Event);
 
//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @constant */
net.user1.orbiter.OrbiterEvent.READY = "READY";
/** @constant */
net.user1.orbiter.OrbiterEvent.CLOSE = "CLOSE";
/** @constant */
net.user1.orbiter.OrbiterEvent.PROTOCOL_INCOMPATIBLE = "PROTOCOL_INCOMPATIBLE";
/** @constant */
net.user1.orbiter.OrbiterEvent.CONNECT_REFUSED = "CONNECT_REFUSED";

//==============================================================================
// INSTANCE METHODS
//==============================================================================  
net.user1.orbiter.OrbiterEvent.prototype.getServerUPCVersion = function () {
  return this.serverUPCVersion;
}

net.user1.orbiter.OrbiterEvent.prototype.getConnectionRefusal = function () {
  return this.connectionRefusal;
}

net.user1.orbiter.OrbiterEvent.prototype.toString = function () {
  return "[object OrbiterEvent]";
}  

//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The Snapshot class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.SnapshotEvent.LOAD}</li>
<li class="fixedFont">{@link net.user1.orbiter.SnapshotEvent.STATUS}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.snapshot.Snapshot = function () {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
  this.method;
  this.args = new Array();
  this.hasStatus;
  this.statusReceived;
  this.loaded;
  this._updateInProgress;
  this._status;
  this.onLoad = function () {};
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.snapshot.Snapshot, net.user1.events.EventDispatcher);

//==============================================================================
// INSTANCE METHODS
//==============================================================================   
net.user1.orbiter.snapshot.Snapshot.prototype.updateInProgress = function () {
  return this._updateInProgress;
};
    
/**
 * @private
 */    
net.user1.orbiter.snapshot.Snapshot.prototype.setUpdateInProgress = function (value) {
  this._updateInProgress = value;
};
    
/**
 * @private
 */    
net.user1.orbiter.snapshot.Snapshot.prototype.dispatchLoaded = function () {
  this.dispatchEvent(new net.user1.orbiter.snapshot.SnapshotEvent(net.user1.orbiter.snapshot.SnapshotEvent.LOAD, this));
};
    
/**
 * @private
 */    
net.user1.orbiter.snapshot.Snapshot.prototype.dispatchStatus = function () {
  this.dispatchEvent(new net.user1.orbiter.snapshot.SnapshotEvent(net.user1.orbiter.snapshot.SnapshotEvent.STATUS, this));
};

net.user1.orbiter.snapshot.Snapshot.prototype.getStatus = function () {
  return this._status;
};

/**
 * @private
 */    
net.user1.orbiter.snapshot.Snapshot.prototype.setStatus = function (value) {
  this._status = value;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.events.Event
 */
net.user1.orbiter.snapshot.SnapshotEvent = function (type,
                                            snapshot) {
  net.user1.events.Event.call(this, type);
  this.snapshot = snapshot;
};
  
//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.SnapshotEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.snapshot.SnapshotEvent.LOAD = "LOAD";
/** @constant */
net.user1.orbiter.snapshot.SnapshotEvent.STATUS = "STATUS";

net.user1.orbiter.snapshot.SnapshotEvent.prototype.toString = function () {
  return "[object SnapshotEvent]";
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
  /**
   * @private 
   */  
net.user1.orbiter.SnapshotManager = function (messageManager) {
  this.messageManager = messageManager;
  this.pendingSnapshots = new Object();
  this.requestIDCounter = 0;
};
    
//==============================================================================
// UPDATE SNAPSHOT
//==============================================================================    
    
net.user1.orbiter.SnapshotManager.prototype.updateSnapshot = function (snapshot) {
  var args;
  if (snapshot != null) {
    if (!snapshot.updateInProgress()) {
      this.requestIDCounter++;
      snapshot.setUpdateInProgress(true);
      snapshot.loaded = false;
      snapshot.statusReceived = false;
      snapshot.setStatus(null);
      this.pendingSnapshots[this.requestIDCounter.toString()] = snapshot;
      args = snapshot.args.slice(0);
      args.unshift(this.requestIDCounter);
      args.unshift(snapshot.method);
      this.messageManager.sendUPC.apply(this.messageManager, args);
    }
  }
};

//==============================================================================
// RECEIVE SNAPSHOT RESULT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveSnapshotResult = function (requestID, status) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received snapshot result for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setStatus(status);
  this.setStatusReceived(snapshot, requestID);
};

//==============================================================================
// RECEIVE CLIENTCOUNT SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveClientCountSnapshot =  function (requestID,
                                                                                    numClients) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received client-count snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setCount(numClients);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE CLIENT SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveClientSnapshot = function (requestID, manifest) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received client snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setManifest(manifest);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE ACCOUNT SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveAccountSnapshot = function (requestID, manifest) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received account snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setManifest(manifest);
  this.setLoaded(snapshot, requestID);
}

//==============================================================================
// RECEIVE ROOMLIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveRoomListSnapshot = function (requestID,
                                                                                roomList, 
                                                                                qualifier,
                                                                                recursive) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received roomlist snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setRoomList(roomList);
  snapshot.setQualifier(qualifier == "" ? null : qualifier);
  snapshot.setRecursive(recursive);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE ROOM SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveRoomSnapshot = function (requestID, manifest) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received room snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setManifest(manifest);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE CLIENTLIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveClientListSnapshot = function (requestID, clientList) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received clientlist snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setClientList(clientList);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE ACCOUNTLIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveAccountListSnapshot = function (requestID, accountList) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received accountlist snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setAccountList(accountList);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE BANNEDLIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveBannedListSnapshot = function (requestID, bannedList) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received bannedlist snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setBannedList(bannedList);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE SERVERMODULELIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveServerModuleListSnapshot = function (requestID, moduleList) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received server module list snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setModuleList(moduleList);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE UPCSTATS SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveUPCStatsSnapshot = function (requestID, 
                                                                                totalUPCsProcessed,
                                                                                numUPCsInQueue,
                                                                                lastQueueWaitTime,
                                                                                longestUPCProcesses) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received UPC stats snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setTotalUPCsProcessed(totalUPCsProcessed);
  snapshot.setNumUPCsInQueue(numUPCsInQueue);
  snapshot.setLastQueueWaitTime(lastQueueWaitTime);
  snapshot.setLongestUPCProcesses(longestUPCProcesses);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// RECEIVE NODELIST SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveNodeListSnapshot = function (requestID, nodeList) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received server node list snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setNodeList(nodeList);
  this.setLoaded(snapshot, requestID);
};


//==============================================================================
// RECEIVE GATEWAYS SNAPSHOT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.receiveGatewaysSnapshot = function (requestID, gateways) {
  var snapshot = this.pendingSnapshots[requestID];
  if (snapshot == null) {
    throw new Error("[SNAPSHOT_MANAGER] Received gateways snapshot for unknown "
                    + "request ID: [" + requestID + "]");
  }
  snapshot.setGateways(gateways);
  this.setLoaded(snapshot, requestID);
};

//==============================================================================
// LOADED AND STATUS ASSIGNMENT
//==============================================================================    

net.user1.orbiter.SnapshotManager.prototype.setLoaded = function (snapshot, requestID) {
  snapshot.loaded = true;
  if (snapshot.hasStatus == false
      || (snapshot.hasStatus == true && snapshot.statusReceived)) {
    snapshot.setUpdateInProgress(false);
    delete this.pendingSnapshots[requestID];
  }
  
  if (snapshot.hasOwnProperty("onLoad")) {
    snapshot["onLoad"]();
  }
  snapshot.dispatchLoaded();
};
    
net.user1.orbiter.SnapshotManager.prototype.setStatusReceived = function (snapshot, requestID) {
  if (snapshot.loaded) {
    snapshot.setUpdateInProgress(false);
    delete this.pendingSnapshots[requestID];
  }
  snapshot.dispatchStatus();
};


















//==============================================================================
// BOOLEAN GROUP TYPE CONSTANTS
//==============================================================================
/** @class */
net.user1.orbiter.filters.BooleanGroupType = new Object();
/** @constant */
net.user1.orbiter.filters.BooleanGroupType.AND = "AND";
/** @constant */
net.user1.orbiter.filters.BooleanGroupType.OR = "OR";
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 */
net.user1.orbiter.filters.BooleanGroup = function (type) {
  this.type = type;
  this.comparisons = new Array();
};

net.user1.orbiter.filters.BooleanGroup.prototype.addComparison = function (comparison) {
  if (comparison == null) return;
  this.comparisons.push(comparison);
};

net.user1.orbiter.filters.BooleanGroup.prototype.toXMLString = function () {
  var s = type == net.user1.orbiter.filters.BooleanGroupType.AND ? "<and>\n" : "<or>\n";
  
  var comparison;
  for (var i = 0; i < this.comparisons.length; i++) {
    comparison = this.comparisons[i];
    s += comparison.toXMLString() + "\n";
  }
  s += this.type == net.user1.orbiter.filters.BooleanGroupType.AND ? "</and>" : "</or>";
  return s;
}
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.events.Event
 */
net.user1.orbiter.AccountEvent = function (type, 
                                           status,
                                           userID,
                                           clientID,
                                           role) {
  net.user1.events.Event.call(this, type);
  
  this.status = status;
  this.userID = userID;
  this.clientID = clientID;
  this.role = role;
  this.account = null;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.AccountEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.AccountEvent.LOGIN_RESULT = "LOGIN_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.LOGIN  = "LOGIN";
/** @constant */
net.user1.orbiter.AccountEvent.LOGOFF_RESULT = "LOGOFF_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.LOGOFF = "LOGOFF";
/** @constant */
net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT = "CHANGE_PASSWORD_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.CHANGE_PASSWORD = "CHANGE_PASSWORD";
/** @constant */
net.user1.orbiter.AccountEvent.OBSERVE = "OBSERVE";
/** @constant */
net.user1.orbiter.AccountEvent.STOP_OBSERVING = "STOP_OBSERVING";
/** @constant */
net.user1.orbiter.AccountEvent.OBSERVE_RESULT = "OBSERVE_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT = "STOP_OBSERVING_RESULT";    
/** @constant */
net.user1.orbiter.AccountEvent.ADD_ROLE_RESULT = "ADD_ROLE_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.REMOVE_ROLE_RESULT = "REMOVE_ROLE_RESULT";
/** @constant */
net.user1.orbiter.AccountEvent.SYNCHRONIZE = "SYNCHRONIZE";

  
//==============================================================================
// INSTANCE METHODS
//==============================================================================    
net.user1.orbiter.AccountEvent.prototype.getAccount = function () {
  if (this.target instanceof net.user1.orbiter.AccountManager) {
    return this.account;
  } else if (this.target instanceof net.user1.orbiter.UserAccount) {
    return this.target;
  } else {
    throw new Error("[AccountEvent] Unexpected target type: " + this.target);
  }
};

/**
 * @private
 */    
net.user1.orbiter.AccountEvent.prototype.setAccount = function (value) {
  this.account = value;
};

net.user1.orbiter.AccountEvent.prototype.getUserID = function () {
  return this.userID;
};

net.user1.orbiter.AccountEvent.prototype.getRole = function () {
  return this.role;
};

net.user1.orbiter.AccountEvent.prototype.getClientID = function () {
  return this.clientID;
};

net.user1.orbiter.AccountEvent.prototype.getStatus = function () {
  return this.status;
};

net.user1.orbiter.AccountEvent.prototype.toString = function () {
  return "[object AccountEvent]";
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.AccountListSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.accountList = null;
  this.method = net.user1.orbiter.UPC.GET_ACCOUNTLIST_SNAPSHOT;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.AccountListSnapshot, net.user1.orbiter.snapshot.Snapshot);
    
//==============================================================================
// INSTANCE METHODS
//==============================================================================
/**
 * @private
 */    
net.user1.orbiter.snapshot.AccountListSnapshot.prototype.setAccountList = function (value) {
  this.accountList = value;
}

net.user1.orbiter.snapshot.AccountListSnapshot.prototype.getAccountList = function () {
  if (!this.accountList) {
    return null;
  }
  return this.accountList.slice();
}
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The AccountManager class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.CREATE_ACCOUNT_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.REMOVE_ACCOUNT_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.ACCOUNT_ADDED}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.ACCOUNT_REMOVED}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGOFF_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGOFF}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGIN_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGIN}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.CHANGE_PASSWORD}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.OBSERVE}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.STOP_OBSERVING}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.STOP_WATCHING_FOR_ACCOUNTS_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.WATCH_FOR_ACCOUNTS_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.OBSERVE_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountManagerEvent.SYNCHRONIZE}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.ADD_ROLE_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.AccountEvent.REMOVE_ROLE_RESULT}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.AccountManager = function (log) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
  
  this.watchedAccounts   = new net.user1.orbiter.AccountSet();
  this.observedAccounts  = new net.user1.orbiter.AccountSet();
  this.accountCache      = new net.user1.utils.LRUCache(10000);
  this.log               = log;
  this._isWatchingForAccounts = false;
  this.accountCache;
  this.messageManager;
  this.clientManager;
  this.roomManager;
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.AccountManager, net.user1.events.EventDispatcher);

// =============================================================================
// DEPENDENCIES
// =============================================================================
    /**
     * @private
     */    
net.user1.orbiter.AccountManager.prototype.setMessageManager = function (value) {
  this.messageManager = value;
}

/**
 * @private
 */    
net.user1.orbiter.AccountManager.prototype.setClientManager = function (value) {
  this.clientManager = value;
}

/**
 * @private
 */    
net.user1.orbiter.AccountManager.prototype.setRoomManager = function (value) {
  this.roomManager = value;
}
    
// =============================================================================
// REMOTE ACCOUNT CREATION/REMOVAL
// =============================================================================
    
net.user1.orbiter.AccountManager.prototype.createAccount = function (userID, password) {
  if (userID == null || userID == "") {
    this.log.warn("[ACCOUNT_MANAGER] Create account failed. No userID supplied.");
  } else if (password == null) {
    this.log.warn("[ACCOUNT_MANAGER] Create account failed. No password supplied.");
  } else {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.CREATE_ACCOUNT, userID, password);
  }
};
    
net.user1.orbiter.AccountManager.prototype.removeAccount = function (userID, password) {
  if (userID == null || userID == "") {
    this.log.warn("[ACCOUNT_MANAGER] Remove account failed. No userID supplied.");
  } else {
    if (password == null) {
      this.log.warn("[ACCOUNT_MANAGER] Remove account: no password supplied." +
                            " Removal will fail unless sender is an administrator.");
    } 
    this.messageManager.sendUPC(net.user1.orbiter.UPC.REMOVE_ACCOUNT, userID, password);
  }
}  
    
// =============================================================================
// CHANGE PASSWORD
// =============================================================================
    
net.user1.orbiter.AccountManager.prototype.changePassword = function (userID, newPassword, oldPassword) {
  if (userID == null || userID == "") {
    this.log.warn("[ACCOUNT_MANAGER] Change password failed. No userID supplied.");
  } else if (newPassword == null || newPassword == "") {
    this.log.warn("[ACCOUNT_MANAGER] Change password failed for account [" 
                          + userID + "]. No new password supplied.");
  } else {
    if (oldPassword == null || oldPassword == "") {
      this.log.warn("[ACCOUNT_MANAGER] Change account password for account ["
                            + userID + "]: no old password supplied."
                            + " Operation will fail unless sender is an administrator.");
      oldPassword = "";
    }
    this.messageManager.sendUPC(net.user1.orbiter.UPC.CHANGE_ACCOUNT_PASSWORD, userID, oldPassword, newPassword);
  }
};
    
// =============================================================================
// ADD/REMOVE ROLE
// =============================================================================
    
net.user1.orbiter.AccountManager.prototype.addRole = function (userID, role) {
  if (userID == null || userID == "") {
    this.log.warn("[ACCOUNT_MANAGER] Add role failed. No userID supplied.");
  } else if (role == null || role == "") {
    this.log.warn("[ACCOUNT_MANAGER] Add role failed for account [" 
                          + userID + "]. No role supplied.");
  } else {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.ADD_ROLE, userID, role);
  }
};
    
net.user1.orbiter.AccountManager.prototype.removeRole = function (userID, role) {
  if (userID == null || userID == "") {
    this.log.warn("[ACCOUNT_MANAGER] Remove role failed. No userID supplied.");
  } else if (role == null || role == "") {
    this.log.warn("[ACCOUNT_MANAGER] Remove role failed for account [" 
                          + userID + "]. No role supplied.");
  } else {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.REMOVE_ROLE, userID, role);
  }
};
    
// =============================================================================
// LOCAL ACCOUNT CREATION/REMOVAL
// =============================================================================
    
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.requestAccount = function (userID) {
  var account;
  
  if (userID == null || userID == "") {
    return null;
  } else {
    account = this.getAccount(userID);
    if (account == null) {
      account = new net.user1.orbiter.UserAccount(userID, this.log, this, this.clientManager, this.roomManager);
      account.setAttributeManager(new net.user1.orbiter.AttributeManager(account, this.messageManager, this.log));
      this.accountCache.put(userID, account);
    }
    return account;
  }
};
    
/**
 * @private
 */            
net.user1.orbiter.AccountManager.prototype.deserializeWatchedAccounts = function (ids) {
  var idList = ids.split(Tokens.RS);
  var idHash = new net.user1.utils.UDictionary();
  var len = idList.length;
  
  // Generate a hash of clientID keys to dummy values for quick lookup
  for (var i = len; --i >= 0;) {
    idHash[idList[i]] = 1; 
  }
  
  // Remove all local accounts that are not in the new list from the server
  var accountStillExists;
  for (var accountID in watchedAccounts.getAll()) {
    if (!idHash.hasOwnProperty(accountID)) {
      removeWatchedAccount(accountID);
    }
  }
      
  // Add accounts from the new list that are not known locally. Do not add
  // clients for the accounts because "watch for accounts" does not
  // include client knowledge.
  if (ids != "") {  // Empty string means no accounts are on the server
    for (accountID in idHash) {
      if (accountID != "") {
        if (!this.watchedAccounts.containsUserID(accountID)) { 
          this.addWatchedAccount(this.requestAccount(accountID));
        }
      } else {
        throw new Error("[CORE_MESSAGE_LISTENER] Received empty account id in user list (u127).");
      }
    }
  }
  
  this.fireSynchronize();
};
    
// =============================================================================
// OBSERVED ACCOUNTS
// =============================================================================
    
net.user1.orbiter.AccountManager.prototype.observeAccount = function (userID) {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.OBSERVE_ACCOUNT, userID);
};      
    
// This method is internal because the developer is expected to access
// stopObserving() through the UserAccount directly. AccountManager's 
// observeAccount() exists only to allow developers to observe a
// user that is currently unknown.
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.stopObservingAccount = function (userID) {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_OBSERVING_ACCOUNT, userID);
};      
    
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.addObservedAccount = function (account) {
  this.observedAccounts.add(account);
  this.fireObserveAccount(account.getUserID());
}
    
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.removeObservedAccount = function (userID) {
  var account = this.observedAccounts.removeByUserID(userID);
  this.fireStopObservingAccount(userID);
  return account;
}
    
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.removeAllObservedAccounts = function () {
  this.observedAccounts.removeAll();
}

net.user1.orbiter.AccountManager.prototype.isObservingAccount = function (userID) {
  return this.observedAccounts.containsUserID(userID);
}
    
//==============================================================================
// WATCH FOR ACCOUNTS
//==============================================================================

net.user1.orbiter.AccountManager.prototype.watchForAccounts = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.WATCH_FOR_ACCOUNTS);
}      

net.user1.orbiter.AccountManager.prototype.stopWatchingForAccounts = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_WATCHING_FOR_ACCOUNTS_RESULT);
}      

net.user1.orbiter.AccountManager.prototype.isWatchingForAccounts = function () {
  return this._isWatchingForAccounts;
}
    
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.setIsWatchingForAccounts = function (value) {
  this._isWatchingForAccounts = value;
}

/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.addWatchedAccount = function (account) {
  this.watchedAccounts.add(account);
  this.fireAccountAdded(account.getUserID(), account);
}

/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.removeWatchedAccount = function (userID) {
  return this.watchedAccounts.removeByUserID(userID);
}

/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.removeAllWatchedAccounts = function () {
  this.watchedAccounts.removeAll();
}

net.user1.orbiter.AccountManager.prototype.hasWatchedAccount = function (userID) {
  return this.watchedAccounts.containsUserID(userID);
}
    
// =============================================================================
// CLIENT ACCESS
// =============================================================================
        
/**
 * @private
 */        
net.user1.orbiter.AccountManager.prototype.getClientsForObservedAccounts = function () {
  var clients = new Object();
  var client;
  
  var accounts = this.observedAccounts.getAll();
  var account;
  for (var userID in accounts) {
    account = accounts[userID];
    client = account.getInternalClient();
    if (client != null) {
      clients[client.getClientID()] = client;
    }
  }
  
  return clients;
}
    
// =============================================================================
// LOCAL ACCOUNT ACCESS
// =============================================================================
    
net.user1.orbiter.AccountManager.prototype.getAccount = function (userID) {
  // Look in account cache
  var account = this.accountCache.get(userID);
  if (account) {
    return account;
  }
  
  // Look in observed accounts
  account = this.observedAccounts.getByUserID(userID);
  if (account) {
    return account;
  }
  
  // Look in watched accounts
  account = this.watchedAccounts.getByUserID(userID);
  if (account) {
    return account;
  }

  // Look in connected accounts
  var connectedAccounts = new Object();
  var clients = this.clientManager.getInternalClients();
  var client;
  for (var clientID in clients) {
    account = clients[clientID].getAccount();
    if (account != null && account.getUserID() == userID) {
      return account;
    }
  }
  
  return null;
};
    
net.user1.orbiter.AccountManager.prototype.selfAccount = function () {
  return this.clientManager.self().getAccount();
};
    
net.user1.orbiter.AccountManager.prototype.getAccounts = function () {
  var connectedAccounts = new Object();
  var account;
  
  var clients = this.clientManager.getInternalClients();
  var client;
  for (var clientID in clients) {
    account = client.getAccount();
    if (account != null) {
      connectedAccounts[account.getUserID()] = account;
    }
  }
  
  return net.user1.utils.ObjectUtil.combine(connectedAccounts, this.observedAccounts.getAll(), this.watchedAccounts.getAll());
};
    
net.user1.orbiter.AccountManager.prototype.accountIsKnown = function (userID) {
  for (var knownUserID in this.getAccounts()) {
    if (knownUserID == userID) {
      return true;
    }
  }
  return false;
};
    
net.user1.orbiter.AccountManager.prototype.getNumAccounts = function () {
  return this.getAccounts().length;
};

net.user1.orbiter.AccountManager.prototype.getNumAccountsOnServer = function () {
  return this.watchedAccounts.length();
};
    
net.user1.orbiter.AccountManager.prototype.getNumLoggedInAccounts = function () {
  var count; 
  var account;
  var accounts = this.getAccounts();
  for (var userID in accounts) {
    account = accounts[userID];
    if (account.isLoggedIn()) {
      count++;
    }
  }
  return count;
};
    
// =============================================================================
// LOGIN/LOGOFF
// =============================================================================

net.user1.orbiter.AccountManager.prototype.login = function (userID, password) {
  if (this.clientManager.self().getConnectionState() == net.user1.orbiter.ConnectionState.LOGGED_IN) {
    this.log.warn("[ACCOUNT_MANAGER] User [" + userID + "]: Login attempt" 
             + " ignored. Already logged in. Current client must logoff before"
             + " logging in again.");
    this.fireLoginResult(userID, net.user1.orbiter.Status.ERROR);
  } else if (userID == null) { 
    this.log.warn("[ACCOUNT_MANAGER] Login attempt" 
                  + " failed. No userID supplied.");
  } else if (password == null) {
    this.log.warn("[ACCOUNT_MANAGER] Login attempt failed for user " 
                          + "[" + userID + "] failed. No password supplied.");
  } else {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.LOGIN, userID, password);
  }
};
    
net.user1.orbiter.AccountManager.prototype.logoff = function (userID, password) {
  if (userID == null) {
    // Current client
    if (this.clientManager.self().getConnectionState() != net.user1.orbiter.ConnectionState.LOGGED_IN) {
      this.log.warn("[ACCOUNT_MANAGER] Logoff failed. The current user is not logged in.");
    } else {
      this.clientManager.self().getAccount().logoff();
    }
  } else if (userID == "") {
    // Invalid client
    this.log.warn("[ACCOUNT_MANAGER] Logoff failed. Supplied userID must not be the empty string.");
  } else {
    // UserID supplied
    if (password == null || password == "") {
      if (this.clientManager.self().getConnectionState() != net.user1.orbiter.ConnectionState.LOGGED_IN) {
        this.log.warn("[ACCOUNT_MANAGER] Logoff: no password supplied." +
                      " Operation will fail unless sender is an administrator.");
      }
      password = "";
    }
    this.messageManager.sendUPC(net.user1.orbiter.UPC.LOGOFF, userID, password);
  }
}  
    
//==============================================================================
// EVENT DISPATCHING
//==============================================================================
    
/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireCreateAccountResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.CREATE_ACCOUNT_RESULT, 
                                  userID, this.getAccount(userID), status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireRemoveAccountResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.REMOVE_ACCOUNT_RESULT, 
                                  userID, this.getAccount(userID), status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireChangePasswordResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT, 
                           status, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireAccountAdded = function (userID, account) {
  this.dispatchEvent(new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.ACCOUNT_ADDED, 
                                       userID, account));
};   

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireAccountRemoved = function (userID, account) {
  this.dispatchEvent(new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.ACCOUNT_REMOVED, 
                         userID, account));
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireLogoffResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGOFF_RESULT, 
                           status, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};  

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireLogoff = function (account, clientID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGOFF,
                           net.user1.orbiter.Status.SUCCESS, account.getUserID(), clientID);
  e.setAccount(account);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireLoginResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGIN_RESULT,
                           status, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireLogin = function (account, clientID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGIN,
                                             net.user1.orbiter.Status.SUCCESS, account.getUserID(), clientID);
  e.setAccount(account);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireChangePassword = function (userID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD,
                                             net.user1.orbiter.Status.SUCCESS, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireObserveAccount = function (userID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.OBSERVE, 
                           null, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireStopObservingAccount = function (userID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.STOP_OBSERVING, 
                           null, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireStopWatchingForAccountsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.STOP_WATCHING_FOR_ACCOUNTS_RESULT, 
                     null, null, status));
}    

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireWatchForAccountsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.WATCH_FOR_ACCOUNTS_RESULT, 
                     null, null, status));
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireObserveAccountResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.OBSERVE_RESULT, 
                           status, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireStopObservingAccountResult = function (userID, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT, 
                           status, userID);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireAddRoleResult = function (userID, role, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.ADD_ROLE_RESULT, 
                           status, userID, null, role);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireRemoveRoleResult  = function (userID, role, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.REMOVE_ROLE_RESULT, 
                           status, userID, null, role);
  e.setAccount(this.getAccount(userID));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.AccountManager.prototype.fireSynchronize = function () {
  this.dispatchEvent(new net.user1.orbiter.AccountManagerEvent(net.user1.orbiter.AccountManagerEvent.SYNCHRONIZE));
}    
    
//==============================================================================
// CLEANUP AND DISPOSAL
//==============================================================================

/**
 * @private
 */    
net.user1.orbiter.AccountManager.prototype.cleanup = function () {
  this.log.info("[ACCOUNT_MANAGER] Cleaning resources.");
  this.removeAllObservedAccounts();
  this.removeAllWatchedAccounts();
  this.setIsWatchingForAccounts(false);
};
    
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.AccountManagerEvent = function (type, 
                                                  userID,
                                                  account,
                                                  status) {
  net.user1.events.Event.call(this, type);
  
  this.account = account;
  this.userID = userID;
  this.status = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.AccountManagerEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.AccountManagerEvent.CREATE_ACCOUNT_RESULT = "CREATE_ACCOUNT_RESULT";
/** @constant */
net.user1.orbiter.AccountManagerEvent.REMOVE_ACCOUNT_RESULT = "REMOVE_ACCOUNT_RESULT";
/** @constant */
net.user1.orbiter.AccountManagerEvent.ACCOUNT_ADDED = "ACCOUNT_ADDED";
/** @constant */
net.user1.orbiter.AccountManagerEvent.ACCOUNT_REMOVED = "ACCOUNT_REMOVED";    
/** @constant */
net.user1.orbiter.AccountManagerEvent.WATCH_FOR_ACCOUNTS_RESULT = "WATCH_FOR_ACCOUNTS_RESULT";
/** @constant */
net.user1.orbiter.AccountManagerEvent.STOP_WATCHING_FOR_ACCOUNTS_RESULT = "STOP_WATCHING_FOR_ACCOUNTS_RESULT";
/** @constant */
net.user1.orbiter.AccountManagerEvent.SYNCHRONIZE = "SYNCHRONIZE";    

//==============================================================================
// INSTANCE METHODS
//==============================================================================   
net.user1.orbiter.AccountManagerEvent.prototype.getStatus = function () {
  return this.status;
};
   
net.user1.orbiter.AccountManagerEvent.prototype.getUserID = function () {
  return this.userID;
};

net.user1.orbiter.AccountManagerEvent.prototype.getAccount = function () {
  return this.account;
};

net.user1.orbiter.AccountManagerEvent.prototype.toString = function () {
  return "[object AccountManagerEvent]";
};
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
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.AccountSnapshot = function (userID) {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.manifest = null;
  this.method = net.user1.orbiter.UPC.GET_ACCOUNT_SNAPSHOT;
  this.args   = [userID];
  this.hasStatus = true;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.AccountSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================
/**
 * @private
 */    
net.user1.orbiter.snapshot.AccountSnapshot.prototype.setManifest = function (value) {
  this.manifest = value;
};

net.user1.orbiter.snapshot.AccountSnapshot.prototype.getAttribute = function (name, scope) {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.persistentAttributes.getAttribute(name, scope);
};

net.user1.orbiter.snapshot.AccountSnapshot.prototype.getAttributes = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.persistentAttributes.getAll();
};

net.user1.orbiter.snapshot.AccountSnapshot.prototype.getUserID = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.userID;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.filters.BooleanGroup
 */
net.user1.orbiter.filters.AndGroup = function () {
  net.user1.orbiter.filters.BooleanGroup.call(this, net.user1.orbiter.filters.BooleanGroupType.AND);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.filters.AndGroup, net.user1.orbiter.filters.BooleanGroup);
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.filters.AndGroup
 */
net.user1.orbiter.filters.Filter = function (filterType) {
  net.user1.orbiter.filters.AndGroup.call(this);
  this.filterType = filterType;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.filters.Filter, net.user1.orbiter.filters.AndGroup);

net.user1.orbiter.filters.Filter.prototype.toXMLString = function () {
  var s = '<f t="' + this.filterType + '">\n';

  var comparison;
  for (var i = 0; i < this.comparisons.length; i++) {
    comparison = this.comparisons[i];
    s += comparison.toXMLString() + "\n";
  }
  s += '</f>';
  return s;      
};
net.user1.utils.ArrayUtil.combine = function () {
  var source = arguments.length == 1 ? arguments[0] : arguments;
  var master = [];
  
  var array;
  var element;
  for (var i = 0; i < source.length; i++) {
    array = source[i];
    if (net.user1.utils.ArrayUtil.isArray(array)) {
      for (var j = 0; j < array.length; j++) {
        element = array[j];
        if (net.user1.utils.ArrayUtil.indexOf(master, element) == -1) {
          master.push(element);
        }
      }
    }
  }
  return master;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 */
net.user1.orbiter.Attribute = function (name,
                                        value, 
                                        oldValue,
                                        scope,
                                        byClient) {
      /**
       * @field
       */
      this.name = name;
      /**
       * @field
       */
      this.value = value;
      /**
       * @field
       */
      this.oldValue = oldValue;
      /**
       * @field
       */
      this.scope = (scope == net.user1.orbiter.Tokens.GLOBAL_ATTR) || (scope == null) ? null : scope;
      /**
       * @field
       */
      this.byClient = byClient;
    }

net.user1.orbiter.Attribute.prototype.toString = function () {
  return "Attribute: " + (this.scope == null ? "" : this.scope + ".") + this.name + " = " + this.value + "." + " Old value: " + this.oldValue;
};
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
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 */
net.user1.orbiter.filters.AttributeComparison = function (name,
                                                          value,
                                                          compareType) {
  if (!net.user1.orbiter.Validator.isValidAttributeName(name)) {
    throw new Error("Invalid attribute name specified for AttributeComparison: "
                    + name);
  }                                           
  this.name = name;
  this.value = value;
  this.compareType = compareType;
};
    
net.user1.orbiter.filters.AttributeComparison.prototype.toXMLString = function () {
  return '<a c="' + this.compareType + '"><n><![CDATA[' + this.name + ']]></n><v><![CDATA[' + this.value.toString() + ']]></v></a>';
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.AttributeEvent = function (type, 
                                             changedAttr,
                                             status) {
  net.user1.events.Event.call(this, type);
  
  this.changedAttr = changedAttr;
  this.status = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.AttributeEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.AttributeEvent.UPDATE = "UPDATE";
/** @constant */
net.user1.orbiter.AttributeEvent.DELETE = "DELETE";
/** @constant */
net.user1.orbiter.AttributeEvent.DELETE_RESULT = "DELETE_RESULT";
/** @constant */
net.user1.orbiter.AttributeEvent.SET_RESULT = "SET_RESULT";

//==============================================================================
// INSTANCE METHODS
//==============================================================================   
net.user1.orbiter.AttributeEvent.prototype.getChangedAttr = function () {
  return this.changedAttr;
}

net.user1.orbiter.AttributeEvent.prototype.getStatus = function () {
  return this.status;
}

net.user1.orbiter.AttributeEvent.prototype.toString = function () {
  return "[object AttributeEvent]";
}  
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.filters.Filter
 */
net.user1.orbiter.filters.AttributeFilter = function () {
  net.user1.orbiter.filters.Filter.call(this, "A");
};


//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.filters.AttributeFilter, net.user1.orbiter.filters.Filter);
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
//==============================================================================
//  ATTRIBUTE_OPTIONS CONSTANTS
//==============================================================================
/** @class
    @private */
net.user1.orbiter.AttributeOptions = new Object();

/** @private */
net.user1.orbiter.AttributeOptions.FLAG_SHARED     = 1 << 2;
/** @private */
net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT = 1 << 3;
/** @private */
net.user1.orbiter.AttributeOptions.FLAG_IMMUTABLE  = 1 << 5;
/** @private */
net.user1.orbiter.AttributeOptions.FLAG_EVALUATE   = 1 << 8;
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.BannedListSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.bannedList = null;
  this.method = net.user1.orbiter.UPC.GET_BANNED_LIST_SNAPSHOT;
}

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.BannedListSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================
/**
 * @private
 */    
net.user1.orbiter.snapshot.BannedListSnapshot.prototype.setBannedList = function (value) {
  this.bannedList = value;
};

net.user1.orbiter.snapshot.BannedListSnapshot.prototype.getBannedList = function () {
  if (!this.bannedList) {
    return null;
  }
  return this.bannedList.slice();
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 */
net.user1.utils.CacheNode = function () {
  /** @field */
  this.next;
  /** @field */
  this.prev;
  /** @field */
  this.key;
  /** @field */
  this.value;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The Client class dispatches the following events:

<ul class="summary">
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.JOIN_ROOM}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.LEAVE_ROOM}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.OBSERVE_ROOM}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.STOP_OBSERVING_ROOM}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.OBSERVE}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.STOP_OBSERVING}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.OBSERVE_RESULT}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGIN}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGOFF}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.ClientEvent.SYNCHRONIZE}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.DELETE}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.UPDATE}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.SET_RESULT}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.DELETE_RESULT}</li> 
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.Client = function (clientID, 
                                     clientManager,
                                     messageManager,
                                     roomManager,
                                     connectionManager,
                                     server,
                                     log) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);

  this.clientID = "";
  this._isSelf = false;
  this.account = null;
  this.disposed = false;
  
  this.messageManager    = messageManager;
  this.clientManager     = clientManager;
  this.roomManager       = roomManager;
  this.connectionManager = connectionManager;
  this.server            = server;
  this.log               = log;
  this.occupiedRoomIDs   = new Array();
  this.observedRoomIDs   = new Array();
  this.customClients     = new Object();
  this.attributeManager  = new net.user1.orbiter.AttributeManager(this, this.messageManager, this.log);
  this.connectionState   = net.user1.orbiter.ConnectionState.UNKNOWN;

  this.setClientID(clientID);
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.Client, net.user1.events.EventDispatcher);
    
//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @private */    
net.user1.orbiter.Client.FLAG_ADMIN = 1 << 2;
    
// =============================================================================
// CLIENT ID
// =============================================================================
net.user1.orbiter.Client.prototype.getClientID = function () {
  return this.clientID;
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.setClientID = function (id) {
  if (this.clientID != id) {
    this.clientID = id;
  }
};

net.user1.orbiter.Client.prototype.isSelf = function () {
  return this._isSelf;
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.setIsSelf = function () {
  this._isSelf = true;
};

// =============================================================================
// CONNECTION STATUS
// =============================================================================

net.user1.orbiter.Client.prototype.getConnectionState = function () {
  if (this.isSelf()) {
    if (this.disposed
        || this.clientManager.getInternalClient(this.getClientID()) == null) {
      return net.user1.orbiter.ConnectionState.NOT_CONNECTED;
    } else {
      return this.account != null ? this.account.getConnectionState() : this.connectionManager.getConnectionState();
    }
  } else {
    if (this.connectionState != net.user1.orbiter.ConnectionState.UNKNOWN) {
      return this.connectionState;
    } else if (this.disposed
               || this.clientManager.getInternalClient(this.getClientID()) == null) {
      return net.user1.orbiter.ConnectionState.UNKNOWN;
    } else {
      return this.account != null ? this.account.getConnectionState() : net.user1.orbiter.ConnectionState.READY;
    }
  }
};

// Normally, this client's connection state is not assigned directly; it 
// it is deduced within getConnectionState(). But when Union
// sends a u103, we know that this client has definitely disconnected from 
// the server, and this client object will never be reused, so CoreMessageListener
// permanently assigns its connection state to NOT_CONNECTED.
net.user1.orbiter.Client.prototype.setConnectionState = function (newState) {
  this.connectionState = newState;
};

// =============================================================================
// ROLES
// =============================================================================
net.user1.orbiter.Client.prototype.isAdmin = function () {
  var rolesAttr = this.getAttribute(Tokens.ROLES_ATTR);
  var roles;
  if (rolesAttr != null) {
    return parseInt(rolesAttr) & net.user1.orbiter.Client.FLAG_ADMIN;
  } else {
    this.log.warn("[" + this.toString() + "] Could not determine admin status because the client is not synchronized.");
    return false;
  }
};

// =============================================================================
// OBSERVATION
// =============================================================================

net.user1.orbiter.Client.prototype.observe = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.OBSERVE_CLIENT, this.clientID);
};

net.user1.orbiter.Client.prototype.stopObserving = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_OBSERVING_CLIENT, this.clientID);
};

// =============================================================================
// KICK / BAN
// =============================================================================

net.user1.orbiter.Client.prototype.kick = function () {
  if (this.getClientID() == null) {
    this.log.warn(this + " Kick attempt failed. Client not currently connected.");
  }
  this.messageManager.sendUPC(net.user1.orbiter.UPC.KICK_CLIENT, getClientID());
};

net.user1.orbiter.Client.prototype.ban = function (duration, reason) {
  if (this.getClientID() == null) {
    this.log.warn(this + " Ban attempt failed. Client not currently connected.");
  }
  this.messageManager.sendUPC(net.user1.orbiter.UPC.BAN, null, getClientID(), duration.toString(), reason);
};

// =============================================================================
// CUSTOM CLASS MANAGEMENT
// =============================================================================

net.user1.orbiter.Client.prototype.setClientClass = function (scope, 
                                                              clientClass) {
  var fallbackClasses = Array.prototype.slice.call(arguments).slice(2);
  if (!this.isSelf()) {
    throw new Error("Custom client class assignment failed for : "
                    + clientClass + ". A custom" 
                    + " class can be set for the current client ("
                    + " i.e., ClientManager.self()) only.");
  }
  
  fallbackClasses.unshift(clientClass);
  var classList = fallbackClasses.join(" ");
  setAttribute(Tokens.CUSTOM_CLASS_ATTR, classList, scope);
};

/**
 * @private
 */    
net.user1.orbiter.Client.prototype.getCustomClient = function (scope) {
  var customClient;

  // If the custom client already exists for the specified scope, return it.
  customClient = this.customClients[scope];
  if (customClient != null) {
    return customClient;
  }
  
  // Look for a custom class for the given scope, and create a custom client
  if (scope == null) {
    return this.setGlobalCustomClient();
  } else {
    return this.setCustomClientForScope(scope);
  }
};

/**
 * @private
 */    
net.user1.orbiter.Client.prototype.setGlobalCustomClient = function () {
  var defaultClientClass;
  var globalDefaultClientClass;
  var customClient;
  
  // If this client has a default custom client class, use it
  defaultClientClass = this.getClientClass(null);
  if (defaultClientClass != null) {
    return this.createCustomClient(defaultClientClass, null);
  }          
  
  // No global class was set on the client, so check for a system-wide default
  globalDefaultClientClass = this.clientManager.getDefaultClientClass();
  if (globalDefaultClientClass == null) {
    // No global custom client class exists
    return null;
  } else {
    // Global default class exists
    return this.createCustomClient(globalDefaultClientClass, null);
  }
};

/**
 * @private
 */    
net.user1.orbiter.Client.prototype.setCustomClientForScope = function (scope) {
  var theRoom;
  var clientClass;
  var roomDefaultClientClass;
  var globalDefaultClientClass;
  
  // If this client has a default custom client class, use it
  clientClass = this.getClientClass(scope);
  if (clientClass != null) {
    return this.createCustomClient(clientClass, scope);
  }          
  
  // No class was set on the client for the scope, so check for a room default
  theRoom = this.roomManager.getRoom(scope);
  if (theRoom != null) {
    roomDefaultClientClass = theRoom.getDefaultClientClass();
    if (roomDefaultClientClass != null) {
      return this.createCustomClient(roomDefaultClientClass, scope);
    }
  }
  
  // No class was set on the room for the scope, so check for a system-wide default
  // If a custom global client already exists, return it.
  var customClient = this.customClients[null];
  if (customClient != null) {
    return customClient;
  } else {
    globalDefaultClientClass = this.clientManager.getDefaultClientClass();
    if (globalDefaultClientClass == null) {
      // No global custom client class exists
      return null;
    } else {
      // Global default class exists
      return this.createCustomClient(globalDefaultClientClass, null);
    }
  }
};

/**
 * @private
 */    
net.user1.orbiter.Client.prototype.getClientClass = function (scope) {
  var clientClassNames = this.getAttribute(net.user1.orbiter.Tokens.CUSTOM_CLASS_ATTR, scope);
  var clientClassList;

  // Convert the custom class names to an array for processing
  if (clientClassNames != null) {
    clientClassList = clientClassNames.split(" ");
  }

  // Search for a matching class definition. The first definition that's 
  // found is returned.
  var className;
  if (clientClassList != null) {
    for (var i = 0; i < clientClassList.length; i++) {
      try {
        var theClass = net.user1.utils.resolveMemberExpression(className);
        if (!theClass instanceof Function) {
          this.log.debug(this.toString() + ": Definition for client class [" + className + "] is not a constructor function.");
          continue;
        }
        return theClass;
      } catch (e) {
        this.log.debug(this.toString() + ": No definition found for client class [" + className + "]");
        continue;
      }
    }
  }
  return null;
};

/**
 * @private
 */    
net.user1.orbiter.Client.prototype.createCustomClient = function (wrapperClass, scope) {
  var customClient;

  // Wrap the client
  customClient = new wrapperClass();
  this.customClients[scope] = customClient;
  
  // Do custom client setup
  if (customClient instanceof CustomClient) {
    customClient.setClient(this);
    customClient.init();
    return customClient;
  } else {
    this.log.debug("[CLIENT_MANAGER] Custom client class [" + wrapperClass + "] does not "  
           + " extend CustomClient. Assuming specified class will manually "  
           + " compose its own Client instance for client ID: " + clientID
           + ". See Client.setClientClass()."); 
    return customClient;
  }
};

// =============================================================================
// ROOM MANAGEMENT
// =============================================================================
  
/**
 * @private
 */
net.user1.orbiter.Client.prototype.removeOccupiedRoomID = function (roomID) {
  if (this.isInRoom(roomID) && roomID != null) {
    this.occupiedRoomIDs.splice(net.user1.utils.ArrayUtil.indexOf(this.occupiedRoomIDs, roomID), 1);
    return true;
  } else {
    return false;
  }
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.removeObservedRoomID = function (roomID) {
  if (this.isObservingRoom(roomID) && roomID != null) {
    this.observedRoomIDs.splice(net.user1.utils.ArrayUtil.indexOf(this.observedRoomIDs, roomID), 1);
    return true;
  } else {
    return false;
  }
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.addOccupiedRoomID = function (roomID) {
  if (!this.isInRoom(roomID) && roomID != null) {
    this.log.info(this.toString() + " added occupied room ID [" + roomID + "].");
    this.occupiedRoomIDs.push(roomID);
  }
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.addObservedRoomID = function (roomID) {
  if (!this.isObservingRoom(roomID) && roomID != null) {
    this.log.info("Client [" + this.getClientID() + "] added observed room ID [" + roomID + "].");
    this.observedRoomIDs.push(roomID);
  }
};

net.user1.orbiter.Client.prototype.isInRoom = function (roomID) {
  return net.user1.utils.ArrayUtil.indexOf(this.getOccupiedRoomIDs(), roomID) != -1;
};

net.user1.orbiter.Client.prototype.isObservingRoom = function (roomID) {
  return net.user1.utils.ArrayUtil.indexOf(this.getObservedRoomIDs(), roomID) != -1;
};

net.user1.orbiter.Client.prototype.getOccupiedRoomIDs = function () {
  var ids;
  if (this.clientManager.isObservingClient(this.getClientID())) {
    // This client is under observation, so its occupiedRoomIDs array is
    // 100% accurate.
    return this.occupiedRoomIDs == null ? [] : this.occupiedRoomIDs.slice(0);
  } else {
    // This client is not under observation, so the current client can only
    // deduce this client's occupied room list based on its current sphere of awareness.
    ids = [];
    var knownRooms = this.roomManager.getRooms();
    var numKnownRooms = knownRooms.length;
    var room;
    for (var i = 0; i < numKnownRooms; i++) {
      room = knownRooms[i];
      if (room.clientIsInRoom(this.getClientID())) {
        ids.push(room.getRoomID());
      }
    }
    return ids;
  }
};

net.user1.orbiter.Client.prototype.getObservedRoomIDs = function () {
  var ids;
  if (this.clientManager.isObservingClient(this.getClientID())) {
    // This client is under observation, so its occupiedRoomIDs array is
    // 100% accurate.
    return this.observedRoomIDs == null ? [] : this.observedRoomIDs.slice(0);
  } else {
    // This client is not under observation, so the current client can only
    // deduce this client's occupied room list based on its current sphere of awareness.
    ids = [];
    var knownRooms = this.roomManager.getRooms();
    var numKnownRooms = knownRooms.length;
    var room;
    for (var i = 0; i < numKnownRooms; i++) {
      room = knownRooms[i];
      if (room.clientIsObservingRoom(this.getClientID())) {
        ids.push(room.getRoomID());
      }
    }
    return ids;
  }
};

net.user1.orbiter.Client.prototype.getUpdateLevels = function (roomID) {
  var levels;
  var levelsAttr = this.getAttribute("_UL", roomID);
  
  if (levelsAttr != null) {
    levels = new net.user1.orbiter.UpdateLevels();
    levels.fromInt(parseInt(levelsAttr));
    return levels;
  } else {
    return null;
  }
};

// =============================================================================
// BUILT-IN ATTRIBUTE RETRIEVAL
// =============================================================================

net.user1.orbiter.Client.prototype.getIP = function () {
  return this.getAttribute("_IP");
};

net.user1.orbiter.Client.prototype.getConnectTime = function () {
  var ct = this.getAttribute("_CT");
  return ct == null ? NaN : parseFloat(ct);
};

net.user1.orbiter.Client.prototype.getPing = function () {
  var ping = this.getAttribute("_PING");
  return ping == null ? -1 : parseInt(ping);
};

net.user1.orbiter.Client.prototype.getTimeOnline = function () {
  return this.server == null ? NaN : this.server.getServerTime() - this.getConnectTime();
};

// =============================================================================
// MESSAGING
// ============================================================================= 

net.user1.orbiter.Client.prototype.sendMessage = function (messageName) {
  if (this.clientManager == null) {
    return;
  }
  // Delegate to ClientManager
  var rest = Array.prototype.slice.call(arguments).slice(1);
  var args = [messageName, 
              [this.getClientID()],
              null];
  this.clientManager.sendMessage.apply(this.clientManager, args.concat(rest));
};

// =============================================================================
// ATTRIBUTES: PUBLIC API
// =============================================================================
net.user1.orbiter.Client.prototype.setAttribute = function (attrName, 
                                                            attrValue, 
                                                            attrScope, 
                                                            isShared, 
                                                            evaluate) {
  attrScope = attrScope == undefined ? null : attrScope;
  isShared = isShared == undefined ? true : isShared;
  evaluate = evaluate == undefined ? false : evaluate;

  // Create an integer to hold the attribute options.
  var attrOptions = (isShared     ? net.user1.orbiter.AttributeOptions.FLAG_SHARED     : 0) 
                    | (evaluate     ? net.user1.orbiter.AttributeOptions.FLAG_EVALUATE   : 0);
  // Make the SetClientAttr UPC first so inputs are validated
  var setClientAttr = new net.user1.orbiter.upc.SetClientAttr(attrName, attrValue, attrOptions, attrScope, this.getClientID());
  
  // Set the attribute locally now, unless:
  // -it is another client's attribute
  // -it is the current client's attribute, and the value has changed
  if (!(!this.isSelf() || evaluate)) {
    // Set the attribute locally
    this.attributeManager.setAttributeLocal(attrName, attrValue, attrScope, this);
  }

  // Set the attribute on the server.
  this.messageManager.sendUPCObject(setClientAttr);
};

net.user1.orbiter.Client.prototype.deleteAttribute = function (attrName, attrScope) {
  var deleteRequest = new net.user1.orbiter.upc.RemoveClientAttr(this.getClientID(), null, attrName, attrScope);
  this.attributeManager.deleteAttribute(deleteRequest);
};

net.user1.orbiter.Client.prototype.getAttribute = function (attrName, attrScope) {
  return this.attributeManager.getAttribute(attrName, attrScope);
};

net.user1.orbiter.Client.prototype.getAttributes = function () {
  return this.attributeManager.getAttributes();
};

net.user1.orbiter.Client.prototype.getAttributesByScope = function (scope) {
  return this.attributeManager.getAttributesByScope(scope);
};

// =============================================================================
// SYNCHRONIZATION
// =============================================================================
  
/**
 * @private
 */        
net.user1.orbiter.Client.prototype.synchronize = function (clientManifest) {
  var scopes;
  this.synchronizeOccupiedRoomIDs(clientManifest.occupiedRoomIDs);
  this.synchronizeObservedRoomIDs(clientManifest.observedRoomIDs);
  
  // Synchronize Client attributes
  scopes = clientManifest.transientAttributes.getScopes();
  for (var i = scopes.length; --i >= 0;) {
    this.attributeManager.getAttributeCollection().synchronizeScope(scopes[i], clientManifest.transientAttributes);
  }
  // Synchronize UserAccount attributes
  if (this.account != null) {
    scopes = clientManifest.persistentAttributes.getScopes();
    for (i = scopes.length; --i >= 0;) {
      this.account.getAttributeManager().getAttributeCollection().synchronizeScope(scopes[i], clientManifest.persistentAttributes);
    }
  }
};
    
/**
 * @private
 */        
net.user1.orbiter.Client.prototype.synchronizeOccupiedRoomIDs = function (newOccupiedRoomIDs) {
  if (newOccupiedRoomIDs == null) {
    // Nothing to synchronize
    return;
  }
  
  // Remove any rooms that are not in the new list
  var roomID;
  for (var i = this.occupiedRoomIDs.length; --i >= 0;) {
    roomID = this.occupiedRoomIDs[i];
    if (net.user1.utils.ArrayUtil.indexOf(newOccupiedRoomIDs, roomID) == -1) {
      this.removeOccupiedRoomID(roomID);
    }
  }
  
  // Add any rooms that are not in the old list (existing room IDs are ignored)
  for (i = newOccupiedRoomIDs.length; --i >= 0;) {
    roomID = newOccupiedRoomIDs[i];
    this.addOccupiedRoomID(roomID);
  }
};
    
/**
 * @private
 */        
net.user1.orbiter.Client.prototype.synchronizeObservedRoomIDs = function (newObservedRoomIDs) {
  if (newObservedRoomIDs == null) {
    // Nothing to synchronize
    return;
  }
  // Remove any rooms that are not in the new list
  var roomID;
  for (var i = this.observedRoomIDs.length; --i >= 0;) {
    roomID = this.observedRoomIDs[i];
    if (net.user1.utils.ArrayUtil.indexOf(newObservedRoomIDs, roomID) == -1) {
      this.removeObservedRoomID(roomID);
    }
  }
  
  // Add any rooms that are not in the old list (existing room IDs are ignored)
  for (i = newObservedRoomIDs.length; --i >= 0;) {
    roomID = newObservedRoomIDs[i];
    this.addObservedRoomID(roomID);
  }
};

// =============================================================================
// DEPENDENCIES
// =============================================================================

/**
 * @private
 */        
net.user1.orbiter.Client.prototype.getAttributeManager = function () {
  return this.attributeManager;
};

net.user1.orbiter.Client.prototype.getClientManager = function () {
  return this.clientManager;
};

net.user1.orbiter.Client.prototype.getAccount = function () {
  return this.account;
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.setAccount = function (value) {
  if (value == null) {
    this.account = null;
  } else {
    if (this.account != value) {
      this.account = value;
      this.account.setClient(this);
    }
  }
};

// =============================================================================
// TOSTRING
// =============================================================================

net.user1.orbiter.Client.prototype.toString = function () {
  return "[CLIENT clientID: " + this.getClientID() + ", userID: " + (this.account == null ? "" : this.account.getUserID())  + "]";
};

// =============================================================================
// EVENT DISPATCHING
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireJoinRoom = function (room, roomID) {
  this.log.debug(this + " triggering ClientEvent.JOIN_ROOM event.");
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.JOIN_ROOM,
                                            null, room, roomID, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireLeaveRoom = function (room, roomID) {
  this.log.debug(this + " triggering ClientEvent.LEAVE_ROOM event.");
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.LEAVE_ROOM,
                                            null, room, roomID, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireObserveRoom = function (room, roomID) {
  this.log.debug(this + " triggering ClientEvent.OBSERVE_ROOM event.");
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.OBSERVE_ROOM,
                                            null, room, roomID, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireStopObservingRoom = function (room, roomID) {
  this.log.debug(this + " triggering ClientEvent.STOP_OBSERVING_ROOM event.");
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.STOP_OBSERVING_ROOM,
                                            null, room, roomID, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireObserve = function () {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.OBSERVE, null, null, null, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireStopObserving = function () {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.STOP_OBSERVING, null, null, null, this);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireObserveResult = function (status) {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.OBSERVE_RESULT,
                                            null, null, null, this, status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireStopObservingResult = function (status) {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT,
                                            null, null, null, this, status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireLogin = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGIN,
                                             net.user1.orbiter.Status.SUCCESS, this.getAccount().getUserID(), this.getClientID());
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireLogoff = function (userID) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGOFF,
                                             net.user1.orbiter.Status.SUCCESS, userID, this.getClientID());
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Client.prototype.fireSynchronize = function () {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.SYNCHRONIZE, null, null, null, this);
  this.dispatchEvent(e);
};

// =============================================================================
// DISPOSAL
// =============================================================================

net.user1.orbiter.Client.prototype.dispose = function () {
  this.occupiedRoomIDs = null;
  this.attributeManager.dispose();
  this.attributeManager = null;
  this.clientID = null;
  this.log = null;
  this.account = null;
  this.customClients = null;
  this.messageManager = null;
  this.clientManager = null;
  this.roomManager = null;
  this.server = null;
  this.disposed = true;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.ClientCountSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.count = 0;
  this.method = net.user1.orbiter.UPC.GET_CLIENTCOUNT_SNAPSHOT;
  this.hasStatus = true;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.ClientCountSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================
/**
 * @private
 */    
net.user1.orbiter.snapshot.ClientCountSnapshot.prototype.setCount = function (value) {
  this.count = value;
};

net.user1.orbiter.snapshot.ClientCountSnapshot.prototype.getCount = function () {
  return this.count;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.ClientEvent = function (type,
                                          changedAttr,
                                          room,
                                          roomID,
                                          client,
                                          status,
                                          clientID) {
  net.user1.events.Event.call(this, type);
  
  this.changedAttr = changedAttr;
  this.room = room;
  this.roomID = roomID;
  this.client = client;
  this.status = status;
  this.clientID = clientID;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.ClientEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @constant */
net.user1.orbiter.ClientEvent.JOIN_ROOM = "JOIN_ROOM";
/** @constant */
net.user1.orbiter.ClientEvent.LEAVE_ROOM = "LEAVE_ROOM";
/** @constant */
net.user1.orbiter.ClientEvent.OBSERVE_ROOM = "OBSERVE_ROOM";
/** @constant */
net.user1.orbiter.ClientEvent.STOP_OBSERVING_ROOM = "STOP_OBSERVING_ROOM";
/** @constant */
net.user1.orbiter.ClientEvent.OBSERVE = "OBSERVE";
/** @constant */
net.user1.orbiter.ClientEvent.STOP_OBSERVING = "STOP_OBSERVING";
/** @constant */
net.user1.orbiter.ClientEvent.OBSERVE_RESULT = "OBSERVE_RESULT";
/** @constant */
net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT = "STOP_OBSERVING_RESULT";
/** @constant */
net.user1.orbiter.ClientEvent.SYNCHRONIZE = "SYNCHRONIZE";

net.user1.orbiter.ClientEvent.prototype.getClient = function () {
  return this.client;
};

net.user1.orbiter.ClientEvent.prototype.getClientID = function () {
  if (this.client != null) {
    return this.client.getClientID();
  } else {
    return this.clientID;
  }
};

net.user1.orbiter.ClientEvent.prototype.getRoom = function () {
  return this.room;
};

net.user1.orbiter.ClientEvent.prototype.getRoomID = function () {
  return this.roomID;
}

net.user1.orbiter.ClientEvent.prototype.getStatus = function () {
  return this.status;
};

net.user1.orbiter.ClientEvent.prototype.toString = function () {
  return "[object ClientEvent]";
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.ClientListSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.clientList;
  this.method = net.user1.orbiter.UPC.GET_CLIENTLIST_SNAPSHOT;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.ClientListSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================
/**
 * @private
 */          
net.user1.orbiter.snapshot.ClientListSnapshot.prototype.setClientList = function (value) {
  this.clientList = value;
};

net.user1.orbiter.snapshot.ClientListSnapshot.prototype.getClientList = function () {
  if (!this.clientList) {
    return null;
  }
  return this.clientList.slice();
}
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The ClientManager class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.CREATE_ACCOUNT_RESULT}</li>
  
<li class="fixedFont">{@link net.user1.orbiter.ClientEvent.OBSERVE}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientEvent.STOP_OBSERVING}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.CLIENT_CONNECTED}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.CLIENT_DISCONNECTED}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_CLIENTS_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.WATCH_FOR_CLIENTS_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientEvent.OBSERVE_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.KICK_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.BAN_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.UNBAN_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.WATCH_FOR_BANNED_ADDRESSES_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.ADDRESS_BANNED}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.ADDRESS_UNBANNED}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE_BANLIST}</li>
<li class="fixedFont">{@link net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/  
net.user1.orbiter.ClientManager = function (roomManager, 
                                            accountManager,
                                            connectionManager,
                                            messageManager,
                                            server,
                                            log) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
  
  this.selfReference = null;
  this.defaultClientClass = null;
  this.lifetimeClientsRequested = 0;
  
  this._isWatchingForClients;
  this._isWatchingForUsers;
  this._isWatchingForBannedAddresses;
  
  this.watchedClients  = new net.user1.orbiter.ClientSet();
  this.observedClients = new net.user1.orbiter.ClientSet();
  this.bannedAddresses = [];
  this.clientCache     = new net.user1.utils.LRUCache(5000);
  
  this.roomManager       = roomManager;
  this.accountManager    = accountManager;
  this.connectionManager = connectionManager;
  this.messageManager    = messageManager;
  this.server            = server;
  this.log               = log;
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.ClientManager, net.user1.events.EventDispatcher);

//==============================================================================
// CLIENT OBJECT CREATION AND ACCESS
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.requestClient = function (clientID) {
  var client;
  
  if (clientID == null || clientID === "") {
    throw new Error("[CLIENT_MANAGER] requestClient() called with empty clientID.");
  }
  
  client = this.getInternalClient(clientID);
  
  // If the client isn't already known
  if (client === null) {
    client = new net.user1.orbiter.Client(clientID, this, this.messageManager, this.roomManager, this.connectionManager, this.server, this.log);
    this.lifetimeClientsRequested++;
    this.clientCache.put(clientID, client);
  }

  return client;
}

net.user1.orbiter.ClientManager.prototype.getClient = function (clientID, scope) {
  var theClient;
  var theCustomClient;
  
  if (clientID === "" || clientID == null) {
    throw new Error("ClientManager.getClient() failed. Client ID must not be null or the" + 
                    " empty string.");
  }

  theClient = this.getInternalClient(clientID);
  if (theClient === null) {
    this.log.debug("[CLIENT_MANAGER] getClient() called for unknown client ID ["
              + clientID + "]."); 
    return null;
  } else {
    theCustomClient = theClient.getCustomClient(scope);
    return theCustomClient === null ? theClient : theCustomClient;
  }
};

net.user1.orbiter.ClientManager.prototype.getClients = function () {
  // Get all internal clients
  var clients = this.getInternalClients();
  var clientsList  = new Array();
  var customClient;
  
  // Replace internal clients with custom clients where available
  var client;
  for (var clientID in clients) {
    client = clients[clientID];
    customClient = client.getCustomClient(null);
    if (customClient != null) {
      clientsList.push(customClient);
    } else {
      clientsList.push(client);
    }
  }
  return clientsList;
}

net.user1.orbiter.ClientManager.prototype.getInternalClients = function () {
  var clients = net.user1.utils.ObjectUtil.combine(this.roomManager.getAllClients(),
                                                   this.accountManager.getClientsForObservedAccounts(),
                                                   this.observedClients.getAll(),
                                                   this.watchedClients.getAll());
  if (this.selfReference != null) {
    clients[this.selfReference.getClientID()] = this.selfReference;
  }
  return clients;
};

net.user1.orbiter.ClientManager.prototype.getInternalClient = function (clientID) {
  var theClient;
  
  // Error checking
  if (clientID === "" || clientID == null) {
    throw new Error("[CLIENT_MANAGER] this.getInternalClient() failed. Client ID must not be null or the" + 
                    " empty string.");
  }
  
  theClient = this.clientCache.get(clientID);
  
  if (theClient != null) {
    return theClient;
  } else {
    // Find the client...
    
    // Look in rooms
    var clients = this.roomManager.getAllClients(); 
    theClient = clients[clientID];
    if (theClient != null) {
      this.clientCache.put(clientID, theClient);
      return theClient;
    }
    
    // Look in observed accounts
    clients = this.accountManager.getClientsForObservedAccounts();
    theClient = clients[clientID];
    if (theClient != null) {
      this.clientCache.put(clientID, theClient);
      return theClient;
    }

    // Look in observed clients
    theClient = this.observedClients.getByClientID(clientID);
    if (theClient != null) {
      this.clientCache.put(clientID, theClient);
      return theClient;
    }

    // Look in watched clients
    theClient = this.watchedClients.getByClientID(clientID);
    if (theClient != null) {
      this.clientCache.put(clientID, theClient);
      return theClient;
    }
  }
  
  // Client not found
  return null;
}

net.user1.orbiter.ClientManager.prototype.getClientByUserID = function (userID, scope) {
  var theClient;
  var theCustomClient;
  var account;
  
  if (userID === "" || userID == null) {
    throw new Error("ClientManager.getClientByUserID() failed. User ID must not be null or the" + 
                    " empty string.");
  }

  // Search for the client in all known clients
  var client;
  var clients = this.getInternalClients();
  for (var clientID in clients) {
    client = clients[clientID];
    account = client.getAccount();
    if (account != null && account.getUserID() === userID) {
      theClient = client;
      break;
    }
  }
  
  if (theClient === null) {
    this.log.debug("[CLIENT_MANAGER] getClientByUserID() called for unknown user ID ["
              + userID + "]."); 
    return null;
  } else {
    theCustomClient = theClient.getCustomClient(scope);
    return theCustomClient === null ? theClient : theCustomClient;
  }
};

net.user1.orbiter.ClientManager.prototype.getClientByAttribute  = function (attributeName,
                                                                            attributeValue,
                                                                            attributeScope,
                                                                            roomScope) {
  var theCustomClient;
  
  // Validate
  if (attributeName == null || attributeName === "") {
    return null;
  }
  
  // Search for the client in all known clients
  var client;
  var clients = this.getInternalClients();
  for (var clientID in clients) {
    client = clients[clientID];
    if (client.getAttribute(attributeName, attributeScope)
        === attributeValue) {
      theCustomClient = client.getCustomClient(roomScope);
      return theCustomClient === null ? client : theCustomClient;
    }
  }
  return null;
};

net.user1.orbiter.ClientManager.prototype.clientIsKnown = function (clientID) {
  return this.getInternalClients()[clientID] !== null;
};

// =============================================================================
// WATCHED CLIENTS
// =============================================================================

net.user1.orbiter.ClientManager.prototype.watchForClients = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.WATCH_FOR_CLIENTS);
};   

net.user1.orbiter.ClientManager.prototype.stopWatchingForClients = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_WATCHING_FOR_CLIENTS);
};     

net.user1.orbiter.ClientManager.prototype.isWatchingForClients = function () {
  return this._isWatchingForClients;
};

net.user1.orbiter.ClientManager.prototype.hasWatchedClient = function (clientID) {
  return this.watchedClients.containsClientID(clientID);
};
    
/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.setIsWatchingForClients = function (value) {
  this._isWatchingForClients = value;
};
    
/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.addWatchedClient = function (client) {
  var customClient = client.getCustomClient(null);
  this.watchedClients.add(client);
  this.fireClientConnected(customClient === null ? client : customClient);      
};

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.removeWatchedClient = function (clientID) {
  this.watchedClients.removeByClientID(clientID);
};

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.removeAllWatchedClients = function () {
  this.watchedClients.removeAll();
};
    
/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.deserializeWatchedClients = function (ids) {
  var idList = ids.split(net.user1.orbiter.Tokens.RS);
  var idHash = new Object();
  var localClients = this.watchedClients.getAll();
  var len = idList.length;
  var theClient;
  var accountID;
  
  // Client list received, so set isWatchingForClients now, otherwise, code 
  // with side-effects may take action against the clients being added
   this.setIsWatchingForClients(true);
  
  // Generate a hash of clientID keys to accountID values
  for (var i = len-2; i >= 0; i-=2) {
    idHash[idList[i]] = idList[i+1]; 
  }
  
  // Remove all local clients that are not in the new list from the server
  var clientStillExists;
  for (var clientID in localClients) {
    if (!idHash.hasOwnProperty(clientID)) {
      // For best performance, use direct access rather than removeByClientID()
      delete localClients[clientID];
    }
  }      
  
  // Add all new clients that are not in the local set
  for (clientID in idHash) {
    if (clientID != "") {
      if (!this.watchedClients.containsClientID(clientID)) {
        theClient = this.requestClient(clientID);
        accountID = idHash[clientID]; 
        if (accountID != "") {
          theClient.setAccount(this.accountManager.requestAccount(accountID));
        }
        this.addWatchedClient(theClient);
      }
    } else {
      throw new Error("[CLIENT_MANAGER] Received empty client id in client list (u101).");
    }
  }
  
  this.fireSynchronize();
};

// =============================================================================
// OBSERVED CLIENTS
// =============================================================================

net.user1.orbiter.ClientManager.prototype.observeClient = function (clientID) {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.OBSERVE_CLIENT, clientID);
};      

net.user1.orbiter.ClientManager.prototype.isObservingClient = function (clientID) {
  return this.observedClients.containsClientID(clientID);
}

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.addObservedClient = function (client) {
  var customClient = client.getCustomClient(null);
  this.observedClients.add(client);
  this.fireObserveClient(customClient === null ? client : customClient);
};

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.removeObservedClient = function (clientID) {
  var client = this.observedClients.removeByClientID(clientID);
  var customClient;
  if (client != null) {
    customClient = client.getCustomClient(null);
    this.fireStopObservingClient(customClient === null ? client : customClient);
  }
};

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.removeAllObservedClients = function () {
  this.observedClients.removeAll();
};

//==============================================================================
// CLIENT ATTRIBUTE ACCESS
//==============================================================================

net.user1.orbiter.ClientManager.prototype.getAttributeForClients = function (clientIDs,
                                                                             attrName, 
                                                                             attrScope) {
  var clientAttributes = new Array();
  var thisClient;
  
  for (var i = 0; i < clientIDs.length; i++) {
    thisClient = this.getInternalClient(clientIDs[i]);
    if (thisClient != null) {
      clientAttributes.push({clientID: clientIDs[i],
          value: thisClient.getAttribute(attrName, attrScope)});
    } else {
      this.log.debug("[CLIENT_MANAGER] Attribute retrieval failed during "
                + " getAttributeForClients(). Unknown client ID [" + clientIDs[i] + "]");
    }
  }
  return clientAttributes;
};

//==============================================================================
// CUSTOM CLIENT MANAGEMENT
//==============================================================================

net.user1.orbiter.ClientManager.prototype.setDefaultClientClass = function (defaultClass) {
  this.defaultClientClass = defaultClass;
};

net.user1.orbiter.ClientManager.prototype.getDefaultClientClass = function () {
  return this.defaultClientClass;
};

//==============================================================================
// CURRENT CLIENT ASSIGNMENT AND ACCESS
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.self = function () {
  return this.selfReference;
}

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.setSelf = function (client) {
  this.selfReference = client;
  client.setIsSelf();
}

//==============================================================================
// CLIENT MESSAGING
//==============================================================================

net.user1.orbiter.ClientManager.prototype.sendMessage = function (messageName, 
                                                                  clientIDs,
                                                                  filters) {
  var rest = Array.prototype.slice.call(arguments).slice(3);
  
  // An array of arguments to send to the server.
  var args;

  // Can't continue without a valid methodName.
  if (messageName == null || messageName == "") {
    this.log.warn("[CLIENT_MANAGER] sendMessage() failed. No messageName supplied.");
    return;
  }
  
  // Send the UPC.
  args = [net.user1.orbiter.UPC.SEND_MESSAGE_TO_CLIENTS, 
          messageName, 
          clientIDs.join(net.user1.orbiter.Tokens.RS),
          filters != null ? filters.toXMLString() : ""];
  this.messageManager.sendUPC.apply(this.messageManager, args.concat(rest));
};

// =============================================================================
// BAN / UNBAN / KICK
// =============================================================================

net.user1.orbiter.ClientManager.prototype.ban = function (address, duration, reason) {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.BAN, address, null, duration.toString(), reason);
};

net.user1.orbiter.ClientManager.prototype.unban = function (address) {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.UNBAN, address);
};

net.user1.orbiter.ClientManager.prototype.kickClient = function (clientID) {
  if (clientID == null || clientID == "") {
    this.log.warn("[CLIENT_MANAGER] Kick attempt failed. No clientID supplied.");
  }
  this.messageManager.sendUPC(net.user1.orbiter.UPC.KICK_CLIENT, clientID);
}

// =============================================================================
// WATCH BANNED ADDRESSES
// =============================================================================

net.user1.orbiter.ClientManager.prototype.watchForBannedAddresses = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.WATCH_FOR_BANNED_ADDRESSES);
};

net.user1.orbiter.ClientManager.prototype.stopWatchingForBannedAddresses = function () {
  this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_WATCHING_FOR_BANNED_ADDRESSES);
};

/**
 * @private
 */  
net.user1.orbiter.ClientManager.prototype.setWatchedBannedAddresses = function (bannedList) {
  this.bannedAddresses = bannedList;
  this.fireSynchronizeBanlist();
};

/**
 * @private
 */  
net.user1.orbiter.ClientManager.prototype.addWatchedBannedAddress = function (address) {
  this.bannedAddresses.push(address);
  this.fireAddressBanned(address);
};

/**
 * @private
 */  
net.user1.orbiter.ClientManager.prototype.removeWatchedBannedAddress = function (address) {
  var idx = net.user1.util.ArrayUtil.indexOf(bannedAddresses, address);
  if (idx === -1) {
    this.log.warn("[CLIENT_MANAGER] Request to remove watched banned address failed."
             + " Address not found.");
  }
  this.bannedAddresses.splice(idx, 1);
  this.fireAddressUnbanned(address);
}

/**
 * @private
 */        
net.user1.orbiter.ClientManager.prototype.setIsWatchingForBannedAddresses = function (value) {
  this._isWatchingForBannedAddresses = value;
};

net.user1.orbiter.ClientManager.prototype.isWatchingForBannedAddresses = function () {
  return this._isWatchingForBannedAddresses;
};

net.user1.orbiter.ClientManager.prototype.getBannedAddresses = function () {
  return this.bannedAddresses.slice(0);
};

//==============================================================================
// STATISTICS
//==============================================================================

net.user1.orbiter.ClientManager.prototype.getLifetimeNumClientsKnown = function () {
  // -1 for each "ready" state the connection has achieved because we don't
  // count the current client ("self")
  return this.lifetimeClientsRequested-this.connectionManager.getReadyCount();
};

net.user1.orbiter.ClientManager.prototype.getNumClients = function () {
  return net.user1.utils.ObjectUtil.length(this.getInternalClients());
};

net.user1.orbiter.ClientManager.prototype.getNumClientsOnServer = function () {
  return this.watchedClients.length();
}

//==============================================================================
// EVENT DISPATCHING
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireObserveClient = function (client) {
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.OBSERVE, null, null, null, client);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireStopObservingClient = function (client) {
  var e = new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.STOP_OBSERVING, null, null, null, client);
  this.dispatchEvent(e);
}; 

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireClientConnected = function (client) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.CLIENT_CONNECTED, 
                                                              client.getClientID(), client));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireClientDisconnected = function (client) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.CLIENT_DISCONNECTED, 
                                                              client.getClientID(), client));
};   

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireStopWatchingForClientsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_CLIENTS_RESULT, 
                                                              null, null, null, status));
};   

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireWatchForClientsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.WATCH_FOR_CLIENTS_RESULT, 
                                                              null, null, null, status));
};   

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireObserveClientResult = function (clientID, status) {
  this.dispatchEvent(new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.OBSERVE_RESULT, 
                                       null, null, null, this.getClient(clientID), status, clientID));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireStopObservingClientResult = function (clientID, status) {
  this.dispatchEvent(new net.user1.orbiter.ClientEvent(net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT, 
                                                       null, null, null, this.getClient(clientID), status, clientID));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireKickClientResult = function (clientID, status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.KICK_RESULT, 
                                                              clientID, null, null, status));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireBanClientResult = function (address, clientID, status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.BAN_RESULT, 
                                                              clientID, null, address, status));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireUnbanClientResult = function (address, status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.UNBAN_RESULT, 
                                                              null, null, address, status));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireWatchForBannedAddressesResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.WATCH_FOR_BANNED_ADDRESSES_RESULT, 
                                                              null, null, null, status));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireStopWatchingForBannedAddressesResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT, 
                                                              null, null, null, status));
};    

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireAddressBanned = function (address) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.ADDRESS_BANNED, 
                                                              null, null, address));
}; 

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireAddressUnbanned = function (address) {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.ADDRESS_UNBANNED, 
                                                              null, null, address));
}; 

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireSynchronizeBanlist = function () {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE_BANLIST));
};        

/**
 * @private
 */
net.user1.orbiter.ClientManager.prototype.fireSynchronize = function () {
  this.dispatchEvent(new net.user1.orbiter.ClientManagerEvent(net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE));
};        

//==============================================================================
// CLEANUP AND DISPOSAL
//==============================================================================

/**
 * @private
 */    
net.user1.orbiter.ClientManager.prototype.cleanup = function () {
  this.log.info("[CLIENT_MANAGER] Cleaning resources.");
  this.selfReference = null;
  this.removeAllObservedClients();
  this.removeAllWatchedClients();
  this.setIsWatchingForClients(false);
};   

net.user1.orbiter.ClientManager.prototype.dispose = function () {
  this.log.info("[CLIENT_MANAGER] Disposing resources.");
  this.watchedClients = null;
  this.observedClients = null;
  this.defaultClientClass = null;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.ClientManagerEvent = function (type,
                                                 clientID,
                                                 client,
                                                 address,
                                                 status) {
  net.user1.events.Event.call(this, type);
  
  this.clientID = clientID;
  this.client   = client;
  this.address  = address;
  this.status   = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.ClientManagerEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @constant */
net.user1.orbiter.ClientManagerEvent.WATCH_FOR_CLIENTS_RESULT = "WATCH_FOR_CLIENTS_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_CLIENTS_RESULT = "STOP_WATCHING_FOR_CLIENTS_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.CLIENT_DISCONNECTED = "CLIENT_DISCONNECTED";
/** @constant */
net.user1.orbiter.ClientManagerEvent.CLIENT_CONNECTED = "CLIENT_CONNECTED";
/** @constant */
net.user1.orbiter.ClientManagerEvent.KICK_RESULT = "KICK_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.BAN_RESULT = "BAN_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.UNBAN_RESULT = "UNBAN_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.WATCH_FOR_BANNED_ADDRESSES_RESULT = "WATCH_FOR_BANNED_ADDRESSES_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT = "STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT";
/** @constant */
net.user1.orbiter.ClientManagerEvent.ADDRESS_BANNED = "ADDRESS_BANNED";
/** @constant */
net.user1.orbiter.ClientManagerEvent.ADDRESS_UNBANNED = "ADDRESS_UNBANNED";
/** @constant */
net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE_BANLIST = "SYNCHRONIZE_BANLIST"; 
/** @constant */
net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE = "SYNCHRONIZE"; 
    
net.user1.orbiter.ClientManagerEvent.prototype.getClientID = function () {
  return this.clientID;
};

net.user1.orbiter.ClientManagerEvent.prototype.getClient = function () {
  return this.client;
};

net.user1.orbiter.ClientManagerEvent.prototype.getAddress = function () {
  return this.address;
};

net.user1.orbiter.ClientManagerEvent.prototype.getStatus = function () {
  return this.status;
};

net.user1.orbiter.ClientManagerEvent.prototype.toString = function () {
  return "[object ClientManagerEvent]";
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
net.user1.orbiter.ClientManifest = function () {
  this.clientID = null;
  this.userID = null;
  this.persistentAttributes = new net.user1.orbiter.AttributeCollection();
  this.transientAttributes = new net.user1.orbiter.AttributeCollection();
  this.occupiedRoomIDs = null;
  this.observedRoomIDs = null;
};

/**
 * @private
 */        
net.user1.orbiter.ClientManifest.prototype.deserialize = function (clientID,
                                                                   userID,
                                                                   serializedOccupiedRoomIDs,
                                                                   serializedObservedRoomIDs,
                                                                   globalAttrs,
                                                                   roomAttrs) {
  this.clientID = clientID == "" ? null : clientID;
  this.userID   = userID == "" ? null : userID;
  
  // Room ids
  this.deserializeOccupiedRoomIDs(serializedOccupiedRoomIDs);
  this.deserializeObservedRoomIDs(serializedObservedRoomIDs);
  
  // Global attrs
  this.deserializeAttributesByScope(net.user1.orbiter.Tokens.GLOBAL_ATTR, globalAttrs);
  
  // Room attrs
  for (var i = 0; i < roomAttrs.length; i += 2) {
    this.deserializeAttributesByScope(roomAttrs[i], roomAttrs[i+1]);
  }
};
    
/**
 * @private
 */        
net.user1.orbiter.ClientManifest.prototype.deserializeOccupiedRoomIDs = function (roomIDs) {
  // No rooms included in the manifest
  if (roomIDs == null) {
    return;
  }
  // Client is in no rooms
  if (roomIDs == "") {
    this.occupiedRoomIDs = [];
    return;
  }
  // Client is in one or more room
  this.occupiedRoomIDs = roomIDs.split(net.user1.orbiter.Tokens.RS);
};
    
/**
 * @private
 */        
net.user1.orbiter.ClientManifest.prototype.deserializeObservedRoomIDs = function (roomIDs) {
  if (roomIDs == null) {
    return;
  }
  if (roomIDs == "") {
    this.observedRoomIDs = [];
    return;
  }
  this.observedRoomIDs = roomIDs.split(net.user1.orbiter.Tokens.RS);
};
     
/**
 * @private
 */         
net.user1.orbiter.ClientManifest.prototype.deserializeAttributesByScope = function (scope,
                                                                                    serializedAttributes) {
  var attrList;
  if (serializedAttributes == null || serializedAttributes == "") {
    return;
  }
  attrList = serializedAttributes.split(net.user1.orbiter.Tokens.RS);
  for (var i = attrList.length-3; i >= 0; i -=3) {
    if (parseInt(attrList[i+2]) & net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT) {
      // Persistent
      this.persistentAttributes.setAttribute(attrList[i], attrList[i+1], scope);
    } else {
      // Non-persistent
      this.transientAttributes.setAttribute(attrList[i], attrList[i+1], scope);
    }
  }
};
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
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.ClientSnapshot = function (clientID) {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.manifest = null;
  this.method = net.user1.orbiter.UPC.GET_CLIENT_SNAPSHOT;
  this.args   = [clientID];
  this.hasStatus = true;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.ClientSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================        
/**
 * @private
 */    
net.user1.orbiter.snapshot.ClientSnapshot.prototype.setManifest = function (value) {
  this.manifest = value;
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getAttribute = function (name, scope) {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.transientAttributes.getAttribute(name, scope);
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getAttributes = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.transientAttributes.getAll();
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getClientID = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.clientID;
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getUserID = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.userID;
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getOccupiedRoomIDs = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.occupiedRoomIDs.slice();
};

net.user1.orbiter.snapshot.ClientSnapshot.prototype.getObservedRoomIDs = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.observedRoomIDs.slice();
}
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @private
 */
net.user1.orbiter.CollectionEvent = function (type, item) {
  net.user1.events.Event.call(this, type);
  
  this.item = item;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.CollectionEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.CollectionEvent.REMOVE_ITEM = "REMOVE_ITEM";
/** @constant */
net.user1.orbiter.CollectionEvent.ADD_ITEM = "ADD_ITEM";
    
net.user1.orbiter.CollectionEvent.prototype.getItem = function () {
  return this.item;
};

net.user1.orbiter.CollectionEvent.prototype.toString = function () {
  return "[object CollectionEvent]";
};
//==============================================================================
// COMPARE TYPE CONSTANTS
//==============================================================================
/** @class */
net.user1.orbiter.filters.CompareType = new Object();
/** @constant */
net.user1.orbiter.filters.CompareType.EQUAL = "eq";
/** @constant */
net.user1.orbiter.filters.CompareType.NOT_EQUAL = "ne";
/** @constant */
net.user1.orbiter.filters.CompareType.GREATER_THAN = "gt";
/** @constant */
net.user1.orbiter.filters.CompareType.GREATER_THAN_OR_EQUAL = "ge";
/** @constant */
net.user1.orbiter.filters.CompareType.LESS_THAN = "lt";
/** @constant */
net.user1.orbiter.filters.CompareType.LESS_THAN_OR_EQUAL = "le";
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/**
* @private
*/
net.user1.orbiter.CoreEventLogger = function (log,
                                              connectionMan,
                                              roomMan,
                                              accountMan,
                                              server,
                                              clientMan,
                                              orbiter) {
  this.log = log;

  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.STOP_WATCHING_FOR_ROOMS_RESULT,
                           this.stopWatchingForRoomsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.WATCH_FOR_ROOMS_RESULT,
                           this.watchForRoomsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.CREATE_ROOM_RESULT,
                           this.createRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.REMOVE_ROOM_RESULT,
                           this.removeRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.ROOM_ADDED,
                           this.roomAddedListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.ROOM_REMOVED,
                           this.roomRemovedListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomManagerEvent.ROOM_COUNT,
                           this.roomCountListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomEvent.JOIN_RESULT,
                           this.joinRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomEvent.LEAVE_RESULT,
                           this.leaveRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomEvent.OBSERVE_RESULT,
                           this.observeRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  roomMan.addEventListener(net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT,
                           this.stopObservingRoomResultListener, this, net.user1.utils.integer.MAX_VALUE);
  
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.CREATE_ACCOUNT_RESULT, 
                              this.createAccountResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.REMOVE_ACCOUNT_RESULT,
                              this.removeAccountResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT,
                              this.changePasswordResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.ACCOUNT_ADDED,
                              this.accountAddedListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.ACCOUNT_REMOVED,
                              this.accountRemovedListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.LOGOFF_RESULT,
                              this.logoffResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.LOGOFF,
                              this.logoffListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.LOGIN_RESULT,
                              this.loginResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.LOGIN,
                              this.loginListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD,
                              this.changePasswordListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.OBSERVE,
                              this.observeAccountListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.STOP_OBSERVING,
                              this.stopObservingAccountListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.STOP_WATCHING_FOR_ACCOUNTS_RESULT,
                              this.stopWatchingForAccountsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.WATCH_FOR_ACCOUNTS_RESULT,
                              this.watchForAccountsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.OBSERVE_RESULT,
                              this.observeAccountResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT,
                              this.stopObservingAccountResultListener, this, net.user1.utils.integer.MAX_VALUE);
  accountMan.addEventListener(net.user1.orbiter.AccountManagerEvent.SYNCHRONIZE,
                              this.synchronizeAccountsListener, this, net.user1.utils.integer.MAX_VALUE);

  server.addEventListener(net.user1.orbiter.ServerEvent.TIME_SYNC, this.timeSyncListener, this, net.user1.utils.integer.MAX_VALUE);

  connectionMan.addEventListener(net.user1.orbiter.ConnectionManagerEvent.CONNECT_FAILURE,
                                 this.connectFailureListener, this, net.user1.utils.integer.MAX_VALUE);
  connectionMan.addEventListener(net.user1.orbiter.ConnectionManagerEvent.CLIENT_KILL_CONNECT,
                                 this.clientKillConnectListener, this, net.user1.utils.integer.MAX_VALUE);
  connectionMan.addEventListener(net.user1.orbiter.ConnectionManagerEvent.SERVER_KILL_CONNECT,
                                 this.serverKillConnectListener, this, net.user1.utils.integer.MAX_VALUE);
  
  clientMan.addEventListener(net.user1.orbiter.ClientEvent.OBSERVE,
                             this.observeClientListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientEvent.STOP_OBSERVING,
                             this.stopObservingClientListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.CLIENT_CONNECTED,
                             this.clientConnectedListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.CLIENT_DISCONNECTED,
                             this.clientDisconnectedListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_CLIENTS_RESULT,
                             this.stopWatchingForClientsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.WATCH_FOR_CLIENTS_RESULT,
                             this.watchForClientsResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientEvent.OBSERVE_RESULT,
                             this.observeClientResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientEvent.STOP_OBSERVING_RESULT,
                             this.stopObservingClientResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE,
                             this.synchronizeClientsListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.ADDRESS_BANNED,
                             this.addressBannedListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.ADDRESS_UNBANNED,
                             this.addressUnbannedListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT,
                             this.stopWatchingForBannedAddressesResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.WATCH_FOR_BANNED_ADDRESSES_RESULT,
                             this.watchForBannedAddressesResultListener, this, net.user1.utils.integer.MAX_VALUE);
  clientMan.addEventListener(net.user1.orbiter.ClientManagerEvent.SYNCHRONIZE_BANLIST,
                             this.synchronizeBanlistListener, this, net.user1.utils.integer.MAX_VALUE);
  
                           
  orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.READY, this.readyListener, this, net.user1.utils.integer.MAX_VALUE);
  orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.PROTOCOL_INCOMPATIBLE, this.protocolIncompatibleListener, this, net.user1.utils.integer.MAX_VALUE);
  orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.CONNECT_REFUSED, this.connectRefusedListener, this, net.user1.utils.integer.MAX_VALUE);
        
  this.log.addEventListener(net.user1.logger.LogEvent.LEVEL_CHANGE, this.logLevelChangeListener, this, net.user1.utils.integer.MAX_VALUE);
};    

        
// =============================================================================
// Logger EVENT LISTENERS
// =============================================================================
  
/**
 * @private
 */        
net.user1.orbiter.CoreEventLogger.prototype.logLevelChangeListener = function (e) {
  this.log.info("[LOGGER] Log level set to: [" + e.getLevel() + "].");
};

// =============================================================================
// Orbiter EVENT LISTENERS
// =============================================================================
  
/**
 * @private
 */        
net.user1.orbiter.CoreEventLogger.prototype.readyListener = function (e) {
  this.log.info("[ORBITER] Orbiter now connected and ready.");
};
  
/**
 * @private
 */        
net.user1.orbiter.CoreEventLogger.prototype.protocolIncompatibleListener = function (e) {
  this.log.warn("[ORBITER] Orbiter UPC protocol incompatibility detected. Client "
           + "UPC version: " + e.target.getSystem().getUPCVersion().toString()
           + ". Server version: " + e.getServerUPCVersion().toString() + ".");
};

/**
 * @private
 */        
net.user1.orbiter.CoreEventLogger.prototype.connectRefusedListener = function (e) {
  if (e.getConnectionRefusal().reason == net.user1.orbiter.ConnectionRefusalReason.BANNED) {
    this.log.warn("[ORBITER] Union Server refused the connection because the"
             + " client address is banned for the following reason: [" 
             + e.getConnectionRefusal().banReason + "]. The ban started at: ["
             + new Date(e.getConnectionRefusal().bannedAt) + "]. The ban duration is: ["
             + net.user1.utils.NumericFormatter.msToElapsedDayHrMinSec(e.getConnectionRefusal().banDuration*1000) + "].");
  } else {
    this.log.warn("[ORBITER] Union Server refused the connection. Reason: [" 
             + e.getConnectionRefusal().reason + "]. Description: ["
             + e.getConnectionRefusal().description + "].");
  }
}

// =============================================================================
// Server EVENT LISTENERS
// =============================================================================

net.user1.orbiter.CoreEventLogger.prototype.timeSyncListener = function (e) {
  this.log.info("[SERVER] Server time synchronized with client. Approximate time on " + 
      "server is now: " + new Date(e.target.getServerTime()));
};

// =============================================================================
// AccountManager EVENT LISTENERS 
// =============================================================================
net.user1.orbiter.CoreEventLogger.prototype.createAccountResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Result for createAccount(). Account: " 
           + e.getUserID() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.removeAccountResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Result for removeAccount(). Account: "
           + e.getUserID() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.changePasswordResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Result for changePassword(). Account: "
           + e.getUserID() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.accountAddedListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Account added: " + e.getAccount());
};

net.user1.orbiter.CoreEventLogger.prototype.accountRemovedListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Account removed: " + e.getAccount());
};

net.user1.orbiter.CoreEventLogger.prototype.logoffResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Result for logoff(). Account: "
           + e.getAccount() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.logoffListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Account logged off: " + e.getAccount());
};

net.user1.orbiter.CoreEventLogger.prototype.loginResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Result for login(). Account: "
           + e.getAccount() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.loginListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Account logged in: " + e.getAccount());
};

net.user1.orbiter.CoreEventLogger.prototype.changePasswordListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Password changed for account: " + e.getUserID());
};

net.user1.orbiter.CoreEventLogger.prototype.observeAccountListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Account observed: " + e.getAccount());
};

net.user1.orbiter.CoreEventLogger.prototype.stopObservingAccountListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] Stopped observing account: " + e.getUserID());
};

net.user1.orbiter.CoreEventLogger.prototype.stopWatchingForAccountsResultListener = function (e) {
  this.log.info("[SERVER] 'Stop watching for accounts' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.watchForAccountsResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] 'Watch for accounts' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.observeAccountResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] 'Observe account result' for account: "
           + e.getAccount() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.stopObservingAccountResultListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] 'Stop observing account result' for account: "
           + e.getUserID() + ", Status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.synchronizeAccountsListener = function (e) {
  this.log.info("[ACCOUNT_MANAGER] User account list synchronized with server.");
};

// =============================================================================
// CONNECTION EVENT LISTENERS
// =============================================================================

net.user1.orbiter.CoreEventLogger.prototype.connectFailureListener = function (e) {
  this.log.info("[CONNECTION_MANAGER] " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.serverKillConnectListener = function (e) {
  this.log.info("[CONNECTION_MANAGER] Server closed the connection.");
};

net.user1.orbiter.CoreEventLogger.prototype.clientKillConnectListener = function (e) {
  this.log.info("[CONNECTION_MANAGER] Connection to server closed by client.");
};

// =============================================================================
// RoomManager EVENT LISTENERS
// =============================================================================

net.user1.orbiter.CoreEventLogger.prototype.watchForRoomsResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] 'Watch for rooms' result for qualifier [" 
            + e.getRoomIdQualifier() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.stopWatchingForRoomsResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] 'Stop watching for rooms' result for"
            + " qualifier [" + e.getRoomIdQualifier() 
            + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.createRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Room creation result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.removeRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Room removal result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.roomAddedListener = function (e) {
  this.log.info("[ROOM_MANAGER] Room added: " + e.getRoom() + ".");
};

net.user1.orbiter.CoreEventLogger.prototype.roomRemovedListener = function (e) {
  this.log.info("[ROOM_MANAGER] Room removed: " + e.getRoom() + ".");
};

net.user1.orbiter.CoreEventLogger.prototype.roomCountListener = function (e) {
  this.log.info("[ROOM_MANAGER] New room count: " + e.getNumRooms() + ".");
};

net.user1.orbiter.CoreEventLogger.prototype.joinRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Join result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.leaveRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Leave result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.observeRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Observe result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.stopObservingRoomResultListener = function (e) {
  this.log.info("[ROOM_MANAGER] Stop observing result for room [" 
            + e.getRoomID() + "]: " + e.getStatus());
};

// =============================================================================
// ClientManager EVENT LISTENERS
// =============================================================================

net.user1.orbiter.CoreEventLogger.prototype.observeClientListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Client observed: " + e.getClient());
};

net.user1.orbiter.CoreEventLogger.prototype.stopObservingClientListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Stopped observing client: " + e.getClient());
};

net.user1.orbiter.CoreEventLogger.prototype.clientConnectedListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Foreign client connected. ClientID: [" + e.getClientID() 
           + "].");
};

net.user1.orbiter.CoreEventLogger.prototype.clientDisconnectedListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Foreign client disconnected. ClientID: [" + e.getClientID() 
           + "].");
};

net.user1.orbiter.CoreEventLogger.prototype.stopWatchingForClientsResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Stop watching for clients' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.watchForClientsResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Watch for clients' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.observeClientResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Observe client' result for client: " 
           + e.getClient() + ", status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.stopObservingClientResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Stop observing client' result for client: " 
           + e.getClient() + ", status: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.synchronizeClientsListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Client list synchronized with server.");
};

net.user1.orbiter.CoreEventLogger.prototype.addressBannedListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Client address banned: [" + e.getAddress() 
           + "].");
};

net.user1.orbiter.CoreEventLogger.prototype.addressUnbannedListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Client address unbanned. ClientID: [" + e.getAddress() 
           + "].");
};

net.user1.orbiter.CoreEventLogger.prototype.stopWatchingForBannedAddressesResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Stop watching for banned addresses' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.watchForBannedAddressesResultListener = function (e) {
  this.log.info("[CLIENT_MANAGER] 'Watch for banned addresses' result: " + e.getStatus());
};

net.user1.orbiter.CoreEventLogger.prototype.synchronizeBanlistListener = function (e) {
  this.log.info("[CLIENT_MANAGER] Banned list synchronized with server.");
};





//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * The CoreMessageListener class is an internal class that responds to the 
 * built-in UPC messages sent by the Union Server to the Orbiter. The 
 * CoreMessageListener class does not define any public methods or variables.
 * 
 * @private
 */
net.user1.orbiter.CoreMessageListener = function (orbiter) {
  /**
   * @type net.user1.orbiter.Orbiter
   */
  this.orbiter = orbiter;
  this.log = orbiter.getLog();      
  this.registerCoreListeners();
  this.orbiter.getConnectionManager().addEventListener(net.user1.orbiter.ConnectionManagerEvent.SELECT_CONNECTION, 
                                                       this.selectConnectionListener, this);

  this.roomMan = this.orbiter.getRoomManager();
  this.accountMan = this.orbiter.getAccountManager();
  this.clientMan = this.orbiter.getClientManager();
  this.snapshotMan = this.orbiter.getSnapshotManager();
};

//==============================================================================
// INSTANCE METHODS
//==============================================================================
net.user1.orbiter.CoreMessageListener.prototype.registerCoreListeners = function () {
  var msgMan = this.orbiter.getMessageManager();
  msgMan.addMessageListener(net.user1.orbiter.UPC.JOINED_ROOM, this.u6, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.RECEIVE_MESSAGE, this.u7, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_ATTR_UPDATE, this.u8, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_ATTR_UPDATE, this.u9, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_METADATA, this.u29, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CREATE_ROOM_RESULT, this.u32, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.REMOVE_ROOM_RESULT, this.u33, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENTCOUNT_SNAPSHOT, this.u34, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_ADDED_TO_ROOM, this.u36, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_REMOVED_FROM_ROOM, this.u37, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOMLIST_SNAPSHOT, this.u38, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_ADDED, this.u39, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_REMOVED, this.u40, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.WATCH_FOR_ROOMS_RESULT, this.u42, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_WATCHING_FOR_ROOMS_RESULT, this.u43, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LEFT_ROOM, this.u44, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CHANGE_ACCOUNT_PASSWORD_RESULT, this.u46, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CREATE_ACCOUNT_RESULT, this.u47, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.REMOVE_ACCOUNT_RESULT, this.u48, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LOGIN_RESULT, this.u49, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_SNAPSHOT, this.u54, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVED_ROOM, this.u59, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GET_ROOM_SNAPSHOT_RESULT, this.u60, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOPPED_OBSERVING_ROOM, this.u62, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.SERVER_HELLO, this.u66, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.JOIN_ROOM_RESULT, this.u72, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.SET_CLIENT_ATTR_RESULT, this.u73, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.SET_ROOM_ATTR_RESULT, this.u74, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GET_CLIENTCOUNT_SNAPSHOT_RESULT, this.u75, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LEAVE_ROOM_RESULT, this.u76, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVE_ROOM_RESULT, this.u77, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_OBSERVING_ROOM_RESULT, this.u78, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_ATTR_REMOVED, this.u79, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.REMOVE_ROOM_ATTR_RESULT, this.u80, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_ATTR_REMOVED, this.u81, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.REMOVE_CLIENT_ATTR_RESULT, this.u82, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.SESSION_TERMINATED, this.u84, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LOGOFF_RESULT, this.u87, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LOGGED_IN, this.u88, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.LOGGED_OFF, this.u89, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ACCOUNT_PASSWORD_CHANGED, this.u90, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENTLIST_SNAPSHOT, this.u101, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_ADDED_TO_SERVER, this.u102, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_REMOVED_FROM_SERVER, this.u103, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_SNAPSHOT, this.u104, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVE_CLIENT_RESULT, this.u105, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_OBSERVING_CLIENT_RESULT, this.u106, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.WATCH_FOR_CLIENTS_RESULT, this.u107, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_WATCHING_FOR_CLIENTS_RESULT, this.u108, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.WATCH_FOR_ACCOUNTS_RESULT, this.u109, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_WATCHING_FOR_ACCOUNTS_RESULT, this.u110, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ACCOUNT_ADDED, this.u111, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ACCOUNT_REMOVED, this.u112, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.JOINED_ROOM_ADDED_TO_CLIENT, this.u113, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.JOINED_ROOM_REMOVED_FROM_CLIENT, this.u114, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GET_CLIENT_SNAPSHOT_RESULT, this.u115, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GET_ACCOUNT_SNAPSHOT_RESULT, this.u116, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVED_ROOM_ADDED_TO_CLIENT, this.u117, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVED_ROOM_REMOVED_FROM_CLIENT, this.u118, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_OBSERVED, this.u119, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOPPED_OBSERVING_CLIENT, this.u120, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.OBSERVE_ACCOUNT_RESULT, this.u123, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ACCOUNT_OBSERVED, this.u124, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_OBSERVING_ACCOUNT_RESULT, this.u125, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOPPED_OBSERVING_ACCOUNT, this.u126, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ACCOUNT_LIST_UPDATE, this.u127, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.UPDATE_LEVELS_UPDATE, this.u128, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_OBSERVED_ROOM, this.u129, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.CLIENT_STOPPED_OBSERVING_ROOM, this.u130, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_OCCUPANTCOUNT_UPDATE, this.u131, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ROOM_OBSERVERCOUNT_UPDATE, this.u132, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.ADD_ROLE_RESULT, this.u134, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.REMOVE_ROLE_RESULT, this.u136, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.BAN_RESULT, this.u138, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.UNBAN_RESULT, this.u140, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.BANNED_LIST_SNAPSHOT, this.u142, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.WATCH_FOR_BANNED_ADDRESSES_RESULT, this.u144, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT, this.u146, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.BANNED_ADDRESS_ADDED, this.u147, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.BANNED_ADDRESS_REMOVED, this.u148, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.KICK_CLIENT_RESULT, this.u150, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.SERVERMODULELIST_SNAPSHOT, this.u152, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GET_UPC_STATS_SNAPSHOT_RESULT, this.u155, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.UPC_STATS_SNAPSHOT, this.u156, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.RESET_UPC_STATS_RESULT, this.u158, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.WATCH_FOR_PROCESSED_UPCS_RESULT, this.u160, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.PROCESSED_UPC_ADDED, this.u161, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT, this.u163, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.NODELIST_SNAPSHOT, this.u166, this);
  msgMan.addMessageListener(net.user1.orbiter.UPC.GATEWAYS_SNAPSHOT, this.u168, this);
}

net.user1.orbiter.CoreMessageListener.prototype.createHashFromArg = function (arg) {
  var list = arg.split(net.user1.orbiter.Tokens.RS);
  var hash = new Object();

  for (var i = 0; i < list.length; i += 2) {
    hash[list[i]] = list[i+1];
  }
  return hash;
};

net.user1.orbiter.CoreMessageListener.prototype.selectConnectionListener = function (e) {
  var msgMan = this.orbiter.getMessageManager();
  if (msgMan.removeListenersOnDisconnect) {
    this.registerCoreListeners();
  }
};
  
/**
 * Room joined.
 */
net.user1.orbiter.CoreMessageListener.prototype.u6 = function (roomID) {
  // Add the room to the occupied room list
  var room = this.roomMan.addOccupiedRoom(roomID);
  // Tell the room to do its join duties
  room.doJoin();
  // Fire JOIN through the client
  var selfClient = this.clientMan.self();
  if (selfClient) {
    selfClient.fireJoinRoom(room, roomID);
  }
};

/**
 * Handles sendMessage() calls sent by other clients.
 */
net.user1.orbiter.CoreMessageListener.prototype.u7 = function (message,
                                                               broadcastType,
                                                               fromClientID,
                                                               toRoomID) {
  var msgMan = this.orbiter.getMessageManager();
  var listenerError;
  var fromClient;
  var toRoom;
  var args;  // Args passed to the messsage listener
  var userDefinedArgs = Array.prototype.slice.call(arguments).slice(4);

  // Retrieve the Room object for the recipient room. 
  toRoom = this.roomMan.getRoom(toRoomID);
  
  // Retrieve the Client object for the sender
  if (fromClientID == "") {
    // No client ID was supplied, so the message was generated by the
    // server, not by a client, so set fromClient to null.
    fromClient = null;
  } else {
    // A valid ID was supplied, so find or create the matching IClient object
    fromClient = this.clientMan.getClient(fromClientID);
    fromClient = fromClient == null ? this.clientMan.requestClient(fromClientID) : fromClient;
  }

  // ===== To Clients, or To Server =====
  // If the message was sent to a specific client, a list of specific clients,
  // or to the whole server, then args passed to registered message listeners 
  // are: the Client object plus all user-defined arguments originally passed
  // to sendMessage().       
  if (broadcastType != net.user1.orbiter.ReceiveMessageBroadcastType.TO_ROOMS) {
    args = [fromClient].concat(userDefinedArgs);
    try {
      msgMan.notifyMessageListeners(message, args);
    } catch (e) {
      listenerError = e;
    }
  } else {
  
    // ===== To Rooms =====
    // Check if the room is valid
    if (toRoom == null) { 
      this.log.warn("Message (u7) received for unknown room: [" + toRoomID + "]"
        + "Message: [" + message + "]");
      return;
    }
  
    // RECEIVE_MESSAGE was a response to SEND_MESSAGE_TO_ROOMS, so 
    // we notify listeners only if they asked to be told about messages 
    // sent to the recipient room.

    // First, get the list of messsage listeners for this message
    var listeners = msgMan.getMessageListeners(message);

    // Split the recipient room ID into two parts
    var toRoomSimpleID  = net.user1.orbiter.RoomIDParser.getSimpleRoomID(toRoomID);
    var toRoomQualifier = net.user1.orbiter.RoomIDParser.getQualifier(toRoomID);

    // If the message can be dispatched, set to true.
    var listenerFound; 
    // If the listener isn't interested in messages sent to the 
    // recipient room, set to true.
    var listenerIgnoredMessage;
                                         
    // ===== Run once for each message listener =====
    var messageListener;
    for (var i = 0; i < listeners.length; i++) {
      messageListener = listeners[i];
      
      // Assume this listener ignored the message until we prove it didn't
      listenerIgnoredMessage = true;
      
      // --- Has no "forRoomIDs" filter ---
      // If the listener doesn't specify any forRoomIDs, then 
      // just send it the message notification. (No-rooms-specified
      // means the listener wants all of these messages, no matter
      // which room they were sent to.) This listener is told which 
      // room the message was sent to via args[1] (toRoomID).
      if (messageListener.getForRoomIDs() == null) {
        args = [fromClient, toRoom].concat(userDefinedArgs);
        try {
          messageListener.getListenerFunction().apply(messageListener.getThisArg(), args);
        } catch (e) {
          listenerError = e;
        }
        listenerFound = true;
        listenerIgnoredMessage = false;
        continue;  // Done with this listener. On to the next.
      }
      
      // --- Has a "forRoomIDs" filter ---
      // If the message was sent to any of the rooms the listener is 
      // interested in, then notify that listener. Note that a listener 
      // for messages sent to room foo.* means the listener wants 
      // notifications for all rooms whose ids start with foo.
      var listenerRoomIDs  = messageListener.getForRoomIDs();
      var listenerRoomQualifier;
      var listenerRoomSimpleID;
      // ===== Run once for each room id =====
      var listenerRoomIDString;
      for (var j = 0; j < listenerRoomIDs.length; j++) {
        listenerRoomIDString = listenerRoomIDs[j];
        // Split the room id
        listenerRoomQualifier = net.user1.orbiter.RoomIDParser.getQualifier(listenerRoomIDString);
        listenerRoomSimpleID  = net.user1.orbiter.RoomIDParser.getSimpleRoomID(listenerRoomIDString);

        // Check if the listener is interested in the recipient room...
        if (listenerRoomQualifier == toRoomQualifier
            && 
            (listenerRoomSimpleID == toRoomSimpleID
             || listenerRoomSimpleID == "*")) {
          // Found a match. Notify the listener...
            
          // Prepare args.
          if (listenerRoomIDs.length == 1) {
            // The listener is interested in messages sent to a 
            // specific room only, so omit the "toRoom" arg.
            // (The listener already knows the target room because 
            // it's only notified if the message was sent to that room.)
            args = [fromClient].concat(userDefinedArgs);
          } else {
            // The listener is interested in messages sent to 
            // multiple rooms. In this case, we have to 
            // include the "toRoom" arg so the listener knows 
            // which room received the message.
            args = [fromClient, toRoom].concat(userDefinedArgs);
          }
          
          try {
            messageListener.getListenerFunction().apply(messageListener.getThisArg(), args);
          } catch (e) {
            listenerError = e;
          }
          listenerFound = true;
          listenerIgnoredMessage = false;
          break; // Stop looking at this listener's room ids
        }
      } // Done looking at this listener's room ids
      if (listenerIgnoredMessage) {
        this.log.debug("Message listener ignored message: " + message + ". "
                       + "Listener registered to receive " 
                       + "messages sent to: " + messageListener.getForRoomIDs() 
                       + ", but message was sent to: " + toRoomID);
      }
    } 
    if (!listenerFound) {
      this.log.warn("No message listener handled incoming message: " 
                    + message + ", sent to: " + toRoomID);
    }
  } // Done looking at listeners for the incoming message
  
  if (listenerError != null) {
    throw new Error("A message listener for incoming message [" + message + "]" +
      (fromClient == null ? "" : ", received from client [" + fromClient.getClientID() + "],") + 
      " encountered an error:\n\n" + listenerError.toString() +
      "\n\nEnsure that all [" + message + "] listeners supply a first" +
      " parameter whose datatype is Client (or a compatible type). Listeners" +
      " that registered for the message via MessageManager's addMessageListener()" +
      " with anything other than a single roomID for the toRoomIDs parameter must" +
      " also define a second paramter whose" +
      " datatype is Room (or a compatible type). Finally, ensure that" +
      " the listener's declared message parameters match the following actual message" +
      " arguments:\n    " + userDefinedArgs
      + (typeof listenerError.stack === "undefined" ? "" : "\n\nStack trace follows:\n" + listenerError.stack)
      );
  }
}

/**
 * Client attribute update
 */
net.user1.orbiter.CoreMessageListener.prototype.u8 = function (attrScope,
                                                               clientID,
                                                               userID,
                                                               attrName,
                                                               attrVal,
                                                               attrOptions) { 
  var client;
  var account;
  var options = parseInt(attrOptions);
  
  if (options &net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT) {
    account = this.accountMan.getAccount(userID);
    if (account != null) {
      account.getAttributeManager().setAttributeLocal(attrName, attrVal, attrScope);
    } else {
      throw new Error("[CORE_MESSAGE_LISTENER] Received an attribute update for "
        + " an unknown user account [" + userID + "]. Please report this error with"
        + " the following log to union@user1.net.\n" 
        + this.log.getHistory().join("\n"));
    }
  } else {
    client = this.clientMan.getInternalClient(clientID);
    if (client != null) {
      client.getAttributeManager().setAttributeLocal(attrName, attrVal, attrScope);
    } else {
      throw new Error("[CORE_MESSAGE_LISTENER] Received an attribute update for "
        + " an unknown client [" + clientID + "]. Please report this error with"
        + " the following log to union@user1.net.\n" 
        + this.log.getHistory().join("\n"));
    }
  }
};

/**
 * Room attribute update
 */
net.user1.orbiter.CoreMessageListener.prototype.u9 = function (roomID, 
                                                               byClientID,
                                                               attrName,
                                                               attrVal) {
  var theRoom = this.roomMan.getRoom(roomID);
  var byClient;
  
  // Quit if the room isn't found
  if (theRoom == null) {
    this.log.warn("Room attribute update received for server-side room with no" + 
             " matching client-side Room object. Room ID [" +
             roomID + "]. Attribute: [" + attrName + "].");
    return;
  }

  // Retrieve the Client object for the sender
  if (byClientID == "") {
    // No client ID was supplied, so the message was generated by the
    // server, not by a client, so set fromClient to null.
    byClient = null;
  } else {
    // A valid ID was supplied, so find or create the matching IClient object
    byClient = this.clientMan.getClient(byClientID);
    byClient = byClient == null ? this.clientMan.requestClient(byClientID) : byClient;
  }

  theRoom.getAttributeManager().setAttributeLocal(attrName, attrVal, net.user1.orbiter.Tokens.GLOBAL_ATTR, byClient);
};

/**
 * CLIENT_METADATA
 */
net.user1.orbiter.CoreMessageListener.prototype.u29 = function (id) {
  var theClient = this.clientMan.requestClient(id);
  this.clientMan.setSelf(theClient);
};

/**
 * CREATE_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u32 = function (roomID, status) {
  var theRoom = this.roomMan.getRoom(roomID);
  switch (status) {
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ROOM_EXISTS:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.roomMan.fireCreateRoomResult(net.user1.orbiter.RoomIDParser.getQualifier(roomID),
                                        net.user1.orbiter.RoomIDParser.getSimpleRoomID(roomID),
                                        status);
      break;
    
    default: 
      this.log.warn("Unrecognized status code for u32."
               + " Room ID: [" + roomID + "], status: [" + status + "].");
  }
};

/**
 * REMOVE_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u33 = function (roomID, status) {
  this.roomMan.fireRemoveRoomResult(net.user1.orbiter.RoomIDParser.getQualifier(roomID),
                                    net.user1.orbiter.RoomIDParser.getSimpleRoomID(roomID),
                                    status);
  switch (status) {
    case net.user1.orbiter.Status.ERROR: 
      this.log.warn("Server error for room removal attempt: " + roomID);
      break;
    case net.user1.orbiter.Status.PERMISSION_DENIED: 
      this.log.info("Attempt to remove room [" + roomID 
               + "] failed. Permission denied. See server log for details.");
      break;
      
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
      if (this.roomMan.getRoom(roomID) != null) {
        this.roomMan.disposeRoom(roomID);
      }
      break;
    
    case net.user1.orbiter.Status.AUTHORIZATION_REQUIRED:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
      break;
    
    default: 
      this.log.warn("Unrecognized status code for u33."
               + " Room ID: [" + roomID + "], status: [" + status + "].");
  }
};

/**
 * CLIENTCOUNT_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u34 = function (requestID,
                                                                numClients) {
  this.snapshotMan.receiveClientCountSnapshot(requestID, parseInt(numClients));
};

/**
 * CLIENT_ADDED_TO_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u36 = function (roomID,
                                                     clientID,
                                                     userID,
                                                     globalAttributes,
                                                     roomAttributes) {
  var theClient = this.clientMan.requestClient(clientID);
  var account = this.accountMan.requestAccount(userID);
  var clientManifest;
  if (account != null
      && theClient.getAccount() != account) {
    theClient.setAccount(account);
  }

  // If it's not the current client, set the client's attributes. 
  // (The current client obtains its own attributes through separate u8s.)
  var theRoom = this.roomMan.getRoom(roomID);
  if (!theClient.isSelf()) {
    clientManifest = new net.user1.orbiter.ClientManifest();
    clientManifest.deserialize(clientID, userID, null, 
                               null, globalAttributes, [roomID, roomAttributes]);
    theClient.synchronize(clientManifest);
    
    // If the client is observed, don't fire JOIN; observed clients always
    // fire JOIN based on observation updates. Likewise, don't fire JOIN
    // on self; self fires JOIN when it receives a u6.
    if (!this.clientMan.isObservingClient(clientID)) {
      theClient.fireJoinRoom(theRoom, roomID);
    }
  }

  // Add the client to the given room.
  theRoom.addOccupant(theClient);
};

/**
 * CLIENT_REMOVED_FROM_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u37 = function (roomID, 
                                                                clientID) {
  // Remove the room from the client's list of occupied rooms
  var theClient = this.clientMan.requestClient(clientID);
  var theRoom = this.roomMan.getRoom(roomID);

  // Remove the client from the given room
  theRoom.removeOccupant(clientID);
  
  // Don't fire LEAVE on self; self fires LEAVE when it receives a u44.
  if (!theClient.isSelf()) {
    // If the client is observed, don't fire LEAVE; observed clients always
    // fire LEAVE based on observation updates.
    if (!this.clientMan.isObservingClient(clientID)) {
      theClient.fireLeaveRoom(theRoom, roomID);
    }
  }
};

/**
 * ROOMLIST_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u38 = function (requestID,
                                                                requestedRoomIDQualifier, 
                                                                recursive) {
  var args = Array.prototype.slice.call(arguments).slice(3);
  var roomQualifier;
  var roomIDs;
  var roomList = [];
  
  if (requestID == "") {
    // Synchronize
    for (var i = 0; i < args.length; i+=2) {
      roomQualifier = args[i];
      roomIDs       = args[i+1].split(net.user1.orbiter.Tokens.RS);
      
      this.roomMan.setWatchedRooms(roomQualifier, roomIDs);
    }
  } else {
    // Snapshot
    for (i = 0; i < args.length; i+=2) {
      roomQualifier = args[i];
      roomIDs = args[i+1].split(net.user1.orbiter.Tokens.RS);
      for (var j = 0; j < roomIDs.length; j++) {
        roomList.push(roomQualifier + (roomQualifier == "" ? "" : ".") + roomIDs[j]);
      }
    }
    this.snapshotMan.receiveRoomListSnapshot(requestID, roomList, requestedRoomIDQualifier, recursive == "true");
  }
};

/**
 * ROOM_ADDED
 */
net.user1.orbiter.CoreMessageListener.prototype.u39 = function (roomID) { 
  // Add the room 
  this.roomMan.addWatchedRoom(roomID);
};

/**
 * ROOM_REMOVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u40 = function (roomID) {
  this.roomMan.removeWatchedRoom(roomID);
  if (this.roomMan.getRoom(roomID) != null) {
    this.roomMan.disposeRoom(roomID);
  }
};

/**
 * WATCH_FOR_ROOMS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u42 = function (roomIdQualifier, recursive, status) { 
  // Broadcast the result of the observation attempt.
  this.roomMan.fireWatchForRoomsResult(roomIdQualifier, status);
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.INVALID_QUALIFIER:
    case net.user1.orbiter.Status.ALREADY_WATCHING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      break;
      
    default: 
      this.log.warn("Unrecognized status code for u42."
        + " Room ID Qualifier: [" + roomIdQualifier + "], recursive: [" 
        + recursive + "], status: [" + status + "].");
  }
};

/**
 * STOP_WATCHING_FOR_ROOMS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u43 = function (roomIdQualifier, recursive, status) {
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
      if (roomIdQualifier == "" && recursive == "true") {
        this.roomMan.removeAllWatchedRooms();
      } else {
        // Remove all watched rooms for the qualifier
        this.roomMan.setWatchedRooms(roomIdQualifier, []);
      }
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_WATCHING:
    case net.user1.orbiter.Status.INVALID_QUALIFIER:
      this.roomMan.fireStopWatchingForRoomsResult(roomIdQualifier, status);
      break;
      
    default: 
      this.log.warn("Unrecognized status code for u43."
        + " Room ID Qualifier: [" + roomIdQualifier + "], recursive: [" 
        + recursive + "], status: [" + status + "].");
  }
};

/**
 * LEFT_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u44 = function (roomID) {
  var leftRoom = this.roomMan.getRoom(roomID);
  this.roomMan.removeOccupiedRoom(roomID);
  if (leftRoom != null) {
    leftRoom.doLeave();
    this.clientMan.self().fireLeaveRoom(leftRoom, roomID);
  }
};

/**
 * CHANGE_ACCOUNT_PASSWORD_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u46 = function (userID, status) {
  var account = this.accountMan.getAccount(userID); 
  if (account != null) {
    account.fireChangePasswordResult(status);
  }
  this.accountMan.fireChangePasswordResult(userID, status);
};

/**
 * CREATE_ACCOUNT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u47 = function (userID, status) {
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ACCOUNT_EXISTS:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
     this.orbiter.getAccountManager().fireCreateAccountResult(userID, status);
      break;
    default: 
      this.log.warn("Unrecognized status code for u47."
        + " Account: [" + userID + "], status: [" + status + "].");
  }
};

/**
 * REMOVE_ACCOUNT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u48 = function (userID, status) {
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
     this.orbiter.getAccountManager().fireRemoveAccountResult(userID, status);
      break;
    default: 
      this.log.warn("Unrecognized status code for u48."
        + " Account: [" + userID + "], status: [" + status + "].");
  }
};

/**
 * LOGIN_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u49 = function (userID, status) {
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_LOGGED_IN:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.orbiter.getAccountManager().fireLoginResult(userID, status);
      break;
    default:
      this.log.warn("Unrecognized status code for u49."
        + " Account: [" + userID + "], status: [" + status + "].");
  }          
};

/**
 * ROOM_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u54 = function (requestID,
                                                                roomID,
                                                                occupantCount,
                                                                observerCount,
                                                                roomAttributes) {
  var clientList = Array.prototype.slice.call(arguments).slice(5);
  var clientManifest;
  var roomManifest = new net.user1.orbiter.RoomManifest();
  var theRoom;
  roomManifest.deserialize(roomID, 
                           roomAttributes, 
                           clientList, 
                           parseInt(occupantCount), 
                           parseInt(observerCount));
  
  if (requestID == "") {
    // Synchronize
    theRoom = this.roomMan.getRoom(roomID);

    if (theRoom == null) { 
      // If the server makes the current client join or observe a room, it
      // will first send a u54 before sending the u6 or u59 notice. In that
      // case, the room might be unknown briefly, so create a cached room
      // then wait for the u6 or u59 to arrive.
      theRoom = this.roomMan.addCachedRoom(roomID); 
    }
    
    theRoom.synchronize(roomManifest);
  } else {
    // Snapshot
    this.snapshotMan.receiveRoomSnapshot(requestID, roomManifest);
  }
};


/**
 * OBSERVED_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u59 = function (roomID) {
  // Add the room to the observed room list
  var room = this.roomMan.addObservedRoom(roomID);
  // Tell the room to do its join duties
  room.doObserve();
  // Fire OBSERVE through the client
  this.clientMan.self().fireObserveRoom(room, roomID);
};

/**
 * GET_ROOM_SNAPSHOT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u60 = function (requestID,
                                                                roomID,
                                                                status) {
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
    case net.user1.orbiter.Status.AUTHORIZATION_REQUIRED:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.snapshotMan.receiveSnapshotResult(requestID, status);
      break;
    default:
      this.log.warn("Unrecognized status code for u60."
        + " Request ID: [" + requestID + "], Room ID: [" 
        + roomID + "], status: [" + status + "].");
  } 
};

/**
 * STOPPED_OBSERVING_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u62 = function (roomID) {
  var theRoom = this.roomMan.getRoom(roomID);
  this.roomMan.removeObservedRoom(roomID);
  if (theRoom != null) {
    theRoom.doStopObserving();
    // self() might return null if a STOP_OBSERVING listener has closed the connection
    if (this.clientMan.self() != null) {   
      this.clientMan.self().fireStopObservingRoom(theRoom, roomID);
    }
  }
};

/**
 * SERVER_HELLO
 */
net.user1.orbiter.CoreMessageListener.prototype.u66 = function (serverVersion, 
                                                                sessionID,
                                                                serverUPCVersionString,
                                                                protocolCompatible,
                                                                affinityAddress,
                                                                affinityDuration) {
  this.log.info("[ORBITER] Server version: " + serverVersion);
  this.log.info("[ORBITER] Server UPC version: " + serverUPCVersionString);
  
  var serverUPCVersion = new net.user1.orbiter.VersionNumber();
  serverUPCVersion.fromVersionString(serverUPCVersionString);
  this.orbiter.getServer().setVersion(serverVersion);
  this.orbiter.getServer().setUPCVersion(serverUPCVersion);


  var inProgressConnection = this.orbiter.getConnectionManager().getInProgressConnection();
  var inProgressConnectionHost = inProgressConnection.getHost();
  if (affinityAddress != ""  
      && typeof affinityAddress !== "undefined"
      && affinityAddress != inProgressConnectionHost) {
    this.orbiter.getConnectionManager().setAffinity(inProgressConnectionHost, 
                                                    affinityAddress, 
                                                    parseFloat(affinityDuration));
    inProgressConnection.applyAffinity();
  }
};


/**
 * JOIN_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u72 = function (roomID,
                                                               status) {
  var theRoom = this.roomMan.getRoom(roomID);
  switch (status) {
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
      if (this.roomMan.getRoom(roomID) != null) {
        this.roomMan.disposeRoom(roomID);
      }
    
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ROOM_FULL:
    case net.user1.orbiter.Status.AUTHORIZATION_REQUIRED:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ALREADY_IN_ROOM:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.roomMan.fireJoinRoomResult(roomID, status);
      if (theRoom != null) {
        theRoom.doJoinResult(status);
      }
      break;
    
    default: 
      this.log.warn("Unrecognized status code for u72."
        + " Room ID: [" + roomID + "], status: [" + status + "].");
  }
};

/**
 * SET_CLIENT_ATTR_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u73 = function (attrScope,
                                                                clientID,
                                                                userID,
                                                                attrName,
                                                                attrOptions,
                                                                status) { 
  var theClient;
  var theAccount;
  
  switch (status) {
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
      break;
      
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.DUPLICATE_VALUE:
    case net.user1.orbiter.Status.IMMUTABLE:
    case net.user1.orbiter.Status.SERVER_ONLY:
    case net.user1.orbiter.Status.EVALUATION_FAILED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      if (parseInt(attrOptions) & net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT) {
        // Persistent attr
        theAccount = this.accountMan.requestAccount(userID);
        theAccount.getAttributeManager().fireSetAttributeResult(attrName, attrScope, status);
      } else {
        // Non-persistent attr
        theClient = this.clientMan.requestClient(clientID);
        theClient.getAttributeManager().fireSetAttributeResult(attrName, attrScope, status);
      }
      break;
      
    default:
      this.log.warn("Unrecognized status received for u73: " + status);
  }
};

/**
 * SET_ROOM_ATTR_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u74 = function (roomID, 
                                                                attrName,
                                                                status) {
  var theRoom = this.roomMan.getRoom(roomID);
  
  // Quit if the room isn't found
  if (theRoom == null) {
    this.log.warn("Room attribute update received for room with no" + 
      " client-side Room object. Room ID [" +
      roomID + "]. Attribute: [" + attrName + "]. Status: ["
      + status + "].");
    return;
  }
  
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.IMMUTABLE:
    case net.user1.orbiter.Status.SERVER_ONLY:
    case net.user1.orbiter.Status.EVALUATION_FAILED:
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      theRoom.getAttributeManager().fireSetAttributeResult(attrName, 
                                                           net.user1.orbiter.Tokens.GLOBAL_ATTR,
                                                           status);
      break;
    
    default:
      this.log.warn("Unrecognized status received for u74: " + status);
  }
};

/**
 * GET_CLIENTCOUNT_SNAPSHOT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u75 = function (requestID,
                                                                status) {
  this.snapshotMan.receiveSnapshotResult(requestID, status);
};

/**
 * LEAVE_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u76 = function (roomID, 
                                                                status) {
  var leftRoom = this.roomMan.getRoom(roomID);
  
  switch (status) {
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
      if (leftRoom != null) {
        this.roomMan.disposeRoom(roomID);
      }
      
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_IN_ROOM:
      this.roomMan.fireLeaveRoomResult(roomID, status);
      if (leftRoom != null) {
        leftRoom.doLeaveResult(status);
      }
      break;
    
    default: 
      this.log.warn("Unrecognized status code for u76."
        + " Room ID: [" + roomID + "]. Status: [" + status + "].");        
  }
};

/**
 * OBSERVE_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u77 = function (roomID,
                      status) {
  var theRoom = this.roomMan.getRoom(roomID);
  switch (status) { 
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
      if (theRoom != null) {
        this.roomMan.disposeRoom(roomID);
      }
    
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.AUTHORIZATION_REQUIRED:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ALREADY_OBSERVING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.roomMan.fireObserveRoomResult(roomID, status);
      
      if (theRoom) {
        theRoom.doObserveResult(status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u77."
        + " Room ID: [" + roomID + "], status: " + status + ".");
  }
}    

/**
 * STOP_OBSERVING_ROOM_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u78 = function (roomID, 
                                                                status) {
  var theRoom = this.roomMan.getRoom(roomID);
  
  switch (status) {
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
      if (theRoom != null) {
        this.roomMan.disposeRoom(roomID);
      }
    
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_OBSERVING:
      this.roomMan.fireStopObservingRoomResult(roomID, status);
      
      if (theRoom != null) {
        theRoom.doStopObservingResult(status);
      }
      break;
    
    default: 
      this.log.warn("Unrecognized status code for u78."
        + " Room ID: [" + roomID + "], status: " + status + ".");        
  }
};

/**
 * ROOM_ATTR_REMOVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u79 = function (roomID,
                                                                byClientID,
                                                                attrName) {
  var theRoom = this.roomMan.getRoom(roomID);
  var theClient;
  
  // Quit if the room isn't found
  if (theRoom == null) {
    this.log.warn("Room attribute removal notification received for room with no" + 
      " client-side Room object. Room ID [" +
      roomID + "]. Attribute: [" + attrName + "].");
    return;
  }
  
  // If the clientID is "", the server removed the room, so there's no
  // corresponding client.
  theClient = byClientID == "" ? null : this.clientMan.requestClient(byClientID);
  theRoom.getAttributeManager().removeAttributeLocal(attrName, net.user1.orbiter.Tokens.GLOBAL_ATTR, theClient)
}

/**
 * REMOVE_ROOM_ATTR_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u80 = function (roomID,
                                                                attrName,
                                                                status) {
  var theRoom = this.roomMan.getRoom(roomID);      
  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.IMMUTABLE:
    case net.user1.orbiter.Status.SERVER_ONLY:
    case net.user1.orbiter.Status.ROOM_NOT_FOUND:
    case net.user1.orbiter.Status.ATTR_NOT_FOUND:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      if (theRoom != null) {
        theRoom.getAttributeManager().fireDeleteAttributeResult(attrName,
                                                                net.user1.orbiter.Tokens.GLOBAL_ATTR,
                                                                status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status received for u80: " + status);
  }
};  

/**
 * CLIENT_ATTR_REMOVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u81 = function (attrScope,
                                                                clientID,
                                                                userID, 
                                                                attrName,
                                                                attrOptions) {
  var client;
  var account;
  
  if (parseInt(attrOptions) & net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT) {
    // Persistent attr
    account = this.accountMan.requestAccount(userID);
    account.getAttributeManager().removeAttributeLocal(attrName, attrScope);
  } else {
    // Non-persistent attr
    client = this.clientMan.requestClient(clientID);
    client.getAttributeManager().removeAttributeLocal(attrName, attrScope);
  }
};

/**
 * REMOVE_CLIENT_ATTR_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u82 = function (attrScope,
                                                                clientID,
                                                                userID,
                                                                attrName,
                                                                attrOptions,
                                                                status) { 
  var client;
  var account;
  
  
  switch (status) {
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
      break;
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.IMMUTABLE:
    case net.user1.orbiter.Status.SERVER_ONLY:
    case net.user1.orbiter.Status.ATTR_NOT_FOUND: 
    case net.user1.orbiter.Status.EVALUATION_FAILED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      if (parseInt(attrOptions) & net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT) {
        // Persistent attr
        account = this.accountMan.requestAccount(userID);
        account.getAttributeManager().fireDeleteAttributeResult(attrName, attrScope, status);
      } else {
        // Non-persistent attr
        client = this.clientMan.requestClient(clientID);
        client.getAttributeManager().fireDeleteAttributeResult(attrName, attrScope, status);
      }
      break;
      
    default:
      this.log.warn("Unrecognized status received for u82: " + status);
  }
};

/**
 * SESSION_TERMINATED
 */
net.user1.orbiter.CoreMessageListener.prototype.u84 = function () {
  this.orbiter.getConnectionManager().dispatchSessionTerminated();
};

/**
 * LOGOFF_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u87 = function (userID, status) {
  var account = this.accountMan.getAccount(userID);

  switch (status) {
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.AUTHORIZATION_FAILED:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.NOT_LOGGED_IN:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      if (account != null) {
        account.fireLogoffResult(status);
      }
      // Tell the account manager
      this.accountMan.fireLogoffResult(userID, status);
      break;
    default:
      this.log.warn("Unrecognized status received for u87: " + status);
  }
};

/**
 * LOGGED_IN
 */
net.user1.orbiter.CoreMessageListener.prototype.u88 = function (clientID, 
                                                                userID,
                                                                globalAttrs) {
  var roomAttrs = Array.prototype.slice.call(arguments).slice(3);
  var account = this.accountMan.requestAccount(userID);
  var client = this.clientMan.requestClient(clientID);
  var clientManifest = new net.user1.orbiter.ClientManifest();
  clientManifest.deserialize(clientID, userID, null, null, globalAttrs, roomAttrs);      
  // Update the account
  var scopes = clientManifest.persistentAttributes.getScopes();
  var accountAttrs = account.getAttributeManager().getAttributeCollection();
  for (var i = scopes.length; --i >= 0;) {
    accountAttrs.synchronizeScope(scopes[i], clientManifest.persistentAttributes);
  }
  
  if (client.getAccount() == null) {
    // Client doesn't know about this account yet
    client.setAccount(account);
    client.fireLogin();
    account.doLoginTasks();
    this.accountMan.fireLogin(account, clientID);
  } else {
    // Do nothing if the account is known. Logins are reported for 
    // observe-account, observe-client, and watch-for-clients, so a 
    // client might receive multiple login notifications.
  }
};

/**
 * LOGGED_OFF
 */
net.user1.orbiter.CoreMessageListener.prototype.u89 = function (clientID, userID) {
  var client = this.clientMan.getInternalClient(clientID);
  var account = this.accountMan.getAccount(userID);
  
  if (account != null) {
    if (account.getConnectionState() == net.user1.orbiter.ConnectionState.LOGGED_IN) {
      if (client != null) {
        client.fireLogoff(userID);
      }
      account.doLogoffTasks();
      this.accountMan.fireLogoff(account, clientID);
    } else {
      // Do nothing if the account is unknown. Logoffs are reported for 
      // observe-account, observe-client, and watch-for-clients, so a 
      // client might receive multiple logoff notifications.
    }
  } else {
    throw new Error("LOGGED_OFF (u89) received for an unknown user: [" + userID + "].");
  }
}

/**
 * PASSWORD_CHANGED
 */
net.user1.orbiter.CoreMessageListener.prototype.u90 = function () {
  var self = this.orbiter.self();
  var selfAccount = self.getAccount();
  if (selfAccount != null) {
    selfAccount.fireChangePassword();
  }
  this.accountMan.fireChangePassword(selfAccount ? selfAccount.getUserID() : null);
};

/**
 * CLIENTLIST_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u101 = function (requestID, serializedIDs) {
  var ids = serializedIDs.split(net.user1.orbiter.Tokens.RS);
  var clientList;
  var thisUserID;
  
  if (requestID == "") {
    // Synchronize
    this.clientMan.deserializeWatchedClients(serializedIDs);
  } else {
    // Snapshot
    clientList = [];
    for (var i = ids.length-1; i >= 0; i-=2) {
      thisUserID = ids[i];
      thisUserID = thisUserID == "" ? null : thisUserID;
      clientList.push({clientID:ids[i-1], userID:thisUserID});
    }
    this.snapshotMan.receiveClientListSnapshot(requestID, clientList);
  }      
};    

/**
 * CLIENT_ADDED_TO_SERVER
 */
net.user1.orbiter.CoreMessageListener.prototype.u102 = function (clientID) {
  this.clientMan.addWatchedClient(this.clientMan.requestClient(clientID));
};

/**
 * CLIENT_REMOVED_FROM_SERVER
 */
net.user1.orbiter.CoreMessageListener.prototype.u103 = function (clientID) {
  var client = this.clientMan.getInternalClient(clientID);
  
  if (this.clientMan.hasWatchedClient(clientID)) {
    this.clientMan.removeWatchedClient(clientID);
  }
  if (this.clientMan.isObservingClient(clientID)) {
    this.clientMan.removeObservedClient(clientID);
  }
  
  // If the current client is both observing a client and watching for clients,
  // it will receive two u103 notifications. When the second one arrives, the
  // client will be unknown, so no disconnection event should be dispatched.
  if (client != null) {
    client.setConnectionState(net.user1.orbiter.ConnectionState.NOT_CONNECTED);
    // Retrieve the client reference using getClient() here so that the
    // ClientManagerEvent.CLIENT_DISCONNECTED event provides the application
    // with access to the custom client, if available.
    this.clientMan.fireClientDisconnected(this.clientMan.getClient(clientID));
  }
};

/**
 * CLIENT_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u104 = function (requestID,
                                                                 clientID,
                                                                 userID,
                                                                 serializedOccupiedRoomIDs,
                                                                 serializedObservedRoomIDs,
                                                                 globalAttrs) {
  var roomAttrs = Array.prototype.slice.call(arguments).slice(7);
  var theClient;
  var account = this.accountMan.requestAccount(userID);
  var clientManifest = new net.user1.orbiter.ClientManifest();
  clientManifest.deserialize(clientID, userID, serializedOccupiedRoomIDs, 
                             serializedObservedRoomIDs, globalAttrs, roomAttrs);
  var scopes; // Used with UserAccount only
  
  if (clientID != "") {  
    // --- Client update ---
    
    if (requestID == "") {
      // Synchronize
      theClient = this.clientMan.requestClient(clientID);
      theClient.setAccount(account);
      theClient.synchronize(clientManifest);
      theClient.fireSynchronize();
    } else {
      // Snapshot
      this.snapshotMan.receiveClientSnapshot(requestID, clientManifest);
    }
  } else {  
    // --- User account update ---

    if (requestID == "") {
      // Synchronize
      scopes = clientManifest.persistentAttributes.getScopes();
      for (var i = scopes.length; --i >= 0;) {
        account.getAttributeManager().getAttributeCollection().synchronizeScope(scopes[i], clientManifest.persistentAttributes);
      }
      account.fireSynchronize();
    } else {
      // Snapshot
      this.snapshotMan.receiveAccountSnapshot(requestID, clientManifest);
    }
  }
};

/**
 * OBSERVE_CLIENT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u105 = function (clientID, status) {
  var theClient = this.clientMan.getInternalClient(clientID);
  switch (status) { 
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_OBSERVING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.clientMan.fireObserveClientResult(clientID, status);
      if (theClient != null) {
        theClient.fireObserveResult(status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u105."
               + " Client ID: [" + clientID + "], status: [" + status + "].");
  }
};    

/**
 * STOP_OBSERVING_CLIENT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u106 = function (clientID, status) {
  var theClient = this.clientMan.getInternalClient(clientID);
  switch (status) { 
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_OBSERVING:
      this.clientMan.fireStopObservingClientResult(clientID, status);
      if (theClient != null) {
        theClient.fireStopObservingResult(status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u106."
               + " Client ID: [" + clientID + "], status: [" + status + "].");
  }
};

/**
 * WATCH_FOR_CLIENTS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u107 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_WATCHING:
      this.clientMan.fireWatchForClientsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u107."
                    + "Status: [" + status + "].");
  }
};

/**
 * STOP_WATCHING_FOR_CLIENTS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u108 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
      this.clientMan.setIsWatchingForClients(false);
      this.clientMan.removeAllWatchedClients();
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_WATCHING:
      this.clientMan.fireStopWatchingForClientsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u108."
               + "Status: [" + status + "].");
  }
};    

/**
 * WATCH_FOR_USERS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u109 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
      this.accountMan.setIsWatchingForAccounts(true);
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_WATCHING:
      this.accountMan.fireWatchForAccountsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u109."
               + "Status: [" + status + "].");
  }
};  

/**
 * STOP_WATCHING_FOR_USERS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u110 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
      this.accountMan.setIsWatchingForAccounts(false);
      this.accountMan.removeAllWatchedAccounts();
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_WATCHING:
      this.accountMan.fireStopWatchingForAccountsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u110."
               + "Status: [" + status + "].");
  }
};    

/**
 * USER_ADDED
 */
net.user1.orbiter.CoreMessageListener.prototype.u111 = function (userID) {
  this.accountMan.addWatchedAccount(this.accountMan.requestAccount(userID));
};    

/**
 * USER_REMOVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u112 = function (userID) {
  var account;
  if (this.accountMan.hasWatchedAccount(userID)) {
    account = this.accountMan.removeWatchedAccount(userID);
  }
  if (this.accountMan.isObservingAccount(userID)) {
    account = this.accountMan.removeObservedAccount(userID);
  }
  this.accountMan.fireAccountRemoved(userID, account);
};    

/**
 * JOINED_ROOM_ADDED_TO_CLIENT
 */
net.user1.orbiter.CoreMessageListener.prototype.u113 = function (clientID, roomID) {
  var client = this.clientMan.requestClient(clientID);
  client.addOccupiedRoomID(roomID);
  client.fireJoinRoom(this.roomMan.getRoom(roomID), roomID);
}    

/**
 * JOINED_ROOM_REMOVED_FROM_CLIENT
 */
net.user1.orbiter.CoreMessageListener.prototype.u114 = function (clientID, roomID) {
  var client = this.clientMan.requestClient(clientID);
  client.removeOccupiedRoomID(roomID);
  client.fireLeaveRoom(this.roomMan.getRoom(roomID), roomID);
};    

/**
 * GET_CLIENT_SNAPSHOT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u115 = function (requestID,
                                                                 clientID, 
                                                                 status) {
  this.snapshotMan.receiveSnapshotResult(requestID, status);
};

/**
 * GET_ACCOUNT_SNAPSHOT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u116 = function (requestID,
                                                                 userID, 
                                                                 status) {
  this.snapshotMan.receiveSnapshotResult(requestID, status);
};

/**
 * OBSERVED_ROOM_ADDED_TO_CLIENT
 */
net.user1.orbiter.CoreMessageListener.prototype.u117 = function (clientID, roomID) {
  var client = this.clientMan.requestClient(clientID);
  client.addObservedRoomID(roomID);
  client.fireObserveRoom(this.roomMan.getRoom(roomID), roomID);
};    

/**
 * OBSERVED_ROOM_REMOVED_FROM_CLIENT
 */
net.user1.orbiter.CoreMessageListener.prototype.u118 = function (clientID, roomID) {
  var client = this.clientMan.requestClient(clientID);
  client.removeObservedRoomID(roomID);
  client.fireStopObservingRoom(this.roomMan.getRoom(roomID), roomID);
}    

/**
 * CLIENT_OBSERVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u119 = function (clientID) {
  var client = this.clientMan.requestClient(clientID);
  this.clientMan.addObservedClient(client);
  client.fireObserve();
};

/**
 * STOPPED_OBSERVING_CLIENT
 */
net.user1.orbiter.CoreMessageListener.prototype.u120 = function (clientID) {
  var client = this.clientMan.getInternalClient(clientID)
  this.clientMan.removeObservedClient(clientID);
  if (client != null) {
    client.fireStopObserving();
  }
};

/**
 * OBSERVE_ACCOUNT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u123 = function (userID, status) {
  var theAccount = this.accountMan.getAccount(userID);
  switch (status) { 
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_OBSERVING:
      this.accountMan.fireObserveAccountResult(userID, status);
      if (theAccount) {
        theAccount.fireObserveResult(status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u123."
               + " User ID: [" + userID + "], status: [" + status + "].");
  }
};

/**
 * ACCOUNT_OBSERVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u124 = function (userID) {
  var theAccount = this.accountMan.requestAccount(userID);
  this.accountMan.addObservedAccount(theAccount);
  theAccount.fireObserve();
};

/**
 * STOP_OBSERVING_ACCOUNT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u125 = function (userID, status) {
  var theAccount = this.accountMan.getAccount(userID);
  switch (status) { 
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_OBSERVING:
      this.accountMan.fireStopObservingAccountResult(userID, status);
      if (theAccount) {
        theAccount.fireStopObservingResult(status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u125."
               + " User ID: [" + userID + "], status: [" + status + "].");
  }
};

/**
 * STOPPED_OBSERVING_ACCOUNT
 */
net.user1.orbiter.CoreMessageListener.prototype.u126 = function (userID) {
  var account = this.accountMan.getAccount(userID);
  this.accountMan.removeObservedAccount(userID);
  if (account != null) {
    account.fireStopObserving();
  }
};

/**
 * ACCOUNT_LIST_UPDATE
 */
net.user1.orbiter.CoreMessageListener.prototype.u127 = function (requestID, serializedIDs) {
  var ids = serializedIDs.split(net.user1.orbiter.Tokens.RS);
  var accountList;
  
  if (requestID == "") {
    // Synchronize
    this.accountMan.deserializeWatchedAccounts(serializedIDs);
  } else {
    // Snapshot
    accountList = [];
    for (var i = ids.length; --i >= 0;) {
      accountList.push(ids[i]);
    }
    this.snapshotMan.receiveAccountListSnapshot(requestID, accountList);
  }  
};

/**
 * UPDATE_LEVELS_UPDATE
 */
net.user1.orbiter.CoreMessageListener.prototype.u128 = function (updateLevels, roomID) {
  var room = this.roomMan.getRoom(roomID);
  var levels = new net.user1.orbiter.UpdateLevels();
  levels.fromInt(parseInt(updateLevels));
  if (room != null) {
    if (!levels.occupantList) {
      var occupantID;
      var occupantIDs = room.getOccupantIDs();
      var numOccupantIDs = occupantIDs.length;
      for (var i = 0; i < numOccupantIDs; i++) {
        occupantID = occupantIDs[i];
        room.removeOccupant(occupantID);
      }
    }
    if (!levels.observerList) {
      var observerID;
      var observerIDs = room.getObserverIDs();
      var numObserverIDs = observerIDs.length;
      for (i = 0; i < numObserverIDs; i++) {
        observerID = observerIDs[i];
        room.removeObserver(observerID);
      }
    }
    if (!levels.sharedRoomAttributes
        && !levels.allRoomAttributes) {
      room.getAttributeManager().removeAll();
    }
  }
};

/**
 * CLIENT_OBSERVED_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u129 = function (roomID,
                                                                 clientID,
                                                                 userID,
                                                                 globalAttributes,
                                                                 roomAttributes) {
  var theClient = this.clientMan.requestClient(clientID);
  var account = this.accountMan.requestAccount(userID);
  var clientManifest;
  if (account != null
      && theClient.getAccount() != account) {
    theClient.setAccount(account);
  }

  // If it's not the current client, set the client's attributes. 
  // (The current client obtains its own attributes through separate u8s.)
  var theRoom = this.roomMan.getRoom(roomID);
  if (!theClient.isSelf()) {
    clientManifest = new net.user1.orbiter.ClientManifest();
    clientManifest.deserialize(clientID, userID, null, 
                               null, globalAttributes, [roomID, roomAttributes]);
    theClient.synchronize(clientManifest);
    
    // If the client is observed, don't fire OBSERVE_ROOM; observed clients always
    // fire OBSERVE_ROOM based on observation updates. Likewise, don't fire OBSERVE_ROOM
    // on self; self fires OBSERVE_ROOM when it receives a u59.
    if (!this.clientMan.isObservingClient(clientID)) {
      theClient.fireObserveRoom(theRoom, roomID);
    }
  }

  // Add the client to the room's observer list
  theRoom.addObserver(theClient);
};

/**
 * CLIENT_STOPPED_OBSERVING_ROOM
 */
net.user1.orbiter.CoreMessageListener.prototype.u130 = function (roomID, 
                                                                 clientID) {
  // Remove the room from the client's list of observed rooms
  var theClient = this.clientMan.requestClient(clientID);
  var theRoom = this.roomMan.getRoom(roomID);

  // Remove the client from the given room
  theRoom.removeObserver(clientID);
  
  // Don't fire STOP_OBSERVING_ROOM on self; self fires STOP_OBSERVING_ROOM
  // when it receives a u62.
  if (!theClient.isSelf()) {
    // If the client is observed, don't fire STOP_OBSERVING_ROOM; observed 
    // clients always fire STOP_OBSERVING_ROOM based on observation updates.
    if (!this.clientMan.isObservingClient(clientID)) {
      theClient.fireStopObservingRoom(theRoom, roomID);
    }
  }
};

/**
 * ROOM_OCCUPANTCOUNT_UPDATE
 */
net.user1.orbiter.CoreMessageListener.prototype.u131 = function (roomID, 
                                                                 numClients) {
  var levels = this.clientMan.self().getUpdateLevels(roomID);
  
  if (levels != null) {
    if (!levels.occupantList) {
      this.roomMan.getRoom(roomID).setNumOccupants(parseInt(numClients));
    }
  } else {
    throw new Error("[CORE_MESSAGE_LISTENER] Received a room occupant count" +
      " update (u131), but update levels are unknown for the room. Synchronization" +
      " error. Please report this error to union@user1.net.");
  }
};

/**
 * ROOM_OBSERVERCOUNT_UPDATE
 */
net.user1.orbiter.CoreMessageListener.prototype.u132 = function (roomID,  
                                                                 numClients) {
  var levels = this.clientMan.self().getUpdateLevels(roomID);
  
  if (levels != null) {
    if (!levels.observerList) {
      this.roomMan.getRoom(roomID).setNumObservers(parseInt(numClients));
    }
  } else {
    throw new Error("[CORE_MESSAGE_LISTENER] Received a room observer count" +
      " update (u132), but update levels are unknown for the room. Synchronization" +
      " error. Please report this error to union@user1.net.");
  }
}

/**
 * ADD_ROLE_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u134 = function (userID, role, status) {
  var theAccount = this.accountMan.getAccount(userID);
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.ROLE_NOT_FOUND:
    case net.user1.orbiter.Status.ALREADY_ASSIGNED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.accountMan.fireAddRoleResult(userID, role, status);
      if (theAccount) {
        theAccount.fireAddRoleResult(role, status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u134."
               + " User ID: [" + userID + "], role: [" + role 
               + "], status: [" + status + "].");
  }
};

/**
 * REMOVE_ROLE_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u136 = function (userID, role, status) {
  var theAccount = this.accountMan.getAccount(userID);
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ACCOUNT_NOT_FOUND:
    case net.user1.orbiter.Status.ROLE_NOT_FOUND:
    case net.user1.orbiter.Status.NOT_ASSIGNED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.accountMan.fireRemoveRoleResult(userID, role, status);
      if (theAccount) {
        theAccount.fireRemoveRoleResult(role, status);
      }
      break;
    
    default:
      this.log.warn("Unrecognized status code for u136."
               + " User ID: [" + userID + "], role: [" + role 
               + "], status: [" + status + "].");
  }
};

/**
 * BAN_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u138 = function (address, clientID, status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.ALREADY_BANNED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.clientMan.fireBanClientResult(address, clientID, status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u138."
               + " Address: [" + address + "], clientID: [" + clientID 
               + "], status: [" + status + "].");
  }
};

/**
 * UNBAN_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u140 = function (address, status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_BANNED:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.clientMan.fireUnbanClientResult(address, status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u140."
               + " Address: [" + address + "],"
               + " status: [" + status + "].");
  }
};

/**
 * BANNED_LIST_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u142 = function (requestID, bannedListSource) {
  var bannedList = bannedListSource == "" ? [] : bannedListSource.split(net.user1.orbiter.Tokens.RS);
  
  if (requestID == "") {
    this.clientMan.setWatchedBannedAddresses(bannedList);
  } else {
    // Snapshot
    this.snapshotMan.receiveBannedListSnapshot(requestID, bannedList);
  }
};

/**
 * WATCH_FOR_BANNED_ADDRESSES_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u144 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_WATCHING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.clientMan.fireWatchForBannedAddressesResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u144:"
               + " [" + status + "].");
  }
};

/**
 * STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u146 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_WATCHING:
      this.clientMan.fireStopWatchingForBannedAddressesResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u146:"
               + " [" + status + "].");
  }
};

/**
 * BANNED_ADDRESS_ADDED
 */
net.user1.orbiter.CoreMessageListener.prototype.u147 = function (address) {
  this.clientMan.addWatchedBannedAddress(address);
};

/**
 * BANNED_ADDRESS_REMOVED
 */
net.user1.orbiter.CoreMessageListener.prototype.u148 = function (address) {
  this.clientMan.removeWatchedBannedAddress(address);
};

/**
 * KICK_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u150 = function (clientID, status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.CLIENT_NOT_FOUND:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.clientMan.fireKickClientResult(clientID, status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u150:"
               + " [" + status + "].");
  }
};

/**
 * SERVERMODULELIST_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u152 = function (requestID, serverModuleListSource) {
  var moduleListArray = serverModuleListSource == "" ? [] : serverModuleListSource.split(net.user1.orbiter.Tokens.RS);
  var moduleList = [];
  for (var i = 0; i < moduleListArray.length; i+= 3) {
    moduleList.push(new ModuleDefinition(moduleListArray[i],
                                         moduleListArray[i+1],
                                         moduleListArray[i+2]));
  }
  
  if (requestID == "") {
    this.log.warn("Incoming SERVERMODULELIST_SNAPSHOT UPC missing required requestID. Ignoring message.");
  } else {
    // Snapshot
    this.snapshotMan.receiveServerModuleListSnapshot(requestID, moduleList);
  }
};

/**
 * GET_UPC_STATS_SNAPSHOT_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u155 = function (requestID,
                                                                 status) {
  this.snapshotMan.receiveSnapshotResult(requestID, status);
};

/**
 * UPC_STATS_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u156 = function (requestID,
                                                                 totalUPCsProcessed,
                                                                 numUPCsInQueue,
                                                                 lastQueueWaitTime) {
  var longestUPCProcesses = Array.prototype.slice.call(arguments).slice(5);
  var upcProcessingRecord;
  for (var i = 0; i < longestUPCProcesses.length; i++) {
    upcProcessingRecord = new net.user1.orbiter.UPCProcessingRecord();
    upcProcessingRecord.deserialize(longestUPCProcesses[i]);
    longestUPCProcesses[i] = upcProcessingRecord;
  }
  
  this.snapshotMan.receiveUPCStatsSnapshot(requestID, 
                                           parseFloat(totalUPCsProcessed),
                                           parseFloat(numUPCsInQueue),
                                           parseFloat(lastQueueWaitTime),
                                           longestUPCProcesses);
};

/**
 * RESET_UPC_STATS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u158 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
     this.orbiter.getServer().dispatchResetUPCStatsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u158."
               + "Status: [" + status + "].");
  }
};

/**
 * WATCH_FOR_PROCESSED_UPCS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u160 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
      this.orbiter.getServer().setIsWatchingForProcessedUPCs(true);
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.ALREADY_WATCHING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.orbiter.getServer().dispatchWatchForProcessedUPCsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u160."
               + "Status: [" + status + "].");
  }
};

/**
 * PROCESSED_UPC_ADDED
 */
net.user1.orbiter.CoreMessageListener.prototype.u161 = function (fromClientID,
                                                                 fromUserID,
                                                                 fromClientAddress,
                                                                 queuedAt,
                                                                 processingStartedAt,
                                                                 processingFinishedAt,
                                                                 source) {
  var upcProcessingRecord = new net.user1.orbiter.UPCProcessingRecord();
  upcProcessingRecord.deserializeParts(fromClientID,
                                       fromUserID,
                                       fromClientAddress,
                                       queuedAt,
                                       processingStartedAt,
                                       processingFinishedAt,
                                       source);
  this.orbiter.getServer().dispatchUPCProcessed(upcProcessingRecord);
};

/**
 * STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT
 */
net.user1.orbiter.CoreMessageListener.prototype.u163 = function (status) {
  switch (status) { 
    case net.user1.orbiter.Status.SUCCESS:
      this.orbiter.getServer().setIsWatchingForProcessedUPCs(false);
    case net.user1.orbiter.Status.ERROR:
    case net.user1.orbiter.Status.NOT_WATCHING:
    case net.user1.orbiter.Status.PERMISSION_DENIED:
      this.orbiter.getServer().dispatchStopWatchingForProcessedUPCsResult(status);
      break;
    
    default:
      this.log.warn("Unrecognized status code for u163."
               + "Status: [" + status + "].");
  }
};

    
/**
 * NODELIST_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u166 = function (requestID, nodeListSource) {
  var nodeIDs = nodeListSource == "" ? [] : nodeListSource.split(net.user1.orbiter.Tokens.RS);
  
  if (requestID == "") {
    this.log.warn("Incoming NODELIST_SNAPSHOT UPC missing required requestID. Ignoring message.");
  } else {
    // Snapshot
    this.snapshotMan.receiveNodeListSnapshot(requestID, nodeIDs);
  }
};

/**
 * GATEWAYS_SNAPSHOT
 */
net.user1.orbiter.CoreMessageListener.prototype.u168 = function (requestID) {
  var gatewayListSource = Array.prototype.slice.call(arguments).slice(1);
  var gateways = [];

  var gateway;
  var gatewayBandwidth;
  var gatewayBandwidthSource;
  var gatewayIntervalSource;
  for (var i = 0; i < gatewayListSource.length; i+=8) {
    gateway = new net.user1.orbiter.Gateway();
    gateway.id = gatewayListSource[i];
    gateway.type = gatewayListSource[i+1];

    gateway.lifetimeConnectionsByCategory = gatewayListSource[i+2] === "" ? {} : this.createHashFromArg(gatewayListSource[i+2]);
    for (var p in gateway.lifetimeConnectionsByCategory) {
      gateway.lifetimeConnectionsByCategory[p] = parseFloat(gateway.lifetimeConnectionsByCategory[p]);
    }
    gateway.lifetimeClientsByType = gatewayListSource[i+3] === "" ? {} : this.createHashFromArg(gatewayListSource[i+3]);
    for (p in gateway.lifetimeClientsByType) {
      gateway.lifetimeClientsByType[p] = parseFloat(gateway.lifetimeClientsByType[p]);
    }
    gateway.lifetimeClientsByUPCVersion = gatewayListSource[i+4] === "" ? {} : this.createHashFromArg(gatewayListSource[i+4]);
    for (p in gateway.lifetimeClientsByUPCVersion) {
      gateway.lifetimeClientsByUPCVersion[p] = parseFloat(gateway.lifetimeClientsByUPCVersion[p]);
    }
    gateway.attributes = gatewayListSource[i+5] === "" ? {} : this.createHashFromArg(gatewayListSource[i+5]);

    gatewayIntervalSource = gatewayListSource[i+6].split(net.user1.orbiter.Tokens.RS);
    gateway.connectionsPerSecond = parseFloat(gatewayIntervalSource[0]);
    gateway.maxConnectionsPerSecond = parseFloat(gatewayIntervalSource[1]);
    gateway.clientsPerSecond = parseFloat(gatewayIntervalSource[2]);
    gateway.maxClientsPerSecond = parseFloat(gatewayIntervalSource[3]);

    gatewayBandwidth = new net.user1.orbiter.GatewayBandwidth();
    gatewayBandwidthSource = gatewayListSource[i+7].split(net.user1.orbiter.Tokens.RS);
    gatewayBandwidth.lifetimeRead = gatewayBandwidthSource[0] === "" ? 0 : parseFloat(gatewayBandwidthSource[0]);
    gatewayBandwidth.lifetimeWritten = gatewayBandwidthSource[1] === "" ? 0 : parseFloat(gatewayBandwidthSource[1]);
    gatewayBandwidth.averageRead = gatewayBandwidthSource[2] === "" ? 0 : parseFloat(gatewayBandwidthSource[2]);
    gatewayBandwidth.averageWritten = gatewayBandwidthSource[3] === "" ? 0 : parseFloat(gatewayBandwidthSource[3]);
    gatewayBandwidth.intervalRead = gatewayBandwidthSource[4] === "" ? 0 : parseFloat(gatewayBandwidthSource[4]);
    gatewayBandwidth.intervalWritten = gatewayBandwidthSource[5] === "" ? 0 : parseFloat(gatewayBandwidthSource[5]);
    gatewayBandwidth.maxIntervalRead = gatewayBandwidthSource[6] === "" ? 0 : parseFloat(gatewayBandwidthSource[6]);
    gatewayBandwidth.maxIntervalWritten = gatewayBandwidthSource[7] === "" ? 0 : parseFloat(gatewayBandwidthSource[7]);
    gatewayBandwidth.scheduledWrite = gatewayBandwidthSource[8] === "" ? 0 : parseFloat(gatewayBandwidthSource[8]);
    gateway.bandwidth = gatewayBandwidth;
    gateways.push(gateway);
  }

  if (requestID == "") {
    this.log.warn("Incoming GATEWAYS_SNAPSHOT UPC missing required requestID. Ignoring message.");
  } else {
    // Snapshot
    this.snapshotMan.receiveGatewaysSnapshot(requestID, gateways);
  }
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 */
net.user1.orbiter.CustomClient = function () {
  this.client = null;
};

/**
 * An initialization method invoked when this CustomClient object is ready
 * for use. Subclasses wishing to perform initialization tasks that require
 * this CustomClient's composed Client object should override this method. 
 * 
 * @since Orbiter 1.0.0
 */
net.user1.orbiter.CustomClient.prototype.init = function () {
};

net.user1.orbiter.CustomClient.prototype.addEventListener = function (type, 
                                                           listener,
                                                           thisArg,
                                                           priority) {
  this.client.addEventListener(type, listener, thisArg, priority);
};

net.user1.orbiter.CustomClient.prototype.dispatchEvent = function (event) {
  return this.client.dispatchEvent(event);
};

net.user1.orbiter.CustomClient.prototype.hasEventListener = function (type) {
  return this.client.hasEventListener(type);
};

net.user1.orbiter.CustomClient.prototype.removeEventListener = function (type, 
                                                                         listener,
                                                                         thisObj) {
  this.client.removeEventListener(type, listener, thisObj);
};

net.user1.orbiter.CustomClient.prototype.willTrigger = function (type) {
  return this.client.willTrigger(type);
};

net.user1.orbiter.CustomClient.prototype.setClient = function (client) {
  this.client = client;
};

net.user1.orbiter.CustomClient.prototype.getClientID = function () {
  return this.client.getClientID();
};

net.user1.orbiter.CustomClient.prototype.getConnectionState = function () {
  return this.client.getConnectionState();
};

net.user1.orbiter.CustomClient.prototype.isSelf = function () {
  return this.client.isSelf();
};

net.user1.orbiter.CustomClient.prototype.setClientClass = function (scope, 
                               clientClass) {
  var fallbackClasses = Array.prototype.slice.call(arguments).slice(2);
  this.client.setClientClass.apply(this.client, [scope, clientClass].concat(fallbackClasses));
};

net.user1.orbiter.CustomClient.prototype.isInRoom = function (roomID) {
  return this.client.isInRoom(roomID);
};

net.user1.orbiter.CustomClient.prototype.isObservingRoom = function (roomID) {
  return this.client.isObservingRoom(roomID);
};

net.user1.orbiter.CustomClient.prototype.getOccupiedRoomIDs = function () {
  return this.client.getOccupiedRoomIDs();
};

net.user1.orbiter.CustomClient.prototype.getObservedRoomIDs = function () {
  return this.client.getObservedRoomIDs();
};

net.user1.orbiter.CustomClient.prototype.getIP = function () {
  return this.client.getIP();
};

net.user1.orbiter.CustomClient.prototype.getConnectTime = function () {
  return this.client.getConnectTime();
};

net.user1.orbiter.CustomClient.prototype.getPing = function () {
  return this.client.getPing();
};

net.user1.orbiter.CustomClient.prototype.getTimeOnline = function () {
  return this.client.getTimeOnline();
};

net.user1.orbiter.CustomClient.prototype.sendMessage = function (messageName) {
  var args = Array.prototype.slice.call(arguments).slice(0);
  this.client.sendMessage.apply(this.client, args);
};

net.user1.orbiter.CustomClient.prototype.setAttribute = function (attrName, 
                                                                  attrValue, 
                                                                  attrScope, 
                                                                  isShared, 
                                                                  evaluate) {
  this.client.setAttribute(attrName, attrValue, attrScope, isShared, evaluate);
};

net.user1.orbiter.CustomClient.prototype.deleteAttribute = function (attrName, attrScope) {
  this.client.deleteAttribute(attrName, attrScope);
};

net.user1.orbiter.CustomClient.prototype.getAttribute = function (attrName, attrScope) {
  return this.client.getAttribute(attrName, attrScope);
};

net.user1.orbiter.CustomClient.prototype.getAttributes = function () {
  return this.client.getAttributes();
};

net.user1.orbiter.CustomClient.prototype.getAttributesByScope = function (scope) {
  return this.client.getAttributesByScope();
};

net.user1.orbiter.CustomClient.prototype.getClientManager = function () {
  return this.client.getClientManager();
};

net.user1.orbiter.CustomClient.prototype.getAccount = function () {
  return this.client.getAccount();
};

net.user1.orbiter.CustomClient.prototype.kick = function () {
  this.client.kick();
};

net.user1.orbiter.CustomClient.prototype.ban = function (duration, reason) {
  this.client.ban(duration, reason);
};

net.user1.orbiter.CustomClient.prototype.observe = function () {
  this.client.observe();
};

net.user1.orbiter.CustomClient.prototype.stopObserving = function () {
  this.client.stopObserving();
};

net.user1.orbiter.CustomClient.prototype.isAdmin = function () {
  return this.client.isAdmin();
};

net.user1.orbiter.CustomClient.prototype.toString = function () {
  return "[object CustomClient, ID: " + this.getClientID() + "]";
};
//==============================================================================
// EVENT UTILITIES
//==============================================================================
/** @class */
net.user1.utils.EventUtil = new Object();

net.user1.utils.EventUtil.migrateListeners = function (oldObject, 
                                                       newObject,
                                                       events,
                                                       thisObj) {
  var len = events.length
  for (var i = 0; i < len; i += 2) {
    if (oldObject != null) {
      oldObject.removeEventListener(events[i], events[i+1], thisObj);
    }
    if (newObject != null) {
      newObject.addEventListener(events[i], events[i+1], thisObj);
    }
  }
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 */
net.user1.orbiter.filters.FilterSet = function () {
  this.filters = new Array();
};
    
net.user1.orbiter.filters.FilterSet.prototype.addFilter = function (filter) {
  this.filters.push(filter);
};
    
net.user1.orbiter.filters.FilterSet.prototype.getFilters = function () {
  return this.filters.slice(0);
};
    
net.user1.orbiter.filters.FilterSet.prototype.toXMLString = function () {
  var s = "<filters>\n";
  
  var filter;
  for (var i = 0; i < this.filters.length; i++) {
    filter = this.filters[i];
    s += filter.toXMLString() + "\n";
  }
  s += "</filters>";
  return s;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 */
net.user1.orbiter.GatewayBandwidth = function () {
  /**
   * @field
   * @type Number
   */
  this.lifetimeRead = 0;
  /**
   * @field
   * @type Number
   */
  this.lifetimeWritten = 0;
  /**
   * @field
   * @type Number
   */
  this.averageRead = 0;
  /**
   * @field
   * @type Number
   */
  this.averageWritten = 0;
  /**
   * @field
   * @type Number
   */
  this.intervalRead = 0;
  /**
   * @field
   * @type Number
   */
  this.intervalWritten = 0;
  /**
   * @field
   * @type Number
   */
  this.maxIntervalRead = 0;
  /**
   * @field
   * @type Number
   */
  this.maxIntervalWritten = 0;
  /**
   * @field
   * @type Number
   */
  this.scheduledWrite = 0;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 */
net.user1.orbiter.Gateway = function () {
  /**
   * @field
   * @type String
  this.id = null;
  /**
   * @field
   * @type String
   */
  this.type = null;
  /**
   * @field
   * @type Object
   */
  this.lifetimeConnectionsByCategory = null;
  /**
   * @field
   * @type Object
   */
  this.lifetimeClientsByType = null;
  /**
   * @field
   * @type Object
   */
  this.lifetimeClientsByUPCVersion = null;
  /**
   * @field
   * @type Object
   */
  this.attributes = null;
  /**
   * @field
   * @type Number
   */
  this.connectionsPerSecond = 0;
  /**
   * @field
   * @type Number
   */
  this.maxConnectionsPerSecond = 0;
  /**
   * @field
   * @type Number
   */
  this.clientsPerSecond = 0;
  /**
   * @field
   * @type Number
   */
  this.maxClientsPerSecond = 0;
  /**
   * @field
   * @type net.user1.orbiter.GatewayBandwidth
   */
  this.bandwidth = null;
};
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
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 */
net.user1.orbiter.ModuleDefinition = function (id, type, source) {
  this.id = id;
  this.type = type;
  this.source = source;
};
//==============================================================================
// MODULE TYPE CONSTANTS
//==============================================================================
/** @class */
net.user1.orbiter.ModuleType = new Object();
/** @constant */
net.user1.orbiter.ModuleType.CLASS = "class";
/** @constant */
net.user1.orbiter.ModuleType.SCRIPT = "script";
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.NodeListSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.nodeList = null;
  this.method = net.user1.orbiter.UPC.GET_NODELIST_SNAPSHOT;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.NodeListSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================         
/**
 * @private
 */    
net.user1.orbiter.snapshot.NodeListSnapshot.prototype.setNodeList = function (value) {
  this.nodeList = value;
}

net.user1.orbiter.snapshot.NodeListSnapshot.prototype.getNodeList = function () {
  if (!this.nodeList) {
    return null;
  }
  return this.nodeList.slice();
};
//==============================================================================
// A COLLECTION OF NUMERIC UTILITIES
//==============================================================================
/** @class */
net.user1.utils.integer = new Object();
/** @constant */
net.user1.utils.integer.MAX_VALUE = Math.pow(2,32) - 1;
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.filters.BooleanGroup
 */
net.user1.orbiter.filters.OrGroup = function () {
  net.user1.orbiter.filters.BooleanGroup.call(this, net.user1.orbiter.filters.BooleanGroupType.OR);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.filters.OrGroup, net.user1.orbiter.filters.BooleanGroup);
/**
 * @private
 */  
net.user1.orbiter.upc.RemoveClientAttr = function (clientID, userID, name, scope) { 
  // Abort if name is invalid.
  if (!net.user1.orbiter.Validator.isValidAttributeName(name)) {
    throw new Error("Cannot delete attribute. Illegal name" + 
                    " (see Validator.isValidAttributeName()): " + name);
  }
  
  // Abort if scope is invalid.
  if (!net.user1.orbiter.Validator.isValidAttributeScope(scope)) {
    throw new Error("Cannot delete client attribute. Illegal scope" + 
             " (see Validator.isValidAttributeScope()): " + scope);
  }
  
  this.method = net.user1.orbiter.UPC.REMOVE_CLIENT_ATTR;
  this.args   = [clientID, userID, name, scope];
};
/**
 * @private
 */  
net.user1.orbiter.upc.RemoveRoomAttr = function (roomID, name) { 
  // Abort if name is invalid.
  if (!net.user1.orbiter.Validator.isValidAttributeName(name)) {
    throw new Error("Cannot delete attribute. Illegal name" + 
                    " (see Validator.isValidAttributeName()): " + name);
  }
  
  this.method = net.user1.orbiter.UPC.REMOVE_ROOM_ATTR;
  this.args   = [roomID, name];
};
/** @function */
net.user1.utils.resolveMemberExpression = function (value) {
  var parts = value.split(".");
  var reference = globalObject;
  for (var i = 0; i < parts.length; i++) {
    reference = reference[parts[i]];
  }
  return reference;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The Room class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.JOIN}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.JOIN_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.LEAVE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.LEAVE_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.ADD_OCCUPANT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.ADD_OBSERVER}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.REMOVE_OBSERVER}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.UPDATE_CLIENT_ATTRIBUTE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.DELETE_CLIENT_ATTRIBUTE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.OCCUPANT_COUNT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.OSERVER_COUNT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.SYNCHRONIZE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.OBSERVE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.OBSERVE_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.STOP_OBSERVING}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.REMOVED}</li> 
<li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.DELETE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.UPDATE}</li> 
<li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.SET_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.AttributeEvent.DELETE_RESULT}</li> 
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.Room = function (id,
                                   roomManager,
                                   messageManager,
                                   clientManager,
                                   accountManager,
                                   log) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);

  // Variables
  this.disposed = false;
  this.id = null;
  this.syncState = null;
  this._clientIsInRoom = false;
  this._clientIsObservingRoom = false;
  this.numOccupants = 0;
  this.numObservers = 0;
  this.defaultClientClass = null;

  // Initialization  
  this.setRoomID(id);
  this.roomManager    = roomManager;
  this.messageManager = messageManager;
  this.clientManager  = clientManager;
  this.accountManager = accountManager;
  this.log = log;

  this.occupantList     = new net.user1.orbiter.ClientSet();
  this.observerList     = new net.user1.orbiter.ClientSet();
  this.attributeManager = new net.user1.orbiter.AttributeManager(this, this.messageManager, this.log);

  this.setSyncState(net.user1.orbiter.SynchronizationState.NOT_SYNCHRONIZED);
}

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.Room, net.user1.events.EventDispatcher);

// =============================================================================
// DEPENDENCIES
// =============================================================================
/** @private */
net.user1.orbiter.Room.prototype.getAttributeManager = function () {
  return this.attributeManager;
};   

// =============================================================================
// ROOM ID MANAGEMENT
// =============================================================================

 /**
  * @private
  */
net.user1.orbiter.Room.prototype.setRoomID = function (roomID) {
  var errorMsg;
  if (!net.user1.orbiter.Validator.isValidResolvedRoomID(roomID)) {
    errorMsg = "Invalid room ID specified during room creation. Offending ID: " + roomID;
    this.log.error(errorMsg);
    throw new Error(errorMsg);
  }
  this.id = roomID;
};
  
net.user1.orbiter.Room.prototype.getRoomID = function () {
  return this.id;
};

net.user1.orbiter.Room.prototype.getSimpleRoomID = function () {
  return net.user1.orbiter.RoomIDParser.getSimpleRoomID(this.id);
};

net.user1.orbiter.Room.prototype.getQualifier = function () {
  return net.user1.orbiter.RoomIDParser.getQualifier(this.id);
};
  
// =============================================================================
// JOIN/LEAVE
// =============================================================================
  
net.user1.orbiter.Room.prototype.join = function (password,
                                                  updateLevels) {
  if (this.disposed) return;
  
  // Client can't join a room the its already in.
  if (this.clientIsInRoom()) {
    this.log.warn(this + "Room join attempt aborted. Already in room.");
    return;
  }
  // Validate the password
  if (password == null) {
    password = "";
  }
  if (!net.user1.orbiter.Validator.isValidPassword(password)) {
    this.log.error(this + "Invalid room password supplied to join(). "
                   + " Join request not sent. See Validator.isValidPassword().");
    return;
  }
  
  // If any update levels are specified, send them before joining.
  if (updateLevels != null) {
    this.setUpdateLevels(updateLevels);
  }

  this.messageManager.sendUPC(net.user1.orbiter.UPC.JOIN_ROOM, 
                              this.getRoomID(), 
                              password);
};
  
net.user1.orbiter.Room.prototype.leave = function () {
  if (this.disposed) return;
  
  if (this.clientIsInRoom()) {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.LEAVE_ROOM, this.getRoomID());
  } else {
    this.log.debug(this + " Leave-room request ignored. Not in room.");
  }
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.doJoin = function () {
  this._clientIsInRoom = true;
  this.fireJoin();
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.doJoinResult = function (status) {
  this.fireJoinResult(status);
};
    
    /**
     * @private
     */
net.user1.orbiter.Room.prototype.doLeave = function () {
  var rid = this.getRoomID();

  // If the client is not observing the room, then dispose
  // of all of the room's information.
  if (!this.clientIsObservingRoom()) {
    this.purgeRoomData();
  }
    
  // Note that the client is no longer in this room.
  this._clientIsInRoom = false;
  this.fireLeave();
}

/**
 * @private
 */
net.user1.orbiter.Room.prototype.doLeaveResult = function (status) {
  this.fireLeaveResult(status);
};
    
//==============================================================================
// MESSAGING
//==============================================================================

net.user1.orbiter.Room.prototype.sendMessage = function (messageName, 
                                                         includeSelf,
                                                         filters) {
  if (this.disposed) return;
  
  // Delegate to RoomManager.sendMessage()
  var rest = Array.prototype.slice.call(arguments).slice(3)
  var roomMan = this.roomManager;
  var args = [messageName, 
             [this.getRoomID()],
             includeSelf,
             filters != null ? filters : null];
  roomMan.sendMessage.apply(roomMan, args.concat(rest));
};

net.user1.orbiter.Room.prototype.addMessageListener = function (message, listener, thisArg) {
  if (this.messageManager != null) {
    this.messageManager.addMessageListener(message,
                                           listener, 
                                           thisArg,
                                           [this.getRoomID()]);
  }
};

net.user1.orbiter.Room.prototype.removeMessageListener = function (message, listener) {
  if (this.messageManager != null) {
    this.messageManager.removeMessageListener(message, 
                                              listener);
  }
};

net.user1.orbiter.Room.prototype.hasMessageListener = function (message,
                                                                listener) {
  // First, get the list of messsage listeners for this message
  var listeners = this.messageManager.getMessageListeners(message);
  var messageListener;
  for (var i = 0; i < listeners.length; i++) {
    messageListener = listeners[i];
    var listenerRoomIDs = messageListener.getForRoomIDs();
    // ===== Run once for each room id =====
    var listenerRoomID;
    for (var j = 0; j < listenerRoomIDs.length; j++) {
      listenerRoomID = listenerRoomIDs[i];
      if (listenerRoomID == this.getRoomID()) {
        return true;
      }
    }
  }
  return false;
};

//==============================================================================
// SYNCHRONIZATION
//==============================================================================
    
/**
 * @private
 */        
net.user1.orbiter.Room.prototype.synchronize = function (manifest) {
  var oldSyncState = this.getSyncState();
  this.log.debug(this + " Begin synchronization.");
  this.setSyncState(net.user1.orbiter.SynchronizationState.SYNCHRONIZING);

  // SYNC ROOM ATTRIBUTES
  this.getAttributeManager().getAttributeCollection().synchronizeScope(net.user1.orbiter.Tokens.GLOBAL_ATTR, manifest.attributes);
  if (this.disposed) {
    return;
  }

  // SYNC OCCUPANT LIST
  var oldOccupantList = this.getOccupantIDs();
  var newOccupantList = [];
  var thisOccupantClientID;
  var thisOccupantUserID;
  var thisOccupant;
  var thisOccupantAccount;
  
  // Add all unknown occupants to the room's occupant list, and
  // synchronize all existing occupants.
  for (var i = manifest.occupants.length; --i >= 0;) {
    thisOccupantClientID = manifest.occupants[i].clientID;
    thisOccupantUserID = manifest.occupants[i].userID;
    
    newOccupantList.push(thisOccupantClientID);
    
    thisOccupant = this.clientManager.requestClient(thisOccupantClientID);
    // Init user account, if any
    thisOccupantAccount = this.accountManager.requestAccount(thisOccupantUserID);
    if (thisOccupantAccount != null) {
      thisOccupant.setAccount(thisOccupantAccount);
    }
    
    // If it's not the current client, update it.
    // The current client obtains its attributes through separate u8s.
    if (!thisOccupant.isSelf()) {
      thisOccupant.synchronize(manifest.occupants[i]);
    }
    
    this.addOccupant(thisOccupant);
    if (this.disposed) {
      return;
    }
  }
  
  // Remove occupants that are now gone...
  var oldClientID;
  for (i = oldOccupantList.length; --i >= 0;) {
    oldClientID = oldOccupantList[i];
    if (net.user1.utils.ArrayUtil.indexOf(newOccupantList, oldClientID) == -1) {
      this.removeOccupant(oldClientID);
      if (this.disposed) {
        return;
      }
    }
  }

  // SYNC OBSERVER LIST
  var oldObserverList = this.getObserverIDs();
  var newObserverList = [];
  var thisObserverClientID;
  var thisObserverUserID;
  var thisObserver;
  var thisObserverAccount;
  
  // Add all unknown observers to the room's observer list, and
  // synchronize all existing observers.
  for (i = manifest.observers.length; --i >= 0;) {
    thisObserverClientID = manifest.observers[i].clientID;
    thisObserverUserID = manifest.observers[i].userID;
    
    newObserverList.push(thisObserverClientID);
    
    thisObserver = this.clientManager.requestClient(thisObserverClientID);
    // Init user account, if any
    thisObserverAccount = this.accountManager.requestAccount(thisObserverUserID);
    if (thisObserverAccount != null) {
      thisObserver.setAccount(thisObserverAccount);
    }
    
    // If it's not the current client, update it.
    // The current client obtains its attributes through separate u8s.
    if (!thisObserver.isSelf()) {
      thisObserver.synchronize(manifest.observers[i]);
    }
    
    this.addObserver(thisObserver);
    if (this.disposed) {
      return;
    }
  }
  
  // Remove observers that are now gone...
  var oldClientID;
  for (i = oldObserverList.length; --i >= 0;) {
    oldClientID = oldObserverList[i]
    if (net.user1.utils.ArrayUtil.indexOf(newObserverList, oldClientID) == -1) {
      this.removeObserver(oldClientID);
      if (this.disposed) {
        return;
      }
    }
  }
  
  // UPDATE CLIENT COUNTS
  //   If a client list is available, use its length to calculate the
  //   client count. That way, the list length and the "get count" method
  //   return values will be the same (e.g., getOccupants().length and
  //   getNumOccupants()). Otherwise, rely on the server's reported count.
  var levels = this.clientManager.self().getUpdateLevels(this.getRoomID());
  if (levels.occupantList) {
    this.setNumOccupants(this.occupantList.length());
  } else if (levels.occupantCount) {
    this.setNumOccupants(manifest.occupantCount);
  }
  if (levels.observerList) {
    this.setNumObservers(this.observerList.length());
  } else if (levels.observerCount) {
    this.setNumObservers(manifest.observerCount);
  }
  
  // Update sync state 
  this.setSyncState(oldSyncState);
  
  // Tell listeners that synchronization is complete
  this.fireSynchronize(net.user1.orbiter.Status.SUCCESS);
}
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.setSyncState = function (newSyncState) {
  this.syncState = newSyncState;
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.updateSyncState = function () {
  if (this.disposed) {
    this.setSyncState(net.user1.orbiter.SynchronizationState.NOT_SYNCHRONIZED);
  } else {
    if (this.roomManager.hasObservedRoom(this.getRoomID()) 
        || this.roomManager.hasOccupiedRoom(this.getRoomID())
        || this.roomManager.hasWatchedRoom(this.getRoomID())) {
      this.setSyncState(net.user1.orbiter.SynchronizationState.SYNCHRONIZED);
    } else {
      this.setSyncState(net.user1.orbiter.SynchronizationState.NOT_SYNCHRONIZED);
    }
  }
}

net.user1.orbiter.Room.prototype.getSyncState = function () {
  return this.syncState;
};

//==============================================================================
// UPDATE LEVELS
//==============================================================================

net.user1.orbiter.Room.prototype.setUpdateLevels = function (updateLevels) {
  if (this.messageManager) {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.SET_ROOM_UPDATE_LEVELS,
                                this.getRoomID(),
                                updateLevels.toInt());
  }
};

//==============================================================================
// OBSERVATION
//==============================================================================
   
net.user1.orbiter.Room.prototype.observe = function (password,
                                                     updateLevels) {
  if (this.disposed) return;
  
  this.roomManager.observeRoom(this.getRoomID(), 
                               password,
                               updateLevels);
};
  
   
net.user1.orbiter.Room.prototype.stopObserving = function () {
  if (this.disposed) return;
  
  if (this.clientIsObservingRoom()) {
    this.messageManager.sendUPC(net.user1.orbiter.UPC.STOP_OBSERVING_ROOM, this.getRoomID());
  } else {
    this.log.debug(this + " Stop-observing-room request ignored. Not observing room.");
  }
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.doObserve = function () {
  this._clientIsObservingRoom = true;
  this.fireObserve();
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.doObserveResult = function (status) {
  this.fireObserveResult(status);
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.doStopObserving = function () {
  var rid = this.getRoomID();

  // If the client is not in the room, then we dispose
  // of all of the room's information.
  if (!this.clientIsInRoom()) {
    this.purgeRoomData();
  }
    
  this._clientIsObservingRoom = false;
  
  this.fireStopObserving();
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.doStopObservingResult = function (status) {
  this.fireStopObservingResult(status);
}
    
//==============================================================================
// OCCUPANT MANAGEMENT
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.Room.prototype.addOccupant = function (client) {
  // Don't add the client if it's already in the list.
  if (this.occupantList.contains(client)) {
      this.log.info(this + " ignored addOccupant() request. Occupant list" +
                    " already contains client:" + client + ".");
      return;
  }

  // Add the client
  this.occupantList.add(client);
  
  // Update the number of clients in the room
  this.setNumOccupants(this.occupantList.length());  
  
  // Register for attribute change events
  if (!this.observerList.contains(client)) {
    this.addClientAttributeListeners(client);
  }
  
  // Tell listeners an occupant was added
  this.fireAddOccupant(client.getClientID());  
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.removeOccupant = function (clientID) {
  var client = this.occupantList.removeByClientID(clientID);
  var clientFound = client != null;
  
  // Update the number of clients in the room
  this.setNumOccupants(this.occupantList.length());
  
  // Unregister for attribute change events
  if (!this.observerList.contains(client)) {
    this.removeClientAttributeListeners(client);
  }
  
  // Tell listeners an occupant was removed
  var customClient = client.getCustomClient(this.getRoomID());
  this.fireRemoveOccupant(customClient != null ? customClient : client);

  if (!clientFound) {
    this.log.debug(this + " could not remove occupant: " 
                   + clientID + ". No such client in the room's occupant list.");
  }
};

net.user1.orbiter.Room.prototype.getOccupantIDs = function () {
  if (this.disposed) return null;
  
  return this.occupantList.getAllIDs();
}

net.user1.orbiter.Room.prototype.getOccupants = function () {
  if (this.disposed) return null;
  
  var occupants = this.occupantList.getAll();
  var occupantsList = new Array();
  var customClient;
  var occupant;
  
  for (var clientID in occupants) {
    occupant = occupants[clientID];
    customClient = occupant.getCustomClient(this.getRoomID());
    if (customClient != null) {
      occupantsList.push(customClient);
    } else {
      occupantsList.push(occupant);
    }
  }
  return occupantsList;
}
        
/**
 * @private
 */        
net.user1.orbiter.Room.prototype.getOccupantsInternal = function () {
  return this.occupantList.getAll();
}

net.user1.orbiter.Room.prototype.clientIsInRoom = function (clientID) {
  if (this.disposed) return false;
      
  if (clientID == null) {
    return this._clientIsInRoom;
  }
  return this.occupantList.containsClientID(clientID);
};
    
net.user1.orbiter.Room.prototype.getNumOccupants = function () {
  if (this.disposed) return 0;
  
  var levels = this.clientManager.self().getUpdateLevels(this.getRoomID());;
  if (levels != null) {
    if (levels.occupantCount || levels.occupantList) {
      return this.numOccupants;
    } else {
      this.log.warn(this + " getNumOccupants() called, but no occupant count is " +
                    "available. To enable occupant count, turn on occupant list" +
                    " updates or occupant count updates via the Room's setUpdateLevels()" +
                    " method.");
      return 0;
    }
  } else {
    this.log.debug(this + " getNumOccupants() called, but the current client's update"
                   + " levels for the room are unknown. To determine the room's"
                   + " occupant count, first join or observe the room.");
    return 0;
  }
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.setNumOccupants = function (newNumOccupants) {
  var oldNumClients = this.numOccupants;
  this.numOccupants = newNumOccupants;

  // Tell listeners that the number of clients in the room has changed.
  if (oldNumClients != newNumOccupants) {
    this.fireOccupantCount(newNumOccupants);
  }
};
    
//==============================================================================
// ROOM SETTINGS
//==============================================================================

net.user1.orbiter.Room.prototype.getRoomSettings = function () {
  if (this.disposed) return null;
  
  var settings = new net.user1.orbiter.RoomSettings();
  var maxClients = this.getAttribute(net.user1.orbiter.Tokens.MAX_CLIENTS_ATTR);
  var removeOnEmpty = this.getAttribute(net.user1.orbiter.Tokens.REMOVE_ON_EMPTY_ATTR);
  
  settings.maxClients = maxClients == null ? null : maxClients;
  switch (removeOnEmpty) {
    case null:
      settings.removeOnEmpty = null;
      break;
      
    case "true":
      settings.removeOnEmpty = true;
      break;
      
    case "false":
      settings.removeOnEmpty = false;
      break;
  }
  
  return settings;
};

net.user1.orbiter.Room.prototype.setRoomSettings = function (settings) {
  if (this.disposed) return;
  
  if (settings.maxClients != null) {
    this.setAttribute(net.user1.orbiter.Tokens.MAX_CLIENTS_ATTR, settings.maxClients.toString());
  } 
  if (settings.password != null) {
    this.setAttribute(net.user1.orbiter.Tokens.PASSWORD_ATTR, settings.password);
  } 
  if (settings.removeOnEmpty != null) {
    this.setAttribute(net.user1.orbiter.Tokens.REMOVE_ON_EMPTY_ATTR, settings.removeOnEmpty.toString());
  } 
};
    
//==============================================================================
// OBSERVER MANAGEMENT
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.Room.prototype.addObserver = function (client) {
  // Don't add the client if it's already in the list.
  if (this.observerList.contains(client)) {
      this.log.info(this + " ignored addObserver() request. Observer list" +
                    " already contains client:" + client + ".");
      return;
  }

  // Add the client
  this.observerList.add(client);
  
  // Update the number of clients in the room
  this.setNumObservers(this.observerList.length());  
  
  // Register for attribute change events
  if (!this.occupantList.contains(client)) {
    this.addClientAttributeListeners(client);
  }
  
  // Tell listeners an observer was added
  this.fireAddObserver(client.getClientID());  
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.removeObserver = function (clientID) {
  var client = this.observerList.removeByClientID(clientID);
  var clientFound = client != null;
  
  // Update the number of clients in the room
  this.setNumObservers(this.observerList.length());
  
  // Unregister for attribute change events
  if (!this.occupantList.contains(client)) {
    this.removeClientAttributeListeners(client);
  }
  
  // Tell listeners an observer was removed
  var customClient = client.getCustomClient(this.getRoomID());
  this.fireRemoveObserver(customClient != null ? customClient : client);

  if (!clientFound) {
    this.log.debug(this + " could not remove observer: " 
                   + clientID + ". No such client in the room's observer list.");
  }
};

net.user1.orbiter.Room.prototype.getObserverIDs = function () {
  if (this.disposed) return null;
  
  return this.observerList.getAllIDs();
};

net.user1.orbiter.Room.prototype.getObservers = function () {
  if (this.disposed) return null;
  
  var observers = this.observerList.getAll();
  var observersList = new Array();
  var customClient;
  var observer;
  
  for (var clientID in observers) {
    observer = observers[clientID];
    customClient = observer.getCustomClient(this.getRoomID());
    if (customClient != null) {
      observersList.push(customClient);
    } else {
      observersList.push(observer);
    }
  }
  return observersList;
};
    
/**
 * @private
 */        
net.user1.orbiter.Room.prototype.getObserversInternal = function () {
  return this.observerList.getAll();
}

net.user1.orbiter.Room.prototype.clientIsObservingRoom = function (clientID) {
  if (this.disposed) return false;
  
  if (clientID == null) {
    return this._clientIsObservingRoom;
  }
  return this.observerList.containsClientID(clientID);
}
    
net.user1.orbiter.Room.prototype.getNumObservers = function () {
  if (this.disposed) return 0;
  
  var levels = this.clientManager.self().getUpdateLevels(this.getRoomID());
  if (levels != null) {
    if (levels.observerCount || levels.observerList) {
      return this.numObservers;
    } else {
      this.log.warn(this + " getNumObservers() called, but no observer count is " +
               "available. To enable observer count, turn on observer list" +
               " updates or observer count updates via the Room's setUpdateLevels()" +
               " method.");
      return 0;
    }
  } else {
    this.log.warn(this + " getNumObservers() called, but the current client's update "
      + " levels for the room are unknown. Please report this issue to union@user1.net.");
    return 0;
  }
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.setNumObservers = function (newNumObservers) {
  var oldNumClients = this.numObservers;
  this.numObservers = newNumObservers;

  // Tell listeners that the number of clients in the room has changed.
  if (oldNumClients != newNumObservers) {
    this.fireObserverCount(newNumObservers);
  }
};
    
//==============================================================================
// CLIENT ACCESS
//==============================================================================

net.user1.orbiter.Room.prototype.getClient = function (id) {
  if (this.disposed) return null;
  
  var customClient;
  var client = this.occupantList.getByClientID(id);
  client = (client == null) ? this.observerList.getByClientID(id) : client;
  
  if (client != null) {
    customClient = client.getCustomClient(this.getRoomID());
  }
  return customClient == null ? client : customClient;
};
    
//==============================================================================
// CLIENT ATTRIBUTE LISTENERS
//==============================================================================
/** private */
net.user1.orbiter.Room.prototype.addClientAttributeListeners = function (client) {
  client.addEventListener(net.user1.orbiter.AttributeEvent.UPDATE, this.updateClientAttributeListener, this);
  client.addEventListener(net.user1.orbiter.AttributeEvent.DELETE, this.deleteClientAttributeListener, this);
};
    
/** private */
net.user1.orbiter.Room.prototype.removeClientAttributeListeners = function (client) {
  client.removeEventListener(net.user1.orbiter.AttributeEvent.UPDATE, this.updateClientAttributeListener, this);
  client.removeEventListener(net.user1.orbiter.AttributeEvent.DELETE, this.deleteClientAttributeListener, this);
};
    
/** private */
net.user1.orbiter.Room.prototype.updateClientAttributeListener = function (e) {
  var attr = e.getChangedAttr();
  var client = e.target;
  var customClient = client.getCustomClient(this.getRoomID());
  
  this.fireUpdateClientAttribute(customClient == null ? client : customClient,
                                 attr.scope, attr.name, attr.value, attr.oldValue);
};
    
/** private */
net.user1.orbiter.Room.prototype.deleteClientAttributeListener = function (e) {
  var attr = e.getChangedAttr();
  var client = e.target;
  var customClient = client.getCustomClient(this.getRoomID());
  
  this.fireDeleteClientAttribute(customClient == null ? client : customClient,
                                 attr.scope, attr.name, attr.value);
}
    
//==============================================================================
// CLIENT CLASS
//==============================================================================

net.user1.orbiter.Room.prototype.setDefaultClientClass = function (defaultClass) {
  this.defaultClientClass = defaultClass;
};
    
net.user1.orbiter.Room.prototype.getDefaultClientClass = function () {
  return this.defaultClientClass;
}
    
//==============================================================================
// ATTRIBUTES
//==============================================================================

net.user1.orbiter.Room.prototype.setAttribute = function (attrName,
                                  attrValue, 
                                  isShared,
                                  isPersistent,
                                  evaluate) {
  if (this.disposed) return;
  
  if (isShared !== false) {
    isShared = true;
  }
  
  // Create an integer to hold the attribute options.
  var attrOptions = (isShared     ? net.user1.orbiter.AttributeOptions.FLAG_SHARED     : 0) 
                    | (isPersistent ? net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT : 0)
                    | (evaluate     ? net.user1.orbiter.AttributeOptions.FLAG_EVALUATE   : 0);
  this.attributeManager.setAttribute(new net.user1.orbiter.upc.SetRoomAttr(attrName, attrValue, attrOptions, this.getRoomID()));
}
  
net.user1.orbiter.Room.prototype.deleteAttribute = function (attrName) {
  if (this.disposed) return;
  
  var deleteRequest = new net.user1.orbiter.upc.RemoveRoomAttr(this.getRoomID(), attrName);
  this.attributeManager.deleteAttribute(deleteRequest);
};
  
net.user1.orbiter.Room.prototype.getAttribute = function (attrName) {
  if (this.disposed) return null;
  
  return this.attributeManager.getAttribute(attrName);
};
  
net.user1.orbiter.Room.prototype.getAttributes = function () {
  if (this.disposed) return null;
  
  // Room attributes are considered global
  return this.attributeManager.getAttributesByScope(net.user1.orbiter.Tokens.GLOBAL_ATTR);
}

// =============================================================================
// ROOM MODULES
// =============================================================================

net.user1.orbiter.Room.prototype.sendModuleMessage = function (messageName, 
                                                               messageArguments) {
  if (this.disposed) return;
  
  var sendupcArgs = [net.user1.orbiter.UPC.SEND_ROOMMODULE_MESSAGE, this.getRoomID(), messageName];
  
  for (var arg in messageArguments) {
    sendupcArgs.push(arg + "|" + messageArguments[arg]);
  }
        
  this.messageManager.sendUPC.apply(this.messageManager, sendupcArgs);
};

// =============================================================================
// ROOM REMOVAL
// =============================================================================

net.user1.orbiter.Room.prototype.remove = function (password) {
  if (this.disposed) return;
  
  this.roomManager.removeRoom(this.getRoomID(), password);
};

// =============================================================================
// TOSTRING
// =============================================================================

net.user1.orbiter.Room.prototype.toString = function () {
  return "[ROOM id: " + this.getRoomID() + "]";
};
    
    
// =============================================================================
// EVENT DISPATCHING
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireJoin = function () {
  if (this.log) this.log.info(this + " Room joined.");

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.JOIN);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireJoinResult = function (status) {
  if (this.log) this.log.info(this + " Join result: " + status);

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.JOIN_RESULT, 
                                  null,  null, status);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireLeave = function () {
  if (this.log) this.log.info(this + " Room left.");
  
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.LEAVE);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireLeaveResult = function (status) {
  if (this.log) this.log.info(this + " Leave result: " + status);
  
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.LEAVE_RESULT, 
                                  null, null, status);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireAddOccupant = function (id) {
  if (this.log) this.log.info(this + " Added occupant: [" + id + "].");

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.ADD_OCCUPANT, 
                                  this.getClient(id),
                                  id);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireRemoveOccupant = function (client) {
  if (this.log) this.log.info(this + " Removed occupant: " + client + ".");

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT,
                                  client,
                                  client.getClientID());
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireAddObserver = function (id) {
  if (this.log) this.log.info(this + " Added observer: [" + id + "].");

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.ADD_OBSERVER, 
                                  this.getClient(id),
                                  id);
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireRemoveObserver = function (client) {
  if (this.log) this.log.info(this + " Removed observer: " + client + ".");

  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.REMOVE_OBSERVER,
                                  client,
                                  client.getClientID());
  this.dispatchEvent(e);
};
  
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireUpdateClientAttribute = function (client, 
                                             scope,
                                             attrName,
                                             attrVal, 
                                             oldVal) {
  if (this.log) this.log.info(this + " Client attribute updated on " + client + "."
            + " Attribute [" + attrName + "] is now: [" 
            + attrVal + "]. Old value was: [" + oldVal + "].");

  var changedAttr = new net.user1.orbiter.Attribute (attrName, 
                                             attrVal, 
                                             oldVal, 
                                             scope);
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.UPDATE_CLIENT_ATTRIBUTE,
                                  client,
                                  client.getClientID(), 
                                  null, 
                                  changedAttr);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireDeleteClientAttribute = function (client, 
                                                 scope,
                                                 attrName,
                                                 attrValue) {
  if (this.log) this.log.info(this + " Client attribute deleted from " + client + "."
           + " Deleted attribute: [" + attrName + "].");

  var deletedAttr = new net.user1.orbiter.Attribute(attrName, attrValue, null, scope);

  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.DELETE_CLIENT_ATTRIBUTE,
                                  client,
                                  client.getClientID(),
                                  null,
                                  deletedAttr);
  this.dispatchEvent(e);
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireOccupantCount = function (newNumClients) {
  if (this.log) this.log.info(this + " New occupant count: " + newNumClients);

  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.OCCUPANT_COUNT, 
                             null, null, null, null, newNumClients);
  this.dispatchEvent(e);
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireObserverCount = function (newNumClients) {
  if (this.log) this.log.info(this + " New observer count: " + newNumClients);

  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.OBSERVER_COUNT, 
                             null, null, null, null, newNumClients);
  this.dispatchEvent(e);
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireSynchronize = function (status) {
  if (this.log) this.log.info(this + " Synchronization complete.");
  
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.SYNCHRONIZE,
                                          null, null, status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireObserve = function () {
  if (this.log) this.log.info(this + " Room observed.");
  
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.OBSERVE);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireObserveResult = function (status) {
  if (this.log) this.log.info(this + " Observe result: " + status);
  
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.OBSERVE_RESULT, null, null, status);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireStopObserving = function () {
  if (this.log) this.log.info(this + " Observation stopped.");
  
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.STOP_OBSERVING);
  this.dispatchEvent(e);
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireStopObservingResult = function (status) {
  if (this.log) this.log.info(this + "Stop observing result:  " + 
           status);
  
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT,
                                  null, null, status);
  this.dispatchEvent(e);
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.fireRemoved = function () {
  // Trigger event on listeners.
  var e = new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.REMOVED);
  this.dispatchEvent(e);
};

//==============================================================================
// CLEANUP and DISPOSAL
//==============================================================================
/** private */
net.user1.orbiter.Room.prototype.purgeRoomData = function () {
  if (this.disposed) return;
  
  // Clear the client lists
  this.log.debug(this + " Clearing occupant list.");
  for (var occupantID in this.occupantList.getAll()) {
    this.removeClientAttributeListeners(this.occupantList.getByClientID(occupantID));
  }
  this.occupantList.removeAll();
  
  this.log.debug(this + " Clearing observer list.");
  for (var observerID in this.observerList.getAll()) {
    this.removeClientAttributeListeners(this.observerList.getByClientID(observerID));
  }
  this.observerList.removeAll();
      
  // Clear room attributes.
  this.log.debug(this + " Clearing room attributes.");
  this.attributeManager.removeAll();
};
    
/**
 * @private
 */
net.user1.orbiter.Room.prototype.shutdown = function () {
  if (this.disposed) return;
  
  // Store a temp reference to the log for use in this method after
  // the room has released all its resources.
  var theLog = this.log;
  
  theLog.debug(this + " Shutdown started.");

  // Notify the room's listeners that the client left the room.
  if (this.clientIsInRoom()) {
    theLog.info(this + " Current client is in the room. Forcing the client to leave...");
    this.doLeave();
  }

  // Notify the room's listeners that the client stopped observing the room.
  if (this.clientIsObservingRoom()) {
    theLog.info(this + " Current client is observing the room. Forcing the client to stop observing...");
    this.doStopObserving();
  }
  
  theLog.info(this + " Dereferencing resources.");
  
  // Dereference objects.
  this.purgeRoomData();
  
  this.attributeManager.dispose();
  // Fire removed before nulling the MessageManager object so that listeners have a
  // last chance to respond by communicating with the server (or by
  // removing themselves from the connection's listener list)
  this.fireRemoved();  
  this.dispose();

  theLog.info(this + " Shutdown complete.");
}

/**
 * @private
 */
net.user1.orbiter.Room.prototype.dispose = function () {
  this.log = null;
  this.syncState = null;
  this.occupantList = null;
  this.observerList = null;
  this.attributeManager = null;
  this.numOccupants = 0;
  this.defaultClientClass = null
  this.messageManager = null;
  this.roomManager = null;
  this.disposed = true;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 */
net.user1.orbiter.RoomClassRegistry = function () {
  this.registry = new Object();
};

net.user1.orbiter.RoomClassRegistry.prototype.setRoomClass = function (roomID, roomClass) {
  this.registry[roomID] = roomClass;
};

net.user1.orbiter.RoomClassRegistry.prototype.clearRoomClass = function (roomID) {
  delete this.registry[roomID];
};


net.user1.orbiter.RoomClassRegistry.prototype.getRoomClass = function (roomID) {
  return this.registry[roomID] ? this.registry[roomID] : net.user1.orbiter.Room;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.RoomEvent = function (type,
                                        client,
                                        clientID, 
                                        status, 
                                        changedAttr, 
                                        numClients,
                                        roomID) {
  net.user1.events.Event.call(this, type);
  
  this.client = client;
  this.clientID = clientID == "" ? null : clientID;
  this.status = status;
  this.changedAttr = changedAttr;
  this.numClients = numClients;
  this.roomID = roomID;
};


//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.RoomEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.RoomEvent.JOIN = "JOIN";
/** @constant */
net.user1.orbiter.RoomEvent.JOIN_RESULT = "JOIN_RESULT";
/** @constant */
net.user1.orbiter.RoomEvent.LEAVE = "LEAVE";
/** @constant */
net.user1.orbiter.RoomEvent.LEAVE_RESULT = "LEAVE_RESULT";
/** @constant */
net.user1.orbiter.RoomEvent.OBSERVE = "OBSERVE";
/** @constant */
net.user1.orbiter.RoomEvent.OBSERVE_RESULT = "OBSERVE_RESULT";    
/** @constant */
net.user1.orbiter.RoomEvent.STOP_OBSERVING = "STOP_OBSERVING";
/** @constant */
net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT = "STOP_OBSERVING_RESULT";        
/** @constant */
net.user1.orbiter.RoomEvent.SYNCHRONIZE = "SYNCHRONIZE";
/** @constant */
net.user1.orbiter.RoomEvent.UPDATE_CLIENT_ATTRIBUTE = "UPDATE_CLIENT_ATTRIBUTE";
/** @constant */
net.user1.orbiter.RoomEvent.DELETE_CLIENT_ATTRIBUTE = "DELETE_CLIENT_ATTRIBUTE";
/** @constant */
net.user1.orbiter.RoomEvent.ADD_OCCUPANT = "ADD_OCCUPANT";
/** @constant */
net.user1.orbiter.RoomEvent.REMOVE_OCCUPANT = "REMOVE_OCCUPANT";
/** @constant */
net.user1.orbiter.RoomEvent.ADD_OBSERVER = "ADD_OBSERVER";
/** @constant */
net.user1.orbiter.RoomEvent.REMOVE_OBSERVER = "REMOVE_OBSERVER";
/** @constant */
net.user1.orbiter.RoomEvent.OCCUPANT_COUNT = "OCCUPANT_COUNT";
/** @constant */
net.user1.orbiter.RoomEvent.OBSERVER_COUNT = "OBSERVER_COUNT";
/** @constant */
net.user1.orbiter.RoomEvent.REMOVED = "REMOVED";


net.user1.orbiter.RoomEvent.prototype.getRoomID = function () {
  return this.roomID;
};

net.user1.orbiter.RoomEvent.prototype.getClient = function () {
  return this.client;
};

net.user1.orbiter.RoomEvent.prototype.getClientID = function () {
  return this.clientID;
};

net.user1.orbiter.RoomEvent.prototype.getStatus = function () {
  return this.status;
};

net.user1.orbiter.RoomEvent.prototype.getNumClients = function () {
  return this.numClients;
};

net.user1.orbiter.RoomEvent.prototype.getChangedAttr = function () {
  return this.changedAttr;
};

net.user1.orbiter.RoomEvent.prototype.toString = function () {
  return "[object RoomEvent]";
};  
//==============================================================================
// CLASS DECLARATION
//==============================================================================
  /**
   * @private
   */  
net.user1.orbiter.RoomList = function () {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
    
  this.rooms = new Array();
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.RoomList, net.user1.events.EventDispatcher);  

//==============================================================================    
// INSTANCE METHODS
//============================================================================== 
net.user1.orbiter.RoomList.prototype.add = function (room) {
  if (!this.contains(room)) {
    this.rooms.push(room);
    this.dispatchAddItem(room);
    return room;
  } else {
    return null;
  }
};

net.user1.orbiter.RoomList.prototype.remove = function (room) {
  var index = net.user1.utils.ArrayUtil.indexOf(this.rooms, room);
  if (index != -1) {
    this.rooms.splice(index, 1)[0];
    this.dispatchRemoveItem(room);
    return room;
  } else {
    return null;
  }
};

net.user1.orbiter.RoomList.prototype.removeAll = function () {
  var room;
  for (var i = this.rooms.length; --i >= 0; ) {
    room = this.rooms.splice(i, 1)[0];
    this.dispatchRemoveItem(room);
  }
};

net.user1.orbiter.RoomList.prototype.removeByRoomID = function (roomID) {
  var room;
  for (var i = this.rooms.length; --i >= 0; ) {
    if (this.rooms[i].getRoomID() == roomID) {
      room = this.rooms.splice(i, 1)[0];
      this.dispatchRemoveItem(room);
      return room;
    }
  }
  return null;
};

net.user1.orbiter.RoomList.prototype.contains = function (room) {
  return net.user1.utils.ArrayUtil.indexOf(this.rooms, room) != -1;
}

net.user1.orbiter.RoomList.prototype.containsRoomID = function (roomID) {
  if (roomID == "" || roomID == null) {
    return false;
  }
  return this.getByRoomID(roomID) != null;
}

net.user1.orbiter.RoomList.prototype.getByRoomID = function (roomID) {
  var room;
  for (var i = this.rooms.length; --i >= 0;) {
    room = this.rooms[i];
    if (room.getRoomID() == roomID) {
      return room;
    }
  }
  return null;
};

net.user1.orbiter.RoomList.prototype.getAll = function () {
  return this.rooms.slice(0);
};

net.user1.orbiter.RoomList.prototype.length = function () {
  return this.rooms.length;
}

net.user1.orbiter.RoomList.prototype.dispatchAddItem = function (item) {
  this.dispatchEvent(new net.user1.orbiter.CollectionEvent(net.user1.orbiter.CollectionEvent.ADD_ITEM, item));
};

net.user1.orbiter.RoomList.prototype.dispatchRemoveItem = function (item) {
  this.dispatchEvent(new net.user1.orbiter.CollectionEvent(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, item));
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.RoomListSnapshot = function (qualifier, 
                                                        recursive) {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.roomList = null;
  this.qualifier = null;
  this.recursive = null;
  this.method = net.user1.orbiter.UPC.GET_ROOMLIST_SNAPSHOT;
  this.args   = [qualifier,
                 recursive];
};
    
//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.RoomListSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================                
/**
 * @private
 */    
net.user1.orbiter.snapshot.RoomListSnapshot.prototype.setRoomList = function (value) {
  this.roomList = value;
};

net.user1.orbiter.snapshot.RoomListSnapshot.prototype.getRoomList = function () {
  if (!this.roomList) {
    return null;
  }
  return this.roomList.slice();
};
    
net.user1.orbiter.snapshot.RoomListSnapshot.prototype.getQualifier = function () {
  return this.qualifier;
};
        
    /**
     * @private
     */        
net.user1.orbiter.snapshot.RoomListSnapshot.prototype.setQualifier = function (value) {
  this.qualifier = value;
};
    
net.user1.orbiter.snapshot.RoomListSnapshot.prototype.getRecursive = function () {
  return this.recursive;
};
        
/**
 * @private
 */    
net.user1.orbiter.snapshot.RoomListSnapshot.prototype.setRecursive = function (value) {
  this.recursive = value;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The RoomManager class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.WATCH_FOR_ROOMS_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.STOP_WATCHING_FOR_ROOMS_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.CREATE_ROOM_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.REMOVE_ROOM_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.ROOM_ADDED}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.ROOM_REMOVED}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomManagerEvent.ROOM_COUNT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.JOIN_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.LEAVE_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.OBSERVE_RESULT}</li>   
<li class="fixedFont">{@link net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT}</li>   
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.RoomManager = function (orbiter) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
    
  this.watchedQualifiers = [];
  
  this.cachedRooms = new net.user1.orbiter.RoomList();
  this.occupiedRooms = new net.user1.orbiter.RoomList();
  this.observedRooms = new net.user1.orbiter.RoomList();
  this.watchedRooms = new net.user1.orbiter.RoomList();
  
  this.cachedRooms.addEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.occupiedRooms.addEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.occupiedRooms.addEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.observedRooms.addEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.observedRooms.addEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.watchedRooms.addEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.watchedRooms.addEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  
  this.orbiter = orbiter;

  this.addEventListener(net.user1.orbiter.RoomManagerEvent.WATCH_FOR_ROOMS_RESULT,
                        this.watchForRoomsResultListener, this);
  this.addEventListener(net.user1.orbiter.RoomManagerEvent.STOP_WATCHING_FOR_ROOMS_RESULT,
                        this.stopWatchingForRoomsResultListener, this);
                                                 

  this.roomClassRegistry = new net.user1.orbiter.RoomClassRegistry();
                             
  // Store a reference to the this.log.
  this.log = this.orbiter.getLog();
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.RoomManager, net.user1.events.EventDispatcher);    

//==============================================================================
// ROOM CREATION AND REMOVAL
//==============================================================================
/**
* @param attributes An array of JavaScript objects that describes the initial room 
* attributes for the room in the following format (note that this format differs
* from the XML format used for createRoom() by Reactor, Union's Flash client framework):
* 
* [
*   attribute: {
*     name:"attrName1",
*     value:"attrValue1",
*     shared:true,
*     persistent:false,
*     immutable:false
*   },
*   attribute: {
*     name:"attrName2",
*     value:"attrValue2",
*     shared:true,
*     persistent:false,
*     immutable:false
*   }
* ]
* </listing>
*/

net.user1.orbiter.RoomManager.prototype.createRoom = function (roomID, 
                                                               roomSettings,
                                                               attributes,
                                                               modules) {
  // GET ROOM SETTINGS
  if (roomSettings == null) {
    roomSettings = new net.user1.orbiter.RoomSettings();
  }
  
  // GET ROOM MODULES
  if (modules == null) {
    modules = new net.user1.orbiter.RoomModules();
  }

  // ERROR CHECKING
  
  // Abort if invalid module name found.
  var moduleIDs = modules.getIdentifiers();
  var moduleID;
  for (var i = moduleIDs.length; --i >= 0;) {
    var moduleID = moduleIDs[i];
    if (!net.user1.orbiter.Validator.isValidModuleName(moduleID)) {
      throw new Error("[ROOM_MANAGER] createRoom() failed. Illegal room module name: ["
                      + moduleID + "]. See net.user1.orbiter.Validator.isValidModuleName().");
    }
  }

  // If a roomID is specified, we must validated it
  if (roomID != null) {
    // Abort if the supplied id can't be resolved to a single room
    if (!net.user1.orbiter.Validator.isValidResolvedRoomID(roomID)) {
      throw new Error("[ROOM_MANAGER] createRoom() failed. Illegal room id: ["
                + roomID + "]. See net.user1.orbiter.Validator.isValidResolvedRoomID().");
    }
  }

  // MAKE THE ROOM LOCALLY
  
  // Send "" as the roomID if no roomID is specified. When the server
  // receives a request to create a roomID of "", it auto-generates
  // the id, and returns it via RoomManagerEvent.CREATE_ROOM_RESULT.
  if (roomID == null) {
    // Don't make the local room. Instead wait for the server to
    // report the new room via u39.
    roomID = "";
  } else {
    // Make the local room.
    this.addCachedRoom(roomID);
  }

  // TELL THE SERVER TO MAKE THE ROOM

  // Create attributes
  if (attributes != null) {
    var attr;
    var attrArg = "";
    for (var i = 0; i < attributes.length; i++) {
      attr = attributes[i];
      attrSettings = 0;
      attrSettings |= attr.shared ? AttributeOptions.FLAG_SHARED : 0;
      attrSettings |= attr.persistent ? AttributeOptions.FLAG_PERSISTENT : 0;
      attrSettings |= attr.immutable ? AttributeOptions.FLAG_IMMUTABLE : 0;
      attrArg += attr.NAME 
              + net.user1.orbiter.Tokens.RS + attr.VALUE
              + net.user1.orbiter.Tokens.RS + attrSettings.toString();
              
      if (i < attributes.length-1) {
        attrArg += Tokens.RS;
      }
    }
  }

  // Send the create room request to the server.
  var msgMan = this.orbiter.getMessageManager();
  msgMan.sendUPC(net.user1.orbiter.UPC.CREATE_ROOM, 
                 roomID, 
                 roomSettings.serialize(), 
                 attrArg, 
                 modules.serialize());

  // RETURN A REFERENCE TO THE LOCAL ROOM, IF ONE WAS CREATED
  if (roomID == "") {
    return null;
  } else {
    return this.getRoom(roomID);
  }
};

net.user1.orbiter.RoomManager.prototype.removeRoom = function (roomID, password) {
  // Quit if no room specified.
  if (roomID == null || !net.user1.orbiter.Validator.isValidResolvedRoomID(roomID)) {
    throw new Error("Invalid room id supplied to removeRoom(): ["
                    + roomID + "]. Request not sent.");
  }
  
  if (password == null) {
    password = "";
  }

  var msgMan = this.orbiter.getMessageManager();  
  msgMan.sendUPC(net.user1.orbiter.UPC.REMOVE_ROOM,
                 roomID,
                 password);
};

//==============================================================================
// ROOM OBSERVATION
//==============================================================================

net.user1.orbiter.RoomManager.prototype.observeRoom = function (roomID,
                                                                password,
                                                                updateLevels) {
  var theRoom;
  
  // If the room is not valid, quit
  if (!net.user1.orbiter.Validator.isValidResolvedRoomID(roomID)) {
    throw new Error("Invalid room id supplied to observeRoom(): ["
              + roomID + "]. Request not sent."
              + " See net.user1.orbiter.Validator.isValidResolvedRoomID().");
  }

  // Try to get a reference to the room
  theRoom = this.getRoom(roomID);
    
  // If the room exists
  if (theRoom != null) {
    if (theRoom.clientIsObservingRoom()) {
      this.log.warn("[ROOM_MANAGER] Room observe attempt ignored. Already observing room: '" 
               + roomID + "'.");
      return null;
    } 
  } else {
    // Make the local room
    theRoom = this.addCachedRoom(roomID);
  }
    
  // Validate the password
  if (password == null) {
    password = "";
  }
  if (!net.user1.orbiter.Validator.isValidPassword(password)) {
    throw new Error("Invalid room password supplied to observeRoom(). "
              + " Room ID: [" + roomID + "], password: [" + password + "]." 
              + " See net.user1.orbiter.Validator.isValidPassword().");
  }

    // If update levels were specified for this room, send them now.
  if (updateLevels != null) {
    theRoom.setUpdateLevels(updateLevels);
  }

  // Send the UPC only if at least one valid room was found      
  var msgMan = this.orbiter.getMessageManager();  
  msgMan.sendUPC(net.user1.orbiter.UPC.OBSERVE_ROOM, 
                 roomID,
                 password);
  
  return theRoom; 
};

//==============================================================================
// WATCHING FOR ROOMS
//==============================================================================

net.user1.orbiter.RoomManager.prototype.watchForRooms = function (roomQualifier) {
  var recursive = false;
  
  // null means watch the whole server
  if (roomQualifier == null) {
    roomQualifier = "";
    recursive = true;
  }

  var msgMan = this.orbiter.getMessageManager();
  msgMan.sendUPC(net.user1.orbiter.UPC.WATCH_FOR_ROOMS,
                 roomQualifier,
                 recursive.toString());
};

net.user1.orbiter.RoomManager.prototype.stopWatchingForRooms = function (roomQualifier) {
  var recursive = false;
  // null means whole server
  if (roomQualifier == null) {
    roomQualifier = "";
    recursive = true;
  }

  var msgMan = this.orbiter.getMessageManager();
  msgMan.sendUPC(net.user1.orbiter.UPC.STOP_WATCHING_FOR_ROOMS, 
                 roomQualifier,
                 recursive.toString());
};

net.user1.orbiter.RoomManager.prototype.isWatchingQualifier = function (qualifier) {
  return net.user1.utils.ArrayUtil.indexOf(this.watchedQualifiers, qualifier) != -1;
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.watchForRoomsResultListener = function (e) {
  if (e.getStatus() == net.user1.orbiter.Status.SUCCESS) {
    this.watchedQualifiers.push(e.getRoomIdQualifier());
  }
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.stopWatchingForRoomsResultListener = function (e) {
  var unwatchedQualifier = e.getRoomIdQualifier();
  var unwatchedQualifierIndex;
  
  if (e.getStatus() == net.user1.orbiter.Status.SUCCESS) {
    unwatchedQualifierIndex = net.user1.utils.ArrayUtil.indexOf(watchedQualifiers, unwatchedQualifier);
    if (unwatchedQualifierIndex != -1) {
      watchedQualifiers.splice(unwatchedQualifierIndex, 1);
    }
  }
};

//==============================================================================
// SENDING MESSAGES
//==============================================================================

net.user1.orbiter.RoomManager.prototype.sendMessage = function (messageName, 
                                                                rooms,
                                                                includeSelf,
                                                                filters) {
  var rest = Array.prototype.slice.call(arguments).slice(4);
  
  // An array of arguments to send to the server.
  var args;

  // Can't continue without a valid messageName.
  if (messageName == null || messageName == "") {
    this.log.warn("[ROOM_MANAGER]  sendMessage() failed. No messageName supplied.");
    return;
  }
  
  // Send the UPC.
  var msgMan = this.orbiter.getMessageManager();
  args = [net.user1.orbiter.UPC.SEND_MESSAGE_TO_ROOMS, 
          messageName, 
          rooms.join(net.user1.orbiter.Tokens.RS),
          String(includeSelf),
          filters != null ? filters.toXMLString() : ""];
  msgMan.sendUPC.apply(msgMan, args.concat(rest));
}


//==============================================================================
// JOINING ROOMS
//==============================================================================

net.user1.orbiter.RoomManager.prototype.joinRoom = function (roomID, 
                                                             password,
                                                             updateLevels) {
  if (!this.orbiter.isReady()) { 
    this.log.warn("[ROOM_MANAGER] Connection not open. Request to join room ["
              + roomID + "] could not be sent.");
    return null;
  }
  
  // If the room ID is not valid, quit
  if (!net.user1.orbiter.Validator.isValidResolvedRoomID(roomID)) {
    this.log.error("[ROOM_MANAGER] Invalid room id supplied to joinRoom(): ["
                   + roomID + "]. Join request not sent."
                   + " See net.user1.orbiter.Validator.isValidResolvedRoomID().");
    return null;
  }
  
  // Try to get a reference to the room
  var theRoom = this.getRoom(roomID);
    
  // If the room exists
  if (theRoom != null) {
    // Can't join a room you're already in.
    if (theRoom.clientIsInRoom()) {
      this.log.warn("[ROOM_MANAGER] Room join attempt aborted. Already in room: [" 
                    + theRoom.getRoomID() + "].");
      return theRoom;
    }
  } else {
    // Make the local room.
    theRoom = this.addCachedRoom(roomID);
  }
    
  // Validate the password
  if (password == null) {
    password = "";
  }
  if (!net.user1.orbiter.Validator.isValidPassword(password)) {
    this.log.error("[ROOM_MANAGER] Invalid room password supplied to joinRoom(): ["
                   + roomID + "]. Join request not sent." 
                   + " See net.user1.orbiter.Validator.isValidPassword().");
    return theRoom;
  }

  
  // If any update levels are specified, send them before joining.
  if (updateLevels != null) {
    theRoom.setUpdateLevels(updateLevels);
  }
  
  var msgMan = this.orbiter.getMessageManager();
  msgMan.sendUPC(net.user1.orbiter.UPC.JOIN_ROOM, 
                 roomID, 
                 password);
  return theRoom;
};

// =============================================================================
// ROOM OBJECT CREATION/DISPOSAL
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.requestRoom = function (roomID) {
  if (roomID == "") {
    this.log.warn("[ROOM_MANAGER] requestRoom() failed. Supplied room ID was empty.");
    return null;
  }
  
  var theRoom = this.getRoom(roomID);
  if (theRoom != null) {
    return theRoom;
  } else {
    this.log.debug("[ROOM_MANAGER] Creating new room object for id: [" + roomID + "]");
    var RoomClass = this.roomClassRegistry.getRoomClass(roomID);
    theRoom = new RoomClass(roomID, 
                            this, 
                            this.orbiter.getMessageManager(), 
                            this.orbiter.getClientManager(), 
                            this.orbiter.getAccountManager(), 
                            this.log);
    return theRoom;
  }
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.disposeRoom = function (roomID) {
  var room = this.getRoom(roomID);
  if (room != null) {
    this.log.debug("[ROOM_MANAGER] Disposing room: " + room);
    this.removeCachedRoom(roomID);
    this.removeWatchedRoom(roomID);
    this.removeOccupiedRoom(roomID);
    this.removeObservedRoom(roomID);
  } else {
    this.log.debug("[ROOM_MANAGER] disposeRoom() called for unknown room: [" + roomID + "]");
  }
};

/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeAllRooms = function () {
  this.log.debug("[ROOM_MANAGER] Removing all local room object references.");
  this.cachedRooms.removeAll();
  this.watchedRooms.removeAll();
  this.occupiedRooms.removeAll();
  this.observedRooms.removeAll();
};

// =============================================================================
// CACHED ROOMS
// =============================================================================

/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.addCachedRoom = function (roomID) {
  var cachedRoom = this.cachedRooms.getByRoomID(roomID);
  if (cachedRoom == null) {
    this.log.debug("[ROOM_MANAGER] Adding cached room: [" + roomID + "]"); 
    return this.cachedRooms.add(this.requestRoom(roomID));
  } else {
    return cachedRoom;
  }
};

/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeCachedRoom = function (roomID) {
  if (this.cachedRooms.containsRoomID(roomID)) {
    this.cachedRooms.removeByRoomID(roomID);
  } else {
    throw new Error("[ROOM_MANAGER] Could not remove cached room: [" + roomID + "]." 
                    + " Room not found.");
  }
};

net.user1.orbiter.RoomManager.prototype.hasCachedRoom = function (roomID) {
  return this.cachedRooms.containsRoomID(roomID);
};

net.user1.orbiter.RoomManager.prototype.disposeCachedRooms = function () {
  var room;
  var rooms = cachedRooms.getAll();
  for (var i = 0; i <= rooms.length; i++) {
    room = rooms[i];
    removeCachedRoom(room.getRoomID());
  }
};

// =============================================================================
// WATCHED ROOMS
// =============================================================================
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.addWatchedRoom = function (roomID) {
  this.log.debug("[ROOM_MANAGER] Adding watched room: [" + roomID + "]"); 
  var room = this.watchedRooms.add(this.requestRoom(roomID));
  room.updateSyncState();
};
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeWatchedRoom = function (roomID) {
  var room = this.watchedRooms.removeByRoomID(roomID);
  if (room != null) {
    room.updateSyncState();
  } else {
    this.log.debug("[ROOM_MANAGER] Request to remove watched room [" 
              + roomID + "] ignored; room not in watched list.");
  }
};
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeAllWatchedRooms = function () {
  var rooms = this.watchedRooms.getAll();
  var room;
  for (var i = 0; i <= rooms.length; i++) {
    room = rooms[i];
    removeWatchedRoom(room.getRoomID());
    room.updateSyncState();
  }
};
  
/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.setWatchedRooms = function (qualifier, newRoomIDs) {
  // Remove rooms from local list
  var rooms = this.getRoomsWithQualifier(qualifier);
  var room;
  for (var i = 0; i < rooms.length; i++) {
    room = rooms[i];
    if (net.user1.utils.ArrayUtil.indexOf(newRoomIDs, room.getSimpleRoomID()) == -1) {
      this.removeWatchedRoom(room.getRoomID());
    }
  }
  // Add rooms to local list
  var fullRoomID;
  var roomID;
  for (var i = 0; i < newRoomIDs.length; i++) {
    roomID = newRoomIDs[i];
    fullRoomID = qualifier + (qualifier != "" ? "." : "") + roomID;
    if (!this.watchedRooms.containsRoomID(fullRoomID)) {
      this.addWatchedRoom(fullRoomID);
    }
  }
};

net.user1.orbiter.RoomManager.prototype.hasWatchedRoom = function (roomID) {
  return this.watchedRooms.containsRoomID(roomID);
}

// =============================================================================
// OCCUPIED ROOMS
// =============================================================================
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.addOccupiedRoom = function (roomID) {
  this.log.debug("[ROOM_MANAGER] Adding occupied room: [" + roomID + "]"); 
  var room = this.occupiedRooms.add(this.requestRoom(roomID));
  room.updateSyncState();
  return room;
};
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeOccupiedRoom = function (roomID) {
  var room = this.occupiedRooms.removeByRoomID(roomID);
  if (room != null) {
    room.updateSyncState();
  } else {
    this.log.debug("[ROOM_MANAGER] Request to remove occupied room [" 
              + roomID + "] ignored; client is not in room."); 
  }
};

net.user1.orbiter.RoomManager.prototype.hasOccupiedRoom = function (roomID) {
  return this.occupiedRooms.containsRoomID(roomID);
};
  
// =============================================================================
// OBSERVED ROOMS
// =============================================================================
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.addObservedRoom = function (roomID) {
  this.log.debug("[ROOM_MANAGER] Adding observed room: [" + roomID + "]");
  var room = this.observedRooms.add(this.requestRoom(roomID));
  room.updateSyncState();
  return room;
};
  
/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeObservedRoom = function (roomID) {
  var room = this.observedRooms.removeByRoomID(roomID);
  if (room != null) {
    room.updateSyncState();
  } else {
    this.log.debug("[ROOM_MANAGER] Request to remove observed room [" 
              + roomID + "] ignored; client is not observing room."); 
  }
};

net.user1.orbiter.RoomManager.prototype.hasObservedRoom = function (roomID) {
  return this.observedRooms.containsRoomID(roomID);
};

//==============================================================================
// ROOM LIST LISTENERS
//==============================================================================

/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.addRoomListener = function (e) {
  var room = e.getItem();
  
  // Only trigger added for first known reference
  if (this.getKnownReferenceCount(room.getRoomID()) == 1) {
    this.fireRoomAdded(room.getQualifier(), room.getRoomID(), room);
    this.fireRoomCount(this.getNumRooms());
  }
};

/**
 * @private
 */    
net.user1.orbiter.RoomManager.prototype.removeRoomListener = function (e) {
  var room = e.getItem();
  var knownReferenceCount = this.getKnownReferenceCount(room.getRoomID());
  
  switch (e.target) {
    case this.occupiedRooms:
      this.log.debug("[ROOM_MANAGER] Removed occupied room: " + room);
      if (knownReferenceCount == 0) {
        this.fireRoomRemoved(room.getQualifier(), room.getRoomID(), room);
        this.fireRoomCount(this.getNumRooms());
      }
      break;
    
    case this.observedRooms:
      this.log.debug("[ROOM_MANAGER] Removed observed room: " + room); 
      if (knownReferenceCount == 0) {
        this.fireRoomRemoved(room.getQualifier(), room.getRoomID(), room);
        this.fireRoomCount(this.getNumRooms());
      }
      break;
    
    case this.watchedRooms:
      this.log.debug("[ROOM_MANAGER] Removed watched room: " + room); 
      if (knownReferenceCount == 0) {
        this.fireRoomRemoved(room.getQualifier(), room.getRoomID(), room);
        this.fireRoomCount(this.getNumRooms());
      }
      break;
    
    case this.cachedRooms:
      this.log.debug("[ROOM_MANAGER] Removed cached room: " + room); 
      break;
  }
  
  // When the RoomManager has no more references to the room, shut it down
  if (knownReferenceCount == 0 && !this.cachedRooms.contains(room)) {
    room.shutdown();
  }
};

//==============================================================================
// ROOM ACCESS
//==============================================================================

/**
 * @private 
 */    
net.user1.orbiter.RoomManager.prototype.getKnownReferenceCount = function (roomID) {
  var count = 0;
  count += this.hasObservedRoom(roomID) ? 1 : 0;
  count += this.hasOccupiedRoom(roomID) ? 1 : 0;
  count += this.hasWatchedRoom(roomID) ? 1 : 0;
  return count;
}

net.user1.orbiter.RoomManager.prototype.getRooms = function () {
  var roomlist = net.user1.utils.ArrayUtil.combine(this.occupiedRooms.getAll(),
                                                   this.observedRooms.getAll(),
                                                   this.watchedRooms.getAll());
  return roomlist;
};

net.user1.orbiter.RoomManager.prototype.roomIsKnown = function (roomID) {
  var rooms = this.getRooms();
  var room;
  for (var i = rooms.length; --i >= 0;) {
    room = rooms[i];
    if (room.getRoomID() == roomID) {
      return true;
    }
  }
  return false;
};

net.user1.orbiter.RoomManager.prototype.getRoomIDs = function () {
  var roomIDs = new Array();
  var rooms = this.getRooms();

  for (var i = 0; i <= rooms.length; i++) {
    roomIDs.push(rooms[i].getRoomID());
  }

  return roomIDs;
};

net.user1.orbiter.RoomManager.prototype.getAllRooms = function () {
  var roomlist = net.user1.utils.ArrayUtil.combine(this.occupiedRooms.getAll(),
                                                   this.observedRooms.getAll(),
                                                   this.watchedRooms.getAll(),
                                                   this.cachedRooms.getAll());
  
  return roomlist;
};

net.user1.orbiter.RoomManager.prototype.getRoomsWithQualifier = function (qualifier) {
  if (qualifier == null)  {
    return this.getRooms();
  }
  
  var roomlist = [];
  var rooms = this.getRooms();
  var room;
  for (var i = 0; i < rooms.length; i++) {
    room = rooms[i];
    if (net.user1.orbiter.RoomIDParser.getQualifier(room.getRoomID()) == qualifier) {
      roomlist.push(room);
    }
  }
  
  return roomlist;
};

net.user1.orbiter.RoomManager.prototype.getNumRooms = function (qualifier) {
  return this.getRoomsWithQualifier(qualifier).length;
}

net.user1.orbiter.RoomManager.prototype.getRoom = function (roomID) {
  var rooms = this.getAllRooms();
  var room;
  for (var i = rooms.length; --i >= 0;) {
    room = rooms[i];
    if (room.getRoomID() == roomID) {
      return room;
    }
  }
  return null;
};

// =============================================================================
// ROOM CLASS REGISTRY
// =============================================================================

net.user1.orbiter.RoomManager.prototype.getRoomClassRegistry = function () {
  return this.roomClassRegistry;
};

// =============================================================================
// CLIENT ACCESS
// =============================================================================

/**
 * @private
 */        
net.user1.orbiter.RoomManager.prototype.getAllClients = function () {
  var clientSets = [];
  var rooms = this.getRooms();
  var room;
  for (var i = rooms.length; --i >= 0;) {
    room = rooms[i];
    clientSets.push(room.getOccupantsInternal());
    clientSets.push(room.getObserversInternal());
  }
  return net.user1.utils.ObjectUtil.combine(clientSets);
};

net.user1.orbiter.RoomManager.prototype.clientIsKnown = function (clientID) {
  var clientSets = [];
  
  var rooms = this.getRooms();
  var room;
  for (var i = rooms.length; --i >= 0;) {
    room = rooms[i];
    clientSets.push(room.getOccupantsInternal());
    clientSets.push(room.getObserversInternal());
  }
  
  for (var i = clientSets.length; --i >= 0;) {
    if (clientSets[i][clientID] != null) {
      return true;
    }
  }
  return false;
};

// =============================================================================
// EVENT DISPATCHING
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireWatchForRoomsResult = function (roomIDQualifier,
                                                                            status) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                              net.user1.orbiter.RoomManagerEvent.WATCH_FOR_ROOMS_RESULT,
                              null, status, roomIDQualifier);
  this.dispatchEvent(e);  
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireStopWatchingForRoomsResult = function (roomIDQualifier,
                                                                                   status) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                            net.user1.orbiter.RoomManagerEvent.STOP_WATCHING_FOR_ROOMS_RESULT,
                            null, status, roomIDQualifier);
  this.dispatchEvent(e);  
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireCreateRoomResult = function (roomIDQualifier, 
                                                                         roomID,
                                                                         status) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                                       net.user1.orbiter.RoomManagerEvent.CREATE_ROOM_RESULT,
                                       roomID, status, roomIDQualifier);
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireRemoveRoomResult = function (roomIDQualifier, 
                                                                         roomID,
                                                                         status) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                                       net.user1.orbiter.RoomManagerEvent.REMOVE_ROOM_RESULT, 
                                       roomID, status, roomIDQualifier);

  this.dispatchEvent(e);
}

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireRoomAdded = function (roomIDQualifier, 
                                                                  roomID,
                                                                  theRoom) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                                     net.user1.orbiter.RoomManagerEvent.ROOM_ADDED, 
                                     roomID, null, roomIDQualifier, theRoom);
  this.dispatchEvent(e);
}

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireRoomRemoved = function (roomIDQualifier, 
                                                                    roomID,
                                                                    theRoom) {
  var e = new net.user1.orbiter.RoomManagerEvent(
                                     net.user1.orbiter.RoomManagerEvent.ROOM_REMOVED, 
                                     roomID, 
                                     null,
                                     roomIDQualifier,
                                     theRoom);
  this.dispatchEvent(e);
}

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireRoomCount = function (numRooms) {
  this.dispatchEvent(new net.user1.orbiter.RoomManagerEvent(net.user1.orbiter.RoomManagerEvent.ROOM_COUNT, 
                                                            null, null, null, null, numRooms));
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireJoinRoomResult = function (roomID, status) {
  this.dispatchEvent(new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.JOIN_RESULT, null, null, 
                                                     status, null, 0, roomID));
}

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireLeaveRoomResult = function (roomID, status) {
  this.dispatchEvent(new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.LEAVE_RESULT, null, null, 
                                                     status, null, 0, roomID));
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireObserveRoomResult = function (roomID, status) {
  this.dispatchEvent(new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.OBSERVE_RESULT, null, null, 
                                                     status, null, 0, roomID));
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.fireStopObservingRoomResult = function (roomID, status) {
  this.dispatchEvent(new net.user1.orbiter.RoomEvent(net.user1.orbiter.RoomEvent.STOP_OBSERVING_RESULT, null, null, 
                                                     status, null, 0, roomID));
};


// =============================================================================
// CLEANUP and DISPOSAL
// =============================================================================

/**
 * @private
 * 
 * Clears all resources. The object remains alive, and can be reused. To 
 * permanently deactivate this object, use dispose().
 */
net.user1.orbiter.RoomManager.prototype.cleanup = function () {
  this.log.info("[ROOM_MANAGER] Cleaning resources.");
  this.removeAllRooms();
  this.watchedQualifiers = [];
};

/**
 * @private
 */
net.user1.orbiter.RoomManager.prototype.dispose = function () {
  this.log.info("[ROOM_MANAGER] Disposing resources.");
  this.watchedQualifiers = null;
  var room;
  var rooms = this.getAllRooms();
  for (var i = this.getAllRooms().length; --i >= 0;) {
    room = rooms[i];
    room.dispose();
  }
  this.cachedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.occupiedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.occupiedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.observedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.observedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.watchedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.ADD_ITEM, this.addRoomListener, this);
  this.watchedRooms.removeEventListener(net.user1.orbiter.CollectionEvent.REMOVE_ITEM, this.removeRoomListener, this);
  this.occupiedRooms = null;
  this.observedRooms = null;
  this.watchedRooms  = null;
  this.cachedRooms  = null;
  this.log = null;
  this.orbiter = null;
  this.roomClassRegistry = null;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.RoomManagerEvent = function (type,
                                               roomID, 
                                               status,
                                               roomIdQualifier,
                                               room,
                                               numRooms) {
  net.user1.events.Event.call(this, type);

  this.roomID = roomID;
  this.status = status;
  this.roomIdQualifier  = roomIdQualifier;
  this.room = room;
  this.numRooms = numRooms;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.RoomManagerEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.RoomManagerEvent.CREATE_ROOM_RESULT = "CREATE_ROOM_RESULT";
/** @constant */
net.user1.orbiter.RoomManagerEvent.REMOVE_ROOM_RESULT = "REMOVE_ROOM_RESULT";
/** @constant */
net.user1.orbiter.RoomManagerEvent.WATCH_FOR_ROOMS_RESULT = "WATCH_FOR_ROOMS_RESULT";
/** @constant */
net.user1.orbiter.RoomManagerEvent.STOP_WATCHING_FOR_ROOMS_RESULT = "STOP_WATCHING_FOR_ROOMS_RESULT";
/** @constant */
net.user1.orbiter.RoomManagerEvent.ROOM_ADDED = "ROOM_ADDED";
/** @constant */
net.user1.orbiter.RoomManagerEvent.ROOM_REMOVED = "ROOM_REMOVED";
/** @constant */
net.user1.orbiter.RoomManagerEvent.ROOM_COUNT = "ROOM_COUNT";

net.user1.orbiter.RoomManagerEvent.prototype.getRoomIdQualifier = function () {
  if (this.roomIdQualifier == null && this.room != null) {
    return this.room.getQualifier();
  } else {
    return this.roomIdQualifier;
  }
};

net.user1.orbiter.RoomManagerEvent.prototype.getRoomID = function () {
  var fullRoomID;
  var qualifier;
  
  if (this.room != null) {
    return this.room.getRoomID();
  } else if (this.roomID == null) {
    return null;
  } else {
    qualifier = this.getRoomIdQualifier();
    fullRoomID = qualifier == "" || qualifier == null 
                 ? this.roomID
                 : qualifier + "." + this.roomID;
    return fullRoomID;
  }
};

net.user1.orbiter.RoomManagerEvent.prototype.getSimpleRoomID = function () {
  if (this.roomID == null && this.room != null) {
    return this.room.getSimpleRoomID();
  } else {
    return this.roomID;
  }
};

net.user1.orbiter.RoomManagerEvent.prototype.getRoom = function () {
  return this.room;
}

net.user1.orbiter.RoomManagerEvent.prototype.getStatus = function () {
  return this.status;
}

net.user1.orbiter.RoomManagerEvent.prototype.getNumRooms = function () {
  return this.numRooms;
}

net.user1.orbiter.RoomManagerEvent.prototype.toString = function () {
  return "[object RoomManagerEvent]";
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
  /**
   * @private
   */  
net.user1.orbiter.RoomManifest = function () {
};
  
net.user1.orbiter.RoomManifest.prototype.deserialize = function (roomID,
                                                                 serializedAttributes,
                                                                 clientList,
                                                                 occupantCount,
                                                                 observerCount) {
  this.roomID = roomID;
  this.attributes = null;
  this.occupantCount = occupantCount;
  this.observerCount = observerCount;
  this.occupants = [];
  this.observers = [];
  
  this.deserializeAttributes(serializedAttributes);
  this.deserializeClientList(clientList);
};
        
/**
 * @private
 */        
net.user1.orbiter.RoomManifest.prototype.deserializeAttributes = function (serializedAttributes) {
  var attrList = serializedAttributes.split(net.user1.orbiter.Tokens.RS);
  this.attributes = new net.user1.orbiter.AttributeCollection();
  
  for (var i = attrList.length-2; i >= 0; i -=2) {
    this.attributes.setAttribute(attrList[i], attrList[i+1], net.user1.orbiter.Tokens.GLOBAL_ATTR);
  }
};
    
/**
 * @private
 */        
net.user1.orbiter.RoomManifest.prototype.deserializeClientList = function (clientList) {
  var clientManifest;
  
  for (var i = clientList.length-5; i >= 0; i -=5) {
    clientManifest = new net.user1.orbiter.ClientManifest();
    clientManifest.deserialize(clientList[i], clientList[i+1], null, null, clientList[i+3], [this.roomID, clientList[i+4]]);
    if (clientList[i+2] == "0") {
      this.occupants.push(clientManifest);
    } else {
      this.observers.push(clientManifest);
    }
  }
};
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
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.RoomSnapshot = function (roomID, password, updateLevels) {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.manifest = null;
  this.method = net.user1.orbiter.UPC.GET_ROOM_SNAPSHOT;
  this.args   = [roomID, password, updateLevels != null ? updateLevels.toInt() : ""];
  this.hasStatus = true;
};
//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.RoomSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================                
/**
 * @private
 */    
net.user1.orbiter.snapshot.RoomSnapshot.prototype.setManifest = function (value) {
  this.manifest = value;
};
    
net.user1.orbiter.snapshot.RoomSnapshot.prototype.getAttribute = function (name) {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.attributes.getAttribute(name, net.user1.orbiter.Tokens.GLOBAL_ATTR);
};

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getAttributes = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.attributes.getByScope(net.user1.orbiter.Tokens.GLOBAL_ATTR);
};

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getRoomID = function () {
  if (!this.manifest) {
    return null;
  }
  return this.manifest.roomID;
};

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getOccupants = function () {
  return this.manifest.occupants.slice();
}

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getObservers = function () {
  return this.manifest.observers.slice();
}

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getOccupant = function (clientID) {
  var client;
  for (var i = this.manifest.occupants.length; --i >= 0;) {
    if (this.manifest.occupants[i].clientID == clientID) {
      return this.manifest.occupants[i];
    } 
  }
  return null;
};

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getObserver = function (clientID) {
  var client;
  for (var i = this.manifest.observers.length; --i >= 0;) {
    if (this.manifest.observers[i].clientID == clientID) {
      return this.manifest.observers[i];
    } 
  }
  return null;
};

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getNumOccupants = function () {
  return Math.max(this.manifest.occupants.length, this.manifest.occupantCount);
}

net.user1.orbiter.snapshot.RoomSnapshot.prototype.getNumObservers = function () {
  return Math.max(this.manifest.observers.length, this.manifest.observerCount);
}
//==============================================================================
//  SECURITY_ROLE CONSTANTS
//==============================================================================
/** @class */
net.user1.orbiter.SecurityRole = new Object();
/** @constant */
net.user1.orbiter.SecurityRole.MODERATOR = "MODERATOR";
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The Server class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.ServerEvent.TIME_SYNC}</li> 
<li class="fixedFont">{@link net.user1.orbiter.ServerEvent.UPC_PROCESSED}</li> 
<li class="fixedFont">{@link net.user1.orbiter.ServerEvent.WATCH_FOR_PROCESSED_UPCS_RESULT}</li> 
<li class="fixedFont">{@link net.user1.orbiter.ServerEvent.STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT}</li> 
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

@extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.Server = function (orbiter) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);

  this.orbiter = orbiter;
  this.version = null;
  this.upcVersion = null;
  this.localAgeAtLastSync = NaN;
  this.lastKnownServerTime = NaN;
  this._isWatchingForProcessedUPCs = false;
  
  this.log = orbiter.getLog();
  
  orbiter.addEventListener(net.user1.orbiter.OrbiterEvent.READY, this.readyListener, this);
}

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.Server, net.user1.events.EventDispatcher);

// =============================================================================
// SERVER-WIDE MESSAGING
// =============================================================================
net.user1.orbiter.Server.prototype.sendMessage = function (messageName, 
                                                           includeSelf,
                                                           filters) {
  var rest = Array.prototype.slice.call(arguments).slice(3);
  var args;

  if (messageName == null || messageName == "") {
    this.log.warn("Server.sendMessage() failed. No messageName supplied.");
    return;
  }

  var msgMan = this.orbiter.getMessageManager();
  args = [net.user1.orbiter.UPC.SEND_MESSAGE_TO_SERVER, 
          messageName, 
          includeSelf.toString(),
          filters != null ? filters.toXMLString() : ""];
  msgMan.sendUPC.apply(msgMan, args.concat(rest));
};

// =============================================================================
// SERVER MODULES
// =============================================================================
net.user1.orbiter.Server.prototype.sendModuleMessage = function (moduleID,
                                                                 messageName, 
                                                                 messageArguments) {
  var sendupcArgs = [net.user1.orbiter.UPC.SEND_SERVERMODULE_MESSAGE, moduleID, messageName];
  
  for (var arg in messageArguments) {
    sendupcArgs.push(arg + net.user1.orbiter.Tokens.RS + messageArguments[arg]);
  }
        
  this.orbiter.getMessageManager().sendUPC.apply(this.orbiter.getMessageManager(), sendupcArgs);
};

net.user1.orbiter.Server.prototype.clearModuleCache = function () {
  this.orbiter.getMessageManager().sendUPC(net.user1.orbiter.UPC.CLEAR_MODULE_CACHE);
};

// =============================================================================
// VERSION ACCESS
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.Server.prototype.setVersion = function (value) {
  this.version = value;
};

net.user1.orbiter.Server.prototype.getVersion = function () {
  return this.version;
};

/**
 * @private
 */
net.user1.orbiter.Server.prototype.setUPCVersion = function (value) {
  this.upcVersion = value;
};

net.user1.orbiter.Server.prototype.getUPCVersion = function () {
  return this.upcVersion;
};

// =============================================================================
// UPC STATS AND PROCESSING
// =============================================================================

net.user1.orbiter.Server.prototype.resetUPCStats = function () {
  this.orbiter.getMessageManager().sendUPC(UPC.RESET_UPC_STATS);
};

net.user1.orbiter.Server.prototype.watchForProcessedUPCs = function () {
  this.orbiter.getMessageManager().sendUPC(net.user1.orbiter.UPC.WATCH_FOR_PROCESSED_UPCS);
};

net.user1.orbiter.Server.prototype.stopWatchingForProcessedUPCs = function () {
  this.orbiter.getMessageManager().sendUPC(net.user1.orbiter.UPC.STOP_WATCHING_FOR_PROCESSED_UPCS);
};

net.user1.orbiter.Server.prototype.isWatchingForProcessedUPCs = function () {
  return this._isWatchingForProcessedUPCs;
};

net.user1.orbiter.Server.prototype.setIsWatchingForProcessedUPCs = function (value) {
  this._isWatchingForProcessedUPCs = value;
};

// =============================================================================
// TIME RETRIEVAL METHODS
// =============================================================================
net.user1.orbiter.Server.prototype.getServerTime = function () {
  var self = this.orbiter.self();
  var lastServerTime = NaN;
  var estimatedServerTime = NaN;
  
  if (self != null) {
    lastServerTime = isNaN(this.lastKnownServerTime) 
                     ? self.getConnectTime() 
                     : this.lastKnownServerTime;
                     
    estimatedServerTime = isNaN(lastServerTime) 
                         ? NaN
                         : (lastServerTime + (new Date().getTime()-this.localAgeAtLastSync));
  }
 
  if (estimatedServerTime == 0) {
    log.warn("Server time requested, but is unknown.");
  }
  
  return estimatedServerTime;
};

net.user1.orbiter.Server.prototype.syncTime = function () {
  var msgMan = this.orbiter.getMessageManager();
  msgMan.sendUPC(net.user1.orbiter.UPC.SYNC_TIME);
};

/**
 * @private 
 */ 
net.user1.orbiter.Server.prototype.readyListener = function (e) {
  this.orbiter.getMessageManager().addMessageListener(net.user1.orbiter.UPC.SERVER_TIME_UPDATE, this.u50);  
  this.localAgeAtLastSync = new Date().getTime();;
};

// =============================================================================
// EVENT DISPATCHING
// =============================================================================

/**
 * @private
 */
net.user1.orbiter.Server.prototype.fireTimeSync = function () {
  this.dispatchEvent(new net.user1.orbiter.ServerEvent(ServerEvent.TIME_SYNC));
};

/**
 * @private
 */
net.user1.orbiter.Server.prototype.dispatchWatchForProcessedUPCsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ServerEvent(net.user1.orbiter.ServerEvent.WATCH_FOR_PROCESSED_UPCS_RESULT,
                     null, status));
};

/**
 * @private
 */
net.user1.orbiter.Server.prototype.dispatchStopWatchingForProcessedUPCsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ServerEvent(net.user1.orbiter.ServerEvent.STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT,
                     null, status));
};

/**
 * @private
 */
net.user1.orbiter.Server.prototype.dispatchUPCProcessed = function (record) {
  this.dispatchEvent(new net.user1.orbiter.ServerEvent(net.user1.orbiter.ServerEvent.UPC_PROCESSED, record));
};

/**
 * @private
 */
net.user1.orbiter.Server.prototype.dispatchResetUPCStatsResult = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ServerEvent(net.user1.orbiter.ServerEvent.RESET_UPC_STATS_RESULT,
                     null, status));
};

//==============================================================================
// UPC LISTENERS
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.Server.prototype.u50 = function (newTime) {             // SERVER_TIME
  this.lastKnownServerTime = Number(newTime);
  this.localAgeAtLastSync  = new Date().getTime();
  this.fireTimeSync();
}

//==============================================================================
// CLEANUP AND DISPOSAL
//==============================================================================  
/**
 * @private
 */    
net.user1.orbiter.Server.prototype.cleanup = function () {
  this.log.info("[SERVER] Cleaning resources.");
  this.setIsWatchingForProcessedUPCs(false);
}
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.GatewaysSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.gateways = null;
  this.method = net.user1.orbiter.UPC.GET_GATEWAYS_SNAPSHOT;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.GatewaysSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================         
/**
 * @private
 */    
net.user1.orbiter.snapshot.GatewaysSnapshot.prototype.setGateways = function (value) {
  this.gateways = value;
};

net.user1.orbiter.snapshot.GatewaysSnapshot.prototype.getGateways = function () {
  if (!this.gateways) {
    return [];
  }
  return this.gateways.slice();
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.ServerEvent = function (type, 
                                          upcProcessingRecord,
                                          status) {
  net.user1.events.Event.call(this, type);
  
  this.upcProcessingRecord = upcProcessingRecord;
  this.status = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.ServerEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.ServerEvent.TIME_SYNC = "TIME_SYNC";
/** @constant */
net.user1.orbiter.ServerEvent.UPC_PROCESSED = "UPC_PROCESSED";
/** @constant */
net.user1.orbiter.ServerEvent.WATCH_FOR_PROCESSED_UPCS_RESULT = "WATCH_FOR_PROCESSED_UPCS_RESULT";
/** @constant */
net.user1.orbiter.ServerEvent.STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT = "STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT";
/** @constant */
net.user1.orbiter.ServerEvent.RESET_UPC_STATS_RESULT = "RESET_UPC_STATS_RESULT";

//==============================================================================
// VARIABLES
//==============================================================================
net.user1.orbiter.ServerEvent.prototype.getUPCProcessingRecord = function () {
  return upcProcessingRecord;
}
  
net.user1.orbiter.ServerEvent.prototype.getStatus = function () {
  return status;
}
    

net.user1.orbiter.ServerEvent.prototype.toString = function () {
  return "[object ServerEvent]";
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.ServerModuleListSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.moduleList = null;
  this.method = net.user1.orbiter.UPC.GET_SERVERMODULELIST_SNAPSHOT;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.ServerModuleListSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================         
/**
 * @private
 */    
net.user1.orbiter.snapshot.ServerModuleListSnapshot.prototype.setModuleList = function (value) {
  this.moduleList = value;
}

net.user1.orbiter.snapshot.ServerModuleListSnapshot.prototype.getModuleList = function () {
  if (!this.moduleList) {
    return null;
  }
  return this.moduleList.slice();
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @private
 * @class
 */
net.user1.orbiter.upc.SetAttr = function (name,
                                          value,
                                          options) {
    
  // Abort if name is invalid.
  if (!net.user1.orbiter.Validator.isValidAttributeName(name)) {
    throw new Error("Cannot set attribute. Illegal name" + 
      " (see Validator.isValidAttributeName()). " +
      " Illegal attribute is: " + name + "=" + value);
  }

  // Abort if value is invalid.
  if (!net.user1.orbiter.Validator.isValidAttributeValue(value)) {
    throw new Error("Cannot set attribute. Illegal value" + 
      " (see Validator.isValidAttributeValue()). " +
      " Illegal attribute is: " + name + "=" + value);
  }
  
  if (value == null) {
    value = "";
  }
  
  // Validation passed, so assign instance vars.
  this.name = name;
  this.value = value;
  this.options = options;
};
/**
 * @private
 */  
net.user1.orbiter.upc.SetClientAttr = function (name, 
                                                value, 
                                                options,
                                                scope,
                                                clientID,
                                                userID) {
  // Call superconstructor
  net.user1.orbiter.upc.SetAttr.call(this, name, value, options);
      
  // Abort if scope is invalid.
  if (!net.user1.orbiter.Validator.isValidAttributeScope(scope)) {
    throw new Error("Cannot set client attribute. Illegal scope" + 
             " (see Validator.isValidAttributeScope()). " +
             " Illegal attribute is: " + name + "=" + value);
  }

  // A scope null means the attribute is global.
  if (scope == null) {
    scope = net.user1.orbiter.Tokens.GLOBAL_ATTR;
  }

  this.method = net.user1.orbiter.UPC.SET_CLIENT_ATTR;
  this.args   = [clientID, userID, name, value, scope, options.toString()];
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.upc.SetClientAttr, net.user1.orbiter.upc.SetAttr);
/**
 * @private
 */  
net.user1.orbiter.upc.SetRoomAttr = function (name, 
                                              value, 
                                              options,
                                              roomID) {
  // Call superconstructor
  net.user1.orbiter.upc.SetAttr.call(this, name, value, options);
      
  this.method = net.user1.orbiter.UPC.SET_ROOM_ATTR;
  this.args   = [roomID, name, value, options.toString()];
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.upc.SetRoomAttr, net.user1.orbiter.upc.SetAttr);
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * 
 * Note: Due to JavaScript's lack of memory measurement APIs and byte-measurement 
 * APIs, Orbiter's Statistics class does not include many of the statistics found
 * in the equivalent Reactor Statistics class.
 */
net.user1.orbiter.Statistics = function (orbiter) {
  this.statsTimer;
  this.lastTick = NaN;
  this.lastTotalMessages = 0;
  this.messagesPerSecond = 0;
  
  // Peaks
  this.peakMessagesPerSecond = 0;

  this.orbiter = null;
  this.connection = null;
  
  this.statsIntervalID = -1;
  
  this.init(orbiter);
};

/**
 * @private
 */
net.user1.orbiter.Statistics.prototype.init = function (orbiter) {
  this.setOrbiter(orbiter);
  this.start();
};

/**
 * @private
 */
net.user1.orbiter.Statistics.prototype.setOrbiter = function (orbiter) {
  // Register new orbiter
  this.orbiter = orbiter;
};

net.user1.orbiter.Statistics.prototype.start = function () {
  this.stop();
  
  this.statsIntervalID = setInterval(statsTimerListener, 1000);
  
  this.lastTick = new Date().getTime();
  this.lastTotalMessages = this.getTotalMessages();
};

net.user1.orbiter.Statistics.prototype.stop = function () {
  clearInterval(statsIntervalID);
  this.clearStats();
};

/**
 * @private 
 */
net.user1.orbiter.Statistics.prototype.clearStats = function () {
  this.lastTick = 0;
  this.lastTotalMessages = 0;
  this.messagesPerSecond = 0;
  this.peakMessagesPerSecond = 0;
};

net.user1.orbiter.Statistics.prototype.getLifetimeNumClientsConnected = function () {
  return this.orbiter.getClientManager().getLifetimeNumClientsKnown();
};

net.user1.orbiter.Statistics.prototype.getCurrentNumClientsConnected = function () {
  return this.orbiter.getClientManager().getNumClients();
};

net.user1.orbiter.Statistics.prototype.getTotalMessagesReceived = function () {
  return this.orbiter.getMessageManager().getNumMessagesReceived();
}

net.user1.orbiter.Statistics.prototype.getTotalMessagesSent = function () {
  return this.orbiter.getMessageManager().getNumMessagesSent();
};

net.user1.orbiter.Statistics.prototype.getTotalMessages = function () {
  return this.getTotalMessagesReceived() + this.getTotalMessagesSent();
};

net.user1.orbiter.Statistics.prototype.getMessagesPerSecond = function () {
  return this.messagesPerSecond;
};

//==============================================================================
// PEAK MESSAGES PER SECOND
//==============================================================================

net.user1.orbiter.Statistics.prototype.getPeakMessagesPerSecond = function () {
  return this.peakMessagesPerSecond;
};

// =============================================================================
// TIMER LISTENER
// =============================================================================

/**
 * @private 
 */
net.user1.orbiter.Statistics.prototype.statsTimerListener = function (e) {
  // Check elapsed time
  var now = new Date().getTime();
  var elapsed = now - lastTick;
  lastTick = now;
  
  // Calculate number of messages sent and received since last tick
  var totalMessages = this.getTotalMessages();
  var tickNumMsgs   = totalMessages - this.lastTotalMessages;
  this.lastTotalMessages        = totalMessages;
  this.messagesPerSecond        = Math.round((1000/elapsed) * tickNumMsgs);
  if (this.messagesPerSecond > this.peakMessagesPerSecond) {
    this.peakMessagesPerSecond = this.messagesPerSecond;
  }
};
//==============================================================================
//  STATUS CONSTANTS
//==============================================================================
/** @class */
net.user1.orbiter.Status = new Object();
/** @constant */
net.user1.orbiter.Status.ACCOUNT_EXISTS         = "ACCOUNT_EXISTS";
/** @constant */
net.user1.orbiter.Status.ACCOUNT_NOT_FOUND      = "ACCOUNT_NOT_FOUND";
/** @constant */
net.user1.orbiter.Status.AUTHORIZATION_REQUIRED = "AUTHORIZATION_REQUIRED";
/** @constant */
net.user1.orbiter.Status.AUTHORIZATION_FAILED   = "AUTHORIZATION_FAILED";
/** @constant */
net.user1.orbiter.Status.ALREADY_ASSIGNED       = "ALREADY_ASSIGNED";
/** @constant */
net.user1.orbiter.Status.ALREADY_BANNED         = "ALREADY_BANNED";
/** @constant */
net.user1.orbiter.Status.ALREADY_IN_ROOM        = "ALREADY_IN_ROOM";
/** @constant */
net.user1.orbiter.Status.ALREADY_LOGGED_IN      = "ALREADY_LOGGED_IN";
/** @constant */
net.user1.orbiter.Status.ALREADY_OBSERVING      = "ALREADY_OBSERVING";
/** @constant */
net.user1.orbiter.Status.ALREADY_SYNCHRONIZED   = "ALREADY_SYNCHRONIZED";
/** @constant */
net.user1.orbiter.Status.ALREADY_WATCHING       = "ALREADY_WATCHING";  
/** @constant */
net.user1.orbiter.Status.ATTR_NOT_FOUND         = "ATTR_NOT_FOUND";
/** @constant */
net.user1.orbiter.Status.CLIENT_NOT_FOUND       = "CLIENT_NOT_FOUND";
/** @constant */
net.user1.orbiter.Status.ERROR                  = "ERROR";
/** @constant */
net.user1.orbiter.Status.EVALUATION_FAILED      = "EVALUATION_FAILED";
/** @constant */
net.user1.orbiter.Status.DUPLICATE_VALUE        = "DUPLICATE_VALUE";
/** @constant */
net.user1.orbiter.Status.IMMUTABLE              = "IMMUTABLE";
/** @constant */
net.user1.orbiter.Status.INVALID_QUALIFIER      = "INVALID_QUALIFIER";
/** @constant */
net.user1.orbiter.Status.NAME_NOT_FOUND         = "NAME_NOT_FOUND";
/** @constant */
net.user1.orbiter.Status.NAME_EXISTS            = "NAME_EXISTS";
/** @constant */
net.user1.orbiter.Status.NOT_ASSIGNED           = "NOT_ASSIGNED";
/** @constant */
net.user1.orbiter.Status.NOT_BANNED             = "NOT_BANNED";
/** @constant */
net.user1.orbiter.Status.NOT_IN_ROOM            = "NOT_IN_ROOM";
/** @constant */
net.user1.orbiter.Status.NOT_LOGGED_IN          = "NOT_LOGGED_IN";
/** @constant */
net.user1.orbiter.Status.NOT_OBSERVING          = "NOT_OBSERVING";
/** @constant */
net.user1.orbiter.Status.NOT_WATCHING           = "NOT_WATCHING";
/** @constant */
net.user1.orbiter.Status.PERMISSION_DENIED      = "PERMISSION_DENIED";
/** @constant */
net.user1.orbiter.Status.REMOVED                = "REMOVED";
/** @constant */
net.user1.orbiter.Status.ROLE_NOT_FOUND         = "ROLE_NOT_FOUND";
/** @constant */
net.user1.orbiter.Status.ROOM_EXISTS            = "ROOM_EXISTS";
/** @constant */
net.user1.orbiter.Status.ROOM_FULL              = "ROOM_FULL";
/** @constant */
net.user1.orbiter.Status.ROOM_NOT_FOUND         = "ROOM_NOT_FOUND";
/** @constant */
net.user1.orbiter.Status.SERVER_ONLY            = "SERVER_ONLY";
/** @constant */
net.user1.orbiter.Status.SUCCESS                = "SUCCESS";
//==============================================================================
//  STATUS CONSTANTS
//==============================================================================
/** @class */
net.user1.orbiter.SynchronizationState = new Object();
/** @constant */
net.user1.orbiter.SynchronizationState.SYNCHRONIZED     = "SYNCHRONIZED";
/** @constant */
net.user1.orbiter.SynchronizationState.NOT_SYNCHRONIZED = "NOT_SYNCHRONIZED";
/** @constant */
net.user1.orbiter.SynchronizationState.SYNCHRONIZING    = "SYNCHRONIZING";
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 */
net.user1.orbiter.UPCProcessingRecord = function () {
  /**
   * @field
   */
  this.fromClientID = null;
  /**
   * @field
   */
  this.fromUserID = null;
  /**
   * @field
   */
  this.fromClientAddress = null;
  /**
   * @field
   */
  this.processingStartedAt = NaN;
  /**
   * @field
   */
  this.processingFinishedAt = NaN;
  /**
   * @field
   */
  this.processingDuration = NaN;
  /**
   * @field
   */
  this.queuedAt = NaN;
  /**
   * @field
   */
  this.queueDuration = NaN;
  /**
   * @field
   */
  this.UPCSource = null;
};

/** 
 * @private
 */
net.user1.orbiter.UPCProcessingRecord.prototype.deserialize = function (serializedRecord) {
  var recordParts = [];
  var numSignificantSeparators = 6;
  var separatorIndices = [];
  var thisSeparatorIndex = 0;
  var previousSeparatorIndex = -1;
  
  // Don't use split because the source might contain the record separator
  for (var i = 0; i < numSignificantSeparators; i++) {
    thisSeparatorIndex = serializedRecord.indexOf(net.user1.orbiter.Tokens.RS, previousSeparatorIndex+1);
    recordParts.push(serializedRecord.substring(previousSeparatorIndex+1, thisSeparatorIndex));
    previousSeparatorIndex = thisSeparatorIndex;
  }
  recordParts.push(serializedRecord.substring(thisSeparatorIndex+1));
  
  this.deserializeParts(recordParts[0],
                        recordParts[1],
                        recordParts[2],
                        recordParts[3],
                        recordParts[4],
                        recordParts[5],
                        recordParts[6]);
};

/** 
 * @private
 */
net.user1.orbiter.UPCProcessingRecord.prototype.deserializeParts = function (fromClientID,
                                                                             fromUserID,
                                                                             fromClientAddress,
                                                                             queuedAt,
                                                                             processingStartedAt,
                                                                             processingFinishedAt,
                                                                             source) {
  this.fromClientID = fromClientID;
  this.fromUserID = fromUserID;
  this.fromClientAddress = fromClientAddress;
  this.processingStartedAt = parseFloat(processingStartedAt);
  this.processingFinishedAt = parseFloat(processingFinishedAt);
  this.processingDuration = this.processingFinishedAt - this.processingStartedAt;
  this.queuedAt = parseFloat(queuedAt);
  this.queueDuration = this.processingStartedAt - this.queuedAt;
  this.UPCSource = source;
  var escapedCDStart = /<!\(\[CDATA\[/gi; 
  var escapedCDEnd = /\]\]\)>/gi; 
  this.UPCSource = this.UPCSource.replace(escapedCDStart, "<![CDATA[");
  this.UPCSource = this.UPCSource.replace(escapedCDEnd, "]]>");
}
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.snapshot.Snapshot
 */
net.user1.orbiter.snapshot.UPCStatsSnapshot = function () {
  // Call superconstructor
  net.user1.orbiter.snapshot.Snapshot.call(this);
  this.totalUPCsProcessed;
  this.numUPCsInQueue;
  this.lastQueueWaitTime;
  this.longestUPCProcesses;
  this.method = net.user1.orbiter.UPC.GET_UPC_STATS_SNAPSHOT;
  this.hasStatus = true;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.snapshot.UPCStatsSnapshot, net.user1.orbiter.snapshot.Snapshot);

//==============================================================================
// INSTANCE METHODS
//==============================================================================         
/**
 * @private
 */
net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.setTotalUPCsProcessed = function (value) {
  this.totalUPCsProcessed = value;
};
    
net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.getTotalUPCsProcessed = function () {
  return this.totalUPCsProcessed;
};
        
/**
 * @private
 */
net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.setNumUPCsInQueue = function (value) {
  this.numUPCsInQueue = value;
};

net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.getNumUPCsInQueue = function () {
  return this.numUPCsInQueue;
};
    
/**
 * @private
 */
net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.setLastQueueWaitTime = function (value) {
  this.lastQueueWaitTime = value;
};

net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.getLastQueueWaitTime = function () {
  return this.lastQueueWaitTime;
};
    
/**
 * @private
 */
net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.setLongestUPCProcesses = function (value) {
  this.longestUPCProcesses = value;
};

net.user1.orbiter.snapshot.UPCStatsSnapshot.prototype.getLongestUPCProcesses = function () {
  if (!this.longestUPCProcesses) {
    return null;
  }
  return this.longestUPCProcesses.slice();
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
net.user1.orbiter.UpdateLevels = function () {
  this.restoreDefaults();
};

//==============================================================================    
// STATIC VARIABLES
//==============================================================================
net.user1.orbiter.UpdateLevels.FLAG_ROOM_MESSAGES     = 1;
net.user1.orbiter.UpdateLevels.FLAG_SHARED_ROOM_ATTRIBUTES = 1 << 1;
net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_COUNT = 1 << 2;
net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_COUNT = 1 << 3;
net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LIST = 1 << 4;
net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LIST = 1 << 5;
net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_ROOM = 1 << 6;
net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_ROOM = 1 << 7;
net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_GLOBAL = 1 << 8;
net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_GLOBAL = 1 << 9;
net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LOGIN_LOGOFF = 1 << 10;
net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LOGIN_LOGOFF = 1 << 11;
net.user1.orbiter.UpdateLevels.FLAG_ALL_ROOM_ATTRIBUTES = 1 << 12;

//==============================================================================    
// INSTANCE METHODS
//==============================================================================
net.user1.orbiter.UpdateLevels.prototype.clearAll = function () {
  this.roomMessages = false;
  this.sharedRoomAttributes = false;
  this.occupantCount = false;
  this.observerCount = false;
  this.occupantList = false;
  this.observerList = false;
  this.sharedOccupantAttributesRoom = false;
  this.sharedOccupantAttributesGlobal = false;
  this.sharedObserverAttributesRoom = false;
  this.sharedObserverAttributesGlobal = false;
  this.occupantLoginLogoff = false;
  this.observerLoginLogoff = false;
  this.allRoomAttributes = false;
};

net.user1.orbiter.UpdateLevels.prototype.restoreDefaults = function () {
  this.roomMessages = true;
  this.sharedRoomAttributes = true;
  this.occupantCount = false;
  this.observerCount = false;
  this.occupantList = true;
  this.observerList = false;
  this.sharedOccupantAttributesRoom = true;
  this.sharedOccupantAttributesGlobal = true;
  this.sharedObserverAttributesRoom = false;
  this.sharedObserverAttributesGlobal = false;
  this.occupantLoginLogoff = true;
  this.observerLoginLogoff = false;
  this.allRoomAttributes = false;
};
    
net.user1.orbiter.UpdateLevels.prototype.toInt = function () {
  var levels = (this.roomMessages ? net.user1.orbiter.UpdateLevels.FLAG_ROOM_MESSAGES : 0)
   | (this.sharedRoomAttributes ? net.user1.orbiter.UpdateLevels.FLAG_SHARED_ROOM_ATTRIBUTES : 0)
   | (this.occupantCount ? net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_COUNT : 0)
   | (this.observerCount ? net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_COUNT : 0)
   | (this.occupantList ? net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LIST : 0)
   | (this.observerList ? net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LIST : 0)
   | (this.sharedOccupantAttributesRoom ? net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_ROOM : 0)
   | (this.sharedOccupantAttributesGlobal ? net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_GLOBAL : 0)
   | (this.sharedObserverAttributesRoom ? net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_ROOM : 0)
   | (this.sharedObserverAttributesGlobal ? net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_GLOBAL : 0)
   | (this.occupantLoginLogoff ? net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LOGIN_LOGOFF : 0)
   | (this.observerLoginLogoff ? net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LOGIN_LOGOFF : 0)
   | (this.allRoomAttributes ? net.user1.orbiter.UpdateLevels.FLAG_ALL_ROOM_ATTRIBUTES : 0);
  
  return levels;
};
    
net.user1.orbiter.UpdateLevels.prototype.fromInt = function (levels) {
  roomMessages                   = levels & net.user1.orbiter.UpdateLevels.FLAG_ROOM_MESSAGES;
  sharedRoomAttributes           = levels & net.user1.orbiter.UpdateLevels.FLAG_SHARED_ROOM_ATTRIBUTES;
  occupantCount                  = levels & net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_COUNT;
  observerCount                  = levels & net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_COUNT;
  occupantList                   = levels & net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LIST;
  observerList                   = levels & net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LIST;
  sharedOccupantAttributesRoom   = levels & net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_ROOM;
  sharedOccupantAttributesGlobal = levels & net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_GLOBAL;
  sharedObserverAttributesRoom   = levels & net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_ROOM;
  sharedObserverAttributesGlobal = levels & net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_GLOBAL;
  occupantLoginLogoff            = levels & net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LOGIN_LOGOFF;
  observerLoginLogoff            = levels & net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LOGIN_LOGOFF;
  allRoomAttributes              = levels & net.user1.orbiter.UpdateLevels.FLAG_ALL_ROOM_ATTRIBUTES;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The UserAccount class dispatches the following events:

<ul class="summary">
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGIN}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGOFF_RESULT}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.LOGOFF}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.CHANGE_PASSWORD}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.SYNCHRONIZE}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.OBSERVE}</li> 
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.OBSERVE_RESULT}</li>  
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.STOP_OBSERVING}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.ADD_ROLE_RESULT}</li>    
  <li class="fixedFont">{@link net.user1.orbiter.AccountEvent.REMOVE_ROLE_RESULT}</li>    
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/

net.user1.orbiter.UserAccount = function (userID, 
                                          log,
                                          accountManager,
                                          clientManager,
                                          roomManager) {
  net.user1.events.EventDispatcher.call(this);
  
  this.userID = userID;
  this.attributeManager = null;
  this.connectionState = 0;
  this.password = null;
  this.lastAttemptedPassword = null;
  this._client = null;
  this._accountManager = null;
  this._clientManager = null;
  this._roomManager = null;
  this._log = null;
  
  this.setLog(log);
  this.setAccountManager(accountManager);
  this.setClientManager(clientManager);
  this.setRoomManager(roomManager);
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.UserAccount, net.user1.events.EventDispatcher);

//==============================================================================
// STATIC VARIABLES
//==============================================================================
/** @private */    
net.user1.orbiter.UserAccount.FLAG_MODERATOR = 1 << 1;
    
//==============================================================================
// DEPENDENCIES
//==============================================================================

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getAttributeCollection = function () {
  return this.attributeManager.getAttributeCollection();
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setAttributeManager = function (value) {
  this.attributeManager = value;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getAttributeManager = function () {
  return this.attributeManager;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getClientManager = function () {
  return this._clientManager;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setClientManager = function (value) {
  this._clientManager = value;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getRoomManager = function () {
  return this._roomManager;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setRoomManager = function (value) {
  this._roomManager = value;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getLog = function () {
  return this._log;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setLog = function (value) {
  this._log = value;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.getAccountManager = function () {
  return this._accountManager;
};

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setAccountManager = function (value) {
  this._accountManager = value;
};

net.user1.orbiter.UserAccount.prototype.getClient = function () {
  var customClient;
  this.validateClientReference();
  if (this._client != null) {
    customClient = this._client.getCustomClient(null);
    return customClient == null ? this._client : customClient;
  } else {
    return null;
  }
};

net.user1.orbiter.UserAccount.prototype.getInternalClient = function () {
  this.validateClientReference();
  return this._client;
}

/**
 * @private
 */        
net.user1.orbiter.UserAccount.prototype.setClient = function (value) {
  if (value == null) {
    this._client = null;
  } else {
    if (this._client != value) {
      this._client = value;
      this._client.setAccount(this);
    }
  }
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.validateClientReference = function () {
  if (this._client != null) {
    if (!this._client.isSelf()
        && !this._clientManager.isWatchingForClients()
        && !this._accountManager.isObservingAccount(this.getUserID()) 
        && !this._clientManager.isObservingClient(this._client.getClientID())
        && !this._roomManager.clientIsKnown(this._client.getClientID())) {
      this.setClient(null);
    }
  }
};

//==============================================================================
// IS SELF
//==============================================================================

net.user1.orbiter.UserAccount.prototype.isSelf = function () {
  return this._client == null ? false : this._client.isSelf();
};

//==============================================================================
// CONNECTION STATE
//==============================================================================

net.user1.orbiter.UserAccount.prototype.getConnectionState = function () {
  if (this.getInternalClient() != null) {
    return net.user1.orbiter.ConnectionState.LOGGED_IN;
  } else if (!this._accountManager.isObservingAccount(this.getUserID())) {
      return net.user1.orbiter.ConnectionState.NOT_CONNECTED;
  } else if (this._clientManager.isWatchingForClients()) {
    return net.user1.orbiter.ConnectionState.NOT_CONNECTED;
  } else {
    // Not observing this user, not watching for clients, and no client means
    // this account's state is unknown. (This happens when watching for user
    // accounts).
    return net.user1.orbiter.ConnectionState.UNKNOWN;
  }
};

net.user1.orbiter.UserAccount.prototype.isLoggedIn = function () {
  return this.getConnectionState() == net.user1.orbiter.ConnectionState.LOGGED_IN;
};

//==============================================================================
// USER ID
//==============================================================================

net.user1.orbiter.UserAccount.prototype.getUserID = function () {
  return this.userID;
};

/**
 * @private
 */ 
net.user1.orbiter.UserAccount.prototype.setUserID = function (userID) {
  if (this.userID != userID) {
    this.userID = userID;
  }
};

// =============================================================================
// LOGOFF
// =============================================================================

net.user1.orbiter.UserAccount.prototype.logoff = function (password) {
  this._accountManager.logoff(this.getUserID(), password);
};

// =============================================================================
// CHANGE PASSWORD
// =============================================================================

net.user1.orbiter.UserAccount.prototype.changePassword = function (newPassword, oldPassword) {
  this._accountManager.changePassword(this.getUserID(), newPassword, oldPassword);
};

// =============================================================================
// ROLES
// =============================================================================

net.user1.orbiter.UserAccount.prototype.addRole = function (role) {
  this._accountManager.addRole(this.getUserID(), role);
};

net.user1.orbiter.UserAccount.prototype.removeRole = function (userID, role) {
  this._accountManager.removeRole(this.getUserID(), role);
};

net.user1.orbiter.UserAccount.prototype.isModerator = function () {
  var rolesAttr = this.getAttribute(net.user1.orbiter.Tokens.ROLES_ATTR);
  var roles;
  if (rolesAttr != null) {
    return (parseInt(rolesAttr) & UserAccount.FLAG_MODERATOR) > 0;
  } else {
    this.getLog().warn(this.toString() + " Could not determine moderator status because the account is not synchronized.");
    return false;
  }
};

// =============================================================================
// LOGIN/LOGOFF TASKS
// =============================================================================

/**
 * @private
 */ 
net.user1.orbiter.UserAccount.prototype.doLoginTasks = function () {
  this.fireLogin();
};

/**
 * @private
 */ 
net.user1.orbiter.UserAccount.prototype.doLogoffTasks = function () {
  this.setClient(null);
  this.fireLogoff();
};

// =============================================================================
// OBSERVATION
// =============================================================================

net.user1.orbiter.UserAccount.prototype.observe = function () {
  this._accountManager.observeAccount(this.getUserID());
};

net.user1.orbiter.UserAccount.prototype.stopObserving = function () {
  this._accountManager.stopObservingAccount(this.getUserID());
};

// =============================================================================
// ATTRIBUTES: PUBLIC API
// =============================================================================

net.user1.orbiter.UserAccount.prototype.setAttribute = function (attrName, 
                                                                 attrValue, 
                                                                 attrScope, 
                                                                 isShared, 
                                                                 evaluate) {
  // Create an integer to hold the attribute options
  var attrOptions = net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT
                      | (isShared     ? net.user1.orbiter.AttributeOptions.FLAG_SHARED     : 0) 
                      | (evaluate     ? net.user1.orbiter.AttributeOptions.FLAG_EVALUATE   : 0);
  
  // Set the attribute on the server.
  this.attributeManager.setAttribute(new net.user1.orbiter.upc.SetClientAttr(attrName, attrValue, attrOptions, attrScope, null, this.getUserID()));
};

net.user1.orbiter.UserAccount.prototype.deleteAttribute = function (attrName, attrScope) {
  var deleteRequest = new net.user1.orbiter.upc.RemoveClientAttr(null, this.getUserID(), attrName, attrScope);
  this.attributeManager.deleteAttribute(deleteRequest);
};

net.user1.orbiter.UserAccount.prototype.getAttribute = function (attrName, attrScope) {
  return this.attributeManager.getAttribute(attrName, attrScope);
};

net.user1.orbiter.UserAccount.prototype.getAttributes = function () {
  return this.attributeManager.getAttributes();
}; 

net.user1.orbiter.UserAccount.prototype.getAttributesByScope = function (scope) {
  return this.attributeManager.getAttributesByScope(scope);
};

//==============================================================================
// TOSTRING
//==============================================================================

net.user1.orbiter.UserAccount.prototype.toString = function () {
  return "[USER_ACCOUNT userid: " + this.getUserID() + ", clientid: " + (this._client == null ? "" : this._client.getClientID()) + "]";
};

//==============================================================================
// EVENT DISPATCHING
//==============================================================================

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireLogin = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGIN,
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};    

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireLogoffResult = function (status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGOFF_RESULT,
                                             status, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};    

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireLogoff = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.LOGOFF,
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};    

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireChangePasswordResult = function (status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD_RESULT,
                                             status, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};    

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireChangePassword = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.CHANGE_PASSWORD,
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};    

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireSynchronize = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.SYNCHRONIZE, 
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireObserve = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.OBSERVE, 
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireObserveResult = function (status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.OBSERVE_RESULT, 
                                             status, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireStopObserving = function () {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.STOP_OBSERVING, 
                                             net.user1.orbiter.Status.SUCCESS, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireStopObservingResult = function (status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.STOP_OBSERVING_RESULT, 
                                             status, this.getUserID(), (this._client == null ? null : this._client.getClientID()));
  this.dispatchEvent(e);
};

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireAddRoleResult = function (role, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.ADD_ROLE_RESULT, 
                                             status, this.getUserID(), 
                                             (this._client == null ? null : this._client.getClientID()), role);
  this.dispatchEvent(e);
}

/**
 * @private
 */
net.user1.orbiter.UserAccount.prototype.fireRemoveRoleResult = function (role, status) {
  var e = new net.user1.orbiter.AccountEvent(net.user1.orbiter.AccountEvent.REMOVE_ROLE_RESULT, 
                                             status, this.getUserID(), 
                                             (this._client == null ? null : this._client.getClientID()), role);
  this.dispatchEvent(e);
}













//==============================================================================
// VALIDATION UTILITIES
//==============================================================================
net.user1.orbiter.Validator = new Object();

net.user1.orbiter.Validator.isValidRoomID = function (value) {
  // Can't be null, nor the empty string
  if (value == null || value == "") {
    return false;
  }
  // Can't contain "."
  if (value.indexOf(".") != -1) {
    return false;
  }
  // Can't contain RS
  if (value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
  // Can't contain WILDCARD
  if (value.indexOf(net.user1.orbiter.Tokens.WILDCARD) != -1) {
    return false;
  }
  
  return true;
};

net.user1.orbiter.Validator.isValidRoomQualifier = function (value) {
  if (value == null || value == "") {
    return false;
  }
  // "*" is valid (it means the unnamed qualifier)
  if (value == "*") {
    return true;
  }
  
  // Can't contain RS
  if (value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
  // Can't contain WILDCARD
  if (value.indexOf(net.user1.orbiter.Tokens.WILDCARD) != -1) {
    return false;
  }
  
  return true;
};

net.user1.orbiter.Validator.isValidResolvedRoomID = function (value) {
  // Can't be null, nor the empty string
  if (value == null || value == "") {
    return false;
  }
  
  // Can't contain RS
  if (value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
  // Can't contain WILDCARD
  if (value.indexOf(net.user1.orbiter.Tokens.WILDCARD) != -1) {
    return false;
  }
  
  return true;
};

net.user1.orbiter.Validator.isValidAttributeName = function (value) {
  // Can't be empty 
  if (value == "" || value == null) {
    return false;
  }
  
  // Can't contain RS
  if (value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
        
  return true;
};

net.user1.orbiter.Validator.isValidAttributeValue = function (value) {
  // Can't contain RS
  if (typeof value != "string") {
    // Non-string attribute values are coerced to strings at send time
    value = value.toString();
  }
  if (value.indexOf(net.user1.orbiter.Tokens.RS) == -1) {
    return true;
  } else {
    return false;
  }
};

net.user1.orbiter.Validator.isValidAttributeScope = function (value) {
  // Can't contain RS
  if (value != null) {
    return this.isValidResolvedRoomID(value);
  } else {
    return true;
  }
};

net.user1.orbiter.Validator.isValidModuleName = function (value) {
  // Can't be empty (can be null)
  if (value == "") {
    return false;
  }
  
  // Can't contain RS
  if (value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
  
  return true;
};

net.user1.orbiter.Validator.isValidPassword = function (value) {
  // Can't contain RS
  if (value != null && value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
  
  return true;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
 * The Orbiter class is the root class of every Orbiter application.
 * It provides basic tools for connecting to Union server, and gives
 * the application access to the core Orbiter system modules.
 * Orbiter dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.OrbiterEvent.READY}</li>
<li class="fixedFont">{@link net.user1.orbiter.OrbiterEvent.CLOSE}</li>
<li class="fixedFont">{@link net.user1.orbiter.OrbiterEvent.CONNECT_REFUSED}</li>
<li class="fixedFont">{@link net.user1.orbiter.OrbiterEvent.PROTOCOL_INCOMPATIBLE}</li>
</ul>

 * To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.
 *
 * @param configURL The URL of a connection-configuration file. When the file
 * finishes loading, the Orbiter client automatically attempts to connect to
 * Union Server at the specified address(es). Note that the configuration file
 * need not be loaded at construction time; it can be loaded later via Orbiter's
 * loadConfig() method. For configuration file details, see loadConfig().
 *
 * @param traceLogMessages A flag indicating whether to send log messages to the
 * JavaScript output console. Applies to environments that support the
 * console.log() function only.
 *
 * @extends net.user1.events.EventDispatcher
 */
net.user1.orbiter.Orbiter = function (configURL,
                                      traceLogMessages) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);

  // Initialization. For non-browser environments, set window to null.
  this.window = typeof window == "undefined" ? null : window;

  traceLogMessages = traceLogMessages == null ? true : traceLogMessages; 

  this.useSecureConnect = false;
  this.statistics = null;
  this.sessionID = null;

  // Initialize system versions
  this.system = new net.user1.orbiter.System(this.window);
                           
  // Set up the this.log.
  this.log = new net.user1.logger.Logger();

  // Output host version information.
  if (typeof navigator != "undefined") {
    this.log.info("User Agent: " + navigator.userAgent + " " + navigator.platform);
  }
  this.log.info("Union Client Version: " + this.system.getClientType() + " " + this.system.getClientVersion().toStringVerbose());
  this.log.info("Client UPC Protocol Version: " + this.system.getUPCVersion().toString());
  this.consoleLogger = null;

  // Set up the connection manager.
  this.connectionMan = new net.user1.orbiter.ConnectionManager(this);
  
  // Set up the room manager.
  this.roomMan = new net.user1.orbiter.RoomManager(this);
  
  // Set up the message manager.
  this.messageMan = new net.user1.orbiter.MessageManager(this.log, this.connectionMan);

  // Set up the server
  this.server = new net.user1.orbiter.Server(this);
  
  // Make the account manager.
  this.accountMan = new net.user1.orbiter.AccountManager(this.log);
  
  // Set up the client manager.
  this.clientMan = new net.user1.orbiter.ClientManager(this.roomMan, this.accountMan, this.connectionMan, this.messageMan, this.server, this.log);

  // Set up the account manager.
  this.accountMan.setClientManager(this.clientMan);
  this.accountMan.setMessageManager(this.messageMan);
  this.accountMan.setRoomManager(this.roomMan);

  // Set up the snapshot manager.
  this.snapshotMan = new net.user1.orbiter.SnapshotManager(this.messageMan);
  
  // Set up the core message listener
  this.coreMsgListener = new net.user1.orbiter.CoreMessageListener(this);
  
  // Log the core Reactor events
  this.coreEventLogger = new net.user1.orbiter.CoreEventLogger(this.log, this.connectionMan, this.roomMan, 
                                             this.accountMan, this.server, this.clientMan,
                                             this);

  // Register for ConnectionManager events.
  this.connectionMan.addEventListener(net.user1.orbiter.ConnectionManagerEvent.READY, 
                                 this.readyListener, this);
  this.connectionMan.addEventListener(net.user1.orbiter.ConnectionManagerEvent.CONNECT_FAILURE, 
                                 this.connectFailureListener, this);
  this.connectionMan.addEventListener(net.user1.orbiter.ConnectionManagerEvent.DISCONNECT, 
                                 this.disconnectListener, this);
  
  // Set up the connection monitor
  this.connectionMonitor = new net.user1.orbiter.ConnectionMonitor(this);
  this.connectionMonitor.restoreDefaults();

  // Register to be notified when a new connection is about to be opened 
  this.connectionMan.addEventListener(net.user1.orbiter.ConnectionManagerEvent.SELECT_CONNECTION, 
                                      this.selectConnectionListener, this);
  
  // Enable HTTP failover connections
  this.httpFailoverEnabled = true;

  if (traceLogMessages) {
    this.enableConsole();
  }
  
  // If the Reactor wasn't constructed with a config argument...
  if (configURL == null || configURL == "") {
    this.log.info("[ORBITER] Initialization complete.");
  } else {
    // ...otherwise, retrieve system settings from specified config file.
    this.loadConfig(configURL);
  }
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.Orbiter, net.user1.events.EventDispatcher);
 
//==============================================================================
// XML CONFIG METHODS
//==============================================================================

/**
 * Loads the client-configuration file. When the file load completes,
 * Orbiter automatically attempts to connect to Union Server using
 * the settings specified by the configuration file.
 *
 * The configuration file has the following format:
 *
 * <pre>
 * &lt;?xml version="1.0"?>
 * &lt;config>
 *   &lt;connections>
 *     &lt;connection host="hostNameOrIP1" port="portNumber1" type="connectionType1" senddelay="milliseconds1" secure="false" />
 *     &lt;connection host="hostNameOrIP2" port="portNumber2" type="connectionType2" senddelay="milliseconds2" secure="false" />
 *     ...
 *     &lt;connection host="hostNameOrIPn" port="portNumbern" type="connectionTypen" senddelay="millisecondsn" secure="false" />
 *   &lt;/connections>
 *   &lt;autoreconnectfrequency>frequency&lt;/autoreconnectfrequency>
 *   &lt;connectiontimeout>duration&lt;/connectiontimeout>
 *   &lt;heartbeatfrequency>frequency&lt;/heartbeatfrequency>
 *   &lt;readytimeout>timeout&lt;/readytimeout>
 *   &lt;loglevel>level&lt;/loglevel>
 * &lt;/config>
 * </pre>
 *
 * When the <code>secure</code> attribute is true, communication is
 * conducted over WSS or HTTPS using the environment's TLS implementation.
 */
net.user1.orbiter.Orbiter.prototype.loadConfig = function (configURL) {
  this.log.info("[ORBITER] Loading config from " + configURL +".");
  var request = new XMLHttpRequest();
  var self = this;
  
  request.onerror = function () {
    self.configErrorListener();
  };
  
  request.onreadystatechange = function (state) {
    if (request.readyState == 4) {
      self.configLoadCompleteListener(request);
    }
  }
  request.open("GET", configURL);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
  request.send(null);
};

/**
 * @private
 */
net.user1.orbiter.Orbiter.prototype.getTextForNode = function (tree, tagname) {
  var nodes = tree.getElementsByTagName(tagname);
  var node;
  if (nodes.length > 0) {
    node = nodes[0];
  }
  
  if (node != null 
      && node.firstChild != null
      && node.firstChild.nodeType == 3
      && node.firstChild.nodeValue.length > 0) {
    return node.firstChild.nodeValue;
  } else {
    return null;
  }
};


/**
 * @private
 */
net.user1.orbiter.Orbiter.prototype.configLoadCompleteListener = function (request) {
  var config = request.responseXML;
  if ((request.status != 200 && request.status != 0) || config == null) {
    this.log.error("[ORBITER] Configuration file failed to load.");
    return;
  }
  this.log.error("[ORBITER] Configuration file loaded.");
  try {
    var loglevel = this.getTextForNode(config, "logLevel");
    if (loglevel != null) {
      this.log.setLevel(loglevel);
    }

    var autoreconnectfrequencyNodes = config.getElementsByTagName("autoreconnectfrequency");
    var autoreconnectfrequencyNode = null;
    if (autoreconnectfrequencyNodes.length == 1) {
      autoreconnectfrequencyNode = autoreconnectfrequencyNodes[0];
      var nodetext = this.getTextForNode(config, "autoreconnectfrequency");
      if (nodetext != null && !isNaN(parseInt(nodetext))) {
        this.connectionMonitor.setAutoReconnectFrequency(
            parseInt(nodetext),
            parseInt(nodetext),
            autoreconnectfrequencyNode.getAttribute("delayfirstattempt") == null ? false :
            autoreconnectfrequencyNode.getAttribute("delayfirstattempt").toLowerCase() == "true"
          );
      } else {
        this.connectionMonitor.setAutoReconnectFrequency(
            parseInt(autoreconnectfrequencyNode.getAttribute("minms")),
            parseInt(autoreconnectfrequencyNode.getAttribute("maxms")),
            autoreconnectfrequencyNode.getAttribute("delayfirstattempt") == null ? false :
              autoreconnectfrequencyNode.getAttribute("delayfirstattempt").toLowerCase() == "true"
          );
      }
      if (autoreconnectfrequencyNode.getAttribute("maxattempts") != null
          && autoreconnectfrequencyNode.getAttribute("maxattempts").length > 0) {
        this.connectionMonitor.setAutoReconnectAttemptLimit(
            parseInt(autoreconnectfrequencyNode.getAttribute("maxattempts"))
          );
      }
    }

    var connectiontimeout = this.getTextForNode(config, "connectionTimeout"); 
    if (connectiontimeout != null) {
      this.connectionMonitor.setConnectionTimeout(parseInt(connectiontimeout));
    }
    
    var heartbeatfrequency = this.getTextForNode(config, "heartbeatFrequency"); 
    if (heartbeatfrequency != null) {
      this.connectionMonitor.setHeartbeatFrequency(parseInt(heartbeatfrequency));
    }
    
    var readytimeout = this.getTextForNode(config, "readyTimeout"); 
    if (readytimeout != null) {
      this.connectionMan.setReadyTimeout(parseInt(readytimeout));
    }
    
    var connections = config.getElementsByTagName("connection");
    if (connections.length == 0) {      
      this.log.error("[ORBITER] No connections specified in Orbiter configuration file.");
      return;
    }
    
    // Make connections
    var connection;
    var host;
    var port;
    var type;
    var secure;
    var sendDelay;
    
    for (var i = 0; i < connections.length; i++) {
      connection = connections[i];
      host = connection.getAttribute("host");
      port = connection.getAttribute("port");
      type = connection.getAttribute("type");
      if (type != null) {
        type = type.toUpperCase();
      }
      secure = connection.getAttribute("secure");
      sendDelay = connection.getAttribute("senddelay");
  
      switch (type) {
        // No type means make a socket connection with an http backup
        case null:
          if (secure === "true") {
            this.buildConnection(host, port, net.user1.orbiter.ConnectionType.SECURE_WEBSOCKET, -1);
            this.buildConnection(host, port, net.user1.orbiter.ConnectionType.SECURE_HTTP, sendDelay);
          } else {
            this.buildConnection(host, port, net.user1.orbiter.ConnectionType.WEBSOCKET, -1);
            this.buildConnection(host, port, net.user1.orbiter.ConnectionType.HTTP, sendDelay);
          }
          break;

        case net.user1.orbiter.ConnectionType.WEBSOCKET:
          if (secure === "true") {
            this.buildConnection(host, port, net.user1.orbiter.ConnectionType.SECURE_WEBSOCKET, -1);
          } else {
            this.buildConnection(host, port, net.user1.orbiter.ConnectionType.WEBSOCKET, -1);
          }
          break;

        case net.user1.orbiter.ConnectionType.HTTP:
          if (secure === "true") {
            this.buildConnection(host, port, net.user1.orbiter.ConnectionType.SECURE_HTTP, sendDelay);
          } else {
            this.buildConnection(host, port, net.user1.orbiter.ConnectionType.HTTP, sendDelay);
          }
          break;
        
        default:
          this.log.error("[ORBITER] Unrecognized connection type in Orbiter configuration file: [" + type + "]. Connection ignored.");
      }
    }
  } catch (error) {
    this.log.error("[ORBITER] Error parsing connection in Orbiter configuration file: \n" 
                   + request.responseText + "\n" + error.toString());
  }
  
  this.connect();
};

/** @private */   
net.user1.orbiter.Orbiter.prototype.buildConnection = function (host, port, type, sendDelay) {
  var connection;
  
  switch (type) {
    case net.user1.orbiter.ConnectionType.HTTP:
      if (this.system.hasHTTPDirectConnection()) {
        connection = new net.user1.orbiter.HTTPDirectConnection();
      } else {
        connection = new net.user1.orbiter.HTTPIFrameConnection();
      }
      break;

    case net.user1.orbiter.ConnectionType.SECURE_HTTP:
      if (this.system.hasHTTPDirectConnection()) {
        connection = new net.user1.orbiter.SecureHTTPDirectConnection();
      } else {
        connection = new net.user1.orbiter.SecureHTTPIFrameConnection();
      }
      break;

    case net.user1.orbiter.ConnectionType.WEBSOCKET:
      connection = new net.user1.orbiter.WebSocketConnection();
      break;

    case net.user1.orbiter.ConnectionType.SECURE_WEBSOCKET:
      connection = new net.user1.orbiter.SecureWebSocketConnection();
      break;

    default:
      throw new Error("[ORBITER] Error at buildConnection(). Invalid type specified: [" + type + "]");
  }
  
  try {
    connection.setServer(host, port);
  } catch (e) {
    this.log.error("[CONNECTION] " + connection.toString() + " " + e);
  } finally {
    this.connectionMan.addConnection(connection);
    if (connection instanceof net.user1.orbiter.HTTPConnection) {
      // Set delay after adding connection so the connection object has
      // access to this Orbiter object
      if (sendDelay != null && sendDelay != "") {
        connection.setSendDelay(sendDelay);
      }
    }
  }
};

/**
 * @private
 */
net.user1.orbiter.Orbiter.prototype.configErrorListener = function (e) {
  this.log.fatal("[ORBITER] Configuration file could not be loaded.");
};

//==============================================================================
// CONNECTION METHODS
//==============================================================================

/**
 * <p>
 * The connect() method attempts to connect to Union Server at the specified
 * host and ports. If no host and ports are specified, Orbiter attempts to
 * connect using the ConnectionManager's current list of hosts and ports.
 * </p>
 *
 * @param host
 * @param port1
 * @param port2
 * @param ...
 * @param portn
 */
net.user1.orbiter.Orbiter.prototype.connect = function (host) {
  this.useSecureConnect = false;
  this.doConnect.apply(this, arguments);
};

/**
 * <p>
 * The secureConnect() method is identical to the connect() method, except that
 * it uses an encrypted connection (TLS or SSL) rather than an
 * unencrypted connection. Before secureConnect() can be used, Union Server
 * must be configured to accept client communications over a secure gateway,
 * which includes the installation of a server-side security certificate. For
 * instructions on configuring Union Server for secure communications, see
 * Union Server's documentation at http://unionplatform.com.
 * </p>
 *
 * @see net.user1.orbiter.Orbiter#connect
 */
net.user1.orbiter.Orbiter.prototype.secureConnect = function (host) {
  this.useSecureConnect = true;
  this.doConnect.apply(this, arguments);
};

/**
 * @private
 */
net.user1.orbiter.Orbiter.prototype.doConnect = function (host) {
  var ports = Array.prototype.slice.call(arguments).slice(1);
  if (host != null) {
    this.setServer.apply(this, [host].concat(ports));
  }
  this.log.info("[ORBITER] Connecting to Union...");
  this.connectionMan.connect();
};

net.user1.orbiter.Orbiter.prototype.disconnect = function () {
  this.connectionMan.disconnect();
};

net.user1.orbiter.Orbiter.prototype.setServer = function (host) {
  var ports = Array.prototype.slice.call(arguments).slice(1);
  if (host != null && ports.length > 0) {
    if (this.connectionMan.getConnections().length > 0) {
      this.connectionMan.removeAllConnections();
    }
    // Where possible, create WebSocket connections for the specified
    // host and its ports.
    var connectionType;
    if (this.system.hasWebSocket()) {
      for (var i = 1; i < arguments.length; i++) {
        connectionType = this.useSecureConnect
                         ? net.user1.orbiter.ConnectionType.SECURE_WEBSOCKET
                         : net.user1.orbiter.ConnectionType.WEBSOCKET;
        this.buildConnection(host, arguments[i], connectionType, -1);
      }
    } else {
      this.log.info("[ORBITER] WebSocket not found in host environment. Trying HTTP.");
    }
    // Next, if failover is enabled or WebSocket is not supported, create HTTPConnections
    if (this.isHTTPFailoverEnabled() || !this.system.hasWebSocket()) {
      for (i = 1; i < arguments.length; i++) {
        connectionType = this.useSecureConnect
                         ? net.user1.orbiter.ConnectionType.SECURE_HTTP
                         : net.user1.orbiter.ConnectionType.HTTP;
        this.buildConnection(host,
                             arguments[i], 
                             connectionType,
                             net.user1.orbiter.HTTPConnection.DEFAULT_SEND_DELAY);
      }
    }
  } else {
    this.log.error("[ORBITER] setServer() failed. Invalid host [" + host + "] or port [" + ports.join(",") + "].");
  }
};

net.user1.orbiter.Orbiter.prototype.isReady = function () {
  return this.connectionMan.isReady();
};

//==============================================================================
// HTTP FAILOVER CONFIGURATION
//==============================================================================

net.user1.orbiter.Orbiter.prototype.enableHTTPFailover = function () {
  this.httpFailoverEnabled = true;
};

net.user1.orbiter.Orbiter.prototype.disableHTTPFailover = function () {
  this.httpFailoverEnabled = false;
};

net.user1.orbiter.Orbiter.prototype.isHTTPFailoverEnabled = function () {
  return this.httpFailoverEnabled;
};

//==============================================================================
// STATISTICS MANAGEMENT
//==============================================================================

net.user1.orbiter.Orbiter.prototype.enableStatistics = function () {
  if (this.statistics == null) {
    this.statistics = new net.user1.orbiter.Statistics(this);
  }
}

net.user1.orbiter.Orbiter.prototype.disableStatistics = function () {
  if (this.statistics != null) {
    this.statistics.stop();
  }
}

net.user1.orbiter.Orbiter.prototype.getStatistics = function () {
  return this.statistics;
}

//==============================================================================  
// MANAGER AND SERVICE RETRIEVAL
//==============================================================================
net.user1.orbiter.Orbiter.prototype.getSystem = function () {
  return this.system;
};

net.user1.orbiter.Orbiter.prototype.getRoomManager = function () {
  return this.roomMan;
};

net.user1.orbiter.Orbiter.prototype.getConnectionManager = function () {
  return this.connectionMan;
};

net.user1.orbiter.Orbiter.prototype.getClientManager = function () {
  return this.clientMan;
};

net.user1.orbiter.Orbiter.prototype.getAccountManager = function () {
  return this.accountMan;
};

net.user1.orbiter.Orbiter.prototype.getMessageManager = function () {
  return this.messageMan;
};

net.user1.orbiter.Orbiter.prototype.getServer = function () {
  return this.server;
};

net.user1.orbiter.Orbiter.prototype.getConnectionMonitor = function () {
  return this.connectionMonitor;
};

/**
 * @private
 */
net.user1.orbiter.Orbiter.prototype.getCoreMessageListener = function () {
  return this.coreMsgListener;
}

net.user1.orbiter.Orbiter.prototype.getLog = function () {
  return this.log;
}

net.user1.orbiter.Orbiter.prototype.self = function () {
  var customGlobalClient;
  
  if (this.clientMan == null || !this.isReady()) {
    return null;
  } else {
    customGlobalClient = this.clientMan.self().getCustomClient(null);
    if (customGlobalClient != null) {
      return customGlobalClient;
    } else {
      return this.clientMan.self();
    }
  } 
};

/**
 * @private
 */    
net.user1.orbiter.Orbiter.prototype.getSnapshotManager = function () {
  return this.snapshotMan;
};

//==============================================================================
// SNAPSHOT API
//==============================================================================

net.user1.orbiter.Orbiter.prototype.updateSnapshot = function (snapshot) {
  this.snapshotMan.updateSnapshot(snapshot);
}

//==============================================================================
// CONNECTION EVENT LISTENERS
//==============================================================================

/**
 * @private 
 * Responds to a connection failure. 
 */
net.user1.orbiter.Orbiter.prototype.connectFailureListener = function (e) {
  // Tell listeners that the connection is now closed.
  this.fireClose();
};

/**
 * @private 
 * Triggers a CLOSE event when the connection is lost. 
 */
net.user1.orbiter.Orbiter.prototype.disconnectListener = function (e) {
  this.accountMan.cleanup();
  this.roomMan.cleanup();
  this.clientMan.cleanup();
  this.server.cleanup();
  this.fireClose();
};

/**
 * @private 
 * Triggers a READY event when the connection is ready. 
 */
net.user1.orbiter.Orbiter.prototype.readyListener = function (e) {
  this.fireReady();
};

net.user1.orbiter.Orbiter.prototype.selectConnectionListener = function (e) {
  this.messageMan.addMessageListener(net.user1.orbiter.UPC.SERVER_HELLO, this.u66, this);
  this.messageMan.addMessageListener(net.user1.orbiter.UPC.CONNECTION_REFUSED, this.u164, this);
}

//==============================================================================
// CLIENT ID
//==============================================================================
net.user1.orbiter.Orbiter.prototype.getClientID = function () {
  return this.self() ? this.self().getClientID() : "";
};

//==============================================================================
// EVENT DISPATCHING
//==============================================================================

/**
 * @private
 * Notifies listeners that this Orbiter object's connection to the server
 * was lost or could not be established.
 */
net.user1.orbiter.Orbiter.prototype.fireClose = function () {
  this.dispatchEvent(new net.user1.orbiter.OrbiterEvent(net.user1.orbiter.OrbiterEvent.CLOSE));
};

/**
 * @private
 * Notifies listeners that the Orbiter is fully initialized and 
 * ready to transact with the server.
 */
net.user1.orbiter.Orbiter.prototype.fireReady = function () {
  this.dispatchEvent(new net.user1.orbiter.OrbiterEvent(net.user1.orbiter.OrbiterEvent.READY));
};

/**
 * @private
 * Notifies listeners that the Orbiter is fully initialized and 
 * ready to transact with the server.
 */
net.user1.orbiter.Orbiter.prototype.fireProtocolIncompatible = function (serverUPCVersion) {
  this.dispatchEvent(new net.user1.orbiter.OrbiterEvent(net.user1.orbiter.OrbiterEvent.PROTOCOL_INCOMPATIBLE,
                                 serverUPCVersion));
};

/**
 * @private
 * Notifies listeners that the server refused the connection.
 */
net.user1.orbiter.Orbiter.prototype.dispatchConnectRefused = function (refusal) {
  this.dispatchEvent(new net.user1.orbiter.OrbiterEvent(net.user1.orbiter.OrbiterEvent.CONNECT_REFUSED,
                                 null, refusal));
};

//==============================================================================
// UPC Listeners
//==============================================================================

/**
 * @private
 * SERVER_HELLO
 */
net.user1.orbiter.Orbiter.prototype.u66 = function (serverVersion, 
                                                    sessionID,
                                                    serverUPCVersionString,
                                                    protocolCompatible,
                                                    affinityAddress,
                                                    affinityDuration) {
  var serverUPCVersion = new net.user1.orbiter.VersionNumber();
  serverUPCVersion.fromVersionString(serverUPCVersionString);
  if (protocolCompatible == "false") {
    this.fireProtocolIncompatible(serverUPCVersion);
  }
};

/**
 * @private
 * CONNECTION_REFUSED
 */
net.user1.orbiter.Orbiter.prototype.u164 = function (reason, description) {
  this.connectionMonitor.setAutoReconnectFrequency(-1);
  this.dispatchConnectRefused(new net.user1.orbiter.ConnectionRefusal(reason, description));
};

//==============================================================================
// SESSION ID
//==============================================================================
    
net.user1.orbiter.Orbiter.prototype.getSessionID = function () {
  return this.sessionID == null ? "" : this.sessionID;
};
    
/**
 * @private
 */        
net.user1.orbiter.Orbiter.prototype.setSessionID = function (id) {
  this.sessionID = id;
};

//==============================================================================    
// CONSOLE LOGGING
//==============================================================================
net.user1.orbiter.Orbiter.prototype.enableConsole = function () {
  if (this.consoleLogger == null) {
    this.consoleLogger = new net.user1.logger.ConsoleLogger(this.log);
  }
};

net.user1.orbiter.Orbiter.prototype.disableConsole = function () {
  if (this.consoleLogger != null) {
    this.consoleLogger.dispose();
    this.consoleLogger = null;
  }
};

//==============================================================================
// CLEANUP
//==============================================================================

/**
 * Permanently disables this object and releases all of its
 * resources. Once dispose() is called, the object can never
 * be used again. Use dispose() only when purging an object
 * from memory, as is required when unloading an iframe. 
 * 
 * To simply disconnect an Orbiter object, use disconnect().
 */
net.user1.orbiter.Orbiter.prototype.dispose = function () {
  this.log.info("[ORBITER] Beginning disposal of all resources...");
  this.connectionMan.dispose();
  this.roomMan.dispose();
  this.connectionMonitor.dispose();
  this.clientMan.dispose();
  this.messageMan.dispose();
  if (this.statistics != null) {
    this.statistics.stop();
  }
  this.log.info("[ORBITER] Disposal complete.");
}
//==============================================================================
// CONNECTION STATE CONSTANTS
//==============================================================================
/** @class */
net.user1.orbiter.ConnectionState = new Object();
/** @constant */
net.user1.orbiter.ConnectionState.UNKNOWN                    = -1;
/** @constant */
net.user1.orbiter.ConnectionState.NOT_CONNECTED              = 0;
/** @constant */
net.user1.orbiter.ConnectionState.READY                      = 1;
/** @constant */
net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS     = 2;
/** @constant */
net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS  = 3;
/** @constant */
net.user1.orbiter.ConnectionState.LOGGED_IN                  = 4;
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
    @extends net.user1.events.Event
*/
net.user1.orbiter.ConnectionEvent = function (type, upc, data, connection, status) {
  net.user1.events.Event.call(this, type);
  
  this.upc = upc;
  this.data = data;
  this.connection = connection
  this.status = status;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.ConnectionEvent, net.user1.events.Event);

//==============================================================================
// STATIC VARIABLES
//==============================================================================

/** @constant */
net.user1.orbiter.ConnectionEvent.BEGIN_CONNECT = "BEGIN_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionEvent.BEGIN_HANDSHAKE = "BEGIN_HANDSHAKE";
/** @constant */
net.user1.orbiter.ConnectionEvent.READY = "READY";
/** @constant */
net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE = "CONNECT_FAILURE";
/** @constant */
net.user1.orbiter.ConnectionEvent.CLIENT_KILL_CONNECT = "CLIENT_KILL_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionEvent.SERVER_KILL_CONNECT = "SERVER_KILL_CONNECT";
/** @constant */
net.user1.orbiter.ConnectionEvent.DISCONNECT = "DISCONNECT";
/** @constant */
net.user1.orbiter.ConnectionEvent.RECEIVE_UPC = "RECEIVE_UPC";
/** @constant */
net.user1.orbiter.ConnectionEvent.SEND_DATA = "SEND_DATA";
/** @constant */
net.user1.orbiter.ConnectionEvent.RECEIVE_DATA = "RECEIVE_DATA";
/** @constant */
net.user1.orbiter.ConnectionEvent.SESSION_TERMINATED = "SESSION_TERMINATED";
/** @constant */
net.user1.orbiter.ConnectionEvent.SESSION_NOT_FOUND = "SESSION_NOT_FOUND";
  
//==============================================================================
// INSTANCE METHODS
//==============================================================================

net.user1.orbiter.ConnectionEvent.prototype.getUPC = function () {
  return this.upc;
}

net.user1.orbiter.ConnectionEvent.prototype.getData = function () {
  return this.data;
}

net.user1.orbiter.ConnectionEvent.prototype.getStatus = function () {
  return this.status;
}

net.user1.orbiter.ConnectionEvent.prototype.toString = function () {
  return "[object ConnectionEvent]";
}  

//==============================================================================
// HTTP REQUEST MODE CONSTANTS
//==============================================================================
/** @class */
net.user1.orbiter.ConnectionType = new Object();
/** @constant */
net.user1.orbiter.ConnectionType.HTTP =  "HTTP";
/** @constant */
net.user1.orbiter.ConnectionType.SECURE_HTTP =  "SECURE_HTTP";
/** @constant */
net.user1.orbiter.ConnectionType.WEBSOCKET =  "WEBSOCKET";
/** @constant */
net.user1.orbiter.ConnectionType.SECURE_WEBSOCKET =  "SECURE_WEBSOCKET";
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class
 * Connection is the abstract superclass of HTTPConnection and WebSocketConnection;
 * it is used internally by Orbiter, and is not intended for direct use by Orbiter
 * developers. For information on communication with Union Server, see
 * Orbiter's connect() method, the WebSocketConnection class and the
 * HTTPDirectConnection and HTTPIFrameConnection classes.
 *
 * The Connection class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.BEGIN_CONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.BEGIN_HANDSHAKE}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.READY}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.CLIENT_KILL_CONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.SERVER_KILL_CONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.DISCONNECT}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.RECEIVE_UPC}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.SEND_DATA}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.RECEIVE_DATA}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.SESSION_TERMINATED}</li>
<li class="fixedFont">{@link net.user1.orbiter.ConnectionEvent.SESSION_NOT_FOUND}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher

 *
 * @see net.user1.orbiter.Orbiter#connect
 * @see net.user1.orbiter.Orbiter#secureConnect
 * @see net.user1.orbiter.HTTPDirectConnection
 * @see net.user1.orbiter.HTTPIFrameConnection
 * @see net.user1.orbiter.WebSocketConnection
 * @see net.user1.orbiter.SecureHTTPDirectConnection
 * @see net.user1.orbiter.SecureHTTPIFrameConnection
 * @see net.user1.orbiter.SecureWebSocketConnection
 */
net.user1.orbiter.Connection = function (host, port, type) {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);

  // Variables
  this.mostRecentConnectAchievedReady = false;
  this.mostRecentConnectTimedOut = false;
  this.readyCount = 0;
  this.connectAttemptCount = 0;
  this.connectAbortCount = 0;
  this.readyTimeoutID = 0;
  this.readyTimeout = 0;
  this.orbiter = null;
  this.disposed = false;
  this.requestedHost = null;
  
  // Initialization
  this.setServer(host, port);
  this.connectionType = type;
  this.connectionState = net.user1.orbiter.ConnectionState.NOT_CONNECTED;
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.Connection, net.user1.events.EventDispatcher);

//==============================================================================    
// DEPENDENCIES
//============================================================================== 
/** @private */
net.user1.orbiter.Connection.prototype.setOrbiter = function (orbiter) {
  if (this.orbiter != null) {
    this.orbiter.getMessageManager().removeMessageListener("u63", this.u63);
    this.orbiter.getMessageManager().removeMessageListener("u66", this.u66);
    this.orbiter.getMessageManager().removeMessageListener("u84", this.u84);
    this.orbiter.getMessageManager().removeMessageListener("u85", this.u85);
  }
  this.orbiter = orbiter;
}
  
//==============================================================================    
// CONNECT/DISCONNECT
//============================================================================== 
net.user1.orbiter.Connection.prototype.connect = function () {
  this.disconnect();
  this.applyAffinity();
  this.orbiter.getLog().info(this.toString() + " Attempting connection...");
  this.connectAttemptCount++;
  this.mostRecentConnectAchievedReady = false;
  this.mostRecentConnectTimedOut = false;
  this.connectionState = net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS;
  // Start the ready timer. Ready state must be achieved before the timer
  // completes or the connection will auto-disconnect.
  this.startReadyTimer();
  this.dispatchBeginConnect();
}
  
net.user1.orbiter.Connection.prototype.disconnect = function () {
  var state = this.connectionState;
 
  if (state != net.user1.orbiter.ConnectionState.NOT_CONNECTED) {
    this.deactivateConnection();
 
    if (state == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
      this.connectAbortCount++;
      this.dispatchConnectFailure("Client closed connection before READY state was achieved.");
    } else {
      this.dispatchClientKillConnect();
    }
  }
}
    
/** @private */
net.user1.orbiter.Connection.prototype.deactivateConnection = function () {
  this.connectionState = net.user1.orbiter.ConnectionState.NOT_CONNECTED;
  this.stopReadyTimer();
  this.orbiter.setSessionID("");
}
  
//==============================================================================    
// CONNECTION CONFIGURATION
//==============================================================================    
net.user1.orbiter.Connection.prototype.setServer = function (host,
                                                             port) {
  this.requestedHost = host;
      
  // Check for valid ports
  if (port < 1 || port > 65536) {
    throw new Error("Illegal port specified [" + port + "]. Must be greater than 0 and less than 65537.");
  }
  this.port  = port;
}

net.user1.orbiter.Connection.prototype.getRequestedHost = function () {
  return this.requestedHost;
};

net.user1.orbiter.Connection.prototype.getHost = function () {
  if (this.host == null) {
    return this.getRequestedHost();
  } else {
    return this.host;
  }
};

net.user1.orbiter.Connection.prototype.getPort = function () {
  return this.port;
};

net.user1.orbiter.Connection.prototype.getType = function () {
  return this.connectionType;
};
    
//==============================================================================
// READY HANDSHAKE
//==============================================================================
/** @private */
net.user1.orbiter.Connection.prototype.beginReadyHandshake = function () {
  this.dispatchBeginHandshake();
  
  if (!this.orbiter.getMessageManager().hasMessageListener("u63", this.u63)) {
    this.orbiter.getMessageManager().addMessageListener("u63", this.u63, this);
    this.orbiter.getMessageManager().addMessageListener("u66", this.u66, this);
    this.orbiter.getMessageManager().addMessageListener("u84", this.u84, this);
    this.orbiter.getMessageManager().addMessageListener("u85", this.u85, this);
  }
  
  this.sendHello();
}

/** @private */
net.user1.orbiter.Connection.prototype.sendHello = function() {
  var helloString = this.buildHelloMessage();
  this.orbiter.getLog().debug(this.toString() + " Sending CLIENT_HELLO: " + helloString);
  this.transmitHelloMessage(helloString);
}

/** @private */
net.user1.orbiter.Connection.prototype.buildHelloMessage = function () {
  var helloString = "<U><M>u65</M>"
    + "<L>"
    + "<A>" + this.orbiter.getSystem().getClientType() + "</A>"
    + "<A>" + (typeof navigator != "undefined" ? navigator.userAgent + ";" : "") 
    + this.orbiter.getSystem().getClientVersion().toStringVerbose() + "</A>"
    + "<A>" + this.orbiter.getSystem().getUPCVersion().toString() + "</A></L></U>";
  return helloString;
}

/** @private */
net.user1.orbiter.Connection.prototype.transmitHelloMessage = function (helloString) {
  this.send(helloString);
}
    
//==============================================================================
// READY TIMER
//==============================================================================
/** @private */
net.user1.orbiter.Connection.prototype.readyTimerListener = function () {
  this.stopReadyTimer();
  if (this.connectionState == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.orbiter.getLog().warn("[CONNECTION] " + this.toString() + " Failed to achieve" + 
            " ready state after " + this.readyTimeout + "ms. Aborting connection...");
    this.mostRecentConnectTimedOut = true;
    this.disconnect();
  }
}

/** @private */
net.user1.orbiter.Connection.prototype.stopReadyTimer = function () {
  if (this.readyTimeoutID != -1) {
    clearTimeout(this.readyTimeoutID);
  }
}

/** @private */
net.user1.orbiter.Connection.prototype.startReadyTimer = function () {
  var currentObj = this;
  var callback   = this.readyTimerListener;
  this.stopReadyTimer();
  this.readyTimeout = this.orbiter.getConnectionManager().getReadyTimeout();
  var self = this;
  this.readyTimeoutID = setTimeout (function () {
    callback.call(currentObj);
  }, self.readyTimeout);
}

//==============================================================================
// READY STATE ACCESS
//==============================================================================
/** @private */
net.user1.orbiter.Connection.prototype.getReadyCount = function () {
  return this.readyCount;
}
    
net.user1.orbiter.Connection.prototype.isReady = function () {
  return this.connectionState == net.user1.orbiter.ConnectionState.READY;
}

/** @private */
net.user1.orbiter.Connection.prototype.isValid = function () {
  if (this.mostRecentConnectAchievedReady) {
    this.orbiter.getLog().debug(this.toString() + " Connection is"
      + " valid because its last connection attempt succeeded.");
    return true;
  }
  
  if (this.connectAttemptCount == 0) {
    this.orbiter.getLog().debug(this.toString() + " Connection is"
      + " valid because it has either never attempted to connect, or has not"
      + " attempted to connect since its last successful connection.");
    return true;
  }
  
  if ((this.connectAttemptCount > 0) && 
      (this.connectAttemptCount == this.connectAbortCount)
      && !this.mostRecentConnectTimedOut) {
    this.orbiter.getLog().debug(this.toString() + " Connection is"
      + " valid because either all connection attempts ever or all"
      + " connection attempts since its last successful connection were"
      + " aborted before the ready timeout was reached.");
    return true;
  }
  
  this.orbiter.getLog().debug(this.toString() + " Connection is not"
    + " valid; its most recent connection failed to achieve a ready state.");
  return false;
}

    
//==============================================================================
// UPC LISTENERS
//==============================================================================
/** @private */
net.user1.orbiter.Connection.prototype.u63 = function () {
  this.stopReadyTimer();
  this.connectionState = net.user1.orbiter.ConnectionState.READY;
  this.mostRecentConnectAchievedReady = true;
  this.readyCount++;
  this.connectAttemptCount = 0;
  this.connectAbortCount   = 0;
  this.dispatchReady();
}    

/** @private */
net.user1.orbiter.Connection.prototype.u66 = function (serverVersion, 
                                                       sessionID, 
                                                       upcVersion, 
                                                       protocolCompatible,
                                                       affinityAddress,
                                                       affinityDuration) {
  this.orbiter.setSessionID(sessionID);
};

/** @private */
net.user1.orbiter.Connection.prototype.u84 = function () {
  this.dispatchSessionTerminated();
}    

/** @private */
net.user1.orbiter.Connection.prototype.u85 = function () {
  this.dispatchSessionNotFound();
}    

//==============================================================================    
// SERVER AFFINITY
//==============================================================================
/** @private */
net.user1.orbiter.Connection.prototype.applyAffinity = function () {
  var affinityAddress = this.orbiter.getConnectionManager().getAffinity(this.requestedHost);
  if (affinityAddress == this.requestedHost) {
    this.orbiter.getLog().info(this.toString() + " No affinity address found for requested host [" 
                               + this.requestedHost + "]. Using requested host for next connection attempt.");
  } else {
    this.orbiter.getLog().info(this.toString() + " Applying affinity address [" + affinityAddress + "] for supplied host [" + this.requestedHost + "].");
  }
  this.host = affinityAddress;
}

//==============================================================================    
// TOSTRING
//==============================================================================     
net.user1.orbiter.Connection.prototype.toString = function () {
  var s = "[" + this.connectionType + ", requested host: " + this.requestedHost 
          + ", host: " + (this.host == null ? "" : this.host) 
          + ", port: " + this.port + "]";
  return s;
}
    
//==============================================================================    
// EVENT DISPATCHING
//==============================================================================  
/** @private */
net.user1.orbiter.Connection.prototype.dispatchSendData = function (data) {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.SEND_DATA,
                                    null, data, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchReceiveData = function (data) {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.RECEIVE_DATA,
                                    null, data, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchConnectFailure = function (status) {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE,
                                    null, null, this, status));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchBeginConnect = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.BEGIN_CONNECT,
                                    null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchBeginHandshake = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.BEGIN_HANDSHAKE,
                                    null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchReady = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.READY,
                                    null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchServerKillConnect  = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.SERVER_KILL_CONNECT,
                                    null, null, this));
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.DISCONNECT,
                                    null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchClientKillConnect = function () {
    this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.CLIENT_KILL_CONNECT,
                                      null, null, this));
    this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.DISCONNECT,
                                      null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchSessionTerminated = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.SESSION_TERMINATED,
                                    null, null, this));
}

/** @private */
net.user1.orbiter.Connection.prototype.dispatchSessionNotFound = function () {
  this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.SESSION_NOT_FOUND,
                                    null, null, this));
}

//==============================================================================    
// DISPOSAL
//==============================================================================  
/** @private */
net.user1.orbiter.Connection.prototype.dispose = function () {
  this.disposed = true;
  this.messageManager.removeMessageListener("u63", this.u63);
  this.messageManager.removeMessageListener("u66", this.u66);
  this.messageManager.removeMessageListener("u84", this.u84);
  this.messageManager.removeMessageListener("u85", this.u85);
  this.stopReadyTimer();
  this.readyTimer = null;
  this.orbiter = null;
}
//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 *
 * <p>
 * The WebSocketConnection class is used by Orbiter to communicate with
 * Union Server over a persistent TCP/IP socket. Normally, developers need not
 * use the WebSocketConnection class directly, and should instead make connections
 * via the Orbiter class's connect() method. However, the
 * WebSocketConnection class is required for fine-grained connection configuration,
 * such as defining failover socket connections for multiple Union Servers
 * running at different host addresses.
 * </p>
 *
 * <p>
 * By default, Orbiter uses WebSocketConnection connections to communicate
 * with Union Server. WebSocketConnection connections offer faster response times than
 * HTTP connections, but occupy an operating-system-level socket continuously
 * for the duration of the connection. If a WebSocketConnection connection
 * cannot be established (due to, say, a restrictive firewall), Orbiter
 * automatically attempts to communicate using HTTP requests sent via an
 * HTTPDirectConnection or HTTPIFrameConnection. Developers can override
 * Orbiter's default connection failover system by manually configuring
 * connections using the ConnectionManager class and Orbiter's
 * disableHTTPFailover() method.</p>
 *
 * <p>
 * For secure WebSocket and HTTP communications, see SecureWebSocketConnection,
 * SecureHTTPDirectConnection, and SecureHTTPIFrameConnection.
 * </p>
 *
 * For a list of events dispatched by WebSocketConnection, see
 * WebSocketConnection's superclass, {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.Connection
 *
 * @see net.user1.orbiter.Orbiter#connect
 * @see net.user1.orbiter.Orbiter#secureConnect
 * @see net.user1.orbiter.SecureWebSocketConnection
 * @see net.user1.orbiter.SecureHTTPDirectConnection
 * @see net.user1.orbiter.SecureHTTPIFrameConnection
 */
net.user1.orbiter.WebSocketConnection = function (host, port, type) {
  // Invoke superclass constructor
  net.user1.orbiter.Connection.call(this, host, port, type || net.user1.orbiter.ConnectionType.WEBSOCKET);
  
  this.socket = null;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.WebSocketConnection, net.user1.orbiter.Connection);
    
//==============================================================================    
// SOCKET OBJECT MANAGEMENT
//==============================================================================
/** @private */     
net.user1.orbiter.WebSocketConnection.prototype.getNewSocket = function () {
  // Deactivate the old socket
  this.deactivateSocket(this.socket);
  
  // Create the new socket
  if (typeof MozWebSocket != "undefined") {
    // Firefox 6
    this.socket = new MozWebSocket(this.buildURL());
  } else {
    // Other browsers
    this.socket = new WebSocket(this.buildURL());
  }

  // Register for socket events
  var self = this;
  this.socket.onopen = function (e) {self.connectListener(e)};
  this.socket.onmessage = function (e) {self.dataListener(e)};
  this.socket.onclose = function (e) {self.closeListener(e)};
  this.socket.onerror = function (e) {self.ioErrorListener(e)};
};

/** @private */
net.user1.orbiter.WebSocketConnection.prototype.buildURL = function () {
  return "ws://" + this.host + ":" + this.port;
};

/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.deactivateSocket = function (oldSocket) {
  if (oldSocket == null) {
    return;
  }
  
  this.socket.onopen = null;
  this.socket.onmessage = null;
  this.socket.onclose = null;
  this.socket.onerror = null;
  
  try {
    oldSocket.close()
  } catch (e) {
    // Do nothing
  }
  
  this.socket = null;
};
    
//==============================================================================    
// CONNECTION AND DISCONNECTION
//==============================================================================    
  
net.user1.orbiter.WebSocketConnection.prototype.connect = function () {
  net.user1.orbiter.Connection.prototype.connect.call(this);
      
  // Attempt to connect
  try {
    this.getNewSocket();
  } catch (e) {
    // Socket could not be opened
    this.deactivateConnection();
    this.dispatchConnectFailure(e.toString());
  }
};

/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.deactivateConnection = function () {
  this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Deactivating...");
  this.connectionState = net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS;
  this.deactivateSocket(this.socket);
  net.user1.orbiter.Connection.prototype.deactivateConnection.call(this);
};    

//==============================================================================    
// SOCKET CONNECTION LISTENERS
//==============================================================================
/** @private */     
net.user1.orbiter.WebSocketConnection.prototype.connectListener = function (e) {
  if (this.disposed) return;
  
  this.orbiter.getLog().debug(this.toString() + " Socket connected.");
  this.beginReadyHandshake();
}
  
/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.closeListener = function (e) {
  if (this.disposed) return;
  
  var state = this.connectionState;
  this.deactivateConnection();
  
  if (state == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.dispatchConnectFailure("WebSocket onclose: Server closed connection before READY state was achieved.");
  } else {
    this.dispatchServerKillConnect();
  }
};

/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.ioErrorListener = function (e) {
  if (this.disposed) return;
  
  var state = this.connectionState;
  this.deactivateConnection();
  
  // Note: when Union closes the connection, Firefox 7 dispatches onerror, not 
  // onclose, so treat onerror like an onclose event
  if (state == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.dispatchConnectFailure("WebSocket onerror: Server closed connection before READY state was achieved.");
  } else {
    this.dispatchServerKillConnect();
  }
};

//==============================================================================    
// DATA RECEIVING AND SENDING
//==============================================================================  
/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.dataListener = function (dataEvent) {
  if (this.disposed) return;

  var data = dataEvent.data;
  this.dispatchReceiveData(data);

  if (data.indexOf("<U>") == 0) {
    this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(
                                      net.user1.orbiter.ConnectionEvent.RECEIVE_UPC, 
                                      data));
  } else {
    // The message isn't UPC. Must be an error...
    this.orbiter.getLog().error(this.toString() + " Received invalid message" 
                               + " (not UPC or malformed UPC): " + data);
  }
};

/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.send = function (data) {
  this.dispatchSendData(data);
  this.socket.send(data);
};
    
// =============================================================================
// DISPOSAL
// =============================================================================
/** @private */ 
net.user1.orbiter.WebSocketConnection.prototype.dispose = function () {
  net.user1.orbiter.Connection.prototype.dispose.call(this);
  this.deactivateSocket(this.socket);
};
//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/** @class
 *
 * <p>
 * The SecureWebSocketConnection class is identical to WebSocketConnection
 * except that it performs communications over WSS (i.e., an encrypted TLS or
 * SSL socket connection) rather than plain WebSocket.</p>
 *
 * For a list of events dispatched by SecureWebSocketConnection, see
 * {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.WebSocketConnection
 *
 * @see net.user1.orbiter.WebSocketConnection
 */
net.user1.orbiter.SecureWebSocketConnection = function (host, port) {
  // Invoke superclass constructor
  net.user1.orbiter.WebSocketConnection.call(this, host, port, net.user1.orbiter.ConnectionType.SECURE_WEBSOCKET);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.SecureWebSocketConnection, net.user1.orbiter.WebSocketConnection);
    
/** @private */
net.user1.orbiter.SecureWebSocketConnection.prototype.buildURL = function () {
  return "wss://" + this.host + ":" + this.port;
};
//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 *
 * HTTPConnection is the abstract superclass of HTTPDirectConnection and
 * HTTPIFrameConnection; it is used internally by Orbiter, and is not intended
 * for direct use by Orbiter developers. For information on HTTP communication
 * with Union Server, see the HTTPDirectConnection and HTTPIFrameConnection classes.
 *
 * For a list of events dispatched by HTTPConnection, see HTTPConnection's
 * superclass, {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.Connection
 *
 *
 * @see net.user1.orbiter.HTTPDirectConnection
 * @see net.user1.orbiter.HTTPIFrameConnection
 */
net.user1.orbiter.HTTPConnection = function (host, port, type) {
  // Invoke superclass constructor
  net.user1.orbiter.Connection.call(this, host, port, type || net.user1.orbiter.ConnectionType.HTTP);

  // Instance variables
  this.url = "";
  this.sendDelayTimerEnabled = true;
  this.sendDelayTimeoutID = -1;
  this.sendDelayTimerRunning = false;
  this.sendDelay = net.user1.orbiter.HTTPConnection.DEFAULT_SEND_DELAY;
  
  this.messageQueue = new Array();
  
  this.retryDelay = 500;
  this.retryHelloTimeoutID = -1;
  this.retryIncomingTimeoutID = -1;
  this.retryOutgoingTimeoutID = -1;

  this.helloResponsePending = false;
  this.outgoingResponsePending = false;
  
  // Initialization
  this.addEventListener(net.user1.orbiter.ConnectionEvent.SESSION_TERMINATED, this.sessionTerminatedListener, this);
  this.addEventListener(net.user1.orbiter.ConnectionEvent.SESSION_NOT_FOUND, this.sessionNotFoundListener, this);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.HTTPConnection, net.user1.orbiter.Connection);

//==============================================================================    
// STATIC VARIABLES
//==============================================================================    
/** @constant */
net.user1.orbiter.HTTPConnection.DEFAULT_SEND_DELAY = 300;
    
//==============================================================================    
// ABSTRACT METHODS (MUST BE IMPLEMENTED BY SUBCLASSES)
//==============================================================================    
    
net.user1.orbiter.HTTPConnection.prototype.doRequestDeactivation = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doSendHello = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doRetryHello = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doSendOutgoing = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doRetryOutgoing = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doSendIncoming = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doRetryIncoming = net.user1.utils.abstractError;
net.user1.orbiter.HTTPConnection.prototype.doDispose = net.user1.utils.abstractError;
    
//==============================================================================    
// CONNECTION AND DISCONNECTION
//==============================================================================    
net.user1.orbiter.HTTPConnection.prototype.connect = function () {
  net.user1.orbiter.Connection.prototype.connect.call(this);
};
    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.deactivateConnection = function () {
  this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Deactivating...");
  this.connectionState = net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS;
  this.stopSendDelayTimer();
  if (this.retryHelloTimeoutID != -1) {
    this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Cancelling scheduled hello-request retry.");
    clearTimeout(this.retryHelloTimeoutID);
    this.retryHelloTimeoutID = -1
  }
  if (this.retryIncomingTimeoutID != -1) {
    this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Cancelling scheduled incoming-request retry.");
    clearTimeout(this.retryIncomingTimeoutID);
    this.retryIncomingTimeoutID = -1
  }
  if (this.retryOutgoingTimeoutID != -1) {
    this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Cancelling scheduled outgoing-request retry.");
    clearTimeout(this.retryOutgoingTimeoutID);
    this.retryOutgoingTimeoutID = -1
  }
  this.deactivateHTTPRequests();
  net.user1.orbiter.Connection.prototype.deactivateConnection.call(this);
};
    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.deactivateHTTPRequests = function () {
  this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Closing all pending HTTP requests.");
  this.doRequestDeactivation();
  this.helloResponsePending = false;
  this.outgoingResponsePending = false;
};

//==============================================================================    
// SESSION MANAGEMENT
//==============================================================================     

/** @private */
net.user1.orbiter.HTTPConnection.prototype.sessionTerminatedListener = function (e) {
  var state = this.connectionState;
  this.deactivateConnection();
  
  if (state == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.dispatchConnectFailure("Server terminated session before READY state was achieved.");
  } else {
    this.dispatchServerKillConnect();
  }
};

/** @private */
net.user1.orbiter.HTTPConnection.prototype.sessionNotFoundListener = function (e) {
  var state = this.connectionState;
  
  this.deactivateConnection();
  
  if (state == net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.dispatchConnectFailure("Client attempted to reestablish an expired session"
                                + " or establish an unknown session.");
  } else {
    this.dispatchServerKillConnect();
  }
}

    
//==============================================================================    
// SERVER ASSIGNMENT
//==============================================================================    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.setServer = function (host, port) {
  try {
    net.user1.orbiter.Connection.prototype.setServer.call(this, host, port);
  } finally {
    this.buildURL();
  }
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.buildURL = function () {
  this.url = "http://" + this.host + ":" + this.port;
}

//==============================================================================    
// OUTGOING DELAY TIMER
//==============================================================================    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.sendDelayTimerListener = function () {
  this.sendDelayTimerRunning = false;
  if (this.messageQueue.length > 0) {
    this.flushMessageQueue();
  } else {
    // No messages in queue, so take no action.
  }
}
    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.stopSendDelayTimer = function () {
  this.sendDelayTimerRunning = false;
  if (this.sendDelayTimeoutID != -1) {
    clearTimeout(this.sendDelayTimeoutID);
  }
  this.sendDelayTimeoutID = -1;
}
    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.startSendDelayTimer = function () {
  this.stopSendDelayTimer();
  var currentObj = this;
  var callback   = this.sendDelayTimerListener;
  this.sendDelayTimerRunning = true;
  this.sendDelayTimeoutID = setTimeout(function () {
    callback.call(currentObj);
  }, this.sendDelay);
}
    
net.user1.orbiter.HTTPConnection.prototype.setSendDelay = function (milliseconds) {
  if (milliseconds > 0) {
    if ((milliseconds != this.sendDelay)) {
      this.sendDelay = milliseconds;
      this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Send delay set to: ["
                             + milliseconds + "]."); 
    }
    this.sendDelayTimerEnabled = true;
  } else if (milliseconds == -1) {
    this.orbiter.getLog().debug("[CONNECTION] " + toString() + " Send delay disabled.");
    this.sendDelayTimerEnabled = false;
    this.stopSendDelayTimer();
  } else {
    throw new Error("[CONNECTION]" + this.toString() + " Invalid send-delay specified: [" 
                    + milliseconds + "]."); 
  }
}
    
net.user1.orbiter.HTTPConnection.prototype.getSendDelay = function () {
  return this.sendDelay;
}

//==============================================================================    
// RETRY DELAY
//============================================================================== 
net.user1.orbiter.HTTPConnection.prototype.setRetryDelay = function (milliseconds) {
  if (milliseconds > -1) {
    if (milliseconds != this.retryDelay) {
      this.retryDelay = milliseconds;
      this.orbiter.getLog().debug("[CONNECTION] " + this.toString() + " Retry delay set to: ["
                                  + milliseconds + "]."); 
    }
  } else {
    throw new Error("[CONNECTION]" + this.toString() + " Invalid retry delay specified: [" 
                    + milliseconds + "]."); 
  }
}

//==============================================================================    
// DATA SENDING AND QUEUING
//==============================================================================  
    
net.user1.orbiter.HTTPConnection.prototype.send = function (data) {
  // If the timer isn't running...
  if (!this.sendDelayTimerRunning) {
    // ...it is either disabled or expired. Either way, it's time to 
    // attempt to flush the queue.
    this.messageQueue.push(data);
    this.flushMessageQueue();
  } else {
    // The send-delay timer is running, so we can't send yet. Just queue the message.
    this.messageQueue.push(data);
  }
}
    
/** @private */
net.user1.orbiter.HTTPConnection.prototype.flushMessageQueue = function () {
  if (!this.outgoingResponsePending) {
    this.openNewOutgoingRequest(this.messageQueue.join(""));
    this.messageQueue = new Array();
  } else {
    // AN OUTGOING RESPONSE IS STILL PENDING, SO DON'T SEND A NEW ONE
  }
}

//==============================================================================    
// HELLO REQUEST MANAGEMENT
//==============================================================================  

/** @private */
net.user1.orbiter.HTTPConnection.prototype.transmitHelloMessage = function (helloString) {
  this.dispatchSendData(helloString);
  this.helloResponsePending = true;
  this.doSendHello(helloString);
}    

/** @private */
net.user1.orbiter.HTTPConnection.prototype.helloCompleteListener = function (data) {
  if (this.disposed) return;
  
  if (this.helloResponsePending) {
    this.helloResponsePending = false;
    this.processIncomingData(data);
    
    // Don't immediately open a request in the complete handler due to Win IE bug
    var self = this;
    setTimeout(function () {
      self.openNewIncomingRequest();
    }, 0);
  } else {
    if (this.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED) {
      this.orbiter.getLog().error("[CONNECTION]" + toString() + " u66 (SERVER_HELLO) received, but client is not connected. Ignoring.");
    } else {
      this.orbiter.getLog().error("[CONNECTION]" + toString() + " Redundant u66 (SERVER_HELLO) received. Ignoring.");
    }
  }
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.helloErrorListener = function () {
  if (this.disposed) return;
  // There's already a retry scheduled
  if (this.retryHelloTimeoutID != -1) return;  
  // The connection attempt has been aborted
  if (this.connectionState != net.user1.orbiter.ConnectionState.CONNECTION_IN_PROGRESS) {
    this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " u65 (CLIENT_HELLO) request failed."
                                + " Connection is no longer in progress, so no retry scheduled."); 
    return;
  }
  
  this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " u65 (CLIENT_HELLO) request failed."
                              + " Retrying in " +  this.retryDelay + "ms."); 
  
  // Retry
  var self = this;
  this.retryHelloTimeoutID = setTimeout(function () {
    self.retryHelloTimeoutID = -1;
    self.doRetryHello();
  }, this.retryDelay);
}

//==============================================================================    
// OUTGOING REQUEST MANAGEMENT
//==============================================================================

/** @private */
net.user1.orbiter.HTTPConnection.prototype.openNewOutgoingRequest = function (data) {
  this.dispatchSendData(data);
  this.outgoingResponsePending = true;
  this.doSendOutgoing(data);
  if (this.sendDelayTimerEnabled == true) {
    this.startSendDelayTimer();
  }
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.outgoingCompleteListener = function () {
  if (this.disposed) return;
  
  this.outgoingResponsePending = false;
  
  if (!this.sendDelayTimerRunning && this.messageQueue.length > 0) {
    // Don't immediately open a request in the complete handler due to Win IE bug
    var self = this;
    setTimeout(function () {
      self.flushMessageQueue();
    }, 0);
  }
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.outgoingErrorListener = function () {
  if (this.disposed) return;
  // There's already a retry scheduled
  if (this.retryOutgoingTimeoutID != -1) return;  
  // The connection has been closed
  if (this.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
      || this.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
    this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " Outgoing request failed."
                                + " Connection is closed, so no retry scheduled."); 
    return;
  } 
  
  this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " Outgoing request failed."
                              + " Retrying in " +  this.retryDelay + "ms.");  
      
  // Retry
  var self = this;
  this.retryOutgoingTimeoutID = setTimeout(function () {
    self.retryOutgoingTimeoutID = -1;
    if (self.disposed
        || self.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
        || self.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
      return;
    }
    self.doRetryOutgoing();
  }, this.retryDelay);
}

//==============================================================================    
// INCOMING REQUEST MANAGEMENT
//==============================================================================  

/** @private */
net.user1.orbiter.HTTPConnection.prototype.openNewIncomingRequest = function () {
  this.doSendIncoming();
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.incomingCompleteListener = function (data) {
  if (this.disposed
      || this.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
      || this.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
    // Incoming request complete, but connection is closed. Ignore content.
    return;
  }
  
  // Don't immediately open a request in the complete handler due to Win IE bug
  var self = this;
  setTimeout(function () {
    self.processIncomingData(data);
    // A message listener might have closed this connection in response to an incoming
    // message. Do not open a new incoming request unless the connection is still open.
    if (self.disposed
        || self.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
        || self.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
      return;
    }
    self.openNewIncomingRequest();
  }, 0);
}

/** @private */
net.user1.orbiter.HTTPConnection.prototype.incomingErrorListener = function () {
  if (this.disposed) return;
  // There's already a retry scheduled
  if (this.retryIncomingTimeoutID != -1) return;  
  // The connection has been closed
  if (this.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
      || this.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
    this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " Incoming request failed."
                                + " Connection is closed, so no retry scheduled."); 
    return;
  } 

  this.orbiter.getLog().error("[CONNECTION]" + this.toString() + " Incoming request failed." 
                              + " Retrying in " +  this.retryDelay + "ms."); 
      
  // Retry
  var self = this;
  this.retryIncomingTimeoutID = setTimeout(function () {
    self.retryIncomingTimeoutID = -1;
    if (self.disposed
        || self.connectionState == net.user1.orbiter.ConnectionState.NOT_CONNECTED
        || self.connectionState == net.user1.orbiter.ConnectionState.DISCONNECTION_IN_PROGRESS) {
      return;
    }
    self.doRetryIncoming();
  }, this.retryDelay);
}
    
//==============================================================================    
// PROCESS DATA FROM THE SERVER
//==============================================================================
 
/** @private */
net.user1.orbiter.HTTPConnection.prototype.processIncomingData = function (data) {
  if (this.disposed) return;
  var listeners;
  
  this.dispatchReceiveData(data);
  
  var upcs = new Array();
  var upcEndTagIndex = data.indexOf("</U>");
  // Empty responses are valid.
  if (upcEndTagIndex == -1 && data.length > 0) {
    this.orbiter.getLog().error("Invalid message received. No UPC found: [" + data + "]");
    if (!this.isReady()) {
      // If invalid XML is received prior to achieving ready, then this
      // probably isn't a Union server, so disconnect.
      this.disconnect();
      return;
    }
  }
  
  while (upcEndTagIndex != -1) {
    upcs.push(data.substring(0, upcEndTagIndex+4));
    data = data.substring(upcEndTagIndex+4);
    upcEndTagIndex = data.indexOf("</U>");
  }
  for (var i = 0; i < upcs.length; i++) {
    this.dispatchEvent(new net.user1.orbiter.ConnectionEvent(net.user1.orbiter.ConnectionEvent.RECEIVE_UPC, upcs[i]));
  }
}

//==============================================================================    
// SERVER AFFINITY
//==============================================================================
/** @private */ 
net.user1.orbiter.HTTPConnection.prototype.applyAffinity = function (data) {
  net.user1.orbiter.Connection.prototype.applyAffinity.call(this);
  this.buildURL();
};

//==============================================================================    
// TOSTRING
//==============================================================================     
net.user1.orbiter.HTTPConnection.prototype.toString = function () {
  var s = "[" + this.connectionType + ", requested host: " + this.requestedHost 
          + ", host: " + (this.host == null ? "" : this.host) 
          + ", port: " + this.port 
          + ", send-delay: " + this.getSendDelay() + "]";
  return s;
}
    
// =============================================================================
// DISPOSAL
// =============================================================================
/** @private */ 
net.user1.orbiter.HTTPConnection.prototype.dispose = function () {
  this.doDispose();
  this.stopSendDelayTimer();
  net.user1.orbiter.Connection.prototype.dispose.call(this);
}
//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 *
 * The HTTPIFrameConnection class is used by Orbiter to communicate with
 * Union Server over HTTP in browsers that do not support CORS.
 * Rather than using CORS, HTTPIFrameConnection bypasses cross-origin restrictions
 * by proxying communications through a hidden HTML iframe.
 *
 * For a list of events dispatched by HTTPDirectConnection,
 * {@link net.user1.orbiter.Connection}.
 *
 * For more information on HTTP communication with Union Server, see
 * the HTTPDirectConnection class.
 *
 * @extends net.user1.orbiter.HTTPConnection
 *
 * @see net.user1.orbiter.HTTPDirectConnection
 * @see net.user1.orbiter.WebSocketConnection
 * @see net.user1.orbiter.SecureHTTPDirectConnection
 * @see net.user1.orbiter.SecureHTTPIFrameConnection
 * @see net.user1.orbiter.SecureWebSocketConnection
 */
net.user1.orbiter.HTTPIFrameConnection = function (host, port, type) {
  // Invoke superclass constructor
  net.user1.orbiter.HTTPConnection.call(this, host, port, type || net.user1.orbiter.ConnectionType.HTTP);
  this.postMessageInited = false;
  this.iFrameReady = false;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.HTTPIFrameConnection, net.user1.orbiter.HTTPConnection);

//==============================================================================    
// POSTMESSAGE INITIALIZATION
//==============================================================================   
/** @private */ 
net.user1.orbiter.HTTPIFrameConnection.prototype.initPostMessage = function () {
  if (this.postMessageInited) {
    throw new Error("[HTTPIFrameConnection] Illegal duplicate initialization attempt.");
  }
  var self = this;
  var win = this.orbiter.window;
  var errorMsg = null;
  
  if (win == null) {
    errorMsg = "[HTTPIFrameConnection] Unable to create connection." 
               + " No window object found.";
  } else {
    if (typeof win.addEventListener != "undefined") {
      // ...the standard way 
      win.addEventListener("message", postMessageListener, false);
    } else if (typeof win.attachEvent != "undefined") {
      // ...the IE-specific way 
      win.attachEvent("onmessage", postMessageListener);
    } else {
      errorMsg = "[HTTPIFrameConnection] Unable to create connection."
               + " No event listener registration method found on window object.";
    }
  }
  
  if (errorMsg != null) {
    this.orbiter.getLog().error(errorMsg);
    throw new Error(errorMsg);
  }

  /** @private */
  function postMessageListener (e) {
    // The connection's host might have been reassigned (normally to an ip) due
    // to server affinity in a clustered deployment, so allow for posts from both the
    // requestedHost and the host.
    if (e.origin.indexOf("//" + self.host + (self.port == 80 ? "" : (":" + self.port))) == -1
        && e.origin.indexOf("//" + self.requestedHost + (self.port == 80 ? "" : (":" + self.port))) == -1) {
      self.orbiter.getLog().error("[CONNECTION] " + self.toString()
        + " Ignored message from unknown origin: " + e.origin);
      return;
    }
    
    self.processPostMessage(e.data);
  }
  
  this.postMessageInited = true;
};

//==============================================================================    
// IFRAME MANAGEMENT
//==============================================================================    
/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.makeIFrame = function () {
  if (typeof this.orbiter.window.document == "undefined") {
    var errorMsg = "[HTTPIFrameConnection] Unable to create connection."
                 + " No document object found.";
    this.orbiter.getLog().error(errorMsg);
    throw new Error(errorMsg);
  }
  var doc = this.orbiter.window.document;
  
  this.iFrameReady = false;
  if (this.iframe != null) {
    this.postToIFrame("dispose");
    doc.body.removeChild(this.iframe);
  }
  this.iframe = doc.createElement('iframe');
  this.iframe.width = "0px";
  this.iframe.height = "0px";
  this.iframe.border = "0px";
  this.iframe.frameBorder = "0";
  this.iframe.style.visibility = "hidden";
  this.iframe.style.display = "none";
  this.iframe.src = this.url + "/orbiter";
  doc.body.appendChild(this.iframe);
}

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.onIFrameReady = function () {
  this.beginReadyHandshake();
}

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.postToIFrame = function (cmd, data) {
  if (this.iframe && this.iFrameReady) {
    data = data == undefined ? "" : data;
    // In order to post to the iframe, the targetOrigin must match the iframe's origin
    this.iframe.contentWindow.postMessage(cmd + "," + data, this.iframe.contentWindow.location.href);
  }  
}

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.processPostMessage = function (postedData) {
  var delimiterIndex = postedData.indexOf(",");
  var cmd  = postedData.substring(0, delimiterIndex);
  var data = postedData.substring(delimiterIndex+1);
  
  switch (cmd) {
    case"ready":
      this.iFrameReady = true;
      this.onIFrameReady();
      break;
      
    case "hellocomplete":
      this.helloCompleteListener(data);
      break;
    
    case "helloerror":
      this.helloErrorListener();
      break;
    
    case "outgoingcomplete":
      this.outgoingCompleteListener();
      break;
    
    case "outgoingerror":
      this.outgoingErrorListener();
      break;
    
    case "incomingcomplete":
      this.incomingCompleteListener(data);
      break;
    
    case "incomingerror":
      this.incomingErrorListener();
      break;
  }
}

//==============================================================================    
// CONNECTION AND DISCONNECTION
//==============================================================================    
net.user1.orbiter.HTTPIFrameConnection.prototype.connect = function () {
  if (!this.postMessageInited) {
    this.initPostMessage();
  }
  
  net.user1.orbiter.HTTPConnection.prototype.connect.call(this);
  this.makeIFrame();
};

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doRequestDeactivation = function() {
  this.postToIFrame("deactivate");
};

//==============================================================================    
// UPC LISTENERS (IFRAME-SPECIFIC IMPLEMENTATION)
//==============================================================================

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.u66 = function (serverVersion, 
                                                           sessionID, 
                                                           upcVersion, 
                                                           protocolCompatible) {
  net.user1.orbiter.Connection.prototype.u66.call(this,
                                                  serverVersion,
                                                  sessionID,
                                                  upcVersion,
                                                  protocolCompatible);
  if (this.iframe != null) {
    this.postToIFrame("sessionid", sessionID);
  }
}

//==============================================================================    
// HELLO REQUEST MANAGEMENT
//==============================================================================  

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doSendHello = function (helloString) {
  this.postToIFrame("sendhello", helloString);
};

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doRetryHello = function () {
  this.postToIFrame("retryhello");
}

//==============================================================================    
// OUTGOING REQUEST MANAGEMENT
//==============================================================================

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doSendOutgoing = function (data) {
  this.postToIFrame("sendoutgoing", data);
};

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doRetryOutgoing = function () {
  this.postToIFrame("retryoutgoing");
};

//==============================================================================    
// INCOMING REQUEST MANAGEMENT
//==============================================================================  

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doSendIncoming = function () {
  this.postToIFrame("sendincoming");
};

/** @private */
net.user1.orbiter.HTTPIFrameConnection.prototype.doRetryIncoming = function () {
  this.postToIFrame("retryincoming");
};
    
//==============================================================================    
// TOSTRING
//==============================================================================     
net.user1.orbiter.HTTPIFrameConnection.prototype.toString = function () {
  var s = "[HTTPIFrameConnection, requested host: " + this.requestedHost 
          + ", host: " + (this.host == null ? "" : this.host) 
          + ", port: " + this.port 
          + ", send-delay: " + this.getSendDelay() + "]";
  return s;
};
    
//==============================================================================
// DISPOSAL
//==============================================================================
/** @private */ 
net.user1.orbiter.HTTPIFrameConnection.prototype.doDispose = function () {
  this.postToIFrame("dispose");
};
//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 * <p>
 * The HTTPDirectConnection class is used by Orbiter to communicate with
 * Union Server over HTTP; it uses CORS to bypass cross-origin restrictions
 * when Union Server is hosted on a domain that does not match the domain at
 * which the Orbiter client is hosted. Normally, developers need not use the
 * HTTPDirectConnection class directly, and should instead make connections
 * via the Orbiter class's connect() method. However, the
 * HTTPDirectConnection class is required for fine-grained connection configuration,
 * such as defining failover connections for multiple Union Servers
 * running at different host addresses.
 * </p>
 *
 * <p>
 * By default, Orbiter uses the WebSocketConnection class, not the
 * HTTPDirectConnection class, to communicate with Union Server. The
 * HTTPDirectConnection class is used as a backup connection
 * when the primary WebSocketConnection connection is blocked by a firewall.
 * However, on a very heavily loaded server with limited persistent socket
 * connections available, communicating with Union Server over HTTP--which uses
 * short-lived socket connections--can improve performance at the
 * expense of realtime responsiveness. To reduce server load when communicating
 * over HTTP, use HTTPDirectConnection's setSendDelay() method to decrease the
 * frequency of Orbiter's requests for updates from Union Server. Developers
 * that wish to use HTTP connections as the primary form of communication with
 * Union Server must do so by manually configuring connections via the
 * ConnectionManager class's addConnection() method.</p>
 *
 * <p>
 * In environments that do not support CORS (such as IE8 on Windows), Orbiter
 * conducts HTTP communications using HTTPIFrameConnection instead of HTTPDirectConnection.
 * </p>
 *
 * <p>
 * For secure HTTP and WebSocket communications, see SecureHTTPDirectConnection,
 * SecureHTTPIFrameConnection, and SecureWebSocketConnection.
 * </p>
 *
 *
 * For a list of events dispatched by HTTPDirectConnection,
 * {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.HTTPConnection
 *
 * @see net.user1.orbiter.Orbiter#connect
 * @see net.user1.orbiter.Orbiter#secureConnect
 *
 * @see net.user1.orbiter.SecureHTTPDirectConnection
 * @see net.user1.orbiter.SecureHTTPIFrameConnection
 * @see net.user1.orbiter.SecureWebSocketConnection
 */
net.user1.orbiter.HTTPDirectConnection = function (host, port, type) {
  // Invoke superclass constructor
  net.user1.orbiter.HTTPConnection.call(this, host, port, type || net.user1.orbiter.ConnectionType.HTTP);
  
  this.outgoingRequestID = 0;
  this.incomingRequestID = 0;
  
  this.lastOutgoingPostData = null;
  this.lastIncomingPostData = null;
  this.lastHelloPostData    = null;
  
  this.pendingRequests = [];
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.HTTPDirectConnection, net.user1.orbiter.HTTPConnection);


//==============================================================================    
// CONNECTION AND DISCONNECTION
//==============================================================================    
net.user1.orbiter.HTTPDirectConnection.prototype.connect = function () {
  net.user1.orbiter.HTTPConnection.prototype.connect.call(this);
  this.beginReadyHandshake();
};

//==============================================================================    
// HELLO REQUEST MANAGEMENT
//==============================================================================  

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doSendHello = function (helloString) {
  this.newHelloRequest(helloString);
};

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doRetryHello = function () {
  this.retryHello();
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.newHelloRequest = function (data) {
  this.lastHelloPostData = this.createHelloPostData(encodeURIComponent(data));
  this.transmitRequest(this.lastHelloPostData, 
                       net.user1.orbiter.HTTPDirectConnection.helloRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.helloRequestErrorListener);
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.createHelloPostData = function (data) {
  return "mode=d" + "&data=" + data;
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.retryHello = function () {
  this.transmitRequest(this.lastHelloPostData, 
                       net.user1.orbiter.HTTPDirectConnection.helloRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.helloRequestErrorListener);
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.helloRequestReadystatechangeListener = function (xhr, connection) {
  if (xhr.readyState == 4) {
    connection.removePendingRequest(xhr);
    if (xhr.status >= 200 && xhr.status <= 299) {
      connection.helloCompleteListener(xhr.responseText);
    } else {
      connection.helloErrorListener();
    }
  }
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.helloRequestErrorListener = function (xhr, connection) {
  connection.removePendingRequest(xhr);
  connection.helloErrorListener();
}

//==============================================================================    
// OUTGOING REQUEST MANAGEMENT
//==============================================================================

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doSendOutgoing = function (data) {
  this.newOutgoingRequest(data);
};

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doRetryOutgoing = function () {
  this.retryOutgoing();
};

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.newOutgoingRequest = function (data) {
  this.lastOutgoingPostData = this.createOutgoingPostData(encodeURIComponent(data));
  this.transmitRequest(this.lastOutgoingPostData, 
                       net.user1.orbiter.HTTPDirectConnection.outgoingRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.outgoingRequestErrorListener);
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.createOutgoingPostData = function (data) {
  this.outgoingRequestID++;
  return "rid=" + this.outgoingRequestID + "&sid=" + this.orbiter.getSessionID() + "&mode=s" + "&data=" + data;
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.retryOutgoing = function () {
  this.transmitRequest(this.lastOutgoingPostData, 
                       net.user1.orbiter.HTTPDirectConnection.outgoingRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.outgoingRequestErrorListener);
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.outgoingRequestReadystatechangeListener = function (xhr, connection) {
  if (xhr.readyState == 4) {
    connection.removePendingRequest(xhr);
    if (xhr.status >= 200 && xhr.status <= 299) {
      connection.outgoingCompleteListener();
    } else {
      connection.outgoingErrorListener();
    }
  }
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.outgoingRequestErrorListener = function (xhr, connection) {
  connection.removePendingRequest(xhr);
  connection.outgoingErrorListener();
}

//==============================================================================    
// INCOMING REQUEST MANAGEMENT
//==============================================================================  

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doSendIncoming = function () {
  this.newIncomingRequest();
};

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doRetryIncoming = function () {
  this.retryIncoming();
};

/** @private */ 
net.user1.orbiter.HTTPDirectConnection.prototype.newIncomingRequest = function () {
  this.lastIncomingPostData = this.createIncomingPostData();
  this.transmitRequest(this.lastIncomingPostData,
                       net.user1.orbiter.HTTPDirectConnection.incomingRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.incomingRequestErrorListener);
}

/** @private */ 
net.user1.orbiter.HTTPDirectConnection.prototype.createIncomingPostData = function () {
  this.incomingRequestID++;
  return "rid=" + this.incomingRequestID + "&sid=" + this.orbiter.getSessionID() + "&mode=c";
}

/** @private */ 
net.user1.orbiter.HTTPDirectConnection.prototype.retryIncoming = function () {
  this.transmitRequest(this.lastIncomingPostData,
                       net.user1.orbiter.HTTPDirectConnection.incomingRequestReadystatechangeListener,
                       net.user1.orbiter.HTTPDirectConnection.incomingRequestErrorListener);
}

/** @private */ 
net.user1.orbiter.HTTPDirectConnection.incomingRequestReadystatechangeListener = function (xhr, connection) {
  if (xhr.readyState == 4) {
    connection.removePendingRequest(xhr);
    if (xhr.status >= 200 && xhr.status <= 299) {
      connection.incomingCompleteListener(xhr.responseText);
    } else {
      connection.incomingErrorListener();
    }
  }
}

/** @private */ 
net.user1.orbiter.HTTPDirectConnection.incomingRequestErrorListener = function (xhr, connection) {
  connection.removePendingRequest(xhr);
  connection.incomingErrorListener();
}

//==============================================================================
// XHR MANAGEMENT
//==============================================================================
/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.transmitRequest = function (data, 
                                                      readystatechangeListener, 
                                                      errorListener) {
  var self = this;
  var request;
  
  if (typeof XDomainRequest != "undefined") {
    // IE
    request = new XDomainRequest();
    request.onload = function () {
      request.readyState = 4;  // Emulate standards-based API
      request.status = 200;
      readystatechangeListener(this, self)
    };
    request.onerror = function () {
      errorListener(this, self);
    };
    request.ontimeout = function () {
      errorListener(this, self);
    };
    request.onprogress = function () {}; // Do nothing (required)
  } else {
    // All other standards-based browsers
    var request = new XMLHttpRequest();
    this.pendingRequests.push(request);
    request.onreadystatechange = function () {
      readystatechangeListener(this, self);
    };
    request.onerror = function () {
      errorListener(this, self);
    };
  }
  // Call open before setting header
  request.open("POST", this.url);
  // Standards-based browsers (IE doesn't allow the setting of headers)
  if (typeof request.setRequestHeader != "undefined") {
    request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
  }
  request.send(data);
}

/** @private */
net.user1.orbiter.HTTPDirectConnection.prototype.removePendingRequest = function (request) {
  for (var i = this.pendingRequests.length; --i >= 0; ) {
    if (this.pendingRequests[i] === request) {
      this.pendingRequests.splice(i, 1);
    }
  }
}

/** @private Abstract method implementation */
net.user1.orbiter.HTTPDirectConnection.prototype.doRequestDeactivation = function () {
  for (var i = this.pendingRequests.length; --i >= 0;) {
    try {
      this.pendingRequests[i].abort();
    } catch (e) {
      // Do nothing
    }
  }
  this.pendingRequests = [];
}
    
//==============================================================================    
// TOSTRING
//==============================================================================     
net.user1.orbiter.HTTPDirectConnection.prototype.toString = function () {
  var s = "[HTTPDirectConnection, requested host: " + this.requestedHost 
          + ", host: " + (this.host == null ? "" : this.host) 
          + ", port: " + this.port 
          + ", send-delay: " + this.getSendDelay() + "]";
  return s;
};
    
//==============================================================================
// DISPOSAL
//==============================================================================
/** @private */ 
net.user1.orbiter.HTTPDirectConnection.prototype.doDispose = function () {
  this.deactivateHTTPRequests();
};
//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/** @class
 * <p>
 * The SecureHTTPDirectConnection class is identical to HTTPDirectConnection
 * except that it performs communications over HTTPS (i.e., an encrypted TLS or
 * SSL connection) rather than plain HTTP.</p>
 *
 * For a list of events dispatched by SecureHTTPDirectConnection, see
 * {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.HTTPDirectConnection
 *
 * @see net.user1.orbiter.HTTPDirectConnection
 */
net.user1.orbiter.SecureHTTPDirectConnection = function (host, port) {
  // Invoke superclass constructor
  net.user1.orbiter.HTTPDirectConnection.call(this, host, port, net.user1.orbiter.ConnectionType.SECURE_HTTP);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.SecureHTTPDirectConnection, net.user1.orbiter.HTTPDirectConnection);

/** @private */
net.user1.orbiter.SecureHTTPDirectConnection.prototype.buildURL = function () {
  this.url = "https://" + this.host + ":" + this.port;
};

//==============================================================================
// TOSTRING
//==============================================================================
net.user1.orbiter.SecureHTTPDirectConnection.prototype.toString = function () {
  var s = "[SecureHTTPDirectConnection, requested host: " + this.requestedHost
          + ", host: " + (this.host == null ? "" : this.host)
          + ", port: " + this.port
          + ", send-delay: " + this.getSendDelay() + "]";
  return s;
};
//==============================================================================    
// CLASS DECLARATION
//==============================================================================
/**
 * @class
 *
 * <p>
 * The SecureHTTPIFrameConnection class is identical to HTTPIFrameConnection
 * except that it performs communications over HTTPS (i.e., an encrypted TLS or
 * SSL connection) rather than plain HTTP.</p>
 *
 * For a list of events dispatched by SecureHTTPIFrameConnection,
 * see {@link net.user1.orbiter.Connection}.
 *
 * @extends net.user1.orbiter.HTTPIFrameConnection
 *
 * @see net.user1.orbiter.HTTPIFrameConnection
 */
net.user1.orbiter.SecureHTTPIFrameConnection = function (host, port) {
  // Invoke superclass constructor
  net.user1.orbiter.HTTPIFrameConnection.call(this, host, port, net.user1.orbiter.ConnectionType.SECURE_HTTP);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.SecureHTTPIFrameConnection, net.user1.orbiter.HTTPIFrameConnection);

/** @private */
net.user1.orbiter.SecureHTTPIFrameConnection.prototype.buildURL = function () {
  this.url = "https://" + this.host + ":" + this.port;
};

//==============================================================================
// TOSTRING
//==============================================================================
net.user1.orbiter.SecureHTTPIFrameConnection.prototype.toString = function () {
  var s = "[SecureHTTPIFrameConnection, requested host: " + this.requestedHost
          + ", host: " + (this.host == null ? "" : this.host)
          + ", port: " + this.port
          + ", send-delay: " + this.getSendDelay() + "]";
  return s;
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @private */
net.user1.orbiter.MessageListener = function (listener,
                                              forRoomIDs,
                                              thisArg) {
  this.listener   = listener;
  this.forRoomIDs = forRoomIDs;
  this.thisArg    = thisArg;
};

//==============================================================================
// INSTANCE METHODS
//==============================================================================
/** @private */
net.user1.orbiter.MessageListener.prototype.getListenerFunction = function () {
  return this.listener;
};
    
/** @private */
net.user1.orbiter.MessageListener.prototype.getForRoomIDs = function () {
  return this.forRoomIDs;
};
    
/** @private */
net.user1.orbiter.MessageListener.prototype.getThisArg = function () {
  return this.thisArg;
};

/** @private */
net.user1.orbiter.MessageListener.prototype.toString = function () {
  return "[object MessageListener]";
};
//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.orbiter.MessageManager = function (log, connectionManager) {
  this.log = log;
  this.messageListeners = new Object();
  this.removeListenersOnDisconnect = true;
  this.numMessagesSent = 0;
  this.numMessagesReceived = 0;
  this.currentConnection = null;
  this.connectionManager = connectionManager;
  this.connectionManager.addEventListener(net.user1.orbiter.ConnectionManagerEvent.SELECT_CONNECTION,
                                          this.selectConnectionListener, this);
};

//==============================================================================
// INSTANCE METHODS
//==============================================================================
net.user1.orbiter.MessageManager.prototype.getNumMessagesReceived = function () {
  return this.numMessagesReceived;
}
  
net.user1.orbiter.MessageManager.prototype.getNumMessagesSent = function () {
  return this.numMessagesSent;
}
  
net.user1.orbiter.MessageManager.prototype.getTotalMessages = function () {
  return this.numMessagesSent + this.numMessagesReceived;
}
  
/** @private */
net.user1.orbiter.MessageManager.prototype.selectConnectionListener = function (e) {
  if (this.currentConnection != null) {
    this.currentConnection.removeEventListener(net.user1.orbiter.ConnectionEvent.RECEIVE_UPC, 
                                          this.upcReceivedListener, this);
    this.currentConnection.removeEventListener(net.user1.orbiter.ConnectionEvent.DISCONNECT,
                                          this.disconnectListener, this);
    this.currentConnection.removeEventListener(net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE,
                                          this.connectFailureListener, this);
  }

  this.currentConnection = e.getConnection(); 

  this.currentConnection.addEventListener(net.user1.orbiter.ConnectionEvent.RECEIVE_UPC, 
                                        this.upcReceivedListener, this);
  this.currentConnection.addEventListener(net.user1.orbiter.ConnectionEvent.DISCONNECT,
                                        this.disconnectListener, this);
  this.currentConnection.addEventListener(net.user1.orbiter.ConnectionEvent.CONNECT_FAILURE,
                                        this.connectFailureListener, this);
}
  
/** @private */
net.user1.orbiter.MessageManager.prototype.disconnectListener = function (e) {
  this.cleanupAfterClosedConnection(e.target);
}
    
/** @private */
net.user1.orbiter.MessageManager.prototype.connectFailureListener = function (e) {
  this.cleanupAfterClosedConnection(e.target);
}
    
/** @private */
net.user1.orbiter.MessageManager.prototype.cleanupAfterClosedConnection = function (connection) {
  var listenerList;
  if (this.removeListenersOnDisconnect) {
    this.log.info("[MESSAGE_MANAGER] Removing registered message listeners.");
    for (var message in this.messageListeners) {
      listenerList = this.messageListeners[message];
      for (var p in listenerList) {
        this.removeMessageListener(message, listenerList[p].getListenerFunction());
      } 
    }
  } else {
    this.log.warn("[MESSAGE_MANAGER] Leaving message listeners registered. \n"
      + "Be sure to remove any unwanted message listeners manually.");
  }
  
  this.numMessagesReceived = 0;
  this.numMessagesSent = 0;
}
  
net.user1.orbiter.MessageManager.prototype.sendUPC = function (message) {
  // Quit if the connection isn't ready...
  if (!this.connectionManager.isReady()) {
    this.log.warn("[MESSAGE_MANAGER] Connection not ready. UPC not sent. Message: " 
    + message);
    return;
  }

  // Build the UPC to send.
  var theUPC = "<U><M>" + message + "</M>";
  var a;
  
  if (arguments.length > 1) {
    theUPC += "<L>";
    for (var i = 1; i < arguments.length; i++) {
      a = arguments[i];
      a = a == undefined ? "" : a.toString();
      // Wrap any non-filter argument that contains a start tag ("<") in CDATA
      if (a.indexOf("<") != -1) {
        if (a.indexOf('<f t=') != 0) {
          a = "<![CDATA[" + a + "]]>";
        }
      }
      theUPC += "<A>" + a + "</A>";
    }
    theUPC += "</L>";
  }
  theUPC += "</U>";

  // Count the message
  this.numMessagesSent++;
  
  // Send the UPC to the server
  this.log.debug("[MESSAGE_MANAGER] UPC sent: " + theUPC);
  this.connectionManager.getActiveConnection().send(theUPC);
};

/** @private */
net.user1.orbiter.MessageManager.prototype.sendUPCObject = function (upc) {
  var args = upc.args.slice();
  args.unshift(upc.method);
  this.sendUPC.apply(this, args);
};

/** @private */
net.user1.orbiter.MessageManager.prototype.upcReceivedListener = function (e) {
  this.numMessagesReceived++;
  
  var upc = e.getUPC();
  this.log.debug("[MESSAGE_MANAGER] UPC received: " + upc );
  
  var method;
  var upcArgs = new Array();
  
  var closeMTagIndex = upc.indexOf("</M>");
  method = upc.substring(6, closeMTagIndex);
  
  var searchBeginIndex = upc.indexOf("<A>", closeMTagIndex);
  var closeATagIndex;
  var arg;
  while (searchBeginIndex != -1) {
    closeATagIndex = upc.indexOf("</A>", searchBeginIndex);
    arg = upc.substring(searchBeginIndex+3, closeATagIndex);
    if (arg.indexOf("<![CDATA[") == 0) {
      arg = arg.substr(9, arg.length-12);
    }
    upcArgs.push(arg);
    searchBeginIndex = upc.indexOf("<A>", closeATagIndex);
  }     
  
  this.notifyMessageListeners(method, upcArgs);
};

net.user1.orbiter.MessageManager.prototype.addMessageListener = function (message, 
                                                                          listener,
                                                                          thisArg,
                                                                          forRoomIDs) {
  if (forRoomIDs != null) {
    var typeString = Object.prototype.toString.call(forRoomIDs);
    if (typeString != "[object Array]") {
      throw new Error("[MESSAGE_MANAGER] Illegal argument type " + typeString
                      + " supplied for addMessageListener()'s forRoomIDs"
                      + " parameter. Value must be an Array.");
    }
  }
  
  // Each message gets a list of MessageListener objects. 
  // If this message has no such list, make one.
  if (this.messageListeners[message] === undefined) {
    this.messageListeners[message] = new Array();
  } 
  var listenerArray = this.messageListeners[message];
  
  // Quit if the listener is already registered
  if (this.hasMessageListener(message, listener)) {
    return false;
  }
  
  // Add the listener
  var newListener = new net.user1.orbiter.MessageListener(listener,
                                            forRoomIDs === undefined ? null : forRoomIDs,
                                            thisArg);
  listenerArray.push(newListener);
  return true;      
};

net.user1.orbiter.MessageManager.prototype.removeMessageListener = function (message,
                                                           listener) {
  // Quit if the message has no listeners
  var listenerArray = this.messageListeners[message];
  if (listenerArray == null) {
    return false;
  } 
  
  // Remove the listener
  var foundListener;
  for (var i = 0; i < listenerArray.length; i++) {
    if (listenerArray[i].getListenerFunction() == listener) {
      foundListener = true;
      listenerArray.splice(i, 1);
      break;
    }
  }
  
  // Delete the listeners array if it's now empty
  if (listenerArray.length == 0) {
    delete this.messageListeners[message];
  }
  
  return foundListener;      
};
    
net.user1.orbiter.MessageManager.prototype.hasMessageListener = function (message, 
                                                        listener) {
  // Quit if the message has no listeners
  var listenerArray = this.messageListeners[message];
  if (listenerArray == null) {
    return false;
  } 
      
   // Check for the listener
  for (var i = 0; i < listenerArray.length; i++) {
    if (listenerArray[i].getListenerFunction() 
      == listener) {
      return true;
    }
  }
  return false;
};
    
net.user1.orbiter.MessageManager.prototype.getMessageListeners = function (message) {
  return this.messageListeners[message] != undefined ? this.messageListeners[message] : [];
};

/** @private */
net.user1.orbiter.MessageManager.prototype.notifyMessageListeners = function (message, args) {
  // Retrieve the list of listeners for this message.
  var listeners = this.messageListeners[message];
  // If there are no listeners registered, then quit
  if (listeners === undefined) {
    // Log a warning if it's not a UPC
    if (!(message.charAt(0) == "u" && parseInt(message.substring(1)) > 1)) {
      this.log.warn("Message delivery failed. No listeners found. Message: " + 
               message + ". Arguments: " + args.join());
    }
    return;
  } else {
    listeners = listeners.slice(0);    
  }
  var numListeners = listeners.length; 
  for (var i = 0; i < numListeners; i++) {
    listeners[i].getListenerFunction().apply(listeners[i].getThisArg(), args);
  }
};

net.user1.orbiter.MessageManager.prototype.dispose = function () {
  this.log.info("[MESSAGE_MANAGER] Disposing resources.");
  this.log = null;
  this.orbiter = null;
  this.messageListeners = null;
  this.numMessagesSent = 0;
  this.numMessagesReceived = 0;
  this.currentConnection = null;
}
  
net.user1.orbiter.MessageManager.prototype.toString = function () {
  return "[object MessageManager]";
};

//==============================================================================
// UPC CONSTANTS
//==============================================================================
/** @class */
net.user1.orbiter.UPC = new Object();

// CLIENT TO SERVER
/** @constant */
net.user1.orbiter.UPC.SEND_MESSAGE_TO_ROOMS = "u1";            
/** @constant */
net.user1.orbiter.UPC.SEND_MESSAGE_TO_CLIENTS = "u2";            
/** @constant */
net.user1.orbiter.UPC.SET_CLIENT_ATTR = "u3";       
/** @constant */
net.user1.orbiter.UPC.JOIN_ROOM = "u4";             
/** @constant */
net.user1.orbiter.UPC.SET_ROOM_ATTR = "u5";         
/** @constant */
net.user1.orbiter.UPC.LEAVE_ROOM = "u10";           
/** @constant */
net.user1.orbiter.UPC.CREATE_ACCOUNT = "u11"; 
/** @constant */
net.user1.orbiter.UPC.REMOVE_ACCOUNT = "u12";
/** @constant */
net.user1.orbiter.UPC.CHANGE_ACCOUNT_PASSWORD = "u13";
/** @constant */
net.user1.orbiter.UPC.LOGIN = "u14";            
/** @constant */
net.user1.orbiter.UPC.GET_CLIENTCOUNT_SNAPSHOT = "u18";                
/** @constant */
net.user1.orbiter.UPC.SYNC_TIME = "u19";
/** @constant */
net.user1.orbiter.UPC.GET_ROOMLIST_SNAPSHOT = "u21";
/** @constant */
net.user1.orbiter.UPC.CREATE_ROOM = "u24";                       
/** @constant */
net.user1.orbiter.UPC.REMOVE_ROOM = "u25";                       
/** @constant */
net.user1.orbiter.UPC.WATCH_FOR_ROOMS = "u26";            
/** @constant */
net.user1.orbiter.UPC.STOP_WATCHING_FOR_ROOMS = "u27"; 
/** @constant */
net.user1.orbiter.UPC.GET_ROOM_SNAPSHOT = "u55";
/** @constant */
net.user1.orbiter.UPC.SEND_MESSAGE_TO_SERVER = "u57"; 
/** @constant */
net.user1.orbiter.UPC.OBSERVE_ROOM = "u58"; 
/** @constant */
net.user1.orbiter.UPC.STOP_OBSERVING_ROOM = "u61"; 
/** @constant */
net.user1.orbiter.UPC.SET_ROOM_UPDATE_LEVELS = "u64"; 
/** @constant */
net.user1.orbiter.UPC.CLIENT_HELLO = "u65"; 
/** @constant */
net.user1.orbiter.UPC.REMOVE_ROOM_ATTR = "u67"; 
/** @constant */
net.user1.orbiter.UPC.REMOVE_CLIENT_ATTR = "u69"; 
/** @constant */
net.user1.orbiter.UPC.SEND_ROOMMODULE_MESSAGE = "u70"; 
/** @constant */
net.user1.orbiter.UPC.SEND_SERVERMODULE_MESSAGE = "u71"; 
/** @constant */
net.user1.orbiter.UPC.TERMINATE_SESSION = "u83";
/** @constant */
net.user1.orbiter.UPC.LOGOFF = "u86";  
/** @constant */
net.user1.orbiter.UPC.GET_CLIENTLIST_SNAPSHOT = "u91";  
/** @constant */
net.user1.orbiter.UPC.WATCH_FOR_CLIENTS = "u92";  
/** @constant */
net.user1.orbiter.UPC.STOP_WATCHING_FOR_CLIENTS = "u93";  
/** @constant */
net.user1.orbiter.UPC.GET_CLIENT_SNAPSHOT = "u94";  
/** @constant */
net.user1.orbiter.UPC.OBSERVE_CLIENT = "u95";  
/** @constant */
net.user1.orbiter.UPC.STOP_OBSERVING_CLIENT = "u96";  
/** @constant */
net.user1.orbiter.UPC.GET_ACCOUNTLIST_SNAPSHOT = "u97";  
/** @constant */
net.user1.orbiter.UPC.WATCH_FOR_ACCOUNTS = "u98";  
/** @constant */
net.user1.orbiter.UPC.STOP_WATCHING_FOR_ACCOUNTS = "u99";  
/** @constant */
net.user1.orbiter.UPC.GET_ACCOUNT_SNAPSHOT = "u100";  
/** @constant */
net.user1.orbiter.UPC.OBSERVE_ACCOUNT = "u121";  
/** @constant */
net.user1.orbiter.UPC.STOP_OBSERVING_ACCOUNT = "u122"; 
/** @constant */
net.user1.orbiter.UPC.ADD_ROLE = "u133";  
/** @constant */
net.user1.orbiter.UPC.REMOVE_ROLE = "u135";  
/** @constant */
net.user1.orbiter.UPC.KICK_CLIENT = "u149";  
/** @constant */
net.user1.orbiter.UPC.BAN = "u137";  
/** @constant */
net.user1.orbiter.UPC.UNBAN = "u139";  
/** @constant */
net.user1.orbiter.UPC.GET_BANNED_LIST_SNAPSHOT = "u141";  
/** @constant */
net.user1.orbiter.UPC.WATCH_FOR_BANNED_ADDRESSES = "u143";  
/** @constant */
net.user1.orbiter.UPC.STOP_WATCHING_FOR_BANNED_ADDRESSES = "u145";  
/** @constant */
net.user1.orbiter.UPC.GET_NODELIST_SNAPSHOT = "u165";  
/** @constant */
net.user1.orbiter.UPC.GET_GATEWAYS_SNAPSHOT = "u167";

// SERVER TO CLIENT
/** @constant */
net.user1.orbiter.UPC.JOINED_ROOM = "u6";
/** @constant */
net.user1.orbiter.UPC.RECEIVE_MESSAGE = "u7";
/** @constant */
net.user1.orbiter.UPC.CLIENT_ATTR_UPDATE = "u8";
/** @constant */
net.user1.orbiter.UPC.ROOM_ATTR_UPDATE = "u9";
/** @constant */
net.user1.orbiter.UPC.CLIENT_METADATA = "u29";
/** @constant */
net.user1.orbiter.UPC.CREATE_ROOM_RESULT = "u32";
/** @constant */
net.user1.orbiter.UPC.REMOVE_ROOM_RESULT = "u33";
/** @constant */
net.user1.orbiter.UPC.CLIENTCOUNT_SNAPSHOT = "u34";
/** @constant */
net.user1.orbiter.UPC.CLIENT_ADDED_TO_ROOM = "u36";
/** @constant */
net.user1.orbiter.UPC.CLIENT_REMOVED_FROM_ROOM = "u37";
/** @constant */
net.user1.orbiter.UPC.ROOMLIST_SNAPSHOT = "u38";
/** @constant */
net.user1.orbiter.UPC.ROOM_ADDED = "u39";
/** @constant */
net.user1.orbiter.UPC.ROOM_REMOVED = "u40";
/** @constant */
net.user1.orbiter.UPC.WATCH_FOR_ROOMS_RESULT = "u42";
/** @constant */
net.user1.orbiter.UPC.STOP_WATCHING_FOR_ROOMS_RESULT = "u43";
/** @constant */
net.user1.orbiter.UPC.LEFT_ROOM = "u44";
/** @constant */
net.user1.orbiter.UPC.CHANGE_ACCOUNT_PASSWORD_RESULT = "u46";
/** @constant */
net.user1.orbiter.UPC.CREATE_ACCOUNT_RESULT = "u47";
/** @constant */
net.user1.orbiter.UPC.REMOVE_ACCOUNT_RESULT = "u48";
/** @constant */
net.user1.orbiter.UPC.LOGIN_RESULT = "u49";
/** @constant */
net.user1.orbiter.UPC.SERVER_TIME_UPDATE = "u50";
/** @constant */
net.user1.orbiter.UPC.ROOM_SNAPSHOT = "u54";
/** @constant */
net.user1.orbiter.UPC.OBSERVED_ROOM = "u59";
/** @constant */
net.user1.orbiter.UPC.GET_ROOM_SNAPSHOT_RESULT = "u60";
/** @constant */
net.user1.orbiter.UPC.STOPPED_OBSERVING_ROOM = "u62";
/** @constant */
net.user1.orbiter.UPC.CLIENT_READY = "u63";
/** @constant */
net.user1.orbiter.UPC.SERVER_HELLO = "u66";
/** @constant */
net.user1.orbiter.UPC.JOIN_ROOM_RESULT = "u72";
/** @constant */
net.user1.orbiter.UPC.SET_CLIENT_ATTR_RESULT = "u73";
/** @constant */
net.user1.orbiter.UPC.SET_ROOM_ATTR_RESULT = "u74";
/** @constant */
net.user1.orbiter.UPC.GET_CLIENTCOUNT_SNAPSHOT_RESULT = "u75";
/** @constant */
net.user1.orbiter.UPC.LEAVE_ROOM_RESULT = "u76";
/** @constant */
net.user1.orbiter.UPC.OBSERVE_ROOM_RESULT = "u77";
/** @constant */
net.user1.orbiter.UPC.STOP_OBSERVING_ROOM_RESULT = "u78";
/** @constant */
net.user1.orbiter.UPC.ROOM_ATTR_REMOVED = "u79";
/** @constant */
net.user1.orbiter.UPC.REMOVE_ROOM_ATTR_RESULT = "u80";
/** @constant */
net.user1.orbiter.UPC.CLIENT_ATTR_REMOVED = "u81";
/** @constant */
net.user1.orbiter.UPC.REMOVE_CLIENT_ATTR_RESULT = "u82";
/** @constant */
net.user1.orbiter.UPC.SESSION_TERMINATED = "u84";
/** @constant */
net.user1.orbiter.UPC.SESSION_NOT_FOUND = "u85";
/** @constant */
net.user1.orbiter.UPC.LOGOFF_RESULT = "u87";
/** @constant */
net.user1.orbiter.UPC.LOGGED_IN = "u88";
/** @constant */
net.user1.orbiter.UPC.LOGGED_OFF = "u89";
/** @constant */
net.user1.orbiter.UPC.ACCOUNT_PASSWORD_CHANGED = "u90";
/** @constant */
net.user1.orbiter.UPC.CLIENTLIST_SNAPSHOT = "u101";
/** @constant */
net.user1.orbiter.UPC.CLIENT_ADDED_TO_SERVER = "u102";
/** @constant */
net.user1.orbiter.UPC.CLIENT_REMOVED_FROM_SERVER = "u103";
/** @constant */
net.user1.orbiter.UPC.CLIENT_SNAPSHOT = "u104";
/** @constant */
net.user1.orbiter.UPC.OBSERVE_CLIENT_RESULT = "u105";
/** @constant */
net.user1.orbiter.UPC.STOP_OBSERVING_CLIENT_RESULT = "u106";
/** @constant */
net.user1.orbiter.UPC.WATCH_FOR_CLIENTS_RESULT = "u107";
/** @constant */
net.user1.orbiter.UPC.STOP_WATCHING_FOR_CLIENTS_RESULT = "u108";
/** @constant */
net.user1.orbiter.UPC.WATCH_FOR_ACCOUNTS_RESULT = "u109";
/** @constant */
net.user1.orbiter.UPC.STOP_WATCHING_FOR_ACCOUNTS_RESULT = "u110";
/** @constant */
net.user1.orbiter.UPC.ACCOUNT_ADDED = "u111";
/** @constant */
net.user1.orbiter.UPC.ACCOUNT_REMOVED = "u112";
/** @constant */
net.user1.orbiter.UPC.JOINED_ROOM_ADDED_TO_CLIENT = "u113";
/** @constant */
net.user1.orbiter.UPC.JOINED_ROOM_REMOVED_FROM_CLIENT = "u114";
/** @constant */
net.user1.orbiter.UPC.GET_CLIENT_SNAPSHOT_RESULT = "u115";
/** @constant */
net.user1.orbiter.UPC.GET_ACCOUNT_SNAPSHOT_RESULT = "u116";
/** @constant */
net.user1.orbiter.UPC.OBSERVED_ROOM_ADDED_TO_CLIENT = "u117";
/** @constant */
net.user1.orbiter.UPC.OBSERVED_ROOM_REMOVED_FROM_CLIENT = "u118";
/** @constant */
net.user1.orbiter.UPC.CLIENT_OBSERVED = "u119";
/** @constant */
net.user1.orbiter.UPC.STOPPED_OBSERVING_CLIENT = "u120";
/** @constant */
net.user1.orbiter.UPC.OBSERVE_ACCOUNT_RESULT = "u123";
/** @constant */
net.user1.orbiter.UPC.ACCOUNT_OBSERVED = "u124";
/** @constant */
net.user1.orbiter.UPC.STOP_OBSERVING_ACCOUNT_RESULT = "u125";
/** @constant */
net.user1.orbiter.UPC.STOPPED_OBSERVING_ACCOUNT = "u126";
/** @constant */
net.user1.orbiter.UPC.ACCOUNT_LIST_UPDATE = "u127";
/** @constant */
net.user1.orbiter.UPC.UPDATE_LEVELS_UPDATE = "u128";
/** @constant */
net.user1.orbiter.UPC.CLIENT_OBSERVED_ROOM = "u129";
/** @constant */
net.user1.orbiter.UPC.CLIENT_STOPPED_OBSERVING_ROOM = "u130";
/** @constant */
net.user1.orbiter.UPC.ROOM_OCCUPANTCOUNT_UPDATE = "u131";
/** @constant */
net.user1.orbiter.UPC.ROOM_OBSERVERCOUNT_UPDATE = "u132";
/** @constant */
net.user1.orbiter.UPC.ADD_ROLE_RESULT = "u134";
/** @constant */
net.user1.orbiter.UPC.REMOVE_ROLE_RESULT = "u136";
/** @constant */
net.user1.orbiter.UPC.BAN_RESULT = "u138";
/** @constant */
net.user1.orbiter.UPC.UNBAN_RESULT = "u140";
/** @constant */
net.user1.orbiter.UPC.BANNED_LIST_SNAPSHOT = "u142";
/** @constant */
net.user1.orbiter.UPC.WATCH_FOR_BANNED_ADDRESSES_RESULT = "u144";
/** @constant */
net.user1.orbiter.UPC.STOP_WATCHING_FOR_BANNED_ADDRESSES_RESULT = "u146";
/** @constant */
net.user1.orbiter.UPC.BANNED_ADDRESS_ADDED = "u147";
/** @constant */
net.user1.orbiter.UPC.BANNED_ADDRESS_REMOVED = "u148";
/** @constant */
net.user1.orbiter.UPC.KICK_CLIENT_RESULT = "u150";
/** @constant */
net.user1.orbiter.UPC.SERVERMODULELIST_SNAPSHOT = "u152";
/** @constant */
net.user1.orbiter.UPC.GET_UPC_STATS_SNAPSHOT_RESULT = "u155";
/** @constant */
net.user1.orbiter.UPC.UPC_STATS_SNAPSHOT = "u156";
/** @constant */
net.user1.orbiter.UPC.RESET_UPC_STATS_RESULT = "u158";
/** @constant */
net.user1.orbiter.UPC.WATCH_FOR_PROCESSED_UPCS_RESULT = "u160";
/** @constant */
net.user1.orbiter.UPC.PROCESSED_UPC_ADDED = "u161";
/** @constant */
net.user1.orbiter.UPC.STOP_WATCHING_FOR_PROCESSED_UPCS_RESULT = "u163";
/** @constant */
net.user1.orbiter.UPC.CONNECTION_REFUSED = "u164";
/** @constant */
net.user1.orbiter.UPC.NODELIST_SNAPSHOT = "u166";
/** @constant */
net.user1.orbiter.UPC.GATEWAYS_SNAPSHOT = "u168";
//==============================================================================
// LOADED FLAG
//==============================================================================
/** 
 * @constant 
 * 
 * Indicates that Orbiter has finished loading.
 */
net.user1.orbiter.LOADED = true;

})((typeof window == "undefined") ? this : window);
