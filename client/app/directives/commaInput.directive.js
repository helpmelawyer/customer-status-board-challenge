angular.module('HelpmeAdminApp')
.directive('commaInput', function ($filter) {

  const currencyFormatter = $filter('currencyFormat');

  return {
    require: 'ngModel',
    priority: 2,
    restrict: 'A',
    scope: true,
    link: function (scope, element, attrs, ngModel) {

      scope.$watch(attrs.ngModel, (value) => {
        ngModel.$setViewValue(currencyFormatter(value));
        ngModel.$render();
      });

      ngModel.$formatters.push(currencyFormatter);
      ngModel.$parsers.push(function (value) {
        const valueAsNumber = parseInt(value.replace(/[^\d]/g, ''));
        if (isNaN(valueAsNumber)) {
          return 0;
        } else {
          return valueAsNumber;
        }
      });

    },
  };
});
