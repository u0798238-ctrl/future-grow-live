const fs = require('fs');
let code = fs.readFileSync('src/pages/user/WithdrawalPage.tsx', 'utf-8');

code = code.replace(
  "upiId: method === 'upi' ? upiId.trim() : undefined,",
  "...(method === 'upi' ? { upiId: upiId.trim() } : {}),"
);
code = code.replace(
  "bankAccount: method === 'bank' ? bankAccount.trim() : undefined,",
  "...(method === 'bank' ? { bankAccount: bankAccount.trim() } : {}),"
);
code = code.replace(
  "ifscCode: method === 'bank' ? ifscCode.trim().toUpperCase() : undefined",
  "...(method === 'bank' ? { ifscCode: ifscCode.trim().toUpperCase() } : {})"
);

fs.writeFileSync('src/pages/user/WithdrawalPage.tsx', code);
