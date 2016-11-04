var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var connection_count = 0;
var numUsers = 0;

io.on('connection', function(socket){
  var addedUser = false;
  
  connection_count += 1
  console.log('user connected');
  console.log('Connections: ' + connection_count);

  socket.on('disconnect', function(){
    connection_count -= 1
    console.log('user disconnected');
    console.log('Connections: ' + connection_count);
  });

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

})


http.listen(3000, function(){
  var host = http.address().address
  var port = http.address().port
  console.log("Server listening at http://%s:%s", host, port);
})