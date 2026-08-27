const fs = require('fs');

// 1. Revert DashboardLayout.tsx
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Remove framer-motion imports
layout = layout.replace(/import \{ motion, AnimatePresence \} from 'motion\/react';\n/g, '');

// Replace the animated main block with a standard one
const mainRegex = /<main id="dashboard-main" className="flex-1 overflow-y-auto bg=\[#071E2C\] relative">[\s\S]*?<\/main>/;
const simpleMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C]">
          <div className="p-4 sm:p-6 lg:p-8 min-h-full">
            <Outlet />
          </div>
        </main>`;

layout = layout.replace(mainRegex, simpleMain);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
console.log("Reverted DashboardLayout.tsx");

// 2. Revert index.css
let css = fs.readFileSync('src/index.css', 'utf8');
const cssToReplace = `  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: fixed; /* This prevents iOS Safari from ever rubber-banding or address bar jumping */
    overscroll-behavior: none;
  }`;

if (css.includes(cssToReplace)) {
    css = css.replace(cssToReplace, '');
    fs.writeFileSync('src/index.css', css);
    console.log("Reverted index.css");
} else {
    console.log("Could not find CSS block to revert");
}
