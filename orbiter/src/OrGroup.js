//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** 
 * @class
 * @extends net.user1.orbiter.filters.BooleanGroup
 */
net.user1.orbiter.filters.OrGroup = function () {
  net.user1.orbiter.filters.BooleanGroup.call(this, net.user1.orbiter.filters.BooleanGroupType.OR);
};

//==============================================================================
// INHERITANCE
//==============================================================================
net.user1.utils.extend(net.user1.orbiter.filters.OrGroup, net.user1.orbiter.filters.BooleanGroup);