const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Remove the key={location.pathname} and animate-fade-in which is causing aggressive remounting
code = code.replace(
  /<div key=\{location.pathname\} className="animate-fade-in p-4 sm:p-6 lg:p-8 min-h-full">/g,
  '<div className="p-4 sm:p-6 lg:p-8 min-h-full">'
);

// Switch back to fixed inset-0 to prevent browser URL bar jumping completely
code = code.replace(
  /<div className="h-\[100dvh\] w-full overflow-hidden bg=\[#071E2C\] flex font-sans text-white relative">/g,
  '<div className="fixed inset-0 w-full overflow-hidden bg-[#071E2C] flex font-sans text-white">'
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
console.log("Patched 3!");
