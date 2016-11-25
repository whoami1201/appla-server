var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var slugify = require('lackey-mongoose-slugify');

var RoomSchema = new mongoose.Schema({
    room_name: {
        type: String,
        required: true,
        unique: true
    },
    owner_id: Schema.Types.ObjectId,
    users: [Schema.Types.ObjectId],
    description: {
        type: String,
        default: ""
    },
    slug: String,
    created_at: {type: Number, default: moment().unix() }
});

RoomSchema.plugin(slugify, {
    source: "room_name",
    logger: false
});

/**
 * getRoomWithMessages
 * @param params: {roomSlug}
 * @param callback
 */

RoomSchema.statics.getRoomWithMessages = function(roomSlug, cb) {
    var Message = this.db.model('Message');
    this.findOne({
        slug: roomSlug
    }, function(err, room){
      if (err)
          return cb(err);
      if (!room) {
          return cb("ROOM_NOT_FOUND");
      } else {
          Message.find({
              room_id: room._id
          }, function(err, messages){
              if (err) return cb(err);
              return cb(null, {
                  room_details: room,
                  messages: messages
              });
          });


      }
    })
};

module.exports = mongoose.model('Room', RoomSchema);