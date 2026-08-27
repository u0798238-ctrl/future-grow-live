const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Replace the <main> block
const oldMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C]">
          <div className="p-4 sm:p-6 lg:p-8 min-h-full">
            <Outlet />
          </div>
        </main>`;

const newMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] relative">
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
        </main>`;

if (code.includes(oldMain)) {
    code = code.replace(oldMain, newMain);
    fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
    console.log("Success replacing main");
} else {
    console.log("Could not find oldMain block exact match");
}
