const fs = require('fs');
const https = require('https');
const vm = require('vm');

function fetchBingImages(query, retries = 3) {
  return new Promise((resolve, reject) => {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' } }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        const matches = [...body.matchAll(/m="({[^"]+murl[^"]+})"/g)];
        const urls = [];
        for (const match of matches) {
          try {
            const json = JSON.parse(match[1].replace(/&quot;/g, '"'));
            if (json.murl && json.murl.match(/\.(jpg|jpeg|png)(\?|$)/i)) urls.push(json.murl);
          } catch (e) {}
        }
        if (urls.length > 0) {
            resolve(urls);
        } else if (retries > 0) {
            console.log(`Retrying ${query}...`);
            setTimeout(() => fetchBingImages(query, retries - 1).then(resolve).catch(reject), 2000);
        } else {
            resolve([]);
        }
      });
    }).on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => fetchBingImages(query, retries - 1).then(resolve).catch(reject), 2000);
      } else reject(err);
    });
  });
}

async function main() {
  console.log("Loading data.js...");
  let dataText = fs.readFileSync('data.js', 'utf8');
  const sandboxData = {};
  vm.createContext(sandboxData);
  vm.runInContext(dataText.replace('const COURSES =', 'COURSES =').replace('const START_LOCATION', 'START_LOCATION'), sandboxData);
  const courses = sandboxData.COURSES;
  
  // Create a brand new PHOTOS object since we are discarding the garbage data
  const newPhotos = {};
  
  // Load mappings
  const maps = {};
  for (let i = 0; i <= 4; i++) {
    const mapData = JSON.parse(fs.readFileSync(`map${i}.json`, 'utf8'));
    Object.assign(maps, mapData);
  }
  
  let blockId = 0;
  let newKeyCounter = 0;
  
  for (let c = 0; c < courses.length; c++) {
    const course = courses[c];
    for (let d = 0; d < course.days.length; d++) {
      const day = course.days[d];
      day.photos = []; // clear existing
      
      const parts = ['am', 'pm', 'ev'];
      for (const part of parts) {
        if (day[part]) {
          const mapEntries = maps[blockId] || [];
          
          for (const entry of mapEntries) {
            const urls = await fetchBingImages(entry.query);
            if (urls && urls.length > 0) {
                const imgUrl = urls[0];
                const key = `bing_photo_${newKeyCounter++}`;
                newPhotos[key] = {
                    url: imgUrl,
                    title: entry.title,
                    source: "Bing Images"
                };
                day.photos.push({
                    spot: key,
                    cap: entry.title,
                    desc: `<b>${entry.cap}</b><br>${entry.desc}`
                });
                console.log(`[Block ${blockId}] Added photo for: ${entry.query}`);
            } else {
                console.log(`[Block ${blockId}] ❌ No photos found for: ${entry.query}`);
            }
            await new Promise(r => setTimeout(r, 500)); 
          }
          blockId++;
        }
      }
    }
  }

  console.log(`Total photos fetched and injected: ${newKeyCounter}`);

  // Save photos-data.js
  let newPhotosOutput = "const PHOTOS = {\n";
  for (const key in newPhotos) {
    const p = newPhotos[key];
    newPhotosOutput += `  "${key}": { "url": ${JSON.stringify(p.url)}`;
    if (p.title) newPhotosOutput += `, "title": ${JSON.stringify(p.title)}`;
    if (p.credit) newPhotosOutput += `, "credit": ${JSON.stringify(p.credit)}`;
    if (p.source) newPhotosOutput += `, "source": ${JSON.stringify(p.source)}`;
    newPhotosOutput += ` },\n`;
  }
  newPhotosOutput += "};\n";
  fs.writeFileSync('photos-data.js', newPhotosOutput, 'utf8');
  console.log("Updated photos-data.js");

  // Save data.js
  let newDataOutput = "const START_LOCATION = {\n  nameKo: '인천',\n  nameEn: 'Incheon',\n  coords: [126.4507, 37.4602],\n};\n\nconst COURSES = " + JSON.stringify(courses, null, 2) + ";\n\nif (typeof module !== 'undefined') { module.exports = { START_LOCATION, COURSES }; }\n";
  fs.writeFileSync('data.js', newDataOutput, 'utf8');
  console.log("Updated data.js");
}

main().catch(console.error);
