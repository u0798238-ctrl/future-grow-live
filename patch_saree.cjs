const fs = require('fs');

function removeLines(file, regex) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    const filtered = lines.filter(line => !regex.test(line));
    fs.writeFileSync(file, filtered.join('\n'));
  }
}

removeLines('src/pages/admin/PackagesPage.tsx', /Saree/);
removeLines('src/pages/admin/UsersPage.tsx', /Saree/);
removeLines('src/pages/public/PlanPage.tsx', /Saree/);
removeLines('src/pages/public/RegisterPage.tsx', /Saree|sadi/);
removeLines('src/lib/mlmStore.ts', /Saree/);

