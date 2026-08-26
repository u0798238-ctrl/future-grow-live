const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AnnouncementsPage.tsx', 'utf-8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$'); // just in case
fs.writeFileSync('src/pages/admin/AnnouncementsPage.tsx', content);
