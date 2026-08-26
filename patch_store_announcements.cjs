const fs = require('fs');
let storeContent = fs.readFileSync('src/lib/mlmStore.ts', 'utf-8');

const announcementCode = `
export interface Announcement {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  createdAt: number;
}

export const getAnnouncements = (): Announcement[] => {
  try {
    const raw = localStorage.getItem('mlm_announcements');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const saveAnnouncements = (announcements: Announcement[]) => {
  localStorage.setItem('mlm_announcements', JSON.stringify(announcements));
  pushMlmStateToSupabase('mlm_announcements', announcements);
  window.dispatchEvent(new Event('announcements_update'));
};

export const addAnnouncement = (title: string, imageUrl: string, linkUrl?: string) => {
  const announcements = getAnnouncements();
  announcements.unshift({
    id: 'ANN-' + Date.now(),
    title,
    imageUrl,
    linkUrl,
    isActive: true,
    createdAt: Date.now()
  });
  saveAnnouncements(announcements);
};

export const toggleAnnouncement = (id: string, isActive: boolean) => {
  const announcements = getAnnouncements();
  const index = announcements.findIndex(a => a.id === id);
  if (index !== -1) {
    announcements[index].isActive = isActive;
    saveAnnouncements(announcements);
  }
};

export const deleteAnnouncement = (id: string) => {
  let announcements = getAnnouncements();
  announcements = announcements.filter(a => a.id !== id);
  saveAnnouncements(announcements);
};
`;

storeContent += announcementCode;
fs.writeFileSync('src/lib/mlmStore.ts', storeContent);
