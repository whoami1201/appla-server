angular.module('auth.module')
    .factory('AuthService', ['$state', '$timeout', '$http', '$q', '$window', AuthService]);


function AuthService($state, $timeout, $http, $q, $window) {
    var AuthService = {};

    AuthService.signIn = signIn;
    AuthService.signOut = signOut;
    AuthService.verifyUser = verifyUser;
    AuthService.signedIn = false;

    /*
     * SIGN IN
     */
    function signIn(credentials) {
        return $http
            .post('/api/login', credentials)
            .then(function (res) {
                if (res.data.token != null) {
                    AuthService.signedIn = true;
                    $window.localStorage.accessToken = res.data.token;
                    $state.go('home');
                } else {
                    return;
                }
            });
    }


    /*
     * SIGN OUT
     */
    function signOut() {
        $window.localStorage.accessToken = null;
        $state.go('login');
    }

    function checkSignedIn() {
        $http.get('/api/users/isSignedIn', {
            headers: { "x-access-token": $window.localStorage.accessToken }
        }).then(function(res) {
            AuthService.signedIn = res.data.success;
        });
    }

    function verifyUser(view) {
        checkSignedIn();

        var defer = $q.defer();

        $timeout(function () {
            var allow = false;

            switch (view) {
                case 'home':
                    var fallback = 'login';
                    break;
                case 'login':
                    var fallback = 'home';
                    break;
            }

            if (AuthService.signedIn) {
                if (view != 'login') {
                    allow = true;
                }
            } else if (view == 'login') {
                allow = true;
            }

            if (allow) {
                defer.resolve();
            }
            else {
                $state.go(fallback);
            }
        }, 100);

        return defer.promise;

    }

    return AuthService;
}