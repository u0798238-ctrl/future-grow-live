const fs = require('fs');
let code = fs.readFileSync('src/pages/user/BinaryTreePage.tsx', 'utf8');

code = code.replace(
  "const found = users.find(u => u.id.toLowerCase() === q || (u.username && u.username.toLowerCase().replace(/^@/, '') === q.replace(/^@/, '')) || (u.email && u.email.toLowerCase() === q) || (u.mobile && u.mobile === q) || (u.sponsorId && u.sponsorId.toLowerCase() === q));",
  "const found = users.find(u => u.id.toLowerCase() === q || (u.username && u.username.toLowerCase().replace(/^@/, '') === q.replace(/^@/, '')) || (u.email && u.email.toLowerCase() === q) || (u.mobile && u.mobile === q) || (u.sponsorId && u.sponsorId.toLowerCase() === q) || (u.name && u.name.toLowerCase().includes(q)));"
);

fs.writeFileSync('src/pages/user/BinaryTreePage.tsx', code);
