import { INITIAL_LEVELS } from '../pages/admin/LevelIncomePage';
import { pushMlmStateToFirebase } from './firebase';
import { pushMlmStateToSupabase as rawPushSupabase } from './supabase';

export const pushMlmStateToSupabase = async (key: string, value: any) => {
  try {
    await rawPushSupabase(key, value);
  } catch (e) {
    console.warn('Supabase sync note:', e);
  }
  try {
    await pushMlmStateToFirebase(key, value);
  } catch (e) {
    console.warn('Firebase sync note:', e);
  }
};

export interface Transaction {
  id: string;
  type: 'Direct' | 'Matching' | 'Level' | 'Withdrawal' | 'Deposit';
  amount: number;
  description: string;
  date: string;
  status?: "Pending" | "Approved" | "Rejected";
  netAmount?: number;
  tds?: number;
  adminCharge?: number;
  utr?: string;
  screenshot?: string;
  withdrawalMethod?: string;
  upiId?: string;
  bankAccount?: string;
  ifscCode?: string;
}

export interface MlmPackage {
  id: number;
  name: string;
  price: number;
  directIncome: number;
  binaryIncome: number;
  capping: number;
  status: 'Active' | 'Inactive';
  productChoices?: string[];
}

export interface SystemSettings {
  registrationOpen: boolean;
  defaultFee: number;
  directIncome: number;
  binaryMatching: number;
  dailyCappingPairs: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  adminDeductionPercent: number;
  epinGeneration: 'admin' | 'all';
  adminPin?: string;
  emergencyWeekendWithdrawals?: boolean;
}

export interface CompanyGift {
  id: string;
  title: string;
  category: 'Gadget' | 'Vehicle' | 'Cash / Gold' | 'Travel' | 'Kit' | 'Special';
  image: string;
  iconName: string;
  description: string;
  approxValue: number;
  targetCriteria?: string;
  status: 'Active' | 'Inactive';
}

export interface AwardedGift {
  id: string;
  giftId?: string;
  giftTitle: string;
  giftImage?: string;
  iconName?: string;
  category?: string;
  approxValue: number;
  userId: string;
  userName: string;
  userMobile?: string;
  awardedBy: string;
  awardedDate: string;
  reason: string;
  status: 'Awarded' | 'Dispatched' | 'Delivered';
  trackingNumber?: string;
  courierPartner?: string;
  deliveryDate?: string;
  adminNote?: string;
}

export const DEFAULT_COMPANY_GIFTS: CompanyGift[] = [
  {
    id: 'GIFT-01',
    title: 'Apple iPhone 15 / Galaxy S24',
    category: 'Gadget',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    iconName: 'Smartphone',
    description: 'Latest Flagship 5G Smartphone with 256GB Storage & high performance camera for top promoters.',
    approxValue: 75000,
    targetCriteria: 'Achieve 30+ Direct Sponsors or 100 Matching Pairs',
    status: 'Active'
  },
  {
    id: 'GIFT-02',
    title: 'Dell / HP Core i7 Business Laptop',
    category: 'Gadget',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    iconName: 'Laptop',
    description: 'High-speed business workstation with 16GB RAM & SSD for leader presentations and team webinars.',
    approxValue: 65000,
    targetCriteria: 'Achieve 20+ Direct Active Sponsors & Fast Team Growth',
    status: 'Active'
  },
  {
    id: 'GIFT-03',
    title: 'Hero Splendor / Honda Shine Bike',
    category: 'Vehicle',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
    iconName: 'Bike',
    description: 'Brand New 125cc Executive Bike fully paid on road by Future Grow Private Limited.',
    approxValue: 95000,
    targetCriteria: 'Achieve 250+ Matching Binary Pairs in team',
    status: 'Active'
  },
  {
    id: 'GIFT-04',
    title: 'Tata Punch / Maruti Swift Car',
    category: 'Vehicle',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    iconName: 'Car',
    description: 'Dream SUV / Hatchback Car down payment & gift voucher awarded by company management.',
    approxValue: 650000,
    targetCriteria: 'Crown / Diamond Leader rank with 1500+ Team Pairs',
    status: 'Active'
  },
  {
    id: 'GIFT-05',
    title: '10 Gram 24K Pure Gold Coin',
    category: 'Cash / Gold',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&auto=format&fit=crop&q=80',
    iconName: 'Coins',
    description: 'Hallmarked 99.9% Pure Gold Coin with official certificate of appreciation from company.',
    approxValue: 80000,
    targetCriteria: 'Top Monthly Revenue Earner of the Month',
    status: 'Active'
  },
  {
    id: 'GIFT-06',
    title: 'Goa / Thailand International Tour (4N/5D)',
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    iconName: 'Plane',
    description: '5-Star Luxury Holiday Package including flights, food, and leadership seminar.',
    approxValue: 125000,
    targetCriteria: 'Star Executive Leader ranking & steady month-over-month expansion',
    status: 'Active'
  },
  {
    id: 'GIFT-07',
    title: 'Future Grow VIP Executive Kit & Trophy',
    category: 'Kit',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    iconName: 'Award',
    description: 'Custom Golden Recognition Shield, Suit Length, Diary, Smart Watch & Parker Pen Set.',
    approxValue: 15000,
    targetCriteria: 'Best Rising Star Award for dedicated new members',
    status: 'Active'
  }
];

export const INITIAL_AWARDED_GIFTS: AwardedGift[] = [
  {
    id: 'AWARD-001',
    giftId: 'GIFT-01',
    giftTitle: 'Apple iPhone 15 Pro 5G',
    giftImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    category: 'Gadget',
    approxValue: 75000,
    userId: 'FGPL000001',
    userName: 'Ramesh Sharma (Super Admin)',
    userMobile: '9876543210',
    awardedBy: 'Future Grow Board of Directors',
    awardedDate: '2026-08-15',
    reason: 'Exceptional Leadership & Record Direct Team Building across North India',
    status: 'Delivered',
    trackingNumber: 'BLUEDART-88992211',
    courierPartner: 'BlueDart Express',
    deliveryDate: '2026-08-18',
    adminNote: 'Handed over personally during corporate summit'
  }
];

export const DEFAULT_PACKAGES: MlmPackage[] = [
  { 
    id: 1, 
    name: 'Premium', 
    price: 8599, 
    directIncome: 1500, 
    binaryIncome: 1000, 
    capping: 10000, 
    status: 'Active',
    productChoices: [
      'Suit Length & Pant (Navy Blue Colour)',
      'Suit Length & Vanarsi Sadi',
      'Double Set Vanarsi Sadi'
    ]
  },
  { 
    id: 2, 
    name: 'Basic', 
    price: 6699, 
    directIncome: 0, 
    binaryIncome: 1000, 
    capping: 5000, 
    status: 'Active',
    productChoices: [
      'Suit Length (navy blue Colour - Single Set)',
      'Vanarsi Sadi - Single Set',
      'Healthcare & Wellness Package'
    ]
  },
];

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  registrationOpen: true,
  defaultFee: 8599,
  directIncome: 1500,
  binaryMatching: 1000,
  dailyCappingPairs: 10,
  minWithdrawal: 500,
  maxWithdrawal: 50000,
  adminDeductionPercent: 10,
  epinGeneration: 'admin',
  emergencyWeekendWithdrawals: false
};

