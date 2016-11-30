angular.module('app').config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "modules/home/views/home.html",
      controller: HomeController,
      resolve: {
        auth: function (AuthService) {
          return AuthService.verifyUser('home');
        }
      }
    })
    .state('login', {
      url: "/login",
      templateUrl: "modules/auth/views/login.html",
      controller: AuthController,
      resolve: {
        auth: function (AuthService) {
          return AuthService.verifyUser('login');
        }
      }
    })
    .state('404', {
      url: "/404",
      templateUrl: "templates/views/404.html"
    });
  $locationProvider.html5Mode(true);
  $urlRouterProvider.when('','/');
  $urlRouterProvider.otherwise("/404");
});
