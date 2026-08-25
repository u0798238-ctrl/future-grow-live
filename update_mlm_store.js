const fs = require('fs');
let file = fs.readFileSync('src/lib/mlmStore.ts', 'utf8');

// Update generation: Direct Referral Income -> Direct Refferal Income
file = file.replace(/description: 'Direct Referral Income'/g, "description: 'Direct Refferal Income'");
file = file.replace(/description: 'Level Income'/g, "description: '1th Level Income'");
// Matching Income is already description: 'Matching Income'

// Update loadUsers migration block
const oldMigrationBlock = `               if (t.description && t.description.startsWith('Direct Referral Income (')) {
                  t.description = 'Direct Referral Income';
                  updated = true;
               }`;
const newMigrationBlock = `               if (t.description) {
                  const descLower = t.description.toLowerCase();
                  if (descLower.includes('direct') || descLower.includes('referral') || descLower.includes('refferal')) {
                     t.description = 'Direct Refferal Income';
                     updated = true;
                  } else if (descLower.includes('matching') || descLower.includes('pair')) {
                     t.description = 'Matching Income';
                     updated = true;
                  } else if (descLower.includes('level')) {
                     t.description = '1th Level Income';
                     updated = true;
                  }
               }`;

if (file.includes(oldMigrationBlock)) {
    file = file.replace(oldMigrationBlock, newMigrationBlock);
} else {
    console.log("Migration block not found!");
}

fs.writeFileSync('src/lib/mlmStore.ts', file);
