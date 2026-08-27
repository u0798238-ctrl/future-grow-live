import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Trophy, Activity, CheckCircle, Power, UserCheck } from 'lucide-react';
import { getMlmUsers, MlmUser } from '@/lib/mlmStore';

export const INITIAL_LEVELS = [
  { id: 1, level: 1, name: 'Silver', leftId: 2, rightId: 2, income: 3000, status: 'Active' },
  { id: 2, level: 2, name: 'Bronze', leftId: 6, rightId: 6, income: 9000, status: 'Active' },
  { id: 3, level: 3, name: 'Silver Star', leftId: 12, rightId: 12, income: 18000, status: 'Active' },
  { id: 4, level: 4, name: 'Gold', leftId: 24, rightId: 24, income: 32000, status: 'Active' },
  { id: 5, level: 5, name: 'Platinum Star', leftId: 48, rightId: 48, income: 65000, status: 'Active' },
  { id: 6, level: 6, name: 'Emerald', leftId: 96, rightId: 96, income: 120000, status: 'Active' },
  { id: 7, level: 7, name: 'Pearl Star', leftId: 192, rightId: 192, income: 240000, status: 'Active' },
  { id: 8, level: 8, name: 'Ruby Star', leftId: 384, rightId: 384, income: 480000, status: 'Active' },
  { id: 9, level: 9, name: 'Sapphire', leftId: 768, rightId: 768, income: 960000, status: 'Active' },
  { id: 10, level: 10, name: 'Diamond', leftId: 1536, rightId: 1536, income: 1920000, status: 'Active' },
  { id: 11, level: 11, name: 'D. Diamond', leftId: 3072, rightId: 3072, income: 3072000, status: 'Active' },
  { id: 12, level: 12, name: 'Blue Diamond', leftId: 6144, rightId: 6144, income: 6144000, status: 'Active' },
  { id: 13, level: 13, name: 'Royal Diamond', leftId: 12288, rightId: 12288, income: 12288000, status: 'Active' },
  { id: 14, level: 14, name: 'Crown', leftId: 24576, rightId: 24576, income: 24576000, status: 'Active' },
  { id: 15, level: 15, name: 'Crown Diamond', leftId: 49152, rightId: 49152, income: 49152000, status: 'Active' },
  { id: 16, level: 16, name: 'Imperial Crown', leftId: 98304, rightId: 98304, income: 98304000, status: 'Active' },
  { id: 17, level: 17, name: 'Ambassador', leftId: 196608, rightId: 196608, income: 196608000, status: 'Active' },
  { id: 18, level: 18, name: 'Crown Ambassador', leftId: 393216, rightId: 393216, income: 393216000, status: 'Active' },
  { id: 19, level: 19, name: 'Royal King', leftId: 786432, rightId: 786432, income: 786432000, status: 'Active' },
  { id: 20, level: 20, name: 'Royal Universe', leftId: 1572864, rightId: 1572864, income: 1572864000, status: 'Active' },
];

