const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/UsersPage.tsx', 'utf8');

const target = `      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Registered Users & Member Details</h2>
          <p className="text-sm text-gray-300">Complete list of members with addresses, products, phone numbers & KYC</p>
        </div>
      </div>
      <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">`;

const replace = `      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Registered Users & Member Details</h2>
          <p className="text-sm text-gray-300">Complete list of members with addresses, products, phone numbers & KYC</p>
        </div>
      </div>
      <div className="flex gap-4 my-6 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Active', 'Inactive', 'Blocked', 'Deleted'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab as any); setCurrentPage(1); }}
            className={\`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap \${
              activeTab === tab 
                ? tab === 'Deleted' ? 'bg-red-500 text-white' : 'bg-[#28485A] text-white' 
                : 'text-gray-400 hover:text-white hover:bg-[#1B3343]'
            }\`}
          >
            {tab === 'Deleted' ? 'Deleted Users / Recycle Bin' : tab + ' Users'}
          </button>
        ))}
      </div>
      <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">`;

code = code.replace(target, replace);
fs.writeFileSync('src/pages/admin/UsersPage.tsx', code);
