var io = require('socket.io');

/**
 * Connect and handling event coming
 * @param server
 */
exports.connect = function(server){
    io = io.listen(server, {});

    var connection_count = 0;
    var numUsers = 0;

    var Message = require('./models/Message.js');

    /**
     * All the socket api route will be handled on connection
     */

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

};


