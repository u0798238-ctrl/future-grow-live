const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('MasterRecoveryPage')) {
  code = code.replace(
    "import { RefundPage } from './pages/public/RefundPage';",
    "import { RefundPage } from './pages/public/RefundPage';\nimport { MasterRecoveryPage } from './pages/public/MasterRecoveryPage';"
  );

  code = code.replace(
    '<Route path="/refund" element={<RefundPage />} />',
    '<Route path="/refund" element={<RefundPage />} />\n          <Route path="/master-recovery" element={<MasterRecoveryPage />} />'
  );

  fs.writeFileSync('src/App.tsx', code);
}
