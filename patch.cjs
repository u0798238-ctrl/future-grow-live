const fs = require('fs');
let code = fs.readFileSync('src/pages/user/WithdrawalPage.tsx', 'utf8');

const targetStr = `          {!isWithdrawalUnlocked ? (`;
const idx = code.indexOf(targetStr);
if (idx !== -1) {
  const endStr = `          ) : (`
  const nextIdx = code.indexOf(endStr, idx);
  if (nextIdx !== -1) {
     const newBlock = `          {isWeekend ? (
            <div className="space-y-3">
              <Button 
                type="button" 
                disabled 
                className="w-full text-base py-6 bg-amber-950/60 border border-amber-600/40 text-amber-300 cursor-not-allowed mt-4 shadow-md"
              >
                🚫 Withdrawals Closed on {currentDayName} (Open Monday - Friday)
              </Button>
              <p className="text-center text-xs text-amber-400/80 font-medium">
                Payout requests can only be placed between Monday to Friday. Please request payout on Monday.
              </p>
            </div>
          ) : !isWithdrawalUnlocked ? (
            <div className="space-y-3">
              <Button 
                type="button" 
                disabled 
                className="w-full text-base py-6 bg-gray-700 text-gray-300 cursor-not-allowed opacity-60 mt-4 shadow-md"
              >
                {isFreeOrInactive 
                  ? '🔒 Free ID Account - Activation Required to Withdraw'
                  : !isWithdrawalAllowedByAdmin 
                  ? '🔒 Withdrawals Paused by Admin'
                  : '🔒 Withdrawals Locked (PAN Required / Admin Approval Needed)'}
              </Button>
              <p className="text-center text-xs text-red-400 font-medium">
                {isFreeOrInactive 
                  ? 'Your account is currently registered as a Free ID. Please activate your account with package payment to enable withdrawals.'
                  : !isWithdrawalAllowedByAdmin
                  ? 'Your withdrawal access is currently on hold. Please contact Admin.'
                  : 'If you do not have a PAN Card, withdrawal will only unlock once Admin enables the exemption setting for your account.'}
              </p>
            </div>\n`;
     code = code.substring(0, idx) + newBlock + code.substring(nextIdx);
     fs.writeFileSync('src/pages/user/WithdrawalPage.tsx', code);
     console.log('Success');
  } else {
    console.log('end not found');
  }
} else {
  console.log('start not found');
}
