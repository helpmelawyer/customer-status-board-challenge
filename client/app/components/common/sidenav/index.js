
import Template from './tmpl.html';
import Controller from './controller';

const Sidenav = {
  bindings: {
    componentId: '<',
  },
  templateUrl: Template,
  controller: Controller,
};

angular.module('HelpmeAdminApp').component('sidenav', Sidenav);

export default Sidenav;