export const getMlmPackages = (): MlmPackage[] => {
  try {
    // Migration check: ensure both 8599 (Premium) and 6699 (Basic) exist with updated products
    const migrationKey = 'mlm_pkg_restore_8599_6699_saree_v11';
    const isMigrated = localStorage.getItem(migrationKey);

    if (!isMigrated) {
      localStorage.setItem('mlm_packages', JSON.stringify(DEFAULT_PACKAGES));
      localStorage.setItem(migrationKey, 'true');
      return DEFAULT_PACKAGES;
    }

    const raw = localStorage.getItem('mlm_packages');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure both packages are present in the list
        const has8599 = parsed.some(p => p.price === 8599 || p.name?.toLowerCase().includes('premium'));
        const has6699 = parsed.some(p => p.price === 6699 || p.name?.toLowerCase().includes('basic'));
        if (!has8599 || !has6699) {
          localStorage.setItem('mlm_packages', JSON.stringify(DEFAULT_PACKAGES));
          return DEFAULT_PACKAGES;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem('mlm_packages', JSON.stringify(DEFAULT_PACKAGES));
  return DEFAULT_PACKAGES;
};

export const getPackagePriceBreakdown = (price: number) => {
  if (price === 8599) {
    return {
      baseAmount: 7052.00,
      gstAmount: 1547.00,
      totalPayable: 8599.00,
      gstLabel: 'GST'
    };
  }
  if (price === 6699) {
    return {
      baseAmount: 5493.18,
      gstAmount: 1205.82,
      totalPayable: 6699.00,
      gstLabel: 'GST'
    };
  }
  const base = Number((price / 1.18).toFixed(2));
  const gst = Number((price - base).toFixed(2));
  return {
    baseAmount: base,
    gstAmount: gst,
    totalPayable: price,
    gstLabel: 'GST (18%)'
  };
};

export const getPackageForUser = (user: Partial<MlmUser> | null | undefined): MlmPackage => {
  const packages = getMlmPackages();
  if (!user) return packages[0] || DEFAULT_PACKAGES[0];
  
  // Match by name or price
  const byName = packages.find(p => p.name.toLowerCase() === user.package?.toLowerCase());
  if (byName) return byName;

  const byPrice = packages.find(p => p.price === user.paymentAmount);
  if (byPrice) return byPrice;

  if (user.package?.includes('Basic') || user.package?.includes('6699') || user.paymentAmount === 6699) {
    const basic = packages.find(p => p.name.toLowerCase().includes('basic'));
    if (basic) return basic;
  }

  return packages[0] || DEFAULT_PACKAGES[0];
};

export const getSystemSettings = (): SystemSettings => {
  try {
    const raw = localStorage.getItem('mlm_system_settings');
    if (raw) {
      return { ...DEFAULT_SYSTEM_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_SYSTEM_SETTINGS;
};

export interface CommissionSettings {
  generatesDirect?: boolean;
  generatesMatching?: boolean;
  generatesLevel?: boolean;
  directEnabled?: boolean; // default true
  matchingEnabled?: boolean; // default true
  levelEnabled?: boolean; // default true
  withdrawalWithoutPanEnabled?: boolean; // Admin override: allow withdrawal without PAN card
  allowWithdrawal?: boolean; // default true
  customBonus?: number; // custom amount assigned by admin
  customBonusNote?: string;
}

export interface AdminFundAdjustment {
  id: string;
  amount: number; // positive for credit, negative for debit
  type: 'credit' | 'debit' | 'set';
  reason: string;
  date: string;
}

export interface MlmUser {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  mobile: string;
  package: string;
  isFreeId?: boolean; // Admin Free ID (Zero Commission to anyone)
  status: 'Active' | 'Inactive' | 'Blocked';
  joined: string;
  sponsorId: string | null;
  parentId: string | null;
  position: 'Left' | 'Right' | null;
  leftId: string | null;
  rightId: string | null;
  password?: string;
  
  // Detailed Profile & Registration info
  email?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  panNumber?: string;
  selectedProduct?: string;
  utrNumber?: string;
  paymentProof?: string;
  paymentAmount?: number;
  paymentStatus?: 'Pending' | 'Approved' | 'Rejected';
  registeredAt?: string;
  commissionSettings?: CommissionSettings;
  adminAdjustments?: AdminFundAdjustment[];
  manualBalanceOverride?: number;
  kycDetails?: any;

  // Stats
  availableBalance: number;
  totalIncome: number;
  matchingIncome: number;
  directIncome: number;
  levelIncome: number;
  totalWithdrawn: number;
  completedPairs: number;
  directJoins: number;
  leftMembers: number;
  rightMembers: number;
  transactions: Transaction[];
  cappingLimit?: number;
  flushedPairs?: number;
  flushedMatchingIncome?: number;
  adminFlushedEarnings?: number;
}

export const getLevelOrdinalName = (level: number | string): string => {
   const n = typeof level === 'number' ? level : parseInt(String(level).replace(/\D/g, ''), 10);
   if (isNaN(n) || n <= 0) return `${level} Level Income`;
   if (n === 1) return '1th Level Income';
   if (n === 2) return '2nd Level Income';
   if (n === 3) return '3rd Level Income';
   return `${n}th Level Income`;
};

export const resetAllFundsToZero = (preserveTree: boolean = true) => {
   const saved = localStorage.getItem('mlm_users');
   if (saved) {
      try {
         const users: MlmUser[] = JSON.parse(saved);
         users.forEach(u => {
            u.availableBalance = 0;
            u.totalIncome = 0;
            u.matchingIncome = 0;
            u.directIncome = 0;
            u.levelIncome = 0;
            u.totalWithdrawn = 0;
            u.transactions = [];
            u.completedPairs = 0;
            u.directJoins = 0;
            u.flushedMatchingIncome = 0;
            u.flushedPairs = 0;
            u.adminFlushedEarnings = 0;
            if (u.commissionSettings) {
               u.commissionSettings.customBonus = 0;
            }
            delete u.adminAdjustments;
            delete u.manualBalanceOverride;
         });
         localStorage.setItem('mlm_users', JSON.stringify(users)); pushMlmStateToSupabase('mlm_users', users);
      } catch (e) {
         console.error(e);
      }
   }
   localStorage.removeItem('app_level_history');
   localStorage.removeItem('app_deposits');
   localStorage.removeItem('mlm_deposits');
   localStorage.removeItem('admin_deposits');
   localStorage.removeItem('app_withdrawals');
   localStorage.removeItem('mlm_withdrawals');
   localStorage.setItem('mlm_all_funds_zero_v3', 'true');
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
   window.dispatchEvent(new Event('storage'));
};

export const resetAllIncomesAndTeams = (): MlmUser[] => {
   const root: MlmUser = {
      id: 'FGPL000001',
      name: 'Umesh Yadav',
      username: 'umesh',
      mobile: '7393862448',
      email: 'uyadav73938@gmail.com',
      dob: '15 / 08 / 1995',
      gender: 'male',
      address: 'Plot No. 42, Green Park Avenue',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221002',
      panNumber: 'ABCDE1234F',
      package: 'Premium',
      selectedProduct: 'Suit Length & Pant (Navy Blue Colour)',
      utrNumber: 'HTX984729104',
      paymentAmount: 6699,
      paymentStatus: 'Approved',
      registeredAt: '18 Aug 2026, 10:30 pm',
      status: 'Active',
      joined: '2026-08-18 22:30:00',
      sponsorId: null,
      parentId: null,
      position: null,
      leftId: null,
      rightId: null,
      password: '7393862448',
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
      transactions: [],
      cappingLimit: 10000,
      flushedPairs: 0,
      flushedMatchingIncome: 0,
      adminFlushedEarnings: 0
   };
   localStorage.setItem('mlm_users', JSON.stringify([root]));
   localStorage.setItem('mlm_migration_v6_delete_fgpl2_and_bkvdj', 'true');
   localStorage.setItem('mlm_zero_income_reset_done', 'true');
   localStorage.setItem('mlm_clean_tx_v3', 'true');
   localStorage.setItem('mlm_all_funds_zero_v3', 'true');
   localStorage.removeItem('app_level_history');
   localStorage.removeItem('app_deposits');
   localStorage.removeItem('mlm_deposits');
   localStorage.removeItem('admin_deposits');
   localStorage.removeItem('app_withdrawals');
   localStorage.removeItem('mlm_withdrawals');
   localStorage.removeItem('pending_members');
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
   window.dispatchEvent(new Event('storage'));
   return [root];
};

export const getMlmUsers = (): MlmUser[] => {
   const saved = localStorage.getItem('mlm_users');
   if (saved) {
      try {
         let users: MlmUser[] = JSON.parse(saved);
         if (Array.isArray(users) && users.length > 0) {
            // Ensure root user FGPL000001 is present
            if (!users.some(u => u.id === 'FGPL000001')) {
               users.unshift({
                  id: 'FGPL000001',
                  name: 'Umesh Yadav',
                  username: 'umesh',
                  mobile: '7393862448',
                  email: 'uyadav73938@gmail.com',
                  dob: '15 / 08 / 1995',
                  gender: 'male',
                  address: 'Plot No. 42, Green Park Avenue',
                  city: 'Varanasi',
                  state: 'Uttar Pradesh',
                  pincode: '221002',
                  package: 'Premium',
                  selectedProduct: 'Suit Length & Pant (Navy Blue Colour)',
                  paymentAmount: 6699,
                  paymentStatus: 'Approved',
                  registeredAt: '18 Aug 2026, 10:30 pm',
                  status: 'Active',
                  joined: '2026-08-18 22:30:00',
                  sponsorId: null,
                  parentId: null,
                  position: null,
                  leftId: null,
                  rightId: null,
                  password: '7393862448',
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
            }
            return users;
         }
      } catch (e) {
         console.error(e);
      }
   }
   
   // If local storage is empty, DO NOT push to cloud! Return a dummy root user so UI doesn't crash.
   // The real data will arrive shortly via Firebase onSnapshot.
   return [{
      id: 'FGPL000001',
      name: 'Umesh Yadav',
      username: 'umesh',
      mobile: '7393862448',
      email: 'uyadav73938@gmail.com',
      dob: '15 / 08 / 1995',
      gender: 'male',
      address: 'Plot No. 42, Green Park Avenue',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221002',
      package: 'Premium',
      selectedProduct: 'Suit Length & Pant (Navy Blue Colour)',
      paymentAmount: 6699,
      paymentStatus: 'Approved',
      registeredAt: '18 Aug 2026, 10:30 pm',
      status: 'Active',
      joined: '2026-08-18 22:30:00',
      sponsorId: null,
      parentId: null,
      position: null,
      leftId: null,
      rightId: null,
      password: '7393862448',
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
      transactions: [],
      cappingLimit: 10000,
      flushedPairs: 0,
      flushedMatchingIncome: 0,
      adminFlushedEarnings: 0
   }];
};

export const getCurrentUserId = (): string => {
   const current = localStorage.getItem('current_user_id');
   const users = getMlmUsers();
   if (current && users.some(u => u.id === current)) {
      return current;
   }
   return users[0]?.id || 'FGPL000001';
};

export const setCurrentUserId = (id: string) => {
   localStorage.setItem('current_user_id', id);
   window.dispatchEvent(new Event('current_user_change'));
   window.dispatchEvent(new Event('mlm_update'));
};

export const getCurrentUser = (): MlmUser => {
   const users = getMlmUsers();
   const currentId = getCurrentUserId();
   const found = users.find(u => u.id === currentId);
   if (found) return found;
   return users[0] || {
      id: 'FGPL000001',
      name: 'User',
      mobile: '',
      package: 'Premium',
      status: 'Active',
      joined: '2023-10-01',
      sponsorId: null,
      parentId: null,
      position: null,
      leftId: null,
      rightId: null,
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
   };
};

export const recalculateTreeStats = (users: MlmUser[]): MlmUser[] => {
   const savedLevels = localStorage.getItem('app_levels_v3');
   const levelsConfig = savedLevels ? JSON.parse(savedLevels) : INITIAL_LEVELS;

   // Helper: get exact chronological timestamp for a user with stable sequence
   const getUserTimestamp = (u: MlmUser, fallbackIndex: number): number => {
      if (u.joined && u.joined.includes('T')) {
         const t = new Date(u.joined).getTime();
         if (!isNaN(t)) return t;
      }
      if (u.registeredAt && !isNaN(new Date(u.registeredAt).getTime())) {
         return new Date(u.registeredAt).getTime();
      }
      const baseTime = u.joined ? new Date(u.joined).getTime() : new Date('2023-10-01T10:00:00Z').getTime();
      const idNum = parseInt(u.id.replace(/\D/g, ''), 10) || (fallbackIndex + 1);
      return baseTime + idNum * 60000;
   };

   // Reset stats
   users.forEach(u => {
      u.availableBalance = 0;
      u.totalIncome = 0;
      u.matchingIncome = 0;
      u.directIncome = 0;
      u.levelIncome = 0;
      u.completedPairs = 0;
      u.directJoins = 0;
      u.leftMembers = 0;
      u.rightMembers = 0;
      // Preserve manual transactions (Withdrawals and Deposits)
      u.transactions = u.transactions ? u.transactions.filter(t => t.type === 'Withdrawal' || t.type === 'Deposit') : [];
   });

   // Helper: get list of active members in subtree in deterministic registration order
   const getActiveSubtreeMembers = (rootId: string | null): MlmUser[] => {
      if (!rootId) return [];
      const u = users.find(x => x.id === rootId);
      if (!u) return [];
      const list: MlmUser[] = [];
      // Free IDs generate zero commissions for anyone in the tree
      if (u.status === 'Active' && !u.isFreeId && !u.package?.toLowerCase().includes('free') && u.commissionSettings?.generatesMatching !== false && u.commissionSettings?.generatesLevel !== false) {
         list.push(u);
      }
      list.push(...getActiveSubtreeMembers(u.leftId));
      list.push(...getActiveSubtreeMembers(u.rightId));
      // Sort members by registration timestamp
      return list.sort((a, b) => {
         const idxA = users.findIndex(x => x.id === a.id);
         const idxB = users.findIndex(x => x.id === b.id);
         return getUserTimestamp(a, idxA) - getUserTimestamp(b, idxB);
      });
   };

   // Calculate for everyone
   users.forEach((u, userIdx) => {
      const leftActiveMembers = getActiveSubtreeMembers(u.leftId);
      const rightActiveMembers = getActiveSubtreeMembers(u.rightId);

      // 1. Calculate Left & Right members
      u.leftMembers = leftActiveMembers.length;
      u.rightMembers = rightActiveMembers.length;

      // If user is not Active or is a Free ID, they do not earn commissions
      if (u.status !== 'Active') {
         u.matchingIncome = 0;
         u.levelIncome = 0;
         u.directIncome = 0;
         u.totalIncome = 0;
         u.availableBalance = 0;
         return;
      }
      
      const commSettings = u.commissionSettings || {};
      const directAllowed = commSettings.directEnabled !== false && !u.isFreeId;
      const matchingAllowed = commSettings.matchingEnabled !== false && !u.isFreeId;
      const levelAllowed = commSettings.levelEnabled !== false && !u.isFreeId;
      
      const allPackages = getMlmPackages();
      const sysSettings = getSystemSettings();
      const userPkg = getPackageForUser(u);

      // 2. Direct Referral Joins & Income (Recorded at the exact moment of direct's join)
      // Free IDs do not generate direct referral bonus for the sponsor
      const activeDirects = users
         .filter(x => x.sponsorId === u.id && x.status === 'Active' && !x.isFreeId && !x.package?.toLowerCase().includes('free') && x.commissionSettings?.generatesDirect !== false)
         .sort((a, b) => {
            const idxA = users.findIndex(x => x.id === a.id);
            const idxB = users.findIndex(x => x.id === b.id);
            return getUserTimestamp(a, idxA) - getUserTimestamp(b, idxB);
         });

      u.directJoins = activeDirects.length;
      if (directAllowed) {
         let totalDirectIncome = 0;
         activeDirects.forEach((direct, dIdx) => {
            const directPkg = getPackageForUser(direct);
            const commission = typeof directPkg.directIncome === 'number' ? directPkg.directIncome : (directPkg.price === 6699 ? 0 : (sysSettings.directIncome || 1500));
            
            if (commission > 0) {
               totalDirectIncome += commission;
               const directTs = getUserTimestamp(direct, dIdx);
               u.transactions.push({
                  id: `D-${u.id}-${direct.id}`,
                  type: 'Direct',
                  amount: commission,
                  description: 'Direct Referral Income',
                  date: new Date(directTs).toISOString()
               });
            }
         });
         u.directIncome = totalDirectIncome;
      } else {
         u.directIncome = 0;
      }

      // 3. Matching Pair Income with dynamic Capping configured by Admin
      // Timestamped at the exact second the completing leg was registered
      u.completedPairs = Math.min(u.leftMembers, u.rightMembers);
      
      const DAILY_MATCHING_CAPPING_LIMIT = userPkg.capping > 0 ? userPkg.capping : (sysSettings.dailyCappingPairs * (userPkg.binaryIncome || 1000));
      const pairBaseIncome = userPkg.binaryIncome > 0 ? userPkg.binaryIncome : (sysSettings.binaryMatching || 1000);
      const MAX_DAILY_PAIRS = Math.max(1, Math.floor(DAILY_MATCHING_CAPPING_LIMIT / Math.max(1, pairBaseIncome)));
      
      const cappedPairs = Math.min(u.completedPairs, MAX_DAILY_PAIRS);
      const excessPairs = Math.max(0, u.completedPairs - MAX_DAILY_PAIRS);
      
      u.cappingLimit = DAILY_MATCHING_CAPPING_LIMIT;
      u.flushedPairs = excessPairs;

      if (matchingAllowed) {
         let totalMatching = 0;
         let totalFlushed = 0;
         
         for (let i = 0; i < u.completedPairs; i++) {
            const leftMem = leftActiveMembers[i];
            const rightMem = rightActiveMembers[i];
            
            const leftPkg = getPackageForUser(leftMem);
            const rightPkg = getPackageForUser(rightMem);
            const pairAmount = Math.min(leftPkg.binaryIncome || pairBaseIncome, rightPkg.binaryIncome || pairBaseIncome);
            
            if (i < MAX_DAILY_PAIRS) {
                totalMatching += pairAmount;
                const leftTs = getUserTimestamp(leftMem, i);
                const rightTs = getUserTimestamp(rightMem, i);
                const pairCompletedTs = Math.max(leftTs, rightTs) + 500;

                u.transactions.push({
                   id: `M-${u.id}-${i + 1}`,
                   type: 'Matching',
                   amount: pairAmount,
                   description: 'Matching Income',
                   date: new Date(pairCompletedTs).toISOString()
                });
            } else {
                totalFlushed += pairAmount;
            }
         }
         u.matchingIncome = totalMatching;
         u.flushedMatchingIncome = totalFlushed;
      } else {
         u.matchingIncome = 0;
         u.flushedMatchingIncome = 0;
         u.flushedPairs = 0;
      }

      // 4. Level Income (UNLIMITED - No Capping)
      // Timestamped at the exact moment the level milestone was satisfied
      let totalEarnedLevelIncome = 0;
      if (levelAllowed) {
         levelsConfig.forEach((lvl: any) => {
            if (lvl.status === 'Active' && lvl.leftId > 0 && lvl.rightId > 0) {
                if (u.leftMembers >= lvl.leftId && u.rightMembers >= lvl.rightId) {
                    totalEarnedLevelIncome += Number(lvl.income);
                    
                    const reqLeftMem = leftActiveMembers[lvl.leftId - 1];
                    const reqRightMem = rightActiveMembers[lvl.rightId - 1];
                    const leftTs = getUserTimestamp(reqLeftMem, lvl.leftId - 1);
                    const rightTs = getUserTimestamp(reqRightMem, lvl.rightId - 1);
                    const milestoneTs = Math.max(leftTs, rightTs) + 1000;

                    u.transactions.push({
                       id: `L-${u.id}-${lvl.level}`,
                       type: 'Level',
                       amount: Number(lvl.income),
                       description: getLevelOrdinalName(lvl.level),
                       date: new Date(milestoneTs).toISOString()
                    });
                }
            }
         });
         u.levelIncome = totalEarnedLevelIncome;
      } else {
         u.levelIncome = 0;
      }

      // 5. Custom Bonus / Admin Commission
      let customBonusAmount = 0;
      if (commSettings.customBonus && commSettings.customBonus > 0) {
         customBonusAmount = Number(commSettings.customBonus);
         u.transactions.push({
            id: `CB-${u.id}`,
            type: 'Direct',
            amount: customBonusAmount,
            description: commSettings.customBonusNote || 'Admin Special Commission Bonus',
            date: new Date().toISOString()
         });
      }

      // 5b. Admin Fund Adjustments (Automatic Payment Cut or Credit)
      let totalAdminAdjustment = 0;
      if (u.adminAdjustments && Array.isArray(u.adminAdjustments)) {
         u.adminAdjustments.forEach(adj => {
            totalAdminAdjustment += adj.amount;
            u.transactions.push({
               id: adj.id || `ADJ-${u.id}-${Date.now()}`,
               type: adj.amount >= 0 ? 'Deposit' : 'Withdrawal',
               amount: Math.abs(adj.amount),
               description: adj.reason || (adj.amount >= 0 ? 'Admin Fund Credit (वृद्धि)' : 'Admin Payment Deduction (कटौती)'),
               date: adj.date || new Date().toISOString()
            });
         });
      }

      // 6. Sort all transactions chronologically: Newest first (preserving true audit trail)
      u.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // 7. Grand Totals
      const baseEarned = u.matchingIncome + u.levelIncome + u.directIncome + customBonusAmount;
      if (u.manualBalanceOverride !== undefined && u.manualBalanceOverride !== null) {
         u.availableBalance = Math.max(0, u.manualBalanceOverride);
         u.totalIncome = Math.max(u.availableBalance, baseEarned);
      } else {
         u.totalIncome = Math.max(0, baseEarned + (totalAdminAdjustment > 0 ? totalAdminAdjustment : 0));
         u.availableBalance = Math.max(0, baseEarned - (u.totalWithdrawn || 0) + totalAdminAdjustment);
      }
   });

   // 8. Transfer all flushed matching income from network to Admin Account (FGPL000001)
   let totalFlushedMatchingAcrossNetwork = 0;
   users.forEach(u => {
      if (u.id !== 'FGPL000001') {
         totalFlushedMatchingAcrossNetwork += (u.flushedMatchingIncome || 0);
      }
   });
   
   const rootAdminUser = users.find(u => u.id === 'FGPL000001');
   if (rootAdminUser) {
      rootAdminUser.adminFlushedEarnings = totalFlushedMatchingAcrossNetwork;
      if (totalFlushedMatchingAcrossNetwork > 0) {
         rootAdminUser.transactions.unshift({
            id: `ADMIN-FLUSH-${rootAdminUser.id}`,
            type: 'Matching',
            amount: totalFlushedMatchingAcrossNetwork,
            description: 'Network Capping Overflow (Flushed to Admin)',
            date: new Date().toISOString()
         });
         rootAdminUser.totalIncome += totalFlushedMatchingAcrossNetwork;
         rootAdminUser.availableBalance += totalFlushedMatchingAcrossNetwork;
      }
   }

   return users;
};

export interface AddMlmUserPayload {
  name: string;
  username?: string;
  avatar?: string;
  mobile: string;
  package?: string;
  sponsorId: string;
  position: 'Left' | 'Right';
  email?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  panNumber?: string;
  selectedProduct?: string;
  password?: string;
  utrNumber?: string;
  paymentProof?: string;
  paymentAmount?: number;
  status?: 'Active' | 'Inactive' | 'Blocked';
  isFreeId?: boolean; // Admin Free ID (Zero Commission)
  insertInBetween?: boolean; // Insert ID in between two existing nodes
  targetParentId?: string; // Target Parent Node for direct/in-between attachment
  generatesDirect?: boolean;
  generatesMatching?: boolean;
  generatesLevel?: boolean;
  directEnabled?: boolean;
  matchingEnabled?: boolean;
  levelEnabled?: boolean;
  withdrawalWithoutPanEnabled?: boolean;
}

/**
 * Returns who currently occupies the specified slot of a parent
 */
export const getTreePlacementSlotInfo = (parentId: string, position: 'Left' | 'Right'): {
  parentUser: MlmUser | null;
  occupiedUser: MlmUser | null;
  isOccupied: boolean;
} => {
  const users = getMlmUsers();
  const parent = users.find(u => u.id === parentId || (u.username && u.username.toLowerCase().replace(/^@/, '') === parentId.toLowerCase().replace(/^@/, '')));
  if (!parent) {
    return { parentUser: null, occupiedUser: null, isOccupied: false };
  }
  const childId = position === 'Right' ? parent.rightId : parent.leftId;
  const child = childId ? users.find(u => u.id === childId) || null : null;
  return {
    parentUser: parent,
    occupiedUser: child,
    isOccupied: Boolean(child)
  };
};

/**
 * Validates UTR Number against fake formats, invalid lengths, mock text, and duplicate usage
 */
export const validateUtrNumber = (utr: string, excludeUserId?: string): { valid: boolean; error?: string } => {
  const trimmed = (utr || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Transaction ID / UTR Number is required.' };
  }

  // Length check: Indian UPI UTR is 12 digits, banking refs are 10-22 characters
  if (trimmed.length < 10 || trimmed.length > 24) {
    return { valid: false, error: 'Invalid UTR format. A valid UPI/Bank UTR or Transaction ID must be between 10 to 22 characters.' };
  }

  // Must be alphanumeric
  if (!/^[A-Za-z0-9]+$/.test(trimmed)) {
    return { valid: false, error: 'Transaction ID can only contain letters and numbers (no special symbols or spaces).' };
  }

  // Must have at least 6 digits (UPI / Bank refs always contain numeric digits)
  const digitCount = (trimmed.match(/\d/g) || []).length;
  if (digitCount < 6) {
    return { valid: false, error: 'Fake or invalid Transaction format. Real UPI/Bank UTR must contain at least 6-12 numeric digits.' };
  }

  const lower = trimmed.toLowerCase();

  // Check for dummy / mock / fake keywords
  const bannedKeywords = ['fake', 'test', 'dummy', 'asdf', 'qwerty', 'sample', 'abcd', 'mock', 'demo', 'null', 'none', 'abcd1234', '12345678', '98765432'];
  for (const word of bannedKeywords) {
    if (lower.includes(word)) {
      return { valid: false, error: `Invalid Transaction ID. Dummy, test, or fake text like "${word}" is strictly rejected.` };
    }
  }

  // Check for repeating identical characters (e.g. 000000000000, 111111111111)
  if (/^(.)\1{7,}$/.test(trimmed)) {
    return { valid: false, error: 'Invalid Transaction ID. Repeating placeholder numbers (e.g. 000000... or 111111...) are not allowed.' };
  }

  // Sequential check (e.g. 123456789012, 012345678901)
  if (trimmed === '123456789012' || trimmed === '012345678901' || trimmed === '987654321098') {
    return { valid: false, error: 'Invalid Transaction ID. Sequential placeholder numbers are not allowed.' };
  }

  // Duplicate check across all registered users and transactions
  const users = getMlmUsers();
  for (const user of users) {
    if (excludeUserId && user.id === excludeUserId) continue;

    // Check user's registration utr
    if (user.utrNumber && user.utrNumber.trim().toLowerCase() === lower) {
      return { 
        valid: false, 
        error: `This Transaction ID / UTR (${trimmed}) has already been used and approved for User ${user.id} (${user.name}). Reusing approved transactions is strictly prohibited.` 
      };
    }

    // Check all user transaction records
    if (user.transactions && user.transactions.length > 0) {
      for (const tx of user.transactions) {
        if (tx.utr && tx.utr.trim().toLowerCase() === lower) {
          return { 
            valid: false, 
            error: `This Transaction ID / UTR (${trimmed}) has already been registered and verified in our database. Duplicate transaction entries cannot be accepted.` 
          };
        }
      }
    }
  }

  return { valid: true };
};

/**
 * Validates Payment Screenshot against empty submissions, non-image files, dummy data, and duplicate re-uploads
 */
export const validatePaymentScreenshot = (screenshot: string, excludeUserId?: string): { valid: boolean; error?: string } => {
  const trimmed = (screenshot || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Payment screenshot is required. Please upload a clear photo/screenshot of your payment receipt.' };
  }

  // Must be a valid image base64 data URI
  if (!trimmed.startsWith('data:image/')) {
    return { valid: false, error: 'Invalid file format. Please upload a genuine image file (JPG, PNG, JPEG, WEBP).' };
  }

  // Minimum length check (a real compressed screenshot image in Base64 is at least 3,000 characters)
  if (trimmed.length < 2000) {
    return { valid: false, error: 'The uploaded file appears corrupted or too small. Please upload a full, clear screenshot of the payment receipt.' };
  }

  // Duplicate screenshot check against previously uploaded and approved screenshots
  const users = getMlmUsers();
  // Extract a signature slice of the image to compare (first 300 chars of base64 data)
  const incomingSample = trimmed.slice(50, 400);

  for (const user of users) {
    if (excludeUserId && user.id === excludeUserId) continue;

    if (user.paymentProof && user.paymentProof.startsWith('data:image/')) {
      const existingSample = user.paymentProof.slice(50, 400);
      if (existingSample === incomingSample || user.paymentProof === trimmed) {
        return {
          valid: false,
          error: `This Payment Screenshot has already been uploaded and approved for Member ${user.id} (${user.name}). Reusing the same screenshot for multiple accounts is strictly prohibited.`
        };
      }
    }

    if (user.transactions) {
      for (const tx of user.transactions) {
        if (tx.screenshot && tx.screenshot.startsWith('data:image/')) {
          const existingSample = tx.screenshot.slice(50, 400);
          if (existingSample === incomingSample || tx.screenshot === trimmed) {
            return {
              valid: false,
              error: `This Payment Screenshot has already been submitted and verified for transaction ${tx.id}. Duplicate payment screenshots cannot be accepted.`
            };
          }
        }
      }
    }
  }

  return { valid: true };
};

export const addMlmUser = async (data: AddMlmUserPayload): Promise<MlmUser> => {
   let users = getMlmUsers();
   
   // Enforce UTR and Payment Screenshot validation if not manual admin override with bypass keyword
   const isBypassUtr = 
      Boolean(data.isFreeId) || 
      !data.utrNumber || 
      data.utrNumber.toUpperCase().includes('FREE') || 
      data.utrNumber.toUpperCase().includes('ADMIN') || 
      data.utrNumber.toUpperCase().includes('MANUAL') || 
      data.utrNumber === 'MANUAL_ADMIN_ADD' || 
      data.utrNumber === 'MANUAL-ENTRY';

   if (data.utrNumber && !isBypassUtr) {
     const utrCheck = validateUtrNumber(data.utrNumber);
     if (!utrCheck.valid) {
       throw new Error(utrCheck.error || 'Invalid or duplicate Transaction ID / UTR.');
     }
   }

   if (data.email) {
     const isDuplicateEmail = users.some(u => u.email && u.email.trim().toLowerCase() === data.email!.trim().toLowerCase());
     if (isDuplicateEmail) {
       throw new Error('This email address is already registered. Please provide a unique email.');
     }
   }

   if (data.username) {
     const isDuplicateUsername = users.some(u => u.username && u.username.trim().toLowerCase() === data.username!.trim().toLowerCase());
     if (isDuplicateUsername) {
       throw new Error('This username is already taken. Please choose a different username.');
     }
   }

   if (data.paymentProof && data.paymentProof.startsWith('data:image/') && !data.isFreeId) {
     const proofCheck = validatePaymentScreenshot(data.paymentProof);
     if (!proofCheck.valid) {
       throw new Error(proofCheck.error || 'Invalid or duplicate Payment Screenshot.');
     }
   }

   // Generate next unique user ID safely
   let maxNum = 0;
   users.forEach(u => {
      const match = u.id.match(/\d+/);
      if (match) {
         const n = parseInt(match[0], 10);
         if (n > maxNum) maxNum = n;
      }
   });
   const newId = `FGPL${String(maxNum + 1).padStart(6, '0')}`;
   
   // Robust sponsor lookup (by ID, username, or default to root user)
   const cleanSponsorInput = (data.sponsorId || '').trim();
   let sponsor = users.find(u => 
      u.id.toLowerCase() === cleanSponsorInput.toLowerCase() ||
      (u.username && u.username.toLowerCase().replace(/^@/, '') === cleanSponsorInput.toLowerCase().replace(/^@/, '')) ||
      (u.mobile && u.mobile === cleanSponsorInput)
   );
   if (!sponsor && users.length > 0) {
      sponsor = users[0]; // default to 1st root user
   }
   if (!sponsor) {
      throw new Error("Sponsor account not found.");
   }

   // Safe placement traversal (Left or Right branch)
   const chosenSide = (data.position || 'Left') === 'Right' ? 'Right' : 'Left';
   const sideKey = chosenSide === 'Right' ? 'rightId' : 'leftId';

   let parentId = sponsor.id;
   let existingShiftChildId: string | null = null;

   if (data.insertInBetween && data.targetParentId) {
      // In-between insertion: directly attach under targetParent and push down existing child
      const targetParent = users.find(u => 
         u.id.toLowerCase() === data.targetParentId!.toLowerCase().trim() ||
         (u.username && u.username.toLowerCase().replace(/^@/, '') === data.targetParentId!.toLowerCase().trim().replace(/^@/, ''))
      ) || sponsor;
      parentId = targetParent.id;
      existingShiftChildId = targetParent[sideKey] || null;
   } else {
      // Standard MLM leaf placement traversal
      let currentParent: MlmUser | undefined = sponsor;
      while (currentParent && currentParent[sideKey]) {
         const nextId = currentParent[sideKey]!;
         const nextParent = users.find(u => u.id === nextId);
         if (!nextParent) {
            // Clear orphaned pointer
            currentParent[sideKey] = null;
            break;
         }
         parentId = nextParent.id;
         currentParent = nextParent;
      }
   }

   // Sanitize or generate username
   let rawUsername = data.username ? data.username.trim().replace(/^@/, '') : '';
   if (!rawUsername) {
      const cleanName = data.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'member';
      rawUsername = `${cleanName}${Math.floor(1000 + Math.random() * 9000)}`;
   }

   const isFree = Boolean(data.isFreeId);
   const userStatus: 'Active' | 'Inactive' | 'Blocked' = isFree ? 'Active' : (data.status || 'Inactive');
   const nowIso = new Date().toISOString();

   const depositTx: Transaction = {
      id: `DEP-${Date.now().toString().slice(-6)}`,
      type: 'Deposit',
      amount: isFree ? 0 : (data.paymentAmount || 6699),
      description: isFree 
         ? 'Free ID Zero Commission Activation (No Payment)' 
         : `Package Activation Deposit (${data.package || 'Premium'} - ${data.selectedProduct || 'Product'})`,
      date: nowIso,
      status: isFree || userStatus === 'Active' ? 'Approved' : 'Pending',
      utr: isFree ? 'FREE-ID' : (data.utrNumber || 'MANUAL-ENTRY'),
      screenshot: data.paymentProof
   };

   const newUser: MlmUser = {
      id: newId,
      name: data.name,
      username: rawUsername,
      avatar: data.avatar || '',
      mobile: data.mobile,
      email: data.email || '',
      dob: data.dob || '',
      gender: data.gender || 'male',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      pincode: data.pincode || '',
      panNumber: data.panNumber || '',
      package: isFree ? 'Free (Zero Commission)' : (data.package || 'Premium'),
      selectedProduct: isFree ? 'Free ID (Zero Commission)' : (data.selectedProduct || 'Suit Length & Pant (Green Colour)'),
      utrNumber: isFree ? 'ADMIN-FREE-ID' : (data.utrNumber || ''),
      paymentProof: data.paymentProof || '',
      paymentAmount: isFree ? 0 : (data.paymentAmount || 6699),
      paymentStatus: isFree || userStatus === 'Active' ? 'Approved' : 'Pending',
      registeredAt: nowIso,
      status: userStatus,
      joined: nowIso,
      sponsorId: sponsor.id,
      parentId: parentId,
      position: chosenSide,
      leftId: chosenSide === 'Left' && existingShiftChildId ? existingShiftChildId : null,
      rightId: chosenSide === 'Right' && existingShiftChildId ? existingShiftChildId : null,
      isFreeId: isFree,
      commissionSettings: isFree ? {
         directEnabled: false,
         matchingEnabled: false,
         levelEnabled: false,
         withdrawalWithoutPanEnabled: true
      } : {
         generatesDirect: data.generatesDirect !== false,
         generatesMatching: data.generatesMatching !== false,
         generatesLevel: data.generatesLevel !== false,
         directEnabled: data.directEnabled !== false,
         matchingEnabled: data.matchingEnabled !== false,
         levelEnabled: data.levelEnabled !== false,
         withdrawalWithoutPanEnabled: Boolean(data.withdrawalWithoutPanEnabled)
      },
      password: data.password ? data.password.trim() : '123456',
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
      transactions: [depositTx]
   };

   // Save password for persistent auth
   const userPwd = newUser.password || '123456';
   localStorage.setItem(`user_password_${newId}`, userPwd);
   if (newUser.username) {
      localStorage.setItem(`user_password_${newUser.username.toLowerCase()}`, userPwd);
   }
   if (newUser.mobile) {
      localStorage.setItem(`user_password_${newUser.mobile}`, userPwd);
   }
   if (newUser.email) {
      localStorage.setItem(`user_password_${newUser.email.toLowerCase()}`, userPwd);
   }

   users.push(newUser);

   const parentIndex = users.findIndex(u => u.id === parentId);
   if (parentIndex !== -1) {
      if (chosenSide === 'Right') {
         users[parentIndex].rightId = newId;
      } else {
         users[parentIndex].leftId = newId;
      }
   }

   // If inserting in-between, update shifted child's parent pointer to the new user ID
   if (existingShiftChildId) {
      const shiftedIdx = users.findIndex(u => u.id === existingShiftChildId);
      if (shiftedIdx !== -1) {
         users[shiftedIdx].parentId = newId;
      }
   }

   // Recalculate tree stats and persist
   users = recalculateTreeStats(users);

   localStorage.setItem('mlm_users', JSON.stringify(users)); pushMlmStateToSupabase('mlm_users', users);
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
   return newUser;
};

export const updateMlmUserStatus = (userId: string, status: 'Active' | 'Inactive' | 'Blocked') => {
   updateMlmUser(userId, { status });
}

export const updateMlmUser = (userId: string, updates: Partial<MlmUser>) => {
   let users = getMlmUsers();
   const userIndex = users.findIndex(u => u.id === userId);
   if (userIndex === -1) return;

   if (updates.email) {
     const isDuplicateEmail = users.some(u => u.id !== userId && u.email && u.email.trim().toLowerCase() === updates.email!.trim().toLowerCase());
     if (isDuplicateEmail) {
       throw new Error('This email address is already registered to another user.');
     }
   }

   if (updates.username) {
     const isDuplicateUsername = users.some(u => u.id !== userId && u.username && u.username.trim().toLowerCase() === updates.username!.trim().toLowerCase());
     if (isDuplicateUsername) {
       throw new Error('This username is already taken by another user.');
     }
   }

   const oldUser = users[userIndex];
   const updatedUser: MlmUser = {
      ...oldUser,
      ...updates
   };

   // Update password registry if password changed
   if (updates.password) {
      localStorage.setItem(`user_password_${userId}`, updates.password);
      if (updatedUser.username) {
         localStorage.setItem(`user_password_${updatedUser.username.toLowerCase()}`, updates.password);
      }
      if (updatedUser.mobile) {
         localStorage.setItem(`user_password_${updatedUser.mobile}`, updates.password);
      }
      if (updatedUser.email) {
         localStorage.setItem(`user_password_${updatedUser.email.toLowerCase()}`, updates.password);
      }
   }

   users[userIndex] = updatedUser;

   // Recalculate network commissions
   users = recalculateTreeStats(users);

   // If manual balance was explicitly edited in the admin modal, preserve it
   if (updates.availableBalance !== undefined) {
      const idx = users.findIndex(u => u.id === userId);
      if (idx !== -1) {
         users[idx].availableBalance = updates.availableBalance;
      }
   }

   localStorage.setItem('mlm_users', JSON.stringify(users)); pushMlmStateToSupabase('mlm_users', users);
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
   window.dispatchEvent(new Event('mlm_packages_update'));
   window.dispatchEvent(new StorageEvent('storage', { key: 'mlm_users' }));
}

export const saveMlmUsers = (users: MlmUser[]) => {
   const recalculated = recalculateTreeStats(users);
   localStorage.setItem('mlm_users', JSON.stringify(recalculated)); pushMlmStateToSupabase('mlm_users', recalculated);
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
   window.dispatchEvent(new StorageEvent('storage', { key: 'mlm_users' }));
}

export const deleteMlmUser = (userId: string) => {
   import('@/lib/firebase').then(m => m.deleteUserFromCloud(userId)).catch(console.error);
   let users = getMlmUsers();
   const user = users.find(u => u.id === userId);
   if (!user) return;
   
   // Protect Root Admin from accidental deletion
   if (userId === 'FGPL000001') {
      console.warn('Cannot delete Root Admin (FGPL000001).');
      return;
   }
   
   // Clean up all references to this deleted user across other members
   users.forEach(u => {
      // Remove tree child pointers
      if (u.leftId === userId) u.leftId = null;
      if (u.rightId === userId) u.rightId = null;
      
      // If any downline member was sponsored by this deleted user, safely re-link sponsor to upper sponsor or root admin
      if (u.sponsorId === userId) {
         u.sponsorId = user.sponsorId || 'FGPL000001';
      }
      
      // If any member had this user as parent in tree, re-link to upper parent or detach
      if (u.parentId === userId) {
         u.parentId = user.parentId || null;
      }
   });
   
   // ONLY delete the selected single user - do NOT delete any other user!
   users = users.filter(u => u.id !== userId);
   
   // Clean up from pending members if present
   try {
      const rawPending = localStorage.getItem('pending_members');
      if (rawPending) {
         const pendingList = JSON.parse(rawPending);
         if (Array.isArray(pendingList)) {
            const updatedPending = pendingList.filter((m: any) => m.id !== userId && m.userId !== userId);
            localStorage.setItem('pending_members', JSON.stringify(updatedPending));
         }
      }
   } catch (e) {
      console.error('Error cleaning pending members on delete:', e);
   }

   // Reset current user if deleted
   if (localStorage.getItem('current_user_id') === userId) {
      localStorage.setItem('current_user_id', 'FGPL000001');
   }
   
   users = recalculateTreeStats(users);
   localStorage.setItem('mlm_users', JSON.stringify(users)); 
   pushMlmStateToSupabase('mlm_users', users);
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
   window.dispatchEvent(new StorageEvent('storage', { key: 'mlm_users' }));
}

export const updateUserCommissionSettings = (userId: string, settings: Partial<CommissionSettings>): MlmUser | null => {
   let users = getMlmUsers();
   const user = users.find(u => u.id === userId);
   if (!user) return null;
   
   user.commissionSettings = {
      ...(user.commissionSettings || { directEnabled: true, matchingEnabled: true, levelEnabled: true }),
      ...settings
   };
   
   users = recalculateTreeStats(users);
   localStorage.setItem('mlm_users', JSON.stringify(users)); pushMlmStateToSupabase('mlm_users', users);
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
   return users.find(u => u.id === userId) || user;
};

export const addCustomCommissionBonus = (userId: string, amount: number, note: string) => {
   let users = getMlmUsers();
   const user = users.find(u => u.id === userId);
   if (!user) return;
   
   const currentBonus = user.commissionSettings?.customBonus || 0;
   user.commissionSettings = {
      ...(user.commissionSettings || {}),
      customBonus: currentBonus + amount,
      customBonusNote: note || 'Special Commission / Incentive Bonus'
   };
   
   users = recalculateTreeStats(users);
   localStorage.setItem('mlm_users', JSON.stringify(users)); pushMlmStateToSupabase('mlm_users', users);
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
};

export const adjustUserFunds = (
  userId: string,
  action: 'add' | 'deduct' | 'set',
  amount: number,
  reason?: string
): MlmUser | null => {
  let users = getMlmUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return null;

  if (action === 'set') {
    const targetBalance = Math.max(0, amount);
    user.manualBalanceOverride = targetBalance;
    const currentBal = user.availableBalance || 0;
    const diff = targetBalance - currentBal;
    if (diff !== 0) {
      if (!user.adminAdjustments) user.adminAdjustments = [];
      user.adminAdjustments.push({
        id: `ADJ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        amount: diff,
        type: 'set',
        reason: reason?.trim() || `Admin Set Balance to ₹${targetBalance.toLocaleString('en-IN')}`,
        date: new Date().toISOString()
      });
    }
  } else if (action === 'add') {
    const addAmt = Math.abs(amount);
    if (!user.adminAdjustments) user.adminAdjustments = [];
    user.adminAdjustments.push({
      id: `ADJ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      amount: addAmt,
      type: 'credit',
      reason: reason?.trim() || `Admin Fund Credit (वृद्धि) +₹${addAmt.toLocaleString('en-IN')}`,
      date: new Date().toISOString()
    });
    delete user.manualBalanceOverride;
  } else if (action === 'deduct') {
    const deductAmt = Math.abs(amount);
    if (!user.adminAdjustments) user.adminAdjustments = [];
    user.adminAdjustments.push({
      id: `ADJ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      amount: -deductAmt,
      type: 'debit',
      reason: reason?.trim() || `Admin Payment Deduction (कटौती) -₹${deductAmt.toLocaleString('en-IN')}`,
      date: new Date().toISOString()
    });
    delete user.manualBalanceOverride;
  }

  users = recalculateTreeStats(users);
  localStorage.setItem('mlm_users', JSON.stringify(users)); pushMlmStateToSupabase('mlm_users', users);
  window.dispatchEvent(new Event('mlm_update'));
  window.dispatchEvent(new Event('current_user_change'));
  window.dispatchEvent(new StorageEvent('storage', { key: 'mlm_users' }));
  return users.find(u => u.id === userId) || user;
};

export const activateUserAccount = (
  userId: string,
  options?: {
    package?: string;
    selectedProduct?: string;
    paymentAmount?: number;
    utrNumber?: string;
  }
) => {
   let users = getMlmUsers();
   const user = users.find(u => u.id === userId);
   if (!user) return;
   
   user.status = 'Active';
   user.paymentStatus = 'Approved';
   user.isFreeId = false; // Remove Free ID tag so network commissions kick in!
   
   if (options?.package) {
      user.package = options.package;
   } else if (!user.package || user.package.toLowerCase().includes('free')) {
      user.package = 'Premium';
   }
   
   const isBasic = user.package?.toLowerCase().includes('basic');

   if (options?.selectedProduct) {
      user.selectedProduct = options.selectedProduct;
   } else if (!user.selectedProduct || user.selectedProduct.toLowerCase().includes('free')) {
      user.selectedProduct = isBasic 
        ? 'Suit Length (Single Piece)' 
        : 'Suit Length & Pant (Navy Blue Colour)';
   }
   
   if (typeof options?.paymentAmount === 'number') {
      user.paymentAmount = options.paymentAmount;
   } else if (!user.paymentAmount || user.paymentAmount === 0) {
      user.paymentAmount = 6699;
   }

   if (options?.utrNumber) {
      user.utrNumber = options.utrNumber;
   } else if (!user.utrNumber || user.utrNumber.includes('FREE')) {
      user.utrNumber = `ACT-${Date.now().toString().slice(-6)}`;
   }

   // Enable standard commission settings
   user.commissionSettings = {
      directEnabled: true,
      matchingEnabled: true,
      levelEnabled: true,
      withdrawalWithoutPanEnabled: user.commissionSettings?.withdrawalWithoutPanEnabled !== false,
      allowWithdrawal: true
   };

   // Update or add approved Deposit transaction
   if (!user.transactions) user.transactions = [];
   const existingDeposit = user.transactions.find(t => t.type === 'Deposit');
   if (existingDeposit) {
      existingDeposit.status = 'Approved';
      existingDeposit.amount = user.paymentAmount;
      existingDeposit.utr = user.utrNumber;
      existingDeposit.description = `Package Activation (${user.package} - ${user.selectedProduct})`;
   } else {
      user.transactions.push({
         id: `DEP-${Date.now().toString().slice(-6)}`,
         type: 'Deposit',
         amount: user.paymentAmount,
         status: 'Approved',
         utr: user.utrNumber,
         description: `Package Activation (${user.package} - ${user.selectedProduct})`,
         date: new Date().toISOString()
      });
   }
   
   // Recalculate full MLM tree:
   // 1. Sponsor receives Direct Referral Commission (₹1,500) immediately
   // 2. Uplines receive Matching Pair Commission
   // 3. Uplines receive Level Income
   users = recalculateTreeStats(users);
   localStorage.setItem('mlm_users', JSON.stringify(users)); pushMlmStateToSupabase('mlm_users', users);
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
};

export const rejectUserAccount = (userId: string) => {
   let users = getMlmUsers();
   const user = users.find(u => u.id === userId);
   if (!user) return;
   
   user.status = 'Inactive';
   user.paymentStatus = 'Rejected';
   if (user.transactions) {
      user.transactions.forEach(t => {
         if (t.type === 'Deposit') {
            t.status = 'Rejected';
         }
      });
   }
   
   users = recalculateTreeStats(users);
   localStorage.setItem('mlm_users', JSON.stringify(users)); pushMlmStateToSupabase('mlm_users', users);
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('current_user_change'));
};

export const saveMlmPackages = (packages: MlmPackage[]) => {
   localStorage.setItem('mlm_packages', JSON.stringify(packages)); pushMlmStateToSupabase('mlm_packages', packages);
   
   // Trigger system wide recalculation so any changed rate reflects immediately in all users' balance and transactions
   const users = getMlmUsers();
   const recalculated = recalculateTreeStats(users);
   localStorage.setItem('mlm_users', JSON.stringify(recalculated)); pushMlmStateToSupabase('mlm_users', recalculated);
   
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('mlm_packages_update'));
   window.dispatchEvent(new Event('current_user_change'));
   window.dispatchEvent(new StorageEvent('storage', { key: 'mlm_packages' }));
};

export const saveMlmPackage = (pkg: MlmPackage) => {
   const current = getMlmPackages();
   const existingIndex = current.findIndex(p => p.id === pkg.id);
   let updated: MlmPackage[];
   if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = pkg;
   } else {
      updated = [...current, pkg];
   }
   saveMlmPackages(updated);
};

export const deleteMlmPackage = (pkgId: number) => {
   const current = getMlmPackages();
   const updated = current.filter(p => p.id !== pkgId);
   saveMlmPackages(updated);
};

export const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
   const current = getSystemSettings();
   const updated = { ...current, ...newSettings };
   localStorage.setItem('mlm_system_settings', JSON.stringify(updated)); pushMlmStateToSupabase('mlm_system_settings', updated);

   // Sync to packages if relevant
   const pkgs = getMlmPackages();
   const updatedPkgs = pkgs.map(p => {
      if (p.name.toLowerCase() === 'premium') {
         return { 
            ...p, 
            directIncome: updated.directIncome || p.directIncome, 
            binaryIncome: updated.binaryMatching || p.binaryIncome,
            capping: (updated.dailyCappingPairs * (updated.binaryMatching || 1000)) || p.capping
         };
      }
      return p;
   });
   localStorage.setItem('mlm_packages', JSON.stringify(updatedPkgs)); pushMlmStateToSupabase('mlm_packages', updatedPkgs);

   // Recalculate users
   const users = getMlmUsers();
   const recalculated = recalculateTreeStats(users);
   localStorage.setItem('mlm_users', JSON.stringify(recalculated)); pushMlmStateToSupabase('mlm_users', recalculated);

   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('mlm_settings_update'));
   window.dispatchEvent(new Event('mlm_packages_update'));
   window.dispatchEvent(new Event('current_user_change'));
};

export const resetMlmData = () => {
   localStorage.removeItem('mlm_users');
   localStorage.removeItem('mlm_packages');
   localStorage.removeItem('mlm_system_settings');
   localStorage.removeItem('mlm_zero_income_reset_done');
   localStorage.removeItem('mlm_clean_tx_v3');
   localStorage.removeItem('mlm_company_gifts');
   localStorage.removeItem('mlm_awarded_gifts');
   resetAllIncomesAndTeams();
   window.dispatchEvent(new Event('mlm_update'));
   window.dispatchEvent(new Event('mlm_packages_update'));
   window.dispatchEvent(new Event('mlm_settings_update'));
   window.dispatchEvent(new Event('current_user_change'));
   window.dispatchEvent(new Event('mlm_gifts_update'));
};

// ==========================================
// COMPANY GIFTS & REWARDS STORE
// ==========================================

export const getCompanyGifts = (): CompanyGift[] => {
  try {
    const raw = localStorage.getItem('mlm_company_gifts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_COMPANY_GIFTS;
};

export const saveCompanyGifts = (gifts: CompanyGift[]) => {
  localStorage.setItem('mlm_company_gifts', JSON.stringify(gifts)); pushMlmStateToSupabase('mlm_company_gifts', gifts);
  window.dispatchEvent(new Event('mlm_gifts_update'));
};

export const addCompanyGift = (gift: Omit<CompanyGift, 'id'>): CompanyGift => {
  const gifts = getCompanyGifts();
  const newGift: CompanyGift = {
    ...gift,
    id: `GIFT-${Date.now().toString().slice(-4)}`
  };
  const updated = [newGift, ...gifts];
  saveCompanyGifts(updated);
  return newGift;
};

export const updateCompanyGift = (gift: CompanyGift) => {
  const gifts = getCompanyGifts();
  const updated = gifts.map(g => g.id === gift.id ? gift : g);
  saveCompanyGifts(updated);
};

export const deleteCompanyGift = (giftId: string) => {
  const gifts = getCompanyGifts();
  const updated = gifts.filter(g => g.id !== giftId);
  saveCompanyGifts(updated);
};

export const getAwardedGifts = (): AwardedGift[] => {
  try {
    const raw = localStorage.getItem('mlm_awarded_gifts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_AWARDED_GIFTS;
};

export const saveAwardedGifts = (awarded: AwardedGift[]) => {
  localStorage.setItem('mlm_awarded_gifts', JSON.stringify(awarded)); pushMlmStateToSupabase('mlm_awarded_gifts', awarded);
  window.dispatchEvent(new Event('mlm_gifts_update'));
};

export const awardGiftToUser = (params: {
  userId: string;
  giftId?: string;
  giftTitle: string;
  giftImage?: string;
  category?: string;
  approxValue?: number;
  reason: string;
  adminNote?: string;
  status?: 'Awarded' | 'Dispatched' | 'Delivered';
}): AwardedGift => {
  const users = getMlmUsers();
  const targetUser = users.find(u => u.id === params.userId);
  const currentAwarded = getAwardedGifts();

  const newAward: AwardedGift = {
    id: `AWARD-${Date.now().toString().slice(-6)}`,
    giftId: params.giftId,
    giftTitle: params.giftTitle,
    giftImage: params.giftImage || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    category: params.category || 'Special',
    approxValue: params.approxValue || 25000,
    userId: params.userId,
    userName: targetUser ? targetUser.name : `User (${params.userId})`,
    userMobile: targetUser?.mobile,
    awardedBy: 'Future Grow Management',
    awardedDate: new Date().toISOString().split('T')[0],
    reason: params.reason || 'Outstanding dedication & extraordinary performance',
    status: params.status || 'Awarded',
    adminNote: params.adminNote
  };

  const updated = [newAward, ...currentAwarded];
  saveAwardedGifts(updated);

  // Optional: Also add a commemorative transaction note to user's ledger if desired
  if (targetUser) {
    const giftTx: Transaction = {
      id: `TX-GIFT-${Date.now()}`,
      type: 'Direct',
      amount: 0,
      description: `🎁 Special Company Gift Won: ${params.giftTitle} (${params.reason})`,
      date: new Date().toISOString().split('T')[0],
      status: 'Approved'
    };
    targetUser.transactions = [giftTx, ...(targetUser.transactions || [])];
    localStorage.setItem('mlm_users', JSON.stringify(users)); pushMlmStateToSupabase('mlm_users', users);
    window.dispatchEvent(new Event('mlm_update'));
  }

  return newAward;
};

export const updateAwardedGiftStatus = (
  awardId: string,
  status: 'Awarded' | 'Dispatched' | 'Delivered',
  extra?: { trackingNumber?: string; courierPartner?: string; deliveryDate?: string; adminNote?: string }
) => {
  const current = getAwardedGifts();
  const updated = current.map(item => {
    if (item.id === awardId) {
      return {
        ...item,
        status,
        trackingNumber: extra?.trackingNumber !== undefined ? extra.trackingNumber : item.trackingNumber,
        courierPartner: extra?.courierPartner !== undefined ? extra.courierPartner : item.courierPartner,
        deliveryDate: extra?.deliveryDate !== undefined ? extra.deliveryDate : (status === 'Delivered' ? (item.deliveryDate || new Date().toISOString().split('T')[0]) : item.deliveryDate),
        adminNote: extra?.adminNote !== undefined ? extra.adminNote : item.adminNote
      };
    }
    return item;
  });
  saveAwardedGifts(updated);
};

export const deleteAwardedGift = (awardId: string) => {
  const current = getAwardedGifts();
  const updated = current.filter(item => item.id !== awardId);
  saveAwardedGifts(updated);
};

export const getUserAwardedGifts = (userId: string): AwardedGift[] => {
  const current = getAwardedGifts();
  return current.filter(item => item.userId === userId);
};

// ==========================================
// LEADERBOARD COMPUTATION
// ==========================================

export interface LeaderboardRank {
  rank: number;
  userId: string;
  name: string;
  mobile?: string;
  package: string;
  totalIncome: number;
  directJoins: number;
  completedPairs: number;
  teamSize: number;
  performanceScore: number;
  joined: string;
  giftsWonCount: number;
  badge: 'Gold' | 'Silver' | 'Bronze' | 'Star' | 'Rising';
}

export const getLeaderboardData = (): LeaderboardRank[] => {
  const users = getMlmUsers();
  const awarded = getAwardedGifts();

  const rankedList = users.map(u => {
    const directCount = u.directJoins || 0;
    const pairsCount = u.completedPairs || 0;
    const totalInc = u.totalIncome || 0;
    const matchingInc = u.matchingIncome || 0;
    const directInc = u.directIncome || 0;
    const levelInc = u.levelIncome || 0;
    const team = (u.leftMembers || 0) + (u.rightMembers || 0);
    const userGifts = awarded.filter(a => a.userId === u.id).length;

    // Performance Score based on earnings & leadership
    const performanceScore = Math.round(totalInc + (directCount * 100) + (pairsCount * 50) + (team * 10));

    return {
      userId: u.id,
      name: u.name,
      mobile: u.mobile,
      package: u.package || 'Premium (₹8,599)',
      totalIncome: totalInc,
      matchingIncome: matchingInc,
      directIncome: directInc,
      levelIncome: levelInc,
      directJoins: directCount,
      completedPairs: pairsCount,
      teamSize: team,
      performanceScore,
      joined: u.joined,
      giftsWonCount: userGifts,
      badge: 'Star' as 'Gold' | 'Silver' | 'Bronze' | 'Star' | 'Rising'
    };
  });

  // Sort primarily by totalIncome descending (Best Income is always No 1!), then directJoins, then completedPairs
  rankedList.sort((a, b) => b.totalIncome - a.totalIncome || b.directJoins - a.directJoins || b.completedPairs - a.completedPairs || b.teamSize - a.teamSize);

  return rankedList.map((item, index) => {
    const rank = index + 1;
    let badge: 'Gold' | 'Silver' | 'Bronze' | 'Star' | 'Rising' = 'Rising';
    if (rank === 1) badge = 'Gold';
    else if (rank === 2) badge = 'Silver';
    else if (rank === 3) badge = 'Bronze';
    else if (rank <= 10) badge = 'Star';

    return {
      ...item,
      rank,
      badge
    };
  });
};

export const syncAllDataToCloud = async (): Promise<boolean> => {
  try {
    const users = getMlmUsers();
    const packages = getMlmPackages();
    const settings = getSystemSettings();
    const gifts = getCompanyGifts();
    const awarded = getAwardedGifts();

    await rawPushSupabase('mlm_users', users);
    await rawPushSupabase('mlm_packages', packages);
    await rawPushSupabase('mlm_system_settings', settings);
    await rawPushSupabase('mlm_company_gifts', gifts);
    await rawPushSupabase('mlm_awarded_gifts', awarded);

    await pushMlmStateToFirebase('mlm_users', users);
    await pushMlmStateToFirebase('mlm_packages', packages);
    await pushMlmStateToFirebase('mlm_system_settings', settings);
    await pushMlmStateToFirebase('mlm_company_gifts', gifts);
    await pushMlmStateToFirebase('mlm_awarded_gifts', awarded);

    return true;
  } catch (err) {
    console.error('Error syncing all data to cloud:', err);
    return false;
  }
};

export const forceSyncUsers = async () => {
   const users = getMlmUsers();
   pushMlmStateToSupabase('mlm_users', users);
};

export interface Announcement {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: number;
}

export const getAnnouncements = (): Announcement[] => {
  try {
    const raw = localStorage.getItem('mlm_announcements');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const saveAnnouncements = (announcements: Announcement[]) => {
  localStorage.setItem('mlm_announcements', JSON.stringify(announcements));
  pushMlmStateToSupabase('mlm_announcements', announcements);
  window.dispatchEvent(new Event('announcements_update'));
};

export const addAnnouncement = (title: string, imageUrl: string, description?: string) => {
  const announcements = getAnnouncements();
  if (announcements.length >= 10) {
    throw new Error('Maximum 10 banners allowed. Please delete old ones first.');
  }
  announcements.unshift({
    id: 'ANN-' + Date.now(),
    title,
    description,
    imageUrl,
    isActive: true,
    createdAt: Date.now()
  });
  saveAnnouncements(announcements);
};

export const toggleAnnouncement = (id: string, isActive: boolean) => {
  const announcements = getAnnouncements();
  const index = announcements.findIndex(a => a.id === id);
  if (index !== -1) {
    announcements[index].isActive = isActive;
    saveAnnouncements(announcements);
  }
};

export const deleteAnnouncement = (id: string) => {
  let announcements = getAnnouncements();
  announcements = announcements.filter(a => a.id !== id);
  saveAnnouncements(announcements);
};
