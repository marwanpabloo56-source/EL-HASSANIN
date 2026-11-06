import React, { useState } from 'react';
import { Plus, Check, Scale, MessageSquare, Minus } from 'lucide-react';
import { OfficialProduct } from '../types/restaurant';
import { formatWeightLabel, calculateItemPrice } from '../utils/orderUtils';

interface ProductCardProps {
  product: OfficialProduct;
  onAddToCart: (
    product: OfficialProduct,
    weightKg: number,
    weightLabel: string,
    calculatedPrice: number,
    notes?: string
  ) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Preset weights: 0.25 (ربع كيلو), 0.5 (نصف كيلو), 0.75 (750 جرام), 1.0 (كيلو), 'custom' (وزن مخصص)
  const [selectedWeight, setSelectedWeight] = useState<number>(1.0);
  const [isCustomWeight, setIsCustomWeight] = useState<boolean>(false);
  const [customWeightInput, setCustomWeightInput] = useState<string>('1.5');
  const [showNotesInput, setShowNotesInput] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Active weight in KG
  const effectiveWeightKg = isCustomWeight
    ? Math.max(0.1, parseFloat(customWeightInput) || 1.0)
    : selectedWeight;

  const currentWeightLabel = formatWeightLabel(effectiveWeightKg);

  // Calculated Price in EGP
  const calculatedPrice = calculateItemPrice(product.pricePerKg, effectiveWeightKg);

  const handleAdd = () => {
    onAddToCart(
      product,
      effectiveWeightKg,
      currentWeightLabel,
      calculatedPrice,
      notes.trim() || undefined
    );
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  const handleCustomStep = (delta: number) => {
    const current = parseFloat(customWeightInput) || 1.0;
    const nextVal = Math.max(0.25, Math.round((current + delta) * 100) / 100);
    setCustomWeightInput(nextVal.toString());
  };

  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return (
    <div className="group rounded-2xl bg-[#0D1F38] border border-slate-800/90 hover:border-[#D4AF37]/70 overflow-hidden shadow-xl hover:shadow-[0_12px_32px_rgba(212,175,55,0.12)] transition-all duration-300 flex flex-col justify-between text-right hover:-translate-y-1">
      
      {/* Top Image & Badge with Uniform 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full bg-[#060F1E] overflow-hidden select-none">
        {/* Placeholder skeleton while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#0a1628] animate-pulse flex items-center justify-center">
            <span className="text-[11px] text-[#D4AF37]/50 font-amiri">فسخاني الحسانين...</span>
          </div>
        )}

        <img
          src={imageError ? '/src/assets/images/feseekh_wasat_dish_1793921337627.jpg' : product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover group-hover:scale-108 transition-all duration-700 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Subtle Dark Bottom Gradient for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F38] via-transparent to-black/25 opacity-90 pointer-events-none" />

        {/* Category Label */}
        <div className="absolute top-3 right-3 text-[11px] font-semibold text-slate-100 bg-[#060F1E]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#D4AF37]/30 shadow-md">
          {product.categoryLabel}
        </div>

        {/* Feature Badge if present */}
        {product.badge && (
          <div className="absolute bottom-3 right-3 text-[11px] font-bold text-amber-200 bg-[#060F1E]/95 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-[#D4AF37]/45 shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Fillet indicator if applicable */}
        {product.isFillet && (
          <div className="absolute top-3 left-3 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-emerald-500/30">
            مخلي صافي
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Name and Description */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-white group-hover:text-[#F3E5AB] transition-colors font-amiri leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Weight Selector Module */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-semibold flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>اختر الوزن المطلوب:</span>
            </span>
            <span className="text-[#F3E5AB] font-mono text-[11px] font-bold">
              {currentWeightLabel}
            </span>
          </div>

          {/* Preset Buttons Grid: ربع كيلو، نصف كيلو، 750 جرام، كيلو */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { val: 0.25, label: 'ربع كيلو' },
              { val: 0.5, label: 'نصف كيلو' },
              { val: 0.75, label: '750 جرام' },
              { val: 1.0, label: 'كيلو' },
            ].map((btn) => {
              const active = !isCustomWeight && selectedWeight === btn.val;
              return (
                <button
                  key={btn.val}
                  type="button"
                  onClick={() => {
                    setIsCustomWeight(false);
                    setSelectedWeight(btn.val);
                  }}
                  className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer text-center ${
                    active
                      ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-md'
                      : 'bg-[#060F1E] text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Custom Weight Option & Stepper */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsCustomWeight(!isCustomWeight)}
                className={`text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer border flex items-center gap-1 ${
                  isCustomWeight
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/15 font-bold'
                    : 'border-slate-700/80 text-slate-400 hover:text-slate-200 bg-[#060F1E]'
                }`}
              >
                <span>وزن مخصص</span>
                <span className="text-[10px] text-slate-500 font-mono">(كجم)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowNotesInput(!showNotesInput)}
                className={`text-[10px] px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                  showNotesInput || notes
                    ? 'text-amber-200'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
                <span>{notes ? 'ملاحظة مسجلة' : '+ ملاحظة للطلب'}</span>
              </button>
            </div>

            {isCustomWeight && (
              <div className="flex items-center gap-1.5 bg-[#060F1E] p-1.5 rounded-lg border border-[#D4AF37]/40 animate-in fade-in">
                <button
                  type="button"
                  onClick={() => handleCustomStep(-0.25)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer font-bold text-sm"
                  title="إنقاص ربع كيلو"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="flex-1 flex items-center justify-center gap-1">
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="30"
                    value={customWeightInput}
                    onChange={(e) => setCustomWeightInput(e.target.value)}
                    className="w-16 px-1 py-0.5 text-xs text-white bg-slate-900 border border-slate-700 rounded outline-none font-mono text-center font-bold"
                  />
                  <span className="text-[11px] text-[#D4AF37] font-semibold">كجم</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCustomStep(0.25)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer font-bold text-sm"
                  title="زيادة ربع كيلو"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {showNotesInput && (
              <div className="pt-1">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ملاحظات (مثلاً: ليمون زيادة، تقطيع، سفر فاكيوم)..."
                  className="w-full px-2.5 py-1 text-[11px] text-white bg-[#060F1E] border border-slate-700 rounded-lg outline-none focus:border-[#D4AF37] placeholder:text-slate-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          
          {/* Price breakdown */}
          <div>
            {product.priceOnDemand ? (
              <div>
                <span className="text-sm font-bold text-lime-400 block font-amiri">
                  السعر عند الطلب
                </span>
                <span className="text-[10px] text-slate-400">طازة حسب الصيد</span>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#F3E5AB] font-mono tabular-nums">
                    {calculatedPrice}
                  </span>
                  <span className="text-xs font-bold text-slate-300">ج.م</span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  (سعر الكيلو: {product.pricePerKg} ج.م)
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={addedSuccess}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer shadow-md ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#e2be4a] hover:to-[#d4af37] text-slate-950 shadow-[#D4AF37]/20'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>أُضيف للسلة</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-slate-950" />
                <span>أضف للسلة</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
