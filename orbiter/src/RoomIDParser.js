//==============================================================================
// ROOM ID PARSING UTILITIES
//==============================================================================
/** @class */
net.user1.orbiter.RoomIDParser = new Object();

net.user1.orbiter.RoomIDParser.getSimpleRoomID = function (fullRoomID) {
  if (fullRoomID.indexOf(".") == -1) {
    return fullRoomID;
  } else {
    return fullRoomID.slice(fullRoomID.lastIndexOf(".")+1);
  }
};

net.user1.orbiter.RoomIDParser.getQualifier = function (fullRoomID) {
  if (fullRoomID.indexOf(".") == -1) {
    return "";
  } else {
    return fullRoomID.slice(0, fullRoomID.lastIndexOf("."));
  }
};

net.user1.orbiter.RoomIDParser.splitID = function (fullRoomID) {
  return [getQualifier(fullRoomID), getSimpleRoomID(fullRoomID)];
};