const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/WithdrawalsPage.tsx', 'utf-8');

code = code.replace(
  "         setSelectedWithdrawal(null);\n       }\n    } finally {\n       setIsSubmitting(false);\n    }\n  };",
  "         setSelectedWithdrawal(null);\n       }\n    }\n    } finally {\n       setIsSubmitting(false);\n    }\n  };"
);

fs.writeFileSync('src/pages/admin/WithdrawalsPage.tsx', code);
