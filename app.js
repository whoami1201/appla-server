var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var connection_count = 0

io.on('connection', function(socket){
  connection_count += 1
  console.log('user connected');
  socket.on('disconnect', function(){
    connection_count -= 1
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  console.log('Connections: ' + connection_count);
})


http.listen(process.env.PORT, function(){
  console.log("Server listening...");
})