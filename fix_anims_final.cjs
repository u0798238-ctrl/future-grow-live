const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Remove framer-motion import
code = code.replace(/import \{ motion, AnimatePresence \} from 'motion\/react';/g, '');
code = code.replace(/import \{ motion, AnimatePresence \} from 'framer-motion';/g, '');

// Replace main section with plain Outlet
const start = code.indexOf('<main id="dashboard-main"');
const end = code.indexOf('</main>', start) + 7;
if (start !== -1 && end !== -1) {
    const plainMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] p-4 sm:p-6 lg:p-8">\n          <Outlet />\n        </main>`;
    code = code.substring(0, start) + plainMain + code.substring(end);
}

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
console.log("Stripped animations entirely.");
