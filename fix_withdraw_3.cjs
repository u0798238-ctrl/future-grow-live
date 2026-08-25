const fs = require('fs');
let code = fs.readFileSync('src/pages/user/WithdrawalPage.tsx', 'utf-8');

code = code.replace(
  "setIsSubmitting(true);\n    setToastMessage(null); // Reset previous message\n\n    if (isFreeOrInactive) {",
  "setIsSubmitting(true);\n    setToastMessage(null); // Reset previous message\n\n  try {\n    if (isFreeOrInactive) {"
);

code = code.replace(
  "           `Method: ${method === 'upi' ? 'UPI' : 'Bank Transfer'}`\n         ]\n       });\n    }\n    setIsSubmitting(false);\n  };",
  "           `Method: ${method === 'upi' ? 'UPI' : 'Bank Transfer'}`\n         ]\n       });\n    }\n  } finally {\n    setIsSubmitting(false);\n  }\n  };"
);

fs.writeFileSync('src/pages/user/WithdrawalPage.tsx', code);
