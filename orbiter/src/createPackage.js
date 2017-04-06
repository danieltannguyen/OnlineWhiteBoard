//==============================================================================
// PACKAGE MANAGEMENT
//==============================================================================

// JSDOC helpers

/** @namespace 
    @name net
    @private */
/** @namespace 
    @name net.user1
    @private */
/** @namespace 
    @name net.user1.events
    @private */
/** @namespace 
    @name net.user1.logger
    @private */
/** @namespace 
    @name net.user1.orbiter
 */
/** @namespace 
    @name net.user1.utils
 */

// create utils package
if (typeof globalObject.net == "undefined") {
  globalObject.net = {};
}
var net = globalObject.net;
net.user1 = net.user1 ? net.user1 : {};
net.user1.utils = net.user1.utils ? net.user1.utils : {};

//  Convenience method to create packages
/** @function */
net.user1.utils.createPackage = function (packageName) {
  var parts = packageName.split(".");
  var part = globalObject;
  
  for (var i = 0; i < parts.length; i++) {
    part = part[parts[i]] === undefined ? (part[parts[i]] = {}) : part[parts[i]];
  }
};