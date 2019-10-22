angular.module('HelpmeAdminApp')
.config(function ($stateProvider) {

  $stateProvider
  .state('root.corpreg', {
    url: 'corpreg',
    abstract: true,
  })

  .state('root.corpreg.progressSummary', {
    url: '/progress-summaries',
    views: {
      'page@root': 'corpregProgressSummaryView',
    },
  });

});
