const fs = require('fs');
let code = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

code = code.replace('<div className="pt-8 pb-4">', '<div className="pt-8 pb-2 md:pb-3">');
code = code.replace('<div className="pt-2 pb-12">', '<div className="pt-2 md:pt-3 pb-12">');

fs.writeFileSync('src/pages/public/HomePage.tsx', code);
