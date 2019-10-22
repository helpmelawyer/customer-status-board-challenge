
import Template from './tmpl.html';
import Controller from './controller';

const CorpregProgressSummaryView = {
  bindings: {
  },
  templateUrl: Template,
  controller: Controller,
};

angular.module('HelpmeAdminApp').component('corpregProgressSummaryView', CorpregProgressSummaryView);

export default CorpregProgressSummaryView;
