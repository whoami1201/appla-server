angular.module('room.module').controller('RoomController', ['$window','$document','$stateParams','$scope', 'roomSocket', 'RoomService',RoomController]);

function RoomController($window, $document, $stateParams, $scope, roomSocket, RoomService ) {


    $document.ready(function () {
        angular.element(".button-collapse").sideNav();
    });

    /**
     * SOCKETS
     */

    roomSocket.connect();

    roomSocket.forward('rooms/updateUserList', $scope);

    $scope.$on('rooms/updateUserList', function(ev, room) {
        console.log("JOINED ROOM");
        console.log(room);
    });


    /**
     * INIT
     */

    init();

    function init() {
        var temp = $window.sessionStorage.getItem('currentUser');
        $scope.user = angular.fromJson(temp);
        RoomService.joinRoom($stateParams.roomSlug, $scope.user);
    }

}
