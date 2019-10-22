
/* @ngInject */
angular.module('HelpmeAdminApp')
.service('MaterialDialogService', class MaterialDialog {

  constructor($mdDialog, $rootElement, $q, ErrorReportingService) {
    this.$mdDialog = $mdDialog;
    this.$rootElement = $rootElement;
    this.$q = $q;
    this.ErrorReportingService = ErrorReportingService;
  }

  show(template, $scope, options = {}) {

    let _template = template;

    // NOTE: polyfill for angular/material2 mdDialog panelClass
    // SEE: https://github.com/angular/material2/commit/28c936f122bd5a2dd0afd6353cdc001d051e6e49
    if (options.panelClass) {
      _template = `<md-dialog class="${options.panelClass}">${template}</md-dialog>`;
      options.autoWrap = false;
    }

    const $mdDialog = this.$mdDialog;

    return this.$mdDialog.show(angular.extend({
      template: _template,
      controller: function () {

        const dialog = this;

        dialog.cancel = function () {
          $mdDialog.cancel();
        };

        dialog.hide = function (params) {
          $mdDialog.hide(params);
        };

        return dialog;
      },
      controllerAs: 'dialog',
      scope: $scope,
      preserveScope: true,
      parent: this.$rootElement,
      clickOutsideToClose: true,
      multiple: true,
    }, options))
    // if dialog closes, it returns null.
    .catch((e) => {
      if (!e || !e.message) return null;

      return this.ErrorReportingService.logException(e);
    });

  }

});
