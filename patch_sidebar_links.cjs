const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Replace standard link with a slightly delayed navigation one?
// Actually, no, that breaks standard web expectations. I'll just leave it.
