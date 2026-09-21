/* Course 11 is intentionally independent of TravelMap and the Europe panel. */
window.TokyoTrip = (() => {
  'use strict';
  const trip = TOKYO;
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // sheet: 'peek' (50:50), 'detail' (current stop, height fits its content), 'place' (full card, big photo).
  const state = { day:0, step:0, sheet:'peek', choices:{asakusa:false,tower:false,bus:false}, breakfast:'yoyogi' };
  let root, map, ready=false, geometry={}, routeError='', markers=[], onClose, observer, cameraTimer, requestController;
  // Restaurant coordinates are looked up at runtime and shown transiently on the Mapbox map,
  // never stored (Mapbox Search terms). A miss just leaves that restaurant off the map, not faked.
  const MEAL_GEO={}; const mealInflight=new Set(); let mealGeoRun=0, mealPinCount=0, spotPinCount=0;
  // Landmark shopping spots (Sanrio, Tamagotchi, every Donkihote on the walk, the hotel konbini …)
  // shown as text labels. Same runtime, no-store geocoding as meals.
  const SPOT_GEO={}; const spotInflight=new Set(); let spotGeoRun=0;
  let poiMarkers=[]; // meal + spot text pins, decluttered together (side/current pins excluded).
  const visibleSteps = (day=state.day) => trip.days[day].steps.filter(s => (!s.branch || state.choices[s.branch]) && (!s.without || !state.choices[s.without]) && (!s.breakfast || s.breakfast===state.breakfast));
  const current = () => visibleSteps()[state.step];
  const placeId = s => s.id==='shinjuku-breakfast' && state.breakfast==='shinjuku' ? 'shinjukuShop' : s.place;
  const photoFor = s => {
    const key=trip.photos[s.photo];
    return typeof key==='object' ? key : (key && typeof PHOTOS!=='undefined' ? PHOTOS[key] : null);
  };
  const mapsLink = name => 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name);
  const link = (url,label,cls='tk-source') => `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;

  function open(options={}) {
    if(root) close();
    onClose=options.onClose;
    geometry={};routeError='';
    Object.assign(state,{day:0,step:0,sheet:'peek',choices:{asakusa:false,tower:false,bus:false},breakfast:'yoyogi'});
    root=document.createElement('section'); root.className='tokyo-trip'; root.setAttribute('aria-label','도쿄 4박 5일 여행');
    root.innerHTML=`<header class="tk-header"><div class="tk-title"><h1>도쿄 4박 5일</h1><small>2027. 1. 25 — 29 · 계획안</small>${options.shared?'':'<button class="tk-close" data-action="close">코스 목록</button>'}</div><nav class="tk-tabs" role="tablist" aria-label="여행 날짜">${trip.days.map((d,i)=>`<button role="tab" id="tk-tab-${i}" aria-controls="tk-stage" data-day="${i}"><strong>Day ${i+1}</strong><small>${d.date} ${d.weekday}</small></button>`).join('')}</nav></header>
      <div class="tk-stage" id="tk-stage" role="tabpanel"><div class="tk-map-pane"><div class="tk-map" id="tokyo-map"></div><div class="tk-map-caption"><b>현재 구간</b> · 지난 길은 회색, 다음 길은 흐리게</div><div class="tk-map-status" role="status">지도를 준비하고 있어요.</div></div>
      <section class="tk-sheet" aria-label="일정 카드"><button class="tk-grip" aria-label="위로 쓸어 현재 일정 자세히, 아래로 쓸어 지도 보기. 키보드 위·아래 방향키로도 조절" aria-expanded="false"></button><div class="tk-scroll"><article class="tk-detail"></article></div><footer class="tk-footer"><button data-action="prev" aria-label="이전 일정">← 이전</button><span class="tk-count"></span><button class="tk-next" data-action="next">다음 →</button></footer></section></div><div class="tk-screenreader" aria-live="polite" id="tk-live"></div>`;
    document.body.append(root); document.body.classList.add('tokyo-open');
    root.addEventListener('click',onClick);
    root.querySelector('.tk-tabs').addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault(); const day=e.key==='Home'?0:e.key==='End'?4:Math.max(0,Math.min(4,state.day+(e.key==='ArrowRight'?1:-1)));
      select(day,0); root.querySelector(`[data-day="${day}"]`).focus();
    });
    bindGestures(); render(); initializeMap(); loadRoutes();
  }
  function close() {
    clearTimeout(cameraTimer); requestController?.abort(); observer?.disconnect();
    markers.forEach(m=>m.remove());markers=[];map?.remove();map=null;ready=false;
    root?.remove();root=null;document.body.classList.remove('tokyo-open');
  }
  function select(day,index,sheet='peek') {
    state.day=Math.max(0,Math.min(4,day));state.step=Math.max(0,Math.min(visibleSteps().length-1,index));state.sheet=sheet;
    render(); renderMap();
  }
  function next(delta) {
    const steps=visibleSteps(),target=state.step+delta;
    if(target<0 && state.day>0)select(state.day-1,visibleSteps(state.day-1).length-1);
    else if(target>=steps.length && state.day<4)select(state.day+1,0);
    else select(state.day,target);
  }
  // Single sheet state machine. 'peek' = 50:50, 'detail' = current stop grown to fit its own
  // content (never full screen), 'place' = full photo card. Tabs, next, swipe, pins all route here.
  function setSheet(mode) {
    state.sheet=mode;
    const sheet=root.querySelector('.tk-sheet'),scroll=root.querySelector('.tk-scroll'),
      grip=root.querySelector('.tk-grip'),footer=root.querySelector('.tk-footer');
    sheet.classList.toggle('mode-peek',mode==='peek');
    sheet.classList.toggle('mode-detail',mode==='detail');
    sheet.classList.toggle('mode-place',mode==='place');
    sheet.classList.toggle('is-full',mode==='place');
    grip.setAttribute('aria-expanded',String(mode!=='peek'));
    scroll.scrollTop=0;
    // Only on a phone does 'detail' get an explicit fit-to-content height; the desktop side
    // panel is always full and CSS governs peek/place. Height in px so the change animates.
    if(mode==='detail' && matchMedia('(max-width:799px)').matches) {
      const stage=root.querySelector('.tk-stage').clientHeight;
      const need=grip.offsetHeight+footer.offsetHeight+scroll.scrollHeight;
      sheet.style.height=Math.round(Math.max(stage*0.5,Math.min(need,stage*0.9)))+'px';
    } else {
      sheet.style.height='';
    }
  }
  function onClick(e) {
    const button=e.target.closest('button');if(!button)return;
    if(button.dataset.day!==undefined){select(Number(button.dataset.day),0);return;}
    if(button.dataset.mealcat!==undefined){
      const cat=button.dataset.mealcat;
      root.querySelectorAll('.tk-meal-filter [data-mealcat]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mealcat===cat)));
      root.querySelectorAll('.tk-meals-list .tk-restaurant').forEach(a=>{a.style.display=(cat==='all'||a.dataset.cat===cat)?'':'none';});
      return;
    }
    if(button.dataset.leg){focusLeg(button.dataset.leg);return;}
    if(button.dataset.breakfast){state.breakfast=button.dataset.breakfast;render();renderMap();return;}
    if(button.dataset.choice){state.choices[button.dataset.choice]=button.dataset.value==='true';render();renderMap();return;}
    if(button.dataset.action==='next')next(1);
    if(button.dataset.action==='prev')next(-1);
    if(button.dataset.action==='close'){const callback=onClose;close();callback?.();}
    if(button.dataset.action==='retry')loadRoutes();
  }
  // Raising/lowering the card is the GRIP's job only; the card body scrolls on its own, so a
  // content scroll never gets hijacked into an expand and vice versa.
  function bindGestures() {
    const grip=root.querySelector('.tk-grip');
    let pointerY=null,touchY=null;
    grip.addEventListener('pointerdown',e=>{pointerY=e.clientY;try{grip.setPointerCapture(e.pointerId);}catch(_){}});
    grip.addEventListener('pointerup',e=>{if(pointerY!==null && Math.abs(e.clientY-pointerY)>22)setSheet(e.clientY<pointerY?'detail':'peek');pointerY=null;});
    grip.addEventListener('pointercancel',()=>{pointerY=null;});
    grip.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();setSheet(e.key==='ArrowUp'?'detail':'peek');}});
    // Touch fallback for environments that do not synthesise pointer events on the grip. Tracks the
    // latest move position, since a touchend may carry no coordinates.
    let lastY=null;
    grip.addEventListener('touchstart',e=>{touchY=lastY=e.touches[0].clientY;},{passive:true});
    grip.addEventListener('touchmove',e=>{if(e.touches[0])lastY=e.touches[0].clientY;},{passive:true});
    grip.addEventListener('touchend',()=>{if(touchY!==null&&lastY!==null&&Math.abs(lastY-touchY)>22)setSheet(lastY<touchY?'detail':'peek');touchY=lastY=null;},{passive:true});
    grip.addEventListener('touchcancel',()=>{touchY=lastY=null;},{passive:true});
  }
  function render() {
    const s=current(),steps=visibleSteps();
    root.dataset.day=String(state.day+1);root.dataset.step=s.id;
    root.querySelector('#tk-stage').setAttribute('aria-labelledby',`tk-tab-${state.day}`);
    root.querySelectorAll('[data-day]').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===state.day));b.tabIndex=i===state.day?0:-1;});
    root.querySelector('.tk-detail').innerHTML=detail(s);
    root.querySelector('[data-action=prev]').disabled=state.day===0&&state.step===0;
    const end=state.day===4&&state.step===steps.length-1;
    root.querySelector('[data-action=next]').disabled=end;
    root.querySelector('[data-action=next]').textContent=end?'마지막 일정':'다음 →';
    root.querySelector('.tk-count').textContent=`${state.step+1} / ${steps.length}`;
    root.querySelector('#tk-live').textContent=`Day ${state.day+1}, ${s.title}`;
    setSheet(state.sheet);
    root.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{const figure=img.closest('figure');if(figure)figure.remove();else img.remove();},{once:true}));
  }
  function detail(s) {
    const p=trip.places[placeId(s)],photo=photoFor(s);
    let out=`<div class="tk-eyebrow">${esc(s.time)}<span>Day ${state.day+1}</span></div><h2>${esc(s.title)}</h2><p class="tk-description">${esc(s.detail)}</p>`;
    if(s.reservation)out+=`<aside class="tk-reservation"><strong>미리 예약할 것 · 시부야 스카이</strong><span class="tk-slot">16:00 입장</span><p>16:00–16:30 입장권 선택<br>밝은 하늘 → 17:03 일몰 → 야경</p><small>${esc(s.reservation.release)}<br>2027년 판매 정책은 예약 직전에 다시 확인 · 아직 예약 전</small></aside>`;
    if(photo)out+=`<figure class="tk-hero"><img src="${esc(photo.url)}" alt="${esc(photo.caption||trip.places[s.photoPlace]?.name||p.name)}" decoding="async"><figcaption>${link(photo.source||photo.url,photo.credit||'사진 출처','')}</figcaption></figure>`;
    if(s.legs?.length)out+=`<div class="tk-route" aria-label="이동 안내">${s.legs.map(id=>legHtml(id)).join('')}</div>`;
    if(s.highlights||s.facts)out+=`<ul class="tk-points">${[...(s.highlights||[]),...(s.facts||[])].map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
    if(s.choice)out+=`<div class="tk-choices"><button data-choice="${s.choice}" data-value="true" aria-pressed="${state.choices[s.choice]}">${esc(s.choiceLabel)}</button><button data-choice="${s.choice}" data-value="false" aria-pressed="${!state.choices[s.choice]}">${esc(s.skipLabel)}</button></div>`;
    if(s.kind==='breakfastChoice')out+=`<div class="tk-choices"><button data-breakfast="yoyogi" aria-pressed="${state.breakfast==='yoyogi'}">요요기에서 아침 · 탄보 등</button><button data-breakfast="shinjuku" aria-pressed="${state.breakfast==='shinjuku'}">신주쿠에서 아침 · 바로 쇼핑</button></div>`;
    if(s.meal)out+=mealHtml(s);
    out+=link(mapsLink(p.name+' 東京'),'Google 지도에서 장소 보기');
    if(s.source||p.source)out+=link(s.source||p.source,'공식 안내');
    return out;
  }
  function legHtml(id) {
    const l=trip.legs[id],line=trip.lines[l.line],from=trip.places[l.from],to=trip.places[l.to];
    return `<section class="tk-leg" style="--leg-color:${line?.color||'#8a978d'}"><div class="tk-leg-heading"><button data-leg="${id}" aria-label="${esc(from.name+'에서 '+to.name+'까지 지도 보기')}">${line?`<span class="tk-badge">${line.badge}</span>${line.name}`:l.mode==='indoor'?'역 안 이동':'걸어서 이동'}</button><time>${esc(l.duration)}</time></div><p><strong>${esc(from.name)}</strong> → ${esc(to.name)}</p>${l.direction?`<p class="tk-direction">${esc(l.direction)}</p>`:''}${l.note?`<p>${esc(l.note)}</p>`:''}${l.mode==='indoor'?'<p>역 안에서는 안내 표지를 따라요. 복잡한 통로는 역 안내도를 함께 확인해요.</p>':''}${l.stops?`<details><summary>경유역 보기</summary><p>${esc(l.stops.join(' → '))}</p></details>`:''}${l.source?link(l.source,'출구·공식 안내','tk-small-link'):''}</section>`;
  }
  // Category order for grouping/sorting; map pin indices follow this same order.
  const MEAL_CATS=['일식','가정식','고기','회','양식','기타'];
  function mealItems(s) {
    const catalog=typeof TOKYO_MEALS!=='undefined'?TOKYO_MEALS:{};
    if(!s.meal)return [];
    return [...(catalog[s.id]||catalog[s.meal]||[])].sort((a,b)=>
      (MEAL_CATS.indexOf(a.cat)-MEAL_CATS.indexOf(b.cat)) || ((b.rating||0)-(a.rating||0)));
  }
  function mealHtml(s) {
    const items=mealItems(s);
    const present=MEAL_CATS.filter(c=>items.some(r=>r.cat===c));
    // Category buttons: tap one to show only that food type (for when nothing in particular appeals).
    const filter=`<div class="tk-meal-filter" role="tablist" aria-label="식당 분류 선택">`
      +`<button data-mealcat="all" aria-pressed="true">전체 ${items.length}</button>`
      +present.map(c=>`<button data-mealcat="${c}" aria-pressed="false">${c} ${items.filter(r=>r.cat===c).length}</button>`).join('')
      +`</div>`;
    const cards=items.map((r,i)=>`<article class="tk-restaurant" data-cat="${esc(r.cat||'기타')}" data-rest="${i}">${r.photo?`<img src="${esc(r.photo)}" alt="${esc(r.name)}" loading="lazy">`:''}<h3>${esc(r.name)}</h3><p>${esc(r.food)} · ${esc(r.area)} · ${esc(r.budget)}</p><p class="${r.reservation==='required'?'tk-reservation-required':''}">${esc(r.reservation==='required'?'예약 필수':r.reservation==='recommended'?'예약 추천 · 가능 여부 확인':r.reservation==='walkin'?'당일 방문 후보 · 대기 가능':'예약 조건 확인')}</p>${r.note?`<p>${esc(r.note)}</p>`:''}${r.rating?`<small>${link(r.ratingSource, 'Google '+r.rating+' · '+r.checkedAt+' 자료 확인', '')}</small>`:''}<nav>${link(mapsLink(r.query||r.name+' 東京'),'평점·사진 보기','')}${r.source?link(r.source,'공식 안내',''):''}</nav></article>`).join('');
    return `<section class="tk-meals"><div class="tk-meals-head"><strong>근처 식사 후보 ${items.length}곳</strong><p>1인 3,000엔 이내 메뉴 위주 · 예산은 예상<br>평점·영업·예약은 Google 지도와 공식 안내에서 확인해요.</p></div>${filter}<div class="tk-meals-list">${cards}</div></section>`;
  }
  // A pre-set r.coords (author-provided) is used as-is and needs no network. Otherwise: a 200 with no
  // feature is a real miss (cache null); 429/5xx get a short backoff retry; any leftover error stays
  // uncached so a later visit retries instead of permanently dropping the pin.
  async function geocodeForward(q,prox) {
    const url='https://api.mapbox.com/search/searchbox/v1/forward?'+new URLSearchParams({q,access_token:MAPBOX_TOKEN,country:'jp',limit:'1',language:'ja',proximity:prox.join(',')});
    for(let attempt=0;attempt<3;attempt++){
      const res=await fetch(url);
      if(res.ok){const j=await res.json();const f=(j.features||[])[0];return f?.geometry?.coordinates||null;}
      if(res.status!==429 && res.status<500)throw new Error('geocode '+res.status);
      await new Promise(w=>setTimeout(w,300*(attempt+1)*(attempt+1)));
    }
    throw new Error('geocode retry exhausted');
  }
  async function geocodeMeal(r,prox) {
    const q=r.query||r.name;
    if(Array.isArray(r.coords))return (MEAL_GEO[q]=r.coords);
    if(q in MEAL_GEO)return MEAL_GEO[q];
    return MEAL_GEO[q]=await geocodeForward(q,prox);
  }
  // A spot is a placeId string, or {name, place|coords|query}. Known coordinates need no network.
  const spotName = sp => typeof sp==='string' ? trip.places[sp]?.name : (sp.name || trip.places[sp.place]?.name);
  const spotCoords = sp => {
    if(typeof sp==='string')return trip.places[sp]?.coords||null;
    if(sp.place)return trip.places[sp.place]?.coords||null;
    if(Array.isArray(sp.coords))return sp.coords;
    return SPOT_GEO[sp.query];
  };
  function loadSpotPins(s) {
    const prox=trip.places[placeId(s)]?.coords||[139.70,35.68];
    const queue=(s.spots||[]).filter(sp=>typeof sp==='object'&&sp.query&&!sp.place&&!Array.isArray(sp.coords)&&!(sp.query in SPOT_GEO)&&!spotInflight.has(sp.query));
    if(!queue.length)return;
    const stamp=++spotGeoRun; let idx=0;
    const worker=async()=>{ while(idx<queue.length){
      const sp=queue[idx++]; spotInflight.add(sp.query);
      try{ SPOT_GEO[sp.query]=await geocodeForward(sp.query,prox); }catch(e){/* transient: retry later */}
      spotInflight.delete(sp.query);
    }};
    Promise.all([worker(),worker(),worker()]).then(()=>{ if(root&&ready&&stamp===spotGeoRun&&current()?.id===s.id)renderMap(); });
  }
  // Fetch unknown restaurant coordinates for the current meal stop, gently (3 at a time), then redraw once.
  function loadMealPins(s) {
    const items=mealItems(s); if(!items.length)return;
    const prox=trip.places[placeId(s)]?.coords||[139.70,35.68];
    const queue=items.filter(r=>{const q=r.query||r.name;return !Array.isArray(r.coords)&&!(q in MEAL_GEO)&&!mealInflight.has(q);});
    if(!queue.length)return;
    const stamp=++mealGeoRun; let idx=0;
    const worker=async()=>{ while(idx<queue.length){
      const r=queue[idx++],q=r.query||r.name; mealInflight.add(q);
      try{await geocodeMeal(r,prox);}catch(e){/* transient: leave uncached for a later retry */}
      mealInflight.delete(q);
    }};
    Promise.all([worker(),worker(),worker()]).then(()=>{ if(root&&ready&&stamp===mealGeoRun&&current()?.id===s.id)renderMap(); });
  }
  async function loadRoutes() {
    requestController?.abort(); const controller=new AbortController();requestController=controller;
    try {
      const response=await fetch('assets/tokyo/routes.json?v=6',{signal:controller.signal});
      if(!response.ok)throw new Error('route data');
      const payload=await response.json(); if(controller.signal.aborted||!root)return;
      for(const leg of Object.values(trip.legs)) {
        if(leg.mode!=='indoor' && !(payload.routes?.[leg.id]?.geometry?.coordinates?.length>=3))throw new Error('Incomplete route');
        if(leg.mode!=='indoor' && !payload.routes?.[leg.id])throw new Error('Missing route');
      }
      geometry=payload.routes;routeError='';renderMap();setStatus(ready?'':'지도를 준비하고 있어요.');
    } catch(error) {
      if(error.name!=='AbortError'&&root){routeError='이동선을 불러오지 못했어요. 일정 안내는 아래에서 볼 수 있어요. <button data-action="retry">다시 시도</button>';setStatus(routeError);}
    }
  }
  function setStatus(html){if(root)root.querySelector('.tk-map-status').innerHTML=html;}
  function initializeMap() {
    if(typeof mapboxgl==='undefined'){setStatus('지도를 불러오지 못했어요. 아래 일정과 Google 지도 링크를 이용해 주세요.');return;}
    try {
      mapboxgl.accessToken=MAPBOX_TOKEN;
      map=new mapboxgl.Map({container:root.querySelector('.tk-map'),style:'mapbox://styles/mapbox/light-v11',center:trip.places.narita.coords,zoom:13,attributionControl:false});
      map.addControl(new mapboxgl.AttributionControl({compact:true,customAttribution:'경로: © OpenStreetMap contributors · Mapbox'}),'bottom-right');
      map.on('load',()=>{
        ready=true;
        for(const id of ['settlement-label','settlement-subdivision-label','poi-label','transit-label']) {
          if(map.getLayer(id))map.setLayoutProperty(id,'text-field',['coalesce',['get','name_ko'],['get','name_ja'],['get','name']]);
        }
        map.addSource('tk-routes',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
        ['future','past','current'].forEach(status=>['rail','walk'].forEach(mode=>{
          map.addLayer({id:`tk-${status}-${mode}`,type:'line',source:'tk-routes',filter:['all',['==',['get','status'],status],['==',['get','mode'],mode]],layout:{'line-join':'round','line-cap':'round'},paint:{'line-color':status==='past'?'#9ca7a1':['get','color'],'line-width':mode==='rail'?5:4,'line-opacity':status==='current'?1:status==='past'?.65:.23,...(mode==='walk'?{'line-dasharray':[1,1.5]}:{})}});
        }));
        setStatus(routeError);renderMap();
      });
      map.on('moveend',()=>declutterPoi());
      map.on('error',e=>{if(!ready)setStatus('지도 연결을 확인해 주세요. 아래 일정은 계속 볼 수 있어요.');});
      observer=new ResizeObserver(()=>{if(map){map.resize();clearTimeout(cameraTimer);cameraTimer=setTimeout(()=>renderMap(),100);}});observer.observe(root.querySelector('.tk-map-pane'));
    }catch(error){setStatus('이 기기에서 지도를 열지 못했어요. 아래 일정과 Google 지도 링크를 이용해 주세요.');}
  }
  function routeFeatures() {
    return visibleSteps().flatMap((s,index)=>(s.legs||[]).flatMap(id=>{
      const route=geometry[id],l=trip.legs[id];if(!route)return [];
      return [{type:'Feature',id:`${s.id}-${id}`,geometry:route.geometry,properties:{id,mode:l.mode,color:trip.lines[l.line]?.color||'#657e71',status:index<state.step?'past':index===state.step?'current':'future'}}];
    }));
  }
  function camera(coords,maxZoom=15) {
    if(!ready||!coords.length)return;
    map.stop();
    const bounds=new mapboxgl.LngLatBounds();coords.forEach(p=>bounds.extend(p));
    map.fitBounds(bounds,{padding:{top:48,bottom:48,left:82,right:82},maxZoom,duration:reduced()?0:700,essential:false});
  }
  function focusLeg(id) {
    setSheet('peek');
    const l=trip.legs[id],route=geometry[id];
    camera(route?.geometry.coordinates||[trip.places[l.from].coords,trip.places[l.to].coords],16);
  }
  function press(el){el.classList.remove('is-pressed');void el.offsetWidth;el.classList.add('is-pressed');}
  function renderMap() {
    if(!ready||!root)return;
    const s=current(),features=routeFeatures(),steps=visibleSteps();
    map.getSource('tk-routes')?.setData({type:'FeatureCollection',features});
    markers.forEach(m=>m.remove());markers=[];
    const p=trip.places[placeId(s)],photo=photoFor(s);
    const pinCoords=trip.places[s.photoPlace]?.coords||p.coords;
    // Reserve the current spot so a neighbour sharing coordinates never hides it.
    const seen=new Set([pinCoords.join(',')]);
    // Neighbouring stops appear as restrained text pins; tapping jumps there and opens the card.
    const sidePin=idx=>{
      const st=steps[idx];if(!st)return;
      const pl=trip.places[placeId(st)],coords=trip.places[st.photoPlace]?.coords||pl.coords,key=coords.join(',');
      if(seen.has(key))return;seen.add(key);
      const label=trip.places[st.photoPlace]?.name||pl.name;
      const btn=document.createElement('button');btn.className='tk-pin tk-pin-side';
      btn.setAttribute('aria-label',(idx<state.step?'이전':'다음')+' 일정: '+label+' 확장 카드 보기');
      btn.innerHTML=`<span class="tk-pin-mini">${esc(label)}</span>`;
      btn.addEventListener('click',()=>{press(btn);select(state.day,idx,'place');});
      markers.push(new mapboxgl.Marker({element:btn}).setLngLat(coords).addTo(map));
    };
    sidePin(state.step-1);sidePin(state.step+1);
    // The current stop is the large, clear photo pin (text fallback on image error).
    const label=trip.places[s.photoPlace]?.name||p.name;
    const pin=document.createElement('button');pin.className='tk-pin tk-pin-cur';pin.setAttribute('aria-label',label+' · 현재 일정, 확장 카드 열기');
    pin.innerHTML=photo?`<span class="tk-pin-inner"><img src="${esc(photo.url)}" alt=""></span>`:`<span class="tk-pin-label">${esc(label)}</span>`;
    pin.querySelector('img')?.addEventListener('error',()=>{pin.innerHTML=`<span class="tk-pin-label">${esc(label)}</span>`;},{once:true});
    pin.addEventListener('click',()=>{press(pin);setSheet('place');});
    markers.push(new mapboxgl.Marker({element:pin}).setLngLat(pinCoords).addTo(map));
    const active=features.filter(f=>f.properties.status==='current');
    if(active.length){const dot=document.createElement('span');dot.className='tk-start-dot';markers.push(new mapboxgl.Marker({element:dot}).setLngLat(active[0].geometry.coordinates[0]).addTo(map));}
    // Where the current stop crosses an indoor leg (station interior, never drawn), mark the
    // access point so the gap between a rail line and the following walk reads as "inside the station".
    let pendingGap=false,lastEnd=null;
    for(const id of s.legs||[]) {
      const g=geometry[id];
      if(trip.legs[id].mode==='indoor' || !g){pendingGap=true;continue;}
      const c=g.geometry.coordinates;
      if(pendingGap && lastEnd){
        const mid=[(lastEnd[0]+c[0][0])/2,(lastEnd[1]+c[0][1])/2];
        const dot=document.createElement('span');dot.className='tk-access-dot';
        markers.push(new mapboxgl.Marker({element:dot}).setLngLat(mid).addTo(map));
      }
      pendingGap=false;lastEnd=c[c.length-1];
    }
    // Restaurant candidates as restrained text pins (a meal stop only). Coordinates arrive from a
    // runtime lookup; a restaurant still being fetched or not found simply has no pin yet.
    mealPinCount=0; spotPinCount=0; poiMarkers=[]; const poiCoords=[];
    if(s.meal) {
      mealItems(s).forEach((r,i)=>{
        const c=(Array.isArray(r.coords)&&r.coords)||MEAL_GEO[r.query||r.name]; if(!c)return; mealPinCount++; poiCoords.push(c);
        const btn=document.createElement('button');btn.className='tk-pin tk-pin-meal';
        btn.setAttribute('aria-label','식당: '+r.name+' 카드에서 보기');
        btn.innerHTML=`<span class="tk-pin-mini">${esc(r.name)}</span>`;
        btn.addEventListener('click',()=>{press(btn);setSheet('detail');const el=root.querySelector(`.tk-restaurant[data-rest="${i}"]`);if(el)root.querySelector('.tk-scroll').scrollTop=Math.max(0,el.offsetTop-12);});
        markers.push(new mapboxgl.Marker({element:btn}).setLngLat(c).addTo(map));
        poiMarkers.push({el:btn,priority:r.rating||0});
      });
      loadMealPins(s);
    }
    // Landmark shopping spots (Sanrio, Tamagotchi, Donkihote, the hotel konbini …) as text labels.
    if(s.spots?.length) {
      const seenSpot=new Set([pinCoords.join(',')]);
      s.spots.forEach(sp=>{
        const c=spotCoords(sp); if(!c)return; const key=c.join(','); if(seenSpot.has(key))return; seenSpot.add(key);
        spotPinCount++; poiCoords.push(c);
        const el=document.createElement('span'); el.className='tk-pin tk-pin-spot'; el.setAttribute('role','img'); el.setAttribute('aria-label','쇼핑 거점: '+spotName(sp));
        el.innerHTML=`<span class="tk-pin-mini">${esc(spotName(sp))}</span>`;
        markers.push(new mapboxgl.Marker({element:el}).setLngLat(c).addTo(map));
        poiMarkers.push({el,priority:100}); // landmarks outrank meals when decluttering
      });
      loadSpotPins(s);
    }
    // Camera widens to include NEARBY POIs (meals/spots) so they are on screen without a distant
    // outlier flattening the whole view; far ones stay pinned and are reached by panning.
    const near=poiCoords.filter(c=>Math.hypot((c[0]-pinCoords[0])*90600,(c[1]-pinCoords[1])*111200)<1300);
    const coords=active.flatMap(f=>f.geometry.coordinates);coords.push(p.coords,pinCoords,...near);
    camera(coords,s.legs?.some(id=>trip.legs[id].mode==='rail')?14.5:15.4);
    requestAnimationFrame(declutterPoi);
  }
  // Hide POI pins that would overlap, higher priority kept (landmarks > higher-rated meals); re-run on
  // map move/zoom so zooming in reveals suppressed ones. Stop/neighbour pins are never decluttered.
  function declutterPoi() {
    if(!map||!poiMarkers.length)return;
    const kept=[];
    [...poiMarkers].sort((a,b)=>b.priority-a.priority).forEach(m=>{
      m.el.style.display='';
      const box=m.el.getBoundingClientRect();
      if(!box.width)return;
      const clash=kept.some(k=>!(box.right<k.left-2||box.left>k.right+2||box.bottom<k.top-2||box.top>k.bottom+2));
      if(clash)m.el.style.display='none'; else kept.push(box);
    });
  }
  return {open,close,select,getState:()=>structuredClone({...state,expanded:state.sheet!=='peek',stepId:current()?.id,steps:visibleSteps().map(s=>s.id),routeCount:Object.keys(geometry).length,mealPins:mealPinCount,spotPins:spotPinCount,mapReady:ready})};
})();
