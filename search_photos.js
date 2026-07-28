const fs = require('fs');
const photos = JSON.parse(fs.readFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/all_photos.json', 'utf8'));

const keywords = ['피자', '파스타', '커피', '에스프레소', '소포', '편지', '우표', '카페', '레스토랑'];
const matches = photos.filter(p => {
  const text = (p.cap || '') + ' ' + (p.desc || '');
  return keywords.some(k => text.includes(k));
});

console.log('Matches:', matches.length);
if (matches.length < 50) {
  matches.forEach(m => {
    console.log(`[Course ${m.courseId} / Day ${m.day}] ID:${m.id} Coords:[${m.coord[0]}, ${m.coord[1]}] -> ${m.cap}`);
  });
}
