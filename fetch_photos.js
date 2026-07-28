const fs = require('fs');
const https = require('https');

const dataJsPath = 'C:/Users/PC/OneDrive/바탕 화면/여행/data.js';
const photosDataJsPath = 'C:/Users/PC/OneDrive/바탕 화면/여행/photos-data.js';

let dataCode = fs.readFileSync(dataJsPath, 'utf8');
dataCode = dataCode.replace('const COURSES =', 'global.COURSES =');
eval(dataCode);
const courses = global.COURSES;

function fetchWikiImage(cityEn) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(cityEn)}&pithumbsize=1000&format=json`;
    https.get(url, { headers: { 'User-Agent': 'TravelAppAgent/1.0 (test@example.com)' } }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const newPhotos = {};
  let addedCount = 0;
  
  for (const course of courses) {
    const fetchedCities = new Set();
    
    for (const day of course.days) {
      const cityKo = day.cityKo;
      const cityEn = day.cityEn || cityKo;
      
      if (fetchedCities.has(cityKo)) continue;
      
      console.log(`Fetching photo for ${cityEn}...`);
      let imgUrl = await fetchWikiImage(cityEn);
      
      if (imgUrl) {
        const id = 'high_q_' + addedCount;
        newPhotos[id] = {
           url: imgUrl,
           source: "Wikipedia (Quality Image)",
           title: cityKo + " 전경"
        };
        
        if (!day.photos) day.photos = [];
        day.photos.push({
           spot: id,
           at: day.coords,
           cap: `${cityKo}의 아름다운 풍경`,
           desc: `대표적인 ${cityKo}의 전경입니다.`
        });
        
        console.log(` -> Added ${cityKo} at ${day.coords}`);
        addedCount++;
        fetchedCities.add(cityKo);
      } else {
        console.log(` -> No image found for ${cityEn}`);
      }
    }
  }
  
  let photosDataStr = fs.readFileSync(photosDataJsPath, 'utf8');
  const photosInjectStr = Object.keys(newPhotos).map(k => `"${k}": ${JSON.stringify(newPhotos[k], null, 2)}`).join(',\n');
  if (photosInjectStr) {
    photosDataStr = photosDataStr.replace('const PHOTOS = {', 'const PHOTOS = {\n' + photosInjectStr + ',');
    fs.writeFileSync(photosDataJsPath, photosDataStr);
  }
  
  let dataJsStr = fs.readFileSync(dataJsPath, 'utf8');
  const coursesJson = JSON.stringify(courses, null, 2);
  dataJsStr = dataJsStr.replace(/const COURSES = \[[\s\S]*\];/, `const COURSES = ${coursesJson};`);
  fs.writeFileSync(dataJsPath, dataJsStr);
  
  console.log(`Added ${addedCount} high quality photos based on exact day coords!`);
}

run();
