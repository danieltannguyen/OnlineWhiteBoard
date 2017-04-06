//==============================================================================
// CLASS DECLARATION
//==============================================================================
net.user1.orbiter.UpdateLevels = function () {
  this.restoreDefaults();
};

//==============================================================================    
// STATIC VARIABLES
//==============================================================================
net.user1.orbiter.UpdateLevels.FLAG_ROOM_MESSAGES     = 1;
net.user1.orbiter.UpdateLevels.FLAG_SHARED_ROOM_ATTRIBUTES = 1 << 1;
net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_COUNT = 1 << 2;
net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_COUNT = 1 << 3;
net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LIST = 1 << 4;
net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LIST = 1 << 5;
net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_ROOM = 1 << 6;
net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_ROOM = 1 << 7;
net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_GLOBAL = 1 << 8;
net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_GLOBAL = 1 << 9;
net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LOGIN_LOGOFF = 1 << 10;
net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LOGIN_LOGOFF = 1 << 11;
net.user1.orbiter.UpdateLevels.FLAG_ALL_ROOM_ATTRIBUTES = 1 << 12;

//==============================================================================    
// INSTANCE METHODS
//==============================================================================
net.user1.orbiter.UpdateLevels.prototype.clearAll = function () {
  this.roomMessages = false;
  this.sharedRoomAttributes = false;
  this.occupantCount = false;
  this.observerCount = false;
  this.occupantList = false;
  this.observerList = false;
  this.sharedOccupantAttributesRoom = false;
  this.sharedOccupantAttributesGlobal = false;
  this.sharedObserverAttributesRoom = false;
  this.sharedObserverAttributesGlobal = false;
  this.occupantLoginLogoff = false;
  this.observerLoginLogoff = false;
  this.allRoomAttributes = false;
};

net.user1.orbiter.UpdateLevels.prototype.restoreDefaults = function () {
  this.roomMessages = true;
  this.sharedRoomAttributes = true;
  this.occupantCount = false;
  this.observerCount = false;
  this.occupantList = true;
  this.observerList = false;
  this.sharedOccupantAttributesRoom = true;
  this.sharedOccupantAttributesGlobal = true;
  this.sharedObserverAttributesRoom = false;
  this.sharedObserverAttributesGlobal = false;
  this.occupantLoginLogoff = true;
  this.observerLoginLogoff = false;
  this.allRoomAttributes = false;
};
    
net.user1.orbiter.UpdateLevels.prototype.toInt = function () {
  var levels = (this.roomMessages ? net.user1.orbiter.UpdateLevels.FLAG_ROOM_MESSAGES : 0)
   | (this.sharedRoomAttributes ? net.user1.orbiter.UpdateLevels.FLAG_SHARED_ROOM_ATTRIBUTES : 0)
   | (this.occupantCount ? net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_COUNT : 0)
   | (this.observerCount ? net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_COUNT : 0)
   | (this.occupantList ? net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LIST : 0)
   | (this.observerList ? net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LIST : 0)
   | (this.sharedOccupantAttributesRoom ? net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_ROOM : 0)
   | (this.sharedOccupantAttributesGlobal ? net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_GLOBAL : 0)
   | (this.sharedObserverAttributesRoom ? net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_ROOM : 0)
   | (this.sharedObserverAttributesGlobal ? net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_GLOBAL : 0)
   | (this.occupantLoginLogoff ? net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LOGIN_LOGOFF : 0)
   | (this.observerLoginLogoff ? net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LOGIN_LOGOFF : 0)
   | (this.allRoomAttributes ? net.user1.orbiter.UpdateLevels.FLAG_ALL_ROOM_ATTRIBUTES : 0);
  
  return levels;
};
    
net.user1.orbiter.UpdateLevels.prototype.fromInt = function (levels) {
  roomMessages                   = levels & net.user1.orbiter.UpdateLevels.FLAG_ROOM_MESSAGES;
  sharedRoomAttributes           = levels & net.user1.orbiter.UpdateLevels.FLAG_SHARED_ROOM_ATTRIBUTES;
  occupantCount                  = levels & net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_COUNT;
  observerCount                  = levels & net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_COUNT;
  occupantList                   = levels & net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LIST;
  observerList                   = levels & net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LIST;
  sharedOccupantAttributesRoom   = levels & net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_ROOM;
  sharedOccupantAttributesGlobal = levels & net.user1.orbiter.UpdateLevels.FLAG_SHARED_OCCUPANT_ATTRIBUTES_GLOBAL;
  sharedObserverAttributesRoom   = levels & net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_ROOM;
  sharedObserverAttributesGlobal = levels & net.user1.orbiter.UpdateLevels.FLAG_SHARED_OBSERVER_ATTRIBUTES_GLOBAL;
  occupantLoginLogoff            = levels & net.user1.orbiter.UpdateLevels.FLAG_OCCUPANT_LOGIN_LOGOFF;
  observerLoginLogoff            = levels & net.user1.orbiter.UpdateLevels.FLAG_OBSERVER_LOGIN_LOGOFF;
  allRoomAttributes              = levels & net.user1.orbiter.UpdateLevels.FLAG_ALL_ROOM_ATTRIBUTES;
};