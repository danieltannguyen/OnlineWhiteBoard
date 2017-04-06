//==============================================================================
// A COLLECTION OF OBJECT UTILITIES
//==============================================================================
/** @class */
net.user1.utils.ObjectUtil = new Object();

net.user1.utils.ObjectUtil.combine = function () {
  var source = arguments.length == 1 ? arguments[0] : arguments;
  var master = new Object();
  
  var object;
  for (var i = 0; i < source.length; i++) {
    object = source[i];
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        master[key] = object[key];
      }
    }
  }
  return master;
};

net.user1.utils.ObjectUtil.length = function (object) {
  var len = 0;
  for (var p in object) {
    len++;
  } 
  return len;
};

