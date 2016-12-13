angular.module('room.module')
    .factory('RoomService', ['$state', '$http', '$rootScope', 'roomSocket', RoomService]);

function RoomService($state, $http, $rootScope, roomSocket) {
    var RoomService = {};

    RoomService.joinRoom = joinRoom;

    function joinRoom(roomSlug, user) {
        roomSocket.emit('rooms/join', {
            roomSlug: roomSlug,
            userId: user.user_id
        })
    }

    return RoomService;
}