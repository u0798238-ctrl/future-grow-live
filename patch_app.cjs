const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';/,
  `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';\nimport ScrollToTop from './components/ScrollToTop';`
);
code = code.replace(
  /<BrowserRouter>/,
  `<BrowserRouter>\n      <ScrollToTop />`
);
fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx Patched');
