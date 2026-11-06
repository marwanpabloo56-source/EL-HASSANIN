import React from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, Flame, Award, MapPin } from 'lucide-react';
import { HERO_IMG, RESTAURANT_INFO, EMBLEM_LOGO_IMG } from '../data/menuData';

interface HeroProps {
  onOrderNow: () => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onExploreMenu }) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#060F1E] via-[#0A192F] to-[#060F1E] pt-6 pb-16 lg:pt-14 lg:pb-24 border-b border-[#D4AF37]/20">
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Hero Content Column (Right on RTL) */}
          <div className="lg:col-span-7 text-right space-y-6">
            
            {/* Elegant Prestige Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1F38] border border-[#D4AF37]/35 text-xs font-semibold text-[#F3E5AB] shadow-md shadow-black/40">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{RESTAURANT_INFO.tagline}</span>
              <span className="text-[#D4AF37]/40">·</span>
              <span className="text-lime-400 font-bold">سمك بلدي طازة يوم بيوم</span>
            </div>

            {/* Main Headline & Slogan */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-amiri tracking-tight leading-[1.2]">
                فسخاني <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#F3E5AB] via-[#D4AF37] to-[#B38E44]">الحسانين</span>
              </h1>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-200 font-amiri tracking-wide">
                "{RESTAURANT_INFO.subHeroTagline}"
              </p>
            </div>

            {/* Compelling Brand Copy */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl text-justify sm:text-right">
              نقدم لكم التجربة الملكية للأسماك المملحة في مصر: فسيخ مخلي زبدة يذوب في الفم، رنجة هولندية بالبطارخ الخشنة المقرمشة، ملوحة أسوانية أصيلة، وسردين بلدي طازج. جميع طلباتنا مغلفة بتقنية الفاكيوم الحراري المانع للرائحة.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOrderNow}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl font-black text-slate-950 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] shadow-xl shadow-[#D4AF37]/25 hover:shadow-2xl transition-all active:scale-[0.98] cursor-pointer text-base"
              >
                <span>اطلب الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-slate-200 bg-[#0D1F38]/90 hover:bg-[#132B4D] border border-[#D4AF37]/35 hover:border-[#D4AF37]/70 transition-all cursor-pointer text-base"
              >
                <span>اكتشف المنيو</span>
              </button>
            </div>

            {/* Trust and Location Indicators */}
            <div className="pt-6 border-t border-slate-800/90 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5 text-slate-300">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div className="text-right">
                  <div className="text-xs font-bold text-white">تغليف فاكيوم مجاني</div>
                  <div className="text-[11px] text-slate-400">محكم وعديم الرائحة</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <Flame className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div className="text-right">
                  <div className="text-xs font-bold text-white">لحم صافي 100%</div>
                  <div className="text-[11px] text-slate-400">مخلي من الشوك والجلد</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-5 h-5 text-lime-400 shrink-0" />
                <div className="text-right">
                  <div className="text-xs font-bold text-white">حدائق القبة</div>
                  <div className="text-[11px] text-slate-400">16 شارع الدويدار</div>
                </div>
              </div>
            </div>

          </div>

          {/* Hero Visual Column (Left on RTL) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none space-y-3">
              
              {/* Creative Promotional Slogan Plaque beside the Feast Spread */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0D1F38]/95 via-[#142A4A]/95 to-[#0D1F38]/95 border-2 border-[#D4AF37]/50 p-3.5 sm:p-4 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-3 text-right">
                  <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center shrink-0 shadow-inner">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                  </div>
                  <p className="text-base sm:text-lg font-bold font-amiri text-slate-100 leading-snug">
                    "مش كل الحلو مُسكّر.. في حلاوة طعمها <span className="text-orange-400 font-black text-xl sm:text-2xl drop-shadow-[0_2px_10px_rgba(249,115,22,0.7)] underline decoration-orange-500/60 underline-offset-4">مالح!</span>"
                  </p>
                </div>
              </div>

              {/* Grand Golden Border Frame for the Main Dishes Spread */}
              <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-bl from-[#D4AF37]/50 via-[#0D1F38] to-[#060F1E] shadow-2xl shadow-black/90">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 group">
                  <img
                    src={HERO_IMG}
                    alt="سفرة أطباق الفسيخ والرنجة الفاخرة من فسخاني الحسانين"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060F1E]/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Shield Badge on Image */}
                  <div className="absolute bottom-4 right-4 left-4 p-3 rounded-lg bg-[#060F1E]/90 backdrop-blur-md border border-[#D4AF37]/35 flex items-center justify-between">
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#F3E5AB] block font-amiri">سفرة الحسانين الملكية</span>
                      <span className="text-[11px] text-slate-300">أفخم تشكيلة فسيخ ورنجة وبطارخ</span>
                    </div>
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-[#D4AF37] shrink-0">
                      <img src={EMBLEM_LOGO_IMG} alt="شعار" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Trust Seal */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D1F38] border border-[#D4AF37]/35 rounded-xl shadow-lg text-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold text-amber-200">سفرة الحسانين الفاخرة</span>
                </div>
                <span className="text-lime-400 font-mono text-[11px] font-bold">بوري بلدي نخب أول</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
