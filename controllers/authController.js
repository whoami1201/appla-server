var jwt = require('jsonwebtoken');
var async = require('async');
var bcrypt = require('bcrypt');
var User = require('../models/user');
var Constants = require('../config/constants');

var auth = {
  
  /**
   * Set header for COR
   * @param req
   * @param res
   * @param next
   */
  headerAllow: function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.set('Access-Control-Allow-Headers', 'content-Type,x-requested-with,authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.set('Access-Control-Allow-Credentials', false);
    //console.log(req.headers);
    // Pass to next layer of middleware
    next();
  },

  setHeader: function(req, res) {
    //res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Origin',  '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with,authorization');
    res.sendStatus(200);
  },


  /**
   * Authorization middle ware
   * @param req
   * @param res
   * @param next
   */
  authorize: function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['authorization'];

    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, Constants.secret, function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'INVALID_TOKEN' });
        }
        else {
          // if everything is good, save to request for use in other routes
          User.getInfo(decoded.userId, function(error, result){
            if (error || !result) {
              return res.status(403).json({
                success: false,
                message: 'INVALID_USER'
              });
            }
            else {
              req.user = result;
              next();
            }
          });
        }
      });
    }
    else {
      // if there is no token return an error
      return res.status(403).json({
        success: false,
        message: 'NO_TOKEN_PROVIDED'
      });
    }
  },

  /**
   * Register new user
   * @param req, firstName, lastName, username, password, type, pinCode (optional)
   * @param res
   */
  register:function(req, res) {
    // check validation

    req.checkBody('firstName', 'Invalid').notEmpty();
    req.checkBody('lastName', 'Invalid').notEmpty();
    req.checkBody('username', 'Invalid').notEmpty().isEmail();
    req.checkBody('type', 'Invalid').notEmpty();
    req.checkBody('password', 'Invalid').notEmpty().len(6,20);

    // catch errors
    var errors = req.validationErrors();

    if (errors) {
      res.json({success: false, message: 'INVALID_INPUT'});
      return;
    }

    async.waterfall([

        // generate hash password
        function(next) {
          bcrypt.genSalt(10, function(err, salt) {
            if(err) {
              next('CANT_GEN_SALT');
            }
            else
            {
              bcrypt.hash(req.body.password, salt, function(err, hash) {
                if(err) {
                  next('CANT_GEN_HASH');
                }
                else {
                  var info = {
                    firstName   : req.body.firstName,
                    lastName    : req.body.lastName,
                    username    : req.body.username,
                    password    : hash,
                    type        : req.body.type
                  };
                  next(null, info);
                }
              });
            }


          });
        },

        // check if user exist
        function(info, next) {
          User.checkExist(info.username, function(result) {
            if (result) {
              next('USER_EXIST');
            } else {
              next(null, info);
            }
          });
        },

        // Register new user
        function(info, next) {
          User.register(info, function(err, userId){
            if(err) {
              next('CANT_REGISTER');
            }
            else {
              next(null, userId);
            }
          });
        },

        // get user info
        function (userId, next) {
          User.getInfo(userId, function (err, result) {
            if (err) {
              next('CANT_GET_INFO');
            }
            else {
              var sign = {userId : userId};
              result.token = jwt.sign(sign, Constants.secret);
              next(null, result);
            }

          })
        }

        ], function (err, result) {
          if (err) {
            res.json({success: false, message: err});
          }
          else {
            res.json({success:true, data: result});
          }

        });
  },


  /**
   * Login
   * @param req: username, password
   * @param res
   * @return user data
   */
  login: function(req, res) {
  req.checkBody('username', 'INVALID').isEmail();
  req.checkBody('password', 'INVALID').notEmpty();

  // catch errors
  var errors = req.validationErrors();

  if (errors) {
    res.json({success: false, message: "INVALID_INPUT"});
  }

  var username = req.body.username;
  var password = req.body.password;

  User.login(username, function(err, result){
    if(err) {
      res.json({success: false, message: 'CANT_GET_INFO'});
    }
    else if(result) {
      if ( bcrypt.compareSync(password, result.password) ) {
        // if the user doesn't have pincode yet

        var sign = {userId : result.userId}; // create sign is user id
        result.token = jwt.sign(sign, Constants.secret); // expired in 10000000 secs

        delete result.password; // remove password from result

        res.json({success: true, data: result});
      }
      else {
        res.json({success: false, message: "FORBIDDEN"});
      }
    }
    else {
      res.json({success: false, message: "FORBIDDEN"});
    }
    });
  };
}


exports.exports = auth;