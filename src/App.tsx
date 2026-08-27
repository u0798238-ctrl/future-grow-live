/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { AboutPage } from './pages/public/AboutPage';
import { PlanPage } from './pages/public/PlanPage';
import { ContactPage } from './pages/public/ContactPage';
import { TermsPage } from './pages/public/TermsPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { RefundPage } from './pages/public/RefundPage';
import { MasterRecoveryPage } from './pages/public/MasterRecoveryPage';

// User Pages
import { UserDashboardPage } from './pages/user/DashboardPage';
import { BinaryTreePage } from './pages/user/BinaryTreePage';
import { WithdrawalPage } from './pages/user/WithdrawalPage';
import { CustomerSupportPage } from './pages/user/CustomerSupportPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { KycPage } from './pages/user/KycPage';
import { UserLevelIncomePage } from './pages/user/UserLevelIncomePage';
import { InvitePage } from './pages/user/InvitePage';
import { MyTeamPage } from './pages/user/MyTeamPage';
import { MyPackagesPage } from './pages/user/MyPackagesPage';
import { WalletPage } from './pages/user/WalletPage';
import { LeaderboardPage } from './pages/user/LeaderboardPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/DashboardPage';
import { UsersPage } from './pages/admin/UsersPage';
import { DepositsPage } from './pages/admin/DepositsPage';
import { WithdrawalsPage } from './pages/admin/WithdrawalsPage';
import { IncomeDistributionPage } from './pages/admin/IncomeDistributionPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { InquiriesPage } from './pages/admin/InquiriesPage';
import { PackagesPage } from './pages/admin/PackagesPage';
import { LevelIncomePage } from './pages/admin/LevelIncomePage';

// Shared
import { PlaceholderPage } from './pages/PlaceholderPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<Navigate to="/login" replace />} />
          <Route path="/r/:ref" element={<RegisterPage />} />
          <Route path="/join/:ref" element={<RegisterPage />} />
          <Route path="/ref/:ref" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/master-recovery" element={<MasterRecoveryPage />} />
        </Route>

        {/* User Panel Routes */}
        <Route path="/user" element={<DashboardLayout type="user" />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboardPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="invite" element={<InvitePage />} />
          <Route path="tree" element={<BinaryTreePage />} />
          <Route path="levels" element={<UserLevelIncomePage />} />
          <Route path="packages" element={<MyPackagesPage />} />
          <Route path="team" element={<MyTeamPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="withdrawal" element={<WithdrawalPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="kyc" element={<KycPage />} />
          <Route path="support" element={<CustomerSupportPage />} />
        </Route>

        {/* Admin Panel Routes */}
        <Route path="/admin" element={<DashboardLayout type="admin" />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="tree" element={<BinaryTreePage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="levels" element={<LevelIncomePage />} />
          <Route path="income-distribution" element={<IncomeDistributionPage />} />
          <Route path="deposits" element={<DepositsPage />} />
          <Route path="withdrawals" element={<WithdrawalsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
