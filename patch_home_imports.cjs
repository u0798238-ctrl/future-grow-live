const fs = require('fs');
let code = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');
code = code.replace("Lightbulb, Check, TrendingUp, Award, Zap, Package", "Lightbulb, Check");
fs.writeFileSync('src/pages/public/HomePage.tsx', code);
