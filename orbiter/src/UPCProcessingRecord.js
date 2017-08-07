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