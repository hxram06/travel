const fs = require('fs');
const photos = JSON.parse(fs.readFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/all_photos.json', 'utf8'));

const colognePhotos = photos.filter(p => p.coord && p.coord[0] > 6.8 && p.coord[0] < 7.1 && p.coord[1] > 50.8 && p.coord[1] < 51.1);

colognePhotos.forEach(m => {
  console.log(m.id, m.coord, m.cap);
});
