angular.module('app').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "modules/home/views/home.html",
            resolve: {
                auth: function (AuthService) {
                    return AuthService.verifyUser('home');
                },
                promisedUser: ['$http', '$window', function($http, $window) {
                    return $http.get('/api/users/getCurrentUser', {
                        headers: { "x-access-token": $window.localStorage.accessToken}
                    });
                }],
                promisedRooms: ['$http', '$window', function($http, $window) {
                    return $http.get('/api/rooms', {
                        headers: { "x-access-token": $window.localStorage.accessToken }
                    });

                }]
            },
            controller: HomeController
        })
        .state('login', {
            url: "/login",
            templateUrl: "modules/auth/views/login.html",
            resolve: {
                auth: function (AuthService) {
                    return AuthService.verifyUser('login');
                }
            },
            controller: AuthController
        })
        .state('rooms', {
            url: "/rooms/:roomSlug",
            templateUrl: "modules/room/views/room.html",
            resolve: {
                auth: function (AuthService) {
                    return AuthService.verifyUser('rooms');
                }
            },
            controller: RoomController
        })
        .state('404', {
            url: "/404",
            templateUrl: "templates/views/404.html"
        });
    $locationProvider.html5Mode(true);
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise("/404");
});
