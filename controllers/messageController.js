var Message = require('../models/Message.js');
var messages = {

  /* GET /messages listing. */
  getAll: function(req, res, next) {
    Message.find(function (err, messages) {
      if (err) return next(err);
      res.json(messages);
    });
  },

  /* GET /messages/id */
  getOne: function(req, res, next) {
    var id = req.params.id;
    Message.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  },

  /* POST /messages */
  create: function(req, res, next) {
    Message.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  },

  /* PUT /messages/:id */
  update: function(req, res, next) {
    Message.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  },

  /* DELETE /messages/:id */
  delete: function(req, res, next) {
    Message.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
};

module.exports = messages;