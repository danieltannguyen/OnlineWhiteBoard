//==============================================================================
// A COLLECTION OF ARRAY UTILITIES
//==============================================================================
/** @class */
net.user1.utils.ArrayUtil = new Object();

net.user1.utils.ArrayUtil.indexOf = function (arr, obj) {
  if (arr.indexOf ) {
    return arr.indexOf(obj);
  }

  for (var i = arr.length; --i >= 0; ) {
    if (arr[i] === obj) {
      return i;
    }
  }
  
  return -1;
};

net.user1.utils.ArrayUtil.remove = function (array, item) {
  var itemIndex;
  
  if (item == null) {
    return false;
  } else {
    itemIndex = net.user1.utils.ArrayUtil.indexOf(array, item);
    if (itemIndex == -1) {
      return false;
    } else {
      array.splice(itemIndex, 1);
      return true;
    }
  }
};

net.user1.utils.ArrayUtil.isArray = function (value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};
