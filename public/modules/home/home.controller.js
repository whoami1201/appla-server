angular.module('home.module').controller('HomeController', ['$scope', 'mSocket', '$document', 'HomeService', 'AuthService', HomeController]);

function HomeController($scope, mSocket, $document, HomeService, AuthService) {
    $scope.signOut = signOut;
    $scope.toggleCreateRoomForm = toggleCreateRoomForm;
    $scope.rooms = [];
    $scope.user = {};
    $scope.showCreateRoomForm = false;

    $document.ready(function () {
        angular.element(".button-collapse").sideNav();
        angular.element(".dropdown-button").dropdown();
        angular.element('.tooltipped').tooltip({delay: 50});
    });

    mSocket.on('updateRoomList/added', function(data) {
        $scope.rooms.push(data);
    });

    mSocket.on('updateRoomList/deleted', function(data) {
        var index = 0;
        for(var i=0;i < $scope.rooms.length;i++){
            if($scope.rooms[i]._id == data._id){
                index = i;
                break;
            }
        }
        $scope.rooms.splice(index, 1);
    });

    mSocket.on('rooms/added', function(){
        Materialize.toast('Room created successfully!', 2000, 'rounded');
        toggleCreateRoomForm();
    });

    mSocket.on('rooms/deleted', function(){
        Materialize.toast('Room deleted successfully!', 2000, 'rounded');
    });
    mSocket.on('rooms/error', function(err){
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
