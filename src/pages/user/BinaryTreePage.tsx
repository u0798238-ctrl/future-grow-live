import React, { useState, useEffect } from 'react';
import { ArrowUp, RefreshCw, User as UserIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getCurrentUserId, getMlmUsers, MlmUser } from '@/lib/mlmStore';

export function BinaryTreePage() {
  const [users, setUsers] = useState<MlmUser[]>([]);
  const [searchParams] = useSearchParams();
  const urlUserId = searchParams.get('user');
  const [currentRootId, setCurrentRootId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const activeUserId = getCurrentUserId();

  useEffect(() => {
    const loadUsers = () => setUsers(getMlmUsers());
    loadUsers();
    if (urlUserId) setCurrentRootId(urlUserId); else setCurrentRootId(getCurrentUserId());
    
    window.addEventListener('mlm_update', loadUsers);
    return () => {
      window.removeEventListener('mlm_update', loadUsers);
    };
  }, [urlUserId]);

  const rootUser = users.find(u => u.id === currentRootId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim().toLowerCase();
    
    const found = users.find(u => 
      u.id.toLowerCase() === q || 
      (u.username && u.username.toLowerCase().replace(/^@/, '') === q.replace(/^@/, '')) ||
      (u.email && u.email.toLowerCase() === q) ||
      (u.mobile && u.mobile === q) ||
      (u.sponsorId && u.sponsorId.toLowerCase() === q) ||
      (u.name && u.name.toLowerCase().includes(q))
    );
    
    if (found) {
      setCurrentRootId(found.id);
      setSearchQuery('');
    } else {
      alert('User not found in the network.');
    }
  };

  const getChild = (parentId: string | null | undefined, position: 'Left' | 'Right') => {
    if (!parentId) return null;
    const parent = users.find(u => u.id === parentId);
    if (!parent) return null;
    const childId = position === 'Left' ? parent.leftId : parent.rightId;
    return users.find(u => u.id === childId) || null;
  };

  const handleNodeClick = (id: string) => {
    setCurrentRootId(id);
  };

  const handleGoUp = () => {
    if (rootUser && rootUser.parentId) {
      setCurrentRootId(rootUser.parentId);
    } else {
      const parent = users.find(u => u.leftId === currentRootId || u.rightId === currentRootId);
      if (parent) {
        setCurrentRootId(parent.id);
      }
    }
  };

  const handleResetToMe = () => {
    setCurrentRootId(activeUserId);
  };

  const renderTree = (userId: string | null, level: number = 0, position: 'root' | 'left' | 'right' = 'root'): React.ReactNode => {
    if (level > 3) return null; // Render 4 levels: 0, 1, 2, 3
    
    const user = users.find(u => u.id === userId);
    
    // For styling like the requested image:
    // root: red
    // level 1, 2: blue
    // level 3: green
    let iconColorClass = "bg-red-600 text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)]";
    if (level === 1 || level === 2) {
       iconColorClass = "bg-blue-600 text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)]";
    } else if (level === 3) {
       iconColorClass = "bg-green-600 text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)]";
    }

    if (!user) {
      return (
        <li>
          <TreeNode empty />
        </li>
      );
    }

    const leftChild = getChild(user.id, 'Left');
    const rightChild = getChild(user.id, 'Right');
    
    // Only render children ul if we have at least one child or if we are level < 3 to show empty slots
    const hasChildren = leftChild || rightChild || level < 3;

    return (
      <li>
        <TreeNode 
          name={user.name} 
          id={user.id} 
          left={user.leftMembers} 
          right={user.rightMembers} 
          active={user.status === 'Active'} 
          onClick={() => handleNodeClick(user.id)}
          iconColor={iconColorClass}
          isYou={user.id === activeUserId}
          packageName={user.package || (user.paymentAmount === 6699 ? 'Basic' : 'Premium')}
          paymentAmount={user.paymentAmount || (user.package?.includes('Basic') ? 6699 : 6699)}
        />
        {hasChildren && (
          <ul>
            {renderTree(leftChild?.id || null, level + 1, 'left')}
            {renderTree(rightChild?.id || null, level + 1, 'right')}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{__html: `
        .org-tree ul {
            padding-top: 20px; 
            position: relative;
            display: flex;
            justify-content: center;
        }
        .org-tree li {
            float: left; text-align: center;
            list-style-type: none;
            position: relative;
            padding: 20px 2px 0 2px;
        }
        .org-tree li::before, .org-tree li::after {
            content: '';
            position: absolute; top: 0; right: 50%;
            border-top: 2px solid #28485A;
            width: 50%; height: 20px;
        }
        .org-tree li::after {
            right: auto; left: 50%;
            border-left: 2px solid #28485A;
        }
        .org-tree li:only-child::after, .org-tree li:only-child::before {
            display: none;
        }
        .org-tree li:only-child { 
            padding-top: 0;
        }
        .org-tree li:first-child::before, .org-tree li:last-child::after {
            border: 0 none;
        }
        .org-tree li:last-child::before {
            border-right: 2px solid #28485A;
            border-radius: 0 4px 0 0;
        }
        .org-tree li:first-child::after {
            border-radius: 4px 0 0 0;
        }
        .org-tree ul ul::before {
            content: '';
            position: absolute; top: 0; left: 50%;
            border-left: 2px solid #28485A;
            width: 0; height: 20px;
            transform: translateX(-50%);
        }
      `}} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Binary Genealogy Tree</h2>
          <p className="text-xs text-gray-300 mt-0.5">Explore left & right network hierarchy and binary pair completion</p>
        </div>
        <form onSubmit={handleSearch} className="flex w-full md:w-auto items-center gap-2">
          <input 
            type="text" 
            placeholder="Search by User ID or Username..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 bg-[#1B3343] border border-[#28485A]/50 rounded-lg text-sm text-white focus:outline-none focus:border-[#6F9DB5] w-full md:w-64"
          />
          <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="bg-[#132C3C] border-2 border-[#6F9DB5]/40 rounded-2xl shadow-[0_0_15px_rgba(111,157,181,0.15)]">
        <div className="p-8 overflow-auto min-h-[600px]">
          <div className="flex items-center gap-3 mb-8">
            {rootUser && (rootUser.parentId || users.some(u => u.leftId === currentRootId || u.rightId === currentRootId)) && (
              <button 
                onClick={handleGoUp}
                className="flex items-center gap-2 px-4 py-2 bg-[#1B3343] hover:bg-[#28485A] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <ArrowUp className="w-4 h-4" /> Go Up One Level
              </button>
            )}
            {currentRootId !== activeUserId && (
              <button 
                onClick={handleResetToMe}
                className="flex items-center gap-2 px-4 py-2 bg-[#071E2C] border border-[#28485A]/50 hover:bg-[#1B3343] text-white text-sm font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Back to My Node ({activeUserId})
              </button>
            )}
          </div>

          <div className="min-w-[1200px] flex justify-center pb-12 org-tree">
            <ul className="m-0 p-0">
              {rootUser ? renderTree(rootUser.id, 0, 'root') : <TreeNode empty />}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeNode({ name, id, left, right, active, empty, onClick, iconColor, isYou, packageName, paymentAmount }: any) {
  if (empty) {
    return (
      <div className="inline-flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[#1B3343] border-2 border-dashed border-[#28485A]/70 flex items-center justify-center mb-2 text-[#8FA3AF] cursor-pointer hover:bg-[#28485A]/50 transition-colors relative z-10 mx-auto">
          <UserIcon className="h-5 w-5" />
        </div>
        <div className="text-[10px] font-medium text-[#8FA3AF]">Empty</div>
      </div>
    );
  }

  const isBasic = packageName?.toLowerCase().includes('basic') || paymentAmount === 6699;

  return (
    <div className="inline-flex flex-col items-center group cursor-pointer relative z-10 mx-1" onClick={onClick}>
      <div className="relative">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2 ${active ? 'border-white/20' : 'border-red-900'} ${iconColor || 'bg-[#1B3343] text-white'}`}>
          <UserIcon className="h-6 w-6 drop-shadow-md" />
        </div>
        {isYou && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-500 font-bold text-xs lowercase tracking-wider drop-shadow-sm">
            you
          </div>
        )}
      </div>
      
      <div className="bg-[#132C3C] border border-[#28485A]/50 rounded-lg shadow-md p-2 text-center w-[115px] group-hover:border-blue-300 transition-all">
        <div className="text-xs font-semibold text-white truncate px-0.5">{name}</div>
        <div className="text-[10px] text-[#8FA3AF] font-mono">{id}</div>
        {packageName && (
          <div className={`text-[9px] font-bold px-1 py-0.5 rounded mt-1 truncate ${
            isBasic ? 'bg-[#6F9DB5]/20 text-[#6F9DB5] border border-[#6F9DB5]/40' : 'bg-[#35B779]/20 text-[#35B779] border border-[#35B779]/40'
          }`}>
            {packageName} (₹{(paymentAmount || 6699).toLocaleString('en-IN')})
          </div>
        )}
        <div className="flex justify-between text-[9px] font-medium border-t border-[#28485A]/30 pt-1 mt-1 px-1">
          <span className="text-[#8FA3AF]">L:{left}</span>
          <span className="text-[#6F9DB5]">R:{right}</span>
        </div>
      </div>
    </div>
  );
}
