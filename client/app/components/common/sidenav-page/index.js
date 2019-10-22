
import Template from './tmpl.html';

const SidenavPage = {
  bindings: {
    header: '<',
    utils: '<',
    table: '<',
  },
  templateUrl: Template,
};

angular.module('HelpmeAdminApp').component('sidenavPage', SidenavPage);

export default SidenavPage;
