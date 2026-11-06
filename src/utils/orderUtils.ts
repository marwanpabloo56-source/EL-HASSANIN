import { CartItem } from '../types/restaurant';

/**
 * Format weights in Arabic cleanly
 */
export const formatWeightLabel = (w: number): string => {
  const rounded = Math.round(w * 100) / 100;
  if (rounded === 0.25) return 'ربع كيلو (250 جم)';
  if (rounded === 0.5) return 'نصف كيلو (500 جم)';
  if (rounded === 0.75) return '750 جرام (3/4 كجم)';
  if (rounded === 1.0) return 'كيلو (1000 جم)';
  if (rounded === 1.25) return '1.25 كجم (كيلو وربع)';
  if (rounded === 1.5) return '1.5 كجم (كيلو ونصف)';
  if (rounded === 2.0) return '2 كجم (2 كيلو)';
  if (rounded === 2.5) return '2.5 كجم (2 كيلو ونصف)';
  if (rounded === 3.0) return '3 كجم (3 كيلو)';
  return `${rounded} كجم`;
};

/**
 * Calculate price based on pricePerKg and weight in KG
 */
export const calculateItemPrice = (pricePerKg?: number, weightKg: number = 1.0): number => {
  if (!pricePerKg) return 0;
  return Math.round(pricePerKg * weightKg);
};

/**
 * Generate a unique sequential-looking Order ID (e.g. #HN-4829)
 */
export const generateOrderId = (): string => {
  const timestampPart = Date.now().toString().slice(-4);
  const randomPart = Math.floor(10 + Math.random() * 90);
  return `HN-${timestampPart}${randomPart}`;
};

export interface OrderCheckoutData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'delivery' | 'pickup';
  address: string;
  orderNotes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

/**
 * Construct the official structured WhatsApp message for restaurant orders
 */
export const buildWhatsAppOrderMessage = (data: OrderCheckoutData): string => {
  const {
    orderId,
    customerName,
    customerPhone,
    deliveryMethod,
    address,
    orderNotes,
    items,
    subtotal,
    deliveryFee,
    grandTotal,
  } = data;

  const itemsListFormatted = items
    .map((item, idx) => {
      const unitPriceStr = item.priceOnDemand
        ? 'السعر عند الطلب (حسب الصيد)'
        : `${item.unitPricePerKg} ج.م / كجم`;

      const itemTotalStr = item.priceOnDemand
        ? 'يتحدد مع الإدارة'
        : `${item.totalPrice} ج.م`;

      const weightDisplay = item.weightLabel || formatWeightLabel(item.weightKg);

      let itemBlock = `${idx + 1}. *${item.productName}*\n` +
        `   • الوزن المطلوب: ${weightDisplay}\n` +
        `   • سعر الكيلو: ${unitPriceStr}\n` +
        `   • إجمالي الصنف: ${itemTotalStr}`;

      if (item.notes && item.notes.trim()) {
        itemBlock += `\n   • ملاحظات الصنف: ${item.notes.trim()}`;
      }

      return itemBlock;
    })
    .join('\n\n');

  const deliveryMethodStr =
    deliveryMethod === 'delivery'
      ? 'توصيل للمنزل بتغليف فاكيوم'
      : 'استلام من الفرع (16 شارع الدويدار - حدائق القبة)';

  const deliveryFeeStr =
    deliveryMethod === 'pickup'
      ? 'استلام من الفرع (بدون رسوم)'
      : deliveryFee === 0
      ? 'مجاناً (عرض الطلبات فوق 700 ج.م)'
      : `${deliveryFee} ج.م`;

  return `👑 *طلب شراء جديد من متجر فسخاني الحسانين* 🐟
═════════════════════════
🔖 *رقم الطلب:* #${orderId}
👤 *اسم العميل:* ${customerName.trim()}
📱 *رقم الهاتف:* ${customerPhone.trim()}
🚚 *طريقة الاستلام:* ${deliveryMethodStr}
${deliveryMethod === 'delivery' ? `📍 *عنوان التوصيل:* ${address.trim()}\n` : ''}═════════════════════════
🛒 *المنتجات والأوزان المطلوبة:*

${itemsListFormatted}

═════════════════════════
💵 *المجموع الفرعي للأصناف:* ${subtotal} ج.م
🛵 *خدمة التوصيل:* ${deliveryFeeStr}
💰 *إجمالي الفاتورة المطلوب:* ${grandTotal} ج.م
═════════════════════════
${orderNotes && orderNotes.trim() ? `📝 *ملاحظات إضافية:* ${orderNotes.trim()}\n═════════════════════════\n` : ''}⚠️ *تنبيه:* تم إنشاء هذا الطلب عبر الموقع الإلكتروني لفسخاني الحسانين. يُرجى الرد وتأكيد التجهيز وتحديد موعد التوصيل الدقيق.
أصالة الطعم.. حكاية من زمان ✨`;
};

/**
 * Generate official WhatsApp click-to-chat URL
 */
export const getWhatsAppOrderUrl = (message: string): string => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/201143226043?text=${encoded}`;
};
