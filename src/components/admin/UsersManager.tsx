import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, firebaseConfig } from '../../lib/firebase';
import { useAuth, AdminProfile } from '../../context/AuthContext';
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  Trash2,
  Mail,
  Lock,
  User as UserIcon,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const UsersManager: React.FC = () => {
  const { isOwner, user: currentUser } = useAuth();
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // New admin form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fetch admin profiles
  useEffect(() => {
    if (!isOwner) return;

    const unsub = onSnapshot(
      collection(db, 'admins'),
      (snapshot) => {
        const list: AdminProfile[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as AdminProfile);
        });
        setAdmins(list);
        setLoading(false);
      },
      (err) => {
        console.error('Fetch admins error:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [isOwner]);

  // If not owner, block access
  if (!isOwner) {
    return (
      <div className="bg-[#0D1F38] border border-amber-500/40 p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-white font-amiri">صلاحية خاصة بالمالك (OWNER) فقط</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          حسابك يمتلك صلاحيات المشرف (ADMIN)، والتي تتيح إدارة المنتجات والطلبات والأسعار. صلاحية إضافة المشرفين الجدد وإدارة الصلاحيات محصورة بحساب المالك الرئيسي (OWNER).
        </p>
      </div>
    );
  }

  // Create new ADMIN account safely using a secondary Firebase app instance
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    if (password.length < 6) {
      setActionError('كلمة المرور يجب أن لا تقل عن 6 خانات.');
      return;
    }

    setSubmitting(true);
    let secondaryApp = null;

    try {
      // 1. Initialize temporary secondary app so current OWNER stays logged in
      const secondaryAppName = `SecondaryAdminApp_${Date.now()}`;
      secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      const secondaryAuth = getAuth(secondaryApp);

      // 2. Create the Auth user
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), password);
      const newUid = cred.user.uid;

      // 3. Immediately sign out the secondary session
      await signOut(secondaryAuth);

      // 4. Save admin profile into Firestore with role 'ADMIN'
      await setDoc(doc(db, 'admins', newUid), {
        uid: newUid,
        email: email.trim(),
        name: name.trim() || 'مشرف جديد',
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.email || 'OWNER',
      });

      setActionSuccess(`تم إنشاء حساب المشرف (${email}) بنجاح! يمكنه الآن تسجيل الدخول.`);
      setName('');
      setEmail('');
      setPassword('');
      setIsModalOpen(false);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: any) {
      console.error('Create admin error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setActionError('هذا البريد الإلكتروني مسجل بالفعل لمستخدم آخر.');
      } else {
        setActionError(err.message || 'فشل إنشاء حساب المشرف.');
      }
    } finally {
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
        } catch (cleanupErr) {
          console.warn('Secondary app cleanup err', cleanupErr);
        }
      }
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (admin: AdminProfile) => {
    if (admin.role === 'OWNER') {
      alert('لا يمكن حذف حساب المالك الرئيسي (OWNER).');
      return;
    }

    if (!confirm(`هل أنت متأكد من إزالة المشرف: "${admin.name} (${admin.email})"؟ لن يتمكن من الدخول للوحة التحكم مجدداً.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'admins', admin.uid));
      setActionSuccess(`تمت إزالة المشرف ${admin.name} من النظام.`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      console.error('Delete admin error:', err);
      alert('خطأ أثناء إزالة المشرف: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0D1F38] border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white font-amiri flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D4AF37]" />
            <span>إدارة فريق العمل والصلاحيات (OWNER)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            إضافة مشرفين جدد (ADMIN)، متابعة حسابات الإدارة، والتحكم في صلاحيات الوصول للمتجر.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] text-slate-950 flex items-center gap-1.5 transition-all shadow-lg shadow-[#D4AF37]/20 active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة مشرف جديد</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Role Explanation Note */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#060F1E] border border-[#D4AF37]/30 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-amiri text-sm">صلاحية المالك (OWNER):</strong>
            <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
              تحكم مطلق في المتجر: إضافة وحذف المشرفين، تعديل أسعار ومنتجات المنيو، إدارة إعدادات المتجر وحذف الطلبات.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#060F1E] border border-blue-500/30 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-amiri text-sm">صلاحية المشرف (ADMIN):</strong>
            <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
              إضافة وتعديل المنتجات، تحديث حالات الطلبات اليومية، ولا يملك حق إدارة أو حذف حساب المالك أو المشرفين الآخرين.
            </p>
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-[#0D1F38] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white">قائمة المسؤولين المسجلين ({admins.length}):</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">جاري تحميل قائمة المشرفين...</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {admins.map((adm) => {
              const isCurrent = adm.uid === currentUser?.uid;

              return (
                <div key={adm.uid} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#060F1E] border border-slate-700 flex items-center justify-center text-slate-300">
                      <UserIcon className="w-5 h-5" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm font-amiri">{adm.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                            (أنت حالياً)
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            adm.role === 'OWNER'
                              ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50'
                              : 'bg-blue-950/70 text-blue-300 border border-blue-500/40'
                          }`}
                        >
                          {adm.role === 'OWNER' ? 'المالك الرئيسي OWNER' : 'مشرف إدارة ADMIN'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[11px]">
                        <span className="font-mono text-slate-300" dir="ltr">
                          {adm.email}
                        </span>
                        {adm.createdAt && (
                          <span>
                            تاريخ التسجيل:{' '}
                            {new Date(adm.createdAt).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    {adm.role !== 'OWNER' && (
                      <button
                        onClick={() => handleDeleteAdmin(adm)}
                        className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-500/20 flex items-center gap-1 cursor-pointer transition-colors"
                        title="حذف حساب المشرف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>إزالة الصلاحية</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Add New Admin */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0D1F38] border border-[#D4AF37]/50 rounded-2xl w-full max-w-md shadow-2xl text-right overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#060F1E]">
              <h3 className="text-base font-bold text-white font-amiri flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                <span>إضافة مشرف جديد (ADMIN)</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-5 space-y-4">
              {actionError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">اسم المشرف / الموظف *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: محمود علي (مسؤول الفرع)"
                  className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">البريد الإلكتروني *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@elhassanin.com"
                  className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">كلمة المرور (6 خانات أو أكثر) *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] font-mono text-left"
                  dir="ltr"
                />
                <p className="text-[10px] text-slate-400">
                  قم بتسليم هذه البيانات للمشرف ليتمكن من تسجيل الدخول للوحة التحكم.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] rounded-xl shadow cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'جاري الإنشاء...' : 'إنشاء حساب المشرف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
