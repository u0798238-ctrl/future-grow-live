const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

code = code.replace(
  "useEffect(() => {\n    const main = document.getElementById('dashboard-main');\n    if (main) {\n      main.scrollTo({ top: 0, left: 0, behavior: 'instant' });\n    }\n  }, [location.pathname]);",
  "React.useLayoutEffect(() => {\n    const main = document.getElementById('dashboard-main');\n    if (main) {\n      main.scrollTop = 0;\n    }\n  }, [location.pathname]);"
);

code = code.replace(
  /<main id="dashboard-main" className="flex-1 overflow-y-auto bg=\[#071E2C\] p-4 sm:p-6 lg:p-8">\n\s*<Outlet \/>\n\s*<\/main>/,
  `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C]">
          <div key={location.pathname} className="animate-fade-in p-4 sm:p-6 lg:p-8 min-h-full">
            <Outlet />
          </div>
        </main>`
);

code = code.replace(
  "{isSidebarOpen && (\n        <div\n          className=\"absolute inset-0 z-40 bg-[#071E2C]/80 backdrop-blur-sm lg:hidden\"\n          onClick={() => setIsSidebarOpen(false)}\n        />\n      )}",
  `<div
        className={cn(
          "absolute inset-0 z-40 bg-[#071E2C]/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 ease-in-out",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />`
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
console.log("Patched 2!");
