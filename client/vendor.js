/* eslint-disable no-unused-vars */

import 'babel-polyfill';

import _ from 'lodash';
import moment from 'moment';
import clipboard from 'clipboard';

import { josa } from 'josa';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngMessages from 'angular-messages';
import ngSanitze from 'angular-sanitize';
import ngElastic from 'angular-elastic';
import ngMarked from 'angular-marked';
import restangular from 'restangular';
import ngMaterial from 'angular-material';
import ngMaterialDataTable from 'angular-material-data-table';
import ngMaterialIcons from 'angular-material-icons';
import ngEditable from 'angular-xeditable';
import ngFileUpload from 'ng-file-upload';
import ngTagsInput from 'ng-tags-input';
import mdPickers from 'mdPickers';
import perfectScrollbar from 'perfect-scrollbar';
import platformJs from 'platform';
import ngStorage from 'ngstorage';
import uiMention from 'angular-ui-mention';
import sha256 from 'js-sha256';
import escapeStringRegexp from 'escape-string-regexp';
import uuidv4 from 'uuid/v4';

import 'angular-material/angular-material.scss';
import 'angular-material-data-table/dist/md-data-table.min.css';
import 'angular-material-icons/angular-material-icons.css';
import 'angular-xeditable/dist/css/xeditable.min.css';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

import 'angular-i18n/angular-locale_ko-kr';

import validator from 'validator';

export {
  escapeStringRegexp,
  josa,
  angular,
  validator,
  moment,
  clipboard as Clipboard,
  perfectScrollbar as Ps,
  _ as lodash,
  sha256,
  uuidv4,
};
