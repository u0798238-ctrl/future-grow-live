const fs = require('fs');
let code = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

const brokenImage = "https://images.unsplash.com/photo-1540960086884-a1599818817a?q=80&w=1000&auto=format&fit=crop";
const workingImage = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop";

code = code.replace(brokenImage, workingImage);
fs.writeFileSync('src/pages/public/HomePage.tsx', code);
