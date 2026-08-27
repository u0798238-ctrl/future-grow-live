const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// 1. Replace useEffect with useLayoutEffect for scroll
code = code.replace(
  /useEffect\(\(\) => \{\n\s*const main = document.getElementById\('dashboard-main'\);\n\s*if \(main\) \{\n\s*main.scrollTo\(\{ top: 0, left: 0, behavior: 'instant' \}\);\n\s*\}\n\s*\}, \[location.pathname\]\);/,
  `React.useLayoutEffect(() => {
    const main = document.getElementById('dashboard-main');
    if (main) {
      main.scrollTop = 0;
    }
  }, [location.pathname]);`
);

// 2. Wrap Outlet with animated key div
code = code.replace(
  /<main id="dashboard-main" className="flex-1 overflow-y-auto bg=\[#071E2C\] p-4 sm:p-6 lg:p-8">\n\s*<Outlet \/>\n\s*<\/main>/,
  `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C]">
          <div key={location.pathname} className="animate-fade-in p-4 sm:p-6 lg:p-8 min-h-full">
            <Outlet />
          </div>
        </main>`
);

// 3. Update overlay to use transition instead of unmounting
code = code.replace(
  /\{isSidebarOpen && \(\n\s*<div\n\s*className="absolute inset-0 z-40 bg=\[#071E2C\]\/80 backdrop-blur-sm lg:hidden"\n\s*onClick=\{([^}]+)\}\n\s*\/>\n\s*\)\}/,
  `<div
          className={cn(
            "absolute inset-0 z-40 bg-[#071E2C]/80 backdrop-blur-sm lg:hidden transition-opacity duration-300",
            isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={$1}
        />`
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
console.log("Patched!");
