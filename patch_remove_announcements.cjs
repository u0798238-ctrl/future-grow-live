const fs = require('fs');

let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf-8');
layout = layout.replace(/\s*\{\s*name:\s*'Announcements',\s*path:\s*'\/admin\/announcements',\s*icon:\s*FileText\s*\},/, '');
fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);

let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(/import \{ AnnouncementsPage \} from '\.\/pages\/admin\/AnnouncementsPage';\n?/, '');
app = app.replace(/\s*<Route path="announcements" element=\{<AnnouncementsPage \/>\} \/>/, '');
fs.writeFileSync('src/App.tsx', app);
