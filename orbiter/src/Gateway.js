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
