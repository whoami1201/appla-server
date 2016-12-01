angular.module('home.module').controller('HomeController', ['$scope', '$timeout', '$q', '$document', 'HomeService','AuthService', HomeController]);

function HomeController($scope, $timeout, $q, $document, HomeService, AuthService){
  $scope.signOut = signOut;

  $document.ready(function(){
    angular.element(".button-collapse").sideNav();
  });

  /**
  * SIGN OUT
  */
  function signOut(){
    AuthService.signOut();
  }

};
