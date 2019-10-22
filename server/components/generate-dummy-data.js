
const CUSTOMER_COUNT = 2000;
const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const rand = (max, min = 0) => Math.floor(Math.random() * 100 * max) % (max - min) + min;
const randStr = (N = 10) => {
  return Array.apply(null, Array(N)).map(function () { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
};

const TASKS = [
  '입금',
  '폼2 수신',
  '신청서 확인요청',
  '서류작성 요청',
  '서명 요청 서류 발송',
  '서명 완료 서류 검증',
  '제출',
  '보정',
  '완료',
];

function generateCards(progressId) {
  const cardExistence = rand(TASKS.length, 1);
  const progress = rand(TASKS.length, cardExistence);
  const data = [];

  for (let i = 0; i < cardExistence; i++) {
    const _checked = i > progress ? false : true;
    data.push({
      "ref": {
        "progress": progressId,
      },
      "alias": {
        "name": TASKS[i],
      },
      "checked": _checked,
      "checkedAt": _checked && new Date(),
      "createdAt": new Date(),
    });
  }

  return data;
}

module.exports = function generateDummyData() {
  const data = [];
  const cards = [];

  for (let i = 0; i < CUSTOMER_COUNT; i++) {
    const id = rand(10000000, 1000000);
    data.push({
      "id": id,
      "priority": "__NORMAL__",
      "contactName": `담당자_${randStr(6)}`,
      "corporationName": `회사_${randStr(6)}`,
      "sequence": {
        "x": i + 1,
        "y": rand(1, 5),
        "z": rand(1, 8),
      },
      "assignedTeamName": `기업법무 ${rand(1, 4)}팀`,
      "createdAt": new Date(rand(1571000000000, Date.now())),
      "fmMemo": "메모메모",
      "bmMemo": "메모메모",
      "원인일자": new Date(rand(1571000000000, Date.now())),
      "held": rand(4) % 2 === 0 ? true : false,
      "registrationType": `${rand(4) % 2 === 0 ? '전자' : 'e폼'} ${rand(4) % 2 === 0 ? '설립' : '변경'}등기`,
    });
    cards.push(...generateCards(id));
  }

  return {
    progresses: data,
    cards: cards,
  };
};