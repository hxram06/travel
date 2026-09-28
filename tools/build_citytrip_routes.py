"""Build stored route geometry for the three card-and-map city trips.

Walking routes come from Mapbox Directions. Rail/transit routes use the real
stations and corridor waypoints declared in citytrips-data.js; they are a
planning overview, while the booked operator timetable remains authoritative.
"""
import concurrent.futures
import json
import pathlib
import re
import subprocess
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
CACHE = ROOT / 'assets' / 'citytrips' / 'source'
CACHE.mkdir(parents=True, exist_ok=True)


def load_trips():
    raw = subprocess.check_output(
        ['node', '-e', 'console.log(JSON.stringify(require("./citytrips-data.js")))'],
        cwd=ROOT,
    )
    return json.loads(raw.decode('utf-8'))


def mapbox_token():
    text = (ROOT / 'map.js').read_text(encoding='utf-8')
    return re.search(r"const MAPBOX_TOKEN = '([^']+)'", text).group(1)


def walking(course_id, leg, places, token):
    cache = CACHE / f'{course_id}-walk-{leg["id"]}.json'
    if cache.exists():
        return json.loads(cache.read_text(encoding='utf-8'))
    coordinates = ';'.join(','.join(map(str, places[key]['coords'])) for key in (leg['from'], leg['to']))
    params = urllib.parse.urlencode({'access_token': token, 'geometries': 'geojson', 'overview': 'full', 'steps': 'true'})
    url = 'https://api.mapbox.com/directions/v5/mapbox/walking/' + coordinates + '?' + params
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url, timeout=40) as response:
                data = json.load(response)
            route = data['routes'][0]
            result = {
                'geometry': route['geometry'],
                'distance': round(route['distance']),
                'durationSeconds': round(route['duration']),
                'source': 'Mapbox Directions walking',
                'sourceUrl': 'https://docs.mapbox.com/api/navigation/directions/',
                'checkedAt': '2026-09-29',
            }
            if len(result['geometry']['coordinates']) < 3:
                raise RuntimeError('route geometry too short')
            cache.write_text(json.dumps(result, ensure_ascii=False), encoding='utf-8')
            return result
        except Exception:
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))


def transit(leg, places):
    coordinates = [places[leg['from']]['coords'], *leg.get('via', []), places[leg['to']]['coords']]
    if len(coordinates) < 3:
        raise ValueError(f'{leg["id"]}: transit route needs a corridor waypoint')
    return {
        'geometry': {'type': 'LineString', 'coordinates': coordinates},
        'source': 'Author-curated station corridor',
        'checkedAt': '2026-09-29',
    }


def build_course(course_id, trip, token):
    output = {}
    jobs = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for leg_id, leg in trip['legs'].items():
            if leg.get('reverseOf'):
                continue
            if leg['mode'] == 'walk':
                jobs[pool.submit(walking, course_id, leg, trip['places'], token)] = leg_id
            elif leg['mode'] == 'rail':
                output[leg_id] = transit(leg, trip['places'])
        for job in concurrent.futures.as_completed(jobs):
            output[jobs[job]] = job.result()
    for leg_id, leg in trip['legs'].items():
        original = leg.get('reverseOf')
        if original:
            item = output[original]
            output[leg_id] = {**item, 'geometry': {'type': 'LineString', 'coordinates': list(reversed(item['geometry']['coordinates']))}}
    missing = [key for key, leg in trip['legs'].items() if leg['mode'] != 'indoor' and key not in output]
    if missing:
        raise RuntimeError(f'{course_id}: missing {missing}')
    destination = ROOT / 'assets' / 'citytrips' / f'routes-{course_id}.json'
    destination.write_text(json.dumps({'version': 2, 'routes': output}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(course_id, len(output), destination)


if __name__ == '__main__':
    trips = load_trips()
    token = mapbox_token()
    for course_id, trip in trips.items():
        build_course(course_id, trip, token)
