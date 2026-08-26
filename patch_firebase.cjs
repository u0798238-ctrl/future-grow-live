const fs = require('fs');
let fbContent = fs.readFileSync('src/lib/firebase.ts', 'utf-8');
fbContent = fbContent.replace("'mlm_active_admin_session'", "'mlm_active_admin_session',\n  'mlm_announcements'");
fbContent = fbContent.replace("if (key === 'appointments')", "if (key === 'mlm_announcements') {\n          window.dispatchEvent(new CustomEvent('announcements_update', { detail: data.data }));\n        } else if (key === 'appointments')");
fs.writeFileSync('src/lib/firebase.ts', fbContent);
