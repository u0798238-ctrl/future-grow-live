const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Remove the wrongly placed useEffect
code = code.replace(
  /const \[isNavigating, setIsNavigating\] = useState\(false\);\s*React.useEffect\(\(\) => \{\s*setIsNavigating\(true\);\s*const timer = setTimeout\(\(\) => \{\s*setIsNavigating\(false\);\s*\}, 400\);\s*return \(\) => clearTimeout\(timer\);\s*\}, \[location.pathname\]\);/s,
  'const [isNavigating, setIsNavigating] = useState(false);'
);

// Insert it after location is defined
code = code.replace(
  'const location = useLocation();',
  `const location = useLocation();\n\n  React.useEffect(() => {\n    setIsNavigating(true);\n    const timer = setTimeout(() => {\n      setIsNavigating(false);\n    }, 400);\n    return () => clearTimeout(timer);\n  }, [location.pathname]);`
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
console.log("Fixed location issue");
