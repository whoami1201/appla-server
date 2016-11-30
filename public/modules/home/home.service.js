angular.module('home.module')
.factory('HomeService', [ '$rootScope', '$state','$http', '$q', HomeService ]);

function HomeService($rootScope, $state, $http, $q){
  var HomeService = {};

  return HomeService;
}