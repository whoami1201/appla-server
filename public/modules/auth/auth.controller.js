angular.module('auth.module').controller('AuthController', ['$rootScope','$scope', 'AuthService', "AUTH_EVENTS", AuthController]);

function AuthController($rootScope, $scope, AuthService, AUTH_EVENTS) {
    $scope.signIn = signIn;
    $scope.signOut = signOut;

    $scope.credentials = {
        username: '',
        password: ''
    };

    function signIn() {
        AuthService.signIn($scope.credentials).then(function (result) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        });
    }

    function signOut() {
        AuthService.signOut();
    }

};
