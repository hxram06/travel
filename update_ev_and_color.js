const fs = require('fs');
const cwd = 'C:/Users/PC/OneDrive/바탕 화면/여행/';
const { COURSES, START_LOCATION } = require(cwd + 'data.js');

const evMap = {
  '프라하': '프라하로 돌아와 카를교에서 환상적인 야경을 감상합니다. 근처 체코 전통 펍(Pivnice)에 들러 바삭한 꼴레뇨(Koleno)와 시원한 코젤 다크 생맥주로 하루의 피로를 날려보세요.',
  '할슈타트': '할슈타트로 귀환 후 호숫가 산책로를 걸으며 조용한 저녁을 맞이합니다. 든든한 송어 구이(Forelle)나 슈니첼로 저녁을 해결합니다.',
  '루체른': '루체른 호숫가의 카펠교 주변 야경을 감상하며 하루를 마무리합니다. 구시가지 골목에 위치한 퐁듀(Fondue) 레스토랑에서 따뜻한 치즈 퐁듀와 화이트 와인을 즐겨보세요.',
  '베네치아': '본섬으로 돌아와 리알토 다리 근처에서 대운하의 일몰을 바라봅니다. 저녁에는 운하 뷰의 분위기 좋은 바카로(Bacaro)에서 해산물 치케티(Cicchetti)와 아페롤 스프리츠(Aperol Spritz) 한 잔을 곁들입니다.',
  '바르셀로나': '바르셀로나로 돌아와 고딕 지구의 미로 같은 골목을 탐험합니다. 현지인들이 붐비는 타파스(Tapas) 바에서 감바스, 꿀대구와 함께 샹그리아를 마시며 스페인의 밤을 즐겨보세요.',
  '니스': '니스로 돌아와 프롬나드 데 장글레를 걸으며 지중해의 노을을 감상합니다. 해산물 레스토랑에서 신선한 니수아즈 샐러드와 홍합 요리(Moules Marinières), 로제 와인으로 마무리합니다.',
  '피렌체': '피렌체 두오모 광장의 야경을 보고, 미켈란젤로 언덕에 올라 피렌체 시내 전체의 로맨틱한 일몰과 불빛을 감상합니다. 저녁엔 묵직한 티본 스테이크(Bistecca alla Fiorentina)와 키안티(Chianti) 와인을 추천합니다.',
  '런던': '런던으로 돌아와 템스 강변을 따라 런던 아이와 빅벤 야경을 감상합니다. 소호(Soho) 거리의 활기찬 펍에 들러 에일 맥주와 함께 피시 앤 칩스, 셰퍼드 파이로 영국 현지의 밤을 만끽합니다.',
  '파리': '파리로 귀환 후 센강 유람선(바토무슈)을 타고 정각마다 반짝이는 에펠탑 화이트 에펠을 감상합니다. 마레 지구의 비스트로에서 어니언 스프와 달팽이 요리(Escargots)로 파리지앵의 저녁을 즐기세요.',
  '인터라켄': '인터라켄으로 돌아와 툰 호수나 브리엔츠 호수 주변을 가볍게 산책합니다. 스위스 뢰스티(Rösti) 맛집에서 바삭한 감자전 요리와 함께 융프라우의 웅장한 밤하늘 별을 감상해봅니다.',
  '마인츠': '마인츠 귀환 후 라인 강변을 따라 조용히 산책하며 밤공기를 쐽니다. 구시가지 광장 근처의 아늑한 바에서 마인츠 특산 리슬링 와인(Riesling) 한 잔과 소시지로 하루를 훌륭하게 마무리합니다.',
  '인스부르크': '인스부르크 알프스 산자락 아래 위치한 구시가지에서 황금지붕(Goldenes Dachl) 야경을 봅니다. 오스트리아 티롤 지방의 전통 음식인 슈트루델(Strudel)과 진한 커피로 휴식을 취해보세요.',
  '맨해튼': '맨해튼으로 돌아와 타임스퀘어의 화려한 네온사인과 브로드웨이의 열기를 온몸으로 느낍니다. 헬스 키친(Hells Kitchen) 근처 다이닝이나 뉴욕 3대 스테이크 하우스에서 완벽한 저녁 만찬을 즐깁니다.'
};

let modified = 0;
COURSES.forEach(c => {
  // Remove color
  delete c.color;
  
  c.days.forEach(d => {
    if (d.isTrip && d.baseCity) {
      if (evMap[d.baseCity]) {
        // Replace or append
        d.ev = d.ev + ' (야간 추천: ' + evMap[d.baseCity] + ')';
        modified++;
      }
    }
  });
});

let newDataOutput = 'const START_LOCATION = ' + JSON.stringify(START_LOCATION, null, 2) + ';\n\nconst COURSES = ' + JSON.stringify(COURSES, null, 2) + ';\n\nif (typeof module !== \'undefined\') { module.exports = { START_LOCATION, COURSES }; }\n';
fs.writeFileSync(cwd + 'data.js', newDataOutput, 'utf8');
console.log('Modified ' + modified + ' evening schedules.');
