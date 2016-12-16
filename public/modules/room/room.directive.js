angular.module('room.module')
    .directive('userList', ['roomSocket','RoomService', function (roomSocket, RoomService) {
        return {
            restrict: 'E',
            templateUrl: 'modules/room/views/user_list.html',
            link: function(scope){

                roomSocket.forward('rooms/updateUserList', scope);

                scope.$on('rooms/updateUserList', function(ev, users) {
                    scope.users = users;
                });


            }
        }
    }])
    .directive('chatbox', ['roomSocket', 'RoomService', '$rootScope',
        function(roomSocket, RoomService, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'modules/room/views/chatbox.html',
            link: function(scope) {
                scope.sendMessage = sendMessage;
                scope.message = "";

                roomSocket.forward('messages/received', scope);
                scope.$on('messages/received', function(ev, message){
                    scope.messages.push(message);
                    scope.message = "";
                });

                function sendMessage() {
                    RoomService.sendMessage(scope.message, $rootScope.user);
                }
            }
        }
    }]);