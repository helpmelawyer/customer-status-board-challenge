
/* @ngInject */
export default class ProgressSummaryController {

  constructor($q, $timeout, ErrorReportingService, CorpRegProgress, TaskCard) {

    this.$q = $q;
    this.$timeout = $timeout;
    this.TaskCard = TaskCard;
    this.CorpRegProgress = CorpRegProgress;
    this.ErrorReportingService = ErrorReportingService;

    this.progresses = [];
    this.taskCards = [];
    this.selectedProgressIds = [];

    // 담당자
    this.usersWithRole = [];

    // because angularjs assigns $$hashKey here
    this._frontManagerTaskCardsToShow = [
      { name: '입금' },
      { name: '폼2 수신' },
      { name: '신청서 확인요청' },
      { name: '서류작성 요청' },
      { name: '서명 요청 서류 발송' },
      { name: '서명 완료 서류 검증' },
      { name: '제출' },
      { name: '보정' },
      { name: '완료' },
    ];


    this._progressPriorities = [{
      label: '0 - 최우선',
      value: '__1ST_PRIORITY__',
    }, {
      label: '1 - 재촉',
      value: '__2ND_PRIORITY_URGENT_REQUEST__',
    }, {
      label: '2 - SC',
      value: '__3RD_PRIORITY_SPECIAL_CUSTOMER__',
    }, {
      label: '보통',
      value: '__NORMAL__',
    }];

    this.sortBy = '폼2 들어온 순(기본)';
    this.filterBy = {
      userId: null,
      priority: null,
      uncheckedCardAliases: null,
    };

    this.init();
  }

  get progressPriorities() {
    return this._progressPriorities;
  }

  get sortCriterias() {
    return ['우선순위 순', '원인일자 순', '폼2 들어온 순(기본)', '입금일자 순', '교합완료일자 순', '교합완료일자 순(설립여부로 모아보기)', '세금계산서 발행일자 순(설립여부로 모아보기)', 'r번호 순'];
  }

  get TASK_CARDS_TO_SHOW_STATUS() {
    return this._frontManagerTaskCardsToShow;
  }

  get checkedTaskCards() {
    return this.taskCards.filter(card => card.checked);
  }

  isProgressFilteredOut(progress) {
    if (this.filterBy.priority) {
      if (progress.priority !== this.filterBy.priority) return true;
    }
    if (this.filterBy.uncheckedCardAliases) {
      const uncheckedCards = this.taskCards.filter(card => {
        return card.ref.progress === progress.id && this.filterBy.uncheckedCardAliases.includes(card.alias.name) && !card.checked;
      });
      if (!uncheckedCards.length) return true;
    }

    return false;
  }

  async reload() {
    await this.loadProgress();
    this.sortProgress();
  }

  async init() {
    try {
      await this.loadProgress();
      this.sortProgress();

    } catch (err) {
      this.ErrorReportingService.logException(err);
    }
  }

  async loadProgress() {
    this.progresses = [];
    this.taskCards = [];

    try {
      this.progresses = await this.CorpRegProgress.getList();
      if (this.progresses.length < 1) return;
      this.taskCards = await this.TaskCard.getList({});

    } catch (err) {
      this.ErrorReportingService.logException(err);
    }
  }

  _onPartialTaskCardLoad(cards) {
    this.taskCards.push(...cards);
  }

  sortProgress() {

    const _sortByCardAlias = (cardAlias, groupBy설립여부 = false) => {
      this.progresses = this.progresses.sort((progressA, progressB) => {

        if (groupBy설립여부) {
          if (progressA.has설립 && !progressB.has설립) return -1;
          if (!progressA.has설립 && progressB.has설립) return 1;
        }

        const _findCard = prog => this.checkedTaskCards.find(card => card.ref.progress === prog.id && card.alias.name === cardAlias);

        const cardA = _findCard(progressA);
        const cardB = _findCard(progressB);

        if (!cardA || !cardA.checked) {
          return 1;
        } else if (!cardB || !cardB.checked) {
          return -1;
        } else {
          return cardA.checkedAt < cardB.checkedAt ? -1 : 1;
        }

      });
    };

    switch (this.sortBy) {
      case '우선순위 순':
        this.progresses = this.progresses.sort((progressA, progressB) => {

          const _getIndex = prog => this.progressPriorities.findIndex(p => p.value === prog.priority);

          const indexA = _getIndex(progressA);
          const indexB = _getIndex(progressB);

          if (indexA === -1) {
            return 1;
          } else if (indexB === -1) {
            return -1;
          } else {
            return indexA < indexB ? -1 : 1;
          }

        });
        break;
      case '원인일자 순':
        this.progresses = this.progresses.sort((progressA, progressB) => {

          const _getDate = prog => _.get(prog, 'meta.등기원인일자');

          const dateA = _getDate(progressA);
          const dateB = _getDate(progressB);

          if (!dateA) {
            return 1;
          } else if (!dateB) {
            return -1;
          } else {
            return dateA.checkedAt < dateB.checkedAt ? -1 : 1;
          }

        });
        break;
      case 'r번호 순':
        this.progresses = this.progresses.sort((progressA, progressB) => {

          const _getSeq = prog => `${prog.corp.meta.corpGroupSeq}-${prog.corp.seq}-${prog.seq}`;

          const seqA = _getSeq(progressA);
          const seqB = _getSeq(progressB);
          return seqA.localeCompare(seqB);

        });
        break;
      case '폼2 들어온 순(기본)':
        return _sortByCardAlias('폼2 수신');
      case '입금일자 순':
        return _sortByCardAlias('입금');
      case '교합완료일자 순':
        return _sortByCardAlias('등기 완료', false);
      case '교합완료일자 순(설립여부로 모아보기)':
        return _sortByCardAlias('등기 완료', true);
      case '세금계산서 발행일자 순(설립여부로 모아보기)':
        return _sortByCardAlias('영수증 발행', true);
    }

  }


  async _postMessageRequestedTimelineMessage(progresses, name = '') {
  }

  async sendRequestMessage(type, name) {
  }

  selectProgressId(progressId) {
    if (this.selectedProgressIds.includes(progressId)) {
      _.remove(this.selectedProgressIds, p => p === progressId);
    } else {
      this.selectedProgressIds.push(progressId);
    }
  }

  getCard(progress, name) {
    return this.taskCards.find(card => card.ref.progress === progress.id && name === card.alias.name);
  }

  async toggleProgressHeld(progress) {
    progress.held = !progress.held;
  }

  checkChecklistIsDone({ items = [] } = {}) {
    if (!items.length) return false;
    return items.filter(c => c.checked).length === items.length;
  }

  getForm2Checklist({ checklists = [] } = {}) {
    return checklists.find(checklist => checklist.title.includes('폼2'));
  }

  isFiltering() {
    return Object.values(this.filterBy).some(v => !!v);
  }

}

angular.module('HelpmeAdminApp')
.controller('ProgressSummaryController', ProgressSummaryController);
