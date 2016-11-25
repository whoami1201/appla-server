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
                return res.json({ success: false, message: "MESSAGE_GET_ERROR"});
            else
                return res.json({ success: true, data: result });
        });
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
        req.checkBody('roomSlug','Invalid').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.json({success: false, message: 'INVALID_INPUT'});
            return;
        }
        var userId = req.decoded.userId,
            roomSlug = req.body.roomSlug,
            message = req.body.message;


        Message.addMessageToRoom(userId, roomSlug, message, function (err, result) {
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