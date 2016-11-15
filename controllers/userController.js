var Constants = require('../config/constants');
var jwt = require('jwt-simple');
var User = require('../models/User.js');

var users = {

  /* POST /signup */
  signUp: function(req, res, next) {
    if (!req.body.username || !req.body.password) {
      res.json({success: false, msg: 'Please pass name and password.'});
    } else {
      
      var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
      });

      // save the user
      newUser.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Successful created new user.'});
      });
    }
  },

  authenticate: function(req, res, next) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        user.comparePassword(req.body.password, function(err, isMatch){
          if (isMatch && !err) {
            var token = jwt.encode(user, config.secret);
            res.json({success: true, token: 'JWT ' + token });
          } else {
            res.send({success: true, msg: 'Authentication failed. Wrong password.'});
          }
        })
      }
    });
  },
  
  /* GET /users listing. */
  getAll: function(req, res, next) {
    User.find(function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  },

  /* GET /users/id */
  getOne: function(req, res, next) {
    var id = req.params.id;
    User.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  },

  /* POST /users */
  create: function(req, res, next) {
    User.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  },

  /* PUT /users/:id */
  update: function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  },

  /* DELETE /users/:id */
  delete: function(req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
};

module.exports = users;