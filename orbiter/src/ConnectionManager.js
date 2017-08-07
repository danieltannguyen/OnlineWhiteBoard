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






















