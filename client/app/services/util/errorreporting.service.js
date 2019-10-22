

const ErrorReportMode = {
  WEBHOOK: '__WEBHOOK__',
  // NOTIFICATION: '__NOTIFICATION__',
};

/* version admin-1.1 */
/* @ngInject */
export default class ErrorReportingService {

  constructor($window, $http, $timeout, Restangular) {
    Object.assign(this, { $http, $timeout });

    this.ignoreError = false;
    this.userFullName = null;

    this.slackHookUrl = '';
    this.mode = ErrorReportMode.WEBHOOK;
  }

  // SEE: https://docs.angularjs.org/api/ng/service/$http arguments of errorCallback is NOT an Error object.
  _isAngularHTTPResponse(e) {
    return e.status && e.xhrStatus && e.config;
  }

  async log(headline, text, attachments = []) {

    try {
      const response = await this.$http({
        url: this.slackHookUrl,
        method: 'POST',
        data: {
          text: `${headline} @ ${this.userFullName}\n${text}`,
          attachments: attachments,
        },
        // SEE: https://stackoverflow.com/questions/45752537/slack-incoming-webhook-request-header-field-content-type-is-not-allowed-by-acce
        headers: {
          'Content-Type': undefined,
        },
        config: {
          // NOTE: config.externalService가 true일 때는 authInterceptor가 작동하지 않는다.
          externalService: true,
        },
      });

      return response;

    } catch (e) {
      // TODO: handle some error...
      console.error(e);
    }

  }

  async logMessage(msg, data) {
    console.log(msg);
    return this.log('[MSG]', msg, [{
      title: '```' + JSON.stringify(data) + '```',
    }]);
  }

  async logException(e) {
    if (!e) return;

    console.error(e);

    // 1000ms에 1번 이상 들어오는 에러는 무시한다.
    if (this.ignoreError) return;
    this.ignoreError = true;
    this.$timeout(() => (this.ignoreError = false), 1000);

    if (angular.isString(e)) {
      return this.log('[ERROR]', e);
    }

    if (this._isAngularHTTPResponse(e)) {

      const attachments = [{
        title: 'Request',
        fields: [{
          title: '',
          value: `${e.config.method} ${e.config.url}`,
        }],
      }, {
        title: 'Response',
        fields: [{
          title: 'statusCode',
          value: e.status,
        }, {
          title: '',
          value: e.statusText,
        }, {
          title: 'xhrStatus',
          value: e.xhrStatus,
        }],
      }];

      return this.log('[HTTP Reponse != 20x]', '', attachments);
    }

    console.error(e);
  }
}

angular.module('HelpmeAdminApp')
.service('ErrorReportingService', ErrorReportingService);
