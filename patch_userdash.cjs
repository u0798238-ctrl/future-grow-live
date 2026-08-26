const fs = require('fs');
let udContent = fs.readFileSync('src/pages/user/DashboardPage.tsx', 'utf-8');

udContent = udContent.replace(
  /<a \n                key=\{ann.id\}\n                href=\{ann.linkUrl \|\| '#'} \n                target=\{ann.linkUrl \? "_blank" : "_self"\}\n                className="snap-center shrink-0 w-full h-48 md:h-64 relative block group"\n              >/g,
  '<div \n                key={ann.id}\n                className="snap-center shrink-0 w-full h-48 md:h-64 relative block group"\n              >'
);

udContent = udContent.replace(
  /<h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">\{ann.title\}<\/h3>\n                <\/div>\n              <\/a>/g,
  '<h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">{ann.title}</h3>\n                  {ann.description && <p className="text-sm md:text-base text-gray-200 mt-1 line-clamp-2 drop-shadow-md">{ann.description}</p>}\n                </div>\n              </div>'
);

fs.writeFileSync('src/pages/user/DashboardPage.tsx', udContent);
