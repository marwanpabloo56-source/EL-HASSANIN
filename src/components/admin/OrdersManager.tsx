import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import {
  ShoppingBag,
  Search,
  CheckCircle,
  Clock,
  Bike,
  Store,
  Phone,
  MessageCircle,
  Trash2,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  XCircle,
} from 'lucide-react';

export interface AdminOrderItem {
  productId: string;
  productName: string;
  weightKg: number;
  weightLabel: string;
  unitPricePerKg?: number;
  totalPrice: number;
}

export interface AdminOrder {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  orderNotes?: string;
  items: AdminOrderItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  createdAt: string;
}

export const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'preparing' | 'completed' | 'cancelled'>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | 'delivery' | 'pickup'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    // Listen to orders ordered by createdAt descending
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: AdminOrder[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), orderId: d.id } as AdminOrder);
        });
        setOrders(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'orders');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: AdminOrder['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      setActionNotice(`تم تحديث حالة الطلب #${orderId} بنجاح.`);
      setTimeout(() => setActionNotice(''), 2500);
    } catch (err: any) {
      console.error('Update status error:', err);
      alert('خطأ أثناء تحديث حالة الطلب: ' + err.message);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`هل أنت متأكد من حذف الطلب #${orderId} نهائياً؟`)) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setActionNotice(`تم حذف الطلب #${orderId}`);
      setTimeout(() => setActionNotice(''), 2500);
    } catch (err: any) {
      console.error('Delete order error:', err);
      alert('خطأ أثناء الحذف: ' + err.message);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  // Filter orders
  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchMethod = methodFilter === 'all' || o.deliveryMethod === methodFilter;
    const matchQuery =
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      (o.address && o.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchMethod && matchQuery;
  });

  const getStatusBadge = (status: AdminOrder['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 animate-pulse" />
            <span>طلب جديد بانتظار التأكيد</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-300 bg-blue-950/70 border border-blue-500/40 px-2.5 py-0.5 rounded-full">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>قيد التجهيز والتغليف</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span>تم التسليم بنجاح</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-300 bg-red-950/70 border border-red-500/40 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" />
            <span>ملغي</span>
          </span>
        );
      default:
        return null;
    }
  };

  const formatCleanPhone = (phone: string) => {
    let p = phone.replace(/[^0-9]/g, '');
    if (p.startsWith('0')) {
      p = '2' + p;
    }
    return p;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0D1F38] border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white font-amiri flex items-center gap-2">
            <span>إدارة وتتبع طلبات الزبائن</span>
            <span className="text-xs font-mono text-[#D4AF37] bg-[#060F1E] px-2.5 py-0.5 rounded-full border border-slate-700">
              {orders.length} طلب إجمالي
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            متابعة الطلبات المباشرة، تحديث مراحل التجهيز، وتفاصيل الفاتورة والعنوان والتواصل مع العميل عبر واتساب وهاتفياً.
          </p>
        </div>

        {/* Quick Pending Counter */}
        <div className="flex items-center gap-2 bg-[#060F1E] px-3.5 py-2 rounded-xl border border-amber-500/30 text-xs">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">طلبات جديدة معلقة:</span>
          <strong className="text-amber-300 font-mono text-sm">
            {orders.filter((o) => o.status === 'pending').length}
          </strong>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="space-y-3 bg-[#0D1F38] p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث برقم الطلب، اسم العميل، الهاتف أو العنوان..."
              className="w-full pr-10 pl-4 py-2.5 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Delivery Method Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-[#060F1E] border border-slate-700 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setMethodFilter('all')}
              className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer ${
                methodFilter === 'all' ? 'bg-[#D4AF37] text-slate-950 font-bold' : 'text-slate-300'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setMethodFilter('delivery')}
              className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer flex items-center gap-1 ${
                methodFilter === 'delivery' ? 'bg-[#D4AF37] text-slate-950 font-bold' : 'text-slate-300'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>توصيل</span>
            </button>
            <button
              onClick={() => setMethodFilter('pickup')}
              className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer flex items-center gap-1 ${
                methodFilter === 'pickup' ? 'bg-[#D4AF37] text-slate-950 font-bold' : 'text-slate-300'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>استلام</span>
            </button>
          </div>
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800 no-scrollbar">
          {[
            { id: 'all', label: `جميع الحالات (${orders.length})` },
            { id: 'pending', label: `جديد (${orders.filter((o) => o.status === 'pending').length})` },
            { id: 'preparing', label: `قيد التجهيز (${orders.filter((o) => o.status === 'preparing').length})` },
            { id: 'completed', label: `تم التسليم (${orders.filter((o) => o.status === 'completed').length})` },
            { id: 'cancelled', label: `ملغي (${orders.filter((o) => o.status === 'cancelled').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === tab.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white bg-[#060F1E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">جاري تحميل سجل الطلبات...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#0D1F38]/50 border border-slate-800 rounded-2xl p-8 space-y-3">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-base font-bold text-white font-amiri">لا توجد طلبات مطابقة</p>
          <p className="text-xs text-slate-400">
            {orders.length === 0
              ? 'لم يستقبل المتجر أي طلبات بعد. عند قيام العميل بالطلب عبر السلة، سيظهر هنا فوراً.'
              : 'جرب تغيير فلاتر البحث أو الحالات بالأعلى.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((order) => {
            const isExpanded = expandedOrderId === order.orderId;
            const cleanPhone = formatCleanPhone(order.customerPhone);

            return (
              <div
                key={order.orderId}
                className="bg-[#0D1F38] border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                {/* Summary Row */}
                <div
                  onClick={() => toggleExpand(order.orderId)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/20"
                >
                  {/* Left (Order ID + Customer info) */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#060F1E] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 font-mono font-bold text-xs">
                      #{order.orderId.slice(-4)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm font-amiri">
                          {order.customerName}
                        </span>
                        <span className="text-xs text-slate-400 font-mono" dir="ltr">
                          {order.customerPhone}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-[11px]">
                          {order.deliveryMethod === 'delivery' ? (
                            <>
                              <Bike className="w-3.5 h-3.5 text-lime-400" />
                              <span>توصيل للمنزل</span>
                            </>
                          ) : (
                            <>
                              <Store className="w-3.5 h-3.5 text-amber-400" />
                              <span>استلام من الفرع</span>
                            </>
                          )}
                        </span>

                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          {order.items?.length || 0} أصناف
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right (Total Price + Quick Status buttons + Expand Toggle) */}
                  <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-left">
                      <div className="flex items-baseline gap-1 text-[#F3E5AB]">
                        <span className="text-xl font-black font-mono tabular-nums">
                          {order.grandTotal}
                        </span>
                        <span className="text-xs font-bold">ج.م</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">شامل التوصيل</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 transition-colors"
                        title="محادثة واتساب مباشرة"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      <a
                        href={`tel:${order.customerPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                        title="اتصال هاتفي بالعميل"
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      <button
                        type="button"
                        className="p-2 text-slate-400 hover:text-white"
                        aria-label="تفاصيل الطلب"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed View */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#060F1E]/80 space-y-4 animate-in fade-in">
                    
                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#0D1F38] p-3.5 rounded-xl border border-slate-800">
                      <div className="space-y-1">
                        <span className="text-slate-400 block font-semibold">بيانات التوصيل والموقع:</span>
                        <p className="text-slate-200 flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                          <span>
                            {order.deliveryMethod === 'delivery'
                              ? order.address || 'العنوان غير محدد'
                              : 'استلام من فرع حدائق القبة (16 شارع الدويدار)'}
                          </span>
                        </p>
                      </div>

                      {order.orderNotes && (
                        <div className="space-y-1">
                          <span className="text-slate-400 block font-semibold">ملاحظات العميل:</span>
                          <p className="text-amber-200 bg-[#060F1E] p-2 rounded-lg border border-slate-800">
                            {order.orderNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Ordered Items Breakdown */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#F3E5AB] block">
                        تفاصيل الأصناف والأوزان:
                      </span>
                      <div className="bg-[#0D1F38] rounded-xl border border-slate-800 divide-y divide-slate-800">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between text-xs">
                            <div className="space-y-0.5">
                              <span className="font-bold text-white block">{item.productName}</span>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span className="text-amber-300 font-mono">{item.weightLabel}</span>
                                {item.unitPricePerKg && (
                                  <span>(سعر الكيلو: {item.unitPricePerKg} ج.م)</span>
                                )}
                              </div>
                            </div>

                            <div className="font-mono font-bold text-white text-sm">
                              {item.totalPrice} ج.م
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex justify-end">
                      <div className="w-full sm:w-64 space-y-1.5 text-xs bg-[#0D1F38] p-3 rounded-xl border border-slate-800">
                        <div className="flex justify-between text-slate-400">
                          <span>مجموع الأصناف:</span>
                          <span className="font-mono text-white">{order.subtotal} ج.م</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>خدمة التوصيل:</span>
                          <span className="font-mono text-white">
                            {order.deliveryFee === 0 ? 'مجاناً' : `${order.deliveryFee} ج.م`}
                          </span>
                        </div>
                        <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-700">
                          <span>الإجمالي النهائي:</span>
                          <span className="font-mono text-[#F3E5AB] text-sm">{order.grandTotal} ج.م</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Management Actions */}
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">تغيير الحالة:</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.orderId, 'pending')}
                            disabled={order.status === 'pending'}
                            className="px-2.5 py-1 text-xs rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-amber-200 cursor-pointer disabled:opacity-40"
                          >
                            جديد
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.orderId, 'preparing')}
                            disabled={order.status === 'preparing'}
                            className="px-2.5 py-1 text-xs rounded-lg bg-blue-950/70 hover:bg-blue-900 border border-blue-500/40 text-blue-200 cursor-pointer disabled:opacity-40"
                          >
                            قيد التجهيز
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.orderId, 'completed')}
                            disabled={order.status === 'completed'}
                            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 cursor-pointer disabled:opacity-40"
                          >
                            تم التسليم
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.orderId, 'cancelled')}
                            disabled={order.status === 'cancelled'}
                            className="px-2.5 py-1 text-xs rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-200 cursor-pointer disabled:opacity-40"
                          >
                            إلغاء الطلب
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.orderId)}
                        className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/50 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف السجل</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
