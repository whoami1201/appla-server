var express = require('express');
var router = express.Router();

var Message = require('../models/Message.js');

/* GET /messages listing. */
router.get('/', function(req, res, next) {
  Message.find(function (err, messages) {
    if (err) return next(err);
    res.json(messages);
  });
});

/* POST /messages */
router.post('/', function(req, res, next) {
  console.log(req.body);
  Message.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /messages/id */
router.get('/:id', function(req, res, next) {
  Message.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /messages/:id */
router.put('/:id', function(req, res, next) {
  Message.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /messages/:id */
router.delete('/:id', function(req, res, next) {
  Message.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;