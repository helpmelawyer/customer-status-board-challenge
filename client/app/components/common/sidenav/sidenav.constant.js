angular.module('HelpmeAdminApp')
.constant('ROOT_SIDENAV_SECTIONS', [{
  name: '법인등기',
  type: 'heading',
  children: [{
    name: '등기팀 현황판',
    type: 'link',
    stateName: 'root.corpreg.progressSummary',
  }],
}]);
