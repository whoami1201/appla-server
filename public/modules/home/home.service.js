angular.module('home.module')
    .factory('HomeService', ['$window', '$state', '$http', '$q', 'mSocket', HomeService]);

function HomeService($window, $state, $http, $q, mSocket) {
    var HomeService = {};

    HomeService.getAllRoom = getAllRooms;
    HomeService.getUser = getUser;
    HomeService.addRoom = addRoom;
    HomeService.deleteRoom = deleteRoom;

    var token = $window.localStorage.accessToken;

    function getAllRooms(){
        // var deferred = $q.defer();
        // setTimeout(function(){
            return $http.get('/api/rooms', { headers: { "x-access-token": token }});
                // .then(function(response) {
                //     deferred.resolve(response.data);
                // }, function(err) {
                //     deferred.reject(err);
                // });
        // }, 200);
        // return deferred.promise;
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

    return HomeService;
}