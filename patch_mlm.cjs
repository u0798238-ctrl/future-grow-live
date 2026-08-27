const fs = require('fs');
let code = fs.readFileSync('src/lib/mlmStore.ts', 'utf8');

code = code.replace(
    `description: 'Direct Referral Income',`,
    "description: `Direct Referral from ${direct.name} (${direct.id})`,"
);

code = code.replace(
    `description: 'Matching Income',`,
    "description: `Matching Pair (${leftMem.name} & ${rightMem.name})`,"
);

code = code.replace(
    `description: getLevelOrdinalName(lvl.level),`,
    "description: `${getLevelOrdinalName(lvl.level)} Completion`,"
);

fs.writeFileSync('src/lib/mlmStore.ts', code);
console.log("Patched mlmStore descriptions");
