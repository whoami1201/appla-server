var Room = require('../models/Room.js');
var moment = require('moment');

var rooms = {

    /**
     * GET /rooms
     *
     * Get room listing.
     * @param req
     * @param res
     */
    getAll: function (req, res) {
        Room.find(function (err, rooms) {
            if (err)
                return res.json({success: false, message: "ROOM_GET_ALL_ERROR"});
            else
                return res.json({success: true, data: rooms});
        });
    },

    /**
     * GET /rooms/:roomSlug
     *
     * Get room details with messages
     * @param req: roomSlug
     * @param res
     */
    getOne: function (req, res) {
        Room.findOne( { slug: req.params.roomSlug }, function (err, room) {
            if (err)
                return res.json({success: false, message: err });
            else
                return res.json({success: true, data: room});
        });
    },


    /**
     * POST /rooms
     *
     * Add room
     * @param req: roomName, description
     * @param res
     */
    create: function (req, res) {
        req.checkBody('roomName', 'Invalid').notEmpty();

        var errors = req.validationErrors();

        var room = {
            room_name: req.body.roomName,
            description: req.body.description,
            owner_id: req.decoded.userId,
            users: [req.decoded.userId]
        };

        if (errors) {
            res.json({success: false, message: 'INVALID_INPUT'});
            return;
        }

        Room.create(room, function (err, result) {
            if (err)
                return res.json({success: false, message: "ROOM_ALREADY_EXISTED"});
            else
                return res.json({success: true, data: result});
        });
    },

    /**
     * PUT /rooms/:roomSlug/join/
     *
     * Join to room
     * Update Room's user id array
     * @param req: roomSlug
     * @param res
     */
    update: function (req, res) {
        Room.findOneAndUpdate( { slug: req.params.roomSlug }, {
            $addToSet: {users: req.decoded.userId}
        }, function (err, result) {
            if (err)
                return res.json({success: false, message: "ROOM_JOIN_ERROR"});
            else
                return res.json({success: true});
        });
    },

    /**
     * DELETE /rooms
     *
     * Delete room
     * @param req: roomSlug
     * @param res
     */

    /* DELETE /rooms/:roomSlug */
    delete: function (req, res) {
        Room.findOneAndModify({ slug: req.params.roomSlug }, {
           $set: { sync_deleted: moment.now() }
        }, function (err, result) {
            if (err)
                return res.json({success: false, message: "ROOM_DELETE_ERROR" });
            else
                return res.json({success: true});
        });
    }
};

module.exports = rooms;