const fs = require('fs');
const path = require('path');
const dir = path.join('c:/Users/Vanshika Varma/User Analytics Project/frontend/src/hooks/analytics');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Analytics.js') || f.endsWith('List.js'));

let updated = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (!content.includes('sharedQueryOptions')) {
    // Add import
    content = content.replace(/(import { useQuery } from '@tanstack\/react-query';\n)/, "$1import { sharedQueryOptions } from './sharedQueryOptions';\n");
    
    // Add sharedQueryOptions before ...options
    content = content.replace(/(\.\.\.options)/g, "...sharedQueryOptions,\n    $1");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log('Updated ' + file);
  }
}
console.log('Updated ' + updated + ' hooks.');
