angular.module('room.module').controller('RoomController', [ 'promisedMessages','$window','$document','$stateParams','$scope', '$rootScope','roomSocket', 'RoomService',RoomController]);

function RoomController(promisedMessages, $window, $document, $stateParams, $scope, $rootScope, roomSocket, RoomService ) {

    if (promisedMessages.data.success) {
        $scope.messages = promisedMessages.data.messages;
    } else {
        $scope.messages = [];
    }

    $document.ready(function () {
        angular.element(".button-collapse").sideNav();
    });

    /**
     * SOCKETS
     */

    roomSocket.connect();

    roomSocket.forward('rooms/joined', $scope);

    $scope.$on('rooms/joined', function(ev, room) {
        $scope.room = room;
    });


    /**
     * INIT
     */

    init();

    function init() {
        var temp = $window.sessionStorage.getItem('currentUser');
        $rootScope.user = angular.fromJson(temp);
        RoomService.joinRoom($stateParams.roomSlug, $rootScope.user);
    }

}
