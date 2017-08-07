//==============================================================================
// ABSTRACT ERROR FUNCTION
//==============================================================================

// JSDOC helpers

/** @private */
net.user1.utils.abstractError = function () {
  throw new Error("Could not invoke abstract method. This method must be implemented by a subclass.");
};