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
    connections: [{
        user_id: Schema.Types.ObjectId,
        socket_id: String
    }],
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

module.exports = mongoose.model('Room', RoomSchema);