
import Template from './tmpl.html';
import Controller from './controller';

const PageHeader = {
  bindings: {
    title: '<',
  },
  templateUrl: Template,
  controller: Controller,
  controllerAs: 'vm',
};

angular.module('HelpmeAdminApp').component('pageHeader', PageHeader);

export default PageHeader;
