/** @function */
net.user1.utils.extend = function (subclass, superclass) {
  function superclassConstructor () {};
  superclassConstructor.prototype = superclass.prototype;
  subclass.superclass = superclass.prototype;
  subclass.prototype = new superclassConstructor();
  subclass.prototype.constructor = subclass;
};