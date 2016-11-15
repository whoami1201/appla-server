var express    = require('express');
var bodyParser = require('body-parser');
var jwt        = require('jwt-simple');
var validator  = require('express-validator');

var Constants = require('./config/Constants');

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
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(__dirname + '/public'));
app.use('/api/', router);

socket.connect(http)

http.listen(3000, function(){
  var host = http.address().address
  var port = http.address().port
  console.log("Server listening at http://%s:%s", host, port);
})

module.exports = app;

