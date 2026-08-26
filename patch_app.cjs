const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

appContent = appContent.replace(
  "import { LevelIncomePage } from './pages/admin/LevelIncomePage';",
  "import { LevelIncomePage } from './pages/admin/LevelIncomePage';\nimport { AnnouncementsPage } from './pages/admin/AnnouncementsPage';"
);

appContent = appContent.replace(
  '<Route path="inquiries" element={<InquiriesPage />} />',
  '<Route path="inquiries" element={<InquiriesPage />} />\n          <Route path="announcements" element={<AnnouncementsPage />} />'
);

fs.writeFileSync('src/App.tsx', appContent);
