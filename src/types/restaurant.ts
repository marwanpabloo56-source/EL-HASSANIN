export type ProductCategory =
  | 'fillets' // المخليات
  | 'batarekh' // البطارخ
  | 'renga' // الرنجة
  | 'feseekh' // الفسيخ
  | 'meloha' // الملوحة
  | 'sardines' // السردين والأسماك
  | 'extras' // الإضافات والمقبلات
  | 'offers'; // عروض الحسانين

export interface OfficialProduct {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  pricePerKg?: number; // Price in EGP per Kilo (undefined for priceOnDemand)
  priceOnDemand?: boolean; // For أم خلول
  description: string;
  image: string;
  badge?: string;
  isPopular?: boolean;
  minWeightKg?: number; // default 0.25
  isFillet?: boolean;
}

export type WeightOption = 0.25 | 0.5 | 0.75 | 1 | number;

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  categoryLabel: string;
  image: string;
  weightKg: number;
  weightLabel: string;
  unitPricePerKg?: number;
  priceOnDemand?: boolean;
  totalPrice: number;
  notes?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  dishMentioned: string;
  verified: boolean;
}

export interface SpecialOfferItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  itemsIncluded: string[];
  price: number;
  originalPrice: number;
  image: string;
  badge: string;
}
