const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/UsersPage.tsx', 'utf8');

// Add View Tree Button
code = code.replace(
  `                        {/* View Full Details Button */}
                        <button 
                          onClick={() => setViewUserModal(user)}
                          className="p-1.5 bg-[#071E2C] border border-cyan-500/40 rounded-md text-cyan-400 hover:bg-cyan-500/20 transition-colors" 
                          title="View Full Registration Details (Address, KYC, Payment)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>`,
  `                        {/* View Full Details Button */}
                        <button 
                          onClick={() => setViewUserModal(user)}
                          className="p-1.5 bg-[#071E2C] border border-cyan-500/40 rounded-md text-cyan-400 hover:bg-cyan-500/20 transition-colors" 
                          title="View Full Registration Details (Address, KYC, Payment)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* View Tree Button */}
                        <button 
                          onClick={() => window.open(\`/admin/tree?user=\${user.id}\`, '_self')}
                          className="p-1.5 bg-[#071E2C] border border-emerald-500/40 rounded-md text-emerald-400 hover:bg-emerald-500/20 transition-colors" 
                          title="View Binary Tree for this User"
                        >
                          <svg xmlns="http://www.w-square.com/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-network"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
                        </button>`
);

// Add Pagination UI at the bottom of the table
code = code.replace(
  `        </div>
      </div>

      {/* View Full User Registration Details Modal */}`,
  `        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#28485A]/30 flex items-center justify-between bg-[#132C3C]">
            <span className="text-sm text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-[#071E2C] border border-[#28485A]/50 rounded-lg text-sm text-white disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-[#071E2C] border border-[#28485A]/50 rounded-lg text-sm text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Full User Registration Details Modal */}`
);

fs.writeFileSync('src/pages/admin/UsersPage.tsx', code);
