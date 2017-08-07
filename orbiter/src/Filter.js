//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.filters.AndGroup
 */
net.user1.orbiter.filters.Filter = function (filterType) {
  net.user1.orbiter.filters.AndGroup.call(this);
  this.filterType = filterType;
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.filters.Filter, net.user1.orbiter.filters.AndGroup);

net.user1.orbiter.filters.Filter.prototype.toXMLString = function () {
  var s = '<f t="' + this.filterType + '">\n';

  var comparison;
  for (var i = 0; i < this.comparisons.length; i++) {
    comparison = this.comparisons[i];
    s += comparison.toXMLString() + "\n";
  }
  s += '</f>';
  return s;      
};