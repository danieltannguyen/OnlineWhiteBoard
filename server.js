var express =require('express');
var app = express();

//set port
var port = process.env.PORT || 5000;
(function() {
  var io;
  io = require('socket.io').listen(4000);
  io.sockets.on('connection', function(socket) {
    socket.on('drawClick', function(data) {
      socket.broadcast.emit('draw', {
        x: data.x,
        y: data.y,
        type: data.type
      });
    });
  });
}).call(this);

app.use(express.static(__dirname));

app.get("/", function (req,res) {
	res.render("index");
});

app.listen(port, function() {
	console.log("app is running on port 5000!")
})