
import * as vendor from './vendor.js';

import './app/app.scss';

import HelpmeAdminApp from './app/index';

import './app/constant';
import './app/filter';
import './app/services';
import './app/directives';

import './app/components';
import './app/views';

import { patchMoment } from './app/vendor/moment-ko';

/* eslint-disable angular/window-service */
Object.assign(window, vendor);
// NOTE: mdPicker라는 구닥다리 모듈이 moment를 window에서 참조해준다. 그래서 window에 직접 assign.
patchMoment(window.moment);

HelpmeAdminApp
.config(function (
  $provide,
  $urlRouterProvider,
  $locationProvider,
  $httpProvider,
  $mdThemingProvider,
  $mdAriaProvider,
  $mdDateLocaleProvider,
  RestangularProvider,
  BACKEND) {

  // angular-material 테마 지정
  $mdThemingProvider.definePalette('adminColor', {
    '50': 'e8f0f8',
    '100': 'c5daed',
    '200': '9fc1e2',
    '300': '78a8d6',
    '400': '5b96cd',
    '500': '3e83c4',
    '600': '387bbe',
    '700': '3070b6',
    '800': '2866af',
    '900': '1b53a2',
    'A100': 'd9e7ff',
    'A200': 'a6c8ff',
    'A400': '73a9ff',
    'A700': '5999ff',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': [
      '50',
      '100',
      '200',
      '300',
      '400',
      'A100',
      'A200',
      'A400',
      'A700',
    ],
    'contrastLightColors': [
      '500',
      '600',
      '700',
      '800',
      '900',
    ],
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('adminColor')
    .accentPalette('pink');


  // RestangularProvider.setDefaultHttpFields({cache: true});
  RestangularProvider.setBaseUrl(BACKEND.HOSTNAME + '/api');

  RestangularProvider.addFullRequestInterceptor(function (element, operation, route, url, headers, params) {

    switch (operation.toLowerCase()) {
      case 'put':
        // model.put(['param1', 'param2']) ...
        if (Array.isArray(params)) {
          return {
            element: Object.assign({}, _.pick(element, params), { __v: undefined }),
            params: {},
          };
        } else {
          return {
            element: Array.isArray(element) ? element : Object.assign({}, element, { __v: undefined }),
          };
        }
      default:
        return {
          element: element,
        };
    }
  });

  // trailing slash 제거
  $urlRouterProvider.rule(function ($injector, $location) {
    var _path = $location.path();

    // 마지막 글자가 '/' 이면
    if (_path.slice(-1) === '/') {
      // 마지막 글자 제거 후 리턴.
      return _path.slice(0, -1);
    }

  });

  $urlRouterProvider.otherwise('/');

  // /#!/foo/bar 대신 /foo/bar 사용
  $locationProvider.html5Mode(true);

  // aria warning disable
  $mdAriaProvider.disableWarnings();

  moment.updateLocale('ko');

  $mdDateLocaleProvider.formatDate = function (date) {
    return date ? moment(date).format('YYYY. MM. DD') : '';
  };

  // NOTE: exception / rejection 핸들링
  // https://www.loggly.com/blog/angularjs-exception-logging-made-simple/
  $provide.decorator('$exceptionHandler', function ($delegate, $injector) {

    const REJECTION_MAGIC_STRING = 'Possibly unhandled rejection: ';

    return function (exception, cause) {

      // Removal of 'possibly unhandled rejection' from exception string
      let stringifiedException = null;
      let objectifiedException = null;

      if (!angular.isString(exception)) {
        stringifiedException = exception.message || exception.toString();
      } else if (exception.includes(REJECTION_MAGIC_STRING)) {
        stringifiedException = exception.replace(REJECTION_MAGIC_STRING, '');
      } else {
        stringifiedException = exception;
      }

      /* eslint-disable angular/definedundefined */
      if (stringifiedException === 'undefined') return;

      try {
        objectifiedException = angular.fromJson(stringifiedException);
      } catch (err) {
        console.warn(err);
      }

      // objectifiedException이 있는 경우는 rejection이다.
      // rejection.status 401, -1인 경우 핸들링
      if (objectifiedException && objectifiedException.status) {
        switch (objectifiedException.status) {
          case -1:
          case 401:
            return;
        }
      }

      $delegate(exception, cause);
    };
  });

})
.run(function ($rootScope, $cookies, $transitions, $timeout, $window, $q, editableOptions) {

  Math.floorBy = function (n, base) {
    return Math.floor(n / base) * base;
  };

  Math.ceilBy = function (n, base) {
    return Math.ceil(n / base) * base;
  };

  String.random = function _makeRandomString(N = 10) {
    const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.apply(null, Array(N)).map(function () { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
  };

  editableOptions.cancelButtonTitle = '취소';
  editableOptions.submitButtonTitle = '저장';

  // SEE: https://stackoverflow.com/questions/35629246/typescript-async-await-and-angular-q-service/41825004#41825004
  $window.Promise = $q;

  // determining mobile or desktop site inside scope
  $rootScope.viewType = $window._isMobile ? 'mobile' : 'desktop';
  $rootScope.visitor = null;


  $rootScope.isSidenavOpen = true;
  const MIN_WIDTH_THRESHOLD_TO_SHOW_SIDENAV = 1150;
  $window.addEventListener('resize', function ({ currentTarget }) {
    const _isSidenavOpen = currentTarget.innerWidth > MIN_WIDTH_THRESHOLD_TO_SHOW_SIDENAV;

    if ($rootScope.isSidenavOpen !== _isSidenavOpen) {
      $timeout(() => {
        $rootScope.isSidenavOpen = _isSidenavOpen;
      });
    }
  });

  $transitions.onSuccess({
    to: '**',
  }, function (transition) {
    if ($rootScope.visitor) {
      $rootScope.visitor.pageview($window.location.pathname).send();
    }
  });

});
