const fs = require('fs');
let code = fs.readFileSync('src/pages/user/WithdrawalPage.tsx', 'utf-8');

code = code.replace(
  "const handleWithdraw = async (e: React.FormEvent) => {\n    e.preventDefault();\n    setToastMessage(null); // Reset previous message",
  "const handleWithdraw = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (isSubmitting) return;\n    setIsSubmitting(true);\n    setToastMessage(null); // Reset previous message"
);

code = code.replace(
  "           `Method: ${method === 'upi' ? 'UPI' : 'Bank Transfer'}`\n         ]\n    }\n  };",
  "           `Method: ${method === 'upi' ? 'UPI' : 'Bank Transfer'}`\n         ]\n       });\n    }\n    setIsSubmitting(false);\n  };"
);

// I might have missed another closing bracket in the sed command... let's replace the button to use isSubmitting

code = code.replace(
  "isCurrentMethodValid && amount && withdrawAmtNum >= 500 && withdrawAmtNum <= (userStats?.availableBalance || 0)",
  "!isSubmitting && isCurrentMethodValid && amount && withdrawAmtNum >= 500 && withdrawAmtNum <= (userStats?.availableBalance || 0)"
);

code = code.replace(
  "<Button \n                 type=\"submit\" \n                 disabled={!isCurrentMethodValid || !amount || withdrawAmtNum < 500 || withdrawAmtNum > (userStats?.availableBalance || 0)}",
  "<Button \n                 type=\"submit\" \n                 disabled={isSubmitting || !isCurrentMethodValid || !amount || withdrawAmtNum < 500 || withdrawAmtNum > (userStats?.availableBalance || 0)}"
);

code = code.replace(
  "Withdraw Funds",
  "{isSubmitting ? 'Processing...' : 'Withdraw Funds'}"
);


fs.writeFileSync('src/pages/user/WithdrawalPage.tsx', code);
