const fs = require('fs');

try {
let code2 = fs.readFileSync('src/pages/user/DashboardPage.tsx', 'utf8');

if (code2.includes("tx.description")) {
    code2 = code2.replace(
        '<p className="text-sm font-semibold text-white">{tx.description}</p>',
        `<p className="text-sm font-semibold text-white">{tx.type === 'Direct' ? 'Direct Referral Income' : tx.type === 'Matching' ? 'Matching Income' : tx.type === 'Level' ? 'Level Income' : (tx.type === 'Withdrawal' ? 'Withdrawal' : tx.type === 'Deposit' ? 'Deposit' : tx.description)}</p>`
    );
    fs.writeFileSync('src/pages/user/DashboardPage.tsx', code2);
    console.log("Patched DashboardPage.tsx");
}
} catch(e) {}
