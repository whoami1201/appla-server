var moment = require('moment');
var jwt = require("jsonwebtoken");
var Constants = require("./config/constants.js");

/**
 * Connect and handling event coming
 * @param server
 */
var ioEvents = function (io) {

    var numUsers = 0;

    var Message = require('./models/Message.js');
    var Room = require('./models/Room.js');
    var User = require('./models/User.js');

    var roomsIo = io.of('/rooms');
    var homeIo = io.of('/');

    /**
     * All the socket api route will be handled on connection
     */

    roomsIo.on('connection', function (socket) {
        var roomSlug = "";
        var userId = "";
        var roomId = "";
        var user;
        var token = socket.handshake.query.token || "";
        var decoded = helpers.authorizeToken(token);
        if (decoded!=false){
            userId = decoded.userId;
            User.findById(userId, function(err, newUser) {
                user = newUser;
            });
        }
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
                        roomId = newRoom._id;
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


        socket.on('messages/send/incomplete', function (data) {
            var message = {
                messageId: data.messageId,
                message: data.message,
                owner_info: {
                    owner_id: userId,
                    first_name: user.first_name,
                    last_name: user.last_name
                },
                room_slug: roomSlug,
                created_at: moment().unix()
            };
            console.log("incomplete");
            console.log(data);
            console.log("roomId" + roomId);
            roomsIo.in(roomId).emit('messages/received', message);
        });

        socket.on('messages/send/complete', function (data) {
            var createMessage = {
                messageId: data.messageId,
                message: data.message,
                owner_info: {
                    owner_id: userId,
                    first_name: user.first_name,
                    last_name: user.last_name
                },
                room_slug: roomSlug,
                created_at: moment().unix()
            };
            Message.create(createMessage, function(err, newMessage) {
                if (err) throw err;
            });
            console.log("completed");
            console.log(createMessage);
            roomsIo.in(roomId).emit('messages/received', createMessage);
        });

        socket.on('disconnect', function () {
            console.log("DISCONNECTED!");
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

        var token = socket.handshake.query.token || "";
        var decoded = helpers.authorizeToken(token);
        var user;
        if (decoded!=false){
            var userId = decoded.userId;
            User.findById(userId, function(err, newUser) {
                user = newUser;
            });
            socket.join(userId);
        }

        /**
         * DISCONNECT
         */
        socket.on('disconnect', function () {
            socket.leave(userId);
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
                        homeIo.emit('updateRoomList/added', result);
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
                        homeIo.emit('updateRoomList/deleted', result);
                    }
                });

            }
        });

        socket.on('messages/send/incomplete', function (data) {
            var message = {
                messageId: data.messageId,
                message: data.message,
                owner_info: {
                    owner_id: userId,
                    first_name: user.first_name,
                    last_name: user.last_name
                },
                room_slug: 'home' + userId,
                created_at: moment().unix()
            };
            homeIo.in(userId).emit('messages/received', message);
        });

        socket.on('messages/send/complete', function (data) {
            if (decoded!= false) {
                var createMessage = {
                    messageId: data.messageId,
                    message: data.message,
                    owner_info: {
                        owner_id: userId,
                        first_name: user.first_name,
                        last_name: user.last_name
                    },
                    room_slug: 'home' + userId,
                    created_at: moment().unix()
                };
                Message.create(createMessage, function(err, newMessage) {
                    if (err) throw err;
                });
                homeIo.in(userId).emit('messages/received', createMessage);
            }
        });

    })

};

var helpers = {
    authorizeToken: function (token) {
        var decoded = false;
        if (token!="") {
            try {
                decoded = jwt.verify(token, Constants.secret);
            } catch (err) {
                console.log(err);
            }
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


