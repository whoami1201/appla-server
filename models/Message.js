var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var MessageSchema = new mongoose.Schema({
    owner_id: Schema.Types.ObjectId,
    room_id: String,
    username: String,
    message: String,
    created_at: {type: Number, default: moment().unix() }
});

/**
 * addMessageToRoom
 * @param params: {userId, roomSlug, message}
 * @param callback
 */

MessageSchema.statics.addMessageToRoom = function(userId, roomSlug, message, cb) {
    var Room = this.db.model('Room');
    var User = this.db.model('User');
    var Message = this.db.model('Message');

    Room.findOne({
      slug: roomSlug,
      users: userId
    }, function(err, room) {
        if (err) return cb(err);
        if (!room) {
            cb("ROOM_NOT_FOUND_OR_NOT_ACCESSIBLE");
        } else {
            User.findById(userId, function(err, user) {
                if (err) return cb(err);
                if (!user) {
                    return cb("USER_NOT_FOUND");
                } else {
                    msg = new Message({
                        owner_id: userId,
                        room_id: room._id,
                        username: user.username,
                        message: message,
                        created_at: moment().unix()
                    });
                    mongoose.Model.create.call(Message, msg);
                    return cb(null, msg);
                }
            });
        }
    })
};

module.exports = mongoose.model('Message', MessageSchema);