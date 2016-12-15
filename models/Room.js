var roomModel   = require('../database').models.room;
var User 		= require('../models/user');

var room = {
    create: function (data, callback){
        var newRoom = new roomModel(data);
        newRoom.save(callback);
    },
    find: function(data, callback){
        roomModel.find(data, callback);
    },
    findOne: function(data, callback){
        roomModel.findOne(data, callback);
    },
    findById: function(id, callback){
        roomModel.findById(id, callback);
    },
    findByIdAndUpdate: function(id, data, callback){
        roomModel.findByIdAndUpdate(id, data, { new: true }, callback);
    },

    /**
     * Add a user along with the corresponding socket to the passed room
     *
     */
    addUser: function(room, userId, socketId, callback){
        // Push a new connection object(i.e. {userId + socketId})
        var conn = { userId: userId, socketId: socketId};
        room.connections.push(conn);
        room.save(callback);
    },

    /**
     * Get all users in a room
     *
     */
    getUsers: function(room, userId, callback){

        var users = [], vis = {}, count = 0;

        // Loop on room's connections, Then:
        room.connections.forEach(function(conn){
            // 1. Count the number of connections of the current user(using one or more sockets) to the passed room.
            if(conn.userId === userId){
                count++;
            }

            // 2. Create an array(i.e. users) contains unique users' ids
            if(!vis[conn.userId]){
                users.push(conn.userId);
            }
            vis[conn.userId] = true;
        });

        // Loop on each user id, Then:
        // Get the user object by id, and assign it to users array.
        // So, users array will hold users' objects instead of ids.
        users.forEach(function(userId, i){
            User.findById(userId, function(err, user){
                if (err) { return callback(err); }
                user.password = "";
                users[i] = user;
                if(i + 1 === users.length){
                    return callback(null, users, count);
                }
            });
        });
    },

    /**
     * Remove a user along with the corresponding socket from a room
     *
     */
    removeUser: function(room, socketId, callback){
        var pass = true, target = 0;
        room.connections.forEach(function(conn, i){
            if(conn.socketId === socketId){
                pass = false;
                target = i;
            }
        });

        if(!pass) {
            room.connections.id(room.connections[target]._id).remove();
            room.save(function(err){
                callback(err, room);
            });
        }
        return pass;
    }
};


module.exports = room;