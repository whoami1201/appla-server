angular.module('home.module').controller('HomeController', ['$window', 'promisedUser', 'promisedRooms','$scope', 'mSocket', 'roomSocket','$document', 'HomeService', 'AuthService', HomeController]);

function HomeController($window, promisedUser, promisedRooms, $scope, mSocket, roomSocket, $document, HomeService, AuthService) {
    $scope.signOut = signOut;
    $scope.toggleCreateRoomForm = toggleCreateRoomForm;
    $scope.rooms = [];
    $scope.messages = [];
    $scope.user = [];
    $scope.showCreateRoomForm = false;
    $scope.noRoomMessage = "";



    /**
     * JQUERY STUFFS
     */
    $document.ready(function () {
        angular.element(".button-collapse").sideNav();
        angular.element(".dropdown-button").dropdown();
        angular.element('.tooltipped').tooltip({delay: 50});
    });

    /**
     * INIT
     */
    init();


    /**
     * SOCKET
     */

    roomSocket.disconnect();

    mSocket.forward('updateRoomList/added', $scope);
    mSocket.forward('updateRoomList/deleted', $scope);
    mSocket.forward('rooms/deleted', $scope);
    mSocket.forward('rooms/added', $scope);
    mSocket.forward('rooms/error', $scope);
    mSocket.forward('messages/received', $scope);

    $scope.$on('messages/received', function(ev, data){
        console.log("Message received");
        console.log(data);
    });

    $scope.$on('updateRoomList/added', function(ev, data) {
        $scope.rooms.push(data);
    });

    $scope.$on('updateRoomList/deleted', function(ev, data) {
        var index = 0;
        for(var i=0;i < $scope.rooms.length;i++){
            if($scope.rooms[i]._id == data._id){
                index = i;
                break;
            }
        }
        $scope.rooms.splice(index, 1);
    });

    $scope.$on('rooms/added', function(){
        Materialize.toast('Room created!', 2000, 'rounded');
        toggleCreateRoomForm();
    });

    $scope.$on('rooms/deleted', function(){
        Materialize.toast('Room removed!', 2000, 'rounded');
    });
    $scope.$on('rooms/error', function(err){
        console.log("Room error");
        console.log(err);
    });



    function init() {
        getAllRooms();
        getUser();
    }

    /**
     * get current user info
     */

    function getUser() {
        if (promisedUser.data.success) {
            $scope.user = promisedUser.data.user;
            $window.sessionStorage.setItem('currentUser', JSON.stringify($scope.user));
        }
    }

    /**
     * get all rooms info
     */
    function getAllRooms() {
        if (promisedRooms.data.success) {
            $scope.rooms = promisedRooms.data.rooms;
        } else {
            $scope.noRoomMessage = "No rooms available. Create one.";
        }
    }

    /**
     * Toggle create room form
     */
    function toggleCreateRoomForm() {
        $scope.showCreateRoomForm = !$scope.showCreateRoomForm;
    }

    /**
     * SIGN OUT
     */
    function signOut() {
        AuthService.signOut();
    }

};
