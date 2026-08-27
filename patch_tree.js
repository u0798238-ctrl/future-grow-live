const fs = require('fs');
let code = fs.readFileSync('src/pages/user/BinaryTreePage.tsx', 'utf8');
code = code.replace(
  `import { ArrowUp, RefreshCw, User as UserIcon } from 'lucide-react';\nimport { getCurrentUserId, getMlmUsers, MlmUser } from '@/lib/mlmStore';`,
  `import { ArrowUp, RefreshCw, User as UserIcon } from 'lucide-react';\nimport { useSearchParams } from 'react-router-dom';\nimport { getCurrentUserId, getMlmUsers, MlmUser } from '@/lib/mlmStore';`
);

code = code.replace(
  `  const [users, setUsers] = useState<MlmUser[]>([]);\n  const [currentRootId, setCurrentRootId] = useState<string>('');`,
  `  const [users, setUsers] = useState<MlmUser[]>([]);\n  const [searchParams] = useSearchParams();\n  const urlUserId = searchParams.get('user');\n  const [currentRootId, setCurrentRootId] = useState<string>('');`
);

code = code.replace(
  `    setCurrentRootId(getCurrentUserId());\n    \n    window.addEventListener('mlm_update', loadUsers);`,
  `    if (urlUserId) {\n      setCurrentRootId(urlUserId);\n    } else {\n      setCurrentRootId(getCurrentUserId());\n    }\n    \n    window.addEventListener('mlm_update', loadUsers);`
);

code = code.replace(
  `  }, []);`,
  `  }, [urlUserId]);`
);

fs.writeFileSync('src/pages/user/BinaryTreePage.tsx', code);
