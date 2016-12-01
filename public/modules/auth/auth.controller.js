angular.module('auth.module').controller('AuthController', ['$window','$state','$rootScope','$scope', 'AuthService', "AUTH_EVENTS", AuthController]);

function AuthController($window,$state, $rootScope, $scope, AuthService, AUTH_EVENTS) {
    $scope.signIn = signIn;
    $scope.signOut = signOut;
    $scope.signUp = signUp;

    $scope.credentials = {
        username: '',
        password: ''
    };

    $scope.signUpData = {
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    };

    $scope.signInValidationMessage = "";
    $scope.signUpValidationMessage = "";

    function signIn() {
        AuthService.signIn($scope.credentials).then(function (result) {
            if (result.data.token) {
                AuthService.signedIn = true;
                $window.localStorage.accessToken = result.data.token;
                $state.go('home');
            } else {
                $scope.signInValidationMessage = result.data.msg;
            }
        }, function () {
            $scope.signInValidationMessage = "Authentication failed.";
        });
    }

    function signUp() {
        AuthService.signUp($scope.signUpData).then(function(result){
            if (result.data.success) {
                $scope.signUpValidationMessage = "Successfully signed up!";
                $rootScope.$broadcast(AUTH_EVENTS.signupSuccess);
            } else {
                $scope.signUpValidationMessage = "Sign up failed. User already existed.";
                $rootScope.$broadcast(AUTH_EVENTS.signupFailed);
            }
        }, function(){
            $scope.signUpValidationMessage = "Sign up failed.";
            $rootScope.$broadcast(AUTH_EVENTS.signupFailed);
        })
    }

    function signOut() {
        AuthService.signOut();
    }

};
