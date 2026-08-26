const fs = require('fs');

function replaceAwait(file) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/await pushMlmStateToSupabase\('mlm_users'/g, "pushMlmStateToSupabase('mlm_users'");
  fs.writeFileSync(file, content);
}

replaceAwait('src/pages/user/WithdrawalPage.tsx');
replaceAwait('src/pages/admin/WithdrawalsPage.tsx');
replaceAwait('src/lib/mlmStore.ts');

