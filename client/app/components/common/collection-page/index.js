
import Template from './tmpl.html';

const CollectionPage = {
  bindings: {
    header: '<',
    utils: '<',
    table: '<',
  },
  templateUrl: Template,
};

angular.module('HelpmeAdminApp').component('collectionPage', CollectionPage);

export default CollectionPage;
