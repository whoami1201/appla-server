angular.module('home.module')
    .directive('roomItem', ['HomeService', function (HomeService) {
        return {
            restrict: 'E',
            templateUrl: 'modules/home/views/room_item.html',
            scope: {
                user: '=userInfo',
                room: '=room'
            },
            link: function(scope, attrs){
                scope.joinRoom = joinRoom;
                scope.deleteRoom = deleteRoom;

                function joinRoom(roomId) {

                    console.log("Join room" + roomId);
                }

                function deleteRoom(roomId) {
                    HomeService.deleteRoom(roomId);
                }
            }
        }
    }])
    .directive('createRoomForm', [ 'mSocket','HomeService', function( mSocket, HomeService ) {
        return {
            restrict: 'E',
            templateUrl: 'modules/home/views/create_room_form.html',
            controller: function($scope, $element) {
                $scope.addRoom = addRoom;

                reset();

                function reset() {
                    $scope.newRoom = {
                        roomName: "",
                        description: ""
                    };
                    $scope.errorMessage = "";
                }

                mSocket.on('rooms/added', function(data) {
                    reset();
                });

                mSocket.on('rooms/error', function(err) {
                    $scope.errorMessage = "Could not create new room, please check if duplicate room name";
                });

                function addRoom() {
                    HomeService.addRoom($scope.newRoom);
                }
            }
        }
    }]);
