//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.filters.BooleanGroup
 */
net.user1.orbiter.filters.AndGroup = function () {
  net.user1.orbiter.filters.BooleanGroup.call(this, net.user1.orbiter.filters.BooleanGroupType.AND);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.filters.AndGroup, net.user1.orbiter.filters.BooleanGroup);