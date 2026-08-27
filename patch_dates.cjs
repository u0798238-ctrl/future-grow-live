const fs = require('fs');
let code = fs.readFileSync('src/lib/mlmStore.ts', 'utf8');

// Fix 1: Custom Bonus date
code = code.replace(
  "            description: commSettings.customBonusNote || 'Admin Special Commission Bonus',\n            date: new Date().toISOString()",
  "            description: commSettings.customBonusNote || 'Admin Special Commission Bonus',\n            date: new Date(getUserTimestamp(u, 0) + 2000).toISOString()"
);

// Fix 2: Admin Flushed Earnings date
code = code.replace(
  "            description: 'Network Capping Overflow (Flushed to Admin)',\n            date: new Date().toISOString()",
  "            description: 'Network Capping Overflow (Flushed to Admin)',\n            date: new Date(getUserTimestamp(rootAdminUser, 0) + 5000).toISOString()"
);

fs.writeFileSync('src/lib/mlmStore.ts', code);
