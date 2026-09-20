# Tokyo course 11

This course is isolated from the existing Europe map. Entry: `?share=tokyo27`.
Localhost and private-LAN addresses also allow the normal course list without a share token.
This is a travel reference, not live navigation.

## Structure

- `tokyo-data.js`: named places, lines, explicit legs, five days, optional branches and photo metadata.
- `tokyo-meals.js`: eight candidates per meal. Scores are nullable; observed Google scores include source URL and date. Budgets are estimates.
- `tokyo-ui.js` / `tokyo.css`: one day/step/sheet/choice state, independent Mapbox instance, scoped styles.
- `routes.json`: precomputed surface geometry. No directions API call is needed when browsing.
- `photos.json`: Commons metadata archive. Active photo metadata is in `tokyo-data.js`. Images are remotely referenced.

The mobile stage below the date tabs is split equally. Expanding moves the same current-detail node into its row in the complete day timeline; other rows remain text-only. Selecting a row returns to the split view. New selections stop the previous camera animation.

## Geometry and attribution

Generate with `python tools/build_tokyo_routes.py`. It reads the existing public Mapbox configuration without printing the token.

Rail geometry is computed along actual OpenStreetMap member ways, not via hand-picked midpoints. Endpoints more than 250 m from the railway fail generation. There is no straight-line fallback.

Relations: Yamanote 1972920, Keiyo 5326726, Marunouchi 443282, Mita 443286, Skyliner 3120358. Opposite directions reverse the same physical track corridor.

Rail geometry: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), ODbL 1.0. Each record links the source relation. Geometry can be regenerated from those public IDs; local response caches are excluded from Git.

Walking geometry: Mapbox Directions walking, full GeoJSON, checked 2026-09-20. Records retain distance, duration and endpoint snap distance. The map retains Mapbox and OSM attribution. Walking routes represent outdoor access, not verified indoor turn-by-turn navigation.

Station passages have separate indoor legs with transfer/exit instructions and time allowances. They have no invented surface geometry. The Tokyo JR–Keiyo transfer allows 15–20 minutes. Shopping and meals are separate stops, never mislabeled as transfers.

The unconfirmed airport return and optional bus sightseeing loop have no fabricated geometry or timetable. Bus-stop walking routes are available. The exact banana product/shop remains to be checked; no invented cross-station shop route is shown.

## Sources and limits

All times are Japan local time. Flights and individual 2027 train departures are not booked. Sky 16:00 is a target for a 16:00–16:30 ticket, not an existing reservation.

- [Hotel access](https://www.hvf.jp/eng/tamachi/access/) and [walking map](https://www.hvf.jp/tamachi/map/MAP1.pdf): Tamachi Shibaura exit six minutes, Mita A4 eight minutes; no direct underground hotel connection.
- [JR Tamachi directions](https://timetables.jreast.co.jp/timetable/list0976.html): Shibuya-bound outer loop, return inner loop.
- [Disney rail access](https://www.tokyodisneyresort.jp/en/tdr/access/railway): Maihama, JR Tokyo transfer to Keiyo.
- [Tamagotchi Factory](https://tamagotchi-factory.jp/): Harakado 3F.
- [Sanrio Harajuku](https://stores.sanrio.co.jp/8857100) and [NISHIGINZA](https://stores.sanrio.co.jp/1703100).
- [Sky tickets](https://www.shibuya-scramble-square.com/sky/ticket/) and [sales-policy announcement](https://shibuya-scramble-square.com/assets/pdf/about/20250227scsq.pdf): current two-week sales policy, to be rechecked before January 2027.
- [NAOJ January 2027 Tokyo solar table](https://eco.mtk.nao.ac.jp/koyomi/dni/2027/s1301.html): January 27 sunset 17:03.
- [Tokyo Banana brulee tart](https://www.tokyobanana.jp/products/banana_brulee.html) may or may not be the exact remembered product. [JR Central collection information](https://market.jr-central.co.jp/shop/goods/search.aspx?keyword=%E6%9D%B1%E4%BA%AC%E3%81%B0%E3%81%AA%E5%A5%88&search=x&shop=S001) lists PLUSTA Gift, Tokyo Gift Palette, currently until 20:30. Product and stock require confirmation.
- [Skybus night course](https://www.skybus.jp/course/?id=1750745746-069957): January 2027 service unconfirmed.

Restaurant conditions are checked separately from geography. Ratings are dated observations, not hygiene guarantees. Satsuma Roppongi is retained as a normal dinner candidate with an extra-journey/budget note because it lies outside the final base itinerary.

## Verification

`node tools/test_tokyo.cjs` checks the pre-change checksum of every other course, unique step IDs, route references/continuity, non-straight geometry, provenance, reverse trips, meal counts, directions and unconfirmed Day 5.

Start `python -m http.server 8011 --bind 0.0.0.0`, then `node tools/test_tokyo.cjs --browser` for browser QA and screenshots in `outputs/tokyo-qa/`. Tests use a separate headless Chrome profile and cover gestures, dates, rapid navigation, branches, contextual meals, photos, small phones, route-data failure, local/share entry and close.

The legacy checksum is this rebuild's regression snapshot. Update it deliberately if other courses are intentionally edited in future.
