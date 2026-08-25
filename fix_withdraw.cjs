const fs = require('fs');
let code = fs.readFileSync('src/pages/user/WithdrawalPage.tsx', 'utf-8');

code = code.replace(
  "ifscCode: method === 'bank' ? ifscCode.trim().toUpperCase() : undefined\n              me.transactions.sort",
  "ifscCode: method === 'bank' ? ifscCode.trim().toUpperCase() : undefined\n       });\n       me.transactions.sort"
);

fs.writeFileSync('src/pages/user/WithdrawalPage.tsx', code);
