import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, User, MapPin, X } from 'lucide-react';
import { CustomerReview } from '../types/restaurant';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onAddReview: (review: Omit<CustomerReview, 'id' | 'date' | 'verified'>) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onAddReview,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [dishMentioned, setDishMentioned] = useState('');
  const [submittedToast, setSubmittedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    onAddReview({
      author: author.trim(),
      location: location.trim() || 'القاهرة',
      rating,
      comment: comment.trim(),
      dishMentioned: dishMentioned.trim() || 'فسيخ ورنجة الحسانين',
    });

    setModalOpen(false);
    setAuthor('');
    setLocation('');
    setComment('');
    setDishMentioned('');
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 3000);
  };

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-[#07111E] relative border-b border-[#C5A059]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Aggregated Score */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-right space-y-2">
            <span className="text-xs font-semibold text-[#E5C378]">ثقة نعتز بها</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-amiri">
              آراء وتجارب عملائنا الكرام
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              شهادات حقيقية من عشاق الفسيخ والرنجة الذين اختاروا الجودة والنظافة مع فسخاني الحسانين.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left bg-[#0D1F38] border border-slate-800 px-4 py-2.5 rounded-xl">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xl font-black text-[#E5C378] font-mono">4.9</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-slate-400">تقييم ممتاز من أكثر من 500 عميل</span>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-[#C5A059] hover:bg-[#d6b26b] transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>شاركنا تجربتك</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {submittedToast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>شكراً جزيلاً لمشاركتك! تم إضافة تقييمك بنجاح.</span>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-[#0D1F38] border border-slate-800/80 hover:border-[#C5A059]/40 flex flex-col justify-between text-right space-y-4 shadow-lg transition-all"
            >
              <div className="space-y-3">
                {/* Rating Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{rev.date}</span>
                </div>

                {/* Comment quote */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Mentioned Dish */}
              <div className="pt-3 border-t border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-amiri">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-700/30">
                      طلب مؤكد
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{rev.location}</span>
                  <span className="text-[#C5A059] font-medium">{rev.dishMentioned}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md bg-[#0D1F38] border border-[#C5A059]/40 rounded-2xl p-6 text-right space-y-4 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 left-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white font-amiri">أضف تقييمك ورأيك في تجربتك</h3>
            <p className="text-xs text-slate-400">رأيك يهمنا ويساعدنا على التطوير المستمر لخدمتكم بأفضل وجه.</p>

            <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
              {/* Rating Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  تقييمك الإجمالي:
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Author Name */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium block">الاسم الكريم: *</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="مثال: د. إبراهيم كمال"
                  className="w-full px-3 py-2 text-xs text-white bg-[#07111E] border border-slate-700 rounded-lg outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium block">المدينة / المنطقة:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="مثال: المعادي - القاهرة"
                  className="w-full px-3 py-2 text-xs text-white bg-[#07111E] border border-slate-700 rounded-lg outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Dish Mentioned */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium block">الصنف الذي جربته:</label>
                <input
                  type="text"
                  value={dishMentioned}
                  onChange={(e) => setDishMentioned(e.target.value)}
                  placeholder="مثال: فسيخ بلدي مخلي، رنجة بطارخ، صينية الحسانين..."
                  className="w-full px-3 py-2 text-xs text-white bg-[#07111E] border border-slate-700 rounded-lg outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Comment */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium block">رأيك وتعليقك: *</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="اكتب تفاصيل تجربتك مع الطعم، النظافة، والتوصيل..."
                  className="w-full px-3 py-2 text-xs text-white bg-[#07111E] border border-slate-700 rounded-lg outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#C5A059] hover:bg-[#d6b26b] text-slate-950 transition-all cursor-pointer shadow-md"
              >
                نشر التقييم الآن
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
