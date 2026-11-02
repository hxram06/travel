// 여행 계획 데이터. 상세 일정은 각 코스의 days를 참조한다.
const START_LOCATION = {
  "nameKo": "인천",
  "nameEn": "Incheon",
  "coords": [
    126.4507,
    37.4602
  ]
};

const COURSES = [
  {
    "id": 1,
    "nameKo": "독일 서부 - 뮌헨 - 빈",
    "subtitle": "4명이 라인강에서 바이에른·잘츠부르크를 거쳐 빈까지 이동하는 겨울 여행",
    "period": "2027년 2월 10일 ~ 2월 22일",
    "nights": "12박 13일",
    "cities": [
      "마인츠",
      "프랑크푸르트",
      "쾰른",
      "하이델베르크",
      "뮌헨",
      "잘츠부르크",
      "빈"
    ],
    "coverSpot": "qa_c9_cover_munich_base",
    "days": [
      {
        "day": 1,
        "cityKo": "마인츠",
        "cityEn": "Mainz",
        "coords": [
          8.2580625,
          49.9989375
        ],
        "moveType": "flight",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "lodging": {
          "name": "IntercityHotel Mainz",
          "coords": [
            8.2580625,
            49.9989375
          ],
          "note": "Binger Strasse 21 · 트윈룸 2개 · 객실당 싱글침대 2개 · 3박 총 676,000원"
        },
        "transport": {
          "mode": "plane",
          "label": "대한항공 KE945 ICN 11:25 (T2) → FRA 17:20 (T3) | Sky Line으로 T1 Regionalbahnhof → 마인츠 Hbf"
        },
        "via": [],
        "entryAirport": {
          "coords": [
            8.57218,
            50.04994
          ],
          "cityKo": "FRA 공항",
          "cityEn": "Frankfurt Airport T3",
          "title": "2/10(수) · 프랑크푸르트 공항 도착",
          "transport": {
            "mode": "plane",
            "label": "대한항공 KE945 ICN 11:25 → FRA 17:20 직항 (13h 55m)"
          },
          "nextTransport": {
            "mode": "train",
            "label": "T3 → Sky Line → T1 Regionalbahnhof → 마인츠 Hbf · 첫 S8/RE 이용"
          },
          "am": "인천국제공항 T2에서 수하물을 맡긴 뒤 11:25 대한항공 KE945 직항편으로 출발한다.",
          "pm": "17:20 프랑크푸르트 공항 T3에 도착해 입국 심사와 위탁수하물 수취를 진행한다.",
          "ev": "Sky Line 표지를 따라 T1로 이동한 뒤 지하 Regionalbahnhof에서 마인츠행 첫 S8 또는 RE를 탄다.",
          "tip": "항공 지연과 입국 줄을 고려해 공항철도는 고정편을 예매하지 않는다. T3에서 바로 기차를 찾지 말고 Sky Line으로 T1 Regionalbahnhof까지 이동한다. 2027년 출발 전 터미널은 항공권에서 다시 확인한다.",
          "timeline": [
            {
              "time": "08:00",
              "title": "인천공항 T2 도착",
              "detail": "대한항공 수하물 위탁·보안검색·출국 수속",
              "kind": "buffer"
            },
            {
              "time": "11:25",
              "title": "KE945 인천 출발",
              "detail": "대한항공 직항 · 비행 13시간 55분",
              "kind": "travel"
            },
            {
              "time": "17:20",
              "title": "프랑크푸르트공항 T3 도착",
              "detail": "입국심사와 4인 위탁수하물 수취",
              "kind": "travel"
            },
            {
              "time": "17:20–18:35",
              "title": "입국·수하물 수취",
              "detail": "출구로 나온 뒤 T1·Sky Line 표지판 확인",
              "kind": "buffer"
            },
            {
              "time": "18:35–19:00",
              "title": "T3에서 T1 지역열차역 이동",
              "detail": "무료 Sky Line 이용 · 승강장 이동 여유 포함",
              "kind": "travel"
            },
            {
              "time": "19:00–19:30 전후",
              "title": "마인츠행 첫 S8/RE 탑승",
              "detail": "고정 예매 없이 가장 먼저 오는 직통편 이용 · 약 25~35분",
              "kind": "travel"
            },
            {
              "time": "19:40–20:05 전후",
              "title": "Mainz Hbf 도착",
              "detail": "역에서 IntercityHotel Mainz까지 도보 약 3분",
              "kind": "travel"
            }
          ],
          "photos": [
            {
              "spot": "qa_c9_d1_entry_0",
              "at": [
                8.57218,
                50.04994
              ],
              "cap": "프랑크푸르트 공항 T3",
              "desc": "인천에서 출발한 대한항공 직항편이 도착하는 프랑크푸르트 공항 터미널 3입니다."
            },
            {
              "spot": "qa_c9_d1_entry_1",
              "at": [
                8.57081,
                50.05115
              ],
              "cap": "프랑크푸르트 공항 지역열차역",
              "desc": "터미널 1 지하에서 마인츠행 S8과 지역열차를 타는 Regionalbahnhof입니다."
            }
          ]
        },
        "title": "2/10(수) · 마인츠 도착과 첫 야경",
        "am": "인천공항 T2에서 대한항공 KE945 직항편으로 프랑크푸르트에 간다.",
        "pm": "17:20 도착 뒤 T3 입국 절차를 마치고 Sky Line과 지역열차를 이어 타 마인츠로 이동한다.",
        "ev": "이전 항공편보다 일찍 도착하므로 체크인과 저녁 뒤 슐러플라츠·마인츠 대성당 외관까지 짧은 첫 산책을 넣는다.",
        "tip": "Mainz Hbf 도착이 21:00을 넘으면 산책은 생략한다. 첫날 일정은 모두 무료 야외 구간이라 항공 지연에 따라 줄여도 손해가 없다.",
        "timeline": [
          {
            "time": "08:00",
            "title": "인천공항 T2 도착",
            "detail": "대한항공 수하물 위탁·보안검색·출국 수속",
            "kind": "buffer",
            "at": [
              126.4505,
              37.4692
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:25",
            "title": "KE945 인천 출발",
            "detail": "대한항공 직항 · 비행 13시간 55분",
            "kind": "travel",
            "at": [
              8.57218,
              50.04994
            ],
            "mode": "plane",
            "long": true,
            "via": [],
            "overviewAfter": true
          },
          {
            "time": "17:20",
            "title": "프랑크푸르트공항 T3 도착",
            "detail": "입국심사와 4인 위탁수하물 수취",
            "kind": "travel",
            "at": [
              8.57218,
              50.04994
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "17:20–18:35",
            "title": "입국·수하물 수취",
            "detail": "출구로 나온 뒤 T1·Sky Line 표지판 확인",
            "kind": "buffer",
            "at": [
              8.57218,
              50.04994
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "18:35–19:00",
            "title": "T3에서 T1 지역열차역 이동",
            "detail": "무료 Sky Line 이용 · 승강장 이동 여유 포함",
            "kind": "travel",
            "at": [
              8.57081,
              50.05115
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "19:00–19:30 전후",
            "title": "마인츠행 첫 S8/RE 탑승",
            "detail": "고정 예매 없이 가장 먼저 오는 직통편 이용 · 약 25~35분",
            "kind": "travel",
            "at": [
              8.2581,
              49.9991
            ],
            "mode": "train",
            "long": true,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "19:40–20:05 전후",
            "title": "Mainz Hbf 도착",
            "detail": "역에서 IntercityHotel Mainz까지 도보 약 3분",
            "kind": "travel",
            "at": [
              8.2581,
              49.9991
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "19:40–20:05",
            "title": "Mainz Hbf 도착·숙소 이동",
            "detail": "Binger Strasse 방향 도보 약 3분",
            "kind": "travel",
            "at": [
              8.2580625,
              49.9989375
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "20:00–20:20",
            "title": "IntercityHotel Mainz 체크인",
            "detail": "3박 · 트윈룸 2실 · 객실당 싱글침대 2개 · 방 상태 확인",
            "kind": "buffer",
            "at": [
              8.2580625,
              49.9989375
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "20:20–21:30",
            "title": "저녁 식사 자유시간",
            "detail": "숙소·Schillerplatz 사이에서 영업 중인 곳을 현장에서 선택",
            "kind": "free",
            "at": [
              8.2732,
              50.0012
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "21:30–22:10",
            "title": "슐러플라츠·마인츠 돔 야간 산책",
            "detail": "Fastnachtsbrunnen → Schillerstraße → 돔 외관 · 도보 약 2km",
            "kind": "visit",
            "at": [
              8.2732,
              50.0012
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "22:10–22:25",
            "title": "숙소 복귀",
            "detail": "다음 날 일정 전 샤워와 휴식",
            "kind": "travel",
            "at": [
              8.2580625,
              49.9989375
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "photos": [
          {
            "spot": "qa_c9_d1_entry_0",
            "at": [
              8.57218,
              50.04994
            ],
            "cap": "프랑크푸르트 공항 T3",
            "desc": "인천에서 출발한 대한항공 직항편이 도착하는 프랑크푸르트 공항 터미널 3입니다."
          },
          {
            "spot": "qa_c9_d1_entry_1",
            "at": [
              8.57081,
              50.05115
            ],
            "cap": "프랑크푸르트 공항 지역열차역",
            "desc": "터미널 1 지하에서 마인츠행 S8과 지역열차를 타는 Regionalbahnhof입니다."
          },
          {
            "spot": "qa_c9_d1_0",
            "at": [
              8.2748,
              49.9929
            ],
            "cap": "테오도어 호이스 다리",
            "desc": "마인츠 도착 후 라인강변에서 처음 만나는 야경 포인트로, 프랑크푸르트 공항에서 기차로 넘어온 뒤 독일 서부 여행의 시작 분위기를 보여줍니다."
          },
          {
            "spot": "qa_c9_d1_1",
            "at": [
              8.2748,
              49.99393923048454
            ],
            "cap": "마인츠 중앙역",
            "desc": "독일의 첫 도착지저녁 무렵 공항 기차를 타고 도착한, 붉은 벽돌과 강철 지붕이 인상적인 마인츠 중앙역 전경입니다."
          },
          {
            "spot": "qa_c9_d1_rich_000",
            "at": [
              8.2743,
              50.0001
            ],
            "cap": "마인츠 대성당 서쪽 입면",
            "desc": "붉은 사암으로 지어진 로마네스크 대성당의 서쪽 탑과 지붕선이 마인츠 구시가지의 밤 산책 기준점이 된다."
          },
          {
            "spot": "qa_c9_d1_rich_001",
            "at": [
              8.2744,
              49.999
            ],
            "cap": "구텐베르크 박물관",
            "desc": "금속활자와 42행 성경으로 유명한 박물관으로, 마인츠가 인쇄 혁명의 도시라는 사실을 가장 직접적으로 보여준다."
          },
          {
            "spot": "qa_c9_d1_rich_002",
            "at": [
              8.274,
              50
            ],
            "cap": "돔 앞 마르크트 광장",
            "desc": "대성당 앞 시장 광장은 저녁에 가판이 빠진 뒤에도 붉은 사암 건물과 좁은 골목이 남아 첫 산책의 밀도를 만든다."
          },
          {
            "spot": "qa_c9_d1_rich_003",
            "at": [
              8.2737,
              49.9977
            ],
            "cap": "키르슈가르텐 목조 골목",
            "desc": "반목조 주택이 모여 있는 작은 광장으로, 마인츠 첫날 밤에 짧게 걸어도 독일 옛 골목의 질감이 뚜렷하다."
          },
          {
            "spot": "qa_c9_d1_rich_004",
            "at": [
              8.2733,
              49.9974
            ],
            "cap": "아우구스티너키르헤 내부",
            "desc": "화려한 바로크 장식과 천장화가 있는 구시가지 교회로, 성당과는 다른 작고 농밀한 실내 풍경을 보여준다."
          },
          {
            "spot": "qa_c9_d1_rich_005",
            "at": [
              8.2641,
              49.9956
            ],
            "cap": "성 슈테판 교회",
            "desc": "푸른 스테인드글라스로 유명한 언덕 위 교회라, 낮에 다시 들르면 마인츠 구시가지와 다른 조용한 분위기를 볼 수 있다."
          },
          {
            "spot": "qa_c9_d1_rich_006",
            "at": [
              8.2676,
              49.999
            ],
            "cap": "파스트나흐츠브루넨",
            "desc": "마인츠 카니발 문화를 압축한 분수로, 슐러플라츠 주변의 밤 산책에 지역 색을 더한다."
          },
          {
            "spot": "qa_c9_d1_rich_007",
            "at": [
              8.2797,
              50.0056
            ],
            "cap": "라인강 산책로",
            "desc": "구시가지에서 강변으로 빠지면 라인강과 다리 조망이 열려, 숙소로 돌아가기 전 호흡을 고르기 좋다."
          }
        ],
        "pois": [
          {
            "name": "Eisgrub-Bräu",
            "coords": [
              8.276,
              49.9962
            ],
            "kind": "beer",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_mainz_eisgrub",
            "note": "Weißliliengasse 1a의 마인츠 대표 양조장 식당. 자체 맥주와 독일식 저녁 후보."
          },
          {
            "name": "Heiliggeist Mainz",
            "coords": [
              8.279,
              49.9987
            ],
            "kind": "food",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_mainz_heiliggeist",
            "note": "Rentengasse 2의 역사적 건물 안 레스토랑. 분위기 있는 저녁 식사 후보."
          },
          {
            "name": "Weinhaus Michel",
            "coords": [
              8.2741,
              49.9966
            ],
            "kind": "wine",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_mainz_michel",
            "note": "Jakobsbergstraße 8의 라인헤센 와인슈투베. 현지 와인과 지역 음식 후보."
          },
          {
            "name": "Kamin Mainz",
            "coords": [
              8.2731,
              49.996
            ],
            "kind": "food",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_mainz_kamin",
            "note": "Kapuzinerstraße의 플람쿠헨 레스토랑. 사진은 가게 사진 대신 대표 메뉴 이미지이며, 독일 음식이 무거울 때 나눠 먹기 좋다."
          },
          {
            "name": "MAINZDOMO",
            "coords": [
              8.2658,
              50.0011
            ],
            "kind": "korean",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_mainz_mainzdomo",
            "note": "Mittlere Bleiche 25의 일본식 스시 바 겸 한식 주방. 사진은 한식 대표 메뉴 이미지이며, 한식 대체지 후보."
          },
          {
            "name": "Chimaek Mainz Restaurant",
            "coords": [
              8.261,
              50.0014
            ],
            "kind": "korean",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_mainz_chimaek",
            "note": "Bahnhofstraße 15의 치맥/한식 후보. 사진은 치킨 대표 메뉴 이미지이며, 중앙역과 숙소에서 가까운 비상 한식 플랜."
          }
        ],
        "routeReady": true
      },
      {
        "day": 2,
        "cityKo": "프랑크푸르트",
        "cityEn": "Frankfurt",
        "coords": [
          8.6821,
          50.1109
        ],
        "moveType": "ground",
        "isTrip": true,
        "baseCity": "마인츠",
        "baseCoords": [
          8.2580625,
          49.9989375
        ],
        "lodging": {
          "name": "IntercityHotel Mainz",
          "coords": [
            8.2580625,
            49.9989375
          ],
          "note": "Binger Strasse 21 · 트윈룸 2개 · 객실당 싱글침대 2개 · 3박 총 676,000원"
        },
        "transport": {
          "mode": "train",
          "label": "Mainz Hbf → Frankfurt Hbf · S8/RE 약 40분 → U4 Dom/Römer"
        },
        "via": [
          [
            8.2580625,
            49.9989375
          ],
          [
            8.2606,
            50.001
          ],
          [
            8.6821,
            50.1109
          ]
        ],
        "title": "2/11(목) · 프랑크푸르트 구시가지와 슈테델",
        "am": "지역열차와 U4로 뢰머베르크에 들어가 구시가지 핵심을 도보로 잇는다.",
        "pm": "충분한 점심 여유 뒤 마인강을 건너 슈테델 미술관을 관람한다.",
        "ev": "작센하우젠에서 식사 장소를 현장에서 고른 뒤 마인츠로 돌아간다.",
        "tip": "슈테델은 목요일 21시까지 열지만 3시간이면 핵심 관람이 가능하다. 식사 장소는 예약하지 않고 대기시간이 짧은 곳을 고른다.",
        "timeline": [
          {
            "time": "08:20",
            "title": "숙소 출발",
            "detail": "Mainz Hbf까지 도보 약 3분",
            "kind": "travel",
            "at": [
              8.2580625,
              49.9989375
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "08:32",
            "title": "S8/RE로 프랑크푸르트 이동",
            "detail": "예매 목표 시각 · 약 40분 · 2027 지역 시간표 재확인",
            "kind": "travel",
            "at": [
              8.6638,
              50.1072
            ],
            "mode": "train",
            "long": true,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "09:15",
            "title": "U4 Frankfurt Hbf → Dom/Römer",
            "detail": "약 8분",
            "kind": "travel",
            "at": [
              8.6844,
              50.1106
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "09:30–10:45",
            "title": "뢰머베르크·신구시가지·파울교회·카이저돔",
            "detail": "모두 도보 5분 안팎으로 연결",
            "kind": "visit",
            "at": [
              8.6844,
              50.1106
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:45–11:30",
            "title": "클라이네 마르크트할레 둘러보기",
            "detail": "구매 여부는 현장에서 결정",
            "kind": "visit",
            "at": [
              8.6839,
              50.1137
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:30–13:00",
            "title": "점심·카페 자유시간",
            "detail": "구시가지 안에서 90분 여유",
            "kind": "free",
            "at": [
              8.6839,
              50.1137
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "13:00–13:45",
            "title": "아이제르너 슈테크 건너 박물관 지구로",
            "detail": "마인강과 금융가 스카이라인 감상",
            "kind": "visit",
            "at": [
              8.6822,
              50.1079
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "13:45–16:45",
            "title": "슈테델 미술관",
            "detail": "상설전 핵심 3시간 · 온라인 시간권 권장",
            "kind": "visit",
            "at": [
              8.6737,
              50.1033
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "16:45–17:30",
            "title": "마인강변 해질녘 산책",
            "detail": "미술관 앞 강변에서 스카이라인 방향",
            "kind": "visit",
            "at": [
              8.6737,
              50.1033
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "17:30–19:30",
            "title": "작센하우젠 저녁·카페 자유시간",
            "detail": "가게는 대기줄과 컨디션을 보고 선택",
            "kind": "free",
            "at": [
              8.6902,
              50.1055
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "19:30",
            "title": "Frankfurt Hbf로 이동",
            "detail": "트램·U-Bahn 중 가장 빠른 경로를 당일 앱에서 선택",
            "kind": "travel",
            "at": [
              8.6638,
              50.1072
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "20:15 전후",
            "title": "마인츠행 S8/RE 탑승",
            "detail": "예매 목표 시각 · 놓치면 다음 지역열차 이용",
            "kind": "travel",
            "at": [
              8.2581,
              49.9991
            ],
            "mode": "train",
            "long": true,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "21:00 전후",
            "title": "Mainz Hbf·숙소 도착",
            "detail": "다음 날 이른 출발을 위해 바로 휴식",
            "kind": "buffer",
            "at": [
              8.2580625,
              49.9989375
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "returnTimeline": [
          {
            "time": "19:30",
            "title": "Frankfurt Hbf로 이동",
            "detail": "트램·U-Bahn 중 가장 빠른 경로를 당일 앱에서 선택",
            "kind": "travel"
          },
          {
            "time": "20:15 전후",
            "title": "마인츠행 S8/RE 탑승",
            "detail": "예매 목표 시각 · 놓치면 다음 지역열차 이용",
            "kind": "travel"
          },
          {
            "time": "21:00 전후",
            "title": "Mainz Hbf·숙소 도착",
            "detail": "다음 날 이른 출발을 위해 바로 휴식",
            "kind": "buffer"
          }
        ],
        "photos": [
          {
            "spot": "qa_c9_d2_0",
            "at": [
              8.6827,
              50.1109
            ],
            "cap": "뢰머베르크",
            "desc": "프랑크푸르트의 구시가지 광장현대적인 마천루 사이에 자리 잡은, 전통적인 삼각 지붕의 아름다운 뢰머 시청사가 있는 광장입니다."
          },
          {
            "spot": "qa_c9_d2_1",
            "at": [
              8.6827,
              50.111939230484545
            ],
            "cap": "슈테델 미술관",
            "desc": "마인 강변의 미술관중세부터 현대까지의 명작을 품은, 클래식한 건물 외관과 정원이 어우러진 독일 최고의 미술관입니다."
          },
          {
            "spot": "qa_c9_d2_rich_008",
            "at": [
              8.6851,
              50.1106
            ],
            "cap": "프랑크푸르트 카이저돔",
            "desc": "신성로마제국 황제 선거와 대관의 기억이 남은 고딕 성당으로, 뢰머베르크와 한 묶음으로 보기 좋다."
          },
          {
            "spot": "qa_c9_d2_rich_009",
            "at": [
              8.6822,
              50.1079
            ],
            "cap": "아이제르너 슈테크",
            "desc": "마인강을 건너는 보행자 다리로, 금융가 스카이라인과 구시가지가 한 화면에 겹치는 전망 지점이다."
          },
          {
            "spot": "qa_c9_d2_rich_010",
            "at": [
              8.6721,
              50.1122
            ],
            "cap": "마인 타워 전망대",
            "desc": "프랑크푸르트 도심 고층 빌딩 중 일반 여행자가 오르기 쉬운 전망대로, 금융 도시의 수직감을 보여준다."
          },
          {
            "spot": "qa_c9_d2_rich_011",
            "at": [
              8.6839,
              50.1137
            ],
            "cap": "클라이네 마르크트할레",
            "desc": "소시지와 빵, 치즈, 와인 스탠드가 모인 실내 시장으로 점심 후보를 고르기 좋은 장소다."
          },
          {
            "spot": "qa_c9_d2_rich_012",
            "at": [
              8.6776,
              50.1111
            ],
            "cap": "괴테 하우스",
            "desc": "프랑크푸르트 출신 괴테의 생가 복원 공간으로, 짧은 도심 산책에 문학적 맥락을 더한다."
          },
          {
            "spot": "qa_c9_d2_rich_013",
            "at": [
              8.6719,
              50.1157
            ],
            "cap": "알테 오퍼",
            "desc": "오페라하우스 앞 광장은 신시가지 분위기가 강해, 중세 광장과 금융가 사이의 대비를 만든다."
          },
          {
            "spot": "qa_c9_d2_rich_014",
            "at": [
              8.6789,
              50.1138
            ],
            "cap": "하우프트바헤",
            "desc": "쇼핑 거리와 지하철이 만나는 중심 광장으로, 프랑크푸르트의 현대적인 보행 동선을 확인하기 좋다."
          },
          {
            "spot": "qa_c9_d2_rich_015",
            "at": [
              8.6902,
              50.1055
            ],
            "cap": "작센하우젠 아펠바인 골목",
            "desc": "저녁에 사과주와 전통 안주를 먹기 좋은 강 남쪽 동네로, 금융가와 전혀 다른 생활감이 있다."
          }
        ],
        "routeReady": true
      },
      {
        "day": 3,
        "cityKo": "쾰른",
        "cityEn": "Cologne",
        "coords": [
          6.9603,
          50.9413
        ],
        "moveType": "ground",
        "isTrip": true,
        "baseCity": "마인츠",
        "baseCoords": [
          8.2580625,
          49.9989375
        ],
        "lodging": {
          "name": "IntercityHotel Mainz",
          "coords": [
            8.2580625,
            49.9989375
          ],
          "note": "Binger Strasse 21 · 트윈룸 2개 · 객실당 싱글침대 2개 · 3박 총 676,000원"
        },
        "transport": {
          "mode": "train",
          "label": "Mainz Hbf 07:17 목표 → Köln Hbf 약 09:05 · 라인강 좌안 IC"
        },
        "via": [
          [
            8.2580625,
            49.9989375
          ],
          [
            8.2606,
            50.001
          ],
          [
            7.5946,
            50.3569
          ]
        ],
        "title": "2/12(금) · 쾰른 대성당 남탑과 라인강 야경",
        "am": "아침 IC로 라인강 좌안을 따라 쾰른에 도착해 겨울 16시 마감인 대성당 남탑을 가장 먼저 오른다.",
        "pm": "자유로운 점심 뒤 초콜릿 박물관을 관람하고 라인강변을 걷는다.",
        "ev": "호엔촐레른 다리를 건너 Rheinboulevard에서 대성당 야경을 본 뒤 식사하고 마인츠로 돌아간다.",
        "tip": "쾰른 남탑은 11~2월 09:00~16:00이므로 오전 고정이다. IC 좌석은 진행방향 오른쪽을 우선 선택하면 라인강 풍경을 보기 쉽다. 장거리열차 시각은 2026년 10월 중순 공개되는 2027 시간표에서 최종 확정한다.",
        "timeline": [
          {
            "time": "06:50",
            "title": "숙소 출발",
            "detail": "Mainz Hbf에서 간단한 아침을 살 시간 포함",
            "kind": "travel",
            "at": [
              8.2580625,
              49.9989375
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "07:17",
            "title": "쾰른행 IC 탑승",
            "detail": "권장편 · 라인강 좌안 경유 · 약 1시간 48분 · 2027년 시간표는 예매 전 재확인",
            "kind": "travel",
            "at": [
              6.9587,
              50.943
            ],
            "mode": "train",
            "long": true,
            "via": [
              [
                7.5886,
                50.3571
              ]
            ],
            "overviewAfter": false
          },
          {
            "time": "09:05",
            "title": "Köln Hbf 도착",
            "detail": "역 출구 바로 앞 대성당 남쪽으로 이동",
            "kind": "travel",
            "at": [
              6.9587,
              50.943
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "09:20–10:20",
            "title": "쾰른 대성당 남탑",
            "detail": "533계단 · 학생증 지참 · 악천후 시 성당 내부와 순서 교체",
            "kind": "visit",
            "at": [
              6.9583,
              50.9413
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:30–11:30",
            "title": "쾰른 대성당 내부",
            "detail": "관광 관람 가능 시간과 예배 통제를 현장 확인",
            "kind": "visit",
            "at": [
              6.9583,
              50.9413
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:30–12:15",
            "title": "구시가지·그로스 장크트 마르틴·라인강",
            "detail": "대성당에서 도보 이동",
            "kind": "visit",
            "at": [
              6.9615,
              50.9388
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:15–13:45",
            "title": "점심·카페 자유시간",
            "detail": "구시가지 또는 강변에서 90분 여유",
            "kind": "free",
            "at": [
              6.9615,
              50.9388
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "13:45–14:00",
            "title": "초콜릿 박물관으로 이동",
            "detail": "라인강변 도보 약 15분",
            "kind": "travel",
            "at": [
              6.9643,
              50.9319
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "14:00–16:00",
            "title": "초콜릿 박물관",
            "detail": "14:00 시간권 기준 · 현재 운영 10:00~18:00",
            "kind": "visit",
            "at": [
              6.9643,
              50.9319
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "16:00–16:45",
            "title": "라인강 산책·구시가지 복귀",
            "detail": "일몰 전후 사진 시간",
            "kind": "visit",
            "at": [
              6.9615,
              50.9388
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "16:45–17:50",
            "title": "호엔촐레른 다리·Rheinboulevard",
            "detail": "다리를 건너 동쪽 강변에서 대성당 야경 감상",
            "kind": "visit",
            "at": [
              6.9757,
              50.9401
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "18:00–19:25",
            "title": "저녁·카페 자유시간",
            "detail": "쾰른 시내에서 현장 선택",
            "kind": "free",
            "at": [
              6.9615,
              50.9388
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "19:35",
            "title": "Köln Hbf 복귀",
            "detail": "출발 15분 전 승강장 확인",
            "kind": "travel",
            "at": [
              6.9587,
              50.943
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "19:53",
            "title": "마인츠행 IC 탑승",
            "detail": "권장편 · 좌석지정 · 2027년 시간표는 예매 전 재확인",
            "kind": "travel",
            "at": [
              8.2581,
              49.9991
            ],
            "mode": "train",
            "long": true,
            "via": [
              [
                7.5886,
                50.3571
              ]
            ],
            "overviewAfter": false
          },
          {
            "time": "21:45 전후",
            "title": "Mainz Hbf·숙소 도착",
            "detail": "늦은 추가 일정 없이 휴식",
            "kind": "buffer",
            "at": [
              8.2580625,
              49.9989375
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "returnTimeline": [
          {
            "time": "19:35",
            "title": "Köln Hbf 복귀",
            "detail": "출발 15분 전 승강장 확인",
            "kind": "travel"
          },
          {
            "time": "19:53",
            "title": "마인츠행 IC 탑승",
            "detail": "예매 목표편 · 좌석지정 · 2027 시간표 잠정",
            "kind": "travel"
          },
          {
            "time": "21:45 전후",
            "title": "Mainz Hbf·숙소 도착",
            "detail": "늦은 추가 일정 없이 휴식",
            "kind": "buffer"
          }
        ],
        "photos": [
          {
            "spot": "qa_c9_d3_0",
            "at": [
              6.9609000000000005,
              50.9413
            ],
            "cap": "라인강 계곡 기차 풍경",
            "desc": "포도밭과 고성들마인츠에서 쾰른으로 달리는 기차 창밖으로 라인강을 따라 이어지는 가파른 포도밭과 아름다운 옛 성들입니다."
          },
          {
            "spot": "qa_c9_d3_1",
            "at": [
              6.9609000000000005,
              50.94233923048454
            ],
            "cap": "쾰른 대성당",
            "desc": "하늘을 찌르는 고딕 대성당쾰른 중앙역을 나서자마자 시야를 압도하며 서 있는 웅장하고 정교한 쌍탑의 거대한 성당입니다."
          },
          {
            "spot": "qa_c9_d3_rich_016",
            "at": [
              6.9663,
              50.9416
            ],
            "cap": "호엔촐레른 다리",
            "desc": "쾰른 대성당 동쪽으로 라인강을 건너는 철교로, 야경과 열차 통과 장면이 함께 보이는 핵심 포인트다."
          },
          {
            "spot": "qa_c9_d3_rich_017",
            "at": [
              6.9595,
              50.9407
            ],
            "cap": "루트비히 미술관",
            "desc": "대성당 바로 옆 현대미술관으로, 피카소와 팝아트 컬렉션을 짧은 동선 안에 넣을 수 있다."
          },
          {
            "spot": "qa_c9_d3_rich_018",
            "at": [
              6.964,
              50.9318
            ],
            "cap": "쾰른 초콜릿 박물관",
            "desc": "라인강변의 초콜릿 박물관은 대성당 이후 걸어가기 쉽고, 달콤한 휴식 포인트가 된다."
          },
          {
            "spot": "qa_c9_d3_rich_019",
            "at": [
              6.9625,
              50.9383
            ],
            "cap": "그로스 장크트 마르틴",
            "desc": "라인강 구시가지 스카이라인을 만드는 로마네스크 교회로, 대성당과 다른 묵직한 실루엣이 있다."
          },
          {
            "spot": "qa_c9_d3_rich_020",
            "at": [
              6.9606,
              50.9389
            ],
            "cap": "알터 마르크트",
            "desc": "브라우하우스와 야외 테이블이 모이는 구시가지 광장이라 퀼쉬 맥주 동선의 중심이 된다."
          },
          {
            "spot": "qa_c9_d3_rich_021",
            "at": [
              6.965,
              50.9256
            ],
            "cap": "라인아우하펜 크레인하우스",
            "desc": "옛 항만을 현대 건축으로 재생한 지역으로, 쾰른의 오래된 이미지와 다른 강변 풍경을 보여준다."
          },
          {
            "spot": "qa_c9_d3_rich_022",
            "at": [
              6.9587,
              50.943
            ],
            "cap": "쾰른 중앙역 플랫폼",
            "desc": "마인츠에서 라인강 계곡을 따라 도착하는 관문으로, 역 밖으로 나가자마자 대성당이 보이는 구조가 인상적이다."
          },
          {
            "spot": "qa_c9_d3_rich_023",
            "at": [
              6.9581,
              50.9402
            ],
            "cap": "프뤼 암 돔 브라우하우스",
            "desc": "대성당 근처에서 퀼쉬를 마실 수 있는 대표 브라우하우스로, 쾰른 밤 식사의 실전 후보가 된다."
          }
        ],
        "routeReady": true
      },
      {
        "day": 4,
        "cityKo": "하이델베르크",
        "cityEn": "Heidelberg",
        "coords": [
          8.7086,
          49.4094
        ],
        "moveType": "ground",
        "isTrip": true,
        "baseCity": "뮌헨",
        "baseCityEn": "Munich",
        "baseCoords": [
          11.614785,
          48.1355713
        ],
        "lodging": {
          "name": "Holiday Inn Munich – Leuchtenbergring",
          "coords": [
            11.614785,
            48.1355713
          ],
          "note": "Leuchtenbergring 20 · 스탠다드 트윈룸 2개 · 객실당 싱글침대 2개 · 아고다 플래티넘 적용 4박 총 676,938원"
        },
        "transport": {
          "mode": "train",
          "label": "IntercityHotel Mainz → Mainz Hbf → 하이델베르크 · 당일 관광"
        },
        "via": [
          [
            8.2580625,
            49.9989375
          ],
          [
            8.2606,
            50.001
          ],
          [
            8.466,
            49.4875
          ]
        ],
        "returnVia": [
          [
            9.1829,
            48.7758
          ],
          [
            10.0344,
            48.4011
          ],
          [
            10.8978,
            48.3655
          ],
          [
            11.5583,
            48.1402
          ]
        ],
        "returnTransport": {
          "mode": "train",
          "label": "Heidelberg Hbf 19:30 목표 → München Hbf 약 22:30 · ICE/IC"
        },
        "title": "2/13(토) · 마인츠 인쇄문화와 하이델베르크 성",
        "am": "체크아웃 뒤 짐을 호텔에 잠시 맡기고 구텐베르크 박물관 MOVED의 핵심 전시를 본 후 하이델베르크로 이동한다.",
        "pm": "역 보관함에 짐을 맡기고 버스와 푸니쿨라로 성에 올라간 뒤 구시가지와 알테 브뤼케를 걷는다.",
        "ev": "충분한 식사 시간을 두고 역으로 돌아와 짐을 찾는다.",
        "returnEv": "알테 브뤼케에서 성과 구시가지 조명을 본 뒤 19:30 전후 열차로 뮌헨에 이동해 Holiday Inn Munich – Leuchtenbergring에 체크인한다.",
        "returnTip": "뮌헨행 열차는 2027 시간표 공개 뒤 19:15~19:45 출발편 중 환승이 가장 안정적인 편으로 확정한다. 다음 날 05:45 출발이므로 열차 안에서 쉬는 편이 좋다.",
        "tip": "하이델베르크 성은 09:00~18:00, 마지막 입장 17:30이다. 중앙역 보관함에 3개가 다 들어가지 않을 수 있으므로 대형함 2개분을 가정한다.",
        "timeline": [
          {
            "time": "08:15",
            "title": "체크아웃·호텔에 짐 보관",
            "detail": "바로 박물관으로 가져가지 않고 호텔 프런트 이용",
            "kind": "buffer",
            "at": [
              8.2580625,
              49.9989375
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "08:35",
            "title": "구텐베르크 박물관 임시 전시장로 이동",
            "detail": "숙소에서 도보 약 20분",
            "kind": "travel",
            "at": [
              8.2706,
              50.0031
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "09:00–10:05",
            "title": "구텐베르크 박물관 핵심 관람",
            "detail": "42행 성경과 인쇄 시연 중심",
            "kind": "visit",
            "at": [
              8.2706,
              50.0031
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:05–10:30",
            "title": "호텔 복귀·짐 회수",
            "detail": "Mainz Hbf 승강장까지 이동",
            "kind": "travel",
            "at": [
              8.2580625,
              49.9989375
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:42",
            "title": "하이델베르크행 열차",
            "detail": "권장편 · Mannheim 환승 · 약 1시간 · 2027년 시간표는 예매 전 재확인",
            "kind": "travel",
            "at": [
              8.6754,
              49.4036
            ],
            "mode": "train",
            "long": true,
            "via": [
              [
                8.4699,
                49.4796
              ]
            ],
            "overviewAfter": false
          },
          {
            "time": "11:50",
            "title": "Heidelberg Hbf 보관함",
            "detail": "캐리어 3개 · 약 15분 예상",
            "kind": "buffer",
            "at": [
              8.6754,
              49.4036
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:05",
            "title": "버스 33번으로 Rathaus/Bergbahn",
            "detail": "약 20분 · 교통앱에서 공사·정류장 확인",
            "kind": "travel",
            "at": [
              8.7097,
              49.4112
            ],
            "mode": "bus",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:30",
            "title": "푸니쿨라 탑승",
            "detail": "Kornmarkt → Schloss",
            "kind": "travel",
            "at": [
              8.7097,
              49.4112
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:45–14:30",
            "title": "하이델베르크 성",
            "detail": "안뜰·테라스·대형 와인통·약제박물관",
            "kind": "visit",
            "at": [
              8.7159,
              49.4106
            ],
            "mode": "funicular",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "14:30–15:45",
            "title": "구시가지와 알테 브뤼케",
            "detail": "Marktplatz → 성령교회 → Hauptstraße → 다리",
            "kind": "visit",
            "at": [
              8.7097,
              49.4142
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "15:45–17:00",
            "title": "늦은 점심·카페 자유시간",
            "detail": "구시가지에서 75분 여유",
            "kind": "free",
            "at": [
              8.7097,
              49.4142
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "17:00–18:15",
            "title": "알테 브뤼케의 일몰과 야경",
            "detail": "일몰 약 17:14 · 다리와 강변에서 조명이 켜진 성·구시가지 감상",
            "kind": "visit",
            "at": [
              8.7097,
              49.4142
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "18:15",
            "title": "버스 33번으로 중앙역 복귀",
            "detail": "알테 브뤼케 인근 정류장에서 약 20분",
            "kind": "travel",
            "at": [
              8.6754,
              49.4036
            ],
            "mode": "bus",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "18:45",
            "title": "보관함 짐 회수·승강장 확인",
            "detail": "간식과 물 구입 시간 포함",
            "kind": "buffer",
            "at": [
              8.6754,
              49.4036
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "19:30",
            "title": "뮌헨행 ICE/IC 탑승",
            "detail": "권장편 · 좌석지정 · 2027년 시간표는 예매 전 재확인",
            "kind": "travel",
            "at": [
              11.5583,
              48.1402
            ],
            "mode": "train",
            "long": true,
            "via": [
              [
                8.4699,
                49.4796
              ]
            ],
            "overviewAfter": false
          },
          {
            "time": "22:30 전후",
            "title": "München Hbf 도착·S-Bahn 환승",
            "detail": "Leuchtenbergring까지 직통 약 10~12분",
            "kind": "travel",
            "at": [
              11.5583,
              48.1402
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "23:00 전후",
            "title": "Holiday Inn 체크인",
            "detail": "역에서 도보 약 3~4분 · 스탠다드룸 2개 · 4박",
            "kind": "buffer",
            "at": [
              11.614785,
              48.1355713
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "23:15 이후",
            "title": "가벼운 식사·휴식 자유시간",
            "detail": "다음 날 05:45 숙소 출발",
            "kind": "free",
            "at": [
              11.614785,
              48.1355713
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "returnTimeline": [
          {
            "time": "18:15",
            "title": "버스 33번으로 중앙역 복귀",
            "detail": "알테 브뤼케 인근 정류장에서 약 20분",
            "kind": "travel"
          },
          {
            "time": "18:45",
            "title": "보관함 짐 회수·승강장 확인",
            "detail": "간식과 물 구입 시간 포함",
            "kind": "buffer"
          },
          {
            "time": "19:30",
            "title": "뮌헨행 ICE/IC 탑승",
            "detail": "예매 목표편 · 좌석지정 · 2027 시간표 잠정",
            "kind": "travel"
          },
          {
            "time": "22:30 전후",
            "title": "München Hbf 도착·S-Bahn 환승",
            "detail": "Leuchtenbergring까지 직통 약 10~12분",
            "kind": "travel"
          },
          {
            "time": "23:00 전후",
            "title": "Holiday Inn 체크인",
            "detail": "역에서 도보 약 3~4분 · 스탠다드룸 2개 · 4박",
            "kind": "buffer"
          },
          {
            "time": "23:15 이후",
            "title": "가벼운 식사·휴식 자유시간",
            "detail": "다음 날 05:45 숙소 출발",
            "kind": "free"
          }
        ],
        "photos": [
          {
            "spot": "qa_c9_d4_before_0_nested_0_0",
            "at": [
              8.7139,
              49.4096
            ],
            "cap": "하이델베르크 성 — 독일 낭만주의의 상징",
            "desc": "30년 전쟁과 번개로 파괴되었지만 폐허 그 자체로 괴테와 수많은 낭만주의 시인들에게 영감을 준 웅장한 팔츠 선제후의 궁전."
          },
          {
            "spot": "qa_c9_d4_before_0_nested_0_1",
            "at": [
              8.7097,
              49.4121
            ],
            "cap": "알테 브뤼케 — 넥카 강을 지키는 카를 테오도르 다리",
            "desc": "1788년 건립된 석조 아치교로 다리 입구의 쌍탑 문과 다리 위에서 바라보는 하이델베르크 성의 풍경이 환상적이다."
          },
          {
            "spot": "qa_c9_d4_rich_024",
            "at": [
              8.71,
              49.4122
            ],
            "cap": "하이델베르크 구시가지",
            "desc": "하우프트슈트라세와 작은 골목이 길게 이어지는 구시가지로, 성에 오르기 전 천천히 걷기 좋다."
          },
          {
            "spot": "qa_c9_d4_rich_025",
            "at": [
              8.7105,
              49.4123
            ],
            "cap": "성령교회",
            "desc": "시장 광장에 선 붉은 사암 교회로, 하이델베르크 구시가지의 중심축을 잡아준다."
          },
          {
            "spot": "qa_c9_d4_rich_026",
            "at": [
              8.7068,
              49.4108
            ],
            "cap": "하이델베르크 대학도서관",
            "desc": "독일에서 오래된 대학 도시답게 학문 도시의 분위기를 보여주는 대표 건물이다."
          },
          {
            "spot": "qa_c9_d4_rich_027",
            "at": [
              8.7039,
              49.4157
            ],
            "cap": "철학자의 길 전망",
            "desc": "넥카강 북쪽 언덕길에서 성과 구시가지를 내려다보는 산책로로, 당일치기에서 가장 낭만적인 전망을 만든다."
          },
          {
            "spot": "qa_c9_d4_rich_028",
            "at": [
              8.7116,
              49.4116
            ],
            "cap": "코른마르크트",
            "desc": "성으로 오르는 길목의 작은 광장으로, 성벽과 성모상이 함께 잡히는 사진 포인트다."
          },
          {
            "spot": "qa_c9_d4_rich_029",
            "at": [
              8.7154,
              49.4107
            ],
            "cap": "하이델베르크 대형 와인통",
            "desc": "성 내부에 있는 거대한 와인통으로, 팔츠 궁정 문화와 와인 지역의 규모감을 보여준다."
          },
          {
            "spot": "qa_c9_d4_rich_030",
            "at": [
              8.708,
              49.411
            ],
            "cap": "학생감옥",
            "desc": "옛 대학생들이 남긴 낙서와 방이 보존된 공간으로, 고성 풍경과 다른 하이델베르크의 생활사를 보여준다."
          },
          {
            "spot": "qa_c9_d4_rich_031",
            "at": [
              8.7133,
              49.4109
            ],
            "cap": "하이델베르크 베르크반",
            "desc": "구시가지에서 성까지 오르는 푸니쿨라로, 짧은 당일치기의 체력 부담을 줄여주는 핵심 이동수단이다."
          },
          {
            "spot": "qa_c9_d4_arrival_0",
            "at": [
              11.5614,
              48.1402
            ],
            "cap": "뮌헨 중앙역 도착",
            "desc": "늦은 밤 하이델베르크에서 뮌헨으로 넘어온 뒤 Leuchtenbergring행 S-Bahn으로 갈아타는 중앙역 남쪽 입구입니다."
          },
          {
            "spot": "qa_c9_d4_arrival_1",
            "at": [
              11.5717,
              48.1374
            ],
            "cap": "마리엔플라츠",
            "desc": "뮌헨 저녁 선택지가 열리는 기준점으로, 다음 날 맥주 투어와 구시가지 산책이 이어질 중심 광장입니다."
          }
        ],
        "returnPhotos": [
          {
            "spot": "qa_c9_d4_arrival_0",
            "at": [
              11.5614,
              48.1402
            ],
            "cap": "뮌헨 중앙역 도착",
            "desc": "늦은 밤 하이델베르크에서 뮌헨으로 넘어온 뒤 Leuchtenbergring행 S-Bahn으로 갈아타는 중앙역 남쪽 입구입니다."
          },
          {
            "spot": "qa_c9_d4_arrival_1",
            "at": [
              11.5717,
              48.1374
            ],
            "cap": "마리엔플라츠",
            "desc": "뮌헨 저녁 선택지가 열리는 기준점으로, 다음 날 맥주 투어와 구시가지 산책이 이어질 중심 광장입니다."
          }
        ],
        "routeReady": true
      },
      {
        "day": 5,
        "cityKo": "추크슈피체",
        "cityEn": "Zugspitze",
        "coords": [
          10.985,
          47.421
        ],
        "moveType": "stay",
        "isTrip": true,
        "baseCity": "뮌헨",
        "baseCityEn": "Munich",
        "baseCoords": [
          11.614785,
          48.1355713
        ],
        "lodging": {
          "name": "Holiday Inn Munich – Leuchtenbergring",
          "coords": [
            11.614785,
            48.1355713
          ],
          "note": "Leuchtenbergring 20 · 스탠다드 트윈룸 2개 · 객실당 싱글침대 2개 · 아고다 플래티넘 적용 4박 총 676,938원"
        },
        "transport": {
          "mode": "train",
          "label": "Holiday Inn → Leuchtenbergring S-Bahn → 뮌헨 Hbf → 가르미슈 → 추크슈피체"
        },
        "via": [
          [
            11.614785,
            48.1355713
          ],
          [
            11.5583,
            48.1402
          ],
          [
            11.095,
            47.492
          ],
          [
            10.985,
            47.421
          ]
        ],
        "title": "2/14(일) · 추크슈피체 순환과 아이브제",
        "am": "첫 지역열차와 08:15 톱니열차를 연결해 추크슈피체 정상에 오른다.",
        "pm": "정상 전망과 식사 뒤 케이블카로 아이브제에 내려 짧은 겨울 호숫가만 걷는다.",
        "ev": "가르미슈를 거쳐 17시대 뮌헨으로 돌아와 저녁을 자유롭게 보낸다.",
        "tip": "48시간 전 공식 웹캠과 바람을 확인한다. 2/14가 흐리고 2/15가 맑으면 뮌헨 시내 일정과 서로 바꾸며, 산악권 표는 예보 확인 뒤 산다. 이 경우 시장 방문은 2/17 오전 예비안으로 넘긴다.",
        "timeline": [
          {
            "time": "05:45",
            "title": "Holiday Inn 출발",
            "detail": "Leuchtenbergring역 도보 → S-Bahn으로 München Hbf 이동",
            "kind": "travel",
            "at": [
              11.614785,
              48.1355713
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "06:32",
            "title": "RB6 가르미슈행 탑승",
            "detail": "권장편 · 약 1시간 22분 · 2027년 시간표는 예매 전 재확인",
            "kind": "travel",
            "at": [
              11.5583,
              48.1402
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "07:54",
            "title": "Garmisch-Partenkirchen 도착",
            "detail": "역 옆 Zugspitzbahnhof까지 도보 약 5분",
            "kind": "travel",
            "at": [
              11.095,
              47.492
            ],
            "mode": "train",
            "long": true,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "08:15",
            "title": "바이에른 추크슈피츠반 톱니열차",
            "detail": "Garmisch → Zugspitzplatt · 약 75분",
            "kind": "travel",
            "at": [
              11.095,
              47.492
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "09:35",
            "title": "Gletscherbahn으로 정상 이동",
            "detail": "빙하역에서 케이블카 환승",
            "kind": "travel",
            "at": [
              10.9807,
              47.4165
            ],
            "mode": "train",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "09:45–11:30",
            "title": "추크슈피체 정상 전망대",
            "detail": "독일·오스트리아 양쪽 전망 · 강풍 시 실내 비중 확대",
            "kind": "visit",
            "at": [
              10.985,
              47.421
            ],
            "mode": "cablecar",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:30–12:30",
            "title": "점심·몸 녹이기 자유시간",
            "detail": "정상 시설 안에서 1시간 여유",
            "kind": "free",
            "at": [
              10.985,
              47.421
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:30",
            "title": "정상 → 아이브제 케이블카",
            "detail": "약 10분",
            "kind": "travel",
            "at": [
              10.985,
              47.421
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:45–14:10",
            "title": "아이브제 겨울 호숫가 산책",
            "detail": "전 구간 일주가 아닌 북쪽 짧은 왕복 · 결빙 시 축소",
            "kind": "visit",
            "at": [
              10.9736,
              47.4576
            ],
            "mode": "cablecar",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "14:15–15:00",
            "title": "가르미슈역 방향 복귀",
            "detail": "톱니열차 또는 공식 연결편 · 당일 운행표 확인",
            "kind": "travel",
            "at": [
              10.9736,
              47.4576
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "15:05–15:50",
            "title": "간식·카페 자유시간",
            "detail": "역 주변에서 열차 지연 완충",
            "kind": "free",
            "at": [
              11.095,
              47.492
            ],
            "mode": "train",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "16:07",
            "title": "RB6 뮌헨행 탑승",
            "detail": "권장편 · 2027년 시간표는 예매 전 재확인",
            "kind": "travel",
            "at": [
              11.095,
              47.492
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "17:26",
            "title": "München Hbf 도착",
            "detail": "Leuchtenbergring행 S-Bahn 환승",
            "kind": "travel",
            "at": [
              11.5583,
              48.1402
            ],
            "mode": "train",
            "long": true,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "17:55",
            "title": "숙소 휴식",
            "detail": "젖은 장갑·양말 건조",
            "kind": "buffer",
            "at": [
              11.614785,
              48.1355713
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "18:30 이후",
            "title": "저녁 식사 자유시간",
            "detail": "다음 날 뮌헨 시내 일정이라 늦지 않게 자유롭게 사용",
            "kind": "free",
            "at": [
              11.614785,
              48.1355713
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "returnTimeline": [
          {
            "time": "16:07",
            "title": "RB6 뮌헨행 탑승",
            "detail": "예매 목표편 · 2027 시간표 잠정",
            "kind": "travel"
          },
          {
            "time": "17:26",
            "title": "München Hbf 도착",
            "detail": "Leuchtenbergring행 S-Bahn 환승",
            "kind": "travel"
          },
          {
            "time": "17:55",
            "title": "숙소 휴식",
            "detail": "젖은 장갑·양말 건조",
            "kind": "buffer"
          },
          {
            "time": "18:30 이후",
            "title": "저녁 식사 자유시간",
            "detail": "다음 날 뮌헨 시내 일정이라 늦지 않게 자유롭게 사용",
            "kind": "free"
          }
        ],
        "photos": [
          {
            "spot": "qa_c9_d6_zugspitze_0",
            "at": [
              10.985,
              47.421
            ],
            "cap": "추크슈피체 정상 파노라마",
            "desc": "추크슈피체 플랫폼에서 아이브제와 가르미슈-파르텐키르헨 방향을 내려다보는 실제 정상 파노라마입니다."
          },
          {
            "spot": "qa_c9_d6_zugspitze_1",
            "at": [
              10.9845,
              47.4215
            ],
            "cap": "추크슈피체에서 본 겨울 풍경",
            "desc": "추크슈피체 정상에서 내려다본 겨울 산악 마을과 설산 풍경으로, 뮌헨에서 당일 다녀올 알프스의 규모를 보여줍니다."
          },
          {
            "spot": "qa_c9_d6_rich_040",
            "at": [
              10.9736,
              47.4576
            ],
            "cap": "아이브제 호수",
            "desc": "추크슈피체 아래의 투명한 호수로, 날씨가 좋으면 정상 전후에 알프스와 물빛을 함께 볼 수 있다."
          },
          {
            "spot": "qa_c9_d6_rich_041",
            "at": [
              11.095,
              47.492
            ],
            "cap": "바이에른 추크슈피츠반",
            "desc": "가르미슈에서 정상 방향으로 이어지는 산악철도로, 당일치기 이동 자체가 여행의 일부가 된다."
          },
          {
            "spot": "qa_c9_d6_rich_042",
            "at": [
              11.0955,
              47.4921
            ],
            "cap": "가르미슈파르텐키르헨 마을",
            "desc": "알프스 기슭의 관문 도시로, 뮌헨에서 열차로 내려 산악 교통으로 갈아타는 지점이다."
          },
          {
            "spot": "qa_c9_d6_rich_043",
            "at": [
              10.992,
              47.43
            ],
            "cap": "알프슈피체 능선",
            "desc": "추크슈피체 옆의 날카로운 산봉우리로, 정상 전망대에서 독일 알프스의 입체감을 더해준다."
          },
          {
            "spot": "qa_c9_d6_rich_044",
            "at": [
              10.9807,
              47.4165
            ],
            "cap": "슈네페르너하우스",
            "desc": "추크슈피체 남쪽 사면의 연구 시설로, 고산 지대의 거친 환경을 보여주는 독특한 풍경이다."
          },
          {
            "spot": "qa_c9_d6_rich_045",
            "at": [
              10.9848,
              47.421
            ],
            "cap": "추크슈피체 정상 십자가",
            "desc": "독일 최고봉의 상징인 금빛 정상 십자가로, 전망대에서 가장 직접적인 인증 포인트가 된다."
          },
          {
            "spot": "qa_c9_d6_rich_046",
            "at": [
              10.932,
              47.404
            ],
            "cap": "티롤러 추크슈피츠반 케이블카",
            "desc": "오스트리아 쪽에서 오르는 케이블카 노선으로, 정상 주변 케이블 교통의 규모를 보여준다."
          },
          {
            "spot": "qa_c9_d6_rich_047",
            "at": [
              11.117,
              47.465
            ],
            "cap": "파트나흐 협곡",
            "desc": "가르미슈 근처의 깊은 협곡으로, 날씨가 나쁠 때 정상 대신 고려할 수 있는 자연 대안이다."
          }
        ],
        "routeReady": true
      },
      {
        "day": 6,
        "cityKo": "뮌헨",
        "cityEn": "Munich",
        "coords": [
          11.614785,
          48.1355713
        ],
        "moveType": "stay",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "lodging": {
          "name": "Holiday Inn Munich – Leuchtenbergring",
          "coords": [
            11.614785,
            48.1355713
          ],
          "note": "Leuchtenbergring 20 · 스탠다드 트윈룸 2개 · 객실당 싱글침대 2개 · 아고다 플래티넘 적용 4박 총 676,938원"
        },
        "transport": {
          "mode": "subway",
          "label": "Holiday Inn → Leuchtenbergring S-Bahn → Marienplatz → 구시가지 → 숙소"
        },
        "via": [
          [
            11.614785,
            48.1355713
          ],
          [
            11.5755,
            48.1374
          ],
          [
            11.5794,
            48.1393
          ],
          [
            11.614785,
            48.1355713
          ]
        ],
        "title": "2/15(월) · 뮌헨 구시가지·빅투알리엔마르크트·세탁",
        "am": "천천히 아침을 먹은 뒤 Leuchtenbergring에서 S-Bahn으로 Marienplatz에 가 11시 신시청사 글로켄슈필을 본다.",
        "pm": "레지덴츠 안뜰과 오데온스플라츠까지 도보로 잇고, 식사와 카페는 현장에서 고른다.",
        "ev": "저녁 뒤 중앙역 인근 셀프 세탁소에서 여행 중간 세탁을 마친다.",
        "tip": "월요일에는 빅투알리엔마르크트 점포가 정상 영업하므로 1시간을 확보한다. 개별 가판 영업시간은 다를 수 있으며, 글로켄슈필은 11시에 본다.",
        "timeline": [
          {
            "time": "09:00–10:00",
            "title": "아침 식사 자유시간",
            "detail": "숙소 주변에서 현장 선택",
            "kind": "free",
            "at": [
              11.614785,
              48.1355713
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:00",
            "title": "Holiday Inn 출발",
            "detail": "Leuchtenbergring역까지 도보 3~4분 → S-Bahn 직통",
            "kind": "travel",
            "at": [
              11.5755,
              48.1374
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:30",
            "title": "Marienplatz 도착",
            "detail": "신시청사 정면에서 관람 위치 잡기",
            "kind": "buffer",
            "at": [
              11.5755,
              48.1374
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:00–11:15",
            "title": "신시청사 글로켄슈필",
            "detail": "무료 · 겨울에도 매일 11:00·12:00",
            "kind": "visit",
            "at": [
              11.5754,
              48.137
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:15–12:15",
            "title": "성 페터교회·빅투알리엔마르크트",
            "detail": "과일·치즈·소시지·꽃 가판과 비어가르텐 구역을 천천히 둘러보기",
            "kind": "visit",
            "at": [
              11.5765,
              48.1352
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:15–13:45",
            "title": "점심·카페 자유시간",
            "detail": "시장 또는 마리엔플라츠 주변에서 90분 여유",
            "kind": "free",
            "at": [
              11.5765,
              48.1352
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "13:45–15:30",
            "title": "Alter Hof·레지덴츠 안뜰·오데온스플라츠·호프가르텐",
            "detail": "실내 유료 관람 없이 도보 약 2km",
            "kind": "visit",
            "at": [
              11.5779,
              48.1428
            ],
            "mode": "walk",
            "long": false,
            "via": [
              [
                11.5761,
                48.1404
              ]
            ],
            "overviewAfter": false
          },
          {
            "time": "15:30–17:00",
            "title": "카페·맥주 자유시간",
            "detail": "걷기 속도와 대기줄에 따라 유연하게 사용",
            "kind": "free",
            "at": [
              11.5779,
              48.1428
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "17:00–18:00",
            "title": "구시가지 저녁 산책·숙소 방향 복귀",
            "detail": "Theatinerstraße → Frauenkirche → Karlsplatz",
            "kind": "visit",
            "at": [
              11.5657,
              48.1391
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "18:00–19:30",
            "title": "저녁 식사 자유시간",
            "detail": "후보 핀은 참고만 하고 예약하지 않음",
            "kind": "free",
            "at": [
              11.5657,
              48.1391
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "19:45–21:15",
            "title": "셀프 세탁",
            "detail": "München Hbf 인근 · 세탁소 영업시간은 출발 전 재확인",
            "kind": "buffer",
            "at": [
              11.5583,
              48.1402
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "21:45",
            "title": "숙소 복귀",
            "detail": "Hauptbahnhof에서 Leuchtenbergring까지 S-Bahn · 다음 날 06:20 출발 준비",
            "kind": "travel",
            "at": [
              11.614785,
              48.1355713
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "pois": [
          {
            "name": "Augustiner Klosterwirt",
            "coords": [
              11.5728,
              48.1384
            ],
            "kind": "beer",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_augustiner_klosterwirt",
            "note": "Frauenkirche 옆 Augustiner 계열 전통 식당. 중심부 맥주 투어 후보."
          },
          {
            "name": "Schneider Bräuhaus",
            "coords": [
              11.5784671,
              48.1364226
            ],
            "kind": "beer",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_schneider_brauhaus",
            "note": "Tal 거리의 밀맥주 중심 브로이하우스. 마리엔플라츠 동쪽 후보."
          },
          {
            "name": "Herrschaftszeiten - Das Paulaner im Tal",
            "coords": [
              11.5785033,
              48.1359681
            ],
            "kind": "beer",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_herrschaftszeiten",
            "note": "Tal 12의 Paulaner 계열 바이에른 식당. Schneider와 가까워 비교하기 좋다."
          },
          {
            "name": "Brauhaus am Kapuzinerplatz",
            "coords": [
              11.558832,
              48.126305
            ],
            "kind": "beer",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_brauhaus_kapuzinerplatz",
            "note": "Kapuzinerplatz의 전통 브로이하우스. 중심부보다 남쪽이라 여유 있을 때 후보."
          },
          {
            "name": "Hofbräuhaus München",
            "coords": [
              11.579767,
              48.13768
            ],
            "kind": "beer",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_hofbraeuhaus",
            "note": "Platzl의 대표 맥주홀. 관광객이 많지만 뮌헨 첫 방문 상징성이 크다."
          },
          {
            "name": "Pocha 뮌헨포차",
            "coords": [
              11.5842417,
              48.1343276
            ],
            "kind": "korean",
            "priority": "must",
            "photoSpot": "qa_c9_poi_pocha",
            "note": "독일 음식에 물렸을 때 사실상 필수로 잡는 한식/포차 플랜."
          }
        ],
        "photos": [
          {
            "spot": "qa_c9_d5_beer_0",
            "at": [
              11.5784,
              48.1378
            ],
            "cap": "학센바우어의 Haxenbraterei",
            "desc": "뮌헨 중심의 학센 전문점에서 바이에른식 돼지 족발을 구워내는 장면으로, 이날 저녁 방문할 음식의 실제 분위기를 보여줍니다."
          },
          {
            "spot": "qa_c9_d5_beer_1",
            "at": [
              11.5784,
              48.1378
            ],
            "cap": "학센바우어 주방",
            "desc": "학센바우어 주방 내부의 실제 기록 사진으로, 회전 구이와 전통적인 뮌헨 식당의 조리 공간을 확인할 수 있습니다."
          },
          {
            "spot": "qa_c9_d5_rich_032",
            "at": [
              11.5755,
              48.1374
            ],
            "cap": "마리엔플라츠 신시청사",
            "desc": "뮌헨 구시가지의 중심 광장으로, 글로켄슈필과 고딕풍 신시청사가 맥주 투어의 출발점을 만든다."
          },
          {
            "spot": "qa_c9_d5_rich_033",
            "at": [
              11.5736,
              48.1386
            ],
            "cap": "프라우엔키르헤 쌍탑",
            "desc": "둥근 지붕의 쌍탑이 뮌헨 구시가지 스카이라인을 대표해, 맥주홀 사이 이동 중 방향 감각을 잡아준다."
          },
          {
            "spot": "qa_c9_d5_rich_034",
            "at": [
              11.5765,
              48.1352
            ],
            "cap": "빅투알리엔마르크트",
            "desc": "치즈, 소시지, 맥주가 모이는 시장으로, 점심 맥주 투어 전후에 간단히 먹기 좋다."
          },
          {
            "spot": "qa_c9_d5_rich_035",
            "at": [
              11.5798,
              48.1376
            ],
            "cap": "호프브로이하우스 홀",
            "desc": "관광객이 많아도 뮌헨 맥주홀의 상징성이 가장 큰 장소라 첫 방문 후보로 남겨둘 만하다."
          },
          {
            "spot": "qa_c9_d5_rich_036",
            "at": [
              11.578,
              48.1419
            ],
            "cap": "뮌헨 레지덴츠 외관",
            "desc": "바이에른 왕가의 궁전 단지로, 맥주홀 중심 동선에서 북쪽으로 조금만 걸어도 만나는 역사 지점이다."
          },
          {
            "spot": "qa_c9_d5_rich_037",
            "at": [
              11.5779,
              48.1428
            ],
            "cap": "오데온스플라츠",
            "desc": "테아티너 교회와 펠트헤른할레가 마주 보는 광장으로, 구시가지 북쪽 산책의 끝점을 잡아준다."
          },
          {
            "spot": "qa_c9_d5_rich_038",
            "at": [
              11.5697,
              48.135
            ],
            "cap": "아잠키르헤",
            "desc": "작은 규모에 과밀한 바로크 장식이 응축된 교회라, 맥주홀 사이 짧은 실내 명소로 좋다."
          },
          {
            "spot": "qa_c9_d5_rich_039",
            "at": [
              11.5657,
              48.1391
            ],
            "cap": "카를스플라츠 슈타쿠스",
            "desc": "구시가지 서쪽의 큰 광장으로, 저녁 식사와 중앙역 인근 세탁소로 이동할 때 기준점이 된다."
          }
        ],
        "routeReady": true
      },
      {
        "day": 7,
        "cityKo": "잘츠부르크",
        "cityEn": "Salzburg",
        "coords": [
          13.0457,
          47.8095
        ],
        "moveType": "ground",
        "isTrip": true,
        "baseCity": "뮌헨",
        "baseCityEn": "Munich",
        "baseCoords": [
          11.614785,
          48.1355713
        ],
        "lodging": {
          "name": "Holiday Inn Munich – Leuchtenbergring",
          "coords": [
            11.614785,
            48.1355713
          ],
          "note": "Leuchtenbergring 20 · 스탠다드 트윈룸 2개 · 객실당 싱글침대 2개 · 아고다 플래티넘 적용 4박 총 676,938원"
        },
        "transport": {
          "mode": "train",
          "label": "München Hbf 07:09 목표 → Salzburg Hbf 08:58 · RJX/EC"
        },
        "via": [
          [
            11.614785,
            48.1355713
          ],
          [
            11.5583,
            48.1402
          ],
          [
            12.1286,
            47.8564
          ],
          [
            12.6434,
            47.8687
          ],
          [
            13.0457,
            47.8095
          ]
        ],
        "title": "2/16(화) · 잘츠부르크 구시가지와 호엔잘츠부르크",
        "am": "07시대 열차로 잘츠부르크에 도착해 미라벨 정원에서 구시가지까지 걸어간다.",
        "pm": "충분한 점심 뒤 대성당과 성 페터 묘지를 보고 푸니쿨라로 호엔잘츠부르크 성에 오른다.",
        "ev": "강변의 해질녘을 보고 저녁 시간을 가진 뒤 19시대 열차로 뮌헨에 돌아간다.",
        "tip": "호엔잘츠부르크 성은 1~4월 09:30~17:00이므로 14:30 입장을 고정한다. 국제 구간이라 여권을 지참하고, 장거리열차 좌석을 지정한다.",
        "timeline": [
          {
            "time": "06:20",
            "title": "Holiday Inn 출발",
            "detail": "Leuchtenbergring역 도보 → S-Bahn으로 München Hbf 이동",
            "kind": "travel",
            "at": [
              11.614785,
              48.1355713
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "07:09",
            "title": "RJX/EC 잘츠부르크행 탑승",
            "detail": "권장편 · 약 1시간 49분 · 2027년 시간표는 예매 전 재확인",
            "kind": "travel",
            "at": [
              11.5583,
              48.1402
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "08:58",
            "title": "Salzburg Hbf 도착",
            "detail": "미라벨 정원까지 도보 약 15분",
            "kind": "travel",
            "at": [
              13.0457,
              47.813
            ],
            "mode": "train",
            "long": true,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "09:25–10:10",
            "title": "미라벨 정원",
            "detail": "겨울 정원 산책과 요새 조망",
            "kind": "visit",
            "at": [
              13.0457,
              47.813
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:10–11:45",
            "title": "Makartsteg·게트라이데 거리·모차르트 생가 외관",
            "detail": "잘차흐강을 건너 구시가지 도보 이동",
            "kind": "visit",
            "at": [
              13.0426,
              47.8055
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:45–13:15",
            "title": "점심·카페 자유시간",
            "detail": "구시가지에서 90분 여유",
            "kind": "free",
            "at": [
              13.0435,
              47.8006
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "13:15–14:15",
            "title": "잘츠부르크 대성당·Kapitelplatz·성 페터 묘지",
            "detail": "모두 도보 5분 이내",
            "kind": "visit",
            "at": [
              13.0435,
              47.8006
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "14:15",
            "title": "Festungsbahn 푸니쿨라",
            "detail": "요새 입장 마감에 맞춰 바로 탑승",
            "kind": "travel",
            "at": [
              13.0467,
              47.7979
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "14:30–16:30",
            "title": "호엔잘츠부르크 성",
            "detail": "실내 전시와 전망대 · 겨울 17:00 폐장",
            "kind": "visit",
            "at": [
              13.0472,
              47.7967
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "16:30–17:20",
            "title": "푸니쿨라 하산·강변 해질녘",
            "detail": "Makartsteg 방향으로 천천히 이동",
            "kind": "visit",
            "at": [
              13.0477,
              47.795
            ],
            "mode": "funicular",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "17:20–18:35",
            "title": "저녁·카페 자유시간",
            "detail": "역과 구시가지 사이에서 현장 선택",
            "kind": "free",
            "at": [
              13.044,
              47.8028
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "18:35",
            "title": "Salzburg Hbf로 이동",
            "detail": "도보 또는 버스 · 출발 15분 전 도착",
            "kind": "travel",
            "at": [
              13.0457,
              47.813
            ],
            "mode": "bus",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "19:05",
            "title": "뮌헨행 RJX/EC 탑승",
            "detail": "권장편 · 좌석지정 · 2027년 시간표는 예매 전 재확인",
            "kind": "travel",
            "at": [
              13.0457,
              47.813
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "20:55 전후",
            "title": "München Hbf 도착",
            "detail": "Leuchtenbergring행 S-Bahn 환승",
            "kind": "travel",
            "at": [
              11.5583,
              48.1402
            ],
            "mode": "train",
            "long": true,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "21:20",
            "title": "Holiday Inn 복귀",
            "detail": "다음 날 06:05 체크아웃 준비",
            "kind": "buffer",
            "at": [
              11.614785,
              48.1355713
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "returnTimeline": [
          {
            "time": "18:35",
            "title": "Salzburg Hbf로 이동",
            "detail": "도보 또는 버스 · 출발 15분 전 도착",
            "kind": "travel"
          },
          {
            "time": "19:05",
            "title": "뮌헨행 RJX/EC 탑승",
            "detail": "예매 목표편 · 좌석지정 · 2027 시간표 잠정",
            "kind": "travel"
          },
          {
            "time": "20:55 전후",
            "title": "München Hbf 도착",
            "detail": "Leuchtenbergring행 S-Bahn 환승",
            "kind": "travel"
          },
          {
            "time": "21:20",
            "title": "Holiday Inn 복귀",
            "detail": "다음 날 06:05 체크아웃 준비",
            "kind": "buffer"
          }
        ],
        "photos": [
          {
            "spot": "qa_c9_d7_salzburg_0",
            "at": [
              13.0426,
              47.8055
            ],
            "cap": "미라벨 정원과 호엔잘츠부르크",
            "desc": "잘츠부르크 당일치기의 첫 장면으로, 미라벨 정원 축선 너머로 호엔잘츠부르크 성이 보이는 대표적인 실제 풍경입니다."
          },
          {
            "spot": "qa_c9_d7_salzburg_1",
            "at": [
              13.0477,
              47.795
            ],
            "cap": "호엔잘츠부르크 성",
            "desc": "잘츠부르크 구시가지 위에 자리한 요새로, 성 위에서 도시 전체와 주변 산줄기를 내려다보는 당일치기 핵심 전망입니다."
          },
          {
            "spot": "qa_c9_d7_rich_048",
            "at": [
              13.0427,
              47.8057
            ],
            "cap": "미라벨 궁전",
            "desc": "정원 너머로 호엔잘츠부르크 성이 보이는 대표 구도로, 잘츠부르크 당일치기의 첫 인상을 만든다."
          },
          {
            "spot": "qa_c9_d7_rich_049",
            "at": [
              13.0422,
              47.8007
            ],
            "cap": "게트라이데 거리",
            "desc": "금속 간판과 좁은 상점가가 이어지는 구시가지 거리로, 짧은 당일치기에도 잘츠부르크의 밀도를 느낄 수 있다."
          },
          {
            "spot": "qa_c9_d7_rich_050",
            "at": [
              13.0436,
              47.8002
            ],
            "cap": "모차르트 생가",
            "desc": "노란 외벽의 모차르트 생가는 음악 도시 잘츠부르크를 가장 쉽게 이해하게 해주는 장소다."
          },
          {
            "spot": "qa_c9_d7_rich_051",
            "at": [
              13.0477,
              47.7981
            ],
            "cap": "잘츠부르크 대성당",
            "desc": "바로크 양식의 대성당과 광장이 이어지는 곳으로, 구시가지의 중심축을 이룬다."
          },
          {
            "spot": "qa_c9_d7_rich_052",
            "at": [
              13.0471,
              47.7986
            ],
            "cap": "레지덴츠플라츠",
            "desc": "대성당과 레지덴츠가 둘러싼 광장으로, 성으로 오르기 전 도시의 바로크 스케일을 느낄 수 있다."
          },
          {
            "spot": "qa_c9_d7_rich_053",
            "at": [
              13.0452,
              47.7972
            ],
            "cap": "성 페터 수도원",
            "desc": "묘지와 수도원이 성 아래에 붙어 있어, 화려한 광장과 다른 조용한 잘츠부르크를 보여준다."
          },
          {
            "spot": "qa_c9_d7_rich_054",
            "at": [
              13.0434,
              47.8028
            ],
            "cap": "잘차흐 강변",
            "desc": "구시가지와 신시가지를 나누는 강으로, 다리 위에서 성과 교회 지붕선을 함께 담기 좋다."
          },
          {
            "spot": "qa_c9_d7_rich_055",
            "at": [
              13.0472,
              47.7967
            ],
            "cap": "호엔잘츠부르크 푸니쿨라",
            "desc": "구시가지에서 요새로 빠르게 올라가는 산악철도라, 짧은 당일치기에서 전망 시간을 확보해준다."
          }
        ],
        "routeReady": true
      },
      {
        "day": 8,
        "cityKo": "빈",
        "cityEn": "Vienna",
        "coords": [
          16.3839827,
          48.1817738
        ],
        "moveType": "ground",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "lodging": {
          "name": "B&B Hotel Wien-Hbf (지도 동선 기준 임시)",
          "coords": [
            16.3839827,
            48.1817738
          ],
          "note": "Bloch-Bauer-Promenade 5 · 5박 동선 기준 · 1순위 후보 Austria Trend Hotel Ananas 확정 시 경로 교체"
        },
        "transport": {
          "mode": "train",
          "label": "뮌헨 Hbf → 빈 Hbf · Railjet/ICE 약 4시간 · Wien Hbf에서 B&B Hotel Wien-Hbf까지 도보"
        },
        "via": [
          [
            11.614785,
            48.1355713
          ],
          [
            11.5583,
            48.1402
          ],
          [
            13.0457,
            47.8095
          ],
          [
            14.2858,
            48.3069
          ],
          [
            16.3767,
            48.1858
          ],
          [
            16.3839827,
            48.1817738
          ]
        ],
        "title": "2/17(수) · 뮌헨에서 빈, 첫 구시가지",
        "am": "07:09 권장 Railjet으로 잘츠부르크와 린츠를 지나 빈으로 이동한다.",
        "pm": "Wien Hbf에서 숙소까지 걸어가 짐을 맡기고, 자유로운 점심 뒤 U1로 슈테판스돔에 들어가 왕궁까지 걷는다.",
        "ev": "저녁 식사 시간을 넉넉히 두고 U1으로 중앙역에 돌아와 트윈룸 두 개에 체크인한다.",
        "tip": "뮌헨–빈 열차는 2027년 시간표 공개 뒤 07시대 직통편으로 확정한다. 숙소는 Wien Hbf 남쪽 도보권이라 별도 버스 환승이 필요 없다.",
        "timeline": [
          {
            "time": "06:05",
            "title": "Holiday Inn 체크아웃",
            "detail": "Leuchtenbergring역 도보 → S-Bahn으로 München Hbf 이동",
            "kind": "travel",
            "at": [
              11.614785,
              48.1355713
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "06:55",
            "title": "승강장 도착",
            "detail": "간단한 아침과 물 구입",
            "kind": "buffer",
            "at": [
              11.5583,
              48.1402
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "07:09",
            "title": "빈행 Railjet 직통 탑승",
            "detail": "권장편 · 좌석지정 · 약 4시간 23분 · 2027년 시간표는 예매 전 재확인",
            "kind": "travel",
            "at": [
              11.5583,
              48.1402
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:32",
            "title": "Wien Hbf 도착",
            "detail": "남쪽 출구로 나와 숙소까지 도보 이동",
            "kind": "travel",
            "at": [
              16.3767,
              48.1858
            ],
            "mode": "train",
            "long": true,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:40–12:00",
            "title": "B&B Hotel Wien-Hbf로 이동",
            "detail": "Wien Hbf 남쪽 출구에서 Bloch-Bauer-Promenade 방향 도보 약 10–12분",
            "kind": "travel",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:00",
            "title": "호텔에 짐 보관",
            "detail": "정식 체크인은 저녁에 진행 · 트윈룸 2개 예약 확인",
            "kind": "buffer",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:10–13:35",
            "title": "점심 자유시간",
            "detail": "Wien Hbf 또는 Favoritenstraße 주변에서 현장 선택",
            "kind": "free",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "13:35–13:50",
            "title": "U1으로 Stephansplatz 이동",
            "detail": "Wien Hbf에서 환승 없이 이동",
            "kind": "travel",
            "at": [
              16.3731,
              48.2085
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "14:15–15:00",
            "title": "슈테판스돔 내부",
            "detail": "예배 구역과 유료 구역은 현장 상황에 맞춤",
            "kind": "visit",
            "at": [
              16.3731,
              48.2085
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "15:00–16:15",
            "title": "Graben·Peterskirche·Kohlmarkt·Michaelerplatz",
            "detail": "보행자 거리로 이어지는 도보 동선",
            "kind": "visit",
            "at": [
              16.3697,
              48.2087
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "16:15–17:15",
            "title": "호프부르크 안뜰·Heldenplatz·Burggarten",
            "detail": "실내 유료 관람 없이 외부 중심",
            "kind": "visit",
            "at": [
              16.3658,
              48.2065
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "17:15–18:45",
            "title": "카페·저녁 자유시간",
            "detail": "도심에서 90분 여유",
            "kind": "free",
            "at": [
              16.3658,
              48.2065
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "18:45–19:15",
            "title": "U1으로 숙소 복귀",
            "detail": "Stephansplatz → Wien Hbf · 도보 후 트윈룸 2개 체크인",
            "kind": "travel",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "photos": [
          {
            "spot": "qa_c8_d6_0",
            "at": [
              14.2858,
              48.3069
            ],
            "cap": "오스트리아 Railjet",
            "desc": "뮌헨에서 잘츠부르크와 린츠를 지나 빈으로 들어가는 장거리 열차 이동을 보여주는 대표적인 철도 이미지입니다."
          },
          {
            "spot": "qa_c9_d9_1",
            "at": [
              16.3731,
              48.2085
            ],
            "cap": "슈테판 대성당",
            "desc": "빈 도착 후 처음 걷기 좋은 중심 랜드마크로, 긴 철도 이동 뒤 도시의 분위기를 짧게 확인하기 좋은 장소입니다."
          },
          {
            "spot": "qa_c9_d8_rich_056",
            "at": [
              11.5583,
              48.1402
            ],
            "cap": "뮌헨 중앙역 출발",
            "desc": "Holiday Inn에서 Leuchtenbergring S-Bahn을 타고 도착하는 장거리 열차 관문으로, 빈 이동일의 첫 장면을 만든다."
          },
          {
            "spot": "qa_c9_d8_rich_057",
            "at": [
              13.0457,
              47.8095
            ],
            "cap": "레일젯 열차 객실",
            "desc": "잘츠부르크와 린츠를 지나 빈으로 향하는 오스트리아 장거리 열차의 실내 분위기를 보여준다."
          },
          {
            "spot": "qa_c9_d8_rich_058",
            "at": [
              13.0457,
              47.8095
            ],
            "cap": "잘츠부르크 중앙역 경유",
            "desc": "뮌헨과 빈 사이의 큰 환승·경유 지점으로, 전날 당일치기 도시를 다시 지나간다는 감각을 준다."
          },
          {
            "spot": "qa_c9_d8_rich_059",
            "at": [
              14.291,
              48.29
            ],
            "cap": "린츠 중앙역 경유",
            "desc": "도나우 강변 도시 린츠의 역을 지나며, 오스트리아 서부에서 빈으로 들어가는 중간 지점을 확인한다."
          },
          {
            "spot": "qa_c9_d8_rich_060",
            "at": [
              16.3767,
              48.1858
            ],
            "cap": "빈 중앙역 도착",
            "desc": "장거리 열차가 도착하는 현대식 역으로, 빈 첫날의 짐 맡기기와 숙소 이동이 시작된다."
          },
          {
            "spot": "qa_c9_d8_rich_061",
            "at": [
              16.3855,
              48.2079
            ],
            "cap": "빈 미테 역",
            "desc": "공항철도와 시내 교통이 만나는 역으로, 숙소와 공항 이동 동선을 미리 익히기 좋다."
          },
          {
            "spot": "qa_c9_d8_rich_062",
            "at": [
              16.3799,
              48.2044
            ],
            "cap": "빈 슈타트파크",
            "desc": "숙소 동쪽에서 중심부로 걸어갈 때 부담 없이 들를 수 있는 공원으로, 첫 저녁 산책에 잘 맞는다."
          },
          {
            "spot": "qa_c9_d8_rich_063",
            "at": [
              16.3697,
              48.2087
            ],
            "cap": "그라벤 거리",
            "desc": "슈테판스돔에서 이어지는 보행 거리로, 긴 철도 이동 뒤 빈 중심부 분위기를 짧게 잡아준다."
          }
        ],
        "routeReady": true
      },
      {
        "day": 9,
        "cityKo": "빈",
        "cityEn": "Vienna",
        "coords": [
          16.3839827,
          48.1817738
        ],
        "moveType": "stay",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "lodging": {
          "name": "B&B Hotel Wien-Hbf (지도 동선 기준 임시)",
          "coords": [
            16.3839827,
            48.1817738
          ],
          "note": "Bloch-Bauer-Promenade 5 · 5박 동선 기준 · 1순위 후보 Austria Trend Hotel Ananas 확정 시 경로 교체"
        },
        "transport": {
          "mode": "walk",
          "label": "호텔 → 훈데르트바서하우스 → U4 Kettenbrückengasse → 나슈마르크트 → 링"
        },
        "via": [
          [
            16.3839827,
            48.1817738
          ],
          [
            16.3615,
            48.1974
          ],
          [
            16.3653,
            48.2103
          ]
        ],
        "title": "2/18(목) · 빈 생활권 산책과 나슈마르크트",
        "am": "느긋하게 출발해 Wien Hbf에서 S-Bahn으로 Wien Mitte까지 간 뒤 훈데르트바서하우스로 걷는다.",
        "pm": "시장과 긴 식사·카페 시간을 보낸 뒤 제체시온과 박물관지구, 링의 공공건축을 걷는다.",
        "ev": "저녁은 중심부 또는 호이리게 중 그날 컨디션에 맞춰 고르고, 별도 예약 없이 자유롭게 보낸다.",
        "tip": "1월 말 빈은 해가 일찍 지므로 야외 산책을 먼저 하고 실내·식사 시간을 뒤에 둔다. 시장이나 박물관 운영시간은 2027년 일정 공개 뒤 전날 한 번 더 확인한다.",
        "timeline": [
          {
            "time": "09:30–10:00",
            "title": "느린 아침·출발 준비",
            "detail": "전날 장거리 이동 뒤 수면 여유",
            "kind": "free",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:00–10:20",
            "title": "Wien Mitte 경유·훈데르트바서하우스로 이동",
            "detail": "Wien Hbf → Wien Mitte S-Bahn 약 5분 · 이후 도보 약 15분",
            "kind": "travel",
            "at": [
              16.3941,
              48.207
            ],
            "mode": "subway",
            "long": false,
            "via": [
              [
                16.3855,
                48.2079
              ]
            ],
            "overviewAfter": false
          },
          {
            "time": "10:20–11:10",
            "title": "훈데르트바서하우스·Kunst Haus Wien 주변",
            "detail": "건물 외관과 동네 산책 · 유료 관람 없음",
            "kind": "visit",
            "at": [
              16.3941,
              48.207
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:10–12:00",
            "title": "Wien Mitte → Kettenbrückengasse",
            "detail": "도보로 Wien Mitte 이동 후 U4",
            "kind": "travel",
            "at": [
              16.3587,
              48.1965
            ],
            "mode": "subway",
            "long": false,
            "via": [
              [
                16.3855,
                48.2079
              ]
            ],
            "overviewAfter": false
          },
          {
            "time": "12:00–13:00",
            "title": "나슈마르크트 둘러보기",
            "detail": "간식·기념품은 현장에서 판단",
            "kind": "visit",
            "at": [
              16.3615,
              48.1974
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "13:00–15:00",
            "title": "점심·카페 자유시간",
            "detail": "이번 여행에서 가장 긴 낮 휴식 2시간",
            "kind": "free",
            "at": [
              16.3615,
              48.1974
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "15:00–16:00",
            "title": "제체시온 외관·MuseumsQuartier 안뜰",
            "detail": "도보 약 1.5km",
            "kind": "visit",
            "at": [
              16.358,
              48.203
            ],
            "mode": "walk",
            "long": false,
            "via": [
              [
                16.3658,
                48.2005
              ]
            ],
            "overviewAfter": false
          },
          {
            "time": "16:00–17:15",
            "title": "국회의사당·시청사·부르크극장 외관",
            "detail": "링 서쪽을 따라 도보·트램 병행",
            "kind": "visit",
            "at": [
              16.356,
              48.2108
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "17:15–19:15",
            "title": "카페·저녁 자유시간",
            "detail": "중심부에 머물거나 체력이 남으면 Grinzing 이동",
            "kind": "free",
            "at": [
              16.356,
              48.2108
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "19:15 이후",
            "title": "자유 저녁 또는 숙소 복귀",
            "detail": "U-Bahn 또는 트램으로 Wien Hbf 방향 귀가",
            "kind": "buffer",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "tram",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "photos": [
          {
            "spot": "qa_c9_d9_naschmarkt_0",
            "at": [
              16.3615,
              48.1974
            ],
            "cap": "나슈마르크트",
            "desc": "빈의 대표 시장으로, 쉬는 날 오전에 장을 보고 간단한 먹거리를 고르며 도시 생활감을 느끼기 좋은 실제 장소입니다."
          },
          {
            "spot": "qa_c9_d9_cafe_central_1",
            "at": [
              16.3653,
              48.2103
            ],
            "cap": "카페 센트럴 내부",
            "desc": "빈의 커피하우스 문화를 대표하는 실내 공간으로, 이동이 많은 일정 중 하루를 천천히 쉬어가기 좋은 장소입니다."
          },
          {
            "spot": "qa_c9_d9_rich_064",
            "at": [
              16.369,
              48.2033
            ],
            "cap": "빈 국립오페라하우스",
            "desc": "공연을 보지 않아도 링슈트라세 산책의 핵심 건물로, 빈의 밤 조명과 잘 어울린다."
          },
          {
            "spot": "qa_c9_d9_rich_065",
            "at": [
              16.3667,
              48.2088
            ],
            "cap": "데멜 카페와 쇼윈도",
            "desc": "합스부르크 궁정 제과점 전통이 남은 카페라, 쉬는 날 단 디저트 후보로 좋다."
          },
          {
            "spot": "qa_c9_d9_rich_066",
            "at": [
              16.3701,
              48.2083
            ],
            "cap": "카페 하벨카",
            "desc": "문학가와 예술가가 모이던 커피하우스로, 관광 체크리스트보다 오래 앉아 쉬는 일정에 어울린다."
          },
          {
            "spot": "qa_c9_d9_rich_067",
            "at": [
              16.358,
              48.2108
            ],
            "cap": "빈 시청",
            "desc": "고딕풍 시청사는 겨울 조명과 광장 분위기가 좋아, 쉬는 날 저녁 산책 후보가 된다."
          },
          {
            "spot": "qa_c9_d9_rich_068",
            "at": [
              16.3597,
              48.2032
            ],
            "cap": "무제움스크바르티어",
            "desc": "미술관 사이 넓은 안뜰과 벤치가 있어, 이동보다 쉬는 날의 여유를 만들기 좋다."
          },
          {
            "spot": "qa_c9_d9_rich_069",
            "at": [
              16.3959,
              48.2162
            ],
            "cap": "프라터 대관람차",
            "desc": "빈의 오래된 놀이공원과 대관람차는 시장과 카페 뒤에 가볍게 분위기를 바꾸기 좋다."
          },
          {
            "spot": "qa_c9_d9_rich_070",
            "at": [
              16.3441,
              48.2543
            ],
            "cap": "그린칭 호이리게 거리",
            "desc": "와인 선술집이 모인 동네로, 체력이 남으면 빈식 저녁 술 문화를 느끼기 좋은 선택지다."
          },
          {
            "spot": "qa_c9_d9_rich_071",
            "at": [
              16.3665,
              48.2088
            ],
            "cap": "콜마르크트",
            "desc": "궁정 납품점과 고급 상점이 모인 거리라, 쇼핑보다 산책 자체가 볼거리가 된다."
          }
        ],
        "routeReady": true
      },
      {
        "day": 10,
        "cityKo": "빈",
        "cityEn": "Vienna",
        "coords": [
          16.3839827,
          48.1817738
        ],
        "moveType": "stay",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "lodging": {
          "name": "B&B Hotel Wien-Hbf (지도 동선 기준 임시)",
          "coords": [
            16.3839827,
            48.1817738
          ],
          "note": "Bloch-Bauer-Promenade 5 · 5박 동선 기준 · 1순위 후보 Austria Trend Hotel Ananas 확정 시 경로 교체"
        },
        "transport": {
          "mode": "walk",
          "label": "호텔 → 벨베데레 도보 → 트램 D Burgring → 미술사박물관"
        },
        "via": [
          [
            16.3839827,
            48.1817738
          ],
          [
            16.3813,
            48.1912
          ],
          [
            16.3602,
            48.2033
          ]
        ],
        "title": "2/19(금) · 벨베데레와 미술사박물관",
        "am": "09:00 벨베데레 상궁 시간권으로 클림트와 실레를 집중 관람한다.",
        "pm": "점심을 충분히 쉰 뒤 미술사박물관 회화관과 건축을 3시간 넘게 본다.",
        "ev": "박물관 뒤 식사 시간을 두고 Heldenplatz와 링 야경을 걷거나 바로 숙소에서 쉰다.",
        "tip": "벨베데레는 09:00 시간권을 예약한다. 두 대형 미술관을 같은 날 보므로 미술사박물관은 브뤼헐·라파엘로·벨라스케스·쿤스트카머 우선순위를 정한다.",
        "timeline": [
          {
            "time": "08:20",
            "title": "호텔 출발",
            "detail": "B&B Hotel Wien-Hbf에서 벨베데레 상궁까지 도보 약 15–18분",
            "kind": "travel",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "08:50",
            "title": "입장 대기",
            "detail": "온라인 티켓과 학생증 준비",
            "kind": "buffer",
            "at": [
              16.3813,
              48.1912
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "09:00–11:15",
            "title": "벨베데레 상궁",
            "detail": "클림트 ‘키스’ → 실레 → 궁전 창밖 정원 순",
            "kind": "visit",
            "at": [
              16.3813,
              48.1912
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:15–11:45",
            "title": "벨베데레 정원 산책",
            "detail": "상궁에서 정원 축을 따라 내려가기",
            "kind": "visit",
            "at": [
              16.3813,
              48.1912
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:45–12:15",
            "title": "트램 D로 Burgring 이동",
            "detail": "Schloss Belvedere 정류장 → Burgring",
            "kind": "travel",
            "at": [
              16.3602,
              48.2033
            ],
            "mode": "tram",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:15–13:30",
            "title": "점심·카페 자유시간",
            "detail": "미술사박물관 주변에서 75분",
            "kind": "free",
            "at": [
              16.3602,
              48.2033
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "13:30–16:45",
            "title": "미술사박물관",
            "detail": "회화관 핵심과 중앙계단·돔 카페 공간",
            "kind": "visit",
            "at": [
              16.3602,
              48.2033
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "16:45–18:30",
            "title": "카페·저녁 자유시간",
            "detail": "박물관 피로를 풀 수 있도록 105분 여유",
            "kind": "free",
            "at": [
              16.3602,
              48.2033
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "18:30–20:00",
            "title": "Heldenplatz·호프부르크·링 야경 또는 조기 귀가",
            "detail": "컨디션이 떨어지면 바로 U3로 숙소 복귀",
            "kind": "visit",
            "at": [
              16.3658,
              48.2065
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "photos": [
          {
            "spot": "qa_c9_d11_0",
            "at": [
              16.374399999999998,
              48.2082
            ],
            "cap": "벨베데레 상궁",
            "desc": "클림트 '키스' 원화벨베데레 상궁 미술관에 전시된, 금박이 반짝이는 구스타프 클림트의 가장 유명하고 황홀한 걸작입니다."
          },
          {
            "spot": "qa_c9_d11_1",
            "at": [
              16.374399999999998,
              48.20923923048454
            ],
            "cap": "미술사 박물관",
            "desc": "합스부르크 예술의 보고거대한 청동 돔과 완벽한 대칭을 이루는 화려한 르네상스 부흥 양식의 건물로, 마리아 테레지아 광장에 서 있습니다."
          },
          {
            "spot": "qa_c9_d10_rich_072",
            "at": [
              16.3809,
              48.1913
            ],
            "cap": "벨베데레 정원 축선",
            "desc": "상궁과 하궁을 잇는 정원 축은 미술관 관람 전후에 궁전 전체의 대칭감을 보여준다."
          },
          {
            "spot": "qa_c9_d10_rich_073",
            "at": [
              16.3656,
              48.2065
            ],
            "cap": "호프부르크 왕궁",
            "desc": "합스부르크 통치의 중심이던 왕궁 단지로, 벨베데레와 미술사 박물관 사이의 역사 축을 이룬다."
          },
          {
            "spot": "qa_c9_d10_rich_074",
            "at": [
              16.3683,
              48.2045
            ],
            "cap": "알베르티나",
            "desc": "오페라하우스 옆 미술관으로, 시간이 남을 때 그래픽 컬렉션과 테라스 전망을 붙이기 좋다."
          },
          {
            "spot": "qa_c9_d10_rich_075",
            "at": [
              16.365,
              48.2006
            ],
            "cap": "제체시온 전시관",
            "desc": "황금 월계돔이 눈에 띄는 빈 분리파 건물로, 클림트 감상일의 미술사적 배경을 보강한다."
          },
          {
            "spot": "qa_c9_d10_rich_076",
            "at": [
              16.3714,
              48.1983
            ],
            "cap": "카를성당",
            "desc": "돔과 쌍기둥이 독특한 바로크 성당으로, 벨베데레에서 중심부로 이동할 때 들르기 쉽다."
          },
          {
            "spot": "qa_c9_d10_rich_077",
            "at": [
              16.3616,
              48.2038
            ],
            "cap": "마리아 테레지아 광장",
            "desc": "미술사 박물관과 자연사 박물관 사이의 대칭 광장으로, 빈 박물관 지구의 스케일을 보여준다."
          },
          {
            "spot": "qa_c9_d10_rich_078",
            "at": [
              16.3662,
              48.2064
            ],
            "cap": "오스트리아 국립도서관 프룽크잘",
            "desc": "바로크 서가와 천장화가 압도적인 공간으로, 합스부르크 컬렉션의 실내 장면을 보강한다."
          },
          {
            "spot": "qa_c9_d10_rich_079",
            "at": [
              16.364,
              48.205
            ],
            "cap": "링슈트라세 야경",
            "desc": "왕궁과 오페라, 박물관을 잇는 대로라 공연을 보지 않는 저녁 산책의 골격이 된다."
          }
        ],
        "routeReady": true
      },
      {
        "day": 11,
        "cityKo": "빈",
        "cityEn": "Vienna",
        "coords": [
          16.3839827,
          48.1817738
        ],
        "moveType": "stay",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "lodging": {
          "name": "B&B Hotel Wien-Hbf (지도 동선 기준 임시)",
          "coords": [
            16.3839827,
            48.1817738
          ],
          "note": "Bloch-Bauer-Promenade 5 · 5박 동선 기준 · 1순위 후보 Austria Trend Hotel Ananas 확정 시 경로 교체"
        },
        "transport": {
          "mode": "walk",
          "label": "Wien Hbf → U1 Karlsplatz → U4 Schönbrunn → 빈 도심"
        },
        "via": [
          [
            16.3839827,
            48.1817738
          ],
          [
            16.3693,
            48.2038
          ],
          [
            16.3764,
            48.2084
          ],
          [
            16.3682,
            48.2035
          ],
          [
            16.3441,
            48.2543
          ]
        ],
        "title": "2/20(토) · 쇤브룬 정원과 선택 공연",
        "am": "U3와 U4로 쇤브룬에 가 궁전 외관과 무료 정원, 글로리에테를 걷는다.",
        "pm": "도심으로 돌아와 점심과 카페를 오래 쉬고, 마지막 쇼핑과 산책을 자유롭게 한다.",
        "ev": "저녁은 자유롭게 고른다. 1월 30일 국립오페라 공연이 편성되면 입석을 시도하고, 마음에 드는 공연이 없으면 마지막 저녁을 완전히 비워 둔다.",
        "tip": "2027년 1월 30일 공연 프로그램은 공식 일정 공개 뒤 확정한다. 입석은 당일 온라인 잔여분과 공연 약 80분 전 현장 판매를 확인하고, 공연 시간이 다르면 저녁 블록만 옮긴다.",
        "timeline": [
          {
            "time": "08:45",
            "title": "호텔 출발",
            "detail": "B&B Hotel Wien-Hbf에서 Wien Hbf까지 도보 후 U1 탑승",
            "kind": "travel",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "09:00–09:30",
            "title": "U1 → U4로 Schönbrunn 이동",
            "detail": "Wien Hbf → Karlsplatz 환승 → Schönbrunn",
            "kind": "travel",
            "at": [
              16.3122,
              48.1845
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "09:30–11:30",
            "title": "쇤브룬 궁전 외관·정원·글로리에테",
            "detail": "무료 야외 구간 · 눈·결빙 시 글로리에테 오르막 생략",
            "kind": "visit",
            "at": [
              16.3088,
              48.1788
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:30–12:15",
            "title": "U4로 도심 복귀",
            "detail": "Karlsplatz 또는 Stadtpark 하차",
            "kind": "travel",
            "at": [
              16.37,
              48.2004
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:15–14:00",
            "title": "점심·카페 자유시간",
            "detail": "105분 여유 · 장소는 현장에서 선택",
            "kind": "free",
            "at": [
              16.37,
              48.2004
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "14:00–15:30",
            "title": "Graben·Kohlmarkt·Albertina 주변 산책·쇼핑",
            "detail": "마지막 기념품 시간 포함",
            "kind": "visit",
            "at": [
              16.3697,
              48.2087
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "15:30–17:00",
            "title": "카페·숙소 휴식 자유시간",
            "detail": "공연 선택 전 체력 회복",
            "kind": "free",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "tram",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "17:00–18:00",
            "title": "이른 저녁 자유시간",
            "detail": "공연을 보지 않으면 시간 제한 없이 연장",
            "kind": "free",
            "at": [
              16.369,
              48.2038
            ],
            "mode": "tram",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "공연 80분 전",
            "title": "선택: 국립오페라 입석 준비",
            "detail": "2/20 공식 편성과 시작 시각 공개 뒤 확정",
            "kind": "buffer",
            "at": [
              16.369,
              48.2038
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "저녁",
            "title": "선택: 공연 관람 또는 완전 자유시간",
            "detail": "공연 미선택 시 카페·호이리게·야경 중 당일 선택",
            "kind": "free",
            "at": [
              16.369,
              48.2038
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "22:00",
            "title": "숙소 복귀·짐 정리",
            "detail": "다음 날 빈 자유일을 위한 휴식 · 남은 유료 관람 후보 확인",
            "kind": "buffer",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "tram",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "pois": [
          {
            "name": "Cafe Sacher Wien",
            "coords": [
              16.3693,
              48.2038
            ],
            "kind": "coffee",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_cafe_sacher",
            "note": "자허토르테와 멜랑쥐로 시작하는 빈 커피하우스 후보."
          },
          {
            "name": "Figlmüller Bäckerstraße",
            "coords": [
              16.3764,
              48.2084
            ],
            "kind": "food",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_figlmueller",
            "note": "큰 빈 슈니첼로 유명한 중심부 식당 후보. 예약 권장."
          },
          {
            "name": "Bitzinger Würstelstand Albertina",
            "coords": [
              16.3682,
              48.2035
            ],
            "kind": "food",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_bitzinger",
            "note": "알베르티나와 오페라 근처의 대표적인 뷔르스텔슈탄트 후보."
          },
          {
            "name": "Trzesniewski Dorotheergasse",
            "coords": [
              16.3695,
              48.2085
            ],
            "kind": "food",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_trzesniewski",
            "note": "작은 오픈 샌드위치로 배를 크게 채우지 않고 여러 맛을 보기 좋은 후보."
          },
          {
            "name": "Grinzing Heuriger Area",
            "coords": [
              16.3441,
              48.2543
            ],
            "kind": "wine",
            "priority": "candidate",
            "photoSpot": "qa_c9_poi_grinzing_heuriger",
            "note": "빈식 호이리게 저녁 후보. 날씨와 이동 피로에 따라 중심부 식당으로 대체 가능."
          }
        ],
        "photos": [
          {
            "spot": "qa_c9_d11_food_schnitzel_0",
            "at": [
              16.3764,
              48.2084
            ],
            "cap": "피글뮐러 슈니첼",
            "desc": "빈 먹는 날의 점심 후보로, 얇고 크게 튀긴 빈식 슈니첼과 감자 샐러드를 중심으로 오스트리아 음식을 확실히 먹는 장면입니다."
          },
          {
            "spot": "qa_c9_d11_food_wurstel_1",
            "at": [
              16.353927,
              48.231908
            ],
            "cap": "빈 뷔르스텔슈탄트",
            "desc": "빈 거리 음식의 대표인 소시지 스탠드로, 슈니첼과 커피하우스 뒤에 가볍게 케제크라이너나 핫도그를 나눠 먹기 좋은 분위기입니다."
          },
          {
            "spot": "qa_c9_d11_rich_080",
            "at": [
              16.3693,
              48.2038
            ],
            "cap": "자허토르테",
            "desc": "카페 사허에서 시작하기 좋은 초콜릿 케이크로, 빈 커피하우스 문화의 가장 유명한 맛이다."
          },
          {
            "spot": "qa_c9_d11_rich_081",
            "at": [
              16.3757,
              48.2086
            ],
            "cap": "타펠슈피츠",
            "desc": "삶은 소고기와 육수, 사과고추냉이 소스를 곁들이는 빈 전통식으로 슈니첼 대체 후보가 된다."
          },
          {
            "spot": "qa_c9_d11_rich_082",
            "at": [
              16.3667,
              48.2088
            ],
            "cap": "카이저슈마른",
            "desc": "찢어 구운 달콤한 팬케이크라 식사 뒤 나눠 먹기 좋고, 빈식 디저트의 푸근한 쪽을 보여준다."
          },
          {
            "spot": "qa_c9_d11_rich_083",
            "at": [
              16.3653,
              48.2103
            ],
            "cap": "아펠슈트루델",
            "desc": "사과와 계피가 들어간 오스트리아식 페이스트리로 커피하우스에서 쉬어 갈 때 잘 맞는다."
          },
          {
            "spot": "qa_c9_d11_rich_084",
            "at": [
              16.3653,
              48.2103
            ],
            "cap": "빈 커피하우스 실내",
            "desc": "대리석 테이블과 신문, 멜랑쥐가 있는 공간 자체가 빈 여행의 느린 리듬을 만든다."
          },
          {
            "spot": "qa_c9_d11_rich_085",
            "at": [
              16.3695,
              48.2085
            ],
            "cap": "트르제스니에프스키 오픈 샌드위치",
            "desc": "작은 브뢰트헨을 여러 개 고르는 방식이라 슈니첼 뒤에도 부담 없이 맛보기 좋다."
          },
          {
            "spot": "qa_c9_d11_rich_086",
            "at": [
              16.3682,
              48.2035
            ],
            "cap": "케제크라이너 소시지",
            "desc": "치즈가 들어간 소시지는 뷔르스텔슈탄트에서 맥주와 함께 가볍게 나눠 먹기 좋다."
          },
          {
            "spot": "qa_c9_d11_rich_087",
            "at": [
              16.3441,
              48.2543
            ],
            "cap": "호이리게 와인 테이블",
            "desc": "그린칭이나 누스도르프에서 현지 와인과 차가운 안주를 먹는 저녁 선택지를 보여준다."
          }
        ],
        "routeReady": true
      },
      {
        "day": 12,
        "cityKo": "빈",
        "cityEn": "Vienna",
        "coords": [
          16.3839827,
          48.1817738
        ],
        "moveType": "stay",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "lodging": {
          "name": "B&B Hotel Wien-Hbf (지도 동선 기준 임시)",
          "coords": [
            16.3839827,
            48.1817738
          ],
          "note": "빈 5박째 · 1순위 후보 Austria Trend Hotel Ananas 확정 시 전체 동선 교체"
        },
        "transport": {
          "mode": "walk",
          "label": "숙소 → 호프부르크·국립도서관 → 부르크가르텐·알베르티나 → 숙소"
        },
        "via": [
          [
            16.3653,
            48.2065
          ],
          [
            16.3665,
            48.2067
          ],
          [
            16.368,
            48.2044
          ]
        ],
        "title": "2/21(일) · 호프부르크 내부와 빈 자유일",
        "am": "늦지 않게 도심으로 이동해 호프부르크의 황제 아파트·시시 박물관 또는 황실 보물관 가운데 한 곳을 선택해 관람한다. 전날까지의 피로가 크면 유료 관람을 줄이고 미하엘 광장과 영웅광장 산책으로 바꾼다.",
        "pm": "점심과 카페 자유시간을 충분히 가진 뒤 오스트리아 국립도서관 프룽크잘을 본다. 이후 부르크가르텐과 알베르티나 일대를 걷고, 실내 관람을 더 원하면 알베르티나 또는 레오폴트 미술관 중 한 곳만 선택한다.",
        "ev": "빈에서 보내는 마지막 완전한 저녁이다. 특정 음식점을 미리 고정하지 않고 도심에서 자유롭게 식사한 뒤 숙소로 돌아와 다음 날 출국용 짐과 면세 서류를 정리한다.",
        "tip": "일요일 운영시간과 2027년 예약 방식은 출발 전에 다시 확인한다. 이 날은 부다페스트 당일치기가 아니라 빈의 미관람 장소와 휴식을 위한 예비일이며, 앞선 일정이 밀리면 그대로 보충일로 사용한다.",
        "timeline": [
          {
            "time": "09:00–10:00",
            "title": "아침 식사·출발 준비",
            "detail": "숙소 주변에서 현장 선택 · 전날 피로에 따라 30분 조정",
            "kind": "free",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:00–10:30",
            "title": "호프부르크 이동",
            "detail": "Wien Hbf에서 U1로 Karlsplatz 이동 후 도보",
            "kind": "travel",
            "at": [
              16.3658,
              48.2065
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:30–12:30",
            "title": "호프부르크 내부 선택 관람",
            "detail": "황제 아파트·시시 박물관 또는 황실 보물관 중 한 곳",
            "kind": "visit",
            "at": [
              16.3658,
              48.2065
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:30–14:00",
            "title": "점심·카페 자유시간",
            "detail": "미하엘 광장과 콜마르크트 주변에서 현장 선택",
            "kind": "free",
            "at": [
              16.3662,
              48.208
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "14:00–15:15",
            "title": "오스트리아 국립도서관 프룽크잘",
            "detail": "운영시간과 입장권은 2027년 일정 공개 후 재확인",
            "kind": "visit",
            "at": [
              16.3665,
              48.2067
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "15:15–16:00",
            "title": "영웅광장·부르크가르텐 산책",
            "detail": "호프부르크 남쪽을 따라 무료 도보",
            "kind": "visit",
            "at": [
              16.3655,
              48.2047
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "16:00–18:00",
            "title": "알베르티나 또는 자유시간",
            "detail": "관람량이 충분하면 카페·쇼핑·휴식으로 전환",
            "kind": "free",
            "at": [
              16.368,
              48.2044
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "18:00–20:00",
            "title": "빈의 마지막 저녁 자유시간",
            "detail": "도심에서 현장 선택 · 식당 사전 고정 없음",
            "kind": "free",
            "at": [
              16.371,
              48.208
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "20:00 이후",
            "title": "숙소 복귀·출국 짐 정리",
            "detail": "여권·탑승권·면세 서류와 캐리어 4개 확인",
            "kind": "buffer",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          }
        ],
        "photos": [
          {
            "spot": "qa_c1_d6_0",
            "at": [
              16.3653,
              48.2065
            ],
            "cap": "호프부르크 신궁",
            "desc": "빈 체류 마지막 완전한 날에 황실 공간 한 곳을 골라 깊이 보고 영웅광장까지 이어 걷는 출발점이다."
          },
          {
            "spot": "qa_c1_d5_1",
            "at": [
              16.3638,
              48.2068
            ],
            "cap": "영웅광장",
            "desc": "실내 관람 사이에 호프부르크 남쪽의 넓은 광장과 기마상을 천천히 둘러보며 휴식하는 장소다."
          }
        ],
        "routeReady": true
      },
      {
        "day": 13,
        "cityKo": "빈",
        "cityEn": "Vienna",
        "coords": [
          16.3839827,
          48.1817738
        ],
        "moveType": "flight",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "lodging": {
          "name": "B&B Hotel Wien-Hbf (지도 동선 기준 임시)",
          "coords": [
            16.3839827,
            48.1817738
          ],
          "note": "Bloch-Bauer-Promenade 5 · 5박 동선 기준 · 1순위 후보 Austria Trend Hotel Ananas 확정 시 경로 교체"
        },
        "transport": {
          "mode": "plane",
          "label": "B&B Hotel Wien-Hbf → 빈 도심 마지막 산책 → Wien Hbf → VIE T3 | 대한항공 KE938 19:15 → ICN 2/23 14:15"
        },
        "via": [
          [
            16.3839827,
            48.1817738
          ],
          [
            16.3767,
            48.1858
          ],
          [
            16.5697,
            48.1103
          ]
        ],
        "title": "2/22(월) · 빈의 마지막 반나절과 직항 귀국",
        "am": "아침을 먹고 체크아웃해 호텔에 짐을 맡긴다. 슈타트파르크에서 빈 구시가지로 걸으며 마지막 무료 산책을 한다.",
        "pm": "그라벤과 슈테판 대성당 주변에서 점심·카페 시간을 갖고 U1으로 숙소에 돌아와 짐을 찾은 뒤 Wien Hbf로 이동한다.",
        "ev": "15:42 전후 Railjet으로 공항에 가 대한항공 체크인과 출국 수속을 마친 뒤 19:15 KE938 직항편으로 출발한다. 2월 23일 화요일 14:15 인천공항 T2 도착이다.",
        "tip": "B&B Hotel Wien-Hbf에서 중앙역까지 도보 약 10–12분이다. CAT 대신 Wien Hbf 출발 공항행 Railjet을 이용하며 2027년 정확한 시각은 예매 전 다시 확인한다.",
        "timeline": [
          {
            "time": "08:30–09:45",
            "title": "아침 식사·최종 짐 정리",
            "detail": "숙소 주변에서 현장 선택",
            "kind": "free",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "09:45–10:00",
            "title": "체크아웃·호텔에 짐 보관",
            "detail": "트윈룸 2개 확인 후 캐리어 4개 보관 요청",
            "kind": "buffer",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:00–10:35",
            "title": "슈타트파르크 이동",
            "detail": "Wien Hbf에서 트램 D·도보 조합",
            "kind": "travel",
            "at": [
              16.3766,
              48.2046
            ],
            "mode": "tram",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "10:35–11:35",
            "title": "슈타트파르크 마지막 산책",
            "detail": "요한 슈트라우스 동상·쿠어살롱 외관 · 무료",
            "kind": "visit",
            "at": [
              16.3766,
              48.2046
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "11:35–12:10",
            "title": "도보로 슈테판 대성당 이동",
            "detail": "Wollzeile 방향 약 1.5km",
            "kind": "travel",
            "at": [
              16.3731,
              48.2085
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "12:10–13:50",
            "title": "그라벤·슈테판 광장·점심 자유시간",
            "detail": "마지막 산책과 식사·카페에 100분",
            "kind": "free",
            "at": [
              16.3697,
              48.2087
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "13:50–14:25",
            "title": "U1으로 숙소 복귀",
            "detail": "Stephansplatz → Wien Hbf · 숙소까지 도보",
            "kind": "travel",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "subway",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "14:25–14:45",
            "title": "호텔에서 짐 수령",
            "detail": "캐리어 4개와 여권·탑승권 확인",
            "kind": "buffer",
            "at": [
              16.3839827,
              48.1817738
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "14:45–15:15",
            "title": "Wien Hbf 이동·승강장 확인",
            "detail": "숙소에서 도보 약 10–12분 · 간단한 간식 구입",
            "kind": "travel",
            "at": [
              16.3767,
              48.1858
            ],
            "mode": "walk",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "15:42 전후",
            "title": "공항행 Railjet 출발",
            "detail": "Wien Hbf → Flughafen Wien 약 15분 · 2027년 시간표 재확인",
            "kind": "travel",
            "at": [
              16.3767,
              48.1858
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "16:00 전후",
            "title": "빈 국제공항 도착",
            "detail": "T3 대한항공 체크인 구역으로 이동",
            "kind": "travel",
            "at": [
              16.5697,
              48.1103
            ],
            "mode": "train",
            "long": true,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "16:00–18:15",
            "title": "수하물 위탁·보안검색·출국·식사 여유",
            "detail": "4인 위탁수하물 처리 · 전광판에서 체크인 카운터 확인",
            "kind": "buffer",
            "at": [
              16.5697,
              48.1103
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "18:20",
            "title": "탑승구 대기",
            "detail": "여권·탑승권 확인 후 탑승 안내 대기",
            "kind": "buffer",
            "at": [
              16.5697,
              48.1103
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "19:15",
            "title": "KE938 빈 출발",
            "detail": "대한항공 직항 · 인천까지 약 11시간",
            "kind": "travel",
            "at": [
              16.5697,
              48.1103
            ],
            "mode": "stay",
            "long": false,
            "via": [],
            "overviewAfter": false
          },
          {
            "time": "2/23 14:15",
            "title": "인천국제공항 T2 도착",
            "detail": "수하물 수취 후 여행 종료",
            "kind": "travel",
            "at": [
              126.4505,
              37.4692
            ],
            "mode": "plane",
            "long": true,
            "via": [],
            "overviewAfter": false
          }
        ],
        "photos": [
          {
            "spot": "qa_c9_d13_0",
            "at": [
              16.374399999999998,
              48.2082
            ],
            "cap": "그라벤과 페스트 기념주",
            "desc": "출국 전 마지막 반나절에 슈테판 광장과 함께 걷는 빈 구시가지의 중심 보행로입니다."
          },
          {
            "spot": "qa_c10_d1_0",
            "at": [
              16.374399999999998,
              48.20923923048454
            ],
            "cap": "대한항공 직항편",
            "desc": "뮌헨 환승 없이 빈에서 인천까지 이어지는 대한항공 KE938 직항 귀국편입니다."
          },
          {
            "spot": "qa_c9_d12_rich_088",
            "at": [
              16.3767,
              48.1858
            ],
            "cap": "빈 중앙역 공항열차 출발",
            "desc": "숙소에서 걸어온 뒤 공항행 Railjet을 타는 Wien Hbf 승강장이다."
          },
          {
            "spot": "qa_c9_d12_rich_089",
            "at": [
              16.3855,
              48.2079
            ],
            "cap": "CAT 공항열차 외관",
            "desc": "빈 시내와 공항을 빠르게 잇는 초록색 열차로, 짐이 있는 귀국일에 가장 단순한 선택지다."
          },
          {
            "spot": "qa_c9_d12_rich_090",
            "at": [
              16.5697,
              48.1103
            ],
            "cap": "빈 국제공항 터미널 3",
            "desc": "대한항공 직항편의 수하물 위탁과 출국 수속을 진행하는 귀국일 공항 터미널이다."
          },
          {
            "spot": "qa_c9_d12_rich_091",
            "at": [
              16.5636,
              48.1197
            ],
            "cap": "빈 공항역 플랫폼",
            "desc": "CAT에서 내려 터미널로 올라가는 연결 지점이라, 공항 도착 후 길을 잃지 않기 위한 기준점이 된다."
          },
          {
            "spot": "qa_c9_ke_aircraft_2027",
            "at": [
              16.5697,
              48.1103
            ],
            "cap": "대한항공 항공기",
            "desc": "빈에서 인천으로 바로 이어지는 KE938 직항편을 상징하는 항공기다."
          },
          {
            "spot": "qa_c9_d12_rich_093",
            "at": [
              16.5697,
              48.1103
            ],
            "cap": "슈베하트 공항 주변",
            "desc": "빈 공항이 자리한 외곽 지역으로, 시내와 달라지는 풍경이 여행의 끝을 실감하게 한다."
          },
          {
            "spot": "qa_c9_d12_rich_094",
            "at": [
              16.5697,
              48.1103
            ],
            "cap": "빈 공항 관제탑",
            "desc": "활주로와 터미널을 내려다보는 공항 시설로, 출국 전 마지막 유럽 교통 장면을 만든다."
          },
          {
            "spot": "qa_c9_d12_rich_095",
            "at": [
              16.3839827,
              48.1817738
            ],
            "cap": "빈 중앙역 남쪽 아침 거리",
            "desc": "B&B Hotel Wien-Hbf 주변에서 체크아웃 전 마지막 아침을 시작하는 숙소 생활권이다."
          }
        ],
        "routeReady": true
      }
    ],
    "color": "#4f46e5",
    "party": "4인 확정 · 마인츠 3박 · 뮌헨 4박 · 빈 5박",
    "partyConfirmed": true,
    "costs": {
      "travelers": 4,
      "airfareTotal": 5080000,
      "airfarePerPerson": 1270000,
      "lodgingTotal": 2334253,
      "lodgingPerPerson": 583563,
      "airfareAndLodgingPerPerson": 1853563,
      "estimatedTotalPerPerson": 3823000,
      "basis": "항공 인당 127만원 · 빈 숙소 1순위 후보 5박 981,315원 기준"
    },
    "lodgingCandidates": {
      "viennaPrimary": {
        "status": "1순위 후보 · 미예약",
        "name": "Austria Trend Hotel Ananas",
        "dates": "2027년 2월 17일 ~ 2월 22일 · 5박",
        "room": "패밀리 스위트 1실 · 싱글침대 4개 · 52㎡ · 전용 욕실",
        "total": 981315,
        "perPerson": 245329,
        "conditions": "세금·서비스비 포함 · 환불 불가 · 조식 미포함",
        "access": "U4 Pilgramgasse역 100m 이내 · 나슈마르크트 약 1km",
        "url": "https://kr.trip.com/hotels/detail/?cityEnName=Vienna&cityId=651&hotelId=740164&checkIn=2027-02-17&checkOut=2027-02-22&adult=4&children=0&crn=1&curr=KRW&barcurr=KRW"
      }
    },
    "feedbackId": 9
  },
  {
    "id": 2,
    "experience": "tokyo",
    "nameKo": "도쿄 쇼핑",
    "subtitle": "좋아하는 것들을 찾아, 함께 걷는 도쿄",
    "period": "2027.01.25 ~ 01.29",
    "nights": "4박 5일",
    "party": "3인 · 쇼핑 & 도쿄 디즈니랜드",
    "cities": [
      "우에노",
      "시부야·하라주쿠",
      "신주쿠",
      "긴자"
    ],
    "color": "#315f55",
    "coverSpot": "qa_c11_cover",
    "days": [
      {
        "day": 1,
        "cityKo": "우에노",
        "title": "우에노에서 시작하는 첫날"
      },
      {
        "day": 2,
        "cityKo": "도쿄 디즈니랜드",
        "title": "하루 온전히, 디즈니랜드"
      },
      {
        "day": 3,
        "cityKo": "시부야·하라주쿠",
        "title": "좋아하는 것들과, 노을"
      },
      {
        "day": 4,
        "cityKo": "신주쿠·긴자",
        "title": "마지막 쇼핑, 도쿄의 밤"
      },
      {
        "day": 5,
        "cityKo": "나리타공항",
        "title": "다시 집으로"
      }
    ]
  },
  {
    "id": 3,
    "experience": "citytrip",
    "nameKo": "크리스마스 뮌헨 - 독일 동부 - 바르샤바",
    "subtitle": "공항부터 국제열차까지 이어지는 겨울 도시 여행",
    "period": "날짜 확정 전 · 본보기 일정",
    "nights": "9박 10일",
    "party": "저녁 입국 · 낮 출국",
    "cities": [
      "뮌헨",
      "드레스덴",
      "베를린",
      "바르샤바"
    ],
    "color": "#7b4f34",
    "coverSpot": "qa_c9_cover_munich_base",
    "days": [
      {
        "day": 1,
        "cityKo": "뮌헨",
        "title": "저녁 뮌헨 입국"
      },
      {
        "day": 2,
        "cityKo": "뮌헨",
        "title": "구시가지와 영국정원"
      },
      {
        "day": 3,
        "cityKo": "노이슈반슈타인",
        "title": "노이슈반슈타인 당일치기"
      },
      {
        "day": 4,
        "cityKo": "드레스덴",
        "title": "드레스덴으로"
      },
      {
        "day": 5,
        "cityKo": "드레스덴",
        "title": "바로크 구시가지"
      },
      {
        "day": 6,
        "cityKo": "베를린",
        "title": "베를린으로"
      },
      {
        "day": 7,
        "cityKo": "베를린",
        "title": "박물관섬과 장벽"
      },
      {
        "day": 8,
        "cityKo": "바르샤바",
        "title": "국제열차로 바르샤바"
      },
      {
        "day": 9,
        "cityKo": "바르샤바",
        "title": "구시가지와 공원"
      },
      {
        "day": 10,
        "cityKo": "바르샤바",
        "title": "낮 비행기로 출국"
      }
    ]
  },
  {
    "id": 4,
    "experience": "citytrip",
    "nameKo": "프랑크푸르트 - 함부르크",
    "subtitle": "세 번의 당일치기와 북부 항구도시",
    "period": "날짜 확정 전 · 본보기 일정",
    "nights": "8박 9일",
    "party": "저녁 입국 · 낮 출국",
    "cities": [
      "프랑크푸르트",
      "하이델베르크",
      "스트라스부르",
      "쾰른",
      "함부르크"
    ],
    "color": "#295f78",
    "coverSpot": "qa_c3_d4_0",
    "days": [
      {
        "day": 1,
        "cityKo": "프랑크푸르트",
        "title": "저녁 프랑크푸르트 입국"
      },
      {
        "day": 2,
        "cityKo": "프랑크푸르트",
        "title": "구시가지와 스카이라인"
      },
      {
        "day": 3,
        "cityKo": "하이델베르크",
        "title": "하이델베르크 당일치기"
      },
      {
        "day": 4,
        "cityKo": "스트라스부르",
        "title": "스트라스부르 당일치기"
      },
      {
        "day": 5,
        "cityKo": "쾰른",
        "title": "쾰른 당일치기"
      },
      {
        "day": 6,
        "cityKo": "함부르크",
        "title": "ICE로 함부르크"
      },
      {
        "day": 7,
        "cityKo": "함부르크",
        "title": "슈파이허슈타트"
      },
      {
        "day": 8,
        "cityKo": "함부르크",
        "title": "항구와 알스터호"
      },
      {
        "day": 9,
        "cityKo": "함부르크",
        "title": "낮 비행기로 출국"
      }
    ]
  },
  {
    "id": 5,
    "experience": "citytrip",
    "nameKo": "크리스마스 스트라스부르 - 파리",
    "subtitle": "파리 왕복 · 프랑스의 크리스마스를 천천히",
    "period": "2027.12.18 ~ 12.29 · 예정",
    "nights": "11박 12일",
    "party": "2인 · 스트라스부르 4박 · 파리 7박",
    "cities": [
      "스트라스부르",
      "파리"
    ],
    "color": "#9d3450",
    "coverSpot": "eiffel_tower",
    "days": [
      {
        "day": 1,
        "cityKo": "스트라스부르",
        "title": "CDG에서 바로 스트라스부르"
      },
      {
        "day": 2,
        "cityKo": "스트라스부르",
        "title": "쁘띠 프랑스와 대성당"
      },
      {
        "day": 3,
        "cityKo": "스트라스부르",
        "title": "크리스마스 중심부"
      },
      {
        "day": 4,
        "cityKo": "스트라스부르",
        "title": "오랑주리와 유럽지구"
      },
      {
        "day": 5,
        "cityKo": "파리",
        "title": "TGV로 파리"
      },
      {
        "day": 6,
        "cityKo": "파리",
        "title": "시테섬과 생제르맹"
      },
      {
        "day": 7,
        "cityKo": "파리",
        "title": "몽마르트와 개선문"
      },
      {
        "day": 8,
        "cityKo": "파리",
        "title": "에펠탑과 센강"
      },
      {
        "day": 9,
        "cityKo": "파리",
        "title": "파리 자유일"
      },
      {
        "day": 10,
        "cityKo": "파리",
        "title": "센강과 여유로운 오후"
      },
      {
        "day": 11,
        "cityKo": "파리",
        "title": "파리의 마지막 하루"
      },
      {
        "day": 12,
        "cityKo": "파리",
        "title": "낮 비행기로 출국"
      }
    ]
  },
  {
    "id": 6,
    "nameKo": "중부유럽",
    "feedbackId": 5,
    "subtitle": "전역 후 첫 유럽, 알뜰하게",
    "period": "미정",
    "nights": "10박 11일",
    "cities": [
      "프라하",
      "빈",
      "부다페스트"
    ],
    "coverSpot": "fishermans_bastion",
    "days": [
      {
        "day": 1,
        "cityKo": "프라하",
        "cityEn": "Prague",
        "coords": [
          14.4208,
          50.088
        ],
        "moveType": "flight",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "transport": {
          "mode": "plane",
          "label": "인천 → 프라하 · 경유 비행"
        },
        "title": "프라하 도착",
        "am": "인천국제공항에서 출발한다. 직항 노선이 없으므로 프랑크푸르트, 암스테르담, 도하 등을 경유하는 편이 일반적이다. 기내에서는 중앙유럽 지도를 미리 살펴두면 좋다.",
        "pm": "프라하 바츨라프 하벨 공항 도착. 시내까지는 119번 버스 + 지하철로 약 40분. 체크인 후 구시가지 광장 주변을 가볍게 둘러본다.",
        "ev": "구시가지 광장 야경을 즐기고, 숙소 근처에서 첫 저녁 식사. 굴라시 수프나 슈바이네 브라텐(돼지 구이)부터 시작해보자. 첫날은 다음 일정의 동선을 확인하고 트램 정류장 위치까지 가볍게 익히는 정도로 마무리한다.",
        "tip": "공항 택시보다 공항버스+지하철 조합이 훨씬 저렴하다. 도착 즉시 24시간 대중교통권(약 4,000원)을 구입하면 편리하다.",
        "photos": [
          {
            "spot": "qa_c5_d1_0",
            "at": [
              14.4214,
              50.088
            ],
            "cap": "인천국제공항",
            "desc": "프라하로의 출발동유럽 낭만 여행의 첫 시작점, 설렘으로 가득 찬 인천공항 터미널의 풍경입니다."
          },
          {
            "spot": "qa_c5_d1_1",
            "at": [
              14.4214,
              50.089039230484545
            ],
            "cap": "바츨라프 하벨 공항",
            "desc": "프라하 도착장시간의 비행 끝에 마침내 도착한 체코의 메인 국제공항 전경입니다."
          }
        ]
      },
      {
        "day": 2,
        "cityKo": "프라하",
        "cityEn": "Prague",
        "coords": [
          14.4208,
          50.088
        ],
        "moveType": "stay",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "transport": {
          "mode": "walk",
          "label": "프라하 시내 도보"
        },
        "title": "프라하 성 · 카를교",
        "am": "프라하 성(Pražský hrad)으로 올라간다. 성 비투스 대성당의 아르누보 스테인드글라스는 오전 햇빛에 가장 아름답다. 황금소로(Zlatá ulička)는 카프카가 잠시 거주한 22번지가 있는 작은 골목이다.",
        "pm": "말라스트라나(Malá Strana) 지구를 거닐며 카를교로 내려온다. 카를교 위에서 구시가지 방향을 바라보면 프라하 성이 배경으로 펼쳐진다. 카를교 옆 골목 작은 카페에서 잠시 쉬어가도 좋다.",
        "ev": "구시가지 광장에서 천문시계(Orloj) 정시 퍼포먼스를 구경한다. 매 정각 해골 인형과 12사도 인형이 등장한다.",
        "tip": "프라하 성 통합권보다 성당+황금소로만 따로 입장하면 더 저렴하다(황금소로 단독 약 5,000원). 오전 9시 이전에 도착하면 인파를 크게 줄일 수 있다.",
        "photos": [
          {
            "spot": "qa_c5_d2_0",
            "at": [
              14.4214,
              50.088
            ],
            "cap": "성 비투스 대성당",
            "desc": "프라하 성의 웅장한 고딕하늘을 찌를 듯 솟아오른 거대한 첨탑과 정교한 조각들이 인상적인 성 비투스 대성당입니다."
          },
          {
            "spot": "qa_c5_d2_1",
            "at": [
              14.4214,
              50.089039230484545
            ],
            "cap": "황금소로",
            "desc": "카프카의 작업실이 있는 골목프라하 성 벽에 바짝 붙어 지어진, 옛 연금술사들이 살았던 파스텔 톤의 아기자기한 작은 집들입니다."
          }
        ]
      },
      {
        "day": 3,
        "cityKo": "프라하",
        "cityEn": "Prague",
        "coords": [
          14.4208,
          50.088
        ],
        "moveType": "stay",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "transport": {
          "mode": "walk",
          "label": "프라하 시내 도보"
        },
        "title": "유대인 지구 · 양조장 저녁",
        "am": "유대인 지구 요제포프(Josefov)를 방문한다. 마이젤 시나고그, 구유대인 공동묘지, 스페인 시나고그 등을 볼 수 있다. 공동묘지는 땅이 부족해 1만 2천여 명이 겹겹이 묻혀 있는 독특한 장소다.",
        "pm": "바츨라프 광장(Václavské náměstí)을 걸어 체코 근현대사를 느낀다. 1968년 프라하의 봄, 1989년 벨벳 혁명의 현장이다.",
        "ev": "U Fleků(우플레쿠) 양조장 레스토랑에서 저녁을 먹는다. 1499년 문을 연 체코에서 가장 오래된 양조장으로, 직접 양조한 흑맥주와 돼지 구이가 유명하다. 골목에서 트르들로(트르들리크)도 사먹어보자.",
        "tip": "요제포프 통합권은 약 17,000원이므로 시나고그 2-3곳만 보고 싶다면 단품 구매가 낫다. 우플레쿠는 저녁 6시 이전에 가면 대기 없이 자리를 잡을 수 있다.",
        "photos": [
          {
            "spot": "qa_c5_d3_0",
            "at": [
              14.4214,
              50.088
            ],
            "cap": "구유대인 공동묘지",
            "desc": "겹겹이 쌓인 묘비들요제포프 지구에 위치한, 좁은 공간에 1만 2천 개의 이끼 낀 낡은 묘비들이 빽빽하게 들어선 경건한 장소입니다."
          },
          {
            "spot": "qa_c5_d3_1",
            "at": [
              14.4214,
              50.089039230484545
            ],
            "cap": "바츨라프 광장",
            "desc": "프라하의 봄을 간직한 곳국립박물관에서 길게 뻗어 내리며 체코의 굵직한 근현대사 시위가 열렸던 활기찬 번화가입니다."
          }
        ]
      },
      {
        "day": 4,
        "cityKo": "체스키크룸로프",
        "cityEn": "Český Krumlov",
        "coords": [
          14.318,
          48.8127
        ],
        "moveType": "ground",
        "isTrip": true,
        "baseCity": "프라하",
        "baseCoords": [
          14.4208,
          50.088
        ],
        "transport": {
          "mode": "bus",
          "label": "프라하 → 체스키크룸로프 · 버스 2.5시간"
        },
        "via": [
          [
            14.36,
            49.7
          ],
          [
            14.15,
            49.3
          ],
          [
            14.25,
            48.95
          ]
        ],
        "title": "체스키크룸로프 당일치기",
        "am": "프라하 플로렌츠 버스 터미널에서 출발(Flixbus 또는 RegioJet, 약 2.5시간). 도착 후 체스키크룸로프 성으로 올라간다. 성에서 내려다보이는 붉은 지붕 구시가지와 블타바 강 굽이치는 전경이 이 소도시를 유네스코 세계문화유산으로 만든 이유다.",
        "pm": "성 아래 구시가지 골목을 천천히 걷는다. 블타바 강변에서 카약 체험(저렴)을 하거나 강변 카페에서 쉬어가도 좋다. 작은 마을이라 2-3시간이면 주요 명소를 모두 돌 수 있다.",
        "ev": "오후 버스로 프라하로 귀환. 귀국하기 전 굴뚝 케이크(쿠르토샬라치)를 길거리 간식으로 먹어보자. (야간 추천: 프라하로 돌아와 카를교에서 환상적인 야경을 감상합니다. 근처 체코 전통 펍(Pivnice)에 들러 바삭한 꼴레뇨(Koleno)와 시원한 코젤 다크 생맥주로 하루의 피로를 날려보세요.)",
        "tip": "버스 왕복 약 15,000원. 성 내부 투어(약 12,000원)보다 외관과 전망만 즐겨도 만족스럽다. 성수기에는 왕복 버스 미리 예약 필수.",
        "photos": [
          {
            "spot": "qa_c5_d4_0",
            "at": [
              14.3186,
              48.8127
            ],
            "cap": "체스키크룸로프 성",
            "desc": "망토 다리에서의 전망성 위에서 내려다보는 붉은 지붕들의 바다와 블타바 강이 마을을 둥글게 휘감아 도는 동화 같은 전경입니다."
          },
          {
            "spot": "qa_c5_d4_1",
            "at": [
              14.3186,
              48.81373923048454
            ],
            "cap": "블타바 강변",
            "desc": "평화로운 소도시 산책잔잔히 흐르는 블타바 강을 끼고 이어지는 구시가지의 아기자기한 중세풍 골목길 풍경입니다."
          }
        ]
      },
      {
        "day": 5,
        "cityKo": "빈",
        "cityEn": "Vienna",
        "coords": [
          16.3738,
          48.2082
        ],
        "moveType": "ground",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "transport": {
          "mode": "train",
          "label": "프라하 → 빈 · Railjet 4시간"
        },
        "via": [
          [
            15.7765,
            49.9439
          ],
          [
            16.6068,
            49.1951
          ],
          [
            16.8824,
            48.7564
          ]
        ],
        "title": "프라하 → 빈 이동",
        "am": "프라하 중앙역(Praha Hlavní nádraží)에서 레일젯(Railjet) 기차를 탄다. 브르노, 브르제츠라프를 지나 약 4시간 만에 빈 중앙역(Wien Hauptbahnhof)에 도착한다. 차창 밖 보헤미아 평원과 모라비아 포도밭 풍경이 이동 시간을 즐겁게 만든다.",
        "pm": "빈 체크인 후 링슈트라세(Ringstraße)를 따라 걷는다. 국립오페라극장, 미술사 박물관, 자연사 박물관이 줄지어 있는 대로다. 오페라 1시간 가이드 투어(약 7,000원)를 추천한다.",
        "ev": "슈테판스돔(Stephansdom) 주변 그라벤(Graben) 거리를 산책한다. 거리 음악가들의 공연을 들으며 빈의 밤을 즐겨보자.",
        "tip": "프라하-빈 레일젯은 1인 약 20,000-40,000원. 오스트리아 도착 시 비엔나 시티 카드(Vienna City Card, 24시간 약 15,000원)를 사면 대중교통이 무제한이다.",
        "photos": [
          {
            "spot": "qa_c5_d5_0",
            "at": [
              16.374399999999998,
              48.2082
            ],
            "cap": "레일젯",
            "desc": "오스트리아로 향하는 기차프라하를 떠나 보헤미아의 넓은 평원을 시원하게 가로지르는 빨간색 고속열차입니다."
          },
          {
            "spot": "qa_c5_d5_1",
            "at": [
              16.374399999999998,
              48.20923923048454
            ],
            "cap": "링슈트라세",
            "desc": "웅장한 건축물들의 대로빈 옛 성벽 터를 따라 조성된 넓은 환상도로로, 국립오페라극장 등 압도적인 19세기 건축물들이 늘어서 있습니다."
          }
        ]
      },
      {
        "day": 6,
        "cityKo": "빈",
        "cityEn": "Vienna",
        "coords": [
          16.3738,
          48.2082
        ],
        "moveType": "stay",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "transport": {
          "mode": "walk",
          "label": "빈 시내 도보·트램"
        },
        "title": "쇤브룬 · 벨베데레",
        "am": "쇤브룬 궁전(Schönbrunn Palace)으로 이동한다. 합스부르크 왕조의 여름 궁전으로 임페리얼 투어(22개 방, 약 15,000원)로 핵심을 볼 수 있다. 정원은 무료이며, 언덕 위 글로리에테(Gloriette)까지 올라가면 빈 전경이 한눈에 펼쳐진다.",
        "pm": "벨베데레(Belvedere) 상궁으로 이동한다. 클림트의 «키스(Der Kuss)» 원화가 여기에 있다. 상궁 입장료 약 15,000원. 정원은 무료이며 분수 너머로 바라보는 궁전 정면이 특히 아름답다.",
        "ev": "나슈마르크트(Naschmarkt)에서 저녁거리를 구한다. 빈 최대 야외 시장으로 케밥, 팔라펠, 치즈 등 저렴한 음식이 많다.",
        "tip": "쇤브룬 개장(8:30)에 맞춰 일찍 가면 인파를 피할 수 있다. 비엔나 시티 카드 소지자는 두 궁전 모두 입장 할인된다.",
        "photos": [
          {
            "spot": "qa_c5_d6_0",
            "at": [
              16.374399999999998,
              48.2082
            ],
            "cap": "쇤브룬 궁전",
            "desc": "합스부르크의 웅장한 정원넓은 잔디밭과 기하학적 정원 너머로 보이는 마리아 테레지아의 화려한 노란색 여름 이궁입니다."
          },
          {
            "spot": "qa_c5_d6_1",
            "at": [
              16.374399999999998,
              48.20923923048454
            ],
            "cap": "글로리에테",
            "desc": "언덕 위의 개선문궁전 정원 꼭대기에 세워진 열주 위에서 쇤브룬 궁전과 빈 시내를 한 번에 내려다볼 수 있는 곳입니다."
          }
        ]
      },
      {
        "day": 7,
        "cityKo": "빈",
        "cityEn": "Vienna",
        "coords": [
          16.3738,
          48.2082
        ],
        "moveType": "stay",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "transport": {
          "mode": "walk",
          "label": "빈 시내 도보"
        },
        "title": "미술사 박물관 · 카페 문화",
        "am": "미술사 박물관(Kunsthistorisches Museum)에서 오전을 보낸다. 합스부르크 왕가가 수집한 브뤼헬, 베르메르, 라파엘로의 걸작들이 있다. 입장료 약 20,000원으로 유럽 박물관 중 가성비가 높다.",
        "pm": "카페 첸트랄(Café Central)에서 빈의 커피 문화를 체험한다. 1876년 개장한 빈의 대표 카피하우스로 프로이트, 트로츠키가 단골이었다. 멜랑주(Melange) 한 잔과 케이크로 여유로운 오후를 보내자.",
        "ev": "프라터 공원(Prater)에서 저녁을 보낸다. 1897년부터 운행 중인 대관람차(Riesenrad)는 빈의 상징이다. 공원 안 소시지 노점(Würstelstand)에서 빈식 소시지를 저렴하게 먹을 수 있다.",
        "tip": "카페 첸트랄은 오전 10시 이전 또는 오후 3시 이후에 가면 대기 없이 들어갈 수 있다. 커피와 케이크 1인 약 13,000원.",
        "photos": [
          {
            "spot": "qa_c5_d7_0",
            "at": [
              16.374399999999998,
              48.2082
            ],
            "cap": "미술사 박물관",
            "desc": "화려한 돔 아래의 갤러리대리석과 금박으로 장식된 압도적으로 화려한 중앙 홀과 계단이 있는 유럽 최고의 미술관입니다."
          },
          {
            "spot": "qa_c5_d7_1",
            "at": [
              16.374399999999998,
              48.20923923048454
            ],
            "cap": "카페 첸트랄",
            "desc": "지성인들의 커피하우스아치형 천장 아래 그랜드 피아노 선율이 흐르고, 멜랑쥐 한 잔의 여유를 즐기는 클래식한 카페 내부입니다."
          }
        ]
      },
      {
        "day": 8,
        "cityKo": "부다페스트",
        "cityEn": "Budapest",
        "coords": [
          19.0402,
          47.4979
        ],
        "moveType": "ground",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "transport": {
          "mode": "train",
          "label": "빈 → 부다페스트 · Railjet 2.5시간"
        },
        "via": [
          [
            17.15,
            47.9
          ],
          [
            17.633,
            47.6875
          ]
        ],
        "title": "빈 → 부다페스트 이동",
        "am": "빈 중앙역(Wien Hauptbahnhof)에서 레일젯으로 출발한다. 헤게샬롬(Hegyeshalom) 국경을 지나 죄르(Győr)를 경유해 약 2.5시간 만에 부다페스트 켈레티역(Budapest Keleti)에 도착한다.",
        "pm": "체크인 후 다뉴브 강변으로 나간다. 페스트 쪽 강변에서 부다 언덕 위 왕궁 전경을 감상한다. 체인브리지(세체니 다리)를 걸어서 건너 부다 쪽으로 넘어가보자.",
        "ev": "어부의 요새(Halászbástya)에서 야경을 즐긴다. 요새 위에서 세체니 다리와 국회의사당을 동시에 볼 수 있다. 외부는 무료이며 마차시 교회도 외관이 인상적이다.",
        "tip": "빈-부다페스트 레일젯은 1인 약 15,000-30,000원. 부다페스트 대중교통 24시간권은 약 2,500원으로 매우 저렴하다.",
        "photos": [
          {
            "spot": "qa_c5_d8_0",
            "at": [
              19.040799999999997,
              47.4979
            ],
            "cap": "켈레티 역",
            "desc": "부다페스트의 동부 역빈을 떠나 헝가리로 도착하는 기차 여행객들을 맞이하는 웅장한 아치형 지붕의 기차역입니다."
          },
          {
            "spot": "qa_c5_d8_1",
            "at": [
              19.040799999999997,
              47.498939230484545
            ],
            "cap": "세체니 다리",
            "desc": "사자상이 지키는 현수교부다와 페스트 지역을 잇는 최초의 돌다리로, 웅장한 사자 동상이 양끝을 장식하고 있습니다."
          }
        ]
      },
      {
        "day": 9,
        "cityKo": "부다페스트",
        "cityEn": "Budapest",
        "coords": [
          19.0402,
          47.4979
        ],
        "moveType": "stay",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "transport": {
          "mode": "walk",
          "label": "부다페스트 시내 도보·지하철"
        },
        "title": "국회의사당 · 영웅광장 · 루인 바",
        "am": "국회의사당(Országház)을 다뉴브 강변에서 감상한다. 내부 투어는 1인 약 8,000원. 이어서 영웅광장(Hősök tere)으로 이동한다. 건국 1000주년 기념 광장으로 헝가리를 세운 7명의 족장 기마상이 있다.",
        "pm": "중앙시장(Vásárcsarnok) 2층에서 랑고시(Lángos)를 먹는다. 기름에 튀긴 납작한 반죽에 사워크림과 치즈를 얹은 헝가리 길거리 음식으로 1,500원 내외다. 시장에서 파프리카와 기념품도 구경하자.",
        "ev": "유대인 지구(Erzsébetváros)의 루인 바 지구를 방문한다. 폐건물을 개조한 짐플라 케르트(Szimpla Kert)는 맥주 한 잔에 약 3,000원으로 부다페스트 특유의 문화 공간이다.",
        "tip": "랑고시는 중앙시장 2층이 가장 맛있고 저렴하다. 루인 바 지구는 목-토요일 밤에 가장 활성화되어 있다. 지하철 M1호선은 유럽에서 두 번째로 오래된 지하철로 그 자체가 볼거리다.",
        "photos": [
          {
            "spot": "qa_c5_d9_0",
            "at": [
              19.040799999999997,
              47.4979
            ],
            "cap": "국회의사당",
            "desc": "다뉴브 강변의 장엄한 건물섬세하고 화려한 네오고딕 양식으로 강변에 길게 자리 잡은 헝가리의 상징적인 랜드마크입니다."
          },
          {
            "spot": "qa_c5_d9_1",
            "at": [
              19.040799999999997,
              47.498939230484545
            ],
            "cap": "영웅광장",
            "desc": "마자르 족장의 기마상헝가리 건국 1천 년을 기념하여 세워진 거대한 기념비와 정교한 조각상들이 반원형으로 늘어선 넓은 광장입니다."
          }
        ]
      },
      {
        "day": 10,
        "cityKo": "부다페스트",
        "cityEn": "Budapest",
        "coords": [
          19.0402,
          47.4979
        ],
        "moveType": "stay",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "transport": {
          "mode": "walk",
          "label": "부다페스트 시내 도보·지하철"
        },
        "title": "세체니 온천 · 부다 왕궁 언덕",
        "am": "세체니 온천(Széchenyi Thermal Bath)에서 오전을 보낸다. 1913년 개장한 유럽 최대의 온천 단지로 실내외 풀 합쳐 15개의 탕이 있다. 입장료 약 25,000원. 노천 풀에서 체스를 두며 온천을 즐기는 헝가리 특유의 문화를 경험해보자.",
        "pm": "부다 왕궁 언덕(Várhegy)에 올라간다. 케이블카(Budavári Sikló, 약 2,000원) 또는 버스로 이동 가능. 어부의 요새와 마차시 교회를 낮에 다시 바라보고, 왕궁 내 헝가리 국립미술관(약 4,000원)도 추천한다.",
        "ev": "다뉴브 강변에서 마지막 부다페스트 저녁을 보낸다. 헝가리 전통 굴라시(Gulyás)로 마지막 식사를 즐기자.",
        "tip": "세체니 온천은 수건 대여(약 2,500원)와 자물쇠 보증금이 별도다. 수영복은 꼭 챙겨야 한다. 주말에는 비트 음악이 흐르는 스파 파티(Sparty)도 열린다.",
        "photos": [
          {
            "spot": "qa_c5_d10_0",
            "at": [
              19.040799999999997,
              47.4979
            ],
            "cap": "세체니 온천",
            "desc": "노란빛 궁전에서의 온천화려한 네오바로크 양식의 노란 건물에 둘러싸인 거대한 야외 풀에서 김이 모락모락 나는 유럽 최대의 온천입니다."
          },
          {
            "spot": "qa_c5_d10_1",
            "at": [
              19.040799999999997,
              47.498939230484545
            ],
            "cap": "부다바리 시클로",
            "desc": "언덕을 오르는 케이블카다뉴브 강변에서 세체니 다리를 내려다보며 부다 왕궁 언덕으로 가파르게 올라가는 목조 푸니쿨라입니다."
          }
        ]
      },
      {
        "day": 11,
        "cityKo": "부다페스트",
        "cityEn": "Budapest",
        "coords": [
          19.0402,
          47.4979
        ],
        "moveType": "flight",
        "isTrip": false,
        "baseCity": null,
        "baseCoords": null,
        "transport": {
          "mode": "plane",
          "label": "부다페스트 → 인천 · 귀국 비행"
        },
        "title": "귀국 출발",
        "am": "페렌츠 리스트 국제공항으로 이동한다. 시내에서 100E 버스(약 1,500원)로 약 30분. 일찍 체크아웃한다면 중앙시장에서 마지막 헝가리 먹거리를 챙긴다.",
        "pm": "귀국 비행 탑승. 부다페스트에서 인천까지는 직항이 없어 프랑크푸르트, 아부다비, 두바이 등을 경유하며 약 15-18시간 소요된다.",
        "ev": "기내 이동. 프라하의 석조 골목, 빈의 커피 향, 부다페스트의 온천과 야경이 담긴 11일의 여정이 마무리된다. 경유 공항에서는 다음 탑승구와 수하물 연결 여부를 먼저 확인하고, 남은 포린트나 유로 동전을 정리한다.",
        "tip": "부다페스트 공항 면세구역에서 헝가리산 파프리카 파우더, 토카이 와인, 팔링카(과실 증류주)를 기념품으로 구입하면 좋다. 유럽 내 경유편은 환승 시간을 넉넉히 잡자.",
        "photos": [
          {
            "spot": "qa_c5_d11_0",
            "at": [
              19.040799999999997,
              47.4979
            ],
            "cap": "공항행 100E 버스",
            "desc": "귀국을 위한 공항 이동부다페스트 시내를 떠나 페렌츠 리스트 국제공항으로 향하는 공항버스의 풍경입니다."
          },
          {
            "spot": "qa_c5_d11_1",
            "at": [
              19.040799999999997,
              47.498939230484545
            ],
            "cap": "귀국행 항공편",
            "desc": "유럽을 떠나며부다페스트에서의 아쉬운 일정을 마치고 환승을 위해 붉은 노을 속으로 이륙하는 비행기입니다."
          }
        ]
      }
    ],
    "color": "#16a34a"
  },
  {
    "id": 7,
    "nameKo": "스위스 - 이탈리아",
    "feedbackId": 6,
    "subtitle": "알프스에서 로마까지, 둘이서",
    "period": "2027년 1월",
    "nights": "7박 8일",
    "cities": [
      "인터라켄",
      "피렌체",
      "로마"
    ],
    "coverSpot": "jungfraujoch",
    "days": [
      {
        "day": 1,
        "cityKo": "인터라켄",
        "cityEn": "Interlaken",
        "coords": [
          7.8632,
          46.6863
        ],
        "moveType": "flight",
        "isTrip": false,
        "transport": {
          "mode": "train",
          "label": "취리히 HB → 인터라켄 오스트 · IC · 약 2시간"
        },
        "entryAirport": {
          "coords": [
            8.548,
            47.4647
          ],
          "cityKo": "취리히 (ZRH)",
          "cityEn": "Zurich Airport",
          "transport": {
            "mode": "plane",
            "label": "인천 → 취리히 공항 · LX 123 · 15:40 도착"
          },
          "via": [],
          "title": "취리히 공항 도착 · 입국 심사 완료",
          "am": "인천에서 출발한 LX 123이 13시간 20분 만에 취리히 공항에 착지했다. 입국 심사와 수화물 수취를 마친다.",
          "pm": "공항 지하역에서 스위스 패스를 활성화하고 S10으로 취리히 중앙역(HB)을 향해 10분.",
          "ev": "취리히 중앙역 도착, 도시 구경 후 인터라켄행 기차에 오른다.",
          "tip": "취리히 공항 기차역은 도착 홀 바로 아래 에스컬레이터 연결. 스위스 패스는 공항역부터 유효."
        },
        "before": [
          {
            "coords": [
              8.5401,
              47.3779
            ],
            "cityKo": "취리히",
            "cityEn": "Zurich",
            "transport": {
              "mode": "train",
              "label": "취리히 공항 → 취리히 중앙역(HB) · S10 · 10분"
            },
            "via": [],
            "title": "취리히 첫인상 · 2시간의 도시 산책",
            "am": null,
            "pm": "16:30 취리히 중앙역(HB) 도착. 역 바로 앞 바인호프스트라세(Bahnhofstrasse)를 걸어 파라데플라츠까지. 파라데플라츠 코너의 슈프륑글리(Sprüngli) 본점에서 초콜릿 트뤼플 한 조각. 스위스를 대표하는 명품 거리이자 시민들의 일상 동선이 교차하는 공간이다.",
            "ev": "18:00 그로스뮌스터(Grossmünster, 1220년) 쌍탑을 배경으로 취리히 호수변을 산책. 벨뷰 광장에서 트램 소리를 들으며 취리히를 눈에 담는다. 19:05 취리히 HB에서 IC를 타고 인터라켄으로 출발.",
            "tip": "바인호프스트라세는 역에서 호수까지 직선 1.4km. 슈프륑글리 파라데플라츠점은 월-토 09:30~18:30. 인터라켄행 IC는 취리히 HB 19:05 출발, 베른·슈피츠 경유 약 2시간.",
            "photos": [
              {
                "spot": "qa_c6_d1_before_0_nested_0_0",
                "at": [
                  8.539,
                  47.3744
                ],
                "cap": "바인호프스트라세 · 스위스 명품 거리",
                "desc": "취리히 중앙역에서 취리히 호수까지 이어지는 1.4km의 직선 대로. 스위스 은행 본점들과 명품 브랜드, 슈프륑글리 카페가 줄지어 있다. 유럽에서 가장 비싼 쇼핑 거리 중 하나지만 구경만 해도 충분히 즐겁다."
              },
              {
                "spot": "qa_c6_d1_before_0_nested_0_1",
                "at": [
                  8.5436,
                  47.37
                ],
                "cap": "그로스뮌스터 · 취리히의 쌍탑",
                "desc": "1220년 완공된 로마네스크 양식의 대성당. 두 개의 쌍탑이 취리히 구시가지의 스카이라인을 만든다. 마르틴 루터의 종교개혁을 스위스로 전파한 울리히 츠빙글리가 설교한 곳으로, 개신교 역사의 중요한 거점이다."
              }
            ]
          }
        ],
        "via": [
          [
            7.4474,
            46.948
          ],
          [
            7.655,
            46.6957
          ]
        ],
        "title": "알프스의 관문, 인터라켄 도착",
        "am": "06:30 인천국제공항 출국장. 09:30 스위스항공 LX 123 탑승, 취리히를 향해 직항 13시간 20분. 장거리 비행 뒤 곧바로 산악 지역으로 이동하므로 기내에서는 수분을 충분히 보충하고, 도착 후 사용할 스위스 패스와 열차 시간을 미리 확인한다.",
        "pm": "15:40 취리히 공항 착지. 입국 수속 후 S10으로 취리히 중앙역, 2시간 도시 산책. 리마트 강변과 반호프슈트라세를 짧게 걸으며 시차를 풀고, 저녁 열차에 오르기 전 간단한 샌드위치와 물을 준비한다.",
        "ev": "21:00 인터라켄 오스트역 도착. 아레 강변 호텔에 체크인. 창밖으로 융프라우 삼봉의 실루엣이 어둠 속에 빛난다. 다음 날 산악 열차 시간이 이른 편이므로 짐을 풀고 방한 장비를 바로 꺼내둔다.",
        "tip": "취리히 HB→인터라켄 오스트 IC 기차 19:05·19:35 출발. 스위스 패스(Swiss Travel Pass) 공항부터 유효. 1월 인터라켄 기온은 0~5℃, 겨울 방한 준비 필수.",
        "photos": [
          {
            "spot": "qa_c6_d1_0",
            "at": [
              7.8638,
              46.6863
            ],
            "cap": "인천국제공항",
            "desc": "스위스행 비행기 탑승아침 햇살을 받으며 스위스 취리히를 향해 기나긴 직항 비행을 준비하는 출국장 풍경입니다."
          },
          {
            "spot": "qa_c6_d1_1",
            "at": [
              7.8638,
              46.68733923048455
            ],
            "cap": "취리히 구시가지",
            "desc": "스위스의 첫인상공항에 도착하자마자 기차를 타고 도심으로 이동해 가볍게 산책하는 취리히의 깔끔한 거리입니다."
          }
        ]
      },
      {
        "day": 2,
        "cityKo": "융프라우요흐",
        "cityEn": "Jungfraujoch",
        "coords": [
          7.9711,
          46.5474
        ],
        "moveType": "ground",
        "isTrip": true,
        "baseCity": "인터라켄",
        "baseCityEn": "Interlaken",
        "baseCoords": [
          7.8632,
          46.6863
        ],
        "transport": {
          "mode": "train",
          "label": "인터라켄 → 그린델발트 → 융프라우요흐 · Eiger Express + 융프라우 철도 왕복 약 4시간"
        },
        "via": [
          [
            7.9181,
            46.6266
          ],
          [
            8.0336,
            46.6245
          ],
          [
            7.98,
            46.59
          ]
        ],
        "title": "유럽의 지붕, 융프라우요흐 (3,454m)",
        "am": "08:30 인터라켄 오스트 출발. 그린델발트 터미널에서 Eiger Express 케이블카(15분)와 융프라우 철도로 갈아타며 정상을 향한다. 10:30 해발 3,454m의 융프라우요흐 도착. 세상이 파랗고 하얗다.",
        "pm": "스핑크스 전망대(3,571m)에서 22km 알레치 빙하를 발 아래에 두고, 얼음 궁전(Ice Palace)에서 푸른빛 얼음 조각들 사이를 걷는다. 정상 레스토랑에서 점심 후 13:00 하산. 14:00 그린델발트에서 아이거 북벽을 마주보며 카페 한 잔.",
        "ev": "14:30 그린델발트에서 아이거 북벽을 마지막으로 바라보며 하산. 인터라켄으로 돌아오는 기차 안에서 유럽 최고 역의 기억을 마음에 새긴다. (야간 추천: 인터라켄으로 돌아와 툰 호수나 브리엔츠 호수 주변을 가볍게 산책합니다. 스위스 뢰스티(Rösti) 맛집에서 바삭한 감자전 요리와 함께 융프라우의 웅장한 밤하늘 별을 감상해봅니다.)",
        "returnEv": "15:30 인터라켄 귀환. 호헤베크(Höheweg) 거리를 산책하고, 저녁은 Beresina Fondue Pub에서 치즈 퐁뒤로. 알프스의 냄새가 온몸에 배어 있는 하루의 끝.",
        "tip": "융프라우요흐 티켓은 jungfrau.ch 사전 예약 시 10~20% 할인. 1월 정상 기온 -15℃ 이하, 방한 장비 필수. 수분 보충으로 고산증 예방. 예약시 Good Morning Ticket(새벽 출발)이 가장 저렴.",
        "returnTip": "Beresina Fondue Pub은 저녁 피크 타임(19~21시) 예약이 권장된다. 스위스 치즈 퐁뒤는 CHF 25~35 수준.",
        "returnPhotos": [],
        "photos": [
          {
            "spot": "qa_c6_d2_0",
            "at": [
              7.9717,
              46.5474
            ],
            "cap": "아이거 익스프레스",
            "desc": "정상을 향하는 케이블카그린델발트 터미널에서 융프라우요흐로 오르기 위해 탑승하는 최신식 붉은 케이블카입니다."
          },
          {
            "spot": "qa_c6_d2_1",
            "at": [
              7.9717,
              46.54843923048455
            ],
            "cap": "알레치 빙하",
            "desc": "유럽 최장의 빙하스핑크스 전망대에서 발아래로 끝없이 펼쳐지는 22km 길이의 장엄한 알레치 빙하의 전경입니다."
          }
        ]
      },
      {
        "day": 3,
        "cityKo": "베른",
        "cityEn": "Bern",
        "coords": [
          7.4474,
          46.948
        ],
        "moveType": "ground",
        "isTrip": true,
        "baseCity": "인터라켄",
        "baseCityEn": "Interlaken",
        "baseCoords": [
          7.8632,
          46.6863
        ],
        "transport": {
          "mode": "train",
          "label": "인터라켄 오스트 → 슈피츠 → 베른 · IC · 50분"
        },
        "via": [
          [
            7.655,
            46.6957
          ]
        ],
        "title": "스위스 수도 베른 · 유네스코 구시가지",
        "am": "08:30 인터라켄 오스트 출발, IC로 슈피츠를 경유해 50분이면 베른 중앙역. 역을 나서면 중세 아케이드(Lauben)가 6km 이어진다. 1191년에 세워진 치트글로게(Zytglogge) 천문시계탑으로 먼저 향한다. 매 정각 4분 전부터 인형이 움직이는 퍼포먼스가 시작된다.",
        "pm": "11:00 베른 장미 정원(Rosengarten)에서 아레 강이 구불구불 감싸는 구시가지 전체 파노라마를 내려다본다. 연방의사당(Bundeshaus) 정면 광장에서 스위스 직접민주주의의 무게를 느끼고, 뒤쪽 분데스테라세(Bundesterrasse)에서 알프스 전망과 아레 강 계곡을 조망한다.",
        "ev": "13:00 구시가지 아케이드 아래 레스토랑에서 베르너 플라테(Berner Platte — 훈제 돼지고기·소시지·베이컨 모둠, CHF 30~40). 14:30 뮌스터(Berner Münster, 100m 첨탑)와 뵈렌파르크(Bärenpark)에서 살아있는 베른의 상징 곰을 만난다. 17:00 기차로 귀환. (야간 추천: 인터라켄으로 돌아와 툰 호수나 브리엔츠 호수 주변을 가볍게 산책합니다. 스위스 뢰스티(Rösti) 맛집에서 바삭한 감자전 요리와 함께 융프라우의 웅장한 밤하늘 별을 감상해봅니다.)",
        "returnEv": "17:50 인터라켄 귀환. 내일은 심플론 터널을 지나 이탈리아로 넘어가는 날. 저녁은 호헤베크 인근 레스토랑에서 라클렛(CHF 28~35)과 지역 화이트 와인으로 스위스 마지막 밤을 즐긴다.",
        "tip": "치트글로게 정각 퍼포먼스는 11·12·14·15·16시, 정각 4분 전부터 시계탑 앞에서 대기 권장. 베른 구시가지 아케이드는 비가 와도 6km를 쾌적하게 걸을 수 있다. 뵈렌파르크 입장 무료.",
        "returnTip": "인터라켄→밀라노행 기차(SBB 앱에서 전날 밤 예약). 심플론 터널 구간 국제선은 사전 예약이 필수에 가깝다. 인터라켄 레스토랑 저녁 피크는 19~21시.",
        "photos": [
          {
            "spot": "qa_c6_d3_0",
            "at": [
              7.448,
              46.948
            ],
            "cap": "치트글로게",
            "desc": "베른의 천문시계탑중세 아케이드가 이어지는 베른 구시가지 한가운데 서 있는, 매 정각 인형 퍼포먼스가 열리는 시계탑입니다."
          },
          {
            "spot": "qa_c6_d3_1",
            "at": [
              7.448,
              46.949039230484544
            ],
            "cap": "장미 정원",
            "desc": "베른 구시가지 파노라마언덕 위 정원에서 아레 강이 물방울 모양으로 굽이쳐 감싸고 있는 베른 구시가지 전체를 내려다본 전경입니다."
          }
        ],
        "returnPhotos": [
          {
            "spot": "qa_c6_d3_return_0",
            "at": [
              7.8591,
              46.6825
            ],
            "cap": "라클렛 · 인터라켄 저녁",
            "desc": "반원형 치즈 덩어리를 열원에 녹여 삶은 감자·코르니숑·실버 어니언 위에 긁어 얹는 발레 주 전통 요리. CHF 28~35. 인터라켄 저녁의 라클렛은 체르마트로 이동하기 전날 밤을 따뜻하게 마무리해준다."
          },
          {
            "spot": "qa_c6_d3_return_1",
            "at": [
              7.8608,
              46.6829
            ],
            "cap": "알플러마그로넨 · 목동의 알프스 파스타",
            "desc": "마카로니·감자·크림·치즈를 한 냄비에 끓이고 카라멜라이즈한 양파와 사과소스를 곁들이는 알프스 목동 전통 요리. 스위스 전역의 산장(베르크가스트호프)에서 맛볼 수 있으며, 인터라켄 레스토랑에서도 쉽게 주문할 수 있다."
          }
        ]
      },
      {
        "day": 4,
        "cityKo": "피렌체",
        "cityEn": "Florence",
        "coords": [
          11.2558,
          43.7696
        ],
        "moveType": "ground",
        "isTrip": false,
        "transport": {
          "mode": "train",
          "label": "밀라노 → 피렌체 · Frecciarossa · 1시간 50분"
        },
        "via": [
          [
            11.339,
            44.494
          ]
        ],
        "before": [
          {
            "coords": [
              9.1882,
              45.4654
            ],
            "cityKo": "밀라노",
            "cityEn": "Milan",
            "transport": {
              "mode": "train",
              "label": "인터라켄 → 비스프 → 브리크 → 심플론 터널 → 도모도솔라 → 밀라노 · 약 3시간 30분"
            },
            "via": [
              [
                7.655,
                46.6957
              ],
              [
                7.9877,
                46.3144
              ],
              [
                8.2917,
                46.1114
              ],
              [
                8.5556,
                45.9256
              ]
            ],
            "title": "밀라노 경유 · 두오모와 갈레리아",
            "am": "08:00 인터라켄 오스트 출발. 비스프에서 브리크로, 브리크에서 19.8km의 심플론 터널을 통과해 이탈리아 도모도솔라로 국경을 건넌다. 기차로 나라가 바뀌는 순간이다. 11:30 밀라노 중앙역 도착.",
            "pm": "지하철 M3으로 두오모역까지 7분. 서기 1386년 착공해 600년 걸린 밀라노 두오모(첨탑 135개)와 비토리오 에마누엘레 2세 갈레리아(1877년, 유럽 최초 쇼핑몰)를 2시간 둘러본다. 갈레리아 모자이크 황소 발굽을 발뒤꿈치로 밟으면 행운이 온다. 점심은 갈레리아 주변 카페에서.",
            "ev": "14:30 밀라노 중앙역에서 Frecciarossa 탑승. 피렌체를 향해 1시간 50분.",
            "tip": "밀라노 중앙역에서 두오모까지 지하철 M3 옐로 라인으로 7분(€2.20). 짐은 밀라노 중앙역 짐 보관소(Deposito Bagagli)에 맡기면 편리. 갈레리아 내 레스토랑보다 인근 골목 트라토리아가 가격 합리적.",
            "photos": [
              {
                "spot": "qa_c6_d4_before_0_nested_0_0",
                "at": [
                  9.1919,
                  45.4654
                ],
                "cap": "밀라노 두오모 · 서기 1386년 착공",
                "desc": "서기 1386년 착공해 완공까지 600년이 걸린 밀라노 대성당. 세계 최대 고딕 성당 중 하나로 135개의 첨탑과 3,400개 이상의 조각상으로 장식되어 있다. 옥상 테라스에서 맑은 날 알프스까지 조망된다."
              },
              {
                "spot": "qa_c6_d4_before_0_nested_0_1",
                "at": [
                  9.1896,
                  45.4659
                ],
                "cap": "갈레리아 · 1877년 유럽 최초 쇼핑몰",
                "desc": "비토리오 에마누엘레 2세의 이름을 딴 유럽 최초의 쇼핑몰. 철제 아치와 유리 돔이 어우러진 화려한 건축미가 일품이다. 바닥 모자이크 황소의 생식기를 뒤꿈치로 밟으면 행운이 온다는 전통이 있다."
              }
            ]
          }
        ],
        "title": "피렌체 도착 · 르네상스의 심장",
        "am": "인터라켄에서 아침 출발, 심플론 터널을 지나 밀라노를 경유해 피렌체로.",
        "pm": "16:20 피렌체 산타마리아 노벨라(SMN)역 도착. 호텔 체크인 후 아르노 강변으로 나가 폰테 베키오의 황금빛 석양을 감상한다. 1345년 재건된 이 다리는 독일군이 철수하면서도 파괴하지 않은 유일한 피렌체 다리다.",
        "ev": "첫 저녁은 산 로렌초 시장 인근 Trattoria Mario(1953년, 토스카나 전통 식당)에서 비스테카 알라 피오렌티나(피렌체 스테이크, 최소 700g, 키아니나 소)로. 두오모 야경을 감상하며 첫 밤을 마무리한다.",
        "tip": "피렌체 SMN역에서 도심까지 도보 10분. Trattoria Mario는 현금만 받으며 줄 서기 필수(오픈 30분 전부터). 피렌체 스테이크는 미디엄 레어(al sangue)가 원칙이다.",
        "photos": [
          {
            "spot": "qa_c6_d4_0",
            "at": [
              11.256400000000001,
              43.7696
            ],
            "cap": "심플론 터널 열차",
            "desc": "스위스에서 이탈리아로알프스산맥의 긴 터널을 관통하여 스위스에서 이탈리아로 향하는 기차 여정입니다."
          },
          {
            "spot": "qa_c6_d4_1",
            "at": [
              11.256400000000001,
              43.77063923048454
            ],
            "cap": "폰테 베키오",
            "desc": "황금빛 석양과 오래된 다리피렌체 아르노 강 위에 세워진 상점들이 늘어선 낡고 로맨틱한 중세 다리 너머로 지는 석양입니다."
          }
        ]
      },
      {
        "day": 5,
        "cityKo": "피사",
        "cityEn": "Pisa",
        "coords": [
          10.3966,
          43.7228
        ],
        "moveType": "ground",
        "isTrip": true,
        "baseCity": "피렌체",
        "baseCityEn": "Florence",
        "baseCoords": [
          11.2558,
          43.7696
        ],
        "transport": {
          "mode": "train",
          "label": "피렌체 SMN → 피사 중앙역 · Regionale · 1시간"
        },
        "via": [
          [
            10.9435,
            43.7174
          ]
        ],
        "title": "기적의 광장과 르네상스 예술",
        "am": "08:30 피렌체 출발, 기차로 1시간. 09:50 도보로 기적의 광장(Campo dei Miracoli) 도착. 하얀 대리석의 피사 대성당, 세례당, 사탑, 캄포산토가 푸른 잔디밭 위에 나란히 서 있다. 사탑 등반(예약 시)으로 56m에서 피사 시내와 리구리아해를 조망한다.",
        "pm": "12:30 피사 시내에서 점심. 14:10 기차로 피렌체 귀환. 15:30 아카데미아 갤러리에서 미켈란젤로의 다비드상 원작(5.17m)을 마주한다. 이후 두오모 광장의 세례당 황금 문(기베르티의 천국의 문)과 조토의 종탑을 감상한다.",
        "ev": "우피치 미술관은 마감 전 1시간(16:00 입장 목표, 예약 필수)에 핵심 갤러리만 빠르게 관람하거나, 내일 아침 일찍 일어나 두오모 광장 산책으로 대체해도 좋다. 저녁은 올트라르노 지구 트라토리아에서. (야간 추천: 피렌체 두오모 광장의 야경을 보고, 미켈란젤로 언덕에 올라 피렌체 시내 전체의 로맨틱한 일몰과 불빛을 감상합니다. 저녁엔 묵직한 티본 스테이크(Bistecca alla Fiorentina)와 키안티(Chianti) 와인을 추천합니다.)",
        "returnEv": "저녁은 올트라르노 지구 트라토리아에서 리볼리타(토스카나 콩 수프)나 파파르델레 알 친기알레(멧돼지 파스타)로. 피렌체 최후의 밤은 젤라토와 함께.",
        "tip": "피사 사탑 등반 온라인 예약 필수(€18, 시간당 인원 제한). 아카데미아 갤러리도 예약 권장(€20). 피렌체 카드(72h €85)로 주요 박물관 통합 이용 가능. 피사 역에서 기적의 광장까지 도보 25분 또는 버스 LAM Rossa 이용.",
        "returnTip": "올트라르노 지구 트라토리아는 피티 궁전 주변 골목에 합리적인 가게들이 많다. 저녁 7~8시 피크를 피하거나 미리 예약해두자.",
        "returnPhotos": [
          {
            "spot": "qa_c6_d5_return_0",
            "at": [
              11.2488,
              43.7666
            ],
            "cap": "리볼리타 · 올트라르노 트라토리아",
            "desc": "\"다시 끓인다\"는 뜻의 토스카나 콩 수프. 카넬리니 콩, 검은 케일, 딱딱해진 빵을 이틀에 걸쳐 끓이는 농민 요리로 올트라르노 트라토리아에서 €8~12. 피렌체 마지막 밤의 따뜻한 시작."
          },
          {
            "spot": "qa_c6_d5_return_1",
            "at": [
              11.2501,
              43.7671
            ],
            "cap": "파파르델레 알 친기알레 · 멧돼지 파스타",
            "desc": "토스카나 숲에서 잡은 멧돼지를 레드 와인과 허브에 오래 끓인 라구 소스. 넓고 납작한 파파르델레 면과 조합하면 강렬하고 묵직한 토스카나의 맛이 완성된다. 리볼리타와 함께 올트라르노의 저녁을 대표하는 메뉴다."
          }
        ],
        "photos": [
          {
            "spot": "qa_c6_d5_0",
            "at": [
              10.3972,
              43.7228
            ],
            "cap": "기적의 광장",
            "desc": "대성당과 사탑하얀 대리석으로 지어진 피사 대성당과 세례당, 그리고 기울어진 사탑이 나란히 서 있는 푸른 잔디밭 광장입니다."
          },
          {
            "spot": "qa_c6_d5_1",
            "at": [
              10.3972,
              43.72383923048454
            ],
            "cap": "아카데미아 갤러리",
            "desc": "다비드상 원작5m가 넘는 거대한 대리석 조각으로, 완벽한 해부학적 비례를 자랑하는 미켈란젤로의 걸작 다비드상입니다."
          }
        ]
      },
      {
        "day": 6,
        "cityKo": "로마",
        "cityEn": "Rome",
        "coords": [
          12.4964,
          41.9028
        ],
        "moveType": "ground",
        "isTrip": false,
        "transport": {
          "mode": "train",
          "label": "피렌체 SMN → 로마 테르미니 · Frecciarossa · 1시간 30분"
        },
        "via": [
          [
            11.88,
            43.4638
          ],
          [
            12.1071,
            42.7179
          ]
        ],
        "title": "영원한 도시 로마 입성",
        "am": "10:00 두오모 광장과 산타마리아 노벨라 성당을 마지막으로 거닐며 피렌체와 작별한다. 12:00 Frecciarossa 탑승, 피렌체 산타마리아 노벨라역 출발. 로마까지 1시간 30분.",
        "pm": "13:30 로마 테르미니역 도착. 짐을 호텔에 맡기고 콜로세움으로. 2천 년 전 5만 명을 수용한 플라비우스 원형 경기장과 로마 포럼·팔라티노 언덕 통합권으로 2시간을 걷는다.",
        "ev": "17:00 트라스테베레 지구로 이동. 오렌지빛 좁은 골목의 현지인 트라토리아 Da Enzo al 29에서 카르보나라(과이알레·페코리노·후추만으로 만든 정통파)와 아마트리차나로 로마 첫 저녁을. 트레비 분수 야경으로 마무리.",
        "tip": "콜로세움+로마 포럼+팔라티노 언덕 통합권 €18, 온라인 사전 예약 강력 권장. Da Enzo al 29는 예약 없이 대기 30분 이상이 기본. 트레비 분수는 밤에 훨씬 덜 붐비고 조명이 아름답다.",
        "photos": [
          {
            "spot": "qa_c6_d6_0",
            "at": [
              12.497,
              41.9028
            ],
            "cap": "프레차로사",
            "desc": "로마로 향하는 고속열차피렌체 일정을 마치고 로마로 빠르게 이동하기 위해 탑승하는 이탈리아의 붉은 고속열차입니다."
          },
          {
            "spot": "qa_c6_d6_1",
            "at": [
              12.497,
              41.90383923048454
            ],
            "cap": "콜로세움",
            "desc": "고대 로마의 웅장한 투기장2천 년 전 5만 명의 관중을 수용했던 고대 로마 최대의 건축물이자 웅장한 원형 경기장의 외관입니다."
          }
        ]
      },
      {
        "day": 7,
        "cityKo": "로마",
        "cityEn": "Rome",
        "coords": [
          12.4964,
          41.9028
        ],
        "moveType": "stay",
        "isTrip": false,
        "transport": {
          "mode": "walk",
          "label": "로마 시내 관광 · 도보 + 지하철"
        },
        "title": "바티칸에서 판테온까지, 로마의 정수",
        "am": "09:00 바티칸 박물관 입장(예약 필수). 고대 이집트 유물부터 라파엘로의 방, 미켈란젤로의 시스티나 예배당 천장화까지. 입장에서 시스티나까지 약 2.5시간. 이후 성 베드로 대성당으로 이동.",
        "pm": "13:00 프라티 지구 트라토리아에서 점심(수플리·카르초피 알라 주다). 14:00 판테온(서기 125년경). 43.3m 돔 정중앙 오쿨루스(원형 개구부)에서 쏟아지는 빛이 장관이다. 나보나 광장, 스페인 광장을 걸으며 로마의 일상을 만끽한다.",
        "ev": "18:30 마지막 이탈리아 저녁. 캄포 데 피오리 광장 근처 오스테리아에서 카치오 에 페페와 리몬첼로로 마무리. 짐을 패킹하고 내일 21:15 출발에 대비해 일찍 쉰다.",
        "tip": "바티칸 박물관은 온라인 예약(€18+예약비 €4) 없이는 2~3시간 대기. 성 베드로 대성당은 무료지만 반바지·민소매 입장 불가. 판테온은 2023년부터 입장료 €5 징수.",
        "photos": [
          {
            "spot": "qa_c6_d7_0",
            "at": [
              12.497,
              41.9028
            ],
            "cap": "바티칸 박물관",
            "desc": "라파엘로의 방라파엘로의 명작 '아테네 학당'이 벽면 전체를 장식하고 있는 바티칸 박물관의 웅장한 홀입니다."
          },
          {
            "spot": "qa_c6_d7_1",
            "at": [
              12.497,
              41.90383923048454
            ],
            "cap": "시스티나 예배당",
            "desc": "천지창조와 최후의 심판미켈란젤로가 수년간 천장과 벽면에 홀로 그려낸, 인류 예술사상 가장 위대한 프레스코화입니다."
          }
        ]
      },
      {
        "day": 8,
        "cityKo": "로마",
        "cityEn": "Rome",
        "coords": [
          12.4964,
          41.9028
        ],
        "moveType": "flight",
        "isTrip": false,
        "transport": {
          "mode": "plane",
          "label": "로마 피우미치노 → 인천 · TW 406 티웨이항공 · 21:15 출발 · 다음날 16:10 도착"
        },
        "title": "로마에서의 마지막 아침, 귀국 비행",
        "am": "09:00 천천히 조식 후 체크아웃. 짐은 호텔에 맡기고 못 가본 곳 하나를 마지막으로 방문. 보르게세 갤러리(예약 시), 아피아 가도 산책, 또는 테르미니역 주변 나치오날레 거리 탐방.",
        "pm": "오후는 캄포 데 피오리 광장과 나보나 광장 주변에서 기념품 쇼핑. 17:00 호텔에서 짐 픽업. 17:30 Leonardo Express 탑승(테르미니 24번 승강장 → 피우미치노, 32분, €14).",
        "ev": "18:05 피우미치노 공항(FCO) 도착(출발 3시간 전). 수속 후 면세점에서 이탈리아 초콜릿, 트뤼플 소금, 리몬첼로 마지막 쇼핑. 21:15 TW 406 탑승. 융프라우의 설원에서 피렌체의 르네상스, 로마의 돌길까지 걸어온 7박 8일이 비행기 창 너머로 멀어진다.",
        "tip": "Leonardo Express 30분 간격 운행, 탑승 전 반드시 개찰(미개찰 시 벌금 €50~). 티웨이항공 기내 수화물 15kg(이코노미 기본). 출발 전 마지막 에스프레소는 공항 바(Bar) 서서 마시기 — 앉으면 2배 가격.",
        "photos": [
          {
            "spot": "qa_c6_d8_0",
            "at": [
              12.497,
              41.9028
            ],
            "cap": "보르게세 갤러리",
            "desc": "아름다운 르네상스 별장베르니니의 생동감 넘치는 대리석 조각과 카라바조의 그림들을 소장한 아름다운 저택 미술관입니다."
          },
          {
            "spot": "qa_c6_d8_1",
            "at": [
              12.497,
              41.90383923048454
            ],
            "cap": "나보나 광장",
            "desc": "분수와 길거리 예술가타원형 광장 한가운데 세워진 분수 주변으로 기념품을 구경하고 거리 화가들을 만나는 평화로운 풍경입니다."
          }
        ]
      }
    ],
    "color": "#ea580c"
  }
];

if (typeof module !== 'undefined') module.exports = { START_LOCATION, COURSES };
