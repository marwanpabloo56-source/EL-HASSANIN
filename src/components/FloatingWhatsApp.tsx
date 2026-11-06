import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp, ShoppingBag } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface FloatingWhatsAppProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  cartCount = 0,
  onOpenCart,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside aria-label="أدوات الوصول السريع" className="fixed bottom-6 left-6 z-40 flex flex-col items-center gap-3">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="العودة لأعلى الصفحة"
          className="w-11 h-11 rounded-full bg-[#0D1F38] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#132B4D] hover:text-white flex items-center justify-center shadow-xl transition-all cursor-pointer animate-in fade-in"
          title="العودة لأعلى الصفحة"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating Cart Button when items exist */}
      {cartCount > 0 && onOpenCart && (
        <button
          onClick={onOpenCart}
          aria-label="عرض سلة المشتريات والطلب"
          className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] text-slate-950 flex items-center justify-center shadow-2xl shadow-[#D4AF37]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-in fade-in"
          title="عرض سلة المشتريات والطلب"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#060F1E] shadow-sm animate-pulse">
            {cartCount}
          </span>
        </button>
      )}

      {/* Floating WhatsApp Action Button */}
      <div className="relative group flex items-center">
        {/* Tooltip on hover */}
        <div className="hidden sm:block absolute left-16 bg-[#060F1E]/95 backdrop-blur-md border border-[#D4AF37]/40 text-slate-100 text-xs py-1.5 px-3 rounded-xl shadow-xl transition-all pointer-events-none text-right whitespace-nowrap">
          <span className="font-bold text-[#F3E5AB]">واتساب الحسانين الرسمي</span>
          <span className="block text-[10px] text-emerald-400 font-mono">01143226043</span>
        </div>

        <a
          href={RESTAURANT_INFO.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل عبر واتساب فسخاني الحسانين الرسمي"
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white flex items-center justify-center shadow-2xl shadow-emerald-950/70 transition-all duration-300 hover:rotate-6 cursor-pointer"
        >
          <MessageCircle className="w-7 h-7 fill-white stroke-emerald-500" />
        </a>
      </div>
    </aside>
  );
};
