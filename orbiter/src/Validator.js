//==============================================================================
// VALIDATION UTILITIES
//==============================================================================
net.user1.orbiter.Validator = new Object();

net.user1.orbiter.Validator.isValidRoomID = function (value) {
  // Can't be null, nor the empty string
  if (value == null || value == "") {
    return false;
  }
  // Can't contain "."
  if (value.indexOf(".") != -1) {
    return false;
  }
  // Can't contain RS
  if (value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
  // Can't contain WILDCARD
  if (value.indexOf(net.user1.orbiter.Tokens.WILDCARD) != -1) {
    return false;
  }
  
  return true;
};

net.user1.orbiter.Validator.isValidRoomQualifier = function (value) {
  if (value == null || value == "") {
    return false;
  }
  // "*" is valid (it means the unnamed qualifier)
  if (value == "*") {
    return true;
  }
  
  // Can't contain RS
  if (value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
  // Can't contain WILDCARD
  if (value.indexOf(net.user1.orbiter.Tokens.WILDCARD) != -1) {
    return false;
  }
  
  return true;
};

net.user1.orbiter.Validator.isValidResolvedRoomID = function (value) {
  // Can't be null, nor the empty string
  if (value == null || value == "") {
    return false;
  }
  
  // Can't contain RS
  if (value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
  // Can't contain WILDCARD
  if (value.indexOf(net.user1.orbiter.Tokens.WILDCARD) != -1) {
    return false;
  }
  
  return true;
};

net.user1.orbiter.Validator.isValidAttributeName = function (value) {
  // Can't be empty 
  if (value == "" || value == null) {
    return false;
  }
  
  // Can't contain RS
  if (value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
        
  return true;
};

net.user1.orbiter.Validator.isValidAttributeValue = function (value) {
  // Can't contain RS
  if (typeof value != "string") {
    // Non-string attribute values are coerced to strings at send time
    value = value.toString();
  }
  if (value.indexOf(net.user1.orbiter.Tokens.RS) == -1) {
    return true;
  } else {
    return false;
  }
};

net.user1.orbiter.Validator.isValidAttributeScope = function (value) {
  // Can't contain RS
  if (value != null) {
    return this.isValidResolvedRoomID(value);
  } else {
    return true;
  }
};

net.user1.orbiter.Validator.isValidModuleName = function (value) {
  // Can't be empty (can be null)
  if (value == "") {
    return false;
  }
  
  // Can't contain RS
  if (value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
  
  return true;
};

net.user1.orbiter.Validator.isValidPassword = function (value) {
  // Can't contain RS
  if (value != null && value.indexOf(net.user1.orbiter.Tokens.RS) != -1) {
    return false;
  }
  
  return true;
};
