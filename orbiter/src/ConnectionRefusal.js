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
