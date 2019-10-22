
/* @ngInject */
class MaterialToast {

  constructor($mdToast) {
    this.$mdToast = $mdToast;
  }

  show(message) {

    this.$mdToast.show(
      this.$mdToast.simple()
        .textContent(message)
        .position('bottom right')
        .hideDelay(3000)
    );

  }
}

angular.module('HelpmeAdminApp')
.service('MaterialToastService', MaterialToast);
