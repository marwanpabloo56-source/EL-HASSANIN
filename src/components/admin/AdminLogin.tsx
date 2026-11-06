import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../BrandLogo';
import {
  Shield,
  Lock,
  Mail,
  User,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Check,
  ExternalLink,
  Info,
} from 'lucide-react';

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
  const [errorDetails, setErrorDetails] = useState<{
    code?: string;
    message?: string;
    isOperationNotAllowed?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Is this the very first owner bootstrap?
  const isFirstTimeSetup = isInitialized === false;

  useEffect(() => {
    if (isFirstTimeSetup && !email) {
      setEmail('marwanpabloo56@gmail.com');
    }
  }, [isFirstTimeSetup]);

  const handleAuthError = (err: any) => {
    console.error('Authentication Error Details:', {
      code: err.code,
      message: err.message,
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
    });

    if (err.code === 'auth/operation-not-allowed') {
      setErrorDetails({
        code: err.code,
        message: err.message,
        isOperationNotAllowed: true,
      });
      setErrorMsg(
        `مزود (Email/Password) غير مفعل في مشروع Firebase الحالي: [${firebaseConfig.projectId}]. يرجى تفعيله من لوحة تحكم Firebase، أو استخدام الدخول المباشر بحساب Google للمالك.`
      );
    } else if (
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password'
    ) {
      setErrorDetails(null);
      setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    } else if (err.code === 'auth/too-many-requests') {
      setErrorDetails(null);
      setErrorMsg('تم حظر المحاولات مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى الانتظار دقيقة.');
    } else if (err.code === 'auth/popup-closed-by-user') {
      setErrorDetails(null);
      setErrorMsg('تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.');
    } else {
      setErrorDetails({ code: err.code, message: err.message });
      setErrorMsg(err.message || 'حدث خطأ أثناء المصادقة.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setErrorDetails(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      await refreshProfile();
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFirstTimeOwnerSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setErrorDetails(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== 'marwanpabloo56@gmail.com') {
      setErrorMsg(
        'غير مصرح لك بإنشاء حساب المالك. عملية التهيئة محصورة ببريد المالك المعتمد فقط (marwanpabloo56@gmail.com).'
      );
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
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In for OWNER bootstrap or login (pre-configured in AI Studio projects)
  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setErrorDetails(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const authedUser = result.user;
      const authedEmail = authedUser.email?.trim().toLowerCase();

      // If initial setup, strictly verify it's the authorized owner
      if (isFirstTimeSetup) {
        if (authedEmail !== 'marwanpabloo56@gmail.com') {
          setErrorMsg(
            `الحساب الذي اخترته (${authedUser.email}) ليس بريد المالك المعتمد (marwanpabloo56@gmail.com).`
          );
          await auth.signOut();
          setLoading(false);
          return;
        }

        const uid = authedUser.uid;
        // Save OWNER in Firestore
        await setDoc(doc(db, 'admins', uid), {
          uid,
          email: authedUser.email,
          name: authedUser.displayName || 'مالك الحسانين',
          role: 'OWNER',
          createdAt: new Date().toISOString(),
        });

        // Initialize store
        await setDoc(doc(db, 'settings', 'initialized'), {
          initialized: true,
          setupAt: new Date().toISOString(),
          ownerEmail: authedUser.email,
          ownerUid: uid,
        });

        setSuccessMsg('تم التحقق وتهيئة حساب المالك عبر Google بنجاح! جاري تحويلك...');
        await checkInitializationStatus();
      }

      await refreshProfile();
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const firebaseConsoleUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`;

  return (
    <div
      className="min-h-screen bg-[#060F1E] flex flex-col justify-center items-center p-4 selection:bg-[#D4AF37] selection:text-black font-['Cairo',sans-serif] text-right"
      dir="rtl"
    >
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
              <span>
                {isFirstTimeSetup
                  ? 'تهيئة حساب المالك (OWNER Setup)'
                  : 'بوابة المشرفين والإدارة'}
              </span>
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
          {/* Detailed Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{errorMsg}</span>
              </div>

              {/* Specific helper if auth/operation-not-allowed */}
              {errorDetails?.isOperationNotAllowed && (
                <div className="bg-[#060F1E] p-3 rounded-lg border border-red-500/30 text-[11px] text-slate-300 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Info className="w-3.5 h-3.5" />
                    <span>تشخيص وحل المشكلة:</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    سبب هذا الخطأ هو أن خيار <strong>Email/Password</strong> لم يتم تفعيله أو حفظه في مشروع Firebase الحالي:
                  </p>
                  <div className="bg-slate-900 p-2 rounded border border-slate-700 font-mono text-[10px] text-[#F3E5AB]">
                    Project ID: {firebaseConfig.projectId}
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>تأكد من فتح مشروع <strong>{firebaseConfig.projectId}</strong> في Firebase Console.</li>
                    <li>اذهب إلى Authentication ← Sign-in method ← Email/Password واضغط <strong>Enable</strong> ثم <strong>Save</strong>.</li>
                  </ol>
                  <a
                    href={firebaseConsoleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#D4AF37] hover:underline font-bold text-[11px] pt-1"
                  >
                    <span>فتح إعدادات المشروع في Firebase Console مباشرة</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick One-Click Google Sign-In Option for OWNER */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center gap-2.5 shadow-md cursor-pointer transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {isFirstTimeSetup
                  ? 'تهيئة حساب المالك مباشرة بحساب Google (marwanpabloo56@gmail.com)'
                  : 'تسجيل الدخول السريع بحساب Google'}
              </span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0D1F38] px-3 text-[11px] text-slate-500 font-semibold absolute">
                أو باستخدام البريد وكلمة المرور
              </span>
            </div>
          </div>

          {isFirstTimeSetup ? (
            /* FIRST TIME OWNER BOOTSTRAP FORM */
            <form onSubmit={handleFirstTimeOwnerSetup} className="space-y-4 pt-2">
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
                  placeholder="مثال: مروان (مالك الحسانين)"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#060F1E] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>البريد الإلكتروني المعتمد للمالك:</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marwanpabloo56@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#060F1E] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500 font-mono text-left"
                  dir="ltr"
                />
                <span className="text-[10px] text-amber-300/80 block">
                  البريد المصرح له بالتهيئة الأولى في قواعد الأمان: marwanpabloo56@gmail.com
                </span>
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
                {loading ? 'جاري التحقق وإنشاء الحساب...' : 'إنهاء الإعداد وبدء لوحة التحكم'}
              </button>
            </form>
          ) : (
            /* STANDARD SECURE ADMIN LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4 pt-2">
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

          {/* Active Firebase Connection Info Footer */}
          <div className="pt-3 border-t border-slate-800 space-y-2 text-[10px] text-slate-500 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400">
              <span>المشروع السحابي المتصل:</span>
              <span className="font-mono text-[#D4AF37]">{firebaseConfig.projectId}</span>
            </div>

            <button
              type="button"
              onClick={onBackToStore}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors pt-1"
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
