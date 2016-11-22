var express = require('express');
var router = express.Router();

// var userController = require('./controllers/userController');
var messageController = require('./controllers/messageController');
var authController = require('./controllers/authController');


// set headers to allow cross domain request
router.use(authController.headerAllow);
router.options('/*', authController.setHeader);

/***************************** APIs **********************************/

router.post('/register', authController.register);
router.post('/login', authController.login);

/*
 * Authentication middle ware
 * Checking token on request header
 * Those api which need authorization will be placed below this
 */
router.use(authController.authorize);

/*
* Routes that can be accessed only by authenticated users
*/
router.get('/messages', messageController.getAll);
router.get('/messages/:id', messageController.getOne);
router.post('/messages/', messageController.create);
router.put('/messages/:id', messageController.update);
router.delete('/messages/:id', messageController.delete);

module.exports = router;