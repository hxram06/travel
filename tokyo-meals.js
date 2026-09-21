/* Small, explicit restaurant shortlist. Never invent Google ratings.
 * null means not independently verified. Prices are planning ranges, not quotes.
 * Each observed score has a source URL and observation date; check again in 2027. */
const TOKYO_MEALS = (() => {
  const r=(name,query,area,food,budget,source,extra={})=>({
    name,query,area,food,budget,source,reservation:'walkin',rating:null,...extra,
  });
  const score=(rating,ratingSource)=>({rating,ratingSource,checkedAt:'2026-09-20'});
  const breakfastRatings='https://www.google.com/maps/search/Breakfast%2B%26%2BPack%2C%2BShinjuku%2B%2F%2BTokyo%2C%2BJapan';
  const uenoRatings='https://www.google.com/maps/search/Lunch%20at%20Ueno%20Park%20Food%20Stalls%2C%20Tokyo%2C%20Japan';
  const ginzaRatings='https://www.google.com/maps/search/%E6%9D%B1%E6%80%A5%E3%83%97%E3%83%A9%E3%82%B6%E9%8A%80%E5%BA%A7';
  const ueno=[
    r('규카츠 모토무라 우에노점','牛かつもと村 上野店','우에노','규카츠','약 ¥2,000–3,000','https://www.gyukatsu-motomura.com/',score(4.8,uenoRatings)),
    r('오본데고항 우에노노모리점','おぼんdeごはん 上野の森さくらテラス店','우에노','정식','약 ¥1,200–2,000','https://byo.co.jp/obon-de-gohan/',score(4.0,uenoRatings)),
    r('T’s 탄탄 에큐트 우에노','T’sたんたん エキュート上野店','JR 우에노 개찰구 안','비건 라멘','약 ¥1,000–1,800','https://ts-restaurant.jp/',{...score(4.4,uenoRatings),note:'JR 승차 직전에 이용하면 편해요. 탐방 중에는 개찰구 안 식당이라는 점을 확인하세요.'}),
    r('네기시 우에노역앞점','ねぎし 上野駅前店','우에노','고기 정식','약 ¥1,500–3,000','https://www.negishi.co.jp/location/'),
    r('돈카츠 야마베 우에노점','とんかつ山べ 上野店','아메요코','돈카츠','약 ¥1,000–2,000',null,{note:'작은 매장으로 셋이 함께 앉을 수 있는지 확인해요.'}),
    r('돈카츠 야마가 오카치마치점','とんかつ山家 御徒町店','오카치마치','돈카츠','약 ¥1,000–2,000',null,{note:'아메요코 남쪽. 우에노역으로 돌아올 시간을 남겨요.'}),
    r('이치란 아트레 우에노 야마시타구치점','一蘭 アトレ上野山下口店','우에노','돈코츠 라멘','약 ¥1,000–2,000','https://ichiran.com/shop/tokyo/'),
    r('교자노오쇼 오카치마치역남쪽점','餃子の王将 御徒町駅南口店','오카치마치','교자·볶음밥','약 ¥800–1,500','https://www.ohsho.co.jp/'),
  ];
  const tamachi=[
    r('프론토 무스부 다마치점','PRONTO ムスブ田町店','시바우라구치','토스트·커피','약 ¥500–1,000','https://shop.pronto.co.jp/detail/77/',{note:'현재 평일 07:00부터, 모닝은 10:00까지.'}),
    r('카페 드 크리에 나기사테라스점','カフェ ド クリエ 田町駅東口なぎさテラス店','시바우라구치','샌드위치·커피','약 ¥500–1,000','https://c-united.co.jp/crie/',{...score(3.7,'https://www.google.com/maps/search/Breakfast%2Bat%2BCafe%2Bde%2BCri%C3%A9%2C%2BTama%2BPlaza%2C%2BTokyo%2C%2BJapan'),note:'나기사테라스 3층. 모닝 제공 시간을 확인해요.'}),
    r('카페 벨로체 다마치점','カフェ ベローチェ 田町店','다마치 서쪽 출구','샌드위치·커피','약 ¥500–1,000','https://c-united.co.jp/store/detail/000241/',{note:'현재 평일 06:45부터. 역 반대편 서쪽 출구로 이동해요.'}),
    r('앤드커피 메종카이저 무스부 다마치점','アンドコーヒー メゾンカイザー ムスブ田町店','시바우라구치','빵·커피','약 ¥600–1,200','https://maisonkayser.jp/',{note:'빵을 포장해서 먹기에도 좋은 후보.'}),
    r('빵과 에스프레소와 시바우라 갤러리','パンとエスプレッソと芝浦ギャラリー','호텔 남쪽 시바우라','빵·브런치','약 ¥1,000–2,000','https://www.bread-espresso.jp/',{note:'역과 반대 방향이므로 이동 여유가 있을 때.'}),
    r('스타벅스 무스부 다마치 2층점','スターバックス コーヒー ムスブ田町2階店','시바우라구치','샌드위치·커피','약 ¥700–1,500','https://store.starbucks.co.jp/'),
    r('세가프레도 다마치 그란파크점','セガフレード ザネッティ 田町グランパーク店','호텔·역 사이','파니니·커피','약 ¥600–1,200','https://www.segafredo.jp/shop/tamachi-granpark/',{note:'현재 평일 08:00부터, 주말·공휴일 휴무.'}),
    r('툴리스 다마치 그란파크점','タリーズコーヒー 田町グランパーク店','호텔·역 사이','샌드위치·커피','약 ¥600–1,200','https://shibaura-shoutenkai.com/map/shops/',{note:'현재 평일 08:00부터. 주말·공휴일 휴무.'}),
  ];
  const breakfast=[
    r('오히츠젠 탄보 요요기 본점','おひつ膳田んぼ 代々木本店','요요기 서쪽 출구','밥 정식·오히츠젠','약 ¥1,000–3,000','https://tanbo.co.jp/shop/',{note:'현재 08:00부터. 아침 메뉴와 장어 메뉴 제공 시간·가격은 별도로 확인해요.'}),
    r('BERG','BERG 新宿 ルミネエスト','신주쿠 동쪽 출구','빵·소시지·커피','약 ¥500–1,200','https://www.berg.jp/',{note:'현재 07:00부터. 작은 매장이므로 셋이 함께 자리 잡을 수 있는지 확인해요.'}),
    r('사라베스 루미네 신주쿠점','サラベス ルミネ新宿店','신주쿠 남쪽 출구','팬케이크·에그베네딕트','약 ¥2,000–3,000','https://sarabethsrestaurants.jp/location/shinjuku/',{...score(4.1,breakfastRatings),reservation:'check',note:'현재 09:00부터. 음료 추가 시 예산을 넘을 수 있어요. 예약·오전 출입구 안내 확인.'}),
    r('에그슬럿 신주쿠 서던테라스','eggslut 新宿サザンテラス店','신주쿠 남쪽 출구','에그 샌드위치','약 ¥1,000–2,000','https://eggslut.baycrews.co.jp/',score(4.1,breakfastRatings)),
    r('불랑주 신주쿠 서던테라스','BOUL ANGE 新宿サザンテラス店','신주쿠 남쪽 출구','크루아상·빵','약 ¥500–1,200','https://www.flavorworks.co.jp/brand/boulange.html',score(4.2,breakfastRatings)),
    r('테이스트 더 월드 신주쿠점','TASTE THE WORLD 新宿店','신주쿠 남쪽·신주쿠 4초메','세계의 아침 정식','약 ¥2,000–3,000','https://www.taste-the-world.jp/en/location',{...score(4.2,breakfastRatings),reservation:'recommended',note:'현재 07:30부터. 평일 3인 예약 가능 여부를 확인해요.'}),
    r('신파치식당 신주쿠점','しんぱち食堂 新宿店','신주쿠 서쪽 출구','생선구이 정식','약 ¥600–1,500','https://www.shinpachi-shokudo.com/',score(4.0,breakfastRatings)),
    r('코메다커피 신주쿠 서쪽 제1점','コメダ珈琲店 新宿西口店','신주쿠 서쪽 출구','토스트·커피','약 ¥700–1,200','https://www.komeda.co.jp/',{...score(4.1,breakfastRatings),note:'모닝 서비스 종료 전에 방문해요.'}),
  ];
  const shibuya=[
    r('우오베이 시부야 도겐자카점','魚べい 渋谷道玄坂店','도겐자카','초밥','약 ¥1,000–2,500','https://www.uobei.info/',score(4.3,'https://www.google.com/maps/search/Conveyor%2Bbelt%2Bsushi%2Brestaurant%2BShibuya%2BTokyo/?entry=wc&hl=cs')),
    r('네기시 시부야 센터가이점','ねぎし 渋谷センター街店','센터가이','고기 정식','약 ¥1,500–3,000','https://www.negishi.co.jp/location/',{reservation:'recommended',note:'현재 좌석 예약 제공 지점. 셋이 함께 앉고 싶으면 예약 가능 여부 확인.'}),
    r('규카츠 모토무라 시부야점','牛かつもと村 渋谷店','시부야 남쪽','규카츠','약 ¥2,000–3,000','https://www.gyukatsu-motomura.com/'),
    r('돈카츠 와코 시부야 마크시티점','とんかつ和幸 渋谷マークシティ店','마크시티','돈카츠 정식','약 ¥1,300–2,500','https://wako-group.co.jp/'),
    r('이치란 시부야점','一蘭 渋谷店','진난','돈코츠 라멘','약 ¥1,000–2,000','https://ichiran.com/shop/tokyo/'),
    r('마와시스시 카츠 세이부 시부야점','回し寿司 活 西武渋谷店','세이부 A관 8층','초밥','약 ¥1,500–3,000','https://katumidori.co.jp/',{...score(4.1,'https://www.google.com/maps/search/Conveyor%2Bbelt%2Bsushi%2Brestaurant%2BShibuya%2BTokyo/?entry=wc&hl=zu'),note:'접시 수에 따라 예산이 달라져요. 줄이 길면 다른 후보로.'}),
    r('토리카츠 치킨','とりかつ チキン 渋谷','도겐자카','치킨카츠 정식','약 ¥800–1,500',null,{note:'작은 매장. 현금·좌석·영업시간을 방문 전에 확인해요.'}),
    r('하나마루우동 시부야역 서쪽점','はなまるうどん 渋谷駅西口店','시부야역 서쪽','우동·튀김','약 ¥500–1,200','https://stores.hanamaruudon.com/hanamaru/spot/detail?code=1140'),
  ];
  const shinjuku=[
    r('네기시 신주쿠 동쪽점','ねぎし 新宿東口店','신주쿠 동쪽 출구','고기 정식','약 ¥1,500–3,000','https://www.negishi.co.jp/location/',{reservation:'recommended'}),
    r('나카무라야 Manna','新宿中村屋 Manna','신주쿠 동쪽','카레·양식','약 ¥1,500–3,000','https://www.nakamuraya.co.jp/manna/'),
    r('신주쿠 츠나하치 총본점','新宿つな八 総本店','신주쿠 3초메','텐푸라 점심','약 ¥2,000–3,000','https://www.tunahachi.co.jp/',{reservation:'check',note:'점심 메뉴 기준으로 골라요. 코스는 예산을 넘을 수 있어요.'}),
    r('우동 신','うどん 慎 新宿','신주쿠 남쪽·요요기','우동','약 ¥1,200–2,500','https://www.udonshin.com/',{note:'대기가 길면 14시 이동에 맞추기 어려워요. 다른 후보도 함께 확인.'}),
    r('멘야 무사시 총본점','麺屋武蔵 総本店','신주쿠 서쪽','라멘·츠케멘','약 ¥1,000–2,000','https://menya634.co.jp/'),
    r('신파치식당 신주쿠점','しんぱち食堂 新宿店','신주쿠 서쪽','생선구이 정식','약 ¥800–1,500','https://www.shinpachi-shokudo.com/',score(4.0,breakfastRatings)),
    r('라케루 신주쿠 서쪽점','ラケル 新宿西口店','신주쿠 서쪽','오므라이스','약 ¥1,200–2,000','https://www.rakeru.jp/'),
    r('아인소프 저니 신주쿠','AIN SOPH JOURNEY 新宿','신주쿠 3초메','비건 식사','약 ¥2,000–3,000','https://www.ain-soph.jp/journey',{reservation:'recommended',...score(4.3,'https://www.google.com/maps/search/Breakfast%2Bat%2BAIN%2BSOPH.%2C%2BTokyo%2C%2BJapan'),note:'세트·디저트 추가 시 예산 초과 가능.'}),
  ];
  const ginza=[
    r('고다이메 하나야마우동 긴자점','五代目花山うどん 銀座店','히가시긴자','넓은 우동','약 ¥1,000–2,500','https://www.hanayamaudon.co.jp/ginza/',{...score(4.2,'https://www.google.com/maps/search/Godaime%2BHanayama%2BUdon%2BTokyo'),note:'평일 저녁 영업. 정리권을 받고 순서대로 입장하는 방식.'}),
    r('츠루톤탄 긴자','つるとんたん UDON NOODLE Brasserie 銀座','GinzaNovo 10층','우동','약 ¥1,500–3,000','https://www.tsurutontan.co.jp/',{...score(4.1,ginzaRatings),reservation:'recommended'}),
    r('네기시 긴자 나미키도리점','ねぎし 銀座並木通り店','긴자 나미키도리','고기 정식','약 ¥1,500–3,000','https://www.negishi.co.jp/location/'),
    r('야바톤 도쿄 긴자점','矢場とん 東京銀座店','히가시긴자','미소 돈카츠','약 ¥1,500–2,500','https://www.yabaton.com/'),
    r('MUJI Diner 긴자','MUJI Diner 銀座','무인양품 긴자 지하','정식·양식','약 ¥1,200–2,500','https://www.muji.com/jp/ja/shop/detail/046604'),
    r('긴자 텐류','銀座 天龍 本店','긴자 2초메','교자·중화요리','약 ¥1,500–3,000','https://www.tenryu-ginza.jp/',{note:'일반 메뉴는 당일 방문 후보. 공식 온라인 예약은 코스 요리만 접수.'}),
    r('긴자 카가리 본점','銀座 篝 本店','긴자 6초메','닭백탕 라멘','약 ¥1,300–2,500',null,{note:'골목 안 매장. 대기가 길면 다른 후보를 골라요.'}),
    r('긴자 스위스','銀座スイス 本店','긴자 3초메','카츠카레','약 ¥1,200–2,500','https://ginza-swiss.com/'),
  ];
  const dinner=[...shibuya.slice(0,7),r('Satsuma Roppongi','北新地焼肉さつま 六本木店','롯폰기 · 별도 이동','야키니쿠','¥3,000 초과 가능','https://www.satsumaginza.com/access-roppongi',{reservation:'recommended',note:'현재 동선 밖 후보예요. 선택하면 시부야 저녁·귀가 경로를 따로 확인해야 해요. 현재 18:00부터, 일·공휴일 휴무.'})];
  // 첫날 아사쿠사 분기용. 조용한 밤 저녁. 평점은 지어내지 않고 Google 지도 링크로 확인.
  const asakusa=[
    r('오와리야 본점','尾張屋 本店 浅草','가미나리몬','텐푸라 소바','약 ¥1,600–2,800',null,{note:'가미나리몬 근처 소바 노포. 새우튀김 소바가 대표.'}),
    r('다이코쿠야 텐푸라','大黒家天麩羅 浅草','나카미세 인근','에도마에 텐동','약 ¥1,900–2,600',null,{note:'진한 튀김덮밥 노포. 대기가 있을 수 있어요.'}),
    r('가미야 바','神谷バー 浅草','아사쿠사역 앞','요쇼쿠·데운키브랜','약 ¥2,000–3,000','https://www.kamiya-bar.com/',{note:'1880년 창업. 1층 홀은 셀프 방식. 라스트오더가 이른 편(대개 20:30 전후) — 당일 확인.'}),
    r('도키와 식당','ときわ食堂 雷門店','가미나리몬','대중 정식·튀김','약 ¥1,000–2,000',null,{note:'아지프라이·정식을 가볍게. 저녁 마감이 이른 편이라 확인해요.'}),
    r('아사쿠사 무기토로 본점','浅草むぎとろ 本店','고마가타바시','토로로 요리','약 ¥3,000 전후','https://www.mugitoro.co.jp/',{reservation:'recommended',note:'디너는 예산 상향. 예약 권장.'}),
    r('산사다','三定 浅草','가미나리몬 옆','텐푸라','약 ¥2,500–4,000',null,{reservation:'recommended',note:'1837년 창업 튀김 노포. 디너는 예산 상향 가능.'}),
    r('고마가타 도제우','駒形どぜう 本店','고마가타','도조나베(미꾸라지 전골)','약 ¥2,500–3,800','https://www.dozeu.com/',{reservation:'recommended',note:'1801년 창업. 좌식 전골. 아사쿠사 남쪽 고마가타.'}),
    r('요시카미','ヨシカミ 浅草','신나카미세','요쇼쿠(비프스튜·하야시라이스)','약 ¥2,000–3,500','https://www.yoshikami.co.jp/',{note:'1951년 창업 양식당. 인기 — 대기가 있을 수 있어요.'}),
  ];
  // 3일차 하라주쿠·오모테산도 점심.
  const harajuku=[
    r('마이센 아오야마 본점','まい泉 青山本店','오모테산도','돈카츠·카츠산도','약 ¥1,600–3,500','https://mai-sen.com/',{reservation:'recommended',note:'카츠산도는 비교적 저렴. 식사 메뉴는 예산 상향 가능.'}),
    r('아후리 하라주쿠','AFURI 原宿','하라주쿠','유즈시오 라멘','약 ¥1,200–2,000','https://afuri.com/'),
    r('사쿠라테이','さくら亭 原宿','우라하라주쿠','직접 굽는 오코노미야키','약 ¥1,200–2,200','http://www.sakuratei.co.jp/'),
    r('하라주쿠 교자로','原宿餃子楼','하라주쿠','교자·중화','약 ¥800–1,500',null,{note:'작은 매장·현금 위주, 대기 가능.'}),
    r('에그스앤띵스 하라주쿠','Eggs ’n Things 原宿店','하라주쿠','팬케이크·브런치','약 ¥1,500–2,500','https://www.eggsnthingsjapan.com/',{note:'인기 매장, 피크에는 대기 길어요.'}),
    r('브라운라이스 표참도','Brown Rice 表参道','오모테산도','채식 정식','약 ¥1,300–2,200','https://www.nealsyard.co.jp/brownrice/'),
    r('몬순카페 표참도','モンスーンカフェ 表参道','오모테산도','아시안 다이닝','약 ¥1,500–3,000','https://www.monsoon-cafe.jp/',{reservation:'recommended'}),
    r('더 그레이트 버거','THE GREAT BURGER 原宿','우라하라주쿠','수제버거','약 ¥1,500–2,500','http://www.the-great-burger.com/'),
  ];
  return {ueno,tamachi,breakfast,shibuya,shinjuku,ginza,'shibuya-dinner':dinner,asakusa,harajuku};
})();
if(typeof module!=='undefined')module.exports=TOKYO_MEALS;
