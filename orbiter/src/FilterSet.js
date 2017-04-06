//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 */
net.user1.orbiter.filters.FilterSet = function () {
  this.filters = new Array();
};
    
net.user1.orbiter.filters.FilterSet.prototype.addFilter = function (filter) {
  this.filters.push(filter);
};
    
net.user1.orbiter.filters.FilterSet.prototype.getFilters = function () {
  return this.filters.slice(0);
};
    
net.user1.orbiter.filters.FilterSet.prototype.toXMLString = function () {
  var s = "<filters>\n";
  
  var filter;
  for (var i = 0; i < this.filters.length; i++) {
    filter = this.filters[i];
    s += filter.toXMLString() + "\n";
  }
  s += "</filters>";
  return s;
};