const fs = require('fs');
let layoutContent = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf-8');

layoutContent = layoutContent.replace(
  "{ name: 'Support Inquiries', path: '/admin/inquiries', icon: MessageSquare },",
  "{ name: 'Support Inquiries', path: '/admin/inquiries', icon: MessageSquare },\n    { name: 'Announcements', path: '/admin/announcements', icon: FileText },"
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', layoutContent);
