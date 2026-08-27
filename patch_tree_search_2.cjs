const fs = require('fs');
let code = fs.readFileSync('src/pages/user/BinaryTreePage.tsx', 'utf8');

code = code.replace(
  "      (u.sponsorId && u.sponsorId.toLowerCase() === q)",
  "      (u.sponsorId && u.sponsorId.toLowerCase() === q) ||\n      (u.name && u.name.toLowerCase().includes(q))"
);

fs.writeFileSync('src/pages/user/BinaryTreePage.tsx', code);
