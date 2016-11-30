angular.module('home.module').controller('HomeController', ['$scope', '$timeout', '$q', '$window', 'HomeService','AuthService', HomeController]);

function HomeController($scope, $timeout, $q, $window, HomeService, AuthService){
  $scope.signOut = signOut;


  /**
  * SIGN OUT
  */
  function signOut(){
    AuthService.signOut();
  }

};
