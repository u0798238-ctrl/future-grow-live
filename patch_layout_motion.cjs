const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

if (!code.includes('import { motion, AnimatePresence }')) {
  code = code.replace(
    "import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';",
    "import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';\nimport { motion, AnimatePresence } from 'motion/react';"
  );
}

// Ensure the scroll fix stays but is less aggressive
code = code.replace(
  /React.useLayoutEffect\(\(\) => \{\n\s*const main = document.getElementById\('dashboard-main'\);\n\s*if \(main\) \{\n\s*main.scrollTop = 0;\n\s*\}\n\s*\}, \[location.pathname\]\);/,
  `React.useEffect(() => {
    // Small delay ensures scroll reset happens as the new frame enters
    const main = document.getElementById('dashboard-main');
    if (main) {
      setTimeout(() => { main.scrollTop = 0; }, 10);
    }
  }, [location.pathname]);`
);

// Replace main content with AnimatePresence
code = code.replace(
  /<main id="dashboard-main" className="flex-1 overflow-y-auto bg=\[#071E2C\]">\n\s*<div className="p-4 sm:p-6 lg:p-8 min-h-full">\n\s*<Outlet \/>\n\s*<\/div>\n\s*<\/main>/,
  `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-4 sm:p-6 lg:p-8 min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>`
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
console.log("Patched with framer-motion!");
