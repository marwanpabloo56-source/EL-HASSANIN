import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Phone, MessageCircle, Sparkles, Shield, ChevronDown } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenBrandKit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onNavigate,
  onOpenBrandKit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopBanner, setShowTopBanner] = useState(true);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060F1E]/95 backdrop-blur-md border-b border-[#D4AF37]/25 transition-all duration-300">
      {/* Top Customizable Announcement Bar */}
      {showTopBanner && (
        <div className="bg-gradient-to-r from-[#060F1E] via-[#0D1F38] to-[#060F1E] border-b border-[#D4AF37]/20 py-1.5 px-4 text-center relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#F3E5AB]">
            <div className="hidden md:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-slate-300">16 شارع الدويدار، حدائق القبة (بجوار أسماك السلطان)</span>
            </div>
            
            <span className="mx-auto md:mx-0 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>تغليف فاكيوم حراري مانع للرائحة مجاناً · توصيل فوري للقاهرة والجيزة وجميع المحافظات</span>
            </span>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="hover:text-[#D4AF37] transition-colors flex items-center gap-1 font-mono text-xs text-amber-200"
              >
                <Phone className="w-3 h-3 text-[#D4AF37]" />
                <span>{RESTAURANT_INFO.phone}</span>
              </a>
              <button
                onClick={() => setShowTopBanner(false)}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="إخفاء الشريط"
                aria-label="إغلاق"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main 3-Zone Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Zone 1: Exclusive Brand Logo */}
        <div className="flex items-center gap-3">
          <BrandLogo
            variant="full"
            size="md"
            onClick={() => handleNavClick('hero')}
          />
          <button
            onClick={onOpenBrandKit}
            className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0D1F38] border border-[#D4AF37]/30 text-[10px] text-[#F3E5AB] hover:border-[#D4AF37] transition-colors cursor-pointer"
            title="عرض وتحميل الشعار الرسمي"
          >
            <Shield className="w-3 h-3 text-[#D4AF37]" />
            <span>الهوية والشعار</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-200">
          <button
            onClick={() => handleNavClick('hero')}
            className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
          >
            الرئيسية
          </button>
          <button
            onClick={() => handleNavClick('menu')}
            className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
          >
            المنيو والأسعار
          </button>
          <button
            onClick={() => handleNavClick('offers')}
            className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
          >
            عروض الحسانين
          </button>
          <button
            onClick={() => handleNavClick('why-us')}
            className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
          >
            لماذا الحسانين؟
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
          >
            آراء العملاء
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
          >
            العنوان والتواصل
          </button>
        </nav>

        {/* Zone 3: Direct Actions & Shopping Cart */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick WhatsApp order button */}
          <a
            href={RESTAURANT_INFO.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-900/30 transition-all whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>طلب واتساب</span>
          </a>

          {/* Cart Trigger with Active Badge */}
          <button
            onClick={onOpenCart}
            aria-label="سلة المشتريات"
            className="relative flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] active:scale-95 transition-all rounded-lg shadow-lg shadow-[#D4AF37]/25 cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span className="hidden xs:inline">السلة</span>
            {cartCount > 0 && (
              <span className="bg-[#060F1E] text-[#F3E5AB] text-[11px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#060F1E] px-4 pt-3 pb-6 space-y-2.5 animate-in slide-in-from-top-2">
          <button
            onClick={() => handleNavClick('hero')}
            className="w-full text-right px-3 py-2 text-sm font-semibold text-slate-200 hover:text-[#D4AF37] rounded-lg"
          >
            الرئيسية
          </button>
          <button
            onClick={() => handleNavClick('menu')}
            className="w-full text-right px-3 py-2 text-sm font-semibold text-slate-200 hover:text-[#D4AF37] rounded-lg"
          >
            المنيو الرسمي والأسعار
          </button>
          <button
            onClick={() => handleNavClick('offers')}
            className="w-full text-right px-3 py-2 text-sm font-semibold text-slate-200 hover:text-[#D4AF37] rounded-lg"
          >
            عروض الحسانين
          </button>
          <button
            onClick={() => handleNavClick('why-us')}
            className="w-full text-right px-3 py-2 text-sm font-semibold text-slate-200 hover:text-[#D4AF37] rounded-lg"
          >
            لماذا تختار الحسانين؟
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            className="w-full text-right px-3 py-2 text-sm font-semibold text-slate-200 hover:text-[#D4AF37] rounded-lg"
          >
            آراء العملاء
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-right px-3 py-2 text-sm font-semibold text-slate-200 hover:text-[#D4AF37] rounded-lg"
          >
            العنوان وأرقام التواصل
          </button>

          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                onOpenBrandKit();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-bold text-[#F3E5AB] bg-[#0D1F38] border border-[#D4AF37]/30 rounded-lg"
            >
              تحميل الشعار الرسمي
            </button>
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex-1 py-2 text-center text-xs font-bold text-amber-300 bg-amber-950/40 border border-[#D4AF37]/40 rounded-lg flex items-center justify-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>اتصال مباشر</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
