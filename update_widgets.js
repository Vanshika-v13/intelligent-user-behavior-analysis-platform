const fs = require('fs');
const path = require('path');
const dir = path.join('c:/Users/Vanshika Varma/User Analytics Project/frontend/src/components/analytics/widgets');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Widget.jsx'));

let updated = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes("from '../cards/Card'") || content.includes("from \"../cards/Card\"")) {
    if (!content.includes('WidgetHeader')) {
      content = content.replace(/(import.*Card.*['"];?\n)/, "$1import { WidgetHeader } from '../shared/WidgetHeader';\n");
      content = content.replace(/title=(["'])(.*?)\1/g, "title={<WidgetHeader title=\"$2\" />}");
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log('Updated ' + file);
  }
}
console.log('Updated ' + updated + ' files.');
