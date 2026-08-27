const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

if (!code.includes('isNavigating')) {
  // 1. Add state and effect
  code = code.replace(
    'const [isSidebarOpen, setIsSidebarOpen] = useState(false);',
    `const [isSidebarOpen, setIsSidebarOpen] = useState(false);\n  const [isNavigating, setIsNavigating] = useState(false);\n\n  React.useEffect(() => {\n    setIsNavigating(true);\n    const timer = setTimeout(() => {\n      setIsNavigating(false);\n    }, 400);\n    return () => clearTimeout(timer);\n  }, [location.pathname]);`
  );

  // 2. Replace main Outlet with loading spinner condition
  const oldMain = `<Outlet />`;
  const newMain = `{isNavigating ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-[#8FA3AF]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-sm">Loading dashboard...</p>
            </div>
          ) : (
            <Outlet />
          )}`;
  
  code = code.replace(oldMain, newMain);

  fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
  console.log("Added navigation loader");
} else {
  console.log("Loader already exists");
}
