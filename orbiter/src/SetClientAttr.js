/**
 * @private
 */  
net.user1.orbiter.upc.SetClientAttr = function (name, 
                                                value, 
                                                options,
                                                scope,
                                                clientID,
                                                userID) {
  // Call superconstructor
  net.user1.orbiter.upc.SetAttr.call(this, name, value, options);
      
  // Abort if scope is invalid.
  if (!net.user1.orbiter.Validator.isValidAttributeScope(scope)) {
    throw new Error("Cannot set client attribute. Illegal scope" + 
             " (see Validator.isValidAttributeScope()). " +
             " Illegal attribute is: " + name + "=" + value);
  }

  // A scope null means the attribute is global.
  if (scope == null) {
    scope = net.user1.orbiter.Tokens.GLOBAL_ATTR;
  }

  this.method = net.user1.orbiter.UPC.SET_CLIENT_ATTR;
  this.args   = [clientID, userID, name, value, scope, options.toString()];
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.upc.SetClientAttr, net.user1.orbiter.upc.SetAttr);