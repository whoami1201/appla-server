angular.module('home.module')
    .factory('HomeService', ['$window', '$state', '$http', '$q', 'mSocket', HomeService]);

function HomeService($window, $state, $http, $q, mSocket) {
    var HomeService = {};

    HomeService.getAllRoom = getAllRooms;
    HomeService.getUser = getUser;
    HomeService.addRoom = addRoom;
    HomeService.deleteRoom = deleteRoom;
    HomeService.joinRoom = joinRoom;

    var token = $window.localStorage.accessToken;

    function getAllRooms(){
        return $http.get('/api/rooms', { headers: { "x-access-token": token }});
    }

    function getUser(){
        return $http.get('/api/users/getCurrentUser',{ headers: { "x-access-token": token}});
    }

    function addRoom(room){
        mSocket.emit('rooms/add', {
            room: room,
            token: token
        })
    }

    function deleteRoom(roomId){
        mSocket.emit('rooms/delete', {
            roomId: roomId,
            token: token
        })
    }

    function joinRoom(roomSlug) {
        $state.go('rooms', {
            roomSlug: roomSlug
        })
    }

    return HomeService;
}