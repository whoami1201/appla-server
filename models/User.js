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
    },

    isSignedIn: function(data, callback) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, Constants.secret, function (err, decoded) {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
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



module.exports = user;