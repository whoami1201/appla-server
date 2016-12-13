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

    io.of('/rooms').on('connection', function (socket) {
        var roomSlug = "";
        console.log("Connected room " + socket.id);

        /**
         * JOIN ROOM
         * socket: rooms/join
         * data { roomSlug, userId }
         */
        socket.on('rooms/join', function (data) {
            var userId = data.userId;
            roomSlug = data.roomSlug;
            console.log("HELLO ROOM JOIN");
            console.log(data);


            Room.findOne({slug: data.roomSlug}, function (err, room) {
                if (err) throw err;
                if (!room) {
                    socket.emit('rooms/error', {error: "Room not found"});
                } else {
                    Room.addUser(room, userId, socket.id, function (err, newRoom) {
                        if (err) throw err;
                        socket.join(newRoom.id);
                        Room.getUsers(newRoom, userId, function (err, users, countUserInRoom) {
                            if (err) throw err;
                            socket.in(newRoom.id).emit('rooms/updateUserList', users);
                        })
                    })
                }
            });

        });

        socket.on('disconnect', function () {
            Room.findOne({slug: roomSlug}, function (err, room) {
                if (err) throw err;
                if (!room) {
                    console.log("Room not found");
                } else {
                    Room.removeUser(room, socket.id, function (err, room) {
                        socket.in(room.id).emit('rooms/updateUserList', room);
                    });
                }
            });

            console.log("Disconnected from room");
        })

    });

    io.of('/').on('connection', function (socket) {
        console.log("Connected");
        var addedUser = false;

        /**
         * DISCONNECT
         */
        socket.on('disconnect', function () {
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
                        socket.emit('rooms/error', err);
                    }
                    else {
                        socket.emit('rooms/added');
                        io.sockets.emit('updateRoomList/added', result);
                    }
                });

            }
        });

        /**
         * DELETE ROOM
         * socket: rooms/delete
         */
        socket.on('rooms/delete', function (data) {
            var decoded = helpers.authorizeToken(data.token);
            if (decoded != false) {

                Room.findByIdAndUpdate(data.roomId, {
                    $set: {sync_deleted: moment().unix()}
                }, function (err, result) {
                    if (err) {
                        socket.emit('rooms/error', err);
                    }
                    else {
                        socket.emit('rooms/deleted');
                        io.sockets.emit('updateRoomList/deleted', result);
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
    authorizeToken: function (token) {
        var decoded = false;
        try {
            decoded = jwt.verify(token, Constants.secret);
        } catch (err) {
            console.log(err);
        }
        return decoded;
    }
};


