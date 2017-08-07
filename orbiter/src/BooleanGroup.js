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
