var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var Constants = require('./config/constants');

var router = require('./router');
var socket = require('./socket');

var app = express();
var http = require('http').Server(app);

// load mongoose package
var mongoose = require('mongoose');

// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect(Constants.database)
    .then(function() { console.log("connection successful") })
    .catch(function(err) { console.error(err)});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!

app.use('/', express.static(__dirname + '/public'));
app.use('/api/', router);

// Handle 404 error.
// The last middleware.
app.use("*", function (req, res) {
    res.status(404).send('404');
});

socket.connect(http);

http.listen(3000, function () {
    var host = http.address().address;
    var port = http.address().port;
    console.log("Server listening at http://%s:%s", host, port);
});

module.exports = app;

