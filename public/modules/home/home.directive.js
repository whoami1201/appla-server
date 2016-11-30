angular.module('home.module')
  .directive('messageListItem', ['$rootScope', '$timeout', 'HomeService', function ($rootScope, $timeout, HomeService) {
      return {
          restrict: 'E',
          templateUrl: 'modules/home/views/message_list_item.html',
          controller: function($scope, $element){
            $scope.isMessageShow = false;
            $scope.toggleMessageShow = function () {
              $scope.isMessageShow = !$scope.isMessageShow;
            }
          }
      }
  }]);
