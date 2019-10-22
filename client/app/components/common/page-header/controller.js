
export default function pageHeaderController($scope) {

  const vm = this;
  vm.userName = '사용자';

  return vm;
}

angular.module('HelpmeAdminApp')
.controller('PageHeaderController', pageHeaderController);
