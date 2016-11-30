'use strict';

var constants   = require('../config/constants');
var Mongoose 	= require('mongoose');

// Connect to the database
Mongoose.connect(constants.database);

// Throw an error if the connection fails
Mongoose.connection.on('error', function(err) {
    if(err) throw err;
});

Mongoose.Promise = global.Promise;

module.exports = { Mongoose: Mongoose,
    models: {
        user: require('./schemas/user.js'),
        room: require('./schemas/room.js'),
        message: require('./schemas/message.js')
    }
};