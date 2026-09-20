"""Fetch licensed OSM route geometry. Never synthesize straight-line routes."""
import json, urllib.request, urllib.parse, pathlib, sys, math, heapq, re, subprocess, concurrent.futures, time
sys.stdout.reconfigure(encoding='utf-8')

ROOT = pathlib.Path(__file__).resolve().parents[1]
CACHE = ROOT / 'assets' / 'tokyo' / 'source'
CACHE.mkdir(parents=True, exist_ok=True)

def overpass(query, filename):
    dest = CACHE / filename
    if dest.exists():
        return json.loads(dest.read_text(encoding='utf-8'))
    request = urllib.request.Request('https://overpass-api.de/api/interpreter',
        data=urllib.parse.urlencode({'data': query}).encode(),
        headers={'User-Agent': 'TokyoTripReference/1.0 (personal itinerary geometry audit)'})
    with urllib.request.urlopen(request, timeout=100) as response:
        data = json.load(response)
    dest.write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
    return data

def distance(a, b):
    return math.hypot((a[0]-b[0])*90600, (a[1]-b[1])*111200)

def rail_graph(relation):
    graph = {}
    for member in relation['members']:
        if member['type'] != 'way' or 'platform' in member.get('role', ''):
            continue
        points = [tuple(round(p[k], 7) for k in ('lon','lat')) for p in member.get('geometry',[]) if p]
        for a,b in zip(points, points[1:]):
            if a == b: continue
            length = distance(a,b)
            graph.setdefault(a,{})[b] = length
            graph.setdefault(b,{})[a] = length
    return graph

def route_rail(graph, start, end):
    a = min(graph, key=lambda p:distance(p,start))
    b = min(graph, key=lambda p:distance(p,end))
    if max(distance(a,start),distance(b,end)) > 250:
        raise ValueError('Station is too far from source railway')
    costs, parents, queue = {a:0}, {}, [(0,a)]
    while queue:
        cost, node = heapq.heappop(queue)
        if node == b: break
        if cost > costs[node]: continue
        for neighbor, length in graph[node].items():
            candidate = cost + length
            if candidate < costs.get(neighbor, float('inf')):
                costs[neighbor] = candidate
                parents[neighbor] = node
                heapq.heappush(queue, (candidate, neighbor))
    if b not in costs: raise ValueError('Disconnected source geometry; cannot invent a bridge')
    path = [b]
    while path[-1] != a: path.append(parents[path[-1]])
    path.reverse()
    return {'type':'LineString','coordinates':path}, round(costs[b]), [round(distance(a,start)),round(distance(b,end))]

def walking(leg, places, token):
    cache = CACHE / ('walk-' + leg['id'] + '.json')
    if cache.exists(): return json.loads(cache.read_text(encoding='utf-8'))
    coords = ';'.join(','.join(map(str,places[p]['coords'])) for p in (leg['from'],leg['to']))
    params = urllib.parse.urlencode({'access_token':token,'geometries':'geojson','overview':'full','steps':'true'})
    url = 'https://api.mapbox.com/directions/v5/mapbox/walking/' + coords + '?' + params
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url,timeout=35) as response: data = json.load(response)
            route = data['routes'][0]
            result = {'geometry':route['geometry'],'distance':round(route['distance']),
                'source':'Mapbox Directions walking', 'sourceUrl':'https://docs.mapbox.com/api/navigation/directions/',
                'durationSeconds':round(route['duration']), 'checkedAt':'2026-09-20',
                'snapMeters':[round(p.get('distance',0)) for p in data['waypoints']]}
            cache.write_text(json.dumps(result, ensure_ascii=False),encoding='utf-8')
            return result
        except Exception as error:
            if attempt==2: raise RuntimeError(type(error).__name__ + ' walking route unavailable') from None
            time.sleep(2)

