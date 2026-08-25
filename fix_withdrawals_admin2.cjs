const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/WithdrawalsPage.tsx', 'utf-8');

code = code.replace(
  "    } finally {\\n       setIsSubmitting(false);\\n    }",
  "    } catch (e) {\\n       console.error(e);\\n    } finally {\\n       setIsSubmitting(false);\\n    }"
);

fs.writeFileSync('src/pages/admin/WithdrawalsPage.tsx', code);
