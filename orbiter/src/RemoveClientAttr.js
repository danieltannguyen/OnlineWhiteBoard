/**
 * @private
 */  
net.user1.orbiter.upc.RemoveClientAttr = function (clientID, userID, name, scope) { 
  // Abort if name is invalid.
  if (!net.user1.orbiter.Validator.isValidAttributeName(name)) {
    throw new Error("Cannot delete attribute. Illegal name" + 
                    " (see Validator.isValidAttributeName()): " + name);
  }
  
  // Abort if scope is invalid.
  if (!net.user1.orbiter.Validator.isValidAttributeScope(scope)) {
    throw new Error("Cannot delete client attribute. Illegal scope" + 
             " (see Validator.isValidAttributeScope()): " + scope);
  }
  
  this.method = net.user1.orbiter.UPC.REMOVE_CLIENT_ATTR;
  this.args   = [clientID, userID, name, scope];
};
