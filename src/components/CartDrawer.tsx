import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Send,
  MapPin,
  Phone,
  User,
  Bike,
  Store,
  CheckCircle,
  Scale,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CartItem } from '../types/restaurant';
import { RESTAURANT_INFO } from '../data/menuData';
import {
  formatWeightLabel,
  generateOrderId,
  buildWhatsAppOrderMessage,
  getWhatsAppOrderUrl,
  calculateItemPrice,
  OrderCheckoutData,
} from '../utils/orderUtils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateWeight: (cartItemId: string, newWeightKg: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateWeight,
  onRemoveItem,
  onClearCart,
}) => {
  // Navigation steps: 'cart' -> 'checkout' -> 'guidance'
  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout' | 'guidance'>('cart');

  // Customer Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Generated Order Details for Step 3
  const [activeOrderData, setActiveOrderData] = useState<OrderCheckoutData | null>(null);
  const [whatsappMessageText, setWhatsappMessageText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  // 1. Calculate Subtotal dynamically
  const subtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  // Free delivery threshold: 700 EGP or 40 EGP delivery fee
  const deliveryFee = deliveryMethod === 'delivery' ? (subtotal >= 700 ? 0 : 40) : 0;
  const grandTotal = subtotal + deliveryFee;

  // Form Validation
  const isFormValid =
    cartItems.length > 0 &&
    customerName.trim().length >= 2 &&
    customerPhone.trim().length >= 8 &&
    (deliveryMethod === 'pickup' || address.trim().length >= 4);

  // Weight step helper (+ or - 0.25 kg)
  const handleWeightStep = (cartItemId: string, currentWeight: number, delta: number) => {
    const nextWeight = Math.max(0.25, Math.round((currentWeight + delta) * 100) / 100);
    onUpdateWeight(cartItemId, nextWeight);
  };

  // Handle final checkout and open WhatsApp
  const handleProceedToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newOrderId = generateOrderId();
    const orderData: OrderCheckoutData = {
      orderId: newOrderId,
      customerName,
      customerPhone,
      deliveryMethod,
      address,
      orderNotes,
      items: cartItems,
      subtotal,
      deliveryFee,
      grandTotal,
    };

    const message = buildWhatsAppOrderMessage(orderData);
    const targetUrl = getWhatsAppOrderUrl(message);

    setActiveOrderData(orderData);
    setWhatsappMessageText(message);
    setCurrentStep('guidance');

    // Open WhatsApp in a new window/tab
    try {
      window.open(targetUrl, '_blank');
    } catch (err) {
      console.warn('Could not auto-open WhatsApp link', err);
    }
  };

  const handleCopyMessage = () => {
    if (!whatsappMessageText) return;
    navigator.clipboard.writeText(whatsappMessageText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleResetForNewOrder = () => {
    onClearCart();
    setCurrentStep('cart');
    setActiveOrderData(null);
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
    setOrderNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#060F1E] border-r border-[#D4AF37]/30 h-full flex flex-col justify-between text-right shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0D1F38]/95 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              {currentStep === 'cart' && <ShoppingBag className="w-4 h-4" />}
              {currentStep === 'checkout' && <FileText className="w-4 h-4" />}
              {currentStep === 'guidance' && <Clock className="w-4 h-4 text-amber-300" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-amiri leading-none">
                {currentStep === 'cart' && 'سلة المشتريات والطلبات'}
                {currentStep === 'checkout' && 'صفحة إتمام الطلب وتحديد العنوان'}
                {currentStep === 'guidance' && 'حالة الطلب: في انتظار تأكيد المطعم'}
              </h3>
              <span className="text-[11px] text-slate-400">
                {currentStep === 'cart' && `${cartItems.length} أصناف في السلة`}
                {currentStep === 'checkout' && 'الخطوة 2 من 2: بيانات التوصيل'}
                {currentStep === 'guidance' && `كود الطلب: #${activeOrderData?.orderId}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentStep === 'checkout' && (
              <button
                type="button"
                onClick={() => setCurrentStep('cart')}
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>السلة</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="إغلاق السلة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* STEP 1: CART ITEMS REVIEW & WEIGHT ADJUSTMENTS */}
        {/* ============================================================== */}
        {currentStep === 'cart' && (
          <>
            {cartItems.length === 0 ? (
              <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
                <div className="w-20 h-20 rounded-full bg-[#0D1F38] border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <p className="text-xl font-bold text-slate-200 font-amiri">سلتك فارغة حالياً</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    اختر ما تشتهيه من الفسيخ والرنجة والملوحة والسردين بالوزن المناسب، وسيتم حساب السعر تلقائياً.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-3 px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] transition-all cursor-pointer shadow-lg"
                >
                  تصفح قائمة الأصناف والمنيو
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                
                {/* Free shipping banner */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#0D1F38] to-[#122846] border border-[#D4AF37]/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-slate-200">
                      {subtotal >= 700 ? (
                        <span className="text-emerald-400 font-bold">
                          تهانينا! حصلت على توصيل مجاني للمنزل
                        </span>
                      ) : (
                        <span>
                          أضف بقيمة <strong className="text-[#F3E5AB] font-mono">{700 - subtotal} ج.م</strong> للحصول على توصيل مجاني!
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    الحد: 700 ج.م
                  </span>
                </div>

                {/* Header actions */}
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>الأصناف في السلة ({cartItems.length}):</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-400 hover:text-red-300 text-[11px] underline cursor-pointer"
                  >
                    إفراغ السلة
                  </button>
                </div>

                {/* Items list */}
                <div className="space-y-3">
                  {cartItems.map((ci) => (
                    <div
                      key={ci.cartItemId}
                      className="p-3.5 rounded-xl bg-[#0D1F38] border border-slate-800 hover:border-[#D4AF37]/50 transition-all text-right space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={ci.image}
                          alt={ci.productName}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-900 shrink-0 border border-slate-700"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-white font-amiri leading-snug">
                                {ci.productName}
                              </h4>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span>{ci.categoryLabel}</span>
                                {ci.unitPricePerKg && (
                                  <>
                                    <span>·</span>
                                    <span className="text-amber-200/90 font-mono">
                                      سعر الكيلو: {ci.unitPricePerKg} ج.م
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => onRemoveItem(ci.cartItemId)}
                              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800 cursor-pointer"
                              title="حذف هذا الصنف من السلة"
                              aria-label="حذف الصنف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Notes if entered */}
                          {ci.notes && (
                            <div className="mt-1 text-[11px] text-amber-300/80 bg-[#060F1E] px-2 py-0.5 rounded border border-slate-800 inline-block">
                              ملاحظة: {ci.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Weight Selector & Quick Adjust Bar */}
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                        {/* Preset quick buttons */}
                        <div className="flex items-center gap-1">
                          {[
                            { val: 0.25, label: 'ربع' },
                            { val: 0.5, label: 'نصف' },
                            { val: 0.75, label: '750 جم' },
                            { val: 1.0, label: '1 كجم' },
                          ].map((b) => (
                            <button
                              key={b.val}
                              type="button"
                              onClick={() => onUpdateWeight(ci.cartItemId, b.val)}
                              className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors cursor-pointer ${
                                ci.weightKg === b.val
                                  ? 'bg-[#D4AF37] text-slate-950 font-bold'
                                  : 'bg-[#060F1E] text-slate-300 hover:text-white border border-slate-700'
                              }`}
                            >
                              {b.label}
                            </button>
                          ))}
                        </div>

                        {/* Stepper (+ / - 0.25 kg) */}
                        <div className="flex items-center gap-1.5 bg-[#060F1E] px-2 py-0.5 rounded-lg border border-slate-700">
                          <button
                            type="button"
                            onClick={() => handleWeightStep(ci.cartItemId, ci.weightKg, -0.25)}
                            className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer text-xs"
                            title="إنقاص ربع كيلو"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="text-[11px] font-mono font-bold text-amber-200 min-w-14 text-center">
                            {formatWeightLabel(ci.weightKg)}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleWeightStep(ci.cartItemId, ci.weightKg, 0.25)}
                            className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer text-xs"
                            title="زيادة ربع كيلو"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Calculated Item Total Price */}
                        <div className="flex items-baseline gap-1 text-right">
                          <span className="text-base font-black text-[#F3E5AB] font-mono tabular-nums">
                            {ci.totalPrice}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">ج.م</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal Box */}
                <div className="p-4 rounded-xl bg-[#0D1F38] border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>المجموع الفرعي للأصناف:</span>
                    <span className="font-mono font-bold text-sm text-white">
                      {subtotal} ج.م
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>تجهيز فاكيوم حراري مانع للروائح:</span>
                    <span className="text-emerald-400 font-bold">مجاناً 100%</span>
                  </div>
                </div>

              </div>
            )}

            {/* Step 1 Footer CTA */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-slate-800 bg-[#0D1F38]/90 space-y-3">
                <div className="flex items-baseline justify-between text-white">
                  <div>
                    <span className="text-xs text-slate-400 block">الإجمالي المبدئي:</span>
                    <span className="text-2xl font-black text-[#F3E5AB] font-mono tabular-nums">
                      {subtotal}
                    </span>
                    <span className="text-xs font-bold text-slate-300 mr-1">ج.م</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep('checkout')}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] text-slate-950 shadow-xl shadow-[#D4AF37]/20 active:scale-[0.98] cursor-pointer transition-all"
                  >
                    <span>متابعة إتمام الطلب</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* STEP 2: DEDICATED CHECKOUT PAGE (صفحة إتمام الطلب) */}
        {/* ============================================================== */}
        {currentStep === 'checkout' && (
          <form
            onSubmit={handleProceedToWhatsApp}
            className="flex-1 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              
              {/* Notice */}
              <div className="p-3.5 rounded-xl bg-[#0D1F38] border border-[#D4AF37]/30 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#F3E5AB]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>صفحة إتمام الطلب وبيانات التوصيل</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  سجل بياناتك وسيتم إنشاء رسالة واتساب منظمة ومجهزة بالكامل وإرسالها إلى إدارة المطعم مباشرة.
                </p>
              </div>

              {/* Delivery Method Selection */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold block">
                  طريقة الاستلام المطلوبة:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#0D1F38] rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`py-2.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      deliveryMethod === 'delivery'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-slate-950 shadow'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>توصيل للمنزل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`py-2.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      deliveryMethod === 'pickup'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-slate-950 shadow'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>استلام من الفرع</span>
                  </button>
                </div>
              </div>

              {/* Customer Name */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>اسم العميل بالكامل *</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: أحمد عبد الرحمن"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0D1F38] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500 transition-colors"
                />
              </div>

              {/* Customer Phone */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>رقم الهاتف (واتساب للتأكيد والتوصيل) *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="مثال: 01143226043 أو 010xxxxxxxx"
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0D1F38] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500 font-mono transition-colors"
                />
              </div>

              {/* Address Field (when delivery selected) */}
              {deliveryMethod === 'delivery' ? (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-lime-400" />
                    <span>عنوان التوصيل بالتفصيل *</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="المنطقة (مثلاً: حدائق القبة)، اسم الشارع، رقم العمارة، رقم الشقة، علامة مميزة..."
                    className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0D1F38] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500 resize-none transition-colors"
                  />
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#0D1F38] border border-slate-800 text-xs text-amber-200/90 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">موقع استلام الطلب:</strong>
                    <span>16 شارع الدويدار، حدائق القبة، القاهرة (بجوار أسماك السلطان)</span>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold block">
                  ملاحظات إضافية على الطلب (اختياري):
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="مثال: ليمون وشطة زيادة، تغليف سفر بالفاكيوم، تحديد توقيت معين للاستلام..."
                  className="w-full px-3.5 py-2.5 text-xs text-white bg-[#0D1F38] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500 resize-none transition-colors"
                />
              </div>

              {/* Automatic Invoice Calculation Breakdown */}
              <div className="p-4 rounded-xl bg-[#0D1F38] border border-slate-800 space-y-2.5 text-xs">
                <div className="font-bold text-[#F3E5AB] pb-1.5 border-b border-slate-800 flex items-center justify-between">
                  <span>تفاصيل الفاتورة الرسمية:</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {cartItems.length} صنف
                  </span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>مجموع الأصناف:</span>
                  <span className="font-mono font-bold">{subtotal} ج.م</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>خدمة التوصيل:</span>
                  <span className="font-mono">
                    {deliveryMethod === 'pickup'
                      ? 'استلام من الفرع (مجاني)'
                      : deliveryFee === 0
                      ? 'مجاناً (طلب فوق 700 ج.م)'
                      : `${deliveryFee} ج.م`}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-700 flex justify-between items-baseline text-white">
                  <span className="text-sm font-bold">إجمالي الفاتورة النهائي:</span>
                  <div className="flex items-baseline gap-1 text-[#F3E5AB]">
                    <span className="text-2xl font-black font-mono tabular-nums">{grandTotal}</span>
                    <span className="text-xs font-bold">ج.م</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Checkout Action Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#0D1F38]/95 space-y-2">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                  isFormValid
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60 active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>إرسال الطلب إلى واتساب المطعم (01143226043)</span>
              </button>

              {!isFormValid ? (
                <p className="text-[11px] text-amber-300/80 text-center">
                  يرجى ملء الاسم ورقم الهاتف والعنوان لتفعيل زر إتمام الطلب
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 text-center">
                  بالضغط على الزر، سيتم فتح محادثة واتساب الرسمية برسالة منظمة وجاهزة للإرسال
                </p>
              )}
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* STEP 3: POST-SEND GUIDANCE & WAITING CONFIRMATION (CRITICAL)   */}
        {/* Clarifying that the order needs to be sent & confirmed by shop */}
        {/* ============================================================== */}
        {currentStep === 'guidance' && activeOrderData && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              
              {/* Mandatory Clarification Alert Banner */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/70 text-right space-y-2 animate-in zoom-in-95">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>الخطوة الأخيرة: أرسل الرسالة في واتساب وانتظر تأكيد المطعم</span>
                </div>
                
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  ⚠️ <strong>تنبيه هام:</strong> تم تجهيز نص الفاتورة وفتح محادثة واتساب الرسمية لـ <strong>فسخاني الحسانين</strong>. مجرد فتح التطبيق <strong>لا يعني</strong> أن الطلب تم اعتماده أو تسجيله في نظام المطعم.
                </p>
                
                <div className="bg-[#060F1E]/80 p-3 rounded-xl border border-amber-500/30 text-xs text-slate-200 space-y-1">
                  <span className="font-bold text-amber-300 block">المطلوب منك الآن:</span>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                    <li>تأكد من الضغط على زر <strong>الإرسال (Send)</strong> داخل محادثة واتساب.</li>
                    <li>انتظر رسالة الرد والتأكيد الرسمية من فريق خدمة عملاء فسخاني الحسانين لإبلاغك ببدء التجهيز وموعد التوصيل.</li>
                  </ol>
                </div>
              </div>

              {/* Order Receipt Card */}
              <div className="p-4 rounded-xl bg-[#0D1F38] border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">كود ورقم الطلب:</span>
                  <span className="font-mono font-bold text-[#F3E5AB] text-sm bg-[#060F1E] px-2.5 py-0.5 rounded border border-[#D4AF37]/30">
                    #{activeOrderData.orderId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">اسم العميل:</span>
                    <span className="font-bold text-white">{activeOrderData.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">رقم الهاتف:</span>
                    <span className="font-mono text-white">{activeOrderData.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">طريقة الاستلام:</span>
                    <span className="text-amber-200">
                      {activeOrderData.deliveryMethod === 'delivery' ? 'توصيل للمنزل' : 'استلام من الفرع'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">إجمالي الفاتورة:</span>
                    <span className="font-mono font-bold text-[#F3E5AB] text-sm">
                      {activeOrderData.grandTotal} ج.م
                    </span>
                  </div>
                </div>

                {activeOrderData.deliveryMethod === 'delivery' && (
                  <div className="pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-500 block">عنوان التوصيل:</span>
                    <span className="text-slate-200">{activeOrderData.address}</span>
                  </div>
                )}
              </div>

              {/* Prepared Message Box with Copy Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>نص الرسالة المجهز لواتساب (01143226043):</span>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="text-xs text-[#D4AF37] hover:text-[#F3E5AB] flex items-center gap-1 cursor-pointer bg-[#0D1F38] px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم نسخ النص</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ النص</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-[#060F1E] border border-slate-800 rounded-xl max-h-48 overflow-y-auto text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre-line select-all">
                  {whatsappMessageText}
                </div>
              </div>

            </div>

            {/* Guidance Action Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#0D1F38]/95 space-y-2.5">
              <a
                href={getWhatsAppOrderUrl(whatsappMessageText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>إعادة فتح محادثة واتساب الرسمية الآن</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('checkout')}
                  className="py-2.5 px-3 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors text-center"
                >
                  تعديل بيانات الطلب
                </button>

                <button
                  type="button"
                  onClick={handleResetForNewOrder}
                  className="py-2.5 px-3 rounded-lg text-xs font-semibold text-slate-950 bg-[#D4AF37] hover:bg-[#e2be4a] cursor-pointer transition-colors text-center"
                >
                  إنهاء وبدء طلب جديد
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
