const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

code = code.replace(
  /<main className="flex-1 overflow-y-auto bg-\[#071E2C\] p-4 sm:p-6 lg:p-8">/,
  '<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] p-4 sm:p-6 lg:p-8">'
);

if (!code.includes('React.useLayoutEffect(() => {')) {
  code = code.replace(
    /const location = useLocation\(\);/,
    `const location = useLocation();\n\n  React.useLayoutEffect(() => {\n    const main = document.getElementById('dashboard-main');\n    if (main) main.scrollTo(0, 0);\n  }, [location.pathname]);`
  );
}

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
console.log('Dashboard Layout Patched');
