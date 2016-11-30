var messageModel   = require('../database').models.message;

var message = {
    create: function (data, callback) {
        var newRoom = new messageModel(data);
        newRoom.save(callback);
    },
    find: function (data, callback) {
        messageModel.find(data, callback);
    },
    findOne: function (data, callback) {
        messageModel.findById(data, callback);
    },
    findById: function (id, callback) {
        messageModel.findById(id, callback);
    },
    findByIdAndUpdate: function (id, data, callback) {
        messageModel.findByIdAndUpdate(id, data, {new: true}, callback);
    },
    findByRoomId: function(roomId, socket, callback){

    }
};

module.exports = message;