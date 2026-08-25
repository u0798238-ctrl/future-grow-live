import React, { useState, useEffect } from 'react';
import { Search, Edit, UserX, UserCheck, Shield, LogIn, IndianRupee, Key, RefreshCw, Trash2, X, Eye, MapPin, Package, Phone, Mail, Calendar, CreditCard, CheckCircle, ExternalLink, Sliders, Award, DollarSign, ToggleLeft, ToggleRight, Check, GitCommit, ArrowDown, UserPlus, Sparkles, AlertCircle, AlertTriangle, PlusCircle, MinusCircle, Equal, Zap, Smartphone, Unlock, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMlmUsers, addMlmUser, deleteMlmUser, updateMlmUserStatus, updateMlmUser, setCurrentUserId, MlmUser, updateUserCommissionSettings, addCustomCommissionBonus, adjustUserFunds, activateUserAccount, rejectUserAccount, getPackageForUser, getTreePlacementSlotInfo } from '@/lib/mlmStore';
import { createActiveUserSession, forceResetUserSession, getActiveUserSessions } from '@/lib/sessionManager';
import { formatDateTime } from '@/lib/utils';

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionModal, setActionModal] = useState<{type: string, user: any} | null>(null);
  const [viewUserModal, setViewUserModal] = useState<MlmUser | null>(null);
  const [commissionModalUser, setCommissionModalUser] = useState<MlmUser | null>(null);
  const [customBonusAmount, setCustomBonusAmount] = useState('');
  const [customBonusReason, setCustomBonusReason] = useState('');
  
  // Fund management state
  const [fundAction, setFundAction] = useState<'deduct' | 'add' | 'set'>('deduct');
  const [fundAmountStr, setFundAmountStr] = useState<string>('');
  const [fundReason, setFundReason] = useState<string>('');

  // Activate Free ID / Pending modal state
  const [activateModalUser, setActivateModalUser] = useState<MlmUser | null>(null);
  const [activatePackage, setActivatePackage] = useState<'Premium' | 'Basic'>('Premium');
  const [activateProduct, setActivateProduct] = useState('Suit Length & Pant (Navy Blue Colour)');
  const [activateUtr, setActivateUtr] = useState('');

  const [users, setUsers] = useState<MlmUser[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean; title: string; text: string; onConfirm: () => void} | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const [addFormData, setAddFormData] = useState({ 
    name: '', 
    username: '',
    mobile: '', 
    email: '',
    dob: '',
    gender: 'male',
    address: '',
    city: '',
    state: '',
    pincode: '',
    panNumber: '',
    package: 'Premium', 
    selectedProduct: 'Suit Length & Pant (Green Colour)',
    sponsorId: 'FGPL000001',
    position: 'Left' as 'Left' | 'Right',
    password: '',
    utrNumber: '',
    status: 'Active' as 'Active' | 'Inactive',
    directEnabled: true,
    matchingEnabled: true,
    levelEnabled: true,
    withdrawalWithoutPanEnabled: false,
    isFreeId: false,
    placementMode: 'leaf' as 'leaf' | 'inBetween',
    targetParentId: 'FGPL000001'
  });

  const [modalFormData, setModalFormData] = useState({ 
    name: "", 
    mobile: "", 
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    panNumber: "",
    selectedProduct: "",
    package: "Premium", 
    status: "", 
    availableBalance: 0, 
    password: "" 
  });
  
  const navigate = useNavigate();

  const loadUsers = () => {
    setUsers(getMlmUsers());
    if (commissionModalUser) {
      const updated = getMlmUsers().find(u => u.id === commissionModalUser.id);
      if (updated) setCommissionModalUser(updated);
    }
  };

  useEffect(() => {
    loadUsers();
    window.addEventListener('mlm_update', loadUsers);
    return () => window.removeEventListener('mlm_update', loadUsers);
  }, []);

  const handleLoginAsUser = (userId: string) => {
    createActiveUserSession(userId);
    setCurrentUserId(userId);
    navigate('/user/dashboard');
  };

  const handleAddUser = () => {
    if (!addFormData.name?.trim() || !addFormData.mobile?.trim()) {
      showToast('Please fill out Full Name and Mobile Number.', 'error');
      return;
    }
    try {
      const isFree = Boolean(addFormData.isFreeId);
      const isBetween = addFormData.placementMode === 'inBetween';
      const freeUtr = `ADMIN-FREE-${Date.now().toString().slice(-6)}`;

      const newUser = addMlmUser({
        name: addFormData.name.trim(),
        username: addFormData.username ? addFormData.username.trim() : undefined,
        mobile: addFormData.mobile.trim(),
        email: addFormData.email ? addFormData.email.trim() : '',
        dob: addFormData.dob,
        gender: addFormData.gender,
        address: addFormData.address ? addFormData.address.trim() : '',
        city: addFormData.city ? addFormData.city.trim() : '',
        state: addFormData.state ? addFormData.state.trim() : '',
        pincode: addFormData.pincode ? addFormData.pincode.trim() : '',
        panNumber: addFormData.panNumber ? addFormData.panNumber.trim().toUpperCase() : '',
        package: isFree ? 'Free (Zero Commission)' : addFormData.package,
        selectedProduct: isFree ? 'Free ID (Zero Commission)' : addFormData.selectedProduct,
        sponsorId: addFormData.sponsorId || 'FGPL000001',
        position: addFormData.position || 'Left',
        password: addFormData.password?.trim() || '123456',
        utrNumber: isFree ? freeUtr : (addFormData.utrNumber?.trim() || 'MANUAL_ADMIN_ADD'),
        paymentAmount: isFree ? 0 : ((addFormData.package?.includes('Basic') || addFormData.package?.includes('6699')) ? 6699 : 8599),
        status: isFree ? 'Active' : addFormData.status,
        isFreeId: isFree,
        insertInBetween: isBetween,
        targetParentId: isBetween ? (addFormData.targetParentId || addFormData.sponsorId) : undefined,
        generatesDirect: isFree ? false : addFormData.directEnabled,
        generatesMatching: isFree ? false : addFormData.matchingEnabled,
        generatesLevel: isFree ? false : addFormData.levelEnabled,
        directEnabled: true, // Always default new user's earning capability to true
        matchingEnabled: true,
        levelEnabled: true,
        withdrawalWithoutPanEnabled: isFree ? true : addFormData.withdrawalWithoutPanEnabled
      });

      // Apply initial commission & withdrawal settings
      updateUserCommissionSettings(newUser.id, {
        generatesDirect: isFree ? false : addFormData.directEnabled,
        generatesMatching: isFree ? false : addFormData.matchingEnabled,
        generatesLevel: isFree ? false : addFormData.levelEnabled,
        directEnabled: true,
        matchingEnabled: true,
        levelEnabled: true,
        withdrawalWithoutPanEnabled: isFree ? true : addFormData.withdrawalWithoutPanEnabled
      });

      setIsAddModalOpen(false);
      setAddFormData({ 
        name: '', 
        username: '',
        mobile: '', 
        email: '',
        dob: '',
        gender: 'male',
        address: '',
        city: '',
        state: '',
        pincode: '',
        panNumber: '',
        package: 'Premium', 
        selectedProduct: 'Suit Length & Pant (Green Colour)',
        sponsorId: 'FGPL000001', 
        position: 'Left', 
        password: '',
        utrNumber: '',
        status: 'Active',
        directEnabled: true,
        matchingEnabled: true,
        levelEnabled: true,
        withdrawalWithoutPanEnabled: false,
        isFreeId: false,
        placementMode: 'leaf',
        targetParentId: 'FGPL000001'
      });
      loadUsers();
      if (isFree) {
        showToast(`⚡ Free ID ${newUser.id} (@${newUser.username}) created successfully with 0 commission!`, 'success');
      } else if (isBetween) {
        showToast(`⚡ User ID ${newUser.id} (@${newUser.username}) inserted in-between tree nodes!`, 'success');
      } else {
        showToast(`⚡ User ID ${newUser.id} (@${newUser.username}) created directly and added to network!`, 'success');
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to create user', 'error');
    }
  };

  const handleActionClick = (type: string, user: any) => {
    setActionModal({ type, user });
    if (type === 'funds') {
      setFundAction('deduct');
      setFundAmountStr('');
      setFundReason('');
    }
    setModalFormData({
      name: user.name || '',
      mobile: user.mobile || '',
      email: user.email || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      pincode: user.pincode || '',
      panNumber: user.panNumber || '',
      selectedProduct: user.selectedProduct || 'Shuit lanth & paint',
      package: user.package || 'Premium',
      status: user.status || 'Active',
      availableBalance: user.availableBalance || 0,
      password: user.password || ''
    });
  };

  const handleToggleCommission = (commissionType: 'directEnabled' | 'matchingEnabled' | 'levelEnabled' | 'withdrawalWithoutPanEnabled' | 'allowWithdrawal') => {
    if (!commissionModalUser) return;
    const current = commissionType === 'withdrawalWithoutPanEnabled'
      ? commissionModalUser.commissionSettings?.withdrawalWithoutPanEnabled === true
      : commissionModalUser.commissionSettings?.[commissionType] !== false;
    const newStatus = !current;

    // Immediately update local state for instant responsiveness
    setCommissionModalUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        commissionSettings: {
          ...(prev.commissionSettings || { directEnabled: true, matchingEnabled: true, levelEnabled: true }),
          [commissionType]: newStatus
        }
      };
    });

    // Update persistent store & recalculate all network commissions
    const updated = updateUserCommissionSettings(commissionModalUser.id, {
      [commissionType]: newStatus
    });

    if (updated) {
      setCommissionModalUser(updated);
    }
  };

  const handleQuickToggleNoPanWithdrawal = (user: MlmUser) => {
    const current = user.commissionSettings?.withdrawalWithoutPanEnabled === true;
    const newStatus = !current;
    
    updateUserCommissionSettings(user.id, {
      withdrawalWithoutPanEnabled: newStatus
    });

    const updatedUsers = getMlmUsers();
    setUsers(updatedUsers);

    if (commissionModalUser && commissionModalUser.id === user.id) {
      setCommissionModalUser(updatedUsers.find(u => u.id === user.id) || null);
    }
  };

  const handleGrantBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionModalUser) return;
    const amt = parseFloat(customBonusAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid bonus amount', 'error');
      return;
    }
    addCustomCommissionBonus(commissionModalUser.id, amt, customBonusReason.trim() || 'Admin Special Commission');
    setCustomBonusAmount('');
    setCustomBonusReason('');
    const fresh = getMlmUsers().find(u => u.id === commissionModalUser.id);
    if (fresh) setCommissionModalUser(fresh);
    showToast(`₹${amt} Commission / Bonus successfully credited to ${commissionModalUser.name} (${commissionModalUser.id})!`);
  };

  const openActivateModal = (user: MlmUser) => {
    setActivateModalUser(user);
    const isBasic = user.package?.toLowerCase().includes('basic');
    setActivatePackage(isBasic ? 'Basic' : 'Premium');
    setActivateProduct(
      isBasic 
        ? 'Suit Length (Single Piece)' 
        : 'Suit Length & Pant (Navy Blue Colour)'
    );
    setActivateUtr(user.utrNumber && !user.utrNumber.includes('FREE') ? user.utrNumber : `ACT-${Date.now().toString().slice(-6)}`);
  };

  const handleConfirmActivate = () => {
    if (!activateModalUser) return;
    const pkgPrice = activatePackage === 'Basic' ? 6699 : 8599;
    activateUserAccount(activateModalUser.id, {
      package: activatePackage,
      selectedProduct: activateProduct,
      paymentAmount: pkgPrice,
      utrNumber: activateUtr.trim() || `ACT-${Date.now().toString().slice(-6)}`
    });

    const sponsor = users.find(u => u.id === activateModalUser.sponsorId);
    const freshUsers = getMlmUsers();
    setUsers(freshUsers);
    const fresh = freshUsers.find(u => u.id === activateModalUser.id);
    if (fresh) {
      if (commissionModalUser) setCommissionModalUser(fresh);
      if (viewUserModal && viewUserModal.id === activateModalUser.id) setViewUserModal(fresh);
    }
    setActivateModalUser(null);
    showToast(`⚡ ID ${activateModalUser.id} (${activateModalUser.name}) successfully ACTIVATED! Direct commission credited to Sponsor ${sponsor?.name || activateModalUser.sponsorId || 'N/A'}. Matching & level commissions updated for all uplines!`);
  };

  const handleQuickActivate = (user: MlmUser) => {
    openActivateModal(user);
  };

  const handleQuickReject = (user: MlmUser) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reject Payment',
      text: `Are you sure you want to REJECT the payment for User ID ${user.id} (${user.name})?`,
      onConfirm: () => {
        rejectUserAccount(user.id);
        const fresh = getMlmUsers().find(u => u.id === user.id);
        if (fresh) {
          if (commissionModalUser) setCommissionModalUser(fresh);
          if (viewUserModal && viewUserModal.id === user.id) setViewUserModal(fresh);
        }
        showToast(`Payment for User ID ${user.id} (${user.name}) has been REJECTED.`, 'error');
        setConfirmDialog(null);
      }
    });
  };

  const handleDeactivate = (userId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Deactivate User',
      text: `Are you sure you want to DEACTIVATE User ID ${userId}?`,
      onConfirm: () => {
        updateMlmUserStatus(userId, 'Inactive');
        const fresh = getMlmUsers().find(u => u.id === userId);
        if (fresh) setCommissionModalUser(fresh);
        setConfirmDialog(null);
      }
    });
  };

  const handleConfirmAction = () => {
    if (!actionModal) return;

    try {
      switch (actionModal.type) {
        case 'delete':
          deleteMlmUser(actionModal.user.id);
          showToast(`User ID ${actionModal.user.id} has been deleted.`);
          break;
      case 'block':
        updateMlmUserStatus(actionModal.user.id, 'Blocked');
        forceResetUserSession(actionModal.user.id);
        loadUsers();
        showToast(`🔒 Account for User ID ${actionModal.user.id} (${actionModal.user.name}) is now LOCKED / BLOCKED.`, 'success');
        break;
      case 'unblock':
        updateMlmUserStatus(actionModal.user.id, 'Active');
        loadUsers();
        showToast(`🔓 Account for User ID ${actionModal.user.id} (${actionModal.user.name}) is now UNLOCKED / ACTIVE.`, 'success');
        break;
      case 'edit':
        updateMlmUser(actionModal.user.id, {
          name: modalFormData.name.trim(),
          mobile: modalFormData.mobile.trim(),
          email: modalFormData.email.trim(),
          address: modalFormData.address.trim(),
          city: modalFormData.city.trim(),
          state: modalFormData.state.trim(),
          pincode: modalFormData.pincode.trim(),
          panNumber: modalFormData.panNumber.trim().toUpperCase(),
          selectedProduct: modalFormData.selectedProduct,
          package: modalFormData.package,
          status: modalFormData.status as any
        });
        showToast(`Member profile updated successfully.`);
        break;
      case 'funds': {
        const amt = parseFloat(fundAmountStr);
        if (isNaN(amt) || amt < 0 || (fundAction !== 'set' && amt === 0)) {
          showToast('Please enter a valid amount (₹)', 'error');
          return;
        }
        adjustUserFunds(actionModal.user.id, fundAction, amt, fundReason.trim() || undefined);
        const actionText = fundAction === 'deduct' ? 'deducted/cut' : fundAction === 'add' ? 'added/credited' : 'set';
        showToast(`₹${amt.toLocaleString('en-IN')} successfully ${actionText} for ${actionModal.user.name} (${actionModal.user.id})!`);
        break;
      }
      case 'password':
        if (modalFormData.password.trim()) {
          updateMlmUser(actionModal.user.id, {
            password: modalFormData.password.trim()
          });
          showToast(`Password for user ID ${actionModal.user.id} (${actionModal.user.name}) has been successfully updated.`);
        } else {
          showToast('Please enter a valid password.', 'error');
          return;
        }
        break;
      case 'reset':
        updateMlmUser(actionModal.user.id, {
          availableBalance: 0,
          totalIncome: 0,
          matchingIncome: 0,
          directIncome: 0,
          levelIncome: 0,
          totalWithdrawn: 0,
          completedPairs: 0,
          directJoins: 0,
          leftMembers: 0,
          rightMembers: 0,
          transactions: []
        });
        showToast(`User business stats reset.`);
        break;
      }
    } catch (e: any) {
      showToast(e.message || 'An error occurred during this action.', 'error');
    }
    
    setActionModal(null);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 relative">
      {/* Custom Confirm Dialog Modal */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#132C3C] border border-[#28485A] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">{confirmDialog.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{confirmDialog.text}</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#28485A]">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="py-3 bg-[#1B3343] hover:bg-[#203D50] text-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="py-3 bg-[#1B3343] hover:bg-red-500/20 text-red-400 font-semibold transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating In-App Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toastMessage.type === 'error'
            ? 'bg-red-950 border-red-500 text-red-200'
            : 'bg-emerald-950 border-emerald-500 text-emerald-200'
        }`}>
          <CheckCircle className="w-5 h-5 text-[#35B779] shrink-0" />
          <span className="text-sm font-medium">{toastMessage.text}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Registered Users & Member Details</h2>
          <p className="text-sm text-gray-300">Complete list of members with addresses, products, phone numbers & KYC</p>
        </div>
      </div>

      <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">
        <div className="p-4 border-b border-[#28485A]/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="relative w-full lg:w-96 flex-shrink-0">
            <input 
              type="text" 
              placeholder="Search by ID, Name, Mobile, City..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#071E2C] border border-[#28485A]/50 rounded-lg text-sm text-white focus:outline-none focus:border-[#28485A] focus:ring-1 focus:ring-[#28485A]"
            />
            <Search className="w-4 h-4 text-gray-300 absolute left-3 top-2.5" />
          </div>
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide shrink-0">
            <button 
              onClick={() => {
                setAddFormData({
                  ...addFormData,
                  isFreeId: true,
                  package: 'Free (Admin Zero Commission)',
                  selectedProduct: 'Admin Free ID (Zero Commission)',
                  directEnabled: false,
                  matchingEnabled: false,
                  levelEnabled: false,
                  withdrawalWithoutPanEnabled: true
                });
                setIsAddModalOpen(true);
              }}
              className="flex-1 lg:flex-none shrink-0 whitespace-nowrap px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 border border-purple-400/40 shadow-lg shadow-purple-900/30"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              + Create Free ID
            </button>
            <button 
              onClick={() => {
                setAddFormData({
                  ...addFormData,
                  isFreeId: false,
                  package: 'Premium',
                  selectedProduct: 'Suit Length & Pant (Green Colour)',
                  directEnabled: true,
                  matchingEnabled: true,
                  levelEnabled: true,
                  withdrawalWithoutPanEnabled: false
                });
                setIsAddModalOpen(true);
              }}
              className="flex-1 lg:flex-none shrink-0 whitespace-nowrap px-4 py-2 bg-[#6F9DB5] text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              + Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-[#071E2C] text-xs uppercase font-medium text-[#8FA3AF]">
              <tr>
                <th className="px-5 py-4">User ID</th>
                <th className="px-5 py-4">Name & Username</th>
                <th className="px-5 py-4">Delivery Address</th>
                <th className="px-5 py-4">Package & Product</th>
                <th className="px-5 py-4">Commission Status</th>
                <th className="px-5 py-4">No-PAN Withdrawal</th>
                <th className="px-5 py-4">Account Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {filteredUsers.map((user) => {
                const comm = user.commissionSettings || {};
                const directOn = comm.directEnabled !== false;
                const matchOn = comm.matchingEnabled !== false;
                const levelOn = comm.levelEnabled !== false;
                const isNoPanWithdrawalOn = comm.withdrawalWithoutPanEnabled === true;
                const hasPan = Boolean(user.panNumber && user.panNumber.trim().length > 0);

                return (
                  <tr key={user.id} className="border-b border-[#28485A]/50 hover:bg-[#1B3343]/40 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-[#6F9DB5]">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white font-mono">{user.id}</div>
                      <div className="text-xs text-gray-300">{user.joined ? formatDateTime(user.joined) : 'N/A'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{user.name}</div>
                      {user.username ? (
                        <div className="text-xs text-emerald-400 font-mono mt-0.5">
                          @{user.username}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 font-mono mt-0.5">
                          {user.id}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      {user.address ? (
                        <div>
                          <div className="text-xs text-white truncate">{user.address}</div>
                          <div className="text-xs text-gray-300">{user.city}, {user.state} - {user.pincode}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 italic">Not provided</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {(() => {
                        if (user.isFreeId) {
                          return (
                            <div>
                              <div className="font-medium text-white text-xs flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-900/60 text-purple-200 border border-purple-400/50 shadow-sm flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-amber-300" /> Free ID (Admin)
                                </span>
                                <span className="text-purple-300 font-bold">(₹0 Free)</span>
                              </div>
                              <span className="text-[10px] font-medium text-purple-200/80 bg-purple-950/60 border border-purple-800/60 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                                Zero Commission ID
                              </span>
                            </div>
                          );
                        }

                        const isBasic = user.package?.toLowerCase().includes('basic') || user.paymentAmount === 6699;
                        const price = user.paymentAmount || (isBasic ? 6699 : 8599);
                        const prod = user.selectedProduct || (isBasic ? 'Shuit lanth (Single Piece)' : 'Shuit lanth & paint');
                        return (
                          <div>
                            <div className="font-medium text-white text-xs flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                isBasic 
                                  ? 'bg-[#6F9DB5]/20 text-[#6F9DB5] border border-[#6F9DB5]/40' 
                                  : 'bg-[#35B779]/20 text-[#35B779] border border-[#35B779]/40'
                              }`}>
                                {user.package || (isBasic ? 'Basic' : 'Premium')}
                              </span>
                              <span className="text-[#35B779] font-bold">(₹{price.toLocaleString('en-IN')})</span>
                            </div>
                            <span className="text-[11px] font-medium text-gray-300 bg-[#071E2C] border border-[#28485A]/60 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                              {prod}
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-4">
                      {user.isFreeId ? (
                        <div>
                          <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-purple-950 border border-purple-600/40 text-purple-300">
                            0 Commission (Free ID)
                          </span>
                          <div className="text-[10px] text-gray-400 mt-1">Direct: ₹0 • Pair: ₹0 • Lvl: ₹0</div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${directOn ? 'bg-blue-900/40 text-blue-300 border border-blue-600/30' : 'bg-gray-800 text-gray-300 line-through'}`}>
                              Dir {directOn ? '✓' : '✗'}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${matchOn ? 'bg-purple-900/40 text-purple-300 border border-purple-600/30' : 'bg-gray-800 text-gray-300 line-through'}`}>
                              Pair {matchOn ? '✓' : '✗'}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${levelOn ? 'bg-amber-900/40 text-amber-300 border border-amber-600/30' : 'bg-gray-800 text-gray-300 line-through'}`}>
                              Lvl {levelOn ? '✓' : '✗'}
                            </span>
                            {comm.customBonus ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-emerald-900/40 text-emerald-300 border border-[#6F9DB5]/30">
                                +₹{comm.customBonus}
                              </span>
                            ) : null}
                          </div>
                          <button 
                            onClick={() => setCommissionModalUser(user)}
                            className="text-[11px] text-[#35B779] hover:text-emerald-300 underline font-medium mt-1 inline-flex items-center gap-0.5"
                          >
                            <Sliders className="w-3 h-3" /> Manage Commission
                          </button>
                        </>
                      )}
                    </td>
                    {/* Dedicated No-PAN Withdrawal Column with Instant 1-Click Toggle */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1 text-xs">
                          {hasPan ? (
                            <span className="text-[#35B779] font-mono font-medium text-[11px] bg-emerald-950/60 border border-[#6F9DB5]/40 px-1.5 py-0.5 rounded">
                              PAN: {user.panNumber}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-[11px] bg-gray-800/80 px-1.5 py-0.5 rounded">
                              No PAN
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuickToggleNoPanWithdrawal(user)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isNoPanWithdrawalOn ? 'bg-cyan-600' : 'bg-gray-700'
                            }`}
                            title={isNoPanWithdrawalOn ? 'Click to Disable No-PAN Withdrawal' : 'Click to Enable Withdrawal Without PAN'}
                          >
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[8px] font-bold ${
                                isNoPanWithdrawalOn ? 'translate-x-5 text-cyan-800' : 'translate-x-0 text-gray-300'
                              }`}
                            >
                              {isNoPanWithdrawalOn ? 'ON' : 'OFF'}
                            </span>
                          </button>
                          <span className={`text-[10px] font-medium ${isNoPanWithdrawalOn ? 'text-cyan-300 font-semibold' : 'text-gray-300'}`}>
                            {isNoPanWithdrawalOn ? 'Allowed (No PAN)' : 'Locked'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        {user.isFreeId ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-950/80 text-purple-200 border border-purple-400/50 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-300" /> Free ID (0 Commission)
                          </span>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${
                            user.status === 'Active' ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 font-bold' : 
                            user.status === 'Blocked' ? 'bg-red-950/90 text-red-300 border border-red-500/50 font-bold' : 'bg-amber-900/30 text-amber-300 border border-amber-500/30'
                          }`}>
                            {user.status === 'Active' && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                            {user.status === 'Blocked' ? 'Blocked' : user.status === 'Active' ? 'Active' : (user.paymentStatus === 'Rejected' ? 'Rejected' : 'Pending')}
                          </span>
                        )}
                        {(user.isFreeId || user.status !== 'Active') && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <button 
                              onClick={() => openActivateModal(user)}
                              className="text-[11px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded flex items-center gap-1 font-bold transition-all border border-emerald-400/50 shadow-sm"
                              title="Activate ID, Verify Payment & Distribute Commissions to Sponsor & Uplines"
                            >
                              <Zap className="w-3 h-3 text-amber-300" /> Activate (एक्टिवेट)
                            </button>
                            <button 
                              onClick={() => handleQuickReject(user)}
                              className="text-[11px] bg-red-900/70 hover:bg-red-800 text-red-200 px-2 py-0.5 rounded flex items-center gap-1 font-medium transition-colors border border-red-500/40"
                              title="Reject Payment"
                            >
                              <X className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1.5 flex-wrap w-[200px] ml-auto">
                        {(user.isFreeId || user.status !== 'Active') && (
                          <button 
                            onClick={() => openActivateModal(user)}
                            className="p-1.5 bg-gradient-to-r from-purple-900/60 to-emerald-900/60 border border-emerald-500/50 rounded-md text-emerald-300 hover:text-white transition-colors" 
                            title="Activate ID & Distribute Commissions (Direct, Pair, Level)"
                          >
                            <Zap className="w-4 h-4 text-amber-300" />
                          </button>
                        )}
                        {/* Commission Settings Button */}
                        <button 
                          onClick={() => setCommissionModalUser(user)}
                          className="p-1.5 bg-[#071E2C] border border-[#6F9DB5]/50 rounded-md text-[#35B779] hover:bg-[#6F9DB5]/20 transition-colors" 
                          title="Manage Commissions (Direct, Binary/Pair, Level, Special Bonus)"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>
                        {/* View Full Details Button */}
                        <button 
                          onClick={() => setViewUserModal(user)}
                          className="p-1.5 bg-[#071E2C] border border-cyan-500/40 rounded-md text-cyan-400 hover:bg-cyan-500/20 transition-colors" 
                          title="View Full Registration Details (Address, KYC, Payment)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleLoginAsUser(user.id)}
                          className="p-1.5 bg-[#071E2C] rounded-md text-blue-400 hover:text-blue-300 transition-colors" 
                          title="Login to User Dashboard"
                        >
                          <LogIn className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleActionClick('edit', user)}
                          className="p-1.5 bg-[#071E2C] rounded-md text-[#8FA3AF] hover:text-white transition-colors" title="Edit Profile Details">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleActionClick('funds', user)}
                          className="p-1.5 bg-[#071E2C] rounded-md text-[#35B779] hover:text-emerald-300 transition-colors" title="Edit Funds / Balance">
                          <IndianRupee className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleActionClick('password', user)}
                          className="p-1.5 bg-[#071E2C] rounded-md text-yellow-500 hover:text-yellow-400 transition-colors" title="Create New Password">
                          <Key className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleActionClick('reset', user)}
                          className="p-1.5 bg-[#071E2C] rounded-md text-purple-400 hover:text-purple-300 transition-colors" title="Reset Account Data">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        {user.status === 'Blocked' ? (
                          <button 
                            onClick={() => handleActionClick('unblock', user)}
                            className="p-1.5 bg-[#071E2C] rounded-md text-emerald-500 hover:text-emerald-400 transition-colors" title="Unblock Account">
                            <Unlock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleActionClick('block', user)}
                            className="p-1.5 bg-[#071E2C] rounded-md text-orange-500 hover:text-orange-400 transition-colors" title="Block Account">
                            <Lock className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleActionClick('delete', user)}
                          className="p-1.5 bg-[#071E2C] rounded-md text-red-500 hover:text-red-400 transition-colors" title="Delete User ID">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[#28485A]/30 flex justify-between items-center text-sm text-gray-300">
          <span>Total {filteredUsers.length} Users</span>
        </div>
      </div>

      {/* View Full User Registration Details Modal */}
      {viewUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#132C3C] border border-[#28485A]/60 rounded-2xl w-full max-w-2xl p-6 relative my-8 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setViewUserModal(null)} 
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3 border-b border-[#28485A]/40 pb-4 mb-5">
              <div className="w-12 h-12 bg-[#6F9DB5]/20 border border-[#6F9DB5]/30 rounded-xl flex items-center justify-center text-[#35B779] font-semibold font-mono text-lg">
                {viewUserModal.id.slice(-3)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  {viewUserModal.name}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    viewUserModal.status === 'Active' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'
                  }`}>
                    {viewUserModal.status}
                  </span>
                </h3>
                <p className="text-xs text-gray-300 font-mono">User ID: {viewUserModal.id} • Joined: {viewUserModal.joined ? formatDateTime(viewUserModal.joined) : 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-5 text-sm">
              {/* Personal Info Grid */}
              <div className="bg-[#071E2C] p-4 rounded-xl border border-[#6F9DB5]/40 shadow-[0_0_10px_rgba(111,157,181,0.1)] hover:border-[#6F9DB5]/80 transition-all">
                <h4 className="text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider mb-3">Personal & Contact Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-300 block">Mobile Number:</span>
                    <span className="text-white font-medium text-sm">{viewUserModal.mobile}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 block">Email Address:</span>
                    <span className="text-white font-medium text-sm">{viewUserModal.email || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 block">Date of Birth:</span>
                    <span className="text-white font-medium">{viewUserModal.dob || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 block">Gender:</span>
                    <span className="text-white font-medium capitalize">{viewUserModal.gender || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 block">PAN / KYC Number:</span>
                    <span className="text-white font-mono font-medium">{viewUserModal.panNumber || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 block">Current Password:</span>
                    <span className="text-yellow-400 font-mono font-medium">{viewUserModal.password || '••••••••'}</span>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-[#28485A]/30 flex items-center justify-between">
                    <div>
                      <span className="text-gray-300 block">Withdrawal Without PAN (Admin Exemption):</span>
                      <span className={`text-xs font-medium ${viewUserModal.commissionSettings?.withdrawalWithoutPanEnabled ? 'text-cyan-300' : 'text-amber-400'}`}>
                        {viewUserModal.commissionSettings?.withdrawalWithoutPanEnabled ? '✅ ENABLED (User can withdraw without PAN)' : '🔒 DISABLED (PAN Card Mandatory)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleQuickToggleNoPanWithdrawal(viewUserModal);
                        const updated = getMlmUsers().find(u => u.id === viewUserModal.id);
                        if (updated) setViewUserModal(updated);
                      }}
                      className="px-3 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-500/40 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {viewUserModal.commissionSettings?.withdrawalWithoutPanEnabled ? 'Turn OFF' : 'Turn ON Exemption'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-[#071E2C] p-4 rounded-xl border border-[#6F9DB5]/40 shadow-[0_0_10px_rgba(111,157,181,0.1)] hover:border-[#6F9DB5]/80 transition-all">
                <h4 className="text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#35B779]" />
                  Product Delivery Address
                </h4>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-gray-300">Street Address: </span>
                    <span className="text-white font-medium">{viewUserModal.address || 'Not provided'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div>
                      <span className="text-gray-300 block">City / District:</span>
                      <span className="text-white font-medium">{viewUserModal.city || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-300 block">State:</span>
                      <span className="text-white font-medium">{viewUserModal.state || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-300 block">PIN Code:</span>
                      <span className="text-white font-mono font-medium">{viewUserModal.pincode || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package & Product Choice */}
              <div className="bg-[#071E2C] p-4 rounded-xl border border-[#6F9DB5]/40 shadow-[0_0_10px_rgba(111,157,181,0.1)] hover:border-[#6F9DB5]/80 transition-all">
                <h4 className="text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#35B779]" />
                  Selected Package & Product
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-300 block">Package:</span>
                    <span className="text-white font-semibold text-sm">{viewUserModal.package} (₹8,599)</span>
                  </div>
                  <div>
                    <span className="text-gray-300 block">Selected Product Choice:</span>
                    <span className="text-[#35B779] font-medium text-sm">{viewUserModal.selectedProduct || 'Shuit lanth & paint'}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 block">Referral Sponsor ID:</span>
                    <span className="text-white font-mono font-medium">{viewUserModal.sponsorId || 'Root'}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 block">Binary Position:</span>
                    <span className="text-white font-medium">{viewUserModal.position || 'Left'}</span>
                  </div>
                </div>
              </div>

              {/* Payment & UTR Proof */}
              <div className="bg-[#071E2C] p-4 rounded-xl border border-[#6F9DB5]/40 shadow-[0_0_10px_rgba(111,157,181,0.1)] hover:border-[#6F9DB5]/80 transition-all">
                <h4 className="text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#35B779]" />
                  Payment & Transaction Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-300 block">Payment Amount:</span>
                    <span className="text-[#35B779] font-semibold text-sm">₹{viewUserModal.paymentAmount || 8599}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 block">Transaction ID / UTR Number:</span>
                    <span className="text-white font-mono font-semibold text-sm">{viewUserModal.utrNumber || 'HTX893742893'}</span>
                  </div>
                </div>

                {viewUserModal.paymentProof && (
                  <div className="mt-3 pt-3 border-t border-[#28485A]/30">
                    <span className="text-gray-300 text-xs block mb-2">Uploaded Payment Screenshot:</span>
                    <img 
                      src={viewUserModal.paymentProof} 
                      alt="Payment Proof" 
                      className="max-h-48 rounded-lg border border-[#28485A]/50 object-contain bg-black/40"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-5 mt-5 flex items-center justify-between gap-3 border-t border-[#28485A]/30">
              <div className="flex items-center gap-2">
                {viewUserModal.status !== 'Active' ? (
                  <>
                    <button 
                      onClick={() => handleQuickActivate(viewUserModal)}
                      className="px-4 py-2 rounded-lg bg-[#35B779] hover:bg-[#2fa069] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950/40"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Payment & Activate ID
                    </button>
                    <button 
                      onClick={() => handleQuickReject(viewUserModal)}
                      className="px-3.5 py-2 rounded-lg bg-red-900/80 hover:bg-red-800 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-500/40"
                    >
                      <X className="w-3.5 h-3.5" /> Reject Payment
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-[#35B779]" /> Account Verified & Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setViewUserModal(null)} 
                  className="px-4 py-2 rounded-lg bg-[#071E2C] text-white text-xs font-medium hover:text-white transition-colors border border-[#28485A]/30"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    const u = viewUserModal;
                    setViewUserModal(null);
                    handleActionClick('edit', u);
                  }} 
                  className="px-4 py-2 rounded-lg bg-[#1B3343] hover:bg-[#28485A] text-white text-xs font-medium transition-colors"
                >
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal Overlay */}
      {actionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setActionModal(null)} 
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-semibold text-white mb-4">
              {actionModal.type === 'edit' && `Edit Profile: ${actionModal.user.name}`}
              {actionModal.type === 'funds' && `Manage Funds: ${actionModal.user.id}`}
              {actionModal.type === 'password' && `New Password: ${actionModal.user.id}`}
              {actionModal.type === 'reset' && `Reset Account: ${actionModal.user.id}`}
              {actionModal.type === 'block' && `Block User: ${actionModal.user.name}`}
              {actionModal.type === 'unblock' && `Unblock User: ${actionModal.user.name}`}
              {actionModal.type === 'delete' && `Delete User: ${actionModal.user.id}`}
            </h3>
            
            <div className="space-y-4">
              {actionModal.type === 'edit' && ( 
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  <div>
                    <label className="text-xs font-medium text-gray-300">Full Name</label>
                    <input type="text" value={modalFormData.name} onChange={e => setModalFormData({...modalFormData, name: e.target.value})} className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-300">Mobile Number</label>
                      <input type="text" value={modalFormData.mobile} onChange={e => setModalFormData({...modalFormData, mobile: e.target.value})} className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300">Email Address</label>
                      <input type="email" value={modalFormData.email} onChange={e => setModalFormData({...modalFormData, email: e.target.value})} className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300">Delivery Street Address</label>
                    <input type="text" value={modalFormData.address} onChange={e => setModalFormData({...modalFormData, address: e.target.value})} className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-300">City</label>
                      <input type="text" value={modalFormData.city} onChange={e => setModalFormData({...modalFormData, city: e.target.value})} className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300">State</label>
                      <input type="text" value={modalFormData.state} onChange={e => setModalFormData({...modalFormData, state: e.target.value})} className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300">PIN Code</label>
                      <input type="text" value={modalFormData.pincode} onChange={e => setModalFormData({...modalFormData, pincode: e.target.value})} className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-300">Package</label>
                      <select 
                        value={modalFormData.package} 
                        onChange={e => {
                          const newPkg = e.target.value;
                          const defaultProd = newPkg === 'Basic' ? 'Shuit lanth (Single Piece)' : 'Shuit lanth & paint';
                          setModalFormData({...modalFormData, package: newPkg, selectedProduct: defaultProd});
                        }} 
                        className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]"
                      >
                        <option value="Premium">Premium (₹8,599)</option>
                        <option value="Basic">Basic (₹6,699)</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-300">Status</label>
                      <select value={modalFormData.status} onChange={e => setModalFormData({...modalFormData, status: e.target.value})} className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300">Selected Product (Items for {modalFormData.package})</label>
                    <select 
                      value={modalFormData.selectedProduct} 
                      onChange={e => setModalFormData({...modalFormData, selectedProduct: e.target.value})} 
                      className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]"
                    >
                      {modalFormData.package === 'Basic' ? (
                        <>
                          <option value="Suit Length (navy blue Colour - Single Set)">1. Suit Length (navy blue Colour - Single Set)</option>
                          <option value="Pant (Green Colour - Single Set)">2. Pant (Green Colour - Single Set)</option>
                          <option value="Banarasi Saree (Single Piece)">3. Banarasi Saree (Single Piece)</option>
                          <option value="Healthcare & Wellness Package" disabled>4. Healthcare & Wellness Package (Coming Soon)</option>
                        </>
                      ) : (
                        <>
                          <option value="Suit Length & Pant (Green Colour)">1. Suit Length & Pant (Green Colour)</option>
                          <option value="Suit Length & Pant (Navy Blue Colour)">2. Suit Length & Pant (Navy Blue Colour)</option>
                          <option value="Double Banarasi Saree (Special Edition)">3. Double Banarasi Saree (Special Edition)</option>
                          <option value="Suit Length & Banarasi Saree Combo">4. Suit Length & Banarasi Saree Combo</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              )}
              
              {actionModal.type === 'funds' && (() => {
                const currentBal = Number(actionModal.user.availableBalance) || 0;
                const enteredAmt = parseFloat(fundAmountStr) || 0;
                let calculatedNewBal = currentBal;
                if (fundAction === 'deduct') {
                  calculatedNewBal = Math.max(0, currentBal - enteredAmt);
                } else if (fundAction === 'add') {
                  calculatedNewBal = currentBal + enteredAmt;
                } else if (fundAction === 'set') {
                  calculatedNewBal = Math.max(0, enteredAmt);
                }

                return (
                  <div className="space-y-4">
                    {/* Current Balance Display */}
                    <div className="bg-[#071E2C] p-4 rounded-xl border border-[#28485A]/50 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider block">Current Available Balance</span>
                        <span className="text-2xl font-bold text-white font-mono">₹{currentBal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        <span>User: <strong className="text-white">{actionModal.user.name}</strong></span>
                        <span className="block font-mono text-[#35B779]">{actionModal.user.id}</span>
                      </div>
                    </div>

                    {/* Action Selector: Deduct vs Add vs Set */}
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1.5 uppercase tracking-wider">
                        Select Action (ऑपरेशन चुनें)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setFundAction('deduct')}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                            fundAction === 'deduct'
                              ? 'bg-red-950/80 border-red-500 text-red-300 shadow-md shadow-red-950/50'
                              : 'bg-[#071E2C] border-[#28485A]/40 text-gray-400 hover:text-white'
                          }`}
                        >
                          <MinusCircle className="w-4 h-4 text-red-400" />
                          <span>Cut / Deduct (-)</span>
                          <span className="text-[10px] font-normal text-red-400/80">पैसे काटें</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFundAction('add')}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                            fundAction === 'add'
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/50'
                              : 'bg-[#071E2C] border-[#28485A]/40 text-gray-400 hover:text-white'
                          }`}
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-400" />
                          <span>Add Funds (+)</span>
                          <span className="text-[10px] font-normal text-emerald-400/80">पैसे बढ़ाएं</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFundAction('set')}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                            fundAction === 'set'
                              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/50'
                              : 'bg-[#071E2C] border-[#28485A]/40 text-gray-400 hover:text-white'
                          }`}
                        >
                          <Equal className="w-4 h-4 text-cyan-400" />
                          <span>Set Exact (=)</span>
                          <span className="text-[10px] font-normal text-cyan-400/80">नया बैलेंस सेट करें</span>
                        </button>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">
                        {fundAction === 'deduct' && 'Amount to Deduct / Cut (₹) *'}
                        {fundAction === 'add' && 'Amount to Add / Credit (₹) *'}
                        {fundAction === 'set' && 'New Target Available Balance (₹) *'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={fundAmountStr}
                          onChange={e => setFundAmountStr(e.target.value)}
                          placeholder="e.g. 500"
                          className="w-full bg-[#071E2C] border-2 border-[#28485A] focus:border-cyan-400 text-white text-base font-bold font-mono rounded-xl p-3 pl-8 focus:outline-none transition-colors"
                          autoFocus
                        />
                        {fundAmountStr && (
                          <button
                            type="button"
                            onClick={() => setFundAmountStr('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-[#1B3343] px-2 py-0.5 rounded"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Quick Amount Buttons */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {['100', '500', '1000', '2000', '5000', '10000'].map(amt => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setFundAmountStr(amt)}
                            className="px-2.5 py-1 bg-[#071E2C] hover:bg-[#1B3343] border border-[#28485A]/50 rounded-lg text-xs font-mono text-gray-300 hover:text-white transition-colors"
                          >
                            +{amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reason / Note Input */}
                    <div>
                      <label className="text-xs font-medium text-gray-300 block mb-1">Reason / Note (वजह)</label>
                      <input
                        type="text"
                        value={fundReason}
                        onChange={e => setFundReason(e.target.value)}
                        placeholder={
                          fundAction === 'deduct'
                            ? 'e.g. Payment Cut by Admin / Advance Adjustment'
                            : fundAction === 'add'
                            ? 'e.g. Manual Fund Credit / Bonus'
                            : 'e.g. Balance Reset / Correction'
                        }
                        className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Live Preview Box */}
                    {enteredAmt > 0 && (
                      <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        fundAction === 'deduct'
                          ? 'bg-red-950/40 border-red-500/40 text-red-200'
                          : fundAction === 'add'
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                      }`}>
                        <div>
                          <span className="font-semibold block">Calculation Preview:</span>
                          <span className="text-[11px] text-gray-300">
                            ₹{currentBal.toLocaleString('en-IN')} {fundAction === 'deduct' ? `- ₹${enteredAmt.toLocaleString('en-IN')}` : fundAction === 'add' ? `+ ₹${enteredAmt.toLocaleString('en-IN')}` : `➔`}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-gray-400 block">Resulting Balance</span>
                          <span className="font-mono text-base font-bold text-white">
                            ₹{calculatedNewBal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
              
              {actionModal.type === 'password' && ( 
                <div>
                  <label className="text-xs font-medium text-gray-300">Set New Password</label>
                  <input type="text" value={modalFormData.password} onChange={e => setModalFormData({...modalFormData, password: e.target.value})} placeholder="Enter new password..." className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" />
                </div>
              )}
              
              {actionModal.type === 'reset' && ( 
                <div className="space-y-4">
                  <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span>Confirm Income & Wallet Reset</span>
                    </div>
                    <p className="text-xs text-gray-200">
                      Are you sure you want to reset all financial statistics for <strong>{actionModal.user.name} ({actionModal.user.id})</strong>?
                    </p>
                    <div className="bg-[#071E2C] p-3 rounded-xl border border-[#28485A]/50 text-xs space-y-1 mt-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Current Available Balance:</span>
                        <span className="font-bold text-white font-mono">₹{actionModal.user.availableBalance?.toLocaleString('en-IN') || 0}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Direct Incomes Earned:</span>
                        <span className="font-bold text-emerald-400 font-mono">₹{actionModal.user.directIncome?.toLocaleString('en-IN') || 0}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Binary Matching Earned:</span>
                        <span className="font-bold text-emerald-400 font-mono">₹{actionModal.user.matchingIncome?.toLocaleString('en-IN') || 0}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-amber-300/90 pt-1">
                      ⚠️ This will reset their available wallet and income counters to ₹0. Their placement in the binary tree will remain active.
                    </p>
                  </div>
                </div>
              )}
              
              {(actionModal.type === 'block' || actionModal.type === 'unblock') && ( 
                <div className="p-4 bg-[#071E2C] border border-[#28485A]/60 rounded-2xl space-y-2">
                  <p className="text-sm font-semibold text-white">
                    Confirm Account {actionModal.type === 'block' ? 'Suspension (Block)' : 'Re-activation (Unblock)'}
                  </p>
                  <p className="text-xs text-gray-300">
                    Are you sure you want to <strong>{actionModal.type.toUpperCase()}</strong> member <strong>{actionModal.user.name} ({actionModal.user.id})</strong>?
                  </p>
                </div>
              )}
              
              {actionModal.type === 'delete' && ( 
                <div className="space-y-4">
                  <div className="p-4 bg-red-950/50 border-2 border-red-500/50 rounded-2xl space-y-3 shadow-lg">
                    <div className="flex items-center gap-2 text-red-300 font-bold text-base">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                      <span>Permanent User Deletion Warning</span>
                    </div>
                    
                    <div className="bg-[#071E2C] p-3.5 rounded-xl border border-red-500/30 text-xs space-y-1.5">
                      <div className="flex justify-between text-gray-300">
                        <span>User ID:</span>
                        <span className="font-mono font-bold text-red-400">{actionModal.user.id}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Member Name:</span>
                        <span className="font-semibold text-white">{actionModal.user.name}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Registered Mobile:</span>
                        <span className="font-mono text-gray-200">{actionModal.user.mobile}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Wallet Balance:</span>
                        <span className="font-mono font-bold text-emerald-400">₹{actionModal.user.availableBalance?.toLocaleString('en-IN') || 0}</span>
                      </div>
                    </div>

                    <p className="text-xs text-red-200 leading-relaxed">
                      ⚠️ <strong>Note:</strong> केवल यही चुनी गई ID (<strong>{actionModal.user.id}</strong>) स्थायी रूप से हटाई जाएगी। बाकी सभी टीम मेंबर्स सुरक्षित रहेंगे। (Only this single user ID will be deleted. All other members remain safe).
                    </p>
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex justify-end gap-3 border-t border-[#28485A]/30 mt-6">
                <button 
                  onClick={() => setActionModal(null)} 
                  className="px-5 py-2.5 rounded-xl bg-[#071E2C] text-gray-300 text-sm font-semibold hover:text-white transition-colors border border-[#28485A]/50"
                >
                  Cancel (रद्द करें)
                </button>
                <button 
                  onClick={handleConfirmAction} 
                  className={`px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 ${
                    actionModal.type === 'delete' 
                      ? 'bg-red-600 hover:bg-red-500 shadow-red-950/80' 
                      : actionModal.type === 'reset'
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/80'
                      : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  {actionModal.type === 'delete' && 'Yes, Permanently Delete ID (हटाएं)'}
                  {actionModal.type === 'reset' && 'Yes, Reset All Incomes (रिसेट करें)'}
                  {actionModal.type === 'block' && 'Yes, Block Account'}
                  {actionModal.type === 'unblock' && 'Yes, Unblock Account'}
                  {actionModal.type === 'edit' && 'Save Changes'}
                  {actionModal.type === 'password' && 'Update Password'}
                  {actionModal.type === 'funds' && 'Submit Adjustment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activate Member / Free ID Modal */}
      {activateModalUser && (() => {
        const sponsor = users.find(u => u.id === activateModalUser.sponsorId);
        const pkgPrice = activatePackage === 'Basic' ? 6699 : 8599;
        const directCommission = activatePackage === 'Basic' ? 0 : 1500;

        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#132C3C] rounded-2xl border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(53,183,121,0.25)] hover:border-emerald-400 transition-all duration-300 w-full max-w-xl p-6 relative my-8 max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setActivateModalUser(null)} 
                className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="border-b border-[#28485A]/40 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      Activate Account ID (आईडी एक्टिवेट करें)
                    </h3>
                    <p className="text-xs text-gray-300">
                      Activate Free / Pending ID, verify payment & distribute held commissions to sponsor and uplines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Target User Info Summary */}
              <div className="bg-[#071E2C] border border-[#28485A]/60 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px]">Member Name</span>
                  <span className="font-semibold text-white text-sm">{activateModalUser.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">User ID</span>
                  <span className="font-mono font-bold text-cyan-300 text-sm">{activateModalUser.id}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Registered Mobile</span>
                  <span className="text-gray-200">{activateModalUser.mobile}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Current ID Type</span>
                  <span className="font-semibold text-purple-300">
                    {activateModalUser.isFreeId ? 'Free ID (0 Commission)' : 'Pending Inactive ID'}
                  </span>
                </div>
              </div>

              {/* Sponsor & Commission Impact Banner */}
              <div className="bg-gradient-to-r from-emerald-950/70 via-[#071E2C] to-cyan-950/70 border border-emerald-500/40 rounded-xl p-4 mb-5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Automatic Commission Distribution on Activation:
                  </span>
                </div>
                <div className="bg-[#071E2C]/80 rounded-lg p-2.5 border border-[#28485A]/50 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Direct Sponsor ({activateModalUser.sponsorId}):</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {sponsor ? `${sponsor.name} ` : ''}➔ +₹{directCommission.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Matching Pair Income:</span>
                    <span className="text-cyan-300 font-semibold">Binary Tree Uplines Updated Automatically</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Level Milestone Income:</span>
                    <span className="text-amber-300 font-semibold">Upline 10-Levels Recalculated</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300 border-t border-[#28485A]/40 pt-1 mt-1">
                    <span>Member Withdrawal Permission:</span>
                    <span className="text-[#35B779] font-bold">Unlocked (Can withdraw earned wallet balance)</span>
                  </div>
                </div>
              </div>

              {/* Package Selection */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-2">Select Activation Package *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActivatePackage('Premium');
                        setActivateProduct('Suit Length & Pant (Navy Blue Colour)');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        activatePackage === 'Premium'
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                          : 'bg-[#071E2C] border-[#28485A]/50 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-white">Premium Package</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">₹8,599</span>
                      </div>
                      <p className="text-[11px] text-gray-300">Direct Income: ₹1,500 • Daily Capping: ₹10,000</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActivatePackage('Basic');
                        setActivateProduct('Suit Length (Single Piece)');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        activatePackage === 'Basic'
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                          : 'bg-[#071E2C] border-[#28485A]/50 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-white">Basic Package</span>
                        <span className="font-mono font-bold text-amber-400 text-sm">₹6,699</span>
                      </div>
                      <p className="text-[11px] text-gray-300">Direct Income: ₹0 • Daily Capping: ₹10,000</p>
                    </button>
                  </div>
                </div>

                {/* Product Selection */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">Delivered Product *</label>
                  <select
                    value={activateProduct}
                    onChange={(e) => setActivateProduct(e.target.value)}
                    className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Suit Length & Pant (Navy Blue Colour)">Suit Length & Pant (Navy Blue Colour)</option>
                    <option value="Suit Length & Pant (Green Colour)">Suit Length & Pant (Green Colour)</option>
                    <option value="Suit Length & Pant (Black Colour)">Suit Length & Pant (Black Colour)</option>
                    <option value="Suit Length (Single Piece)">Suit Length (Single Piece)</option>
                  </select>
                </div>

                {/* Payment & UTR Reference */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    Payment UTR / Transaction Reference Number
                  </label>
                  <input
                    type="text"
                    value={activateUtr}
                    onChange={(e) => setActivateUtr(e.target.value)}
                    placeholder="e.g. UTR1234567890 or ACT-998811"
                    className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400 uppercase"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Enter the bank/UPI UTR number provided by member when paying the ₹{pkgPrice.toLocaleString('en-IN')} package fee.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-[#28485A]/30 mt-6">
                <button 
                  onClick={() => setActivateModalUser(null)} 
                  className="px-4 py-2 rounded-lg bg-[#071E2C] text-white text-sm font-medium hover:text-white transition-colors border border-[#28485A]/30"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmActivate} 
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold transition-all flex items-center gap-2 border border-emerald-400/50 shadow-lg shadow-emerald-950/40"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  ⚡ Confirm & Activate ID Now (आईडी एक्टिवेट करें)
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add User Modal */}
      {isAddModalOpen && (() => {
        const slotInfo = addFormData.placementMode === 'inBetween' 
          ? getTreePlacementSlotInfo(addFormData.targetParentId || 'FGPL000001', addFormData.position)
          : null;

        return (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_20px_rgba(111,157,181,0.2)] hover:border-[#6F9DB5] transition-all duration-300 w-full max-w-2xl p-6 relative my-8 max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="border-b border-[#28485A]/40 pb-4 mb-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {addFormData.isFreeId ? (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <span className="text-purple-300">Free ID Create (Zero Commission)</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 text-[#35B779]" />
                        <span>Add New User / Member</span>
                      </>
                    )}
                  </h3>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  {addFormData.isFreeId 
                    ? 'Free ID: Is ID se kisi ko bhi Direct, Matching ya Level commission nahi jayega.' 
                    : 'Standard Member ID: Full commission and network activation enabled.'}
                </p>
              </div>

              {/* ID Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#071E2C] rounded-xl border border-[#28485A]/60 mb-5">
                <button
                  type="button"
                  onClick={() => setAddFormData({
                    ...addFormData,
                    isFreeId: false,
                    package: 'Premium',
                    selectedProduct: 'Suit Length & Pant (Green Colour)',
                    directEnabled: true,
                    matchingEnabled: true,
                    levelEnabled: true,
                    withdrawalWithoutPanEnabled: false
                  })}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    !addFormData.isFreeId 
                      ? 'bg-[#6F9DB5] text-white shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Standard Paid Member ID
                </button>
                <button
                  type="button"
                  onClick={() => setAddFormData({
                    ...addFormData,
                    isFreeId: true,
                    package: 'Free (Zero Commission)',
                    selectedProduct: 'Free ID (Zero Commission)',
                    directEnabled: false,
                    matchingEnabled: false,
                    levelEnabled: false,
                    withdrawalWithoutPanEnabled: true
                  })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    addFormData.isFreeId 
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md border border-purple-400/40' 
                      : 'text-purple-300 hover:text-purple-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Free ID (0 Commission)
                </button>
              </div>

              {/* Free ID Notice Banner */}
              {addFormData.isFreeId && (
                <div className="bg-purple-950/60 border border-purple-500/40 rounded-xl p-3.5 mb-5 text-xs text-purple-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Free ID Rule:</span>
                    Is ID ko create karne par kisi bhi up-line sponsor ya parent ko koi Direct Commission (₹0), Matching Commission (₹0), ya Level Commission (₹0) nahi milega. Na hi is ID ko commission milega.
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="Enter full name"
                      value={addFormData.name}
                      onChange={(e) => setAddFormData({...addFormData, name: e.target.value})}
                      className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1.5">Mobile Number *</label>
                    <input 
                      type="text" 
                      placeholder="Enter mobile number"
                      value={addFormData.mobile}
                      onChange={(e) => setAddFormData({...addFormData, mobile: e.target.value})}
                      className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1.5">Username (Used for Login & Referral)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400 text-sm">@</span>
                      <input 
                        type="text" 
                        placeholder="e.g. rajeshkumar"
                        value={addFormData.username}
                        onChange={(e) => setAddFormData({...addFormData, username: e.target.value.replace(/^@/, '').toLowerCase().trim()})}
                        className="w-full bg-[#071E2C] border border-[#28485A]/50 pl-7 pr-3 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5] lowercase" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="member@gmail.com"
                      value={addFormData.email}
                      onChange={(e) => setAddFormData({...addFormData, email: e.target.value})}
                      className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]" 
                    />
                  </div>
                </div>

                {/* Tree Placement Strategy Selector */}
                <div className="bg-[#071E2C] p-4 rounded-xl border border-[#28485A]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#8FA3AF] uppercase tracking-wider flex items-center gap-1.5">
                      <GitCommit className="w-3.5 h-3.5 text-[#35B779]" />
                      Binary Tree Placement Mode
                    </label>
                    <span className="text-[11px] text-[#35B779] font-mono">Admin Advanced Placement</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAddFormData({...addFormData, placementMode: 'leaf'})}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        addFormData.placementMode === 'leaf'
                          ? 'bg-[#132C3C] border-[#6F9DB5] text-white shadow-sm'
                          : 'bg-[#071E2C] border-[#28485A]/40 text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">Auto Leaf Placement</div>
                      <div className="text-[10px] text-gray-300 mt-0.5">Places under sponsor at the deepest bottom branch</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAddFormData({...addFormData, placementMode: 'inBetween'})}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        addFormData.placementMode === 'inBetween'
                          ? 'bg-[#132C3C] border-purple-500 text-white shadow-sm ring-1 ring-purple-500/50'
                          : 'bg-[#071E2C] border-[#28485A]/40 text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-xs text-purple-300 flex items-center gap-1">
                        <ArrowDown className="w-3 h-3 text-amber-300" />
                        Place Anywhere / In-Between Nodes
                      </div>
                      <div className="text-[10px] text-gray-300 mt-0.5">Insert ID directly between two existing IDs in tree</div>
                    </button>
                  </div>

                  {/* Standard Placement Fields */}
                  {addFormData.placementMode === 'leaf' ? (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#28485A]/30">
                      <div>
                        <label className="text-xs font-medium text-gray-300 block mb-1.5">Sponsor / Referral ID</label>
                        <input 
                          type="text" 
                          placeholder="Referral Code"
                          value={addFormData.sponsorId}
                          onChange={(e) => setAddFormData({...addFormData, sponsorId: e.target.value.toUpperCase()})}
                          className="w-full bg-[#132C3C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5] uppercase font-mono" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-300 block mb-1.5">Placement Leg</label>
                        <select 
                          value={addFormData.position}
                          onChange={(e) => setAddFormData({...addFormData, position: e.target.value as any})}
                          className="w-full bg-[#132C3C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]"
                        >
                          <option value="Left">Left Leg</option>
                          <option value="Right">Right Leg</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    /* In-Between Custom Placement Fields with Slot Inspector */
                    <div className="space-y-3 pt-2 border-t border-purple-500/30">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-purple-300 block mb-1.5">Target Parent ID (Direct Parent)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. FGPL000001"
                            value={addFormData.targetParentId}
                            onChange={(e) => setAddFormData({...addFormData, targetParentId: e.target.value.toUpperCase(), sponsorId: e.target.value.toUpperCase()})}
                            className="w-full bg-[#132C3C] border border-purple-500/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400 uppercase font-mono" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-purple-300 block mb-1.5">Target Branch Leg</label>
                          <select 
                            value={addFormData.position}
                            onChange={(e) => setAddFormData({...addFormData, position: e.target.value as any})}
                            className="w-full bg-[#132C3C] border border-purple-500/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                          >
                            <option value="Left">Left Position</option>
                            <option value="Right">Right Position</option>
                          </select>
                        </div>
                      </div>

                      {/* Slot Occupancy Live Feedback */}
                      {slotInfo && (
                        <div className="p-3 rounded-lg bg-[#132C3C] border border-[#28485A]/60 text-xs">
                          {!slotInfo.parentUser ? (
                            <div className="text-red-400 flex items-center gap-1.5 font-medium">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              Target Parent ID ({addFormData.targetParentId}) does not exist. Please enter a valid ID.
                            </div>
                          ) : slotInfo.occupiedUser ? (
                            <div className="space-y-1">
                              <div className="text-amber-300 font-semibold flex items-center gap-1.5">
                                <ArrowDown className="w-4 h-4 text-amber-400 shrink-0" />
                                In-Between Placement Active:
                              </div>
                              <div className="text-gray-300">
                                Parent <span className="text-white font-mono font-bold">{slotInfo.parentUser.name} ({slotInfo.parentUser.id})</span> already has <span className="text-cyan-300 font-mono font-bold">{slotInfo.occupiedUser.name} ({slotInfo.occupiedUser.id})</span> on the <span className="text-white font-bold">{addFormData.position}</span> side.
                              </div>
                              <div className="text-emerald-400 font-medium pt-1">
                                ➔ Creating this ID will cleanly place it between <span className="underline">{slotInfo.parentUser.name}</span> and <span className="underline">{slotInfo.occupiedUser.name}</span>, shifting {slotInfo.occupiedUser.name}'s entire branch down under this new ID.
                              </div>
                            </div>
                          ) : (
                            <div className="text-emerald-400 font-medium flex items-center gap-1.5">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                              Slot is OPEN: New ID will be placed directly as the {addFormData.position} child of {slotInfo.parentUser.name} ({slotInfo.parentUser.id}).
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-1.5">Street Delivery Address</label>
                  <input 
                    type="text" 
                    placeholder="Street / Colony / Landmark"
                    value={addFormData.address}
                    onChange={(e) => setAddFormData({...addFormData, address: e.target.value})}
                    className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1.5">City</label>
                    <input 
                      type="text" 
                      placeholder="City"
                      value={addFormData.city}
                      onChange={(e) => setAddFormData({...addFormData, city: e.target.value})}
                      className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1.5">State</label>
                    <input 
                      type="text" 
                      placeholder="State"
                      value={addFormData.state}
                      onChange={(e) => setAddFormData({...addFormData, state: e.target.value})}
                      className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-300 block mb-1.5">PIN Code</label>
                    <input 
                      type="text" 
                      placeholder="PIN Code"
                      value={addFormData.pincode}
                      onChange={(e) => setAddFormData({...addFormData, pincode: e.target.value})}
                      className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]" 
                    />
                  </div>
                </div>

                {!addFormData.isFreeId && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-300 block mb-1.5">Package</label>
                        <select 
                          value={addFormData.package}
                          onChange={(e) => {
                            const newPkg = e.target.value;
                            const defaultProd = newPkg === 'Basic' ? 'Shuit lanth (Single Piece)' : 'Shuit lanth & paint';
                            setAddFormData({...addFormData, package: newPkg, selectedProduct: defaultProd});
                          }}
                          className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]"
                        >
                          <option value="Premium">Premium (₹8,599)</option>
                          <option value="Basic">Basic (₹6,699)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-300 block mb-1.5">Account / Payment Status</label>
                        <select 
                          value={addFormData.status}
                          onChange={(e) => setAddFormData({...addFormData, status: e.target.value as any})}
                          className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]"
                        >
                          <option value="Active">Active (Payment Received & Verified)</option>
                          <option value="Inactive">Inactive / Pending (No Commissions)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-300 block mb-1.5">Select Product Item (Items for {addFormData.package} Package)</label>
                      <select 
                        value={addFormData.selectedProduct}
                        onChange={(e) => setAddFormData({...addFormData, selectedProduct: e.target.value})}
                        className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]"
                      >
                        {addFormData.package === 'Basic' ? (
                          <>
                            <option value="Suit Length (navy blue Colour - Single Set)">1. Suit Length (navy blue Colour - Single Set)</option>
                            <option value="Pant (Green Colour - Single Set)">2. Pant (Green Colour - Single Set)</option>
                            <option value="Banarasi Saree (Single Piece)">3. Banarasi Saree (Single Piece)</option>
                            <option value="Healthcare & Wellness Package" disabled>4. Healthcare & Wellness Package (Coming Soon)</option>
                          </>
                        ) : (
                          <>
                            <option value="Suit Length & Pant (Green Colour)">1. Suit Length & Pant (Green Colour)</option>
                            <option value="Suit Length & Pant (Navy Blue Colour)">2. Suit Length & Pant (Navy Blue Colour)</option>
                            <option value="Double Banarasi Saree (Special Edition)">3. Double Banarasi Saree (Special Edition)</option>
                            <option value="Suit Length & Banarasi Saree Combo">4. Suit Length & Banarasi Saree Combo</option>
                          </>
                        )}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-1.5">Login Password</label>
                  <input 
                    type="text" 
                    placeholder="Create password (default: 123456)"
                    value={addFormData.password}
                    onChange={(e) => setAddFormData({...addFormData, password: e.target.value})}
                    className="w-full bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#6F9DB5]" 
                  />
                </div>

                {/* Commission Permission Toggles in Add User Modal */}
                {!addFormData.isFreeId ? (
                  <div className="bg-[#071E2C] p-3.5 rounded-xl border border-[#28485A]/40 space-y-2.5">
                    <label className="text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider block">
                      Generate Commissions for Upline? (For this placement)
                    </label>
                    <p className="text-[10px] text-gray-400 mb-2">
                      If unchecked, the sponsor/upline will NOT receive this income from this specific ID.
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <label className="flex items-center gap-2 p-2 bg-[#132C3C] rounded-lg border border-[#28485A]/30 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={addFormData.directEnabled} 
                          onChange={e => setAddFormData({...addFormData, directEnabled: e.target.checked})}
                          className="accent-[#6F9DB5] rounded"
                        />
                        <span className="text-white font-medium">Direct (₹1,500)</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 bg-[#132C3C] rounded-lg border border-[#28485A]/30 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={addFormData.matchingEnabled} 
                          onChange={e => setAddFormData({...addFormData, matchingEnabled: e.target.checked})}
                          className="accent-[#6F9DB5] rounded"
                        />
                        <span className="text-white font-medium">Pair (₹1,000)</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 bg-[#132C3C] rounded-lg border border-[#28485A]/30 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={addFormData.levelEnabled} 
                          onChange={e => setAddFormData({...addFormData, levelEnabled: e.target.checked})}
                          className="accent-[#6F9DB5] rounded"
                        />
                        <span className="text-white font-medium">Level Income</span>
                      </label>
                    </div>
                    <div className="pt-2 border-t border-[#28485A]/20">
                      <label className="flex items-center gap-2.5 p-2.5 bg-[#132C3C] rounded-lg border border-cyan-500/30 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={addFormData.withdrawalWithoutPanEnabled} 
                          onChange={e => setAddFormData({...addFormData, withdrawalWithoutPanEnabled: e.target.checked})}
                          className="accent-cyan-500 rounded"
                        />
                        <div>
                          <span className="text-cyan-300 font-medium text-xs block">Allow Withdrawal Without PAN Card (Admin Special Exemption)</span>
                          <span className="text-gray-300 text-[10px] block">If checked, this member can request payouts even without submitting a PAN Card.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-500/30 text-xs text-purple-200">
                    <span className="font-semibold text-white">🔒 Zero Commission Lock:</span> Commission toggles are disabled for Free IDs to prevent unauthorized bonuses or system payouts.
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 flex justify-end gap-3 border-t border-[#28485A]/30">
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-4 py-2 rounded-lg bg-[#071E2C] text-white text-sm font-medium hover:text-white transition-colors border border-[#28485A]/30"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddUser}
                  className={`px-6 py-2 rounded-lg text-white text-sm font-semibold transition-all ${
                    addFormData.isFreeId 
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 shadow-lg shadow-purple-900/40 border border-purple-400/40' 
                      : 'bg-[#6F9DB5] hover:bg-emerald-700'
                  }`}
                >
                  {addFormData.isFreeId ? 'Create Free ID' : 'Create Member ID'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Dedicated Commission & Status Management Modal */}
      {commissionModalUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#132C3C] border border-[#6F9DB5]/50 rounded-2xl w-full max-w-xl p-6 relative my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              onClick={() => setCommissionModalUser(null)} 
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3 border-b border-[#28485A]/40 pb-4 mb-5">
              <div className="w-12 h-12 bg-[#6F9DB5]/20 border border-[#6F9DB5]/40 rounded-xl flex items-center justify-center text-[#35B779]">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  Commission & ID Control
                </h3>
                <p className="text-xs text-gray-300 font-mono">
                  Member: <strong className="text-white">{commissionModalUser.name}</strong> ({commissionModalUser.id}){commissionModalUser.username ? ` • @${commissionModalUser.username}` : ''}
                </p>
              </div>
            </div>

            <div className="space-y-5 text-sm">
              {/* Account Activation & Payment Verification */}
              <div className="bg-[#071E2C] p-4 rounded-xl border border-[#6F9DB5]/40 shadow-[0_0_10px_rgba(111,157,181,0.1)] hover:border-[#6F9DB5]/80 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-semibold text-[#35B779] uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> ID Activation & Payment Status
                    </h4>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Only Active (Paid) IDs receive commission and generate income in network.
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    commissionModalUser.status === 'Active' ? 'bg-emerald-900/40 text-emerald-300 border border-[#6F9DB5]/40' : 'bg-yellow-900/40 text-yellow-300 border border-yellow-500/40'
                  }`}>
                    {commissionModalUser.status}
                  </span>
                </div>
                
                {commissionModalUser.status !== 'Active' ? (
                  <button
                    onClick={() => handleQuickActivate(commissionModalUser)}
                    className="w-full mt-3 py-2 bg-[#6F9DB5] hover:bg-[#6F9DB5] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Confirm Payment & Activate ID Now
                  </button>
                ) : (
                  <div className="flex items-center justify-between pt-2 border-t border-[#28485A]/20 text-xs">
                    <span className="text-emerald-300 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> ID is Active & Verified
                    </span>
                    <button
                      onClick={() => updateMlmUserStatus(commissionModalUser.id, 'Inactive')}
                      className="text-xs text-yellow-400 hover:underline"
                    >
                      Set to Inactive
                    </button>
                  </div>
                )}
              </div>

              {/* Commission Types On / Off Switches */}
              <div className="bg-[#071E2C] p-4 rounded-xl border border-[#6F9DB5]/40 shadow-[0_0_10px_rgba(111,157,181,0.1)] hover:border-[#6F9DB5]/80 transition-all space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider">
                    Commission Types Eligibility (Admin Control)
                  </h4>
                  <span className="text-[11px] text-[#35B779]">Click switch to toggle ON/OFF</span>
                </div>

                {/* Direct Commission Switch */}
                {(() => {
                  const isDirectOn = commissionModalUser.commissionSettings?.directEnabled !== false;
                  return (
                    <div 
                      onClick={() => handleToggleCommission('directEnabled')}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isDirectOn 
                          ? 'bg-[#1B3343]/30 border-[#6F9DB5]/50 hover:bg-[#1B3343]/50' 
                          : 'bg-[#132C3C] border-[#35576A]/60 opacity-85 hover:border-gray-600'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">Direct Sponsor Commission</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                            isDirectOn ? 'bg-emerald-950/80 text-emerald-300 border border-[#6F9DB5]/40' : 'bg-red-950/80 text-red-400 border border-red-500/40'
                          }`}>
                            {isDirectOn ? 'ON (₹1,500 - Unlimited)' : 'OFF (DISABLED)'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">₹1,500 per direct referral (Unlimited income - No capping)</div>
                      </div>
                      
                      {/* Interactive Toggle Slider */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCommission('directEnabled');
                        }}
                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isDirectOn ? 'bg-[#6F9DB5]' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[9px] font-bold ${
                            isDirectOn ? 'translate-x-7 text-emerald-700' : 'translate-x-0 text-gray-300'
                          }`}
                        >
                          {isDirectOn ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    </div>
                  );
                })()}

                {/* Matching / Pair Commission Switch */}
                {(() => {
                  const isMatchOn = commissionModalUser.commissionSettings?.matchingEnabled !== false;
                  const userPkg = getPackageForUser(commissionModalUser);
                  const cappingLimit = userPkg.capping || (userPkg.price === 6699 ? 5000 : 10000);
                  const maxPairs = Math.floor(cappingLimit / (userPkg.binaryIncome || 1000));
                  return (
                    <div 
                      onClick={() => handleToggleCommission('matchingEnabled')}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isMatchOn 
                          ? 'bg-[#1B3343]/30 border-purple-500/50 hover:bg-[#1B3343]/50' 
                          : 'bg-[#132C3C] border-[#35576A]/60 opacity-85 hover:border-gray-600'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">Matching / Pair Commission</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                            isMatchOn ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40' : 'bg-red-950/80 text-red-400 border border-red-500/40'
                          }`}>
                            {isMatchOn ? `ON (₹${cappingLimit.toLocaleString('en-IN')}/Day Capping)` : 'OFF (DISABLED)'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">
                          ₹1,000/pair up to ₹{cappingLimit.toLocaleString('en-IN')} per day (Max {maxPairs} pairs). Pairs &gt; {maxPairs} automatically flush to Company (Admin).
                          {(commissionModalUser.flushedMatchingIncome || 0) > 0 && (
                            <span className="block text-amber-400 font-semibold mt-0.5">
                              ⚡ ₹{commissionModalUser.flushedMatchingIncome.toLocaleString('en-IN')} overflow flushed to Company (Admin)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Interactive Toggle Slider */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCommission('matchingEnabled');
                        }}
                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isMatchOn ? 'bg-purple-600' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[9px] font-bold ${
                            isMatchOn ? 'translate-x-7 text-purple-700' : 'translate-x-0 text-gray-300'
                          }`}
                        >
                          {isMatchOn ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    </div>
                  );
                })()}

                {/* Level Income Switch */}
                {(() => {
                  const isLevelOn = commissionModalUser.commissionSettings?.levelEnabled !== false;
                  return (
                    <div 
                      onClick={() => handleToggleCommission('levelEnabled')}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isLevelOn 
                          ? 'bg-[#1B3343]/30 border-amber-500/50 hover:bg-[#1B3343]/50' 
                          : 'bg-[#132C3C] border-[#35576A]/60 opacity-85 hover:border-gray-600'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">Level Income</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                            isLevelOn ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' : 'bg-red-950/80 text-red-400 border border-red-500/40'
                          }`}>
                            {isLevelOn ? 'ON (Unlimited)' : 'OFF (DISABLED)'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">Level milestone rewards (Unlimited income - No capping)</div>
                      </div>

                      {/* Interactive Toggle Slider */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCommission('levelEnabled');
                        }}
                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isLevelOn ? 'bg-amber-600' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[9px] font-bold ${
                            isLevelOn ? 'translate-x-7 text-amber-700' : 'translate-x-0 text-gray-300'
                          }`}
                        >
                          {isLevelOn ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Withdrawal & PAN Card Control (Admin Exemption) */}
              <div className="bg-[#071E2C] p-4 rounded-xl border border-[#6F9DB5]/40 shadow-[0_0_10px_rgba(111,157,181,0.1)] hover:border-[#6F9DB5]/80 transition-all space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Withdrawal & PAN Control (Admin Only)
                  </h4>
                  <span className="text-[11px] text-gray-300">
                    PAN: <span className="font-mono text-white font-semibold">{commissionModalUser.panNumber || 'Not Provided'}</span>
                  </span>
                </div>

                {/* Without PAN Withdrawal Toggle */}
                {(() => {
                  const isWithoutPanAllowed = commissionModalUser.commissionSettings?.withdrawalWithoutPanEnabled === true;
                  return (
                    <div 
                      onClick={() => handleToggleCommission('withdrawalWithoutPanEnabled')}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isWithoutPanAllowed 
                          ? 'bg-[#1B3343]/30 border-cyan-500/50 hover:bg-[#1B3343]/50' 
                          : 'bg-[#132C3C] border-[#35576A]/60 opacity-85 hover:border-gray-600'
                      }`}
                    >
                      <div className="space-y-0.5 max-w-[75%]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-white text-sm">Withdrawal Without PAN Card</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                            isWithoutPanAllowed ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40' : 'bg-gray-800 text-gray-300 border border-gray-600/40'
                          }`}>
                            {isWithoutPanAllowed ? 'ON (Special Approval Active)' : 'OFF (PAN Required)'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">
                          {isWithoutPanAllowed 
                            ? '✅ Member CAN withdraw to Bank/UPI without PAN Card as per your approval.' 
                            : '⚠️ Member must submit a valid PAN Card in KYC to withdraw unless you turn this ON.'}
                        </div>
                      </div>

                      {/* Interactive Toggle Slider */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCommission('withdrawalWithoutPanEnabled');
                        }}
                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isWithoutPanAllowed ? 'bg-cyan-600' : 'bg-gray-700'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[9px] font-bold ${
                            isWithoutPanAllowed ? 'translate-x-7 text-cyan-800' : 'translate-x-0 text-gray-300'
                          }`}
                        >
                          {isWithoutPanAllowed ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    </div>
                  );
                })()}

                {/* Overall Withdrawal Permission Toggle */}
                {(() => {
                  const isWithdrawalAllowed = commissionModalUser.commissionSettings?.allowWithdrawal !== false;
                  return (
                    <div 
                      onClick={() => handleToggleCommission('allowWithdrawal')}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isWithdrawalAllowed 
                          ? 'bg-[#1B3343]/30 border-[#6F9DB5]/50 hover:bg-[#1B3343]/50' 
                          : 'bg-red-950/20 border-red-500/40 opacity-85 hover:border-red-500'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">Account Withdrawal Permission</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                            isWithdrawalAllowed ? 'bg-emerald-950/80 text-emerald-300 border border-[#6F9DB5]/40' : 'bg-red-950/80 text-red-400 border border-red-500/40'
                          }`}>
                            {isWithdrawalAllowed ? 'ENABLED' : 'BLOCKED'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">Master switch to allow or pause payouts for this user</div>
                      </div>

                      {/* Interactive Toggle Slider */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCommission('allowWithdrawal');
                        }}
                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isWithdrawalAllowed ? 'bg-[#6F9DB5]' : 'bg-red-700'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[9px] font-bold ${
                            isWithdrawalAllowed ? 'translate-x-7 text-emerald-700' : 'translate-x-0 text-red-100'
                          }`}
                        >
                          {isWithdrawalAllowed ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Special Admin Custom Bonus / Incentive Form */}
              <div className="bg-[#071E2C] p-4 rounded-xl border border-[#6F9DB5]/40 shadow-[0_0_10px_rgba(111,157,181,0.1)] hover:border-[#6F9DB5]/80 transition-all">
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Credit Special Commission / Incentive Bonus
                </h4>
                <p className="text-xs text-gray-300 mb-3">
                  Admin can manually credit special performance rewards or custom commission directly into this member's wallet.
                </p>
                <form onSubmit={handleGrantBonus} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Bonus Amount (₹) *</label>
                      <input 
                        type="number"
                        placeholder="e.g. 5000"
                        value={customBonusAmount}
                        onChange={(e) => setCustomBonusAmount(e.target.value)}
                        className="w-full bg-[#132C3C] border border-[#28485A]/50 p-2 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-300 block mb-1">Reason / Note</label>
                      <input 
                        type="text"
                        placeholder="e.g. Top Leader Incentive"
                        value={customBonusReason}
                        onChange={(e) => setCustomBonusReason(e.target.value)}
                        className="w-full bg-[#132C3C] border border-[#28485A]/50 p-2 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <IndianRupee className="w-3.5 h-3.5" /> Credit Commission Bonus to User Wallet
                  </button>
                </form>

                {commissionModalUser.commissionSettings?.customBonus ? (
                  <div className="mt-3 pt-3 border-t border-[#28485A]/20 text-xs flex justify-between text-white">
                    <span>Total Custom Bonus Credited:</span>
                    <span className="font-semibold text-amber-400">₹{commissionModalUser.commissionSettings.customBonus}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="pt-5 mt-5 flex justify-end gap-3 border-t border-[#28485A]/30">
              <button 
                onClick={() => setCommissionModalUser(null)} 
                className="px-6 py-2 rounded-lg bg-[#6F9DB5] hover:bg-[#6F9DB5] text-white text-sm font-semibold transition-colors"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
