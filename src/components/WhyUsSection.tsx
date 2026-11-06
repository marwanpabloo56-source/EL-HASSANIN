import React from 'react';
import { Sparkles, Fish, Layers, Smartphone, Headphones, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { EMBLEM_LOGO_IMG } from '../data/menuData';

export const WhyUsSection: React.FC = () => {
  const pillars = [
    {
      icon: Fish,
      title: 'الاهتمام الفائق بجودة الأسماك',
      description: 'نختار أسماك البوري والرنجة والسردين حبة بحبة من صيد اليوم، مع تمليح طبيعي هادئ ونظيف يبرز طعم السمك الأصلي دون ملوحة لاذعة أو مواد حافظة.',
      accent: 'text-amber-300',
    },
    {
      icon: Layers,
      title: 'تنوع واسع يلبي كل الأذواق',
      description: 'من المخليات الصافية الزبدية الجاهزة للأكل الفوري، إلى البطارخ الخشنة والناعمة، والفسيخ والرنجة والملوحة النيلية والسردين، مع توفير كافة خيارات الأوزان.',
      accent: 'text-[#D4AF37]',
    },
    {
      icon: Smartphone,
      title: 'سهولة ومرونة فائقة في الطلب',
      description: 'سلة مشتريات ذكية تتيح لك تحديد الوزن المطلوب بالضبط (ربع، نصف، كيلو أو وزن مخصص) وإرسال تفاصيل طلبك مباشرة بضغطة زر إلى واتساب المطعم.',
      accent: 'text-lime-400',
    },
    {
      icon: Headphones,
      title: 'خدمة عملاء ومتابعة مستمرة',
      description: 'فريقنا متواجد يومياً من 10 صباحاً حتى منتصف الليل للرد على استفساراتكم، تحضير طلباتكم بدقة، والتوصيل السريع المبرد لباب المنزل بتغليف فاكيوم محكم.',
      accent: 'text-blue-400',
    },
  ];

  return (
    <section id="why-us" className="py-16 lg:py-24 bg-[#060F1E] relative border-b border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>معايير التميز والأمانة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-amiri tracking-tight">
            لماذا يختار عشاق الفسيخ "الحسانين"؟
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            نحن لا نبيع مجرد أسماك مملحة؛ نحن نحفظ أصول التمليح المصري العريق ونقدمه بأسلوب راقٍ يليق بسفرتكم وضيافتكم.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D1F38] border border-slate-800 hover:border-[#D4AF37]/50 flex flex-col justify-between text-right space-y-4 transition-all duration-300 shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#060F1E] border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${pillar.accent}`} />
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#F3E5AB] font-amiri transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed text-justify">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-[#D4AF37]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>التزام راسخ مع كل عميل</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0D1F38] via-[#122A4C] to-[#0D1F38] border border-[#D4AF37]/35 flex flex-col sm:flex-row items-center justify-between gap-6 text-right">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-[#D4AF37] shrink-0 p-0.5 bg-[#060F1E]">
              <img src={EMBLEM_LOGO_IMG} alt="شعار الحسانين" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-amiri">تغليف فاكيوم حراري مفرغ من الهواء مجاناً</h4>
              <p className="text-xs text-slate-300">يضمن وصول طلبكم برائحة معزولة تماماً وطزاجة كاملة تدوم طويلاً.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-lime-400 bg-[#060F1E] px-4 py-2 rounded-xl border border-lime-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>نظافة معتمدة وأمان تام</span>
          </div>
        </div>

      </div>
    </section>
  );
};
