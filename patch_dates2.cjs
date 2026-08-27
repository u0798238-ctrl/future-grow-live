const fs = require('fs');
let code = fs.readFileSync('src/lib/mlmStore.ts', 'utf8');

code = code.replace(
  "date: adj.date || new Date().toISOString()",
  "date: adj.date || new Date(getUserTimestamp(u, 0) + 3000).toISOString()"
);

fs.writeFileSync('src/lib/mlmStore.ts', code);
