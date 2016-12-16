var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var MessageSchema = new mongoose.Schema({
    room_slug: String,
    message: { type: String, required: true },
    owner_info: { type: {
        owner_id: Schema.Types.ObjectId,
        first_name: String,
        last_name: String
    }},
    created_at: {type: Number, default: moment().unix() }
});

MessageSchema.pre('save', function(next){
    var message = this;
    var User = mongoose.model('User');
    User.findById(message.owner_info.owner_id, function (err, user) {
        if (err) return next(err);
        if (user) {
            message.owner_info.first_name = user.first_name;
            message.owner_info.last_name = user.last_name;
            return next();
        }
    });
});


module.exports = mongoose.model('Message', MessageSchema);