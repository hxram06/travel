const fs = require('fs');

const data = fs.readFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/data.js', 'utf8');

// A very hacky way to evaluate COURSES, but since it's just JS, we can extract it.
// We'll just eval it.
const dom = {};
let coursesCode = data;
try {
  eval(coursesCode);
} catch(e) {
  console.log("Eval failed", e);
}

const allPhotos = [];
COURSES.forEach(course => {
  course.days.forEach(day => {
    if (day.photos) {
      day.photos.forEach(p => {
        allPhotos.push({
          courseId: course.id,
          day: day.day,
          id: p.id,
          coord: p.coord,
          cap: p.cap,
          desc: p.desc
        });
      });
    }
  });
});

console.log(`Found ${allPhotos.length} photos in data.js`);
fs.writeFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/all_photos.json', JSON.stringify(allPhotos, null, 2));
