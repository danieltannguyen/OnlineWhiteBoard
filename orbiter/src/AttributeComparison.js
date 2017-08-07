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