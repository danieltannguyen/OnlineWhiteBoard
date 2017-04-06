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
