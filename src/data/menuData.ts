import { OfficialProduct, SpecialOfferItem, CustomerReview } from '../types/restaurant';

// Brand & Hero image paths
const imageFiles = import.meta.glob('../assets/images/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const getImage = (filename: string) =>
  imageFiles[`../assets/images/${filename}`] || '';

export const EMBLEM_LOGO_IMG = getImage('brand_royal_emblem_1793920219385.jpg');
export const HERO_IMG = getImage('hero_feseekh_renga_spread_1793914927371.jpg');
export const ROYAL_FEAST_IMG = getImage('family_royal_feast_platter_1793914930617.jpg');

export const IMG_FESEEKH_WASAT = getImage('feseekh_wasat_dish_1793921337627.jpg');
export const IMG_FESEEKH_KABEER = getImage('feseekh_kabeer_dish_1793921337971.jpg');
export const IMG_FESEEKH_MAKHLI = getImage('feseekh_makhly_fillet_1793921339163.jpg');
export const IMG_RENGA_WASAT = getImage('renga_wasat_smoked_1793921339405.jpg');
export const IMG_RENGA_KABEER = getImage('renga_kabeer_smoked_1793921340141.jpg');
export const IMG_RENGA_BATAREKH_KHASHENA = getImage('renga_batarekh_khashena_1793921341014.jpg');
export const IMG_RENGA_MAKHLI = getImage('renga_makhly_fillet_1793921341094.jpg');
export const IMG_MELOHA_WASAT = getImage('meloha_wasat_aswani_1793921342370.jpg');
export const IMG_MELOHA_KABEER = getImage('meloha_kabeer_aswani_1793921342728.jpg');
export const IMG_MELOHA_MAKHLI = getImage('meloha_makhly_fillet_1793921343120.jpg');
export const IMG_SARDEEN_KHALIGI = getImage('sardeen_khaligi_dish_1793921343442.jpg');
export const IMG_SARDEEN_BALADI_WASAT = getImage('sardeen_baladi_wasat_1793921344198.jpg');
export const IMG_SARDEEN_BALADI_KABEER = getImage('sardeen_baladi_kabeer_1793921344636.jpg');
export const IMG_SARDEEN_MAKHLI = getImage('sardeen_makhly_fillet_1793921345869.jpg');
export const IMG_BATAREKH_NAEMA = getImage('batarekh_naema_roe_1793921346376.jpg');
export const IMG_BATAREKH_KHASHENA = getImage('batarekh_khashena_roe_1793921346858.jpg');
export const IMG_TAHINA_FESEEKH_SPREAD = getImage('tahini_spread_feseekh_1793921347605.jpg');
export const IMG_BESARYA = getImage('besarya_salted_fish_1793921348522.jpg');
export const IMG_OM_KHOLOOL = getImage('om_kholool_clams_1793921348744.jpg');

// Individual authentic product image paths (19 distinct high-fidelity photos)
export const IMG_FESEEKH_WASAT = '/src/assets/images/feseekh_wasat_dish_1793921337627.jpg';
export const IMG_FESEEKH_KABEER = '/src/assets/images/feseekh_kabeer_dish_1793921337971.jpg';
export const IMG_FESEEKH_MAKHLI = '/src/assets/images/feseekh_makhly_fillet_1793921339163.jpg';

export const IMG_RENGA_WASAT = '/src/assets/images/renga_wasat_smoked_1793921339405.jpg';
export const IMG_RENGA_KABEER = '/src/assets/images/renga_kabeer_smoked_1793921340141.jpg';
export const IMG_RENGA_BATAREKH_KHASHENA = '/src/assets/images/renga_batarekh_khashena_1793921341014.jpg';
export const IMG_RENGA_MAKHLI = '/src/assets/images/renga_makhly_fillet_1793921341094.jpg';

export const IMG_MELOHA_WASAT = '/src/assets/images/meloha_wasat_aswani_1793921342370.jpg';
export const IMG_MELOHA_KABEER = '/src/assets/images/meloha_kabeer_aswani_1793921342728.jpg';
export const IMG_MELOHA_MAKHLI = '/src/assets/images/meloha_makhly_fillet_1793921343120.jpg';

export const IMG_SARDEEN_KHALIGI = '/src/assets/images/sardeen_khaligi_dish_1793921343442.jpg';
export const IMG_SARDEEN_BALADI_WASAT = '/src/assets/images/sardeen_baladi_wasat_1793921344198.jpg';
export const IMG_SARDEEN_BALADI_KABEER = '/src/assets/images/sardeen_baladi_kabeer_1793921344636.jpg';
export const IMG_SARDEEN_MAKHLI = '/src/assets/images/sardeen_makhly_fillet_1793921345869.jpg';

export const IMG_BATAREKH_NAEMA = '/src/assets/images/batarekh_naema_roe_1793921346376.jpg';
export const IMG_BATAREKH_KHASHENA = '/src/assets/images/batarekh_khashena_roe_1793921346858.jpg';

export const IMG_TAHINA_FESEEKH_SPREAD = '/src/assets/images/tahini_spread_feseekh_1793921347605.jpg';
export const IMG_BESARYA = '/src/assets/images/besarya_salted_fish_1793921348522.jpg';
export const IMG_OM_KHOLOOL = '/src/assets/images/om_kholool_clams_1793921348744.jpg';

// Restaurant official contact information
export const RESTAURANT_INFO = {
  name: 'فسخاني الحسانين',
  tagline: 'أصالة الطعم.. حكاية من زمان',
  subHeroTagline: 'الطعم الأصيل له عنوان',
  address: '16 شارع الدويدار، حدائق القبة، بجوار أسماك السلطان، القاهرة',
  phone: '01143226043',
  whatsappNumber: '01143226043',
  whatsappLink: 'https://wa.me/201143226043',
  facebookLink: 'https://www.facebook.com/profile.php?id=61564352497504&locale=ar_AR',
  googleMapsLink: 'https://www.google.com/maps/search/?api=1&query=16+%D8%B4%D8%A7%D8%B1%D8%B9+%D8%A7%D9%84%D8%AF%D9%88%D9%8A%D8%AF%D8%A7%D8%B1+%D8%AD%D8%AF%D8%A7%D8%A6%D9%82+%D8%A7%D9%84%D9%82%D8%A8%D8%A9+%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9',
  openingHours: 'يومياً من الساعة 10:00 صباحاً حتى 12:00 منتصف الليل',
  deliveryCoverage: 'توصيل سريع وفوري لجميع مناطق القاهرة والجيزة والمحافظات بتغليف فاكيوم محكم',
};

// Menu categories definition
export const CATEGORIES_LIST = [
  { id: 'all', name: 'كل المنتجات' },
  { id: 'feseekh', name: 'قسم الفسيخ' },
  { id: 'renga', name: 'قسم الرنجة' },
  { id: 'meloha', name: 'قسم الملوحة' },
  { id: 'sardines', name: 'قسم السردين' },
  { id: 'batarekh', name: 'قسم البطارخ' },
  { id: 'extras', name: 'قسم الإضافات' },
  { id: 'fillets', name: 'المخليات (صافي)' },
] as const;

// Official Product list with EXACT user specified prices and INDEPENDENT real food photos
export const OFFICIAL_PRODUCTS: OfficialProduct[] = [
  // 1. قسم الفسيخ
  {
    id: 'fe-2',
    name: 'فسيخ وسط',
    category: 'feseekh',
    categoryLabel: 'قسم الفسيخ',
    pricePerKg: 420,
    description: 'سمك بوري بلدي حجم متوسط نخب أول، تمليح هادئ مضبوط على أصول التمليح المصري القديم.',
    image: IMG_FESEEKH_WASAT,
    badge: 'بوري بلدي ممتاز',
  },
  {
    id: 'fe-1',
    name: 'فسيخ كبير',
    category: 'feseekh',
    categoryLabel: 'قسم الفسيخ',
    pricePerKg: 440,
    description: 'سمك بوري بلدي نخب أول حبة كبيرة فاخرة، دهون طبيعية ولحم زبدة يذوب في الفم.',
    image: IMG_FESEEKH_KABEER,
    badge: 'بوري بلدي نمرة 1',
    isPopular: true,
  },
  {
    id: 'f-1',
    name: 'فسيخ مخلي لحم صافي',
    category: 'feseekh',
    categoryLabel: 'قسم الفسيخ',
    pricePerKg: 850,
    description: 'لحم فسيخ بوري بلدي صافي 100% منزوع الشوك والجلد، لحم وردي ناعم كالسمنة ومملح على أصوله.',
    image: IMG_FESEEKH_MAKHLI,
    badge: 'الأكثر طلباً',
    isPopular: true,
    isFillet: true,
  },

  // 2. قسم الرنجة
  {
    id: 'r-3',
    name: 'رنجة وسط',
    category: 'renga',
    categoryLabel: 'قسم الرنجة',
    pricePerKg: 160,
    description: 'رنجة درجة أولى متوسطة الحجم، ملح هادئ دلع ولحم وردي شهي مدخنة بخشب الزان الطبيعي.',
    image: IMG_RENGA_WASAT,
  },
  {
    id: 'r-2',
    name: 'رنجة كبيرة',
    category: 'renga',
    categoryLabel: 'قسم الرنجة',
    pricePerKg: 175,
    description: 'رنجة سوبر حجم كبير لحم سميك طري وممتلئ، مدخنة بعناية وطازجة يومياً.',
    image: IMG_RENGA_KABEER,
  },
  {
    id: 'r-1',
    name: 'رنجة بطارخ خشنة',
    category: 'renga',
    categoryLabel: 'قسم الرنجة',
    pricePerKg: 220,
    description: 'رنجة هولندية فاخرة محشوة ببطارخ خرز مقرمشة وممتلئة، تدخين خشب الزان الطبيعي.',
    image: IMG_RENGA_BATAREKH_KHASHENA,
    badge: 'اختيار الأكيلة',
    isPopular: true,
  },
  {
    id: 'f-3',
    name: 'رنجة مخلي لحم صافي',
    category: 'renga',
    categoryLabel: 'قسم الرنجة',
    pricePerKg: 300,
    description: 'فيليه رنجة هولندية سوبر مدخنة منزوعة العظم والجلد تماماً، طعم مدخن راقي جاهز للتقديم.',
    image: IMG_RENGA_MAKHLI,
    badge: 'جاهزة للتقديم',
    isPopular: true,
    isFillet: true,
  },

  // 3. قسم الملوحة
  {
    id: 'm-2',
    name: 'ملوحة وسط',
    category: 'meloha',
    categoryLabel: 'قسم الملوحة',
    pricePerKg: 300,
    description: 'ملوحة نيلية كلب بحر حجم متوسط ممتازة، طعم حاد وأصيل لعشاق الملوحة الصعيدية.',
    image: IMG_MELOHA_WASAT,
  },
  {
    id: 'm-1',
    name: 'ملوحة كبيرة',
    category: 'meloha',
    categoryLabel: 'قسم الملوحة',
    pricePerKg: 350,
    description: 'ملوحة كلب بحر نيلية أسوانية أصلية حجم كبير، عريقة ومملحة بالملح الخشن النقي على الطريقة الصعيدية.',
    image: IMG_MELOHA_KABEER,
    badge: 'أسواني على أصله',
    isPopular: true,
  },
  {
    id: 'f-2',
    name: 'ملوحة مخلي',
    category: 'meloha',
    categoryLabel: 'قسم الملوحة',
    pricePerKg: 380,
    description: 'ملوحة أسوانية لحم مخلي بيور جاهز للأكل، متبل بتتبيلة الحسانين الخاصة مع الزيت والليمون.',
    image: IMG_MELOHA_MAKHLI,
    badge: 'مذاق أسواني أصيل',
    isFillet: true,
  },

  // 4. قسم السردين
  {
    id: 's-2',
    name: 'سردين خليجي',
    category: 'sardines',
    categoryLabel: 'قسم السردين',
    pricePerKg: 190,
    description: 'سردين خليجي مميز لحم فضي ناعم، طعم غني ومملح بعناية فائقة.',
    image: IMG_SARDEEN_KHALIGI,
  },
  {
    id: 's-3',
    name: 'سردين بلدي وسط',
    category: 'sardines',
    categoryLabel: 'قسم السردين',
    pricePerKg: 180,
    description: 'سردين بلدي متوسط الحجم طازج، نكهة بحرية شهية وسعر اقتصادي.',
    image: IMG_SARDEEN_BALADI_WASAT,
  },
  {
    id: 's-1',
    name: 'سردين بلدي كبير',
    category: 'sardines',
    categoryLabel: 'قسم السردين',
    pricePerKg: 230,
    description: 'سردين بحري بلدي فاخر حبة كبيرة ممتلئة باللحم، مخلل على الهادي بملح خفيف.',
    image: IMG_SARDEEN_BALADI_KABEER,
    badge: 'بلدي فاخر',
    isPopular: true,
  },
  {
    id: 'f-4',
    name: 'سردين مخلي لحم صافي',
    category: 'sardines',
    categoryLabel: 'قسم السردين',
    pricePerKg: 380,
    description: 'فيليه سردين بلدي مميز خالي من الشوك، متبل بالزيت والليمون والفلفل الحار والكمون البلدي.',
    image: IMG_SARDEEN_MAKHLI,
    badge: 'خفيف الملح',
    isFillet: true,
  },

  // 5. قسم البطارخ
  {
    id: 'b-2',
    name: 'بطارخ ناعمة',
    category: 'batarekh',
    categoryLabel: 'قسم البطارخ',
    pricePerKg: 550,
    description: 'بطارخ رنجة وبوري مرملة زبدية ناعمة الملمس، نكهة مركزة ومملحة بعناية فائقة.',
    image: IMG_BATAREKH_NAEMA,
    badge: 'مرملة زبدية',
  },
  {
    id: 'b-1',
    name: 'بطارخ خشنة',
    category: 'batarekh',
    categoryLabel: 'قسم البطارخ',
    pricePerKg: 700,
    description: 'بطارخ خرز مقرمشة فاخرة، ذهبية اللون وغنية بالأوميجا والدهون الصحية الطبيعية.',
    image: IMG_BATAREKH_KHASHENA,
    badge: 'بطارخ خرز ذهبية',
    isPopular: true,
  },

  // 6. قسم الإضافات
  {
    id: 'f-5',
    name: 'طحينة إسبريد بالفسيخ',
    category: 'extras',
    categoryLabel: 'قسم الإضافات',
    pricePerKg: 900,
    description: 'معجون طحينة سمسم خام فاخر ممزوج بقطع فسيخ الحسانين والبهارات السرية، تجربة ملوكية لا تقاوم.',
    image: IMG_TAHINA_FESEEKH_SPREAD,
    badge: 'ابتكار حصري',
    isPopular: true,
    isFillet: true,
  },
  {
    id: 's-4',
    name: 'بسارية',
    category: 'extras',
    categoryLabel: 'قسم الإضافات',
    pricePerKg: 120,
    description: 'بسارية بلدي طازجة ومملحة بعناية، وجبة مقرمشة شهيرة بطعمها اللذيذ تمليح هادئ خفيف.',
    image: IMG_BESARYA,
  },
  {
    id: 's-5',
    name: 'أم خلول',
    category: 'extras',
    categoryLabel: 'قسم الإضافات',
    priceOnDemand: true,
    description: 'أم خلول إسكندراني بلدي طازجة، منقوعة ومتبلة بالليمون والكمون والشطة (السعر يتحدد حسب الصيد اليومي).',
    image: IMG_OM_KHOLOOL,
    badge: 'طازة يوم بيوم',
  },
];

// Special offers (designed so they can be modified without altering layout code)
export const SPECIAL_OFFERS: SpecialOfferItem[] = [
  {
    id: 'offer-royal-box',
    title: 'صينية الحسانين الملكية المشكلة',
    tagline: 'العزومة الفاخرة لـ 4 إلى 6 أفراد',
    description: 'تشكيلة تجمع الفسيخ المخلي الصافي مع الرنجة بالبطارخ الخشنة والملوحة والسردين الفاخر مع باقة خضار وعيش بلدي ساخن وطحينة إسبريد.',
    itemsIncluded: [
      'نصف كيلو فسيخ مخلي لحم صافي',
      'نصف كيلو رنجة بطارخ خشنة',
      'ربع كيلو ملوحة مخلي أسوانية',
      'ربع كيلو سردين مخلي صافي',
      'برطمان طحينة إسبريد بالفسيخ',
      'تغليف فاكيوم حراري مانع للروائح',
    ],
    price: 990,
    originalPrice: 1180,
    image: ROYAL_FEAST_IMG,
    badge: 'عرض العائلات الأكبر',
  },
  {
    id: 'offer-duo-deluxe',
    title: 'بوكس السعادة (فسيخ مخلي + رنجة بطارخ)',
    tagline: 'مكس الأكثر طلباً لشخصين إلى 3 أفراد',
    description: 'نصف كيلو فسيخ مخلي لحم صافي متبل بالزيت والليمون مع نصف كيلو رنجة بطارخ خشنة وعلبة طحينة فاخرة وخبز بلدي.',
    itemsIncluded: [
      'نصف كيلو فسيخ مخلي لحم صافي (زبدة)',
      'نصف كيلو رنجة بطارخ خشنة مقرمشة',
      'طحينة بلدي خام بالليمون والكمون',
      'تغليف فاكيوم مفرغ من الهواء مجاناً',
    ],
    price: 595,
    originalPrice: 690,
    image: IMG_FESEEKH_MAKHLI,
    badge: 'الأكثر مبيعاً',
  },
];

// Verified Customer Reviews
export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'r-1',
    author: 'م. حسام الدين غانم',
    location: 'حدائق القبة - القاهرة',
    rating: 5,
    date: 'منذ يومين',
    comment: 'الفسيخ المخلي عندهم حكاية تانية خالص! لحم وردي وزبدة وملحه مضبوط بالملي، والتغليف الفاكيوم نظيف جداً ومريح. شرفوتنا في العزومة.',
    dishMentioned: 'فسيخ مخلي لحم صافي',
    verified: true,
  },
  {
    id: 'r-2',
    author: 'د. نرمين الشافعي',
    location: 'مصر الجديدة',
    rating: 5,
    date: 'منذ 4 أيام',
    comment: 'الرنجة بالبطارخ الخشنة تحفة، البطارخ مخرزة ومقرمشة والسمك ريحته تدخين زان أصلي. التعامل محترم والتوصيل وصل في أقل من ساعة.',
    dishMentioned: 'رنجة بطارخ خشنة',
    verified: true,
  },
  {
    id: 'r-3',
    author: 'الحاج عادل عبد الغفار',
    location: 'الوايلي',
    rating: 5,
    date: 'منذ أسبوع',
    comment: 'أنا زبون الحسانين في شارع الدويدار من سنين، أمانة ونظافة وسماحة في البيع، والملوحة الأسوانية عندهم ملهاش حل.',
    dishMentioned: 'ملوحة كبيرة',
    verified: true,
  },
  {
    id: 'r-4',
    author: 'أستاذ وليد سامي',
    location: 'مدينة نصر',
    rating: 5,
    date: 'منذ أسبوعين',
    comment: 'جربت طحينة إسبريد بالفسيخ فكرة عبقرية ومميزة جداً للفطار أو العشا مع عيش بلدي سخن وليمون. تسلم إيديكم.',
    dishMentioned: 'طحينة إسبريد بالفسيخ',
    verified: true,
  },
];
