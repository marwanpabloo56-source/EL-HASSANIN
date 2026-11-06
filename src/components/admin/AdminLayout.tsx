import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../BrandLogo';
import { ProductsManager } from './ProductsManager';
import { OrdersManager } from './OrdersManager';
import { DashboardStats } from './DashboardStats';
import { UsersManager } from './UsersManager';
import { SettingsManager } from './SettingsManager';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import {
  ShoppingBag,
  Tag,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  ArrowRight,
  Shield,
  Crown,
  Bell,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface AdminLayoutProps {
  onBackToStore: () => void;
}

type TabType = 'orders' | 'products' | 'stats' | 'users' | 'settings';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToStore }) => {
  const { adminProfile, isOwner, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Real-time counter of pending orders for notification badge
  useEffect(() => {
    const q = query(collection(db, 'orders'), where('status', '==', 'pending'));
    const unsub = onSnapshot(q, (snapshot) => {
      setPendingOrdersCount(snapshot.size);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    if (confirm('هل ترغب في تسجيل الخروج من لوحة التحكم؟')) {
      await logout();
      onBackToStore();
    }
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number; ownerOnly?: boolean }[] = [
    {
      id: 'orders',
      label: 'الطلبات والمبيعات',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    {
      id: 'products',
      label: 'إدارة المنتجات والأسعار',
      icon: <Tag className="w-4 h-4" />,
    },
    {
      id: 'stats',
      label: 'الإحصائيات والتقارير',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'users',
      label: 'فريق الإدارة والصلاحيات',
      icon: <Users className="w-4 h-4" />,
      ownerOnly: true,
    },
    {
      id: 'settings',
      label: 'إعدادات المتجر والتوصيل',
      icon: <Settings className="w-4 h-4" />,
      ownerOnly: true,
    },
  ];

  const visibleNavItems = navItems.filter((item) => !item.ownerOnly || isOwner);

  return (
    <div className="min-h-screen bg-[#060F1E] text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-[#D4AF37] selection:text-black text-right" dir="rtl">
      
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[#0D1F38]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Portal title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <BrandLogo variant="emblem-only" size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base sm:text-lg font-amiri leading-none">
                    لوحة التحكم
                  </span>
                  <span className="text-[10px] text-[#D4AF37] bg-[#060F1E] px-2 py-0.5 rounded-full border border-[#D4AF37]/30 font-mono">
                    EL HASSANIN
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:block">
                  إدارة متجر ومطعم فسخاني الحسانين
                </span>
              </div>
            </div>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* User identity badge */}
            <div className="flex items-center gap-2.5 bg-[#060F1E] px-3 py-1.5 rounded-xl border border-slate-700/80">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isOwner
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                    : 'bg-blue-900/30 text-blue-300 border border-blue-500/30'
                }`}
              >
                {isOwner ? <Crown className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white max-w-[120px] truncate">
                    {adminProfile?.name || (isOwner ? 'المالك' : 'مشرف')}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      isOwner
                        ? 'bg-[#D4AF37] text-slate-950'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {isOwner ? 'OWNER' : 'ADMIN'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block max-w-[130px] truncate font-mono" dir="ltr">
                  {adminProfile?.email}
                </span>
              </div>
            </div>

            {/* Back to store */}
            <button
              onClick={onBackToStore}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="العودة لموقع المتجر للزبائن"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">عرض المتجر</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
              title="تسجيل الخروج"
              aria-label="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Desktop Tabs Bar */}
        <div className="hidden lg:block border-t border-slate-800/80 bg-[#060F1E]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-2">
            {visibleNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-slate-950 shadow-md shadow-[#D4AF37]/15'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-slate-950 text-[#F3E5AB]'
                          : 'bg-amber-500 text-slate-950 animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#060F1E] p-4 space-y-1.5 animate-in slide-in-from-top-4">
            {visibleNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-slate-950'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                      {item.badge} جديد
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'orders' && <OrdersManager />}
        {activeTab === 'products' && <ProductsManager />}
        {activeTab === 'stats' && <DashboardStats />}
        {activeTab === 'users' && isOwner && <UsersManager />}
        {activeTab === 'settings' && isOwner && <SettingsManager />}
      </main>

    </div>
  );
};
