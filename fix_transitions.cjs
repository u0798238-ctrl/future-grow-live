const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Ensure motion is imported
if (!code.includes("import { motion, AnimatePresence }")) {
    code = code.replace(
        "import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';",
        "import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';\nimport { motion, AnimatePresence } from 'motion/react';"
    );
}

// Replace main with AnimatePresence
const oldMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] p-4 sm:p-6 lg:p-8">\n          <Outlet />\n        </main>`;

const newMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] relative">\n          <AnimatePresence mode="wait">\n            <motion.div\n              key={location.pathname}\n              initial={{ opacity: 0, y: 10 }}\n              animate={{ opacity: 1, y: 0 }}\n              exit={{ opacity: 0, y: -10 }}\n              transition={{ duration: 0.2, ease: "easeInOut" }}\n              className="p-4 sm:p-6 lg:p-8 min-h-full"\n            >\n              <Outlet />\n            </motion.div>\n          </AnimatePresence>\n        </main>`;

if (code.includes('<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] p-4 sm:p-6 lg:p-8">')) {
    code = code.replace(oldMain, newMain);
    fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
    console.log("Replaced main with AnimatePresence");
} else {
    console.log("Could not find old main. Here is the file snippet:");
    console.log(code.substring(code.indexOf('<main id="dashboard-main"'), code.indexOf('</main>') + 7));
}
