const fs = require('fs');
let code = fs.readFileSync('src/lib/mlmStore.ts', 'utf8');

code = code.replace(
  "id: adj.id || `ADJ-${u.id}-${Date.now()}`",
  "id: adj.id || `ADJ-${u.id}-${getUserTimestamp(u, 0)}`"
);

fs.writeFileSync('src/lib/mlmStore.ts', code);
