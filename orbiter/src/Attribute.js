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