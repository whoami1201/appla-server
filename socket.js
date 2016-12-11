var io = require('socket.io');
var moment = require('moment');
var jwt = require("jsonwebtoken");
var Constants = require("./config/constants.js");

/**
 * Connect and handling event coming
 * @param server
 */
exports.connect = function (server) {
    io = io.listen(server, {});

    var numUsers = 0;

    var Message = require('./models/Message');
    var Room = require('./models/Room');

    /**
     * All the socket api route will be handled on connection
     */

    io.on('connection', function (socket) {
        numUsers++;
        console.log(numUsers);
        console.log(socket.id);
        var addedUser = false;

        /**
         * DISCONNECT
         */
        socket.on('disconnect', function () {
            numUsers--;
            console.log("A user has logged out");
        });


        /**
         * CREATE ROOM
         * socket: rooms/add
         */
        socket.on('rooms/add', function (data) {
            var decoded = helpers.authorizeToken(data.token);
            if (decoded != false) {
                var room = {
                    room_name: data.room.roomName,
                    description: data.room.description,
                    owner_id: decoded.userId,
                    created_at: moment().unix()
                };

                Room.create(room, function (err, result) {
                    if (err) {
                        io.to(socket.id).emit('rooms/error', err);
                    }
                    else {
                        console.log("EMIT");
                        io.to(socket.id).emit('rooms/added');
                        io.emit('updateRoomList/added', result);
                    }
                });

            }
        });

        /**
         * DELETE ROOM
         * socket: rooms/delete
         */
        socket.on('rooms/delete', function(data){
            var decoded = helpers.authorizeToken(data.token);
            if (decoded != false) {

                Room.findByIdAndUpdate(data.roomId, {
                    $set: { sync_deleted: moment().unix() }
                }, function (err, result) {
                    if (err) {
                        io.to(socket.id).emit('rooms/error', err);
                    }
                    else {
                        io.to(socket.id).emit('rooms/deleted');
                        io.emit('updateRoomList/deleted', result);
                    }
                });

            }
        });




        /**
         * NEW CHAT MESSAGE
         */

        // TODO: Split chat message to rooms
        socket.on('chat message', function (msg) {
            var newMessage = new Message({
                username: socket.username,
                message: msg
            });
            newMessage.save(function (err) {
                if (err) throw err;
                io.emit('chat message', {
                    message: msg,
                    username: socket.username
                });
            })
        });


        /**
         * NEW USER LOG IN
         */
        // TODO: Only show notification in rooms
        socket.on('add user', function (username) {
            if (addedUser) return;

            // we store the username in the socket session for this client
            if (username != "")
                socket.username = username;
            else
                socket.username = 'annonymous';
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

var helpers = {
    authorizeToken: function(token){
        var decoded = false;
        try {
            decoded = jwt.verify(token, Constants.secret);
        } catch (err) {
            console.log(err);
        }
        return decoded;
    }
};


