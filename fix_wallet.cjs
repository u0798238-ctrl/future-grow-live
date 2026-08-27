const fs = require('fs');
let code = fs.readFileSync('src/pages/user/WalletPage.tsx', 'utf8');

code = code.replace(
  '<p className="text-sm font-semibold text-white">{tx.description}</p>',
  `<p className="text-sm font-semibold text-white">{tx.type === 'Direct' ? 'Direct Referral Income' : tx.type === 'Matching' ? 'Matching Income' : tx.type === 'Level' ? 'Level Income' : tx.description}</p>`
);

fs.writeFileSync('src/pages/user/WalletPage.tsx', code);
console.log("Patched WalletPage.tsx");
