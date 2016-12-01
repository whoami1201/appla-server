angular.module('auth.module')
    .directive('usernameAvailableValidator', [ '$http', function($http) {
    return {
        require: 'ngModel',
        link: function ($scope, elm, attrs, ngModel) {
            ngModel.$asyncValidators.usernameAvailable = function (username) {
                return $http.get('/api/users/checkUserExists/' + username);
            };
        }
    }
    }]);
