const fs = require('fs');
let hpContent = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

hpContent = hpContent.replace(
  /<\/div>\n                    <\/a>\n                  <\/div>\n                \}\)\)/g,
  '</div>\n                    </div>\n                  </div>\n                ))'
);

fs.writeFileSync('src/pages/public/HomePage.tsx', hpContent);
