import React, { useState } from 'react';
import { X, Download, Copy, Check, Shield, Palette } from 'lucide-react';
import { EMBLEM_LOGO_IMG } from '../data/menuData';
import { BrandLogo } from './BrandLogo';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandKitModal: React.FC<BrandKitModalProps> = ({ isOpen, onClose }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  if (!isOpen) return null;

  const brandColors = [
    { name: 'كحلي ملكي عميق', hex: '#060F1E', usage: 'الخلفية والأساس الملكي' },
    { name: 'كحلي ليلي', hex: '#0D1F38', usage: 'البطاقات والأسطح' },
    { name: 'ذهبي مصري فاخر', hex: '#D4AF37', usage: 'الأزرار والزخارف الملكية' },
    { name: 'ذهبي عتيق', hex: '#C5A059', usage: 'النصوص والشعارات' },
    { name: 'أبيض عاجي نقي', hex: '#FAF8F5', usage: 'العناوين والأصالة' },
    { name: 'أخضر ليموني منعش', hex: '#84CC16', usage: 'لمسات الليمون والطازة' },
  ];

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-3xl bg-[#07111E] border border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 text-right space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37]">
            <Shield className="w-4 h-4" />
            <span>الهوية البصرية الحصرية 100%</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-amiri">
            شعار وهوية فسخاني الحسانين
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            شعار ملكي مصمم خصيصاً ليجمع بين التراث المصري العريق وفخامة الأسماك المملحة.
          </p>
        </div>

        {/* Logo Variations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Square Profile (Facebook & Instagram avatar) */}
          <div className="p-4 rounded-xl bg-[#0D1F38] border border-slate-800 flex flex-col items-center text-center space-y-3">
            <div className="w-32 h-32 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-[#99732B] via-[#F3E5AB] to-[#C5A059] shadow-xl">
              <img
                src={EMBLEM_LOGO_IMG}
                alt="شعار فسخاني الحسانين لفيسبوك"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-white block font-amiri">نسخة صورة فيسبوك / بروفايل</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">مربعة عالية الدقة (1:1)</span>
            </div>
            <a
              href={EMBLEM_LOGO_IMG}
              download="Fasakhani_ElHassanein_Facebook_Logo.jpg"
              className="w-full py-1.5 px-3 text-xs font-bold text-slate-950 bg-[#D4AF37] hover:bg-[#e2be4a] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل الصورة</span>
            </a>
          </div>

          {/* 2. Transparent Circular Emblem */}
          <div className="p-4 rounded-xl bg-[#0D1F38] border border-slate-800 flex flex-col items-center text-center space-y-3">
            <div className="w-32 h-32 rounded-full flex items-center justify-center bg-[#07111E]/80 border border-[#D4AF37]/30 shadow-inner">
              <BrandLogo variant="emblem-only" size="xl" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block font-amiri">شعار فيكتور شفاف (SVG)</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">بدون خلفية - قابل للتكبير لأي حجم</span>
            </div>
            <button
              onClick={() => {
                alert('الشعار مدمج بدقة فيكتور عالية داخل التطبيق ويتم عرضه بصيغة SVG فائقة النقاء.');
              }}
              className="w-full py-1.5 px-3 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>معاينة الفيكتور</span>
            </button>
          </div>

          {/* 3. Website Favicon & App Icon */}
          <div className="p-4 rounded-xl bg-[#0D1F38] border border-slate-800 flex flex-col items-center text-center space-y-3">
            <div className="w-32 h-32 flex flex-col items-center justify-center gap-2">
              <div className="w-16 h-16 rounded-xl bg-[#060F1E] border-2 border-[#D4AF37] p-1 flex items-center justify-center shadow-lg">
                <BrandLogo variant="emblem-only" size="sm" />
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Favicon 64x64</span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block font-amiri">أيقونة الموقع والتطبيقات</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">واضحة وصريحة في المتصفح</span>
            </div>
            <div className="w-full py-1.5 px-2 text-[11px] text-amber-300 bg-amber-950/40 rounded-lg border border-[#C5A059]/30">
              مفعلة تلقائياً في المتصفح
            </div>
          </div>

        </div>

        {/* Color Palette section */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Palette className="w-4 h-4 text-[#D4AF37]" />
            <span>لوحة الألوان الملكية للهوية:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {brandColors.map((c) => (
              <button
                key={c.hex}
                onClick={() => handleCopyColor(c.hex)}
                className="p-2.5 rounded-lg bg-[#0D1F38] border border-slate-800 hover:border-[#D4AF37] text-right space-y-1.5 transition-colors cursor-pointer group"
                title="اضغط لنسخ كود اللون"
              >
                <div
                  className="w-full h-8 rounded border border-white/10 shadow-inner flex items-center justify-center"
                  style={{ backgroundColor: c.hex }}
                >
                  {copiedColor === c.hex && (
                    <span className="text-[10px] bg-black/80 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> نُسخ
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-bold text-white truncate">{c.name}</div>
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span>{c.hex}</span>
                  <Copy className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 text-[#D4AF37]" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
