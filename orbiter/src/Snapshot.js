//==============================================================================
// CLASS DECLARATION
//==============================================================================
/** @class

The Snapshot class dispatches the following events:

<ul class="summary">
<li class="fixedFont">{@link net.user1.orbiter.SnapshotEvent.LOAD}</li>
<li class="fixedFont">{@link net.user1.orbiter.SnapshotEvent.STATUS}</li>
</ul>

To register for events, use {@link net.user1.events.EventDispatcher#addEventListener}.

    @extends net.user1.events.EventDispatcher
*/
net.user1.orbiter.snapshot.Snapshot = function () {
  // Call superconstructor
  net.user1.events.EventDispatcher.call(this);
  this.method;
  this.args = new Array();
  this.hasStatus;
  this.statusReceived;
  this.loaded;
  this._updateInProgress;
  this._status;
  this.onLoad = function () {};
};

//==============================================================================    
// INHERITANCE
//============================================================================== 
net.user1.utils.extend(net.user1.orbiter.snapshot.Snapshot, net.user1.events.EventDispatcher);

//==============================================================================
// INSTANCE METHODS
//==============================================================================   
net.user1.orbiter.snapshot.Snapshot.prototype.updateInProgress = function () {
  return this._updateInProgress;
};
    
/**
 * @private
 */    
net.user1.orbiter.snapshot.Snapshot.prototype.setUpdateInProgress = function (value) {
  this._updateInProgress = value;
};
    
/**
 * @private
 */    
net.user1.orbiter.snapshot.Snapshot.prototype.dispatchLoaded = function () {
  this.dispatchEvent(new net.user1.orbiter.snapshot.SnapshotEvent(net.user1.orbiter.snapshot.SnapshotEvent.LOAD, this));
};
    
/**
 * @private
 */    
net.user1.orbiter.snapshot.Snapshot.prototype.dispatchStatus = function () {
  this.dispatchEvent(new net.user1.orbiter.snapshot.SnapshotEvent(net.user1.orbiter.snapshot.SnapshotEvent.STATUS, this));
};

net.user1.orbiter.snapshot.Snapshot.prototype.getStatus = function () {
  return this._status;
};

/**
 * @private
 */    
net.user1.orbiter.snapshot.Snapshot.prototype.setStatus = function (value) {
  this._status = value;
};
