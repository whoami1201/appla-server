var moment = require('moment');
var jwt = require("jsonwebtoken");
var Constants = require("./config/constants.js");

/**
 * Connect and handling event coming
 * @param server
 */
var ioEvents = function (io) {

    var numUsers = 0;

    var Message = require('./models/Message');
    var Room = require('./models/Room');

    var roomsIo = io.of('/rooms');
    var homeIo = io.of('/');

    /**
     * All the socket api route will be handled on connection
     */

    roomsIo.on('connection', function (socket) {
        var roomSlug = "";
        var userId = "";

        /**
         * JOIN ROOM
         * socket: rooms/join
         * data { roomSlug, userId }
         */
        socket.on('rooms/join', function (data) {
            userId = data.userId;
            roomSlug = data.roomSlug;

            Room.findOne({slug: data.roomSlug}, function (err, room) {
                if (err) throw err;
                if (!room) {
                    socket.emit('rooms/error', {error: "Room not found"});
                } else {
                    Room.addUser(room, userId, socket.id, function (err, newRoom) {
                        if (err) throw err;
                        socket.join(newRoom._id);
                        Room.getUsers(newRoom, userId, function (err, users, countUserInRoom) {
                            if (err) throw err;
                            socket.emit('rooms/joined', newRoom);
                            roomsIo.in(newRoom._id).emit('rooms/updateUserList', users);
                        })
                    })
                }
            });
        });

        /**
         * SEND MESSAGE
         * socket: messages/send
         * data: {message, userId}
         */

        socket.on('messages/send', function(data){
            Room.findOne({ slug: roomSlug }, function(err, room){
                if (err) throw err;
                if (room) {
                    var createMessage = {
                        message: data.message,
                        owner_info: {
                            owner_id: data.userId,
                            first_name: "",
                            last_name: ""
                        },
                        room_slug: room.slug,
                        created_at: moment().unix()
                    };
                    Message.create(createMessage, function(err, newMessage) {
                        if (err) throw err;
                        roomsIo.in(room._id).emit('messages/received', newMessage);
                    });
                }
            });

        });

        socket.on('disconnect', function () {
            Room.findOne({slug: roomSlug}, function (err, room) {
                if (err) throw err;
                if (!room) {
                    console.log("DISCONNECT: Room not found");
                } else {
                    Room.removeUser(room, socket.id, function (err, newRoom) {
                        if (err) throw err;
                        socket.leave(newRoom._id);
                        Room.getUsers(newRoom, userId, function(err, users, countUserInRoom) {
                            if (err) throw err;
                            roomsIo.in(newRoom._id).emit('rooms/updateUserList', users);
                        });
                    });
                }
            });
        })

    });

    homeIo.on('connection', function (socket) {
        var addedUser = false;

        /**
         * DISCONNECT
         */
        socket.on('disconnect', function () {
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
                        homeIo.sockets.emit('updateRoomList/added', result);
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
                        homeIo.sockets.emit('updateRoomList/deleted', result);
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


var init = function(app) {
    var server = require('http').Server(app);
    var io = require('socket.io')(server);
    io.set('transports', ['polling'] );

    ioEvents(io);

    return server;
};

module.exports = init;


