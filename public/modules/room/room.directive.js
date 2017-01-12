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
                    var index = null;
                    for (var i = 0; i < scope.messages.length; i++) {
                        if (scope.messages[i].messageId == message.messageId) {
                            index = i;
                        }
                    }
                    if (index!= null) {
                        scope.messages[index] = message;
                    } else {
                        scope.messages.push(message);
                    }
                    scope.message = "";
                });

                function sendMessage() {
                    RoomService.sendMessage(scope.message, $rootScope.user);
                }
            }
        }
    }]);