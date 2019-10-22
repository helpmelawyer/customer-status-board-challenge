

angular.module('HelpmeAdminApp')
.config(function ($stateProvider) {

  $stateProvider
  .state('root', {
    url: '/',
    views: {
      '@': 'sidenavPage',
      'sidenav@root': 'sidenav',
    },
    resolve: {
      componentId: () => 'left',
    },
  });
});
