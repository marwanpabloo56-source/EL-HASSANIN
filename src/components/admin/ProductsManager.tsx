import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { OFFICIAL_PRODUCTS, CATEGORIES_LIST } from '../../data/menuData';
import { OfficialProduct, ProductCategory } from '../../types/restaurant';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  Check,
  X,
  UploadCloud,
  Image as ImageIcon,
  DollarSign,
  AlertCircle,
  Tag,
} from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<OfficialProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<OfficialProduct | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('feseekh');
  const [formCategoryLabel, setFormCategoryLabel] = useState('قسم الفسيخ');
  const [formPrice, setFormPrice] = useState('440');
  const [formPriceOnDemand, setFormPriceOnDemand] = useState(false);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('/src/assets/images/feseekh_wasat_dish_1793921337627.jpg');
  const [formBadge, setFormBadge] = useState('');
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsFillet, setFormIsFillet] = useState(false);

  // Available sample authentic images for quick selection
  const AUTHENTIC_IMAGES = [
    { label: 'فسيخ وسط بلدي', url: '/src/assets/images/feseekh_wasat_dish_1793921337627.jpg' },
    { label: 'فسيخ كبير بلدي', url: '/src/assets/images/feseekh_kabeer_dish_1793921337971.jpg' },
    { label: 'فسيخ مخلي لحم صافي', url: '/src/assets/images/feseekh_makhly_fillet_1793921339163.jpg' },
    { label: 'رنجة وسط مدخنة', url: '/src/assets/images/renga_wasat_smoked_1793921339405.jpg' },
    { label: 'رنجة كبيرة مدخنة', url: '/src/assets/images/renga_kabeer_smoked_1793921340141.jpg' },
    { label: 'رنجة بطارخ خشنة', url: '/src/assets/images/renga_batarekh_khashena_1793921341014.jpg' },
    { label: 'رنجة مخلي لحم صافي', url: '/src/assets/images/renga_makhly_fillet_1793921341094.jpg' },
    { label: 'ملوحة وسط أسوانية', url: '/src/assets/images/meloha_wasat_aswani_1793921342370.jpg' },
    { label: 'ملوحة كبيرة أسوانية', url: '/src/assets/images/meloha_kabeer_aswani_1793921342728.jpg' },
    { label: 'ملوحة مخلي أسواني', url: '/src/assets/images/meloha_makhly_fillet_1793921343120.jpg' },
    { label: 'سردين خليجي', url: '/src/assets/images/sardeen_khaligi_dish_1793921343442.jpg' },
    { label: 'سردين بلدي وسط', url: '/src/assets/images/sardeen_baladi_wasat_1793921344198.jpg' },
    { label: 'سردين بلدي كبير', url: '/src/assets/images/sardeen_baladi_kabeer_1793921344636.jpg' },
    { label: 'سردين مخلي لحم صافي', url: '/src/assets/images/sardeen_makhly_fillet_1793921345869.jpg' },
    { label: 'بطارخ ناعمة مرملة', url: '/src/assets/images/batarekh_naema_roe_1793921346376.jpg' },
    { label: 'بطارخ خشنة مخرزة', url: '/src/assets/images/batarekh_khashena_roe_1793921346858.jpg' },
    { label: 'طحينة إسبريد بالفسيخ', url: '/src/assets/images/tahini_spread_feseekh_1793921347605.jpg' },
    { label: 'بسارية بلدي', url: '/src/assets/images/besarya_salted_fish_1793921348522.jpg' },
    { label: 'أم خلول إسكندراني', url: '/src/assets/images/om_kholool_clams_1793921348744.jpg' },
    { label: 'صينية الحسانين الملكية', url: '/src/assets/images/family_royal_feast_platter_1793914930617.jpg' },
  ];

  // Real-time Firestore sync
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const list: OfficialProduct[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as OfficialProduct);
        });
        setProducts(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'products');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Quick seed default menu items if DB is empty
  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      for (const p of OFFICIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), {
          ...p,
          updatedAt: new Date().toISOString(),
        });
      }
      setActionSuccess('تمت مزامنة جميع منتجات المنيو الأصلية (19 صنف) إلى قاعدة البيانات بنجاح!');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      console.error('Seeding error:', err);
      alert('حدث خطأ أثناء المزامنة: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('feseekh');
    setFormCategoryLabel('قسم الفسيخ');
    setFormPrice('440');
    setFormPriceOnDemand(false);
    setFormDescription('');
    setFormImage('/src/assets/images/feseekh_wasat_dish_1793921337627.jpg');
    setFormBadge('');
    setFormIsPopular(false);
    setFormIsFillet(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: OfficialProduct) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormCategoryLabel(p.categoryLabel);
    setFormPrice(p.pricePerKg ? p.pricePerKg.toString() : '');
    setFormPriceOnDemand(!!p.priceOnDemand);
    setFormDescription(p.description);
    setFormImage(p.image);
    setFormBadge(p.badge || '');
    setFormIsPopular(!!p.isPopular);
    setFormIsFillet(!!p.isFillet);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingProduct ? editingProduct.id : `prod-${Date.now()}`;
    const priceNum = formPriceOnDemand ? undefined : parseFloat(formPrice) || 0;

    const data: OfficialProduct = {
      id,
      name: formName.trim(),
      category: formCategory,
      categoryLabel: formCategoryLabel.trim() || 'قسم المأكولات',
      pricePerKg: priceNum,
      priceOnDemand: formPriceOnDemand,
      description: formDescription.trim(),
      image: formImage.trim(),
      badge: formBadge.trim() || undefined,
      isPopular: formIsPopular,
      isFillet: formIsFillet,
    };

    try {
      await setDoc(doc(db, 'products', id), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      setIsModalOpen(false);
      setActionSuccess(editingProduct ? 'تم تعديل المنتج بنجاح!' : 'تمت إضافة المنتج الجديد بنجاح!');
      setTimeout(() => setActionSuccess(''), 2500);
    } catch (err: any) {
      console.error('Save product error:', err);
      alert('خطأ أثناء حفظ المنتج: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المنتج: "${name}"؟`)) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setActionSuccess(`تم حذف "${name}" بنجاح.`);
      setTimeout(() => setActionSuccess(''), 2500);
    } catch (err: any) {
      console.error('Delete product error:', err);
      alert('خطأ أثناء الحذف: ' + err.message);
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0D1F38] border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white font-amiri flex items-center gap-2">
            <span>إدارة قائمة المنتجات والأسعار</span>
            <span className="text-xs font-mono text-[#D4AF37] bg-[#060F1E] px-2.5 py-0.5 rounded-full border border-slate-700">
              {products.length} صنف مسجل
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            التحكم الكامل في أسعار الكيلو، الوصف، الفئات، وحالات المخلي وصور المنتجات المعروضة للزبائن.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {products.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{seeding ? 'جاري المزامنة...' : 'مزامنة المنيو الأصلي (19 صنف)'}</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] text-slate-950 flex items-center gap-1.5 transition-all shadow-lg shadow-[#D4AF37]/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صنف جديد</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو الوصف..."
            className="w-full pr-10 pl-4 py-2.5 text-xs text-white bg-[#0D1F38] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0D1F38] border border-slate-800 rounded-xl overflow-x-auto w-full sm:w-auto no-scrollbar">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
              selectedCat === 'all'
                ? 'bg-[#D4AF37] text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            الكل ({products.length})
          </button>
          {[
            { id: 'feseekh', name: 'فسيخ' },
            { id: 'renga', name: 'رنجة' },
            { id: 'meloha', name: 'ملوحة' },
            { id: 'sardines', name: 'سردين' },
            { id: 'batarekh', name: 'بطارخ' },
            { id: 'extras', name: 'إضافات' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                selectedCat === cat.id
                  ? 'bg-[#D4AF37] text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">جاري تحميل المنتجات من قاعدة البيانات...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#0D1F38]/40 border border-slate-800 rounded-2xl p-8 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-bold text-white">لم يتم العثور على منتجات مطابقة</p>
          {products.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#D4AF37] rounded-lg cursor-pointer"
            >
              مزامنة المنيو الأصلي لملء القائمة تلقائياً
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-[#0D1F38] border border-slate-800 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-lg group"
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/feseekh_wasat_dish_1793921337627.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F38] via-transparent to-transparent opacity-80" />

                <div className="absolute top-2.5 right-2.5 text-[10px] font-semibold text-slate-200 bg-[#060F1E]/80 backdrop-blur-sm px-2 py-0.5 rounded border border-[#D4AF37]/30">
                  {p.categoryLabel}
                </div>

                {p.badge && (
                  <div className="absolute bottom-2.5 right-2.5 text-[10px] font-bold text-amber-200 bg-[#060F1E]/90 px-2 py-0.5 rounded border border-[#D4AF37]/40">
                    {p.badge}
                  </div>
                )}

                {p.isFillet && (
                  <div className="absolute top-2.5 left-2.5 text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    مخلي صافي
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white font-amiri truncate">
                      {p.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Price and Actions */}
                <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    {p.priceOnDemand ? (
                      <span className="text-xs font-bold text-lime-400">السعر عند الطلب</span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-[#F3E5AB] font-mono tabular-nums">
                          {p.pricePerKg}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">ج.م / كجم</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="تعديل بيانات المنتج"
                    >
                      <Edit2 className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="حذف المنتج"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0D1F38] border border-[#D4AF37]/50 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col justify-between shadow-2xl text-right overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#060F1E]">
              <h3 className="text-base font-bold text-white font-amiri flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#D4AF37]" />
                <span>{editingProduct ? 'تعديل بيانات الصنف' : 'إضافة صنف جديد للمنيو'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">اسم الصنف بالكامل *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: فسيخ مخلي سوبر"
                  className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Category & Label */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold block">القسم الرئيسي *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      setFormCategory(cat);
                      if (cat === 'feseekh') setFormCategoryLabel('قسم الفسيخ');
                      else if (cat === 'renga') setFormCategoryLabel('قسم الرنجة');
                      else if (cat === 'meloha') setFormCategoryLabel('قسم الملوحة');
                      else if (cat === 'sardines') setFormCategoryLabel('قسم السردين');
                      else if (cat === 'batarekh') setFormCategoryLabel('قسم البطارخ');
                      else if (cat === 'extras') setFormCategoryLabel('قسم الإضافات');
                    }}
                    className="w-full px-3 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    <option value="feseekh">قسم الفسيخ</option>
                    <option value="renga">قسم الرنجة</option>
                    <option value="meloha">قسم الملوحة</option>
                    <option value="sardines">قسم السردين</option>
                    <option value="batarekh">قسم البطارخ</option>
                    <option value="extras">قسم الإضافات والمقبلات</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold block">اسم الشارة / التصنيف المعروض</label>
                  <input
                    type="text"
                    value={formCategoryLabel}
                    onChange={(e) => setFormCategoryLabel(e.target.value)}
                    placeholder="مثال: قسم الفسيخ"
                    className="w-full px-3 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-300 font-semibold block">السعر للكيلوجرام (ج.م) *</label>
                  <label className="text-[11px] text-amber-200 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPriceOnDemand}
                      onChange={(e) => setFormPriceOnDemand(e.target.checked)}
                      className="rounded"
                    />
                    <span>السعر عند الطلب (حسب الصيد)</span>
                  </label>
                </div>

                {!formPriceOnDemand && (
                  <div className="relative">
                    <input
                      type="number"
                      step="5"
                      min="1"
                      required={!formPriceOnDemand}
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="440"
                      className="w-full pr-3 pl-12 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] font-mono"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">ج.م / كجم</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">وصف الصنف *</label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="وصف مكونات المنتج، التمليح، الخلو من الشوك، والتغليف..."
                  className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              {/* Image Selection */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold block">صورة الصنف *</label>
                
                {/* Sample visual selector */}
                <select
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] cursor-pointer mb-2"
                >
                  <option value="">-- اختر من صور مأكولات الحسانين الواقعية --</option>
                  {AUTHENTIC_IMAGES.map((img, i) => (
                    <option key={i} value={img.url}>
                      {img.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="رابط الصورة أو مسارها في المشروع..."
                  className="w-full px-3.5 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37] font-mono text-left"
                  dir="ltr"
                />

                {formImage && (
                  <div className="flex items-center gap-3 p-2 bg-[#060F1E] rounded-xl border border-slate-800">
                    <img src={formImage} alt="معاينة" className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0" />
                    <span className="text-[11px] text-slate-400">معاينة مباشرة للصورة</span>
                  </div>
                )}
              </div>

              {/* Badge & Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold block">شارة تميز (Badge اختياري)</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="مثال: الأكثر طلباً، بوري نمرة 1"
                    className="w-full px-3 py-2 text-xs text-white bg-[#060F1E] border border-slate-700 rounded-xl outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex flex-col justify-center space-y-2 pt-3">
                  <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsFillet}
                      onChange={(e) => setFormIsFillet(e.target.checked)}
                      className="rounded"
                    />
                    <span>صنف مخلي صافي (بدون شوك/جلد)</span>
                  </label>

                  <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPopular}
                      onChange={(e) => setFormIsPopular(e.target.checked)}
                      className="rounded"
                    />
                    <span>تمييز كصنف مفضل (Popular)</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] rounded-xl shadow cursor-pointer"
                >
                  حفظ الصنف
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
