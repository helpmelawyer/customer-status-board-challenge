
import Template from './tmpl.html';
import Controller from './controller';

const PageUtils = {
  bindings: {
    title: '<',
    searchableItems: '<',
  },
  templateUrl: Template,
  controller: Controller,
  controllerAs: 'vm',
};

angular.module('HelpmeAdminApp').component('pageUtils', PageUtils);

export default PageUtils;
