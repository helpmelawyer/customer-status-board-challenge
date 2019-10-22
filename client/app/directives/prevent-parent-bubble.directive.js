

angular.module('HelpmeAdminApp')
.directive('preventParentBubble', function ($rootScope) {
  return {
    link: function (scope, element, attrs) {
      // editableTextarea model이 바뀔 때마다 안의 a태그를 찾아서 이벤트를 심어준다.
      scope.$watch(() => scope.$eval(attrs.editableTextarea), function (value) {

        scope.$evalAsync(() => {
          element.find('a').on('click', function (event) {
            event.stopPropagation();
          });
        });

      });
    },
  };
});
