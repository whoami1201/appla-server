angular.module('room.module')
    .factory('RoomService', ['$state', '$http', 'roomSocket', RoomService]);

function RoomService($state, $http, roomSocket) {
    var RoomService = {};

    RoomService.joinRoom = joinRoom;
    RoomService.sendMessage = sendMessage;

    function joinRoom(roomSlug, user) {
        roomSocket.emit('rooms/join', {
            roomSlug: roomSlug,
            userId: user.user_id
        })
    }

    function sendMessage(message, user) {
        roomSocket.emit('messages/send', {
            message: message,
            userId: user.user_id
        })
    }

    return RoomService;
}