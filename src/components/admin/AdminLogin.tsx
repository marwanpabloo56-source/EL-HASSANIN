import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../BrandLogo';
import { Shield, Lock, Mail, User, AlertCircle, ArrowRight, Sparkles, Check } from 'lucide-react';

interface AdminLoginProps {
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStore }) => {
  const { isInitialized, checkInitializationStatus, refreshProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Is this the very first owner bootstrap?
  const isFirstTimeSetup = isInitialized === false;

  useEffect(() => {
    if (isFirstTimeSetup && !email) {
      setEmail('marwanpabloo56@gmail.com');
    }
  }, [isFirstTimeSetup]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      await refreshProfile();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('تم حظر المحاولات مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى الانتظار دقيقة.');
      } else {
        setErrorMsg(err.message || 'حدث خطأ أثناء تسجيل الدخول.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFirstTimeOwnerSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== 'marwanpabloo56@gmail.com') {
      setErrorMsg('غير مصرح لك بإنشاء حساب المالك. عملية التهيئة محصورة ببريد المالك المعتمد فقط (marwanpabloo56@gmail.com).');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('كلمتا المرور غير متطابقتين.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('يجب أن تتكون كلمة المرور من 6 أحرف أو أرقام على الأقل.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the Firebase Auth account
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;

      // 2. Create the Admin record in Firestore with role OWNER
      await setDoc(doc(db, 'admins', uid), {
        uid,
        email: email.trim(),
        name: name.trim() || 'مالك الحسانين',
        role: 'OWNER',
        createdAt: new Date().toISOString(),
      });

      // 3. Mark the store as initialized so no one else can bootstrap an owner
      await setDoc(doc(db, 'settings', 'initialized'), {
        initialized: true,
        setupAt: new Date().toISOString(),
        ownerEmail: email.trim(),
        ownerUid: uid,
      });

      setSuccessMsg('تم إنشاء حساب المالك (OWNER) بنجاح! جاري تحويلك للوحة التحكم...');
      await checkInitializationStatus();
      await refreshProfile();
    } catch (err: any) {
      console.error('Owner setup error:', err);
      setErrorMsg(err.message || 'فشل إنشاء حساب المالك. يرجى المحاولة مجدداً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060F1E] flex flex-col justify-center items-center p-4 selection:bg-[#D4AF37] selection:text-black font-['Cairo',sans-serif] text-right" dir="rtl">
      
      {/* Background ambient lighting */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-80 h-80 bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Top Logo and Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo variant="full" size="lg" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white font-amiri flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              <span>{isFirstTimeSetup ? 'تهيئة حساب المالك (OWNER Setup)' : 'بوابة المشرفين والإدارة'}</span>
            </h1>
            <p className="text-xs text-slate-400">
              {isFirstTimeSetup
                ? 'النظام غير مهيأ بعد. يرجى إنشاء حساب المالك الرئيسي صاحب الصلاحيات الكاملة.'
                : 'لوحة التحكم الإدارية لمطعم ومتجر فسخاني الحسانين'}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#0D1F38] border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {isFirstTimeSetup ? (
            /* FIRST TIME OWNER BOOTSTRAP FORM */
            <form onSubmit={handleFirstTimeOwnerSetup} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#060F1E] border border-[#D4AF37]/30 text-[11px] text-[#F3E5AB] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>إعداد لمرة واحدة: هذا الحساب سيكون المالك (OWNER) وله كامل الصلاحيات.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>اسم المالك / المدير العام:</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد الحسانين (المالك)"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#060F1E] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>البريد الإلكتروني للمالك:</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@elhassanin.com"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#060F1E] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500 font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>كلمة المرور (6 خانات على الأقل):</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#060F1E] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500 font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>تأكيد كلمة المرور:</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#060F1E] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500 font-mono text-left"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] text-slate-950 shadow-lg cursor-pointer transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'جاري إنشاء الحساب...' : 'إنهاء الإعداد وبدء لوحة التحكم'}
              </button>
            </form>
          ) : (
            /* STANDARD SECURE ADMIN LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>البريد الإلكتروني:</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@elhassanin.com"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#060F1E] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500 font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>كلمة المرور:</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#060F1E] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500 font-mono text-left"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] text-slate-950 shadow-lg cursor-pointer transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'جاري التحقق...' : 'تسجيل الدخول إلى لوحة التحكم'}
              </button>
            </form>
          )}

          {/* Back to website button */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onBackToStore}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لموقع فسخاني الحسانين</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
