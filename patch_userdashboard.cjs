const fs = require('fs');
let udContent = fs.readFileSync('src/pages/user/DashboardPage.tsx', 'utf-8');

udContent = udContent.replace(
  "import { getCurrentUser, MlmUser } from '@/lib/mlmStore';",
  "import { getCurrentUser, MlmUser, getAnnouncements, Announcement } from '@/lib/mlmStore';"
);

udContent = udContent.replace(
  "const [stats, setStats] = useState({",
  "const [announcements, setAnnouncements] = useState<Announcement[]>([]);\n  const [stats, setStats] = useState({"
);

udContent = udContent.replace(
  "const loadData = () => {",
  "const loadData = () => {\n    setAnnouncements(getAnnouncements().filter(a => a.isActive));"
);

const bannerJSX = `
      {/* Announcements Slider */}
      {announcements.length > 0 && (
        <div className="mb-6 relative w-full overflow-hidden rounded-2xl border border-[#28485A]/50 shadow-xl bg-[#071E2C]">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {announcements.map(ann => (
              <a 
                key={ann.id}
                href={ann.linkUrl || '#'} 
                target={ann.linkUrl ? "_blank" : "_self"}
                className="snap-center shrink-0 w-full h-48 md:h-64 relative block group"
              >
                <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071E2C] via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">{ann.title}</h3>
                </div>
              </a>
            ))}
          </div>
          <div className="absolute top-4 right-4 bg-[#1B3343]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-[#35B779]/30 text-[#35B779]">
            Latest Update
          </div>
        </div>
      )}
      
      {/* Welcome Banner */}`;

udContent = udContent.replace(
  "{/* Welcome Banner */}",
  bannerJSX
);

fs.writeFileSync('src/pages/user/DashboardPage.tsx', udContent);
