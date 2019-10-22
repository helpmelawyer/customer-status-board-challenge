angular.module('HelpmeAdminApp')
.directive('bindHtml', function ($compile, $interpolate, $state) {
  return {
    restrict: 'A',
    scope: {
      item: '=bindHtmlItem',
      htmlContent: '=bindHtmlContent',
      compile: '=bindHtmlCompile',
      interpolate: '=bindHtmlInterpolate',
      onClick: '&bindHtmlOnClick',
      callback: '&bindHtmlCallback',
    },
    link: function (scope, element, attrs) {

      scope.$watch(function () {
        return scope.htmlContent;
      }, function (value) {

        // htmlContent 가져와서 세팅
        element.html(scope.htmlContent);

        // TODO 장기적으로 interpolate는 없앨 예정.
        if (scope.compile || scope.interpolate) {
          // compile=true인 경우
          $compile(element.children())(scope);
        }

      });

    },
  };
});
