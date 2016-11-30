var jwt = require('jsonwebtoken');
var User = require('../models/User.js');
var Constants = require('../config/constants');

var users = {

    /* GET /users listing. */
    getAll: function (req, res, next) {
        User.find(function (err, users) {
            if (err) return next(err);
            res.json(users);
        });
    },

    /* GET /users/id */
    getOne: function (req, res, next) {
        var id = req.params.id;
        User.findById(req.params.id, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    },

    /* POST /users */
    create: function (req, res, next) {
        User.create(req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    },

    /* PUT /users/:id */
    update: function (req, res, next) {
        User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    },

    /* DELETE /users/:id */
    delete: function (req, res, next) {
        User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    },

    isSignedIn: function(req, res) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, Constants.secret, function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.'});
                } else {
                    return res.json({ success: true, message: "User is signed in."});
                }
            });

        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
};

module.exports = users;