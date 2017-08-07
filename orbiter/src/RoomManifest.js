//==============================================================================
// CLASS DECLARATION
//==============================================================================
  /**
   * @private
   */  
net.user1.orbiter.RoomManifest = function () {
};
  
net.user1.orbiter.RoomManifest.prototype.deserialize = function (roomID,
                                                                 serializedAttributes,
                                                                 clientList,
                                                                 occupantCount,
                                                                 observerCount) {
  this.roomID = roomID;
  this.attributes = null;
  this.occupantCount = occupantCount;
  this.observerCount = observerCount;
  this.occupants = [];
  this.observers = [];
  
  this.deserializeAttributes(serializedAttributes);
  this.deserializeClientList(clientList);
};
        
/**
 * @private
 */        
net.user1.orbiter.RoomManifest.prototype.deserializeAttributes = function (serializedAttributes) {
  var attrList = serializedAttributes.split(net.user1.orbiter.Tokens.RS);
  this.attributes = new net.user1.orbiter.AttributeCollection();
  
  for (var i = attrList.length-2; i >= 0; i -=2) {
    this.attributes.setAttribute(attrList[i], attrList[i+1], net.user1.orbiter.Tokens.GLOBAL_ATTR);
  }
};
    
/**
 * @private
 */        
net.user1.orbiter.RoomManifest.prototype.deserializeClientList = function (clientList) {
  var clientManifest;
  
  for (var i = clientList.length-5; i >= 0; i -=5) {
    clientManifest = new net.user1.orbiter.ClientManifest();
    clientManifest.deserialize(clientList[i], clientList[i+1], null, null, clientList[i+3], [this.roomID, clientList[i+4]]);
    if (clientList[i+2] == "0") {
      this.occupants.push(clientManifest);
    } else {
      this.observers.push(clientManifest);
    }
  }
};