'use strict';

var userModel = require('../database').models.user;

var user = {
    create: function(data, callback) {
      var newUser = new userModel(data);
      newUser.save(callback);
    },
    findOne: function(data, callback) {
        userModel.findOne(data, callback);
    },
    findById: function(id, callback) {
        userModel.findById(id, callback);
    }
};



module.exports = user;