
import Template from './tmpl.html';

angular.module('HelpmeAdminApp')
.directive('menuLink', function () {
  return {
    scope: {
      section: '=',
      isSelectedCtrl: '=isSelected',
      selectPageCtrl: '=selectPage',
    },
    templateUrl: Template,
    link: function ($scope, $element) {

      $scope.isSelected = function () {
        return $scope.isSelectedCtrl($scope.section);
      };

      $scope.selectPage = function () {
        if ($scope.selectPageCtrl) {
          $scope.selectPageCtrl($scope.section);
        }
      };
    },
  };
});
