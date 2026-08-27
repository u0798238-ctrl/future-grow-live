const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/UsersPage.tsx', 'utf8');

// 1. Add pagination states
code = code.replace(
  "  const [searchTerm, setSearchTerm] = useState('');",
  "  const [searchTerm, setSearchTerm] = useState('');\n  const [currentPage, setCurrentPage] = useState(1);\n  const itemsPerPage = 50;"
);

// Reset pagination when search changes
code = code.replace(
  "              onChange={(e) => setSearchTerm(e.target.value)}",
  "              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}"
);

// 2. Update filtering
code = code.replace(
  "    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || \n    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||\n    user.mobile.includes(searchTerm) ||\n    (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase()))\n  );",
  "    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || \n    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||\n    user.mobile.includes(searchTerm) ||\n    (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase())) ||\n    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||\n    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||\n    (user.sponsorId && user.sponsorId.toLowerCase().includes(searchTerm.toLowerCase()))\n  );\n\n  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);\n  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);"
);

// 3. Update table render to use paginatedUsers
code = code.replace(
  "              {filteredUsers.map((user) => {",
  "              {paginatedUsers.map((user) => {"
);

// 4. Add pagination UI and tree button. Let's find a good place for tree button.
// Usually there's an action section like Edit, Delete, View.
// Let's check what buttons are in the row.
fs.writeFileSync('src/pages/admin/UsersPage.tsx', code);
