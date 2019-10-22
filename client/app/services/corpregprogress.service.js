angular.module('HelpmeAdminApp')
.factory('CorpRegProgress', function (Restangular) {

  const MODEL_PATH = 'progresses';

  Restangular.extendModel(MODEL_PATH, function (model) {

    Object.defineProperty(model, 'held', {
      get: function () {
        return _.get(this, 'status.subCode') === '__WAITING_FOR_FOLLOW_UP_REGISTRATION__';
      },
      set: function (v) {
        if (v) {
          _.set(this, 'status.subCode', '__WAITING_FOR_FOLLOW_UP_REGISTRATION__');
        } else {
          // 일단 held = false는 status.subCode를 다시 ''로 만드는 것을 가정한다.
          _.set(this, 'status.subCode', '');
        }
      },
    });

    Object.defineProperty(model, 'has설립', {
      get: function () {
        return this.registrationType.includes('설립');
      },
    });

    return model;
  });

  return Object.assign(Restangular.service(MODEL_PATH), {
    MODEL_PATH: MODEL_PATH,
  });
});
