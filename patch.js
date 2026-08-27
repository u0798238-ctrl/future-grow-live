const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/import ScrollToTop from ".\/components\/ScrollToTop";\n/, '');
code = code.replace(/<ScrollToTop \/>\n      /, '');
fs.writeFileSync('src/App.tsx', code);
