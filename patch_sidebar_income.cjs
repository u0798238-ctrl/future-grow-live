const fs = require('fs');
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Insert the new route to adminRoutes array
if (!layout.includes("Income Distribution")) {
  layout = layout.replace(
    "{ name: 'Level Income', path: '/admin/levels', icon: Trophy },",
    "{ name: 'Level Income', path: '/admin/levels', icon: Trophy },\n    { name: 'Income Distribution', path: '/admin/income-distribution', icon: IndianRupee },"
  );
  
  // Make sure IndianRupee is imported
  if (!layout.includes("IndianRupee")) {
    layout = layout.replace(
      "import { LayoutDashboard",
      "import { IndianRupee, LayoutDashboard"
    );
  }
  
  fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
  console.log("Added Income Distribution to sidebar");
} else {
  console.log("Income Distribution already in sidebar");
}
