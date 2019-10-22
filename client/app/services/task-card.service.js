angular.module('HelpmeAdminApp')
.factory('TaskCard', function (Restangular) {
  return Restangular.service('task-cards');
});
