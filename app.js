var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require ('./db.js');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var messages = require('./routes/messages');

// load mongoose package
var mongoose = require('mongoose');

// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect('mongodb://localhost/appla')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.use('/', routes);
app.use('/api/v0/messages', messages);

var connection_count = 0;
var numUsers = 0;
var Message = require('./models/Message.js');

io.on('connection', function(socket){
  var addedUser = false;

  socket.on('disconnect', function(){
    numUsers--;
  });

  socket.on('chat message', function(msg) {
    var newMessage = new Message({
      username: socket.username,
      message: msg
    });
    newMessage.save(function(err){
      if (err) throw err;
      io.emit('chat message', {
        message: msg,
        username: socket.username
      });
    })
  });

  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    if (username!="")
      socket.username = username;
    else 
      socket.username = 'annonymous'
    numUsers++;
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

module.exports = app;

