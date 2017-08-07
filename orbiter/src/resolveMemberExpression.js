/** @function */
net.user1.utils.resolveMemberExpression = function (value) {
  var parts = value.split(".");
  var reference = globalObject;
  for (var i = 0; i < parts.length; i++) {
    reference = reference[parts[i]];
  }
  return reference;
};