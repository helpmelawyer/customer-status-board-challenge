
import Template from './tmpl.html';

angular.module('HelpmeAdminApp')
.directive('menuToggle', ['$mdUtil', '$animateCss', '$$rAF', function ($mdUtil, $animateCss, $$rAF) {
  return {
    scope: {
      section: '=',
      isSectionOpen: '=isOpen',
      toggleOpen: '=',
    },
    templateUrl: Template,
    link: function ($scope, $element) {

      // Used for toggling the visibility of the accordion's content, after
      // all of the animations are completed. This prevents users from being
      // allowed to tab through to the hidden content.
      $scope.renderContent = false;

      $scope.isOpen = function () {
        return $scope.isSectionOpen($scope.section);
      };

      $scope.toggle = function () {
        $scope.toggleOpen($scope.section);
      };

      $mdUtil.nextTick(function () {
        $scope.$watch(function () {
          return $scope.isOpen($scope.section);
        }, function (open) {
          var $ul = $element.find('ul');
          var $li = $ul[0].querySelector('a.active');

          if (open) {
            $scope.renderContent = true;
          }

          $$rAF(function () {
            var targetHeight = open ? $ul[0].scrollHeight : 0;

            $animateCss($ul, {
              easing: 'cubic-bezier(0.35, 0, 0.25, 1)',
              to: { height: targetHeight + 'px' },
              duration: 0.75, // seconds
            }).start().then(function () {
              var $li = $ul[0].querySelector('a.active');

              $scope.renderContent = open;

              if (open && $li && $ul[0].scrollTop === 0) {
                var activeHeight = $li.scrollHeight;
                var activeOffset = $li.offsetTop;
                var offsetParent = $li.offsetParent;
                var parentScrollPosition = offsetParent ? offsetParent.offsetTop : 0;

                // Reduce it a bit (2 list items' height worth) so it doesn't touch the nav
                var negativeOffset = activeHeight * 2;
                var newScrollTop = activeOffset + parentScrollPosition - negativeOffset;

                var element = document.querySelector('.docs-menu');
                if (element) {
                  $mdUtil.animateScrollTo(element.parentNode, newScrollTop);
                }
              }
            });
          });
        });
      });
    },
  };
}]);
