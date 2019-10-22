

angular.module('HelpmeAdminApp')
.directive('pageScrollToTop', function ($rootScope, $transitions) {
  return {
    link: function (scope, element, attrs) {

      const unsubscribe = $transitions.onSuccess({
        to: '*',
      }, function (transition) {
        element[0].scrollTop = 0;
      });

      scope.$on('$destroy', unsubscribe);
    },
  };
});
