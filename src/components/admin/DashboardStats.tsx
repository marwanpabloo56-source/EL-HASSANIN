import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AdminOrder } from './OrdersManager';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  Bike,
  Store,
  Award,
  Calendar,
  Percent,
} from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const list: AdminOrder[] = [];
      snapshot.forEach((d) => {
        list.push({ ...d.data(), orderId: d.id } as AdminOrder);
      });
      setOrders(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => {
    if (o.status !== 'cancelled') {
      return sum + (o.grandTotal || 0);
    }
    return sum;
  }, 0);

  const completedOrders = orders.filter((o) => o.status === 'completed');
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');

  const validOrdersCount = orders.filter((o) => o.status !== 'cancelled').length;
  const averageTicket = validOrdersCount > 0 ? Math.round(totalRevenue / validOrdersCount) : 0;

  // Delivery vs Pickup
  const deliveryCount = orders.filter((o) => o.deliveryMethod === 'delivery').length;
  const pickupCount = orders.filter((o) => o.deliveryMethod === 'pickup').length;

  // Top products calculation
  const productTally: Record<string, { name: string; count: number; totalRev: number }> = {};
  orders.forEach((o) => {
    if (o.status !== 'cancelled' && o.items) {
      o.items.forEach((item) => {
        if (!productTally[item.productName]) {
          productTally[item.productName] = {
            name: item.productName,
            count: 0,
            totalRev: 0,
          };
        }
        productTally[item.productName].count += 1;
        productTally[item.productName].totalRev += item.totalPrice || 0;
      });
    }
  });

  const topProducts = Object.values(productTally)
    .sort((a, b) => b.totalRev - a.totalRev)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#0D1F38] border border-slate-800 p-5 rounded-2xl">
        <h2 className="text-xl font-bold text-white font-amiri flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
          <span>لوحة الإحصائيات وتقارير المبيعات</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          نظرة شمولية على حجم المبيعات، إجمالي الفواتير، ونشاط الطلبات وأكثر الأصناف مبيعاً في فسخاني الحسانين.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#0D1F38] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">إجمالي المبيعات النشطة</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1 text-[#F3E5AB]">
            <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums">
              {totalRevenue.toLocaleString('ar-EG')}
            </span>
            <span className="text-xs font-bold text-slate-400">ج.م</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
            <span>مبيعات جميع الطلبات المؤكدة والمسلمة</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#0D1F38] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">إجمالي الطلبات الواردة</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1 text-white">
            <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums">
              {orders.length}
            </span>
            <span className="text-xs font-bold text-slate-400">طلب</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>منها {completedOrders.length} تم تسليمه</span>
          </div>
        </div>

        {/* Average Ticket */}
        <div className="bg-[#0D1F38] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">متوسط قيمة الفاتورة</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1 text-[#F3E5AB]">
            <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums">
              {averageTicket}
            </span>
            <span className="text-xs font-bold text-slate-400">ج.م / طلب</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>معدل الصرف للطلب الواحد</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-[#0D1F38] border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">طلبات تحتاج للمتابعة</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1 text-amber-300">
            <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums">
              {pendingOrders.length + preparingOrders.length}
            </span>
            <span className="text-xs font-bold text-slate-400">طلب قيد العمل</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400/90 flex items-center gap-1">
            <span>{pendingOrders.length} جديد + {preparingOrders.length} قيد التجهيز</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Top Products & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Selling Products */}
        <div className="bg-[#0D1F38] border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-amiri flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>الأصناف الأكثر طلباً ومبيعاً</span>
            </h3>
            <span className="text-[11px] text-slate-400">بحسب العائد الإجمالي</span>
          </div>

          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              لا توجد بيانات كافية بعد لحساب الأصناف الأكثر طلباً.
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-[#060F1E] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] font-bold font-mono flex items-center justify-center text-[11px]">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white block">{p.name}</span>
                      <span className="text-[10px] text-slate-400">
                        تم طلبه {p.count} مرات
                      </span>
                    </div>
                  </div>

                  <div className="text-left font-mono font-bold text-[#F3E5AB]">
                    {p.totalRev} ج.م
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status & Delivery Breakdown */}
        <div className="bg-[#0D1F38] border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-amiri flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>توزيع الحالات وطرق الاستلام</span>
            </h3>
          </div>

          {/* Status Breakdown Bar */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">توزيع حالات الطلبات:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 bg-[#060F1E] rounded-xl border border-amber-500/30">
                <span className="text-[10px] text-amber-300 block">جديد</span>
                <span className="text-lg font-mono font-bold text-white">{pendingOrders.length}</span>
              </div>
              <div className="p-3 bg-[#060F1E] rounded-xl border border-blue-500/30">
                <span className="text-[10px] text-blue-300 block">تجهيز</span>
                <span className="text-lg font-mono font-bold text-white">{preparingOrders.length}</span>
              </div>
              <div className="p-3 bg-[#060F1E] rounded-xl border border-emerald-500/30">
                <span className="text-[10px] text-emerald-300 block">تم التسليم</span>
                <span className="text-lg font-mono font-bold text-white">{completedOrders.length}</span>
              </div>
              <div className="p-3 bg-[#060F1E] rounded-xl border border-red-500/30">
                <span className="text-[10px] text-red-300 block">ملغي</span>
                <span className="text-lg font-mono font-bold text-white">{cancelledOrders.length}</span>
              </div>
            </div>
          </div>

          {/* Delivery Method Ratio */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-semibold block">نوع الاستلام:</span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#060F1E] rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-lime-400" />
                  <span className="text-slate-300">توصيل منزلي</span>
                </div>
                <span className="font-mono font-bold text-white text-base">{deliveryCount}</span>
              </div>

              <div className="p-3 bg-[#060F1E] rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300">استلام فرع</span>
                </div>
                <span className="font-mono font-bold text-white text-base">{pickupCount}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
