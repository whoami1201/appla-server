angular.module('room.module').controller('RoomController', ['$stateParams','$scope', 'mSocket', RoomController]);

function RoomController($stateParams, $scope, mSocket) {
    console.log($stateParams);
}
