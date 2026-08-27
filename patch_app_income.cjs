const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes("IncomeDistributionPage")) {
  app = app.replace(
    "import { WithdrawalsPage } from './pages/admin/WithdrawalsPage';",
    "import { WithdrawalsPage } from './pages/admin/WithdrawalsPage';\nimport { IncomeDistributionPage } from './pages/admin/IncomeDistributionPage';"
  );
  
  app = app.replace(
    '<Route path="levels" element={<LevelIncomePage />} />',
    '<Route path="levels" element={<LevelIncomePage />} />\n          <Route path="income-distribution" element={<IncomeDistributionPage />} />'
  );
  
  fs.writeFileSync('src/App.tsx', app);
  console.log("Added IncomeDistributionPage to App.tsx");
} else {
  console.log("Already present in App.tsx");
}
