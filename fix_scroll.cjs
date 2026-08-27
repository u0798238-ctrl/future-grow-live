const fs = require('fs');
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

layout = layout.replace(
  /React.useEffect\(\(\) => \{\n\s*\/\/ Small delay ensures scroll reset happens as the new frame enters\n\s*const main = document.getElementById\('dashboard-main'\);\n\s*if \(main\) \{\n\s*setTimeout\(\(\) => \{ main.scrollTop = 0; \}, 10\);\n\s*\}\n\s*\}, \[location.pathname\]\);/,
  `React.useLayoutEffect(() => {
    const main = document.getElementById('dashboard-main');
    if (main) {
      main.scrollTop = 0;
    }
  }, [location.pathname]);`
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
