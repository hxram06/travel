/* Restaurant shortlists per area, tagged by category (일식/가정식/고기/회/양식/기타).
 * Never invent Google ratings: rating stays null unless independently observed (with source + date).
 * Prices are planning ranges, not quotes. Chains are listed with a district query so the map can
 * geocode a nearby branch at runtime; check hours/branch on the day. */
const TOKYO_MEALS = (() => {
  const r=(name,query,area,food,budget,source,cat,extra={})=>({
    name,query,area,food,budget,source,cat,reservation:'walkin',rating:null,...extra,
  });
  const score=(rating,ratingSource)=>({rating,ratingSource,checkedAt:'2026-09-20'});
  const breakfastRatings='https://www.google.com/maps/search/Breakfast%2B%26%2BPack%2C%2BShinjuku%2B%2F%2BTokyo%2C%2BJapan';
  const uenoRatings='https://www.google.com/maps/search/Lunch%20at%20Ueno%20Park%20Food%20Stalls%2C%20Tokyo%2C%20Japan';
  const ginzaRatings='https://www.google.com/maps/search/%E6%9D%B1%E6%80%A5%E3%83%97%E3%83%A9%E3%82%B6%E9%8A%80%E5%BA%A7';
  const ueno=[
    r('규카츠 모토무라 우에노점','牛かつもと村 上野店','우에노','규카츠','약 ¥2,000–3,000','https://www.gyukatsu-motomura.com/','고기',score(4.8,uenoRatings)),
    r('오본데고항 우에노노모리점','おぼんdeごはん 上野の森さくらテラス店','우에노','정식','약 ¥1,200–2,000','https://byo.co.jp/obon-de-gohan/','가정식',score(4.0,uenoRatings)),
    r('T’s 탄탄 에큐트 우에노','T’sたんたん エキュート上野店','JR 우에노 개찰구 안','비건 라멘','약 ¥1,000–1,800','https://ts-restaurant.jp/','기타',{...score(4.4,uenoRatings),note:'JR 승차 직전에 이용하면 편해요. 개찰구 안 식당이라는 점을 확인하세요.'}),
    r('네기시 우에노역앞점','ねぎし 上野駅前店','우에노','규탄 정식','약 ¥1,500–3,000','https://www.negishi.co.jp/location/','고기'),
    r('돈카츠 야마베 우에노점','とんかつ山べ 上野店','아메요코','돈카츠','약 ¥1,000–2,000',null,'일식',{note:'작은 매장으로 셋이 함께 앉을 수 있는지 확인해요.'}),
    r('돈카츠 야마가 오카치마치점','とんかつ山家 御徒町店','오카치마치','돈카츠','약 ¥1,000–2,000',null,'일식',{note:'아메요코 남쪽. 우에노역으로 돌아올 시간을 남겨요.'}),
    r('이치란 아트레 우에노 야마시타구치점','一蘭 アトレ上野山下口店','우에노','돈코츠 라멘','약 ¥1,000–2,000','https://ichiran.com/shop/tokyo/','일식'),
    r('텐야 우에노점','天丼てんや 上野店','우에노','텐동','약 ¥600–1,200','https://www.tenya.co.jp/','일식'),
    r('미나토야 식품 아메요코','みなとや食品 本店 上野','아메요코','해산물 덮밥·회','약 ¥500–1,200',null,'회',{note:'아메요코 노점형 해산물 덮밥. 서서 먹거나 포장.'}),
    r('이키나리스테이크 우에노점','いきなりステーキ 上野店','우에노','스테이크','약 ¥1,500–3,000','https://ikinaristeak.com/','고기'),
    r('오토야 우에노마루이점','大戸屋 上野マルイ店','우에노','가정식 정식','약 ¥1,000–1,800','https://www.ootoya.com/','가정식'),
    r('우에노 세이요켄','上野精養軒 本店レストラン','우에노공원','요쇼쿠(하야시라이스)','약 ¥1,800–3,500','https://www.seiyoken.co.jp/','양식',{note:'1872년 창업 노포 양식. 공원 안쪽, 점심 시간 확인.'}),
  ];
  const tamachi=[
    r('프론토 무스부 다마치점','PRONTO ムスブ田町店','시바우라구치','토스트·커피','약 ¥500–1,000','https://shop.pronto.co.jp/detail/77/','양식',{note:'현재 평일 07:00부터, 모닝은 10:00까지.'}),
    r('카페 드 크리에 나기사테라스점','カフェ ド クリエ 田町駅東口なぎさテラス店','시바우라구치','샌드위치·커피','약 ¥500–1,000','https://c-united.co.jp/crie/','양식',{...score(3.7,'https://www.google.com/maps/search/Breakfast%2Bat%2BCafe%2Bde%2BCri%C3%A9%2C%2BTama%2BPlaza%2C%2BTokyo%2C%2BJapan'),note:'나기사테라스 3층. 모닝 제공 시간을 확인해요.'}),
    r('카페 벨로체 다마치점','カフェ ベローチェ 田町店','다마치 서쪽 출구','샌드위치·커피','약 ¥500–1,000','https://c-united.co.jp/store/detail/000241/','양식',{note:'현재 평일 06:45부터. 역 반대편 서쪽 출구로 이동해요.'}),
    r('앤드커피 메종카이저 무스부 다마치점','アンドコーヒー メゾンカイザー ムスブ田町店','시바우라구치','빵·커피','약 ¥600–1,200','https://maisonkayser.jp/','양식',{note:'빵을 포장해서 먹기에도 좋은 후보.'}),
    r('빵과 에스프레소와 시바우라 갤러리','パンとエスプレッソと芝浦ギャラリー','호텔 남쪽 시바우라','빵·브런치','약 ¥1,000–2,000','https://www.bread-espresso.jp/','양식',{note:'역과 반대 방향이므로 이동 여유가 있을 때.'}),
    r('스타벅스 무스부 다마치 2층점','スターバックス コーヒー ムスブ田町2階店','시바우라구치','샌드위치·커피','약 ¥700–1,500','https://store.starbucks.co.jp/','양식'),
    r('세가프레도 다마치 그란파크점','セガフレード ザネッティ 田町グランパーク店','호텔·역 사이','파니니·커피','약 ¥600–1,200','https://www.segafredo.jp/shop/tamachi-granpark/','양식',{note:'현재 평일 08:00부터, 주말·공휴일 휴무.'}),
    r('툴리스 다마치 그란파크점','タリーズコーヒー 田町グランパーク店','호텔·역 사이','샌드위치·커피','약 ¥600–1,200','https://shibaura-shoutenkai.com/map/shops/','양식',{note:'현재 평일 08:00부터. 주말·공휴일 휴무.'}),
    r('요시노야 다마치역앞점','吉野家 田町駅前店','다마치역 앞','규동','약 ¥500–900','https://www.yoshinoya.com/','가정식',{note:'이른 아침부터. 빠르게 한 끼.'}),
    r('나카우 다마치점','なか卯 田町店','다마치역 근처','규동·우동','약 ¥500–1,000','https://www.nakau.co.jp/','일식',{note:'아침 정식 시간대 확인.'}),
  ];
  const breakfast=[
    r('오히츠젠 탄보 요요기 본점','おひつ膳田んぼ 代々木本店','요요기 서쪽 출구','밥 정식·오히츠젠','약 ¥1,000–3,000','https://tanbo.co.jp/shop/','가정식',{note:'현재 08:00부터. 아침·장어 메뉴 제공 시간·가격은 별도 확인.'}),
    r('BERG','BERG 新宿 ルミネエスト','신주쿠 동쪽 출구','빵·소시지·커피','약 ¥500–1,200','https://www.berg.jp/','양식',{note:'현재 07:00부터. 작은 매장이라 셋이 함께 앉을 수 있는지 확인.'}),
    r('사라베스 루미네 신주쿠점','サラベス ルミネ新宿店','신주쿠 남쪽 출구','팬케이크·에그베네딕트','약 ¥2,000–3,000','https://sarabethsrestaurants.jp/location/shinjuku/','양식',{...score(4.1,breakfastRatings),reservation:'check',note:'현재 09:00부터. 음료 추가 시 예산 초과 가능. 예약·출입구 확인.'}),
    r('에그슬럿 신주쿠 서던테라스','eggslut 新宿サザンテラス店','신주쿠 남쪽 출구','에그 샌드위치','약 ¥1,000–2,000','https://eggslut.baycrews.co.jp/','양식',score(4.1,breakfastRatings)),
    r('불랑주 신주쿠 서던테라스','BOUL ANGE 新宿サザンテラス店','신주쿠 남쪽 출구','크루아상·빵','약 ¥500–1,200','https://www.flavorworks.co.jp/brand/boulange.html','양식',score(4.2,breakfastRatings)),
    r('테이스트 더 월드 신주쿠점','TASTE THE WORLD 新宿店','신주쿠 남쪽·신주쿠 4초메','세계의 아침 정식','약 ¥2,000–3,000','https://www.taste-the-world.jp/en/location','기타',{...score(4.2,breakfastRatings),reservation:'recommended',note:'현재 07:30부터. 평일 3인 예약 가능 여부 확인.'}),
    r('신파치식당 신주쿠점','しんぱち食堂 新宿店','신주쿠 서쪽 출구','생선구이 정식','약 ¥600–1,500','https://www.shinpachi-shokudo.com/','가정식',score(4.0,breakfastRatings)),
    r('코메다커피 신주쿠 서쪽 제1점','コメダ珈琲店 新宿西口店','신주쿠 서쪽 출구','토스트·커피','약 ¥700–1,200','https://www.komeda.co.jp/','양식',{...score(4.1,breakfastRatings),note:'모닝 서비스 종료 전에 방문해요.'}),
    r('마츠야 신주쿠 서쪽점','松屋 新宿西口店','신주쿠 서쪽','규동·아침 정식','약 ¥500–900','https://www.matsuyafoods.co.jp/','가정식',{note:'아침 정식 시간대에 저렴하게.'}),
  ];
  const shibuya=[
    r('우오베이 시부야 도겐자카점','魚べい 渋谷道玄坂店','도겐자카','회전초밥','약 ¥1,000–2,500','https://www.uobei.info/','회',score(4.3,'https://www.google.com/maps/search/Conveyor%2Bbelt%2Bsushi%2Brestaurant%2BShibuya%2BTokyo/?entry=wc&hl=cs')),
    r('마와시스시 카츠 세이부 시부야점','回し寿司 活 西武渋谷店','세이부 A관 8층','회전초밥','약 ¥1,500–3,000','https://katumidori.co.jp/','회',{...score(4.1,'https://www.google.com/maps/search/Conveyor%2Bbelt%2Bsushi%2Brestaurant%2BShibuya%2BTokyo/?entry=wc&hl=zu'),note:'접시 수에 따라 예산이 달라져요. 줄이 길면 다른 후보로.'}),
    r('네기시 시부야 센터가이점','ねぎし 渋谷センター街店','센터가이','규탄 정식','약 ¥1,500–3,000','https://www.negishi.co.jp/location/','고기',{reservation:'recommended',note:'좌석 예약 제공 지점. 셋이 함께 앉으려면 예약 확인.'}),
    r('규카츠 모토무라 시부야점','牛かつもと村 渋谷店','시부야 남쪽','규카츠','약 ¥2,000–3,000','https://www.gyukatsu-motomura.com/','고기'),
    r('이키나리스테이크 시부야점','いきなりステーキ 渋谷店','시부야','스테이크','약 ¥1,500–3,000','https://ikinaristeak.com/','고기'),
    r('돈카츠 와코 시부야 마크시티점','とんかつ和幸 渋谷マークシティ店','마크시티','돈카츠 정식','약 ¥1,300–2,500','https://wako-group.co.jp/','일식'),
    r('이치란 시부야점','一蘭 渋谷店','진난','돈코츠 라멘','약 ¥1,000–2,000','https://ichiran.com/shop/tokyo/','일식'),
    r('하나마루우동 시부야역 서쪽점','はなまるうどん 渋谷駅西口店','시부야역 서쪽','우동·튀김','약 ¥500–1,200','https://stores.hanamaruudon.com/hanamaru/spot/detail?code=1140','일식'),
    r('텐야 시부야 도겐자카점','天丼てんや 渋谷道玄坂店','도겐자카','텐동','약 ¥600–1,200','https://www.tenya.co.jp/','일식'),
    r('토리카츠 치킨','とりかつ チキン 渋谷','도겐자카','치킨카츠 정식','약 ¥800–1,500',null,'일식',{note:'작은 매장. 현금·좌석·영업시간을 방문 전 확인.'}),
    r('오토야 시부야 도겐자카점','大戸屋 渋谷道玄坂店','도겐자카','가정식 정식','약 ¥1,000–1,800','https://www.ootoya.com/','가정식'),
    r('사이제리야 시부야','サイゼリヤ 渋谷','시부야','파스타·이탈리안','약 ¥700–1,500','https://www.saizeriya.co.jp/','양식',{note:'저렴한 이탈리안 체인. 가볍게 한 끼.'}),
  ];
  const shinjuku=[
    r('네기시 신주쿠 동쪽점','ねぎし 新宿東口店','신주쿠 동쪽 출구','규탄 정식','약 ¥1,500–3,000','https://www.negishi.co.jp/location/','고기',{reservation:'recommended'}),
    r('규카츠 모토무라 신주쿠점','牛かつもと村 新宿店','신주쿠','규카츠','약 ¥2,000–3,000','https://www.gyukatsu-motomura.com/','고기'),
    r('이키나리스테이크 신주쿠점','いきなりステーキ 新宿店','신주쿠','스테이크','약 ¥1,500–3,000','https://ikinaristeak.com/','고기'),
    r('스시잔마이 신주쿠 동쪽점','すしざんまい 新宿東口店','신주쿠 동쪽','초밥·회','약 ¥1,500–3,000','https://www.kiyomura.co.jp/','회'),
    r('츠나하치 총본점','新宿つな八 総本店','신주쿠 3초메','텐푸라','약 ¥2,000–3,000','https://www.tunahachi.co.jp/','일식',{reservation:'check',note:'점심 메뉴 기준으로. 코스는 예산 초과 가능.'}),
    r('우동 신','うどん 慎 新宿','신주쿠 남쪽·요요기','우동','약 ¥1,200–2,500','https://www.udonshin.com/','일식',{note:'대기가 길면 이동에 맞추기 어려워요. 다른 후보도 확인.'}),
    r('멘야 무사시 총본점','麺屋武蔵 総本店','신주쿠 서쪽','라멘·츠케멘','약 ¥1,000–2,000','https://menya634.co.jp/','일식'),
    r('신파치식당 신주쿠점','しんぱち食堂 新宿店','신주쿠 서쪽','생선구이 정식','약 ¥800–1,500','https://www.shinpachi-shokudo.com/','가정식',score(4.0,breakfastRatings)),
    r('오토야 신주쿠 3초메점','大戸屋 新宿三丁目店','신주쿠 3초메','가정식 정식','약 ¥1,000–1,800','https://www.ootoya.com/','가정식'),
    r('나카무라야 Manna','新宿中村屋 Manna','신주쿠 동쪽','인도 카레·양식','약 ¥1,500–3,000','https://www.nakamuraya.co.jp/manna/','양식'),
    r('라케루 신주쿠 서쪽점','ラケル 新宿西口店','신주쿠 서쪽','오므라이스','약 ¥1,200–2,000','https://www.rakeru.jp/','양식'),
    r('아인소프 저니 신주쿠','AIN SOPH JOURNEY 新宿','신주쿠 3초메','비건 식사','약 ¥2,000–3,000','https://www.ain-soph.jp/journey','기타',{reservation:'recommended',...score(4.3,'https://www.google.com/maps/search/Breakfast%2Bat%2BAIN%2BSOPH.%2C%2BTokyo%2C%2BJapan'),note:'세트·디저트 추가 시 예산 초과 가능.'}),
  ];
  const ginza=[
    r('스시잔마이 본점','すしざんまい 本店 築地','긴자·츠키지','초밥·회','약 ¥1,500–3,000','https://www.kiyomura.co.jp/','회',{note:'24시간 운영 지점. 긴자에서 조금 이동.'}),
    r('고다이메 하나야마우동 긴자점','五代目花山うどん 銀座店','히가시긴자','넓은 우동','약 ¥1,000–2,500','https://www.hanayamaudon.co.jp/ginza/','일식',{...score(4.2,'https://www.google.com/maps/search/Godaime%2BHanayama%2BUdon%2BTokyo'),note:'평일 영업. 정리권을 받고 순서대로 입장.'}),
    r('츠루톤탄 긴자','つるとんたん UDON NOODLE Brasserie 銀座','GinzaNovo 10층','우동','약 ¥1,500–3,000','https://www.tsurutontan.co.jp/','일식',{...score(4.1,ginzaRatings),reservation:'recommended'}),
    r('야바톤 도쿄 긴자점','矢場とん 東京銀座店','히가시긴자','미소 돈카츠','약 ¥1,500–2,500','https://www.yabaton.com/','일식'),
    r('긴자 카가리 본점','銀座 篝 本店','긴자 6초메','닭백탕 라멘','약 ¥1,300–2,500',null,'일식',{note:'골목 안 매장. 대기가 길면 다른 후보로.'}),
    r('네기시 긴자 나미키도리점','ねぎし 銀座並木通り店','긴자 나미키도리','규탄 정식','약 ¥1,500–3,000','https://www.negishi.co.jp/location/','고기'),
    r('MUJI Diner 긴자','MUJI Diner 銀座','무인양품 긴자 지하','가정식·정식','약 ¥1,200–2,500','https://www.muji.com/jp/ja/shop/detail/046604','가정식'),
    r('오토야 긴자코리도점','大戸屋 銀座コリドー街店','긴자','가정식 정식','약 ¥1,000–1,800','https://www.ootoya.com/','가정식'),
    r('긴자 스위스','銀座スイス 本店','긴자 3초메','카츠카레','약 ¥1,200–2,500','https://ginza-swiss.com/','양식'),
    r('렌가테이','煉瓦亭 銀座','긴자 3초메','원조 오므라이스·요쇼쿠','약 ¥1,800–3,000',null,'양식',{note:'1895년 창업 요쇼쿠 노포. 대기 가능.'}),
    r('긴자 라이온 7초메점','ビヤホールライオン 銀座七丁目店','긴자 7초메','비어홀 요쇼쿠','약 ¥1,500–3,000','https://www.ginzalion.jp/','양식',{note:'1934년 홀. 낮부터 식사 가능.'}),
    r('긴자 텐류','銀座 天龍 本店','긴자 2초메','교자·중화','약 ¥1,500–3,000','https://www.tenryu-ginza.jp/','기타',{note:'일반 메뉴는 당일 방문. 온라인 예약은 코스만.'}),
  ];
  const dinner=[...shibuya,r('사츠마 롯폰기','北新地焼肉さつま 六本木店','롯폰기 · 별도 이동','야키니쿠','¥3,000 초과 가능','https://www.satsumaginza.com/access-roppongi','고기',{reservation:'recommended',note:'현재 동선 밖 후보예요. 선택하면 시부야 저녁·귀가 경로를 따로 확인해야 해요. 현재 18:00부터, 일·공휴일 휴무.'})];
  // 첫날 아사쿠사 분기용 저녁.
  const asakusa=[
    r('오와리야 본점','尾張屋 本店 浅草','가미나리몬','텐푸라 소바','약 ¥1,600–2,800',null,'일식',{note:'가미나리몬 근처 소바 노포. 새우튀김 소바가 대표.'}),
    r('다이코쿠야 텐푸라','大黒家天麩羅 浅草','나카미세 인근','에도마에 텐동','약 ¥1,900–2,600',null,'일식',{note:'진한 튀김덮밥 노포. 대기가 있을 수 있어요.'}),
    r('산사다','三定 浅草','가미나리몬 옆','텐푸라','약 ¥2,500–4,000',null,'일식',{reservation:'recommended',note:'1837년 창업 튀김 노포. 디너는 예산 상향 가능.'}),
    r('텐야 아사쿠사점','天丼てんや 浅草店','아사쿠사','텐동','약 ¥600–1,200','https://www.tenya.co.jp/','일식'),
    r('고마가타 도제우','駒形どぜう 本店','고마가타','도조나베(미꾸라지 전골)','약 ¥2,500–3,800','https://www.dozeu.com/','일식',{reservation:'recommended',note:'1801년 창업. 좌식 전골. 아사쿠사 남쪽 고마가타.'}),
    r('도키와 식당','ときわ食堂 雷門店','가미나리몬','대중 정식·튀김','약 ¥1,000–2,000',null,'가정식',{note:'아지프라이·정식을 가볍게. 저녁 마감이 이른 편.'}),
    r('아사쿠사 무기토로 본점','浅草むぎとろ 本店','고마가타바시','토로로 요리','약 ¥3,000 전후','https://www.mugitoro.co.jp/','가정식',{reservation:'recommended',note:'디너는 예산 상향. 예약 권장.'}),
    r('오토야 아사쿠사 롯쿠점','大戸屋 浅草ROX店','아사쿠사 롯쿠','가정식 정식','약 ¥1,000–1,800','https://www.ootoya.com/','가정식'),
    r('아사쿠사 이마한 별관','浅草今半 別館','아사쿠사','스키야키·규나베','¥5,000 초과 가능','https://www.asakusaimahan.co.jp/','고기',{reservation:'recommended',note:'예산 크게 상향되는 노포. 특별한 저녁일 때.'}),
    r('가미야 바','神谷バー 浅草','아사쿠사역 앞','요쇼쿠·데운키브랜','약 ¥2,000–3,000','https://www.kamiya-bar.com/','양식',{note:'1880년 창업. 1층 홀은 셀프. 라스트오더가 이른 편(대개 20:30 전후) — 당일 확인.'}),
    r('요시카미','ヨシカミ 浅草','신나카미세','요쇼쿠(비프스튜·하야시라이스)','약 ¥2,000–3,500','https://www.yoshikami.co.jp/','양식',{note:'1951년 창업 양식당. 인기 — 대기 가능.'}),
    r('소메타로','浅草 染太郎','아사쿠사 서쪽','오코노미야키·몬자','약 ¥1,000–1,800',null,'기타',{note:'1937년 창업 오코노미야키 노포.'}),
  ];
  // 3일차 하라주쿠·오모테산도 점심.
  const harajuku=[
    r('마이센 아오야마 본점','まい泉 青山本店','오모테산도','돈카츠·카츠산도','약 ¥1,600–3,500','https://mai-sen.com/','일식',{reservation:'recommended',note:'카츠산도는 비교적 저렴. 식사 메뉴는 예산 상향 가능.'}),
    r('아후리 하라주쿠','AFURI 原宿','하라주쿠','유즈시오 라멘','약 ¥1,200–2,000','https://afuri.com/','일식'),
    r('마루가메제면 진구마에점','丸亀製麺 神宮前店','진구마에','우동·튀김','약 ¥500–1,200','https://www.marugame-seimen.com/','일식'),
    r('이키나리스테이크 진구마에점','いきなりステーキ 神宮前店','진구마에','스테이크','약 ¥1,500–3,000','https://ikinaristeak.com/','고기'),
    r('규카츠 모토무라 오모테산도','牛かつもと村 表参道','오모테산도','규카츠','약 ¥2,000–3,000','https://www.gyukatsu-motomura.com/','고기'),
    r('오토야 하라주쿠 다케시타구치점','大戸屋 原宿竹下口店','하라주쿠','가정식 정식','약 ¥1,000–1,800','https://www.ootoya.com/','가정식'),
    r('사쿠라테이','さくら亭 原宿','우라하라주쿠','직접 굽는 오코노미야키','약 ¥1,200–2,200','http://www.sakuratei.co.jp/','기타'),
    r('하라주쿠 교자로','原宿餃子楼','하라주쿠','교자·중화','약 ¥800–1,500',null,'기타',{note:'작은 매장·현금 위주, 대기 가능.'}),
    r('에그스앤띵스 하라주쿠','Eggs ’n Things 原宿店','하라주쿠','팬케이크·브런치','약 ¥1,500–2,500','https://www.eggsnthingsjapan.com/','양식',{note:'인기 매장, 피크에는 대기 길어요.'}),
    r('더 그레이트 버거','THE GREAT BURGER 原宿','우라하라주쿠','수제버거','약 ¥1,500–2,500','http://www.the-great-burger.com/','양식'),
    r('브라운라이스 표참도','Brown Rice 表参道','오모테산도','채식 정식','약 ¥1,300–2,200','https://www.nealsyard.co.jp/brownrice/','기타'),
    r('몬순카페 표참도','モンスーンカフェ 表参道','오모테산도','아시안 다이닝','약 ¥1,500–3,000','https://www.monsoon-cafe.jp/','기타',{reservation:'recommended'}),
  ];
  return {ueno,tamachi,breakfast,shibuya,shinjuku,ginza,'shibuya-dinner':dinner,asakusa,harajuku};
})();
if(typeof module!=='undefined')module.exports=TOKYO_MEALS;
