'use strict';

// http://118k.tistory.com/135
angular.module('HelpmeAdminApp')
.directive('koreanInput', function () {
  return {
    priority: 2,
    restrict: 'A',
    compile: function (element) {
      element.on('compositionstart', function (e) {
        e.stopImmediatePropagation();
      });
    },
  };
})
// md-autocomplete에 사용
.directive('koreanInputChild', function ($timeout) {
  return {
    priority: 2,
    restrict: 'A',
    link: function (scope, element, attr) {

      scope.$on('$includeContentLoaded', (event) => {
        element.find('input').off('compositionstart');

        element.on('compositionstart', function (e) {
          e.stopImmediatePropagation();
        });
      });

    },
  };
});
