net.user1.utils.ArrayUtil.combine = function () {
  var source = arguments.length == 1 ? arguments[0] : arguments;
  var master = [];
  
  var array;
  var element;
  for (var i = 0; i < source.length; i++) {
    array = source[i];
    if (net.user1.utils.ArrayUtil.isArray(array)) {
      for (var j = 0; j < array.length; j++) {
        element = array[j];
        if (net.user1.utils.ArrayUtil.indexOf(master, element) == -1) {
          master.push(element);
        }
      }
    }
  }
  return master;
};