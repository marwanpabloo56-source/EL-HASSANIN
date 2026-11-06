import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ExternalLink, Navigation, Facebook, Share2 } from 'lucide-react';
import { RESTAURANT_INFO, EMBLEM_LOGO_IMG } from '../data/menuData';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 lg:py-24 bg-[#091524] relative border-b border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37]">
            <MapPin className="w-3.5 h-3.5" />
            <span>نرحب بزيارتكم وطلباتكم دائماً</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-amiri tracking-tight">
            العنوان وأرقام التواصل الرسمية
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            موقعنا في قلب حدائق القبة بالقاهرة، مع خدمة توصيل مبرد وسريع لجميع أنحاء القاهرة والجيزة والمحافظات.
          </p>
        </div>

        {/* Main Grid: Info card and interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#0D1F38] border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-right space-y-6 shadow-2xl">
            
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37] p-0.5 bg-[#060F1E] shrink-0">
                  <img src={EMBLEM_LOGO_IMG} alt="لوجو فسخاني الحسانين" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-amiri">{RESTAURANT_INFO.name}</h3>
                  <span className="text-xs text-[#D4AF37]">{RESTAURANT_INFO.tagline}</span>
                </div>
              </div>

              {/* Exact Address */}
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">العنوان الرسمي:</span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {RESTAURANT_INFO.address}
                  </p>
                  <span className="text-[11px] text-amber-300 block">علامة مميزة: بجوار أسماك السلطان</span>
                </div>
              </div>

              {/* WhatsApp & Phone */}
              <div className="flex items-start gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">رقم الاتصال والطلبات المباشرة:</span>
                  <a
                    href={`tel:${RESTAURANT_INFO.phone}`}
                    className="text-base font-bold font-mono text-[#F3E5AB] hover:underline block"
                  >
                    {RESTAURANT_INFO.phone}
                  </a>
                </div>
              </div>

              {/* Official WhatsApp link */}
              <div className="flex items-start gap-3 text-slate-300">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">واتساب الطلبات السريعة:</span>
                  <a
                    href={RESTAURANT_INFO.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-bold font-mono text-emerald-300 hover:underline block"
                  >
                    {RESTAURANT_INFO.whatsappNumber} (محادثة فورية)
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3 text-slate-300">
                <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">مواعيد العمل:</span>
                  <p className="text-xs text-slate-300">{RESTAURANT_INFO.openingHours}</p>
                </div>
              </div>

              {/* Facebook Link */}
              <div className="flex items-start gap-3 text-slate-300">
                <Facebook className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">صفحتنا الرسمية على فيسبوك:</span>
                  <a
                    href={RESTAURANT_INFO.facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-300 hover:underline block"
                  >
                    facebook.com/فسخاني-الحسانين
                  </a>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="py-3 px-4 rounded-xl text-xs font-bold text-center text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>اتصال مباشر</span>
                </a>

                <a
                  href={RESTAURANT_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl text-xs font-bold text-center text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>محادثة واتساب</span>
                </a>
              </div>

              {/* Google Maps Directions */}
              <a
                href={RESTAURANT_INFO.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-slate-200 hover:text-white bg-[#060F1E] hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-lime-400" />
                <span>الاتجاهات على خرائط Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

          </div>

          {/* Interactive Google Map Frame */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-[#060F1E] shadow-2xl relative min-h-[380px]">
            <iframe
              title="خريطة فسخاني الحسانين - حدائق القبة"
              src="https://maps.google.com/maps?q=Hadayek+El-Qobba,Cairo,Egypt&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[400px] border-0 filter contrast-[1.05]"
              loading="lazy"
              allowFullScreen
            />
            
            {/* Overlay Location Chip */}
            <div className="absolute top-4 right-4 bg-[#060F1E]/95 backdrop-blur-md border border-[#D4AF37]/50 p-3 rounded-xl shadow-xl text-right max-w-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
                <MapPin className="w-4 h-4 text-lime-400" />
                <span>فسخاني الحسانين</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                16 شارع الدويدار، حدائق القبة، بجوار أسماك السلطان
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
