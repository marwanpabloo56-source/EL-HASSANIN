import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { OfficialProduct } from '../types/restaurant';
import { CATEGORIES_LIST } from '../data/menuData';
import { ProductCard } from './ProductCard';

interface MenuSectionProps {
  products: OfficialProduct[];
  onAddToCart: (
    product: OfficialProduct,
    weightKg: number,
    weightLabel: string,
    calculatedPrice: number,
    notes?: string
  ) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ products, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'fillets'
          ? p.isFillet === true
          : p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Compute counts for category tabs
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return products.length;
    if (catId === 'fillets') return products.filter((p) => p.isFillet).length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <section id="menu" className="py-16 lg:py-24 bg-[#060F1E] relative border-b border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>قائمة الأسعار والمنتجات الرسمية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-amiri tracking-tight">
            منيو فسخاني الحسانين الرسمي
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            جميع الأسعار بالجنيه المصري للكيلو جرام. يمكنك اختيار الوزن المناسب لك (ربع، نصف، 3/4، كيلو، أو وزن مخصص) ويتم حساب السعر بدقة تلقائياً.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-5 mb-10">
          
          {/* Search Box */}
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن: فسيخ مخلي، بطارخ خشنة، رنجة، ملوحة، سردين..."
              className="w-full pr-10 pl-4 py-3 text-sm text-white bg-[#0D1F38] border border-slate-700 focus:border-[#D4AF37] rounded-xl outline-none placeholder:text-slate-500 shadow-inner transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                مسح
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#0D1F38] border border-slate-800 rounded-xl overflow-x-auto no-scrollbar max-w-4xl mx-auto">
            {CATEGORIES_LIST.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-slate-950 shadow-md shadow-[#D4AF37]/20 font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive
                        ? 'bg-slate-950/25 text-slate-950 font-bold'
                        : 'bg-slate-800/90 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#0D1F38]/40 rounded-2xl border border-slate-800 space-y-3">
            <SlidersHorizontal className="w-10 h-10 text-slate-500 mx-auto" />
            <div className="text-lg font-bold text-white">لم يتم العثور على منتجات مطابقة للبحث</div>
            <p className="text-xs text-slate-400">جرب البحث بكلمات أخرى أو اختر قسماً آخر من القائمة.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-5 py-2 text-xs font-bold text-slate-900 bg-[#D4AF37] rounded-lg"
            >
              عرض كافة المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
