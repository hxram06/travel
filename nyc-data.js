/* Confirmed flights and hotels; sightseeing and local transportation are suggestions. */
const NYC_TRIP = (() => {
  const p = (name, lng, lat, source) => ({name, coords:[lng,lat], ...(source ? {source} : {})});
  const places = {
    icn:p('인천국제공항 제1터미널',126.4505,37.4692),
    ewr:p('뉴어크 리버티 국제공항 터미널 B',-74.1745,40.6895),
    bayard:p('The Bayard Hotel · 145 E 49th St',-73.9729,40.7555,'https://www.thebayard.nyc/'),
    grand:p('그랜드 센트럴 터미널',-73.9772,40.7527),
    rock:p('록펠러 센터',-73.9787,40.7587),
    park:p('센트럴 파크 남쪽 입구',-73.9731,40.7648),
    wtc:p('9·11 메모리얼',-74.0134,40.7115),
    battery:p('배터리 파크',-74.0163,40.7033),
    ferry:p('스태튼아일랜드 페리 화이트홀 터미널',-74.0134,40.7018),
    marquis:p('New York Marriott Marquis · 1535 Broadway',-73.9856,40.7585,'https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/overview/'),
    times:p('타임스 스퀘어',-73.9855,40.7580),
    moma:p('뉴욕 현대미술관 MoMA',-73.9776,40.7614),
    fifth:p('5번가 · 세인트패트릭 대성당',-73.9760,40.7585),
    dumbo:p('덤보 · 맨해튼 브리지 전망',-73.9887,40.7033),
    bridge:p('브루클린 브리지 맨해튼 쪽 입구',-74.0060,40.7128),
    chinatown:p('차이나타운 · 콜럼버스 파크',-73.9992,40.7155),
    soho:p('소호 · 브로드웨이',-73.9995,40.7247),
    chelsea:p('첼시 마켓',-74.0061,40.7422),
    highline:p('하이 라인 · 23번가 부근',-74.0047,40.7480),
    hudson:p('허드슨 야드',-74.0021,40.7538),
    bryant:p('브라이언트 파크',-73.9832,40.7536),
    bus:p('Newark Airport Express · 41st St 승차장',-73.9908,40.7561,'https://www.coachusa.com/airport-transportation/newark-airport/stop-information')
  };
  const lines = {
    walk:{name:'도보 · 개략 동선',badge:'도보',color:'#668577'},
    subway:{name:'지하철 · 개략 동선',badge:'지하철',color:'#426895'},
    taxi:{name:'택시 · 도로 경로 예시',badge:'택시',color:'#bb8834'},
    bus:{name:'공항버스 · 도로 경로 예시',badge:'버스',color:'#876ca0'}
  };
  const legs={}, routes={}; let serial=0;
  function move(from,to,line,duration,note,via=[]) {
    const id=`nyc-leg-${++serial}`, coords=[places[from].coords,...via,places[to].coords];
    if(coords.length===2) coords.splice(1,0,[(coords[0][0]+coords[1][0])/2,(coords[0][1]+coords[1][1])/2]);
    legs[id]={id,from,to,line,mode:line==='walk'?'walk':'rail',duration,note};
    routes[id]={geometry:{type:'LineString',coordinates:coords}};
    return id;
  }
  function step(id,title,place,time,detail,extra={}) { return {id,title,place,time,detail,kind:'visit',...extra}; }
  function go(id,title,from,to,line,time,duration,detail,note,via=[]) {
    return step(id,title,to,time,detail,{kind:'move',legs:[move(from,to,line,duration,note,via)]});
  }
  const days=[
    {date:'2/11',weekday:'목',title:'인천 출발 · 뉴어크 도착',subtitle:'YP131 · 현지 시각 기준',steps:[
      step('ny-flight-out','인천 출발 · YP131','icn','21:40','인천 T1 출발 → 같은 날 21:15 뉴어크 도착. 13시간 35분 · 좌석 29A~29D.',{facts:['출발·도착은 각각 현지 시각','미국 입국 서류와 항공편 터미널은 출발 전 재확인']}),
      step('ny-arrive','뉴어크 입국','ewr','21:15 도착','입국심사와 수하물 수령 후 택시 승차장으로 이동해요. 늦은 도착이니 이날 관광은 넣지 않았어요.'),
      go('ny-taxi-in','택시로 첫 숙소 이동','ewr','bayard','taxi','입국 수속 후','교통 상황에 따라 변동','The Bayard Hotel에 체크인하고 휴식해요. 4인 1인 약 4만원대는 전달해 준 예상치로, 통행료·팁·짐과 차량 크기에 따라 달라져요.','택시 승차 전 4명과 캐리어 전원이 탑승 가능한지 확인.',[[-74.04,40.73]])
    ]},
    {date:'2/12',weekday:'금',title:'미드타운과 센트럴 파크',subtitle:'도착 다음 날 · 가볍게',steps:[
      go('ny-grand','그랜드 센트럴','bayard','grand','walk','오전','약 10분','역 내부와 천장을 구경하고 근처에서 천천히 아침을 먹어요.','도보 시간은 참고용.'),
      go('ny-rock','록펠러 센터','grand','rock','walk','점심 후','약 15분','5번가를 따라 록펠러 센터와 세인트패트릭 대성당 외관을 구경해요.','겨울 날씨에 따라 실내 휴식 추가.'),
      go('ny-park','센트럴 파크 남쪽','rock','park','walk','오후','약 15분','공원 남쪽만 여유롭게 산책해요. 추우면 일찍 숙소로 돌아가도 좋아요.','날씨와 일몰 시간에 맞춰 조정.')
    ]},
    {date:'2/13',weekday:'토',title:'로어 맨해튼과 자유의 여신상 전망',subtitle:'다운타운 · 페리는 선택',steps:[
      go('ny-wtc','9·11 메모리얼','bayard','wtc','subway','오전','약 30~40분','지하철로 다운타운에 가서 야외 추모 공간을 둘러봐요. 박물관 입장은 별도 선택이에요.','지하철역·운행은 방문일 지도에서 확인.',[[-73.98,40.75],[-74.006,40.715]]),
      go('ny-battery','배터리 파크','wtc','battery','walk','점심 후','약 15~20분','월가 주변을 지나 바닷가에서 자유의 여신상을 멀리 바라봐요.','바람이 강하면 실내 휴식.'),
      go('ny-ferry','스태튼아일랜드 페리 선택','battery','ferry','walk','오후','약 10분','날씨와 컨디션이 좋으면 왕복 페리에서 풍경을 즐겨요. 자유의 여신상 섬에 내리는 배는 아니에요.','왕복 운항 및 승선 절차 확인.')
    ]},
    {date:'2/14',weekday:'일',title:'숙소 이동 · 타임스 스퀘어',subtitle:'Bayard 체크아웃 → Marriott Marquis',steps:[
      step('ny-checkout1','첫 숙소 체크아웃','bayard','오전','The Bayard Hotel에서 짐을 챙겨 체크아웃해요. 첫 숙소 3박·둘째 숙소 4박은 전달받은 일차 기준이므로 바우처의 실제 날짜를 한 번 확인해요.'),
      go('ny-hotel-switch','메리어트 마르퀴스로 이동','bayard','marquis','taxi','낮','약 10~20분','캐리어가 있으니 4명과 짐이 모두 들어가는 차량을 이용해요. 체크인 전이면 짐을 맡기고 점심을 먹어요.','4인 및 수하물에 맞는 차량을 선택.'),
      step('ny-checkin2','두 번째 숙소 체크인','marquis','오후','New York Marriott Marquis 체크인. 공식 안내의 체크인 시작 시간 및 대표 투숙객 최소 연령 21세 조건을 예약 전에 확인해요.',{facts:['공식 안내: 체크인 16:00 · 조건은 변경 가능','짐 보관 가능 여부는 호텔에 확인']}),
      go('ny-times','타임스 스퀘어의 밤','marquis','times','walk','저녁','도보 몇 분','숙소 바로 주변의 야경을 보고, 브로드웨이 공연은 네 명의 취향과 예산에 맞으면 별도로 예매해요.','공연 관람은 예약 확정이 아닌 선택지.')
    ]},
    {date:'2/15',weekday:'월',title:'미술관과 5번가',subtitle:'추운 날 실내 중심',steps:[
      go('ny-moma','MoMA 관람','marquis','moma','walk','오전','약 15분','현대미술관에서 여유롭게 시간을 보내요. 운영일·요금은 여행 전에 확인해요.','관람은 제안이며 입장권 미예약.'),
      go('ny-fifth','5번가 산책','moma','fifth','walk','오후','약 10분','쇼핑과 카페를 즐기고 성당 외관을 둘러봐요. 전망대는 원할 때만 별도 선택.','날씨에 맞춰 휴식과 실내 쇼핑 위주로.')
    ]},
    {date:'2/16',weekday:'화',title:'브루클린과 맨해튼 남쪽',subtitle:'강변 전망 · 다리 산책',steps:[
      go('ny-dumbo','지하철로 덤보','marquis','dumbo','subway','오전','약 30~40분','브루클린 쪽 강변에서 맨해튼 스카이라인을 보고 카페에서 쉬어요.','방문일 운행과 가까운 역을 확인.',[[-73.99,40.75],[-73.99,40.71]]),
      go('ny-bridge','브루클린 브리지 건너기','dumbo','bridge','walk','점심 후','약 35~45분','브루클린에서 맨해튼 방향으로 걸어요. 바람이 너무 세면 지하철로 대체해요.','다리 보행로는 날씨에 따라 미끄러울 수 있어요.',[[-73.9969,40.7061]]),
      go('ny-china','차이나타운에서 식사','bridge','chinatown','walk','오후','약 10분','따뜻한 음식과 휴식 후 체력이 남으면 소호까지 둘러봐요.','식당은 취향에 맞게 현장에서 선택.'),
      go('ny-soho','소호 산책','chinatown','soho','walk','늦은 오후','약 15분','가게 구경을 하고 숙소로 돌아가요. 피곤하면 생략해도 좋아요.','복귀 지하철은 현장 길찾기로 확인.')
    ]},
    {date:'2/17',weekday:'수',title:'첼시와 허드슨 야드',subtitle:'시장과 강변 산책',steps:[
      go('ny-chelsea','첼시 마켓','marquis','chelsea','subway','오전','약 20~30분','마켓에서 간식과 점심을 고르고 천천히 둘러봐요.','지하철 또는 택시 선택.',[[-73.99,40.75]]),
      go('ny-highline','하이 라인','chelsea','highline','walk','오후','약 15~25분','날씨가 좋으면 고가 공원을 북쪽으로 산책해요. 한파나 눈이 심하면 생략해요.','겨울 운영·출입구와 노면 확인.'),
      go('ny-hudson','허드슨 야드','highline','hudson','walk','늦은 오후','약 15분','실내 쇼핑과 휴식. 전망대 Edge는 원할 경우에만 별도 예매해요.','전망대는 관광 후보이며 예약 전.')
    ]},
    {date:'2/18',weekday:'목',title:'마지막 뉴욕 · 밤 비행기',subtitle:'체크아웃 후 짐 보관 · EWR 23:15 출발',steps:[
      step('ny-checkout2','체크아웃 · 짐 맡기기','marquis','오전','체크아웃 후 짐 보관 가능 여부를 호텔에 확인하고, 찾으러 돌아올 시간을 확보해요.'),
      go('ny-bryant','브라이언트 파크','marquis','bryant','walk','낮','약 10분','가벼운 산책과 마지막 식사·쇼핑을 즐겨요. 날씨가 나쁘면 카페에서 쉬어요.','체크아웃과 짐 회수 시간을 감안.'),
      go('ny-bus-stop','짐을 찾고 공항버스 승차장으로','marquis','bus','walk','18:00 전후','약 10분','호텔에서 짐을 찾은 뒤 41번가의 승차 지점으로 이동해요. 터미널 건물 안 승차라고 단정하지 말고 공식 안내를 다시 확인해요.','승차 지점: 41st St의 8th Ave와 9th Ave 사이, 고가도로 아래. 시간은 여유를 둔 예시.'),
      go('ny-airport-bus','뉴어크 공항으로','bus','ewr','bus','18:30 전후 출발 목표','교통·배차에 따라 변동','국제선 출발 약 3시간 전인 20:15까지 EWR 도착을 목표로 해요. 버스 시간표와 항공사 터미널은 2027년 운행 기준 재확인. 불편하면 택시도 선택 가능해요.','버스 1인 $26~30은 전달받은 예상치이며 요금·배차 미확정.',[[-74.02,40.76],[-74.09,40.73]]),
      step('ny-flight-home','YP132 뉴어크 출발','ewr','23:15','EWR 터미널 B → 인천 2월 20일 04:55 도착. 15시간 40분 · 좌석 29A~29D.')
    ]},
    {date:'2/19',weekday:'금',title:'귀국 비행 중',subtitle:'날짜 변경선 통과',steps:[
      step('ny-inflight','기내에서 휴식','ewr','비행 중','뉴어크를 전날 밤 출발한 뒤 비행 중인 날짜예요. 지도에는 실제 기체 위치가 아니라 출발 공항을 기준으로 표시해요.')
    ]},
    {date:'2/20',weekday:'토',title:'인천 도착',subtitle:'한국 시간 기준 귀국',steps:[
      step('ny-arrive-home','인천국제공항 도착','icn','04:55','YP132편 도착 후 입국심사와 수하물 수령으로 여행을 마쳐요. 도착 터미널은 항공권과 공항 안내에서 확인해요.')
    ]}
  ];
  return {version:1,startOverview:true,routeNote:'항공선은 표시하지 않아요. 뉴욕의 도보·지하철·차량 이동선은 위치를 연결한 개략선이며 실제 길이나 운행 경로가 아니에요. 관광과 교통은 예시이고 항공·숙소만 전달받은 확정 정보예요.',meta:{name:'뉴욕',period:'2027.02.11 ~ 02.20 · 7박 10일 · 4명'},center:[-73.985,40.75],zoom:10,places,lines,legs,days,photos:{},overviewPlaces:['ewr','bayard','marquis','park','wtc','dumbo','hudson'],inlineRoutes:routes};
})();
if (typeof window !== 'undefined') {
  window.CITY_TRIPS[8]=NYC_TRIP;
  COURSES.push({id:8,experience:'citytrip',nameKo:'뉴욕',subtitle:'네 명의 겨울 뉴욕 · 두 곳의 미드타운 숙소',period:'2027.02.11 ~ 02.20',nights:'7박 10일',party:'4인 · 뉴어크 왕복',cities:['뉴욕','브루클린'],days:NYC_TRIP.days});
}
if (typeof module !== 'undefined') module.exports=NYC_TRIP;
