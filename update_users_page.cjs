const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/UsersPage.tsx', 'utf8');

// Add recoverMlmUser import
if (!code.includes('recoverMlmUser')) {
    code = code.replace(
        'deleteMlmUser, updateMlmUserStatus',
        'deleteMlmUser, recoverMlmUser, updateMlmUserStatus'
    );
}

// Add state for active tab
if (!code.includes('const [activeTab, setActiveTab] = useState')) {
    code = code.replace(
        'const [searchTerm, setSearchTerm] = useState(\'\');',
        'const [searchTerm, setSearchTerm] = useState(\'\');\n  const [activeTab, setActiveTab] = useState<\'All\' | \'Active\' | \'Inactive\' | \'Blocked\' | \'Deleted\'>(\'All\');'
    );
}

// Update filter logic
const filterRegex = /const filteredUsers = users\.filter\(user => \n    user\.name\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\) \|\| \n    user\.id\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\) \|\|\n    user\.mobile\.includes\(searchTerm\) \|\|\n    \(user\.city && user\.city\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)\) \|\|\n    \(user\.email && user\.email\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)\) \|\|\n    \(user\.username && user\.username\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)\) \|\|\n    \(user\.sponsorId && user\.sponsorId\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)\)\n  \);/g;

const newFilter = `const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.sponsorId && user.sponsorId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab = activeTab === 'All' ? user.status !== 'Deleted' : user.status === activeTab;
    
    return matchesSearch && matchesTab;
  });`;

if (code.match(filterRegex)) {
    code = code.replace(filterRegex, newFilter);
    console.log("Updated filter logic");
} else {
    // If exact whitespace matching failed, let's just do a simpler search/replace
    const startFilter = code.indexOf('const filteredUsers = users.filter(user =>');
    const endFilter = code.indexOf('const paginatedUsers = filteredUsers.slice');
    if(startFilter !== -1 && endFilter !== -1) {
        code = code.substring(0, startFilter) + newFilter + '\n\n  ' + code.substring(endFilter);
    }
}

// Add tabs in the UI above the search bar
const searchBarJSX = `<div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8FA3AF]" />`;

const searchBarReplacement = `<div className="flex overflow-x-auto pb-2 gap-2 mb-4 scrollbar-hide">
          {['All', 'Active', 'Inactive', 'Blocked', 'Deleted'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={\`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors \${
                activeTab === tab
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-[#1B3343] text-[#8FA3AF] border border-[#28485A]/30 hover:bg-[#28485A]'
              }\`}
            >
              {tab === 'Deleted' ? 'Deleted Users / Recycle Bin' : tab + ' Users'}
            </button>
          ))}
        </div>
        
        <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8FA3AF]" />`;

if (code.includes('<div className="flex gap-4 mb-6">')) {
    code = code.replace('<div className="flex gap-4 mb-6">\n        <div className="flex-1 relative">\n          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8FA3AF]" />', searchBarReplacement);
}

// Add Recover action in handleConfirmAction
const handleActionRegex = /} else if \(actionModal\.type === 'delete'\) {/g;
const newHandleAction = `} else if (actionModal.type === 'recover') {
      recoverMlmUser(actionModal.user.id);
      addNotification('Success', 'User has been recovered successfully.', 'success');
      loadUsers();
    } else if (actionModal.type === 'delete') {`;

code = code.replace(handleActionRegex, newHandleAction);

fs.writeFileSync('src/pages/admin/UsersPage.tsx', code);
console.log("Added tabs and recover logic");
