const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// 1. Remove the useEffect and state
code = code.replace(
  'const [isNavigating, setIsNavigating] = useState(false);',
  ''
);

code = code.replace(
  /React\.useEffect\(\(\) => \{\s*setIsNavigating\(true\);\s*const timer = setTimeout\(\(\) => \{\s*setIsNavigating\(false\);\s*\}, 400\);\s*return \(\) => clearTimeout\(timer\);\s*\}, \[location\.pathname\]\);/g,
  ''
);

// 2. Restore main area
const oldMainRegex = /<main id="dashboard-main"[^>]*>.*?<\/main>/s;
const newMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>`;

code = code.replace(oldMainRegex, newMain);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
console.log("Removed artificial loader delay completely");
