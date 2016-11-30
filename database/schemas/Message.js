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

module.exports = mongoose.model('Message', MessageSchema);