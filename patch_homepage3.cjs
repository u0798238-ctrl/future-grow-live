const fs = require('fs');
let hpContent = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

hpContent = hpContent.replace(
  /\{ann\.description && <p className="text-sm text-gray-200 line-clamp-2 mt-1 drop-shadow-md">\{ann\.description\}<\/p>\}\n                    <\/div>\n                  <\/a>\n                <\/div>/g,
  '{ann.description && <p className="text-sm text-gray-200 line-clamp-2 mt-1 drop-shadow-md">{ann.description}</p>}\n                    </div>\n                  </div>\n                </div>'
);

fs.writeFileSync('src/pages/public/HomePage.tsx', hpContent);
