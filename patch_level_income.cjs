const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/LevelIncomePage.tsx', 'utf8');

// 1. Remove MOCK_REPORTS
code = code.replace(
  /const MOCK_REPORTS = \[\n(?:.*\n)*?\];\n\n/g,
  ""
);

// Fallback in case the regex doesn't match perfectly
if (code.includes('MOCK_REPORTS')) {
  code = code.replace(/const MOCK_REPORTS = \[\s*\{[^\}]+\},\s*\{[^\}]+\},\s*\{[^\}]+\},\s*\];/s, "");
}

// Add import for getMlmUsers, MlmUser
if (!code.includes('getMlmUsers')) {
  code = code.replace(
    "import { Plus, Edit, Trash2, X, Trophy, Activity, CheckCircle, Power, UserCheck } from 'lucide-react';",
    "import { Plus, Edit, Trash2, X, Trophy, Activity, CheckCircle, Power, UserCheck } from 'lucide-react';\nimport { getMlmUsers, MlmUser } from '@/lib/mlmStore';"
  );
}

// 2. Add dynamic reports calculation
code = code.replace(
  "  const [activeTab, setActiveTab] = useState<'levels' | 'reports'>('levels');",
  `  const [activeTab, setActiveTab] = useState<'levels' | 'reports'>('levels');
  const [users, setUsers] = useState<MlmUser[]>([]);

  useEffect(() => {
    const loadUsers = () => {
      setUsers(getMlmUsers());
    };
    loadUsers();
    window.addEventListener('mlm_update', loadUsers);
    return () => window.removeEventListener('mlm_update', loadUsers);
  }, []);

  const levelReports = React.useMemo(() => {
    const reports: any[] = [];
    users.forEach(user => {
      if (user.transactions && Array.isArray(user.transactions)) {
        user.transactions.forEach(tx => {
          if (tx.type === 'Level') {
            // Check if level Name can be extracted from description
            let levelNumber = 0;
            // Often description is something like "1st Level Income"
            const match = tx.description.match(/(\\d+)(st|nd|rd|th)? Level/i);
            if (match) levelNumber = parseInt(match[1], 10);
            
            reports.push({
              id: tx.id,
              userId: user.id,
              name: user.name,
              level: levelNumber,
              levelName: tx.description,
              amount: tx.amount,
              date: tx.date,
              status: 'Approved'
            });
          }
        });
      }
    });
    return reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [users]);
  
  const totalDisbursed = levelReports.reduce((sum, r) => sum + r.amount, 0);`
);

// 3. Update Total Disbursed display
code = code.replace(
  "Total Disbursed: ₹48,000",
  "Total Disbursed: ₹{totalDisbursed.toLocaleString('en-IN')}"
);

// 4. Update table rendering to use levelReports
code = code.replace(
  "{MOCK_REPORTS.map((report) => (",
  "{levelReports.map((report) => ("
);

// Write changes
fs.writeFileSync('src/pages/admin/LevelIncomePage.tsx', code);
