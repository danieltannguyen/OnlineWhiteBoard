//==============================================================================
// CLASS DECLARATION
//==============================================================================
net.user1.orbiter.ClientManifest = function () {
  this.clientID = null;
  this.userID = null;
  this.persistentAttributes = new net.user1.orbiter.AttributeCollection();
  this.transientAttributes = new net.user1.orbiter.AttributeCollection();
  this.occupiedRoomIDs = null;
  this.observedRoomIDs = null;
};

/**
 * @private
 */        
net.user1.orbiter.ClientManifest.prototype.deserialize = function (clientID,
                                                                   userID,
                                                                   serializedOccupiedRoomIDs,
                                                                   serializedObservedRoomIDs,
                                                                   globalAttrs,
                                                                   roomAttrs) {
  this.clientID = clientID == "" ? null : clientID;
  this.userID   = userID == "" ? null : userID;
  
  // Room ids
  this.deserializeOccupiedRoomIDs(serializedOccupiedRoomIDs);
  this.deserializeObservedRoomIDs(serializedObservedRoomIDs);
  
  // Global attrs
  this.deserializeAttributesByScope(net.user1.orbiter.Tokens.GLOBAL_ATTR, globalAttrs);
  
  // Room attrs
  for (var i = 0; i < roomAttrs.length; i += 2) {
    this.deserializeAttributesByScope(roomAttrs[i], roomAttrs[i+1]);
  }
};
    
/**
 * @private
 */        
net.user1.orbiter.ClientManifest.prototype.deserializeOccupiedRoomIDs = function (roomIDs) {
  // No rooms included in the manifest
  if (roomIDs == null) {
    return;
  }
  // Client is in no rooms
  if (roomIDs == "") {
    this.occupiedRoomIDs = [];
    return;
  }
  // Client is in one or more room
  this.occupiedRoomIDs = roomIDs.split(net.user1.orbiter.Tokens.RS);
};
    
/**
 * @private
 */        
net.user1.orbiter.ClientManifest.prototype.deserializeObservedRoomIDs = function (roomIDs) {
  if (roomIDs == null) {
    return;
  }
  if (roomIDs == "") {
    this.observedRoomIDs = [];
    return;
  }
  this.observedRoomIDs = roomIDs.split(net.user1.orbiter.Tokens.RS);
};
     
/**
 * @private
 */         
net.user1.orbiter.ClientManifest.prototype.deserializeAttributesByScope = function (scope,
                                                                                    serializedAttributes) {
  var attrList;
  if (serializedAttributes == null || serializedAttributes == "") {
    return;
  }
  attrList = serializedAttributes.split(net.user1.orbiter.Tokens.RS);
  for (var i = attrList.length-3; i >= 0; i -=3) {
    if (parseInt(attrList[i+2]) & net.user1.orbiter.AttributeOptions.FLAG_PERSISTENT) {
      // Persistent
      this.persistentAttributes.setAttribute(attrList[i], attrList[i+1], scope);
    } else {
      // Non-persistent
      this.transientAttributes.setAttribute(attrList[i], attrList[i+1], scope);
    }
  }
};