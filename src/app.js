
var ctx;
var canvas;
var color ;
var size = 1; // default size
var defaultLineThickness = 1;
var maxLineThickness = 30;
var roomID = document.getElementById("RoomID").value;
// Triggered when an option in the "line color" menu is selected
function colorSelectListener (colorSelected) {
  // Determine which option was selected
  color = colorSelected;
}
function thicknessSelectListener (e) {
  // Determine which option was selected
  var newThickness = this.options[this.selectedIndex].value;
  // Locally, set the line thickness to the selected value
  size = getValidThickness(newThickness);
 }
//==============================================================================
// DATA VALIDATION
//==============================================================================
function getValidThickness (value) {
  value = parseInt(value);
  var thickness = isNaN(value) ? defaultLineThickness : value;
  return Math.max(1, Math.min(thickness, maxLineThickness));
}

function roomSelectListener(roomIdSelected){
        
        roomID = roomIdSelected;
        console.log("my room id is " + roomID);
               
        //call function() again 
        
        document.getElementById('RoomID').value = roomID; //set roomId = new roomID

        document.forms['formJoin'].submit();
        document.getElementById('join').style.display = 'none';

}
(function() {
	/* Canvas */

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	canvas.width = Math.min(document.documentElement.clientWidth, window.innerWidth || 300);
	canvas.height = Math.min(document.documentElement.clientHeight, window.innerHeight || 300);
	 
	document.getElementById("thickness").onchange = thicknessSelectListener;

	ctx.strokeStyle = color;
	ctx.lineWidth = '3';
	ctx.lineCap = ctx.lineJoin = 'round';

	/* Mouse and touch events */
	
	
	var isTouchSupported = 'ontouchstart' in window;
	var isPointerSupported = navigator.pointerEnabled;
	var isMSPointerSupported =  navigator.msPointerEnabled;
	
	var downEvent = isTouchSupported ? 'touchstart' : (isPointerSupported ? 'pointerdown' : (isMSPointerSupported ? 'MSPointerDown' : 'mousedown'));
	var moveEvent = isTouchSupported ? 'touchmove' : (isPointerSupported ? 'pointermove' : (isMSPointerSupported ? 'MSPointerMove' : 'mousemove'));
	var upEvent = isTouchSupported ? 'touchend' : (isPointerSupported ? 'pointerup' : (isMSPointerSupported ? 'MSPointerUp' : 'mouseup'));
	 	  
	canvas.addEventListener(downEvent, startDraw, false);
	canvas.addEventListener(moveEvent, draw, false);
	canvas.addEventListener(upEvent, endDraw, false);

	/* PubNub */

	var channel =  RoomID;
	document.getElementById('RoomID').onchange = roomSelectListener;


	var pubnub = PUBNUB.init({
		publish_key     :  "pub-c-f32be598-97ac-484b-a2ee-1ea621f2093e",
		subscribe_key   :  "sub-c-893d6b7c-795d-11e7-a29a-02ee2ddab7fe",
		leave_on_unload : true,
		ssl		: document.location.protocol === "https://onlinewhiteboard.herokuapp.com"
	});



	pubnub.subscribe({
		channel: channel,
		callback: drawFromStream,
		presence: function(m){
			if(m.occupancy > 1){
				document.getElementById('unit').textContent = 'Users';
			}
   			document.getElementById('occupancy').textContent = m.occupancy;

   			var p = document.getElementById('occupancy').parentNode;
   			p.classList.add('anim');
   			p.addEventListener('transitionend', function(){p.classList.remove('anim');}, false);
   		}
	});

	function publish(data) {
		pubnub.publish({
			channel: channel,
			message: data
		});
     }

    /* Draw on canvas */

    function drawOnCanvas(color, size, plots) {
    	ctx.strokeStyle = color;
    	ctx.lineWidth = size;
		ctx.beginPath();
		ctx.moveTo(plots[0].x, plots[0].y);

    	for(var i=1; i<plots.length; i++) {
	    	ctx.lineTo(plots[i].x, plots[i].y);
	    }
	    ctx.stroke();
    }

    function drawFromStream(message) {
		if(!message || message.plots.length < 1) return;
		drawOnCanvas(message.color, message.size, message.plots);
    }
    
    // Get Older and Past Drawings!
    if(drawHistory) {
	    pubnub.history({
	    	channel  : channel,
	    	count    : 50,
	    	callback : function(messages) {
	    		pubnub.each( messages[0], drawFromStream );
	    	}
	    });
	}
    var isActive = false;
    var plots = [];

	function draw(e) {
		e.preventDefault(); // prevent continuous touch event process e.g. scrolling!
	  	if(!isActive) return;

    	var x = isTouchSupported ? (e.targetTouches[0].pageX - canvas.offsetLeft) : (e.offsetX || e.layerX - canvas.offsetLeft);
    	var y = isTouchSupported ? (e.targetTouches[0].pageY - canvas.offsetTop) : (e.offsetY || e.layerY - canvas.offsetTop);

    	plots.push({x: (x << 0), y: (y << 0)}); // round numbers for touch screens

    	drawOnCanvas(color, size, plots);
	}
	
	function startDraw(e) {
	  	e.preventDefault();
	  	isActive = true;
	}
	
	function endDraw(e) {
	  	e.preventDefault();
	  	isActive = false;
	  
	  	publish({
	  		color: color,
	  		size: size,
	  		plots: plots
	  	});

	  	plots = [];
	}
})();
function clearCanvas(){
	console.log("clear");
  // Store the current transformation matrix
  ctx.save();
  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Restore the transform
  ctx.restore();
}
