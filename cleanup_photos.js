const fs = require('fs');

const dataJsPath = 'C:/Users/PC/OneDrive/바탕 화면/여행/data.js';
const photosDataJsPath = 'C:/Users/PC/OneDrive/바탕 화면/여행/photos-data.js';

let data = fs.readFileSync(dataJsPath, 'utf8');

// Function to find the starting index of a string
// then scan forwards and backwards to find the enclosing {...} object
function removeObjectWithKey(str, keyPrefix) {
  let result = str;
  let idx = 0;
  while ((idx = result.indexOf(`"spot": "${keyPrefix}`, idx)) !== -1) {
    // Find the opening brace before this index
    let startIdx = result.lastIndexOf('{', idx);
    // Find the closing brace by counting
    let endIdx = startIdx;
    let depth = 0;
    for (let i = startIdx; i < result.length; i++) {
      if (result[i] === '{') depth++;
      else if (result[i] === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }
    
    // Check if there is a trailing comma
    let trailingComma = result.indexOf(',', endIdx);
    // Also skip spaces
    let nextCharIdx = endIdx + 1;
    while (nextCharIdx < result.length && /\s/.test(result[nextCharIdx])) nextCharIdx++;
    if (result[nextCharIdx] === ',') {
      endIdx = nextCharIdx;
    } else {
      // If no trailing comma, maybe there's a leading comma we need to remove
      let prevComma = result.lastIndexOf(',', startIdx);
      // check if it's just spaces between
      let isJustSpaces = true;
      for (let i = prevComma + 1; i < startIdx; i++) {
        if (!/\s/.test(result[i])) isJustSpaces = false;
      }
      if (prevComma !== -1 && isJustSpaces) {
        startIdx = prevComma;
      }
    }
    
    // Remove the block
    result = result.substring(0, startIdx) + result.substring(endIdx + 1);
    idx = startIdx; // Reset idx to continue from here
  }
  return result;
}

data = removeObjectWithKey(data, 'auto_bulk_');
data = removeObjectWithKey(data, 'auto_smart_');

fs.writeFileSync(dataJsPath, data);

// Same for photos-data.js
let photosData = fs.readFileSync(photosDataJsPath, 'utf8');
function removeKeyFromDict(str, keyPrefix) {
  let result = str;
  let idx = 0;
  while ((idx = result.indexOf(`"${keyPrefix}`, idx)) !== -1) {
    // Find the colon after the key
    let colonIdx = result.indexOf(':', idx);
    let startBrace = result.indexOf('{', colonIdx);
    if (startBrace === -1) break;
    
    let endIdx = startBrace;
    let depth = 0;
    for (let i = startBrace; i < result.length; i++) {
      if (result[i] === '{') depth++;
      else if (result[i] === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }
    
    let trailingComma = result.indexOf(',', endIdx);
    let nextCharIdx = endIdx + 1;
    while (nextCharIdx < result.length && /\s/.test(result[nextCharIdx])) nextCharIdx++;
    if (result[nextCharIdx] === ',') {
      endIdx = nextCharIdx;
    } else {
      let prevComma = result.lastIndexOf(',', idx);
      let isJustSpaces = true;
      for (let i = prevComma + 1; i < idx; i++) {
        if (!/\s/.test(result[i])) isJustSpaces = false;
      }
      if (prevComma !== -1 && isJustSpaces) {
        idx = prevComma;
      }
    }
    
    // The key start might have quotes and spaces before it, but idx is the quote.
    // We want to delete from the comma (or quote) to the end brace.
    // If we include spaces before quote:
    let blockStart = idx;
    result = result.substring(0, blockStart) + result.substring(endIdx + 1);
    idx = blockStart;
  }
  return result;
}

photosData = removeKeyFromDict(photosData, 'auto_bulk_');
photosData = removeKeyFromDict(photosData, 'auto_smart_');

fs.writeFileSync(photosDataJsPath, photosData);

console.log('Cleanup logic finished!');
