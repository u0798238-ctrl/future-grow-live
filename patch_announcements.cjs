const fs = require('fs');
let store = fs.readFileSync('src/lib/mlmStore.ts', 'utf-8');

store = store.replace(
  /export interface Announcement \{[\s\S]*?createdAt: number;\n\}/,
  "export interface Announcement {\n  id: string;\n  title: string;\n  description?: string;\n  imageUrl: string;\n  isActive: boolean;\n  createdAt: number;\n}"
);

store = store.replace(
  /export const addAnnouncement = \(title: string, imageUrl: string, linkUrl\?: string\) => \{[\s\S]*?saveAnnouncements\(announcements\);\n\};/,
  "export const addAnnouncement = (title: string, imageUrl: string, description?: string) => {\n  const announcements = getAnnouncements();\n  if (announcements.length >= 10) {\n    throw new Error('Maximum 10 banners allowed. Please delete old ones first.');\n  }\n  announcements.unshift({\n    id: 'ANN-' + Date.now(),\n    title,\n    description,\n    imageUrl,\n    isActive: true,\n    createdAt: Date.now()\n  });\n  saveAnnouncements(announcements);\n};"
);

fs.writeFileSync('src/lib/mlmStore.ts', store);
