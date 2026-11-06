/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SpecialOffers } from './components/SpecialOffers';
import { MenuSection } from './components/MenuSection';
import { WhyUsSection } from './components/WhyUsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { BrandKitModal } from './components/BrandKitModal';
import { OFFICIAL_PRODUCTS, INITIAL_REVIEWS } from './data/menuData';
import { OfficialProduct, CartItem, SpecialOfferItem, CustomerReview } from './types/restaurant';
import { formatWeightLabel, calculateItemPrice } from './utils/orderUtils';

const CART_STORAGE_KEY = 'hassanein_cart_v2';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isBrandKitOpen, setIsBrandKitOpen] = useState<boolean>(false);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Smooth navigation to sections
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add individual product with selected weight
  const handleAddToCart = (
    product: OfficialProduct,
    weightKg: number,
    weightLabel: string,
    calculatedPrice: number,
    notes?: string
  ) => {
    const cartItemId = `${product.id}-${weightKg}`;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.cartItemId === cartItemId);
      if (existingIdx > -1) {
        // If already in cart with exact same weight, double the weight
        const updated = [...prev];
        const newWeight = updated[existingIdx].weightKg + weightKg;
        const newPrice = product.pricePerKg ? Math.round(product.pricePerKg * newWeight) : 0;
        updated[existingIdx] = {
          ...updated[existingIdx],
          weightKg: newWeight,
          weightLabel: `${newWeight} كجم`,
          totalPrice: newPrice,
          notes: notes || updated[existingIdx].notes,
        };
        return updated;
      }

      return [
        ...prev,
        {
          cartItemId,
          productId: product.id,
          productName: product.name,
          categoryLabel: product.categoryLabel,
          image: product.image,
          weightKg,
          weightLabel,
          unitPricePerKg: product.pricePerKg,
          priceOnDemand: product.priceOnDemand,
          totalPrice: calculatedPrice,
          notes,
        },
      ];
    });
  };

  // Add Special Offer Combo to Cart
  const handleAddOfferToCart = (offer: SpecialOfferItem) => {
    const cartItemId = `offer-${offer.id}`;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.cartItemId === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          weightKg: updated[existingIdx].weightKg + 1,
          totalPrice: updated[existingIdx].totalPrice + offer.price,
        };
        return updated;
      }

      return [
        ...prev,
        {
          cartItemId,
          productId: offer.id,
          productName: offer.title,
          categoryLabel: 'عروض الحسانين',
          image: offer.image,
          weightKg: 1,
          weightLabel: 'عرض متكامل (صينية)',
          unitPricePerKg: offer.price,
          totalPrice: offer.price,
          notes: offer.tagline,
        },
      ];
    });
  };

  // Adjust weight directly in Cart Drawer
  const handleUpdateWeight = (cartItemId: string, newWeightKg: number) => {
    setCartItems((prev) =>
      prev.map((ci) => {
        if (ci.cartItemId !== cartItemId) return ci;
        const newPrice = calculateItemPrice(ci.unitPricePerKg, newWeightKg);
        return {
          ...ci,
          weightKg: newWeightKg,
          weightLabel: formatWeightLabel(newWeightKg),
          totalPrice: newPrice,
        };
      })
    );
  };

  // Remove from cart
  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Add customer review
  const handleAddReview = (newReview: Omit<CustomerReview, 'id' | 'date' | 'verified'>) => {
    const reviewObj: CustomerReview = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: 'الآن',
      verified: true,
    };
    setReviews((prev) => [reviewObj, ...prev]);
  };

  const totalCartCount = cartItems.length;

  return (
    <div className="min-h-screen bg-[#060F1E] text-slate-100 flex flex-col antialiased selection:bg-[#D4AF37] selection:text-black font-['Cairo',sans-serif]">
      {/* 1. Grand Egyptian Luxury SplashScreen on Initial Load */}
      <SplashScreen />

      {/* 2. Top Navigation Bar with Logo and Cart Counter */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        onOpenBrandKit={() => setIsBrandKitOpen(true)}
      />

      {/* 3. Main Body Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOrderNow={() => setIsCartOpen(true)}
          onExploreMenu={() => handleNavigate('menu')}
        />

        {/* Special Offers Section: عروض الحسانين */}
        <SpecialOffers onAddOfferToCart={handleAddOfferToCart} />

        {/* Official Menu with Weights & Auto-Calculated Prices */}
        <MenuSection
          products={OFFICIAL_PRODUCTS}
          onAddToCart={handleAddToCart}
        />

        {/* Why Us Section: لماذا الحسانين؟ */}
        <WhyUsSection />

        {/* Customer Reviews & Interactive Feedback */}
        <ReviewsSection
          reviews={reviews}
          onAddReview={handleAddReview}
        />

        {/* Restaurant Contact, Address (حدائق القبة), Phone, WhatsApp & Google Maps */}
        <ContactSection />
      </main>

      {/* 4. Luxury Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBrandKit={() => setIsBrandKitOpen(true)}
      />

      {/* 5. Floating WhatsApp Button & Quick Cart Access */}
      <FloatingWhatsApp
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 6. Interactive Shopping Cart Drawer with WhatsApp Order Integration */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateWeight={handleUpdateWeight}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* 7. Brand Identity & Logo Kit Modal */}
      <BrandKitModal
        isOpen={isBrandKitOpen}
        onClose={() => setIsBrandKitOpen(false)}
      />
    </div>
  );
}
