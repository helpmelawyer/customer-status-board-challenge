/**
 * 한글 글자 조합 시엔 이벤트가 발생하지 않게 하기
 * @see https://stackoverflow.com/questions/27663149/angularjs-trigger-ng-change-ng-keyup-or-scope-watch-while-composing-korean-c/27735677#27735677
 */
angular.module('HelpmeAdminApp')
  .directive('ignoreCompositionEvent', function() {
    return {
      restrict: 'A',
      require: '^ngModel',
      scope: {
        ngModel: '=', // sync model
      },
      link: function(scope, element, attrs, ngModel) {
        element.on('input', function() {
          scope.ngModel = element.val();
        });
      }
    };
  });