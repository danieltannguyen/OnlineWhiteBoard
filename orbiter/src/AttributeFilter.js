//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.filters.Filter
 */
net.user1.orbiter.filters.AttributeFilter = function () {
  net.user1.orbiter.filters.Filter.call(this, "A");
};


//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.filters.AttributeFilter, net.user1.orbiter.filters.Filter);