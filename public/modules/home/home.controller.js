angular.module('home.module').controller('HomeController', ['$scope', 'mSocket', '$document', 'HomeService', 'AuthService', HomeController]);

function HomeController($scope, mSocket, $document, HomeService, AuthService) {
    $scope.signOut = signOut;
    $scope.toggleCreateRoomForm = toggleCreateRoomForm;
    $scope.rooms = [];
    $scope.user = {};
    $scope.showCreateRoomForm = false;

    $scope.initCount = 1;

    $scope.initCount++;

    mSocket.forward('updateRoomList/added', $scope);
    mSocket.forward('updateRoomList/deleted', $scope);
    mSocket.forward('rooms/deleted', $scope);
    mSocket.forward('rooms/added', $scope);
    mSocket.forward('rooms/error', $scope);

    $document.ready(function () {
        angular.element(".button-collapse").sideNav();
        angular.element(".dropdown-button").dropdown();
        angular.element('.tooltipped').tooltip({delay: 50});
    });

    $scope.$on('socket:updateRoomList/added', function(data) {
        $scope.rooms.push(data);
    });

    $scope.$on('socket:updateRoomList/deleted', function(data) {
        var index = 0;
        for(var i=0;i < $scope.rooms.length;i++){
            if($scope.rooms[i]._id == data._id){
                index = i;
                break;
            }
        }
        $scope.rooms.splice(index, 1);
    });

    $scope.$on('socket:rooms/added', function(data){
        console.log($scope.initCount);
        Materialize.toast('Room created!', 2000, 'rounded');
        toggleCreateRoomForm();
    });

    $scope.$on('socket:rooms/deleted', function(){
        Materialize.toast('Room removed!', 2000, 'rounded');
    });
    $scope.$on('socket:rooms/error', function(err){
        console.log("Room error");
        console.log(err);
    });

    init();

    function init() {
        getAllRooms();
        getUser();
    }

    function getUser() {
        HomeService.getUser().then(function (res) {
            if (res.data.user) {
                $scope.user = res.data.user;
            }
        })
    }

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
