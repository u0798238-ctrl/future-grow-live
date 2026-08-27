const fs = require('fs');
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

layout = layout.replace(
  '<div className="fixed inset-0 w-full overflow-hidden bg-[#071E2C] flex font-sans text-white">',
  '<div className="h-screen w-full overflow-hidden bg-[#071E2C] flex font-sans text-white">'
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
