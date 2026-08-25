const fs = require('fs');
let code = fs.readFileSync('src/pages/user/WithdrawalPage.tsx', 'utf-8');

const anchor = `    if (!userStats || withdrawAmt > userStats.availableBalance) {
      setToastMessage({ type: 'error', text: "Insufficient available balance in your wallet." });
      return;
    }`;

const checkPending = `    if (!userStats || withdrawAmt > userStats.availableBalance) {
      setToastMessage({ type: 'error', text: "Insufficient available balance in your wallet." });
      return;
    }

    // Check if user already has a pending withdrawal
    const usersForCheck = getMlmUsers();
    const meCheck = usersForCheck.find(u => u.id === getCurrentUserId());
    const hasPendingWithdrawal = meCheck?.transactions?.some(t => t.type === 'Withdrawal' && t.status === 'Pending');
    
    if (hasPendingWithdrawal) {
       setToastMessage({ type: 'error', title: 'Action Not Allowed', text: "You already have a Pending Withdrawal request. Please wait for the admin to approve or reject it before submitting a new one." });
       return;
    }`;

code = code.replace(anchor, checkPending);
fs.writeFileSync('src/pages/user/WithdrawalPage.tsx', code);
