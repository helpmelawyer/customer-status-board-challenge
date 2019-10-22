var errmgr = function() {
  var self = this;
  self.types = {

    NOT_FOUND:  'NOT_FOUND',
    CONFLICT:   'CONFLICT',

    REQUIRED:   'REQUIRED',
    FORMAT_ERR: 'FORMAT_ERR',
    INVALID:    'INVALID',
    TOO_SHORT:  'TOO_SHORT',
    TOO_LONG:   'TOO_LONG',
    BAN_WORD:   'BAN_WORD',

    NOT_MATCHED: 'NOT_MATCHED',
    TYPE_ERR:   'TYPE_ERR',
  };
  self.codes = {

    UNKNOWN:    5000,

    NOT_FOUND:  4004,
    CONFLICT:   4009,

    REQUIRED:   4100,
    FORMAT_ERR: 4101,
    INVALID:    4102,
    TOO_SHORT:  4103,
    TOO_LONG:   4104,
    BAN_WORD:   4105,

    NOT_MATCHED:  4106,
    TYPE_ERR:     4107
  };
  self.typeToCode = function(type) {
    return self.codes[type] || self.codes.UNKNOWN;
  };

  this.parse = function(mongooseError) {
    var _errors = [];
    for(var i in mongooseError.errors) {
      var _error = {
        path: mongooseError.errors[i].path,
        value: mongooseError.errors[i].value,
        type: mongooseError.errors[i].message,
        code: self.typeToCode(mongooseError.errors[i].message),
      }
      _errors.push(_error);
    }
    return _errors;
  };
};

module.exports = new errmgr();
