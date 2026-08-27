const fs = require('fs');
const files = ['src/pages/public/LoginPage.tsx', 'src/layouts/DashboardLayout.tsx', 'src/lib/sessionManager.ts'];
files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/sessionStorage\.setItem\('admin_security_unlocked'/g, "localStorage.setItem('admin_security_unlocked'");
  code = code.replace(/sessionStorage\.getItem\('admin_security_unlocked'/g, "localStorage.getItem('admin_security_unlocked'");
  code = code.replace(/sessionStorage\.removeItem\('admin_security_unlocked'/g, "localStorage.removeItem('admin_security_unlocked'");
  fs.writeFileSync(file, code);
});
