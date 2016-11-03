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
  console.log('Connections: ' + connection_count);

  socket.on('disconnect', function(){
    connection_count -= 1
    console.log('user disconnected');
    onsole.log('Connections: ' + connection_count);
  });

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

})


http.listen(3000, function(){
  var host = http.address().address
  var port = http.address().port
  console.log("Server listening at http://%s:%s", host, port);
})