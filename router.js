var express = require('express');
var router = express.Router();

var userCtrl = require('./controllers/userCtrl');
var messageCtrl = require('./controllers/messageCtrl');
var authCtrl = require('./controllers/authCtrl');
var roomCtrl = require('./controllers/roomCtrl');


// set headers to allow cross domain request
router.use(authCtrl.headerAllow);
router.options('/*', authCtrl.setHeader);

/***************************** APIs **********************************/

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

router.get('/users/isSignedIn', userCtrl.isSignedIn);

/*
 * Authentication middle ware
 * Checking token on request header
 * Those api which need authorization will be placed below this
 */
router.use(authCtrl.authorize);

router.get('/users/getCurrentUser', userCtrl.getCurrentUser);

/*
* Routes that can be accessed only by authenticated users
*/

router.get('/messages', messageCtrl.getAll);
router.get('/messages/:msgId', messageCtrl.getOne);
router.get('/messages/getMessagesByRoom/:roomSlug', messageCtrl.getMessagesByRoom);
router.post('/messages/', messageCtrl.create);
router.put('/messages/:msgId', messageCtrl.update);
router.delete('/messages/:msgId', messageCtrl.delete);

router.get('/rooms', roomCtrl.getAll);
router.get('/rooms/:roomSlug', roomCtrl.getOne);
router.post('/rooms', roomCtrl.create);
router.put('/rooms/:roomSlug/join', roomCtrl.update);
router.delete('/rooms/:roomSlug', roomCtrl.delete);



module.exports = router;