const fs = require('fs');
let code = fs.readFileSync('src/pages/public/RegisterPage.tsx', 'utf-8');

// 1. Add required validation
code = code.replace(
  /const allUsers = getMlmUsers\(\);\n\n    if \(username\.trim\(\)\) \{/,
  `const allUsers = getMlmUsers();\n\n    if (!username.trim()) {\n      setErrorMsg('Username is required.');\n      return;\n    }\n\n    if (username.trim()) {`
);

// 2. Change label
code = code.replace(
  /Username <span className="text-gray-400 text-xs">\(Optional - for easy login\)<\/span>/,
  'Username'
);

// 3. Add required to input
code = code.replace(
  /<Input \n                  id="username" \n                  value=\{username\}\n                  onChange=\{\(e\) => setUsername\(e\.target\.value\)\}\n                  placeholder="e\.g\. umesh123" \n                \/>/,
  `<Input \n                  id="username" \n                  value={username}\n                  onChange={(e) => setUsername(e.target.value)}\n                  placeholder="e.g. umesh123" \n                  required\n                />`
);

fs.writeFileSync('src/pages/public/RegisterPage.tsx', code);
