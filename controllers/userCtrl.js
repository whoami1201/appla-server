var User = require('../models/User.js');

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
    }
};

module.exports = users;