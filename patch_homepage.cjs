const fs = require('fs');
let hpContent = fs.readFileSync('src/pages/public/HomePage.tsx', 'utf-8');

hpContent = hpContent.replace(
  /<a href=\{ann.linkUrl \|\| '#'} target=\{ann.linkUrl \? "_blank" : "_self"\} className="block relative h-48 md:h-64 bg-\[#071E2C\]">/g,
  '<div className="block relative h-48 md:h-64 bg-[#071E2C]">'
);
hpContent = hpContent.replace(
  /<\/a>\n                <\/div>\n              \}\)\)/g,
  '</div>\n                </div>\n              ))'
);

hpContent = hpContent.replace(
  /<h3 className="text-lg font-bold text-white shadow-sm drop-shadow-md">\{ann.title\}<\/h3>/g,
  '<h3 className="text-lg font-bold text-white shadow-sm drop-shadow-md">{ann.title}</h3>\n                      {ann.description && <p className="text-sm text-gray-200 line-clamp-2 mt-1 drop-shadow-md">{ann.description}</p>}'
);

// Delete Life at Future Grow section
const sectionRegex = /\{\/\* Life at Future Grow - Image Gallery \*\/\}[\s\S]*?(?=\{\/\* Final Call to Action \*\/\}|<!--|$)/;
hpContent = hpContent.replace(sectionRegex, '');

fs.writeFileSync('src/pages/public/HomePage.tsx', hpContent);
