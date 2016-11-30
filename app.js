var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var path = require('path');

var Constants = require('./config/constants');

var router = require('./router');
var socket = require('./socket');

var app = express();
var http = require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!

app.use('/api/', router);

app.use('/libs', express.static(__dirname + '/public/libs'));
app.use('/bower_components', express.static(__dirname + '/public/bower_components'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/modules', express.static(__dirname + '/public/modules'));
app.use('/templates', express.static(__dirname + '/public/templates'));

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname + '/public' });
});


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

