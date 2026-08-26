const fs = require('fs');
let code = fs.readFileSync('src/pages/public/RegisterPage.tsx', 'utf-8');

code = code.replace(/<span className="w-3 h-3 rounded-full bg-\[#B45309\] border-2 border-yellow-300 shadow-sm shrink-0" title="Banarasi Silk" \/>\n\s*\}\)/g, '');

fs.writeFileSync('src/pages/public/RegisterPage.tsx', code);
