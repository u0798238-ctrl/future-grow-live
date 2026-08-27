const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

const oldMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] p-4 sm:p-6 lg:p-8">\n          <Outlet />\n        </main>`;
const newMain = `<main id="dashboard-main" className="flex-1 overflow-y-auto bg-[#071E2C] p-4 sm:p-6 lg:p-8">\n          <div key={location.pathname} className="page-transition">\n            <Outlet />\n          </div>\n        </main>`;

if (code.includes(oldMain)) {
    code = code.replace(oldMain, newMain);
    fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
    console.log("Added CSS transition wrapper");
} else {
    console.log("Could not find oldMain. Snippet:");
    console.log(code.substring(code.indexOf('<main id="dashboard-main"'), code.indexOf('</main>') + 7));
}