export function LevelIncomePage() {
  const [activeTab, setActiveTab] = useState<'levels' | 'reports'>('levels');
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
            const match = tx.description.match(/(\d+)(st|nd|rd|th)? Level/i);
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
  
  const totalDisbursed = levelReports.reduce((sum, r) => sum + r.amount, 0);
  const [isSystemActive, setIsSystemActive] = useState(() => {
    const saved = localStorage.getItem('app_level_system_active');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [levels, setLevels] = useState(() => {
    const saved = localStorage.getItem('app_levels_v3');
    return saved ? JSON.parse(saved) : INITIAL_LEVELS;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('app_levels_v3', JSON.stringify(levels));
    window.dispatchEvent(new Event('mlm_update'));
  }, [levels]);

  useEffect(() => {
    localStorage.setItem('app_level_system_active', JSON.stringify(isSystemActive));
    window.dispatchEvent(new Event('mlm_update'));
  }, [isSystemActive]);

  const [toastMessage, setToastMessage] = useState<{title?: string; text: string; type: 'success' | 'error' | 'info'} | null>(null);
  const [formData, setFormData] = useState({
    level: '',
    name: '',
    leftId: '',
    rightId: '',
    income: '',
    status: 'Active'
  });

  const handleOpenModal = (lvl: any = null) => {
    if (lvl) {
      setEditingLevel(lvl);
      setFormData({
        level: lvl.level.toString(),
        name: lvl.name,
        leftId: lvl.leftId === 0 ? '—' : lvl.leftId.toString(),
        rightId: lvl.rightId === 0 ? '—' : lvl.rightId.toString(),
        income: lvl.income === 0 ? '—' : lvl.income.toString(),
        status: lvl.status || 'Active'
      });
    } else {
      setEditingLevel(null);
      setFormData({
        level: (Math.max(...levels.map(l => l.level), 0) + 1).toString(),
        name: '',
        leftId: '',
        rightId: '',
        income: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.level || !formData.name) {
      setToastMessage({type: 'error', text: 'Level number and name are required.'});
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    const parseNum = (val: string) => (val === '—' || val === '' || val === '-') ? 0 : Number(val);

    if (editingLevel) {
      setLevels(levels.map(l => 
        l.id === editingLevel.id 
          ? { 
              ...l, 
              level: Number(formData.level),
              name: formData.name, 
              leftId: parseNum(formData.leftId), 
              rightId: parseNum(formData.rightId), 
              income: parseNum(formData.income), 
              status: formData.status
            } 
          : l
      ));
    } else {
      const newLevel = {
        id: Math.max(...levels.map(l => l.id), 0) + 1,
        level: Number(formData.level),
        name: formData.name,
        leftId: parseNum(formData.leftId),
        rightId: parseNum(formData.rightId),
        income: parseNum(formData.income),
        status: formData.status
      };
      // Sort by level automatically when adding new
      setLevels([...levels, newLevel].sort((a, b) => a.level - b.level));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setLevels(levels.filter(l => l.id !== id));
  };

  const formatDisplayNum = (val: number) => val === 0 ? '—' : new Intl.NumberFormat('en-IN').format(val);
  const formatCurrency = (val: number) => val === 0 ? '—' : `₹${new Intl.NumberFormat('en-IN').format(val)}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Level Income Management</h2>
          <p className="text-gray-300 text-sm mt-1">Configure binary matching levels and income criteria</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#132C3C] border border-[#28485A]/50 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-white">System Status</span>
            <button 
              onClick={() => setIsSystemActive(!isSystemActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isSystemActive ? 'bg-[#6F9DB5]' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isSystemActive ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
            <span className={`text-xs font-semibold ${isSystemActive ? 'text-[#35B779]' : 'text-gray-300'}`}>
              {isSystemActive ? 'ON' : 'OFF'}
            </span>
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#6F9DB5] hover:bg-[#6F9DB5] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create New Level
          </button>
        </div>
      </div>

      <div className="flex border-b border-[#28485A]/30">
        <button
          onClick={() => setActiveTab('levels')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'levels' 
              ? 'border-[#6F9DB5] text-[#35B779]' 
              : 'border-transparent text-gray-300 hover:text-white'
          }`}
        >
          Level Configuration
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'reports' 
              ? 'border-[#6F9DB5] text-[#35B779]' 
              : 'border-transparent text-gray-300 hover:text-white'
          }`}
        >
          Income Reports & History
        </button>
      </div>

      {activeTab === 'levels' && (

      <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-[#071E2C] text-xs uppercase font-medium text-[#8FA3AF]">
              <tr>
                <th className="px-6 py-4 text-right w-16">Level</th>
                <th className="px-6 py-4">Level Name</th>
                <th className="px-6 py-4 text-right">Left ID</th>
                <th className="px-6 py-4 text-right">Right ID</th>
                <th className="px-6 py-4 text-right">Income (₹)</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {levels.map((lvl) => (
                <tr key={lvl.id} className="border-b border-[#28485A]/50 hover:bg-[#1B3343]/40 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-[#6F9DB5]">
                  <td className="px-6 py-4 text-right font-semibold text-gray-300">
                    {lvl.level}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-[#1B3343]/30 rounded-md text-amber-400">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-white">{lvl.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {formatDisplayNum(lvl.leftId)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {formatDisplayNum(lvl.rightId)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-[#35B779]">
                    {formatCurrency(lvl.income)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(lvl)}
                        className="p-1.5 bg-[#071E2C] rounded-md text-blue-400 hover:text-blue-300 transition-colors" 
                        title="Edit Level"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(lvl.id)}
                        className="p-1.5 bg-[#071E2C] rounded-md text-red-500 hover:text-red-400 transition-colors" 
                        title="Delete Level"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {levels.length === 0 && (
            <div className="p-8 text-center text-gray-300">
              No levels found. Click "Create New Level" to add one.
            </div>
          )}
        </div>
      </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">
          <div className="p-4 border-b border-[#28485A]/30 bg-[#1B3343]/20 flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#8FA3AF]" />
              Level Income Payouts
            </h3>
            <div className="text-sm font-semibold text-[#35B779]">
              Total Disbursed: ₹{totalDisbursed.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-[#071E2C] text-xs uppercase font-medium text-[#8FA3AF]">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Achieved Level</th>
                  <th className="px-6 py-4 text-right">Amount (₹)</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="">
                {levelReports.map((report) => (
                  <tr key={report.id} className="border-b border-[#28485A]/50 hover:bg-[#1B3343]/40 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-[#6F9DB5]">
                    <td className="px-6 py-4 font-mono text-xs">{report.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-white">{report.name}</div>
                        <div className="text-xs text-gray-300">{report.userId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 font-semibold">L{report.level}</span>
                        <span className="text-amber-400">{report.levelName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-[#35B779]">
                      ₹{new Intl.NumberFormat('en-IN').format(report.amount)}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{report.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          report.status === 'Approved' ? 'bg-[#6F9DB5]/20 text-[#35B779]' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Add/Edit Level */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingLevel ? 'Edit Level Income' : 'Create New Level Income'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="text-xs font-medium text-gray-300">Level No.</label>
                  <input 
                    type="number" 
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-300">Level Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Silver, Bronze"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-300">Left ID</label>
                  <input 
                    type="text" 
                    placeholder="0"
                    value={formData.leftId}
                    onChange={(e) => setFormData({...formData, leftId: e.target.value})}
                    className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-300">Right ID</label>
                  <input 
                    type="text" 
                    placeholder="0"
                    value={formData.rightId}
                    onChange={(e) => setFormData({...formData, rightId: e.target.value})}
                    className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300">Income (₹)</label>
                <input 
                  type="text" 
                  placeholder="0"
                  value={formData.income}
                  onChange={(e) => setFormData({...formData, income: e.target.value})}
                  className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" 
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-[#28485A]/30 mt-6">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 rounded-lg bg-[#071E2C] text-white text-sm font-medium hover:text-white transition-colors border border-[#28485A]/30"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="px-4 py-2 rounded-lg bg-[#6F9DB5] hover:bg-[#6F9DB5] text-white text-sm font-medium transition-colors"
                >
                  {editingLevel ? 'Update Level' : 'Create Level'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