def build(data):
    trip = json.loads(subprocess.check_output(['node','-e','console.log(JSON.stringify(require("./tokyo-data.js")))'],cwd=ROOT).decode('utf-8'))
    graphs = {r['id']:rail_graph(r) for r in data['elements']}
    token = re.search(r"const MAPBOX_TOKEN = '([^']+)'", (ROOT/'map.js').read_text(encoding='utf-8')).group(1)
    output, failed = {}, []
    for id,leg in trip['legs'].items():
        if leg.get('reverseOf') or leg['mode'] != 'rail': continue
        rel = trip['lines'][leg['line']]['relation']
        try:
            geometry,length,snaps = route_rail(graphs[rel],trip['places'][leg['from']]['coords'],trip['places'][leg['to']]['coords'])
            output[id] = {'geometry':geometry,'distance':length,'snapMeters':snaps,
                'source':'OpenStreetMap contributors', 'sourceUrl':f'https://www.openstreetmap.org/relation/{rel}',
                'license':'ODbL-1.0','checkedAt':'2026-09-20'}
            print('RAIL',id,length,len(geometry['coordinates']),flush=True)
        except Exception as error:
            failed.append(id); print('ERROR',id,str(error),flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        jobs = {pool.submit(walking,leg,trip['places'],token):id for id,leg in trip['legs'].items() if leg['mode']=='walk' and not leg.get('reverseOf')}
        for job in concurrent.futures.as_completed(jobs):
            id=jobs[job]
            try:
                output[id]=job.result()
                print('WALK',id,output[id]['distance'],flush=True)
            except Exception as error:
                failed.append(id); print('ERROR',id,str(error),flush=True)
    for id,leg in trip['legs'].items():
        original = leg.get('reverseOf')
        if original in output:
            item = output[original]
            output[id] = {**item, 'geometry':{'type':'LineString','coordinates':list(reversed(item['geometry']['coordinates']))}}
    (ROOT/'assets/tokyo/routes.json').write_text(json.dumps({'version':1,'routes':output},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    print('TOTAL',len(output),'FAILED',failed)
    if failed: sys.exit(1)

def photos():
    """Store photo metadata only, with Commons attribution; no stock substitutes."""
    records = {}
    subjects = {'ueno':'Ameya-Yokochō', 'disney':'Tokyo Disneyland', 'harakado':'Tokyu Plaza Harajuku Harakado', 'shinjuku':'Shinjuku Station'}
    for key, title in subjects.items():
        try:
            params=urllib.parse.urlencode({'action':'query','format':'json','prop':'pageimages','titles':title,'pithumbsize':1000,'piprop':'thumbnail|name|original'})
            req=urllib.request.Request('https://en.wikipedia.org/w/api.php?'+params,headers={'User-Agent':'TokyoItineraryReference/1.0'})
            with urllib.request.urlopen(req,timeout=25) as response: data=json.load(response)
            page=next(iter(data['query']['pages'].values()))
            filename=page.get('pageimage')
            if not filename and key=='harakado':
                params=urllib.parse.urlencode({'action':'query','format':'json','list':'search','srsearch':'Harakado','srnamespace':6,'srlimit':5})
                req=urllib.request.Request('https://commons.wikimedia.org/w/api.php?'+params,headers={'User-Agent':'TokyoItineraryReference/1.0'})
                with urllib.request.urlopen(req,timeout=25) as response: matches=json.load(response)
                print('HARAKADO FILES', [p['title'] for p in matches['query']['search']],flush=True)
                # The first search hit is an unrelated cap display inside the complex.
                filename='Tokyu plaza omote-sando "Harakado".jpg'
            if not filename: raise ValueError('No verified image for '+title)
            params=urllib.parse.urlencode({'action':'query','format':'json','prop':'imageinfo','iiprop':'url|extmetadata','titles':'File:'+filename,'iiurlwidth':1000})
            req=urllib.request.Request('https://commons.wikimedia.org/w/api.php?'+params,headers={'User-Agent':'TokyoItineraryReference/1.0'})
            with urllib.request.urlopen(req,timeout=25) as response: metadata=json.load(response)
            info=next(iter(metadata['query']['pages'].values()))['imageinfo'][0]
            ext=info.get('extmetadata',{})
            strip=lambda s:re.sub('<[^>]+>','',s)
            records[key]={'url':info.get('thumburl',info['url']),'source':info['descriptionurl'],'credit':strip(ext.get('Artist',{}).get('value','Wikimedia Commons'))+' · '+ext.get('LicenseShortName',{}).get('value',''),'caption':title}
            print(key,json.dumps(records[key],ensure_ascii=False),flush=True)
        except Exception as error: print('PHOTO ERROR',key,str(error),flush=True)
    (ROOT/'assets/tokyo/photos.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__ == '__main__' and '--photos' in sys.argv:
    photos()
    sys.exit()
if __name__ == '__main__':
    data = overpass('[out:json][timeout:90];relation(id:443281,443282,443286,1972920,1972960,3120358,5326726,9474241);out geom;', 'rail-geometry.json')
    for e in data['elements']:
        print(e['id'], e['tags']['name'], len(e.get('members',[])))
    build(data)
