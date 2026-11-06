import React, { useState } from 'react';
import { Sparkles, Plus, Check, ShieldCheck } from 'lucide-react';
import { SPECIAL_OFFERS } from '../data/menuData';
import { SpecialOfferItem } from '../types/restaurant';

interface SpecialOffersProps {
  onAddOfferToCart: (offer: SpecialOfferItem) => void;
}

export const SpecialOffers: React.FC<SpecialOffersProps> = ({ onAddOfferToCart }) => {
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const handleAdd = (offer: SpecialOfferItem) => {
    onAddOfferToCart(offer);
    setAddedMap((prev) => ({ ...prev, [offer.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [offer.id]: false }));
    }, 1500);
  };

  return (
    <section id="offers" className="py-16 lg:py-24 bg-[#091524] relative border-b border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>باقات الضيافة والتوفير</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-amiri tracking-tight">
            عروض الحسانين
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            تشكيلات مجمعة فاخرة تضم أشهى أصناف الفسيخ والرنجة والملوحة والسردين مع التجهيز والتغليف الفاكيوم المجاني.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SPECIAL_OFFERS.map((offer) => {
            const isAdded = addedMap[offer.id];

            return (
              <div
                key={offer.id}
                className="group rounded-2xl bg-[#0D1F38] border border-[#D4AF37]/35 hover:border-[#D4AF37] overflow-hidden shadow-2xl transition-all duration-300 flex flex-col md:flex-row text-right"
              >
                {/* Visual Image */}
                <div className="md:w-5/12 relative aspect-[4/3] md:aspect-auto overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0D1F38] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-[#D4AF37] to-[#B38E44] text-slate-950 text-xs font-black px-3 py-1 rounded-md shadow-lg">
                    {offer.badge}
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs text-[#D4AF37] font-semibold block">
                      {offer.tagline}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#F3E5AB] transition-colors font-amiri">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {offer.description}
                    </p>

                    {/* Items checklist */}
                    <ul className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-200">
                      {offer.itemsIncluded.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-[#F3E5AB] font-mono tabular-nums">
                          {offer.price}
                        </span>
                        <span className="text-xs font-bold text-slate-300">ج.م</span>
                        {offer.originalPrice && (
                          <span className="text-xs text-slate-500 line-through font-mono">
                            {offer.originalPrice} ج.م
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">عرض مميز شامل التجهيز</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(offer)}
                      disabled={isAdded}
                      className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer shadow-md ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] text-slate-950 shadow-[#D4AF37]/25'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>تمت الإضافة!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-slate-950" />
                          <span>أضف العرض للسلة</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
