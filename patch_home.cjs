const fs = require('fs');
let code = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

const regex = /\{\/\* Features \/ Why Choose Us Section \(Restored\) \*\/\}[\s\S]*?\{\/\* Hindi Vision Content \(User's Request\) \*\/\}/;
code = code.replace(regex, "{/* Hindi Vision Content (User's Request) */}");

fs.writeFileSync('src/pages/public/HomePage.tsx', code);
