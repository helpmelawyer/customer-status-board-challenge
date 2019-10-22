
const request = require('request-promise');

var config = require('../../config');

const _cachedPrefetchResults = {};

function prefetchAdminMe(req, res, next) {

  const _authToken = req.headers.authorization;

  if (_cachedPrefetchResults[_authToken]) {
    req._me = _cachedPrefetchResults[_authToken];
    return next();
  }

  request({
    method: 'get',
    uri: config.internalServices.backend.server.hostname + '/api/admin/common/users/me',
    headers: {
      'Authorization': _authToken,
    },
  })
  .then(function (resBackend) {
    // 성공
    _cachedPrefetchResults[_authToken] = req._me = resBackend;
    next();
    return null;
  })
  .catch(function (err) {
    return res.status(401).json(err);
  });
}

exports.prefetchAdminMe = prefetchAdminMe;
