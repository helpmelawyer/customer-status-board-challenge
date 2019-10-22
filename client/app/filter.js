angular.module('HelpmeAdminApp')
.constant('lib', (function () {
  return {
    pad(n, digits, character) {
      character = character || '0';
      n = n + '';
      return n.length >= digits ? n : new Array(digits - n.length + 1).join(character) + n;
    },
    toDate(date) {

      if (!date) {
        return '';
      }

      // NOTE 시간대 알아서 바꿔줘서 +9를 안해줘도 된다.
      return moment(date).format('YY.MM.DD');
    },
  };
})())
.filter('momentToDate', function () {
  return function (date) {
    return date ? moment(date).format('L') : '';
  };
})
.filter('unique', function () {
  return function (arr) {
    if (!arr) return [];

    return _.uniq(arr);
  };
})
// 통화 포맷 (1000 -> 1,000원)
.filter('currencyFormat', function () {

  function _convertNumberToCurrency(number) {

    let negative = false;
    let currency = number.toString();

    if (currency < 0) {
      negative = true;
      currency = currency.replace(/\-/g, '');
    }

    currency = currency.replace(/(?!^)(?=(?:\d{3})+$)/g, ',');

    return negative ? `-${currency}` : currency;
  }

  return function (input, float = false) {

    if (float) {
      input = Math.floor(input);
    }

    return (angular.isNumber(input) && !isNaN(input)) ? _convertNumberToCurrency(input) : '';
  };
})
.filter('currencyReadFormat', function () {

  function translateNumberToKorean(num, suffix) {
    var hanA = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십'];
    var danA = ['', '십', '백', '천'];
    var danGA = ['', '만', '억', '조', '경', '해', '자', '양', '구', '간', '정', '재', '극', '항하사', '아승기', '나유타', '불가사의', '무량대수', '겁', '업'];
    var danGAttachA = [];
    var result = '';
    for (var i = 0; i < num.length; i++) {
      var str = '';
      var han = hanA[num.charAt(num.length - (i + 1))];
      var danChk = Math.floor(i / 4);
      if (han !== '') {
        str += han;
        str += danA[i % 4];
        if (!danGAttachA[danChk]) {
          str += danGA[danChk] + ' ';
          danGAttachA[danChk] = true;
        }
      }
      result = str + result;
    }
    if (num != 0) {
      result = result + ' ' + (suffix || '원');
    }
    return result;
  }

  return function (input, suffix) {

    if (!input) return '';

    let _input = input;
    if (angular.isNumber(input)) {
      _input = input.toString();
    }

    return translateNumberToKorean(_input, suffix);
  };
})
// 초 단위의 시간을 MM:SS 단위로 변경
.filter('timeFormat', function (lib) {
  let _pad = lib.pad;

  return function (input, suffix) {
    if (input <= 0) {
      return null;
    }

    let min = parseInt(input / 60);
    let sec = _pad(input % 60, 2);

    return `${min}:${sec}${(suffix || '')}`;
  };
})
// JS date string을 YYYY.MM.DD 형태로 변경
.filter('dateFormat', function (lib) {
  return lib.toDate;
})
// JS date string을 YYYY.MM.DD HH:MM:SS 형태로 변경
.filter('dateTimeFormat', function () {
  return function (date, format) {
    if (!date) return '(없음)';
    return moment(date).format(typeof format === 'string' ? format : 'YY.MM.DD. HH:mm');
  };
})
// relative duedate from now
.filter('dueDate', function () {

  return function (date) {

    const _diff = moment().diff(date);

    const _duration = moment.duration(Math.abs(_diff));

    const [ _days, _hours, _minutes ] = [
      angular.isNumber(_duration.days()) ? `${_duration.days()}일 ` : '',
      angular.isNumber(_duration.hours()) ? `${_duration.hours()}시간 ` : '',
      angular.isNumber(_duration.minutes()) ? `${_duration.minutes()}분 ` : '',
    ];

    return `${_days}${_hours}${_minutes} ${_diff > 0 ? '지남' : '남음'}`;

    // return .fromNow();
  };

})
// 주민등록번호 등 포맷팅
.filter('regInfoFormat', function () {
  return function (input, regInfoType) {
    switch (regInfoType) {
      case '주민':
      case '법인':
        return input.replace(/(\d{6})(\d{7})/g, '$1-$2');
      default:
        return input;
    }
  };
})
// 주소 포맷 (주소 + 상세 주소 + 우편번호)
.filter('addressFormat', function () {
  return function (address) {
    if (!address) {
      return;
    }

    return `${address.basic} ${address.detail}(${address.postcode})`;
  };
})
// 연락처 포맷 (01x - xxxx - xxxx) TODO
.filter('contactFormat', function () {
  return function (contact) {
    return contact ? contact.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3') : '';
  };
})
.filter('booleanFormat', function () {

  return function (input) {
    if (angular.isUndefined(input) || input === null) {
      return '(없음)';
    } else {
      if (input === true) {
        return '<span class="value-true">O</span>';
      } else {
        return '<span class="value-false">X</span>';
      }
    }
  };

})
// null, undefined 등의 boolean 값들을 미리 지정된 기본값으로 바꿔줌.
.filter('defaultValueFormat', function (lib, $filter) {

  const WRAPPED_NONE_TEXT = '<span class="gray-color">(없음)</span>';

  const _dateFormatter = /^(\d{4})-(0[1-9]|1[0-2])-([0-2][0-9]|30|31)T([0-1][0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9])\.\d{3}Z$/;

  return function (input, defaultValue = {}) {
    if (angular.isUndefined(input)) {
      // TODO undefined인 경우 다 찾아서 서버에서 최대한 케이스가 없도록 해야 할듯.
      return defaultValue.valueUndefined || WRAPPED_NONE_TEXT;
    } else if (angular.isNumber(input)) {
      return input.toString();
    } else if (input === null) {
      // DB에 값이 없는 경우 null이 들어감
      return defaultValue.valueNull || WRAPPED_NONE_TEXT;
    } else if (input === true) {
      return defaultValue.valueTrue || 'true';
    } else if (input === false) {
      return defaultValue.valueFalse || 'false';
    } else {

      // JS Date string인지 확인하기
      let _possibleDateGroup = _dateFormatter.exec(input);
      if (_possibleDateGroup) {
        let _dateObject = moment(input);
        return _dateObject.format('YY/MM/DD HH:mm:ss');
      }

      return input;
    }
  };

})
.filter('nospace', function () {
  return function (value) {
    return (!value) ? '' : value.replace(/ /g, '');
  };
});
