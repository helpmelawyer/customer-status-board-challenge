
angular.module('HelpmeAdminApp')
.filter('remainingChecklistCount', function () {

  return function ({ items = [] } = {}) {

    return `${items.filter(c => c.checked).length}/${items.length}`;
  };

})
.filter('progressSummaryMemo', function () {

  return function (memo) {
    if (!memo || !memo.text) return '(-)';

    return memo.text;
  };

})
.filter('progressSummaryFilterUnusedTags', function () {
  return function (tags = []) {
    return tags.filter(tag => !tag.startsWith('GHL-'));
  };
})
.filter('progressSummaryFilterUsefulTags', function () {
  return function (tags = []) {
    return tags.filter(tag => ['전자', 'e폼', '공증'].includes(tag)).join(',');
  };
})
.filter('progressSummaryDueDate', function () {

  return function (progress) {
    const 등기원인일자 = _.get(progress, '원인일자');
    if (!등기원인일자) return '';

    const dateDifference = moment().startOf('day').diff(moment(등기원인일자).startOf('day'), 'days');

    const dDay = dateDifference >= 0 ? `(D+${dateDifference})` : `(D${dateDifference})`;

    if (dateDifference > 0) {
      return `<span class="red-accent-color">${dDay}</span>`;
    } else if (dateDifference > -3) {
      return `<span class="red-accent-color">${dDay}</span>`;
    } else if (dateDifference > -7) {
      return `<span class="warning-color">${dDay}</span>`;
    } else {
      return `<span>${dDay}</span>`;
    }


  };

})
.filter('progressFullSeqWithCorp', function () {
  return function (prog) {
    return `r${prog.sequence.x}-${prog.sequence.y}-${prog.sequence.z}`;
  }
})
.filter('corpNameWithStar', function () {
  return function (prog) {
    return prog.corporationName;
  }
})
.filter('exclamationHighlight', function () {

  return function (text) {
    if (!text) return '';

    // !!!!!!!!!!!
    const _exclamationCount = (text.match(/!/g) || []).length;
    if (_exclamationCount > 3) {
      return `<span class="bold highlighted">${text}</span>`;
    } else {
      return text;
    }
  };

});
