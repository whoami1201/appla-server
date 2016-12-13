angular.module('home.module').controller('HomeController', ['$window','$rootScope','$scope', 'mSocket', 'roomSocket','$document', 'HomeService', 'AuthService', HomeController]);

function HomeController($window, $rootScope, $scope, mSocket, roomSocket, $document, HomeService, AuthService) {
    $scope.signOut = signOut;
    $scope.toggleCreateRoomForm = toggleCreateRoomForm;
    $scope.rooms = [];
    $rootScope.user = {};
    $scope.showCreateRoomForm = false;


    /**
     * JQUERY STUFFS
     */
    $document.ready(function () {
        angular.element(".button-collapse").sideNav();
        angular.element(".dropdown-button").dropdown();
        angular.element('.tooltipped').tooltip({delay: 50});
    });

    /**
     * SOCKET
     */

    roomSocket.disconnect();

    mSocket.forward('updateRoomList/added', $scope);
    mSocket.forward('updateRoomList/deleted', $scope);
    mSocket.forward('rooms/deleted', $scope);
    mSocket.forward('rooms/added', $scope);
    mSocket.forward('rooms/error', $scope);

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


    init();

    function init() {
        getAllRooms();
        getUser();
    }

    /**
     * get current user info
     */

    function getUser() {
        HomeService.getUser().then(function (res) {
            if (res.data.user) {
                var user = res.data.user;
                $scope.user = user;
                $window.sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
        })
    }

    /**
     * get all rooms info
     */
    function getAllRooms() {
        HomeService.getAllRoom().then(function (res) {
            if (res.data.rooms) {
                $scope.rooms = res.data.rooms;
                $scope.noRoomMessage = "";
            } else {
                $scope.noRoomMessage = "No Room Available. Create one."
            }
        }, function () {
            $scope.errorMessage = "Could not load rooms."
        })
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
