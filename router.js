var express = require('express');
var router = express.Router();

var userController = require('./controllers/userController');
var messageController = require('./controllers/messageController');

/*
* Sign Up route
*/
router.post('/signup', userController.signUp);

/*
* Authenticate route
*/
router.post('/authenticate', userController.authenticate);

/*
* Routes that can be accessed only by autheticated users
*/
router.get('/messages', messageController.getAll);
router.get('/messages/:id', messageController.getOne);
router.post('/messages/', messageController.create);
router.put('/messages/:id', messageController.update);
router.delete('/messages/:id', messageController.delete);

module.exports = router;