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