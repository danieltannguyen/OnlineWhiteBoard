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
