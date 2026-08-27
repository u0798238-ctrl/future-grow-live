const fs = require('fs');
let code = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// The glitch is definitely caused by mobile browser address bar sliding when we programmatically close the sidebar state and a re-render triggers.
// We must ensure the `isSidebarOpen` overlay isn't triggering a resize.

// We will change how the Sidebar menu hides itself upon clicking a link.
// Right now it's: onClick={() => setIsSidebarOpen(false)}
// Let's add a slight delay so the transition routing happens BEFORE the sidebar state disappears, avoiding concurrent render flashes.
code = code.replace(
  /onClick=\{\(\) => setIsSidebarOpen\(false\)\}/g,
  `onClick={() => setTimeout(() => setIsSidebarOpen(false), 50)}`
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', code);
console.log("Sidebar click patched with micro-delay to prevent React render flashing!");
