var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('../models/User');
var Constants = require('../config/constants');

var auth;
auth = {

    /**
     * Set header for COR
     * @param req
     * @param res
     * @param next
     */
    headerAllow: function (req, res, next) {
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

    setHeader: function (req, res) {
        //res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
        res.header('Access-Control-Allow-Origin', '*');
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
    authorize: function (req, res, next) {
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
    },

    /**
     * Register new user
     * @param req, username, password, role
     * @param res
     */
    register: function (req, res) {
        // check validation

        req.checkBody('firstName', 'Invalid').notEmpty();
        req.checkBody('lastName', 'Invalid').notEmpty();
        req.checkBody('username', 'Invalid').notEmpty();
        req.checkBody('password', 'Invalid').notEmpty().len(6, 20);

        // catch errors
        var errors = req.validationErrors();

        if (errors) {
            res.json({success: false, message: 'INVALID_INPUT'});
            return;
        }

        var user = {
            last_name: req.body.lastName,
            first_name: req.body.firstName,
            username: req.body.username,
            password: req.body.password
        };

        // save the user
        User.create( user, function (err) {
            if (err) {
                console.log(err);
                return res.json({success: false, msg: "ERROR_CREATE_USER" });
            }
            res.json({success: true});
        })
    },


    /**
     * Login
     * @param req: username, password
     * @param res
     * @return token
     */
    login: function (req, res) {
        User.findOne({
            username: req.body.username
        }, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        sign = {userId: user._id};
                        var token = jwt.sign(sign, Constants.secret, {
                            expiresIn: '1d'
                        });
                        res.json({success: true, token: token});
                    } else {
                        res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                    }
                })
            }
        });
    }

};


module.exports = auth;