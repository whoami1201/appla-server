var Message = require('../models/Message.js');
var messages = {

    /**
     * GET /messages
     *
     * Get all messages of user.
     * @param req
     * @param res
     */
    getAll: function (req, res) {
        Message.find({owner_id: req.decoded.userId}, function (err, messages) {
            if (err)
                return res.json({ success: false, message: "MESSAGE_GET_ALL_ERROR"});
            else
                return res.json({ success: true, data: messages});
        });
    },

    /**
     * GET /messages/:msgId
     *
     * Get one message.
     * @param req: msgId
     * @param res
     */
    getOne: function (req, res) {
        Message.findById(req.params.msgId, function (err, result) {
            if (err)
                return res.json({ success: false, message: "MESSAGE_GET_ONE_ERROR"});
            else
                return res.json({ success: true, data: result });
        });
    },


    getMessagesByRoom: function(req, res){
        Message.findByRoomSlug(req.params.roomSlug, function(err, result){
            if (err)
                return res.json({ success: false, message: "MESSAGE_GET_MESSAGE_BY_ROOM_ERROR"});
            else
                return res.json({ success: true, messages: result});
        });
    },

    getHomeMessages: function(req, res){
        var userId = req.decoded.userId;
        Message.findByRoomSlug("home"+ userId, function(err, result){
            if (err) {
                console.log(err);
                return res.json({ success: false, message: "MESSAGE_GET_ERROR"});
            }
            else
                return res.json({ success: true, message: result});
        })
    },
    /**
     * POST /messages
     *
     * Create message and add to room
     * Check if user is in room first
     * @param req: msgId
     * @param res
     */
    create: function (req, res) {
        req.checkBody('message', 'Invalid').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.json({success: false, message: 'INVALID_INPUT'});
            return;
        }
        var userId = req.decoded.userId,
            message = req.body.message;


        Message.create({
            owner_info: {
                owner_id: userId
            },
            message: message,
            room_slug: "random-slug"
        }, function (err, result) {
            if (err)
                return res.json({ success: false, message: err});
            else
                return res.json({ success: true, data: result });
        });

    },

    /**
     * PUT /messages
     *
     * Update message
     * @param req: msgId
     * @param res
     */

    /* PUT /messages/:msgId */
    update: function (req, res) {
        Message.findByIdAndUpdate(req.params.msgId, req.body, function (err, result) {
            if (err)
                return res.json({ success: false, message: "MESSAGE_UPDATE_ERROR"});
            else
                return res.json({ success: true });
        });
    },

    /* DELETE /messages/:msgId */
    delete: function (req, res) {
        Message.findByIdAndRemove({ _id: req.params.msgId }, function (err, result) {
            if (err)
                return res.json({ success: false, message: "MESSAGE_UPDATE_ERROR"});
            else
                return res.json({ success: true });
        });
    }
};

module.exports = messages;