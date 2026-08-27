const fs = require('fs');
let code = fs.readFileSync('src/pages/user/BinaryTreePage.tsx', 'utf8');

code = code.replace(
  "import { ArrowUp, RefreshCw, User as UserIcon } from 'lucide-react';\\nimport { getCurrentUserId, getMlmUsers, MlmUser } from '@/lib/mlmStore';",
  "import { ArrowUp, RefreshCw, User as UserIcon } from 'lucide-react';\\nimport { useSearchParams } from 'react-router-dom';\\nimport { getCurrentUserId, getMlmUsers, MlmUser } from '@/lib/mlmStore';"
);

// I will just use regex to replace it
code = code.replace(/import \{ getCurrentUserId, getMlmUsers, MlmUser \} from '@\/lib\/mlmStore';/, "import { useSearchParams } from 'react-router-dom';\nimport { getCurrentUserId, getMlmUsers, MlmUser } from '@/lib/mlmStore';");
code = code.replace(/const \[currentRootId, setCurrentRootId\] = useState<string>\(''\);/, "const [searchParams] = useSearchParams();\n  const urlUserId = searchParams.get('user');\n  const [currentRootId, setCurrentRootId] = useState<string>('');");
code = code.replace(/setCurrentRootId\(getCurrentUserId\(\)\);/, "if (urlUserId) setCurrentRootId(urlUserId); else setCurrentRootId(getCurrentUserId());");
code = code.replace(/  \}, \[\]\);/, "  }, [urlUserId]);");

code = code.replace(
  "    const found = users.find(u => \\n      u.id.toLowerCase() === q || \\n      (u.username && u.username.toLowerCase().replace(/^@/, '') === q.replace(/^@/, ''))\\n    );",
  "    const found = users.find(u => u.id.toLowerCase() === q || (u.username && u.username.toLowerCase().replace(/^@/, '') === q.replace(/^@/, '')) || (u.email && u.email.toLowerCase() === q) || (u.mobile && u.mobile === q) || (u.sponsorId && u.sponsorId.toLowerCase() === q));"
);

code = code.replace(/const found = users\.find\(u => \s+u\.id\.toLowerCase\(\) === q \|\| \s+\(u\.username && u\.username\.toLowerCase\(\)\.replace\(\/\^@\/, ''\) === q\.replace\(\/\^@\/, ''\)\)\s+\);/g, "const found = users.find(u => u.id.toLowerCase() === q || (u.username && u.username.toLowerCase().replace(/^@/, '') === q.replace(/^@/, '')) || (u.email && u.email.toLowerCase() === q) || (u.mobile && u.mobile === q) || (u.sponsorId && u.sponsorId.toLowerCase() === q));");

fs.writeFileSync('src/pages/user/BinaryTreePage.tsx', code);
