const fs = require('fs');
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

const currentMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C]">
          <div className="p-4 sm:p-6 lg:p-8 min-h-full">
            <Outlet />
          </div>
        </main>`;

const originalMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>`;

if (layout.includes(currentMain)) {
    layout = layout.replace(currentMain, originalMain);
    fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
    console.log("Restored original main block perfectly");
} else {
    console.log("Could not find exact main block");
}
