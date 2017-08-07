/**
 * @private
 */  
net.user1.orbiter.upc.SetRoomAttr = function (name, 
                                              value, 
                                              options,
                                              roomID) {
  // Call superconstructor
  net.user1.orbiter.upc.SetAttr.call(this, name, value, options);
      
  this.method = net.user1.orbiter.UPC.SET_ROOM_ATTR;
  this.args   = [roomID, name, value, options.toString()];
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.upc.SetRoomAttr, net.user1.orbiter.upc.SetAttr);