const fs = require('fs');
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Replace everything inside the main block, stripping framer motion
const startIdx = layout.indexOf('<main id="dashboard-main"');
if (startIdx !== -1) {
    const endIdx = layout.indexOf('</main>', startIdx) + '</main>'.length;
    
    const simpleMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C]">
          <div className="p-4 sm:p-6 lg:p-8 min-h-full">
            <Outlet />
          </div>
        </main>`;
        
    layout = layout.slice(0, startIdx) + simpleMain + layout.slice(endIdx);
    
    // Remove imports
    layout = layout.replace(/import \{ motion, AnimatePresence \} from 'motion\/react';\n/g, '');
    
    fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
    console.log("Fixed main block");
} else {
    console.log("Could not find main block");
}
