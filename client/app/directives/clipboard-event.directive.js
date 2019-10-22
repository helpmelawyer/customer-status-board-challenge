
angular.module('HelpmeAdminApp')
.directive('clipboardEvent', function ($parse, $window, DelayedExecution) {
  return {
    restrict: 'A',
    scope: {
      clipboardTarget: '=',
    },
    link: function (scope, element, attrs) {
      const clipboard = new window.Clipboard(element[0], {
        text: function () {
          return scope.clipboardTarget;
        },
      });

      clipboard.on('success', function (e) {
        DelayedExecution.showToast(attrs.afterMessage || '항목을 복사하였습니다.');
      });

      clipboard.on('error', function (e) {
        alert(e.text);
      });

    },
  };
});
