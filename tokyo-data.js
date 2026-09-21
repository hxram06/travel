/* Course 11: one itinerary, explicit places and transport legs. Times without a
 * booked service are targets, never fabricated departure-board times. */
const TOKYO = (() => {
  const place = (name, lng, lat, extra = {}) => ({ name, coords: [lng, lat], ...extra });
  const places = {
    disneyCastle: place('디즈니랜드 신데렐라성', 139.88091, 35.63299),
    shinjukuSouth: place('신주쿠역 남쪽 출구', 139.70087, 35.68942),
    ginzaFujiya: place('긴자 스키야바시 거리', 139.76264, 35.67278),
    narita: place('나리타공항', 140.3848, 35.7648),
    keisei: place('게이세이우에노역', 139.77316, 35.71187),
    ueno: place('JR 우에노역', 139.77704, 35.71371),
    ameyoko: place('아메요코', 139.77457, 35.71016, { photo: 'ueno' }),
    asakusa: place('아사쿠사역', 139.79765, 35.71006),
    sensoji: place('센소지 · 가미나리몬', 139.79671, 35.71476, { source: 'https://www.senso-ji.jp/' }),
    tamachi: place('JR 다마치역', 139.74755, 35.64574),
    tamachiEast: place('다마치역 시바우라구치', 139.74804, 35.64545),
    hotel: place('호텔 빌라 퐁텐 그랜드 타마치', 139.7450712, 35.6427268, { address: '東京都港区芝浦4-2-8', source: 'https://www.hvf.jp/eng/tamachi/access/' }),
    tokyoJR: place('도쿄역 JR 승강장', 139.76698, 35.68124),
    tokyoKeiyo: place('도쿄역 게이요선 승강장', 139.76408, 35.67809),
    maihama: place('마이하마역', 139.88369, 35.63619),
    disney: place('도쿄 디즈니랜드 입구', 139.88059, 35.63506, { photo: 'disney' }),
    shibuya: place('시부야역', 139.70165, 35.65802),
    scramble: place('시부야 스크램블', 139.70059, 35.65950, { photo: 'shibuya' }),
    donki: place('MEGA 돈키호테 시부야 본점', 139.69798, 35.66046),
    harakado: place('다마고치 팩토리 · 하라카도 3층', 139.70559, 35.66864, { photo: 'harakado', source: 'https://tamagotchi-factory.jp/' }),
    harajuku: place('산리오 하라주쿠', 139.70401, 35.67119, { source: 'https://stores.sanrio.co.jp/8857100' }),
    omotesando: place('오모테산도', 139.70873, 35.66696, { photo: 'omotesando' }),
    omotesandoStn: place('오모테산도역', 139.71224, 35.66516),
    sky: place('시부야 스카이', 139.70205, 35.65845, { photo: 'sky', source: 'https://www.shibuya-scramble-square.com/sky/ticket/' }),
    mita: place('미타역', 139.74823, 35.64807),
    mitaA4: place('미타역 A4 출입구', 139.74721, 35.64639),
    shibakoen: place('시바코엔역', 139.74988, 35.65408),
    park: place('시바공원', 139.74880, 35.65517),
    tower: place('도쿄타워 아래', 139.74544, 35.65858, { photo: 'tower' }),
    yoyogi: place('요요기역', 139.70204, 35.68306),
    tanbo: place('오히츠젠 탄보 요요기 본점', 139.70052, 35.68201, { source: 'https://tanbo.co.jp/shop/' }),
    shinjuku: place('신주쿠역 JR', 139.70046, 35.68961),
    shinjukuM: place('신주쿠역 마루노우치선', 139.70080, 35.69246),
    shinjukuShop: place('신주쿠 동쪽 쇼핑가', 139.70362, 35.69106, { photo: 'shinjuku' }),
    ginza: place('긴자역', 139.76356, 35.67266),
    sanrio: place('산리오 NISHIGINZA · 2층', 139.76320, 35.67308, { source: 'https://stores.sanrio.co.jp/1703100' }),
    ginzaShop: place('긴자 쇼핑 거리', 139.76514, 35.67164, { photo: 'ginza' }),
    tokyoM: place('도쿄역 마루노우치선', 139.76492, 35.68156),
    marunouchi: place('도쿄역 마루노우치 광장', 139.76560, 35.68120, { photo: 'station' }),
    kitte: place('KITTE · 옥상정원', 139.76487, 35.67964),
    bus: place('스카이버스 · 미쓰비시빌딩 앞', 139.76335, 35.68004),
  };
  const lines = {
    JY: { name: 'JR 야마노테선', color: '#638522', badge: 'JY', relation: 1972920 },
    JE: { name: 'JR 게이요선', color: '#c53043', badge: 'JE', relation: 5326726 },
    M: { name: '마루노우치선', color: '#ce3444', badge: 'M', relation: 443282 },
    I: { name: '도에이 미타선', color: '#167fba', badge: 'I', relation: 443286 },
    KS: { name: '스카이라이너', color: '#294da4', badge: 'KS', relation: 3120358 },
    G: { name: '도쿄메트로 긴자선', color: '#f7911d', badge: 'G', relation: 443281 },
  };
  const legs = {};
  function walk(id, from, to, duration, note, extra = {}) {
    legs[id] = { id, from, to, mode: 'walk', duration, note, ...extra }; return id;
  }
  function rail(id, from, to, line, duration, direction, stops, extra = {}) {
    legs[id] = { id, from, to, mode: 'rail', line, duration, direction, stops, ...extra }; return id;
  }
  function indoor(id, from, to, duration, note, source) {
    legs[id] = { id, from, to, mode: 'indoor', duration, note, source }; return id;
  }
  function reverse(id, original, direction) {
    const a = legs[original];
    legs[id] = { ...a, id, from: a.to, to: a.from, reverseOf: original,
      direction: direction || a.direction, stops: a.stops?.slice().reverse() };
    return id;
  }
  rail('skyliner', 'narita', 'keisei', 'KS', '약 45~50분', '게이세이우에노행 · 지정석', ['공항', '닛포리', '게이세이우에노'], { note: '도착 터미널에 맞는 공항역에서 탑승. 항공편 확정 뒤 열차를 선택해요.' });
  walk('keisei-ueno', 'keisei', 'ueno', '약 7~10분', '개찰구 밖으로 나와 JR 우에노역 방면. 스이카를 준비하고 역 락커에 짐을 맡겨요.');
  walk('ueno-ameyoko', 'ueno', 'ameyoko', '약 5~8분', '역 남쪽 아메요코 방향으로 걸어요.');
  reverse('ameyoko-ueno', 'ueno-ameyoko');
  rail('ueno-asakusa', 'ueno', 'asakusa', 'G', '약 5분', '아사쿠사행', ['우에노', '이나리초', '다와라마치', '아사쿠사']);
  walk('asakusa-sensoji', 'asakusa', 'sensoji', '약 5~8분', '아사쿠사역에서 가미나리몬을 지나 나카미세 방향으로 센소지 본당까지 걸어요.');
  reverse('sensoji-asakusa', 'asakusa-sensoji');
  reverse('asakusa-ueno', 'ueno-asakusa', '시부야 방면 · 우에노 하차');
  rail('ueno-tamachi', 'ueno', 'tamachi', 'JY', '약 22~27분', '외선 · 도쿄·시나가와 방면', ['우에노', '오카치마치', '아키하바라', '간다', '도쿄', '유라쿠초', '신바시', '하마마쓰초', '다마치']);
  indoor('tamachi-exit', 'tamachi', 'tamachiEast', '약 3~5분', '개찰구를 나와 시바우라구치(芝浦口 / 동쪽 출구).', 'https://www.hvf.jp/tamachi/map/MAP1.pdf');
  walk('tamachi-hotel', 'tamachiEast', 'hotel', '약 6분', '시바우라구치에서 지상으로 내려와 오른쪽으로 이동. 약 300m 직진 후 횡단보도를 건너 호텔 정문으로.', { source: 'https://www.hvf.jp/tamachi/map/MAP1.pdf' });
  reverse('hotel-tamachi', 'tamachi-hotel');
  indoor('tamachi-enter', 'tamachiEast', 'tamachi', '약 3~5분', 'JR 개찰구에서 야마노테선 방향 표지를 확인해요.');
  rail('tamachi-tokyo', 'tamachi', 'tokyoJR', 'JY', '약 9~12분', '내선 · 도쿄·우에노 방면', ['다마치', '하마마쓰초', '신바시', '유라쿠초', '도쿄']);
  reverse('tokyo-tamachi', 'tamachi-tokyo', '외선 · 시나가와 방면');
  indoor('tokyo-transfer', 'tokyoJR', 'tokyoKeiyo', '약 15~20분 여유', '개찰구를 나가지 않고 빨간 JE 표지의 게이요선 지하 승강장으로. 긴 통로 이동이 있는 실제 환승이에요.', 'https://www.jreast.co.jp/estation/stations/1039.html');
  reverse('tokyo-transfer-back', 'tokyo-transfer');
  rail('tokyo-maihama', 'tokyoKeiyo', 'maihama', 'JE', '약 15~20분', '소가 방면 · 마이하마 정차 확인', ['도쿄', '핫초보리', '엣추지마', '시오미', '신키바', '가사이린카이코엔', '마이하마']);
  reverse('maihama-tokyo', 'tokyo-maihama', '도쿄행');
  walk('maihama-disney', 'maihama', 'disney', '약 5~10분', '남쪽 출구에서 도쿄 디즈니랜드 표지를 따라 걸어요. 모노레일은 타지 않아요.');
  reverse('disney-maihama', 'maihama-disney');
  rail('tamachi-shibuya', 'tamachi', 'shibuya', 'JY', '약 20~25분', '외선 · 시나가와·시부야 방면', ['다마치', '다카나와게이트웨이', '시나가와', '오사키', '고탄다', '메구로', '에비스', '시부야']);
  reverse('shibuya-tamachi', 'tamachi-shibuya', '내선 · 에비스·시나가와 방면');
  walk('shibuya-scramble', 'shibuya', 'scramble', '약 5~8분', '하치코 방면 개찰구·출구 표지를 따라 스크램블 교차로로.');
  walk('scramble-donki', 'scramble', 'donki', '약 5분', '도겐자카·분카무라도리 방면으로 걸어요.');
  walk('donki-harakado', 'donki', 'harakado', '약 20~30분', '하라카도 방면의 보행 경로를 따라 올라가요. 쇼핑 정차 시간은 별도예요.');
  walk('harakado-sanrio', 'harakado', 'harajuku', '약 8분', '산리오 하라주쿠와 다케시타도리 일대를 둘러봐요.');
  walk('harajuku-omotesando', 'harajuku', 'omotesando', '약 10~15분', '오모테산도 거리로 돌아와 쇼핑과 카페를 즐겨요.');
  walk('omotesando-sky', 'omotesando', 'sky', '약 20~25분', '15시대에는 쇼핑을 마무리하고 시부야로. 스크램블스퀘어 14층 입구까지의 이동 여유를 더 두세요.');
  walk('sky-shibuya', 'sky', 'shibuya', '약 5~10분', '식사를 마친 뒤 JR 개찰구로. 귀가는 시나가와 방면 내선이에요.');
  walk('omotesando-stn', 'omotesando', 'omotesandoStn', '약 5~7분', '오모테산도 큰길(아오야마도리)을 따라 오모테산도역으로.');
  rail('omotesandoStn-shibuya', 'omotesandoStn', 'shibuya', 'G', '약 2분 · 1정거장', '시부야행', ['오모테산도', '시부야']);
  reverse('shibuya-sky', 'sky-shibuya');
  walk('donki-sky', 'donki', 'sky', '약 5~8분', '센터가이에서 스크램블 교차로를 지나 스크램블스퀘어(시부야 스카이)로.');
  walk('hotel-mita', 'hotel', 'mitaA4', '약 8분', 'JR 역에 들어가지 않고 지상 보행으로 미타역 A4 출입구까지.');
  indoor('mita-enter', 'mitaA4', 'mita', '약 5~8분', '파란 I 표지의 미타선 승강장으로. 아사쿠사선과 구분해요.');
  rail('mita-park', 'mita', 'shibakoen', 'I', '약 2분 · 1정거장', '니시타카시마다이라 방면', ['미타', '시바코엔']);
  walk('station-park', 'shibakoen', 'park', '약 3~5분', 'A4 출구 방면에서 공원으로. 역 내부 이동은 표지를 따라요.');
  walk('park-tower', 'park', 'tower', '약 15~20분', '공원과 조조지 주변 길을 따라 탑 아래까지. 전망대 입장은 넣지 않아요.');
  reverse('tower-park', 'park-tower'); reverse('park-station', 'station-park');
  reverse('park-mita', 'mita-park', '메구로 방면');
  reverse('mita-exit', 'mita-enter'); reverse('mita-hotel', 'hotel-mita');
  rail('tamachi-yoyogi', 'tamachi', 'yoyogi', 'JY', '약 28~33분', '외선 · 시나가와·시부야·신주쿠 방면', ['다마치', '시나가와', '오사키', '고탄다', '메구로', '에비스', '시부야', '하라주쿠', '요요기']);
  rail('tamachi-shinjuku', 'tamachi', 'shinjuku', 'JY', '약 30~35분', '외선 · 시나가와·시부야·신주쿠 방면', ['다마치', '시나가와', '시부야', '하라주쿠', '요요기', '신주쿠']);
  rail('tamachi-harajuku', 'tamachi', 'harajuku', 'JY', '약 28~33분', '외선 · 시나가와·시부야·하라주쿠 방면', ['다마치', '시나가와', '오사키', '고탄다', '메구로', '에비스', '시부야', '하라주쿠']);
  walk('yoyogi-tanbo', 'yoyogi', 'tanbo', '약 3~5분', '서쪽 출구에서 오히츠젠 탄보 요요기 본점으로.');
  walk('tanbo-shinjuku', 'tanbo', 'shinjukuShop', '약 15~20분', '아침을 먹고 신주쿠 남쪽을 거쳐 동쪽 쇼핑가로 걸어요.');
  walk('shinjuku-shopping', 'shinjuku', 'shinjukuShop', '약 8~12분', '동쪽 출구 표지를 따라 지상 쇼핑가로. 큰 역이므로 출구 이동 시간을 따로 둬요.');
  walk('shopping-metro', 'shinjukuShop', 'shinjukuM', '약 8~12분', 'JR 승강장이 아닌 빨간 M 표지의 도쿄메트로 신주쿠역으로 이동해요.');
  rail('shinjuku-ginza', 'shinjukuM', 'ginza', 'M', '약 16~20분', '이케부쿠로 방면', ['신주쿠', '신주쿠산초메', '신주쿠교엔마에', '요쓰야산초메', '요쓰야', '아카사카미쓰케', '곳카이기지도마에', '가스미가세키', '긴자']);
  walk('ginza-sanrio', 'ginza', 'sanrio', '약 3~5분', 'C5·C7 방면 니시긴자 연결 안내 확인 → 2층 산리오.');
  walk('sanrio-ginza', 'sanrio', 'ginzaShop', '약 5분', '긴자 중심 거리에서 백화점·뷰티·선물 쇼핑.');
  walk('ginza-metro', 'ginzaShop', 'ginza', '약 5분', '빨간 M 표지를 따라 마루노우치선으로 돌아가요.');
  rail('ginza-tokyo', 'ginza', 'tokyoM', 'M', '약 2분 · 1정거장', '이케부쿠로 방면', ['긴자', '도쿄']);
  indoor('tokyo-marunouchi', 'tokyoM', 'marunouchi', '약 5~10분', '마루노우치 지하 중앙 방면에서 지상 광장으로. 선물 판매점은 상품 확인 후 선택해요.');
  walk('station-kitte', 'marunouchi', 'kitte', '약 5분', 'KITTE 6층 옥상정원에서 도쿄역 정면을 감상. 운영·날씨에 따라 광장에서 봐도 좋아요.');
  walk('kitte-bus', 'kitte', 'bus', '약 4분', '미쓰비시빌딩 앞 출발장. 2027년 1월 운행·예약 가능 시간을 확인한 경우에만 추가해요.');
  walk('bus-station', 'bus', 'marunouchi', '약 5분', '투어가 출발장으로 돌아온 뒤 도쿄역으로 걸어요.');
  reverse('kitte-station', 'station-kitte');
  indoor('marunouchi-jr', 'marunouchi', 'tokyoJR', '약 5~10분', 'JR 개찰구로 들어가 야마노테선 시나가와 방면 외선 승강장으로.');

  // Reverse trips need reverse instructions as well as reversed geometry.
  legs['hotel-tamachi'].note = '호텔에서 지상 보행으로 다마치역 시바우라구치까지. JR 개찰구로 올라가요.';
  legs['tokyo-transfer-back'].note = '개찰구를 나가지 않고 JR 야마노테선 표지를 따라 지상 승강장으로. 시나가와 방면 외선을 찾아요.';
  legs['mita-exit'].note = '미타역에서 A4 출입구 표지를 따라 지상으로 나와요.';
  legs['mita-hotel'].note = 'A4 출입구에서 지상 보행으로 호텔로 돌아가요. 역과 호텔은 지하로 연결되어 있지 않아요.';
  legs['ameyoko-ueno'].note = 'JR 우에노역으로 돌아가 맡긴 락커 위치를 찾아요.';
  legs['disney-maihama'].note = '디즈니랜드 출구에서 JR 마이하마역 남쪽 출구로 걸어요.';
  legs['tower-park'].note = '공원 쪽으로 되돌아가 시바코엔역 방향으로 걸어요.';
  legs['park-station'].note = '시바코엔역 출입구로 돌아가 미타선 메구로 방면을 찾아요.';
  legs['kitte-station'].note = 'KITTE에서 마루노우치 광장 쪽으로 돌아와 JR 도쿄역으로.';
  legs['shibuya-sky'].note = '시부야역에서 스크램블스퀘어(시부야 스카이 입구)로 걸어요.';
  const step = (id, kind, title, place, time, detail, extra = {}) => ({ id, kind, title, place, time, detail, ...extra });
  const journey = (id, title, place, time, route, detail, extra = {}) => step(id, 'move', title, place, time, detail, { legs: route, ...extra });
  const homeOut = ['hotel-tamachi', 'tamachi-enter'];
  const homeIn = ['tamachi-exit', 'tamachi-hotel'];
  // 귀가길에 항상 지도에 띄우는 숙소 근처 편의점(런타임 조회).
  const konbini = { name: '숙소 근처 편의점', query: 'コンビニ 芝浦4丁目 田町' };
  const days = [
    { id: 'd1', date: '1.25', weekday: '월', title: '우에노에서 시작하는 첫날', subtitle: '공항에서 바로 우에노로. 짐을 맡기고 가볍게.', steps: [
      step('arrival', 'arrival', '도쿄에 도착했어요', 'narita', '16:00 도착 목표', '입국 심사와 수하물 수령을 마치고 철도 안내 표지를 따라가요.', { facts: ['항공편·터미널은 예약 후 확정', '스카이라이너는 별도 지정석 승차권'] }),
      journey('airport-ueno', '나리타 → 우에노', 'keisei', '18:00 전후 도착 목표', ['skyliner'], '우에노까지 앉아서 이동. 도착 터미널과 입국 수속에 따라 출발 열차를 골라요.'),
      journey('luggage', '스이카 준비 · 짐 맡기기', 'ueno', '우에노 도착 후', ['keisei-ueno'], '지하철 패스는 사지 않아요. 스이카를 충전하고 역 락커에 짐을 맡긴 뒤, 위치를 사진으로 남겨요.'),
      step('asakusa-choice', 'choice', '첫 밤, 어떻게 보낼까', 'ueno', '저녁 · 선택', '조용히 아사쿠사 센소지 야경을 걷고 저녁까지 먹거나, 우에노에서 가볍게 마무리해요.', { choice: 'asakusa', choiceLabel: '아사쿠사 센소지 산책 · 저녁', skipLabel: '우에노에서 가볍게' }),
      journey('ueno-walk', '우에노를 가볍게 둘러보기', 'ameyoko', '저녁 · 자유롭게', ['ueno-ameyoko'], '아메요코와 야마시로야 등 캐릭터 매장을 둘러봐요. 매장별 마감이 다르니 굿즈 쇼핑부터.', { photo: 'ueno', highlights: ['아메요코 거리', '야마시로야 캐릭터 굿즈', '드럭스토어·간식'], without: 'asakusa', spots: [{ name: '야마시로야', query: 'ヤマシロヤ 上野' }, { name: '돈키호테 우에노', query: 'ドン・キホーテ 上野' }] }),
      step('ueno-food', 'meal', '출출하면 우에노에서', 'ameyoko', '저녁 · 선택해서', '가볍게 먹거나 호텔에서 편의점 저녁을 즐겨도 좋아요.', { meal: 'ueno', without: 'asakusa' }),
      journey('asakusa-out', '우에노 → 아사쿠사', 'asakusa', '저녁', ['ueno-asakusa'], '긴자선으로 아사쿠사까지 한 번에. 조용한 첫 밤 산책이에요.', { branch: 'asakusa' }),
      journey('sensoji-walk', '가미나리몬 지나 센소지로', 'sensoji', '저녁', ['asakusa-sensoji'], '아사쿠사역에서 가미나리몬을 지나 센소지 본당 쪽으로 걸어요.', { branch: 'asakusa' }),
      step('sensoji', 'visit', '불 밝힌 센소지 야경', 'sensoji', '밤 · 천천히', '상점가는 닫혔지만 가미나리몬 등롱과 오층탑, 본당 조명이 조용히 켜져 있어요. 사람이 적어 첫 밤에 걷기 좋아요.', { branch: 'asakusa', highlights: ['가미나리몬·나카미세(야간·상점 마감)', '오층탑과 본당 조명', '스미다강 쪽은 밝은 큰길로'], source: 'https://www.senso-ji.jp/' }),
      step('asakusa-dinner', 'meal', '아사쿠사에서 저녁', 'sensoji', '저녁 · 20:00 전후', '가미나리몬 주변에서 저녁을 먹어요. 20:30~21:00 사이 우에노로 출발하면 막차 걱정 없이 여유로워요.', { branch: 'asakusa', meal: 'asakusa' }),
      journey('asakusa-back', '아사쿠사 → 우에노 · 짐 회수', 'ueno', '20:30~21:00 출발', ['asakusa-ueno'], '긴자선으로 우에노로 돌아와 락커에서 짐을 회수하고 JR 개찰구로 가요.', { branch: 'asakusa' }),
      journey('collect', '맡긴 짐부터 찾아요', 'ueno', '21:00 출발 전', ['ameyoko-ueno'], '락커에서 짐을 회수하고 JR 개찰구로. 게이세이역으로 다시 들어가지 않도록 확인해요.', { without: 'asakusa' }),
      journey('ueno-home', '우에노 → 다마치', 'tamachi', '21:00 전후 출발 목표', ['ueno-tamachi'], '야마노테선 외선, 도쿄·시나가와 방면. 환승 없이 다마치에서 내려요.'),
      journey('checkin', '편의점 들러 호텔로', 'hotel', '22:00 전후 휴식 목표', homeIn, '편의점에서 먹고 싶은 것을 고른 뒤 체크인. 오늘 산 것들을 펼쳐보며 첫날을 마무리해요.', { facts: ['호텔 빌라 퐁텐 그랜드 도쿄 타마치', '시바우라구치에서 도보 약 6분', '역과 호텔은 지하로 직접 연결되지 않아요'], spots: [konbini] }),
    ] },
    { id: 'd2', date: '1.26', weekday: '화', title: '하루 온전히, 디즈니랜드', subtitle: '가는 길과 돌아오는 길만 챙겨요.', steps: [
      journey('disney-out', '다마치 → 도쿄 디즈니랜드', 'disney', '아침 · 개장에 맞춰', [...homeOut, 'tamachi-tokyo', 'tokyo-transfer', 'tokyo-maihama', 'maihama-disney'], '도쿄역에서 게이요선으로 한 번 환승해요. 역 내부 이동과 대기를 포함해 60~80분 정도 여유를 두세요.', { facts: ['도쿄역 환승 통로 15~20분 여유', '마이하마역 남쪽 출구 → 도보', '개장·입장권은 방문 전 확인'] }),
      step('disney-day', 'visit', '오늘은 디즈니랜드', 'disney', '하루 · 자유롭게', '어트랙션도, 퍼레이드도, 식사도 셋이 원하는 대로. 공원 안 일정은 비워두었어요.', { photo: 'disney', source: 'https://www.tokyodisneyresort.jp/tdl/' }),
      journey('disney-back', '즐거운 하루 끝, 호텔로', 'hotel', '밤 · 원하는 시간에', ['disney-maihama', 'maihama-tokyo', 'tokyo-transfer-back', 'tokyo-tamachi', ...homeIn], '마이하마에서 도쿄행 열차 → 도쿄역에서 야마노테선 시나가와 방면 → 다마치. 출발 전에 막차를 확인해요.', { spots: [konbini] }),
    ] },
    { id: 'd3', date: '1.27', weekday: '수', title: '좋아하는 것들과, 노을', subtitle: '하라주쿠 · 시부야 · 시부야 스카이', steps: [
      journey('morning-out', '호텔에서 다마치역으로', 'tamachiEast', '10:00 출발 목표', ['hotel-tamachi'], '전날 디즈니 뒤라 여유롭게, 10시쯤 출발해요. 호텔 조식을 먹었다면 바로 역으로.'),
      step('tamachi-breakfast', 'meal', '가볍게 아침 먹기', 'tamachiEast', '아침 · 여유롭게', '호텔 조식을 먹어도, 다마치역 근처에서 골라도 좋아요.', { meal: 'tamachi' }),
      journey('harajuku-out', '다마치 → 하라주쿠', 'harajuku', '10:30 전후 도착 목표', ['tamachi-enter', 'tamachi-harajuku'], '야마노테선 외선 직통으로 하라주쿠까지(환승 없음). 산리오·다케시타 쪽부터 시작해요.', { spots: [{ place: 'harakado' }] }),
      journey('harajuku', '산리오 · 다마고치 · 오모테산도, 하라주쿠 쇼핑', 'omotesando', '오전~오후 · 2:00~2:30 마무리', ['harajuku-omotesando'], '산리오 하라주쿠·다케시타도리에서 시작해 다마고치 팩토리를 지나 오모테산도까지 한 줄기로 둘러봐요. 지도에 쇼핑 거점이 함께 표시돼요. 2시~2시 반쯤 마무리하고 시부야로 넘어가요.', { photo: 'omotesando', highlights: ['산리오 하라주쿠 · 다케시타도리', '다마고치 팩토리 · 하라카도 3층 (현재 11:00~21:00)', '오모테산도 쇼윈도 · 골목 · 카페'], source: 'https://tamagotchi-factory.jp/', spots: [{ place: 'harajuku' }, { place: 'harakado' }, { name: '다케시타도리', query: '竹下通り' }, { name: '오모테산도 힐스', query: '表参道ヒルズ' }] }),
      step('harajuku-lunch', 'meal', '하라주쿠에서 점심', 'omotesando', '점심', '오모테산도·하라주쿠 골목에서 점심을 먹고 시부야로 이동해요.', { spots: [{ place: 'harajuku' }] }),
      journey('shibuya-in', '하라주쿠 → 시부야', 'scramble', '오후 2시대 이동', ['omotesando-stn', 'omotesandoStn-shibuya', 'shibuya-scramble'], '오모테산도역에서 긴자선으로 시부야 한 정거장(하라주쿠에서 바로 간다면 JR 야마노테 시부야행 한 정거장도 좋아요). 하치코 쪽에서 시부야 쇼핑을 시작해요.'),
      journey('donki', '시부야 쇼핑 · 메가 돈키', 'donki', '오후 · 자유롭게', ['scramble-donki'], '메가 돈키호테 시부야 본점을 중심으로 센터가이·백화점을 둘러봐요.', { photo: 'shibuya', photoPlace: 'scramble', highlights: ['MEGA 돈키호테 시부야 본점', '시부야 파르코 · 로프트', '패션·뷰티·드럭스토어'], spots: [{ name: '시부야 파르코', query: '渋谷PARCO' }, { name: '시부야 로프트', query: '渋谷ロフト' }, { name: '시부야 109', query: 'SHIBUYA109' }] }),
      step('sky', 'reservation', '낮부터 노을, 그리고 야경', 'sky', '16:00 입장 목표', '15:30쯤 스크램블스퀘어 백화점을 구경하다가 14층 입구로. 16:00~16:30 입장권을 예약하고 16시에 입장해 밝은 하늘부터 야경까지 봐요.', { legs: ['donki-sky'], photo: 'sky', reservation: { slot: '16:00–16:30', target: '16:00', booked: false, release: '1월 13일 00:00 · 현행 2주 전 판매 기준', sunset: '1월 27일 일몰 17:03' }, facts: ['사전 예약 필수 · 아직 예약 전', '내려오는 시간은 자유롭게', '강풍·비에 따라 옥상 운영이 달라질 수 있어요'], source: 'https://www.shibuya-scramble-square.com/sky/ticket/' }),
      step('shibuya-dinner', 'meal', '야경 본 뒤 시부야 저녁', 'sky', '저녁 · 관람 후', '든든하게 먹고, 8시 반쯤까지 시부야 쇼핑을 마무리해요.', { meal: 'shibuya' }),
      journey('shibuya-home', '시부야 → 다마치 → 호텔', 'hotel', '밤 · 21:00 도착 목표', ['sky-shibuya', 'shibuya-tamachi', ...homeIn], '야마노테선 내선 직통으로 다마치. 귀가길에 숙소 근처 편의점에 들러 간식을 챙겨요.', { spots: [konbini] }),
      step('tower-choice', 'choice', '조금 더 걷고 싶은 밤이라면', 'hotel', '선택 일정', '도쿄타워 야경을 보러 나갈까요? 피곤하면 여기서 하루를 마쳐도 좋아요.', { choice: 'tower', choiceLabel: '도쿄타워 산책 추가', skipLabel: '호텔에서 쉬기' }),
      journey('tower-out', '미타선 타고 시바공원으로', 'park', '밤 · 선택', ['hotel-mita', 'mita-enter', 'mita-park', 'station-park'], '미타선 니시타카시마다이라 방면으로 한 정거장. 시바코엔에서 내려 공원을 걸어요.', { branch: 'tower' }),
      journey('tower', '공원 너머, 도쿄타워', 'tower', '밤 · 자유롭게', ['park-tower'], '탑 아래와 주변 야경을 감상해요. 전망대에는 올라가지 않아요.', { branch: 'tower', photo: 'tower' }),
      journey('tower-home', '왔던 길로 호텔 귀환', 'hotel', '귀가', ['tower-park', 'park-station', 'park-mita', 'mita-exit', 'mita-hotel'], '시바코엔역에서 메구로 방면 미타선을 타고 미타역으로 돌아가요.', { branch: 'tower' }),
    ] },
    { id: 'd4', date: '1.28', weekday: '목', title: '마지막 쇼핑, 도쿄의 밤', subtitle: '신주쿠 · 긴자 · 마루노우치', steps: [
      step('breakfast-choice', 'breakfastChoice', '아침은 요요기, 또는 신주쿠', 'hotel', '아침', '탄보를 포함한 요요기 아침과 신주쿠 아침 중 골라요. 두 역은 야마노테선 한 정거장 차이예요.'),
      journey('yoyogi-out', '다마치 → 요요기', 'tanbo', '아침', [...homeOut, 'tamachi-yoyogi', 'yoyogi-tanbo'], '요요기 서쪽 출구에서 탄보까지 걸어요. 아침 장소는 고정 예약이 아니에요.', { breakfast: 'yoyogi' }),
      journey('shinjuku-out', '다마치 → 신주쿠', 'shinjukuShop', '아침', [...homeOut, 'tamachi-shinjuku', 'shinjuku-shopping'], '야마노테선 외선으로 신주쿠까지. 출구를 찾는 시간에 여유를 둬요.', { breakfast: 'shinjuku' }),
      step('shinjuku-breakfast', 'meal', '요요기·신주쿠 아침 후보', 'tanbo', '아침', '오히츠젠 탄보 요요기 본점을 포함한 8곳. 선택한 식당 위치와 여는 시간을 확인해요.', { meal: 'breakfast' }),
      journey('yoyogi-walk', '요요기에서 신주쿠 쇼핑가로', 'shinjukuShop', '오전', ['tanbo-shinjuku'], '가까운 두 지역을 걸어 연결해요.', { breakfast: 'yoyogi' }),
      step('shinjuku', 'visit', '신주쿠에서 원하는 것 찾기', 'shinjukuShop', '오전 · 자유롭게', '캐릭터 굿즈, 옷, 화장품. 필요한 매장부터 골라 둘러보고 점심을 먹어요.', { photo: 'shinjuku', highlights: ['산리오·캐릭터 굿즈', '백화점·뷰티', '필요한 매장 중심으로'], spots: [{ name: '돈키호테 신주쿠 동남쪽', query: 'ドン・キホーテ 新宿東南口店' }, { name: '신주쿠 마루이 아넥스', query: '新宿マルイ アネックス' }, { name: '뉴우먼 신주쿠', query: 'NEWoMan 新宿' }] }),
      step('shinjuku-lunch', 'meal', '신주쿠 점심', 'shinjukuShop', '점심', '14시 전후 긴자로 이동할 수 있도록 근처에서 식사해요.', { meal: 'shinjuku' }),
      journey('ginza-out', '신주쿠 → 긴자', 'sanrio', '14:00 전후 출발 목표', ['shopping-metro', 'shinjuku-ginza', 'ginza-sanrio'], '마루노우치선 이케부쿠로 방면. 긴자역에서 니시긴자 2층 산리오 매장으로.'),
      journey('ginza', '긴자에서 마지막 쇼핑', 'ginzaShop', '오후 · 자유롭게', ['sanrio-ginza'], '산리오 NISHIGINZA부터 백화점·뷰티·선물까지. 매장 마감 전에 구매를 정리해요.', { photo: 'ginza', highlights: ['산리오 NISHIGINZA · 2층', '백화점·드럭스토어', '선물과 면세 쇼핑'], spots: [{ place: 'sanrio' }, { name: '긴자 로프트', query: '銀座ロフト' }, { name: '돈키호테 긴자', query: 'ドン・キホーテ 銀座本館' }] }),
      step('ginza-dinner', 'meal', '긴자에서 저녁 먹기', 'ginzaShop', '저녁', '식사를 마치고 도쿄역 야경을 보러 가요.', { meal: 'ginza' }),
      journey('tokyo-out', '긴자 → 도쿄역', 'marunouchi', '저녁 식사 후', ['ginza-metro', 'ginza-tokyo', 'tokyo-marunouchi'], '마루노우치선 이케부쿠로 방면으로 한 정거장. 마루노우치 지하 쪽으로 나와요.'),
      step('banana', 'visit', '도쿄바나나 브륄레 찾기', 'marunouchi', '판매점 마감 전', '먼저 공식 상품 사진이 찾던 브륄레인지 확인해요. 브륄레 타르트라면 야에스 북쪽 출구의 PLUSTA Gift가 구매 후보예요.', { facts: ['원하는 상품·당일 재고 확인', 'PLUSTA Gift는 마루노우치 반대편, 야에스 쪽', '현재 매장 수령 안내 20:30까지 · 방문 전 재확인'], source: 'https://www.tokyobanana.jp/products/banana_brulee.html' }),
      journey('marunouchi', '도쿄역을 바라보는 마지막 밤', 'kitte', '밤 · 자유롭게', ['station-kitte'], '마루노우치 광장과 KITTE에서 붉은 벽돌 역사를 감상해요.', { photo: 'station', photoPlace: 'marunouchi' }),
      step('bus-choice', 'choice', '2층 버스로 조금 더 둘러볼까요', 'kitte', '선택 일정', '운행 시간과 체력이 맞으면 스카이버스를 추가해요. 현재 야경 코스는 약 50분이며 2027년 운행표는 별도 확인이 필요해요.', { choice: 'bus', choiceLabel: '2층 버스 후보 추가', skipLabel: '바로 다마치로', source: 'https://www.skybus.jp/course/?id=1750745746-069957' }),
      journey('bus-stop', '스카이버스 출발장으로', 'bus', '예약한 출발 시각에 맞춰', ['kitte-bus'], '미쓰비시빌딩 앞에서 탑승. 예약한 코스의 출발 시각과 돌아오는 시간을 확인해요.', { branch: 'bus', facts: ['2027년 운행·요금·예약 확인', '투어 후 같은 출발장으로 귀환'], source: 'https://www.skybus.jp/course/?id=1750745746-069957' }),
      journey('bus-return', '버스 관람 후 도쿄역으로', 'marunouchi', '관람 후', ['bus-station'], '출발장으로 돌아온 뒤 JR 도쿄역으로 걸어요.', { branch: 'bus' }),
      journey('kitte-return', 'KITTE에서 도쿄역으로', 'marunouchi', '귀가 준비', ['kitte-station'], '마루노우치 광장을 지나 JR 개찰구로 돌아가요.', { without: 'bus' }),
      journey('tokyo-home', '도쿄역 → 다마치 → 호텔', 'hotel', '귀가', ['marunouchi-jr', 'tokyo-tamachi', ...homeIn], '야마노테선 외선 시나가와 방면. 귀가길에 숙소 근처 편의점에 들르고, 호텔에서 짐을 정리하며 다음 날 공항 출발을 준비해요.', { spots: [konbini] }),
    ] },
    { id: 'd5', date: '1.29', weekday: '금', title: '다시 집으로', subtitle: '귀국편이 정해지면 공항 이동을 확정해요.', steps: [
      step('departure-prep', 'pending', '체크아웃 · 공항 이동 준비', 'hotel', '항공권 확정 후', '귀국편·터미널·수하물 조건에 맞춰 호텔 출발 시각을 정해요. 이전 08:55 항공편은 확정 일정이 아니에요.', { facts: ['항공편·출발 터미널 확인', '첫차로 여유 있게 도착 가능한지 확인', '가능한 직행 버스와 철도 이동 비교'] }),
      step('airport-return', 'pending', '나리타에서 인천으로', 'narita', '출발 시각 미정', '귀국편이 확정되면 열차·버스 중 편리한 공항 이동편을 정해요. 항공사 체크인 마감과 공항 도착 여유를 함께 확인하세요.'),
    ] },
  ];
  const photos = {
    ueno: {"url":"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Ueno_20241210_133139.jpg/1280px-Ueno_20241210_133139.jpg","source":"https://commons.wikimedia.org/wiki/File:Ueno_20241210_133139.jpg","credit":"Ka23 13 · CC BY 4.0","caption":"우에노 아메요코"},
    disney: {"url":"https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Tokyo_Disneyland_Cinderella_Castle_2023-07-02.jpg/1280px-Tokyo_Disneyland_Cinderella_Castle_2023-07-02.jpg","source":"https://commons.wikimedia.org/wiki/File:Tokyo_Disneyland_Cinderella_Castle_2023-07-02.jpg","credit":"LMP 2001 · CC BY-SA 4.0","caption":"도쿄 디즈니랜드 신데렐라성"},
    harakado: {"url":"https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Tokyu_plaza_omote-sando_%22Harakado%22.jpg/1280px-Tokyu_plaza_omote-sando_%22Harakado%22.jpg","source":"https://commons.wikimedia.org/wiki/File:Tokyu_plaza_omote-sando_%22Harakado%22.jpg","credit":"AXL1Kxcp · CC0","caption":"다마고치 팩토리가 있는 하라카도 외관"},
    shinjuku: {"url":"https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/JRE_Shinjuku-STA_South.jpg/1280px-JRE_Shinjuku-STA_South.jpg","source":"https://commons.wikimedia.org/wiki/File:JRE_Shinjuku-STA_South.jpg","credit":"MaedaAkihiko · CC BY-SA 4.0","caption":"신주쿠역 남쪽 출구"},
    shibuya: 'qa_c11_shibuya', harajuku: 'qa_c11_takeshita', omotesando: 'qa_c11_omotesando',
    sky: 'qa_c11_shibuyasky', tower: 'qa_c11_tower', ginza: 'qa_c11_ginza', station: 'qa_c11_tokyostation',
  };
  days[1].steps.find(s => s.id === 'disney-day').photoPlace = 'disneyCastle';
  days[3].steps.find(s => s.id === 'shinjuku').photoPlace = 'shinjukuSouth';
  days[3].steps.find(s => s.id === 'ginza').photoPlace = 'ginzaFujiya';
  return { version: 2, checkedAt: '2026-09-20', places, lines, legs, days, photos };
})();
if (typeof module !== 'undefined') module.exports = TOKYO;
