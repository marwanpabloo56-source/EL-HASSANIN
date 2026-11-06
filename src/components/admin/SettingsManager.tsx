import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Store,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Bike,
  Megaphone,
  Check,
  AlertCircle,
  Save,
  ShieldAlert,
} from 'lucide-react';

export interface StoreSettingsData {
  storeName: string;
  phone: string;
  whatsapp: string;
  address: string;
  openingHours: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  announcementText: string;
  isAnnouncementActive: boolean;
  isOpenForOrders: boolean;
}

const DEFAULT_SETTINGS: StoreSettingsData = {
  storeName: 'فسخاني الحسانين EL HASSANIN',
  phone: '01143226043',
  whatsapp: '01143226043',
  address: '16 شارع الدويدار، حدائق القبة، القاهرة (بجوار أسماك السلطان)',
  openingHours: 'يومياً من 10:00 صباحاً حتى 1:00 بعد منتصف الليل',
  freeDeliveryThreshold: 700,
  standardDeliveryFee: 40,
  announcementText: 'عزومات الفسيخ الملكي والرنجة المدخنة الفاخرة - توصيل سريع لجميع مناطق القاهرة والجيزة!',
  isAnnouncementActive: true,
  isOpenForOrders: true,
};

export const SettingsManager: React.FC = () => {
  const { isOwner } = useAuth();
  const [settings, setSettings] = useState<StoreSettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...snap.data() });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (!isOwner) {
    return (
      <div className="bg-[#0D1F38] border border-amber-500/40 p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-white font-amiri">صلاحية خاصة بالمالك (OWNER) فقط</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          تعديل إعدادات المتجر العامة، أرقام الواتساب ورسوم التوصيل محصورة بحساب المالك الرئيسي (OWNER).
        </p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');

    try {
      await setDoc(doc(db, 'settings', 'general'), {
        ...settings,
        updatedAt: new Date().toISOString(),
      });
      setSaveSuccess('تم حفظ إعدادات المتجر بنجاح!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err: any) {
      console.error('Save settings error:', err);
      alert('خطأ أثناء حفظ الإعدادات: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-slate-400">جاري تحميل إعدادات المتجر...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#0D1F38] border border-slate-800 p-5 rounded-2xl">
        <h2 className="text-xl font-bold text-white font-amiri flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#D4AF37]" />
          <span>إعدادات المتجر العامة والتوصيل</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          التحكم في أرقام الواتساب الرسمية، رسوم التوصيل، حد التوصيل المجاني والإعلانات الترويجية.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Contact & Orders Phone */}
        <div className="bg-[#0D1F38] border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white font-amiri flex items-center gap-2 border-b border-slate-800 pb-3">
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>بيانات الاتصال واستقبال الطلبات</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold block">اسم المطعم / المتجر</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold block">رقم واتساب المعتمد لتلقي الطلبات *</label>
              <input
                type="text"
                required
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] font-mono text-left"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold block">رقم الهاتف للاتصال المباشر</label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] font-mono text-left"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold block">مواعيد وساعات العمل</label>
              <input
                type="text"
                required
                value={settings.openingHours}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-semibold block">عنوان المطعم الرسمي (حدائق القبة)</label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Delivery Rates & Rules */}
        <div className="bg-[#0D1F38] border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white font-amiri flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bike className="w-4 h-4 text-[#D4AF37]" />
            <span>تسعيرة وسياسات التوصيل للمنازل</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold block">
                الحد الأدنى للتوصيل المجاني (ج.م)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  step="50"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) =>
                    setSettings({ ...settings, freeDeliveryThreshold: parseInt(e.target.value) || 0 })
                  }
                  className="w-full pr-3 pl-12 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] font-mono"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">ج.م</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold block">
                رسوم التوصيل العادية للطلبات الأقل من الحد (ج.م)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  step="5"
                  value={settings.standardDeliveryFee}
                  onChange={(e) =>
                    setSettings({ ...settings, standardDeliveryFee: parseInt(e.target.value) || 0 })
                  }
                  className="w-full pr-3 pl-12 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] font-mono"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">ج.م</span>
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="bg-[#0D1F38] border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-amiri flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#D4AF37]" />
              <span>الشريط الإعلاني أعلى الموقع</span>
            </h3>

            <label className="text-xs text-amber-200 flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isAnnouncementActive}
                onChange={(e) => setSettings({ ...settings, isAnnouncementActive: e.target.checked })}
                className="rounded"
              />
              <span>تفعيل الشريط</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-semibold block">نص الرسالة الترويجية</label>
            <textarea
              rows={2}
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] text-slate-950 flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95 cursor-pointer disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات في الإعدادات'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
