/**
 * @private
 */  
net.user1.orbiter.upc.RemoveRoomAttr = function (roomID, name) { 
  // Abort if name is invalid.
  if (!net.user1.orbiter.Validator.isValidAttributeName(name)) {
    throw new Error("Cannot delete attribute. Illegal name" + 
                    " (see Validator.isValidAttributeName()): " + name);
  }
  
  this.method = net.user1.orbiter.UPC.REMOVE_ROOM_ATTR;
  this.args   = [roomID, name];
};