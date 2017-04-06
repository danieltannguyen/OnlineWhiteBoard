//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class */
net.user1.orbiter.VersionNumber = function (major, minor, revision, build) {
  this.major    = major;
  this.minor    = minor;
  this.revision = revision;
  this.build    = build == undefined ? -1 : build;
};

//==============================================================================
// INSTANCE METHODS
//==============================================================================  
net.user1.orbiter.VersionNumber.prototype.fromVersionString = function (value) {
  var upcVersionParts = value.split(".");      
  this.major    = upcVersionParts[0];
  this.minor    = upcVersionParts[1];
  this.revision = upcVersionParts[2];
  this.build    = upcVersionParts.length == 4 ? upcVersionParts[4] : -1;
}

net.user1.orbiter.VersionNumber.prototype.toStringVerbose = function () {
  var versionString = this.major + "." + this.minor + "." + this.revision
            + ((this.build == -1) ? "" : " (Build " + this.build + ")");
  return versionString;
}
    
net.user1.orbiter.VersionNumber.prototype.toString = function () {
  var versionString = this.major + "." + this.minor + "." + this.revision
            + ((this.build == -1) ? "" : "." + this.build);
  return versionString;
}
