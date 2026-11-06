import React from 'react';
import { Phone, MessageCircle, MapPin, Facebook, ShieldCheck, Shield } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenBrandKit: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBrandKit, onOpenAdmin }) => {
  return (
    <footer className="bg-[#050B14] border-t border-[#D4AF37]/25 text-slate-400 text-right pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo variant="full" size="lg" />

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              علامة مصرية فاخرة رائدة في تقديم أفخر أطباق الفسيخ البوري البلدي، الرنجة الهولندية بالبطارخ الخشنة، والملوحة الأسوانية بأعلى معايير النظافة والتغليف الفاكيوم الحراري.
            </p>

            <div className="flex items-center gap-2 text-xs text-lime-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>تغليف فاكيوم حراري مفرغ من الهواء مجاناً مع كل طلب</span>
            </div>

            <div>
              <button
                onClick={onOpenBrandKit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1F38] border border-[#D4AF37]/30 text-xs text-[#F3E5AB] hover:border-[#D4AF37] transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تحميل الشعار والهوية الرسمية</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white font-amiri">أقسام الموقع</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('hero')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  المنيو وقائمة الأسعار
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  عروض الحسانين
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('why-us')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  لماذا تختار الحسانين؟
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  آراء وتقييمات العملاء
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  العنوان والتواصل
                </button>
              </li>
            </ul>
          </div>

          {/* Restaurant Official Contacts */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white font-amiri">التواصل والطلبات المباشرة</h4>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  {RESTAURANT_INFO.address}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-slate-300">الاتصال المباشر:</span>
                <a href={`tel:${RESTAURANT_INFO.phone}`} className="font-mono text-white font-bold hover:text-[#D4AF37]">
                  {RESTAURANT_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">واتساب الطلبات:</span>
                <a
                  href={RESTAURANT_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-emerald-300 font-bold hover:underline"
                >
                  {RESTAURANT_INFO.whatsappNumber}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-300">فيسبوك:</span>
                <a
                  href={RESTAURANT_INFO.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:underline"
                >
                  الصفحة الرسمية
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} فسخاني الحسانين. جميع الحقوق محفوظة.</p>
          
          <div className="flex items-center gap-4 text-[11px]">
            <p className="text-slate-400">
              16 شارع الدويدار - حدائق القبة · أصالة الطعم.. حكاية من زمان
            </p>
            {onOpenAdmin && (
              <>
                <span className="text-slate-700">·</span>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="text-slate-500 hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
                  title="الدخول للوحة تحكم المطعم"
                >
                  <Shield className="w-3 h-3 text-[#D4AF37]/70" />
                  <span>بوابة الإدارة</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
