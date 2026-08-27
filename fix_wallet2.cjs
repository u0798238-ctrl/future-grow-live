const fs = require('fs');
let code = fs.readFileSync('src/pages/user/WalletPage.tsx', 'utf8');

const target1 = `tx.type === 'Level' ? 'Level Income' : tx.description`;
const repl1 = `tx.type === 'Level' ? 'Level Income' : (tx.type === 'Withdrawal' ? 'Withdrawal' : tx.type === 'Deposit' ? 'Deposit' : tx.description)`;

if (code.includes(target1)) {
  code = code.replace(target1, repl1);
  fs.writeFileSync('src/pages/user/WalletPage.tsx', code);
  console.log("Patched WalletPage.tsx");
}

let code2 = fs.readFileSync('src/pages/user/UserDashboardPage.tsx', 'utf8');

// Also fix UserDashboardPage.tsx
if (code2.includes("tx.description")) {
    code2 = code2.replace(
        '<p className="text-sm font-semibold text-white">{tx.description}</p>',
        `<p className="text-sm font-semibold text-white">{tx.type === 'Direct' ? 'Direct Referral Income' : tx.type === 'Matching' ? 'Matching Income' : tx.type === 'Level' ? 'Level Income' : (tx.type === 'Withdrawal' ? 'Withdrawal' : tx.type === 'Deposit' ? 'Deposit' : tx.description)}</p>`
    );
    fs.writeFileSync('src/pages/user/UserDashboardPage.tsx', code2);
    console.log("Patched UserDashboardPage.tsx");
}

