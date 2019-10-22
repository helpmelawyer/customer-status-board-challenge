
export default function pageUtilsController($scope, $rootScope, EVENT_SEARCH_ACTION) {

  // 검색 아이템 입력값
  $scope.inputs = {};
  // 검색
  $scope.search = function () {
    $rootScope.$broadcast(EVENT_SEARCH_ACTION, $scope.inputs);
  };

  $scope.searchKeyChanged = function (item) {
    if (item.keys) {
      const _value = $scope.inputs[item.key];
      item.keys.forEach((key) => $scope.inputs[key] = _value);
    }
  };

  // 검색 가능한 아이템 목록
  // NOTE schema for page-utils
  // $scope.searchableItems = [{
  //   label: '이름',
  //   key: 'fullName',
  //   keys: ['fullName1', 'fullName2'] // clone of fullName
  //   type: 'text',
  // }];

}

angular.module('HelpmeAdminApp')
.constant('EVENT_SEARCH_ACTION', 'searchAction')
.controller('PageUtilsController', pageUtilsController);
