const fs = require('fs');
const https = require('https');

const dataJsPath = 'C:/Users/PC/OneDrive/바탕 화면/여행/data.js';
const photosDataJsPath = 'C:/Users/PC/OneDrive/바탕 화면/여행/photos-data.js';

let dataCode = fs.readFileSync(dataJsPath, 'utf8');
dataCode = dataCode.replace('const COURSES =', 'global.COURSES =');
eval(dataCode);
const courses = global.COURSES;

function fetchCommonsImages(query, limit = 5) {
  return new Promise((resolve) => {
    // Avoid people in photos
    let q = query + ' -people -person -portrait -crowd -people -faces filetype:bitmap';
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&gsrlimit=${limit}`;
    https.get(url, { headers: { 'User-Agent': 'TravelAppAgent/5.0 (test@example.com)' } }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.query && json.query.pages) {
            const urls = [];
            for (const key in json.query.pages) {
              const page = json.query.pages[key];
              if (page.imageinfo && page.imageinfo[0] && page.imageinfo[0].url) {
                const imgUrl = page.imageinfo[0].url;
                // Filter out small icons or maps if possible, but Commons search is usually photos
                if (!imgUrl.toLowerCase().includes('.svg') && !imgUrl.toLowerCase().includes('map')) {
                  urls.push(imgUrl);
                }
              }
            }
            resolve(urls);
            return;
          }
          resolve([]);
        } catch(e) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

// Add tiny offsets for multiple photos in the same city so they don't exactly overlap on the map
function jitterCoord(coord, index) {
  // approx 50m - 100m offset
  const offset = 0.0006 * (index + 1);
  const angle = index * (Math.PI / 3);
  return [
    coord[0] + offset * Math.cos(angle),
    coord[1] + offset * Math.sin(angle)
  ];
}

async function run() {
  const newPhotos = {};
  let addedCount = 0;
  
  for (const course of courses) {
    for (const day of course.days) {
      if (!day.photos) day.photos = [];
      
      const cityEn = day.cityEn || day.cityKo;
      let query = cityEn + ' landscape OR architecture OR landmark';
      
      if (cityEn.includes('Innsbruck') || cityEn.includes('Interlaken') || cityEn.includes('Hallstatt') || cityEn.includes('Zermatt')) {
        query += ' mountain alps nature';
      }
      
      console.log(`Fetching 5+ photos for ${cityEn}...`);
      let imgUrls = await fetchCommonsImages(query, 6);
      
      // If we don't have enough, try just the city name
      if (imgUrls.length < 5) {
        const fallbackUrls = await fetchCommonsImages(cityEn + ' landscape', 6 - imgUrls.length);
        imgUrls = imgUrls.concat(fallbackUrls);
      }
      
      // Still need more? Try Korean name
      if (imgUrls.length < 5) {
        const fallbackUrls2 = await fetchCommonsImages(day.cityKo + ' 풍경', 6 - imgUrls.length);
        imgUrls = imgUrls.concat(fallbackUrls2);
      }

      // Remove duplicates
      imgUrls = [...new Set(imgUrls)];

      for (let i = 0; i < imgUrls.length; i++) {
        // limit to 5-6 photos per day
        if (i >= 6) break;
        
        const id = 'hq_bulk_' + addedCount;
        newPhotos[id] = {
           url: imgUrls[i],
           source: "Wikimedia Commons (High Quality)",
           title: day.cityKo
        };
        
        day.photos.push({
           spot: id,
           at: jitterCoord(day.coords, day.photos.length),
           cap: `${day.cityKo}의 풍경`,
           desc: `[명소 사진] 사람이 없는 고즈넉한 ${day.cityKo}의 풍경입니다.`
        });
        
        addedCount++;
      }
      console.log(` -> Added ${imgUrls.length} photos for ${day.cityKo}`);
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
  
  console.log(`Added ${addedCount} photos across all days!`);
}

run();
