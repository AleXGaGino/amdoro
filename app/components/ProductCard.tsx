'use client';

import { useState, useEffect, useRef } from 'react';
import ProductBadge from './ProductBadge';
import { ProductDisplay } from '@/types';

interface ProductCardProps extends Partial<ProductDisplay> {
  // Backward compatibility
  id: number;
  title: string;
  price: number;
  imageURL?: string;
  imageUrl?: string;
  category?: string;
  categoryName?: string;
  affiliateLink: string;
  brand?: string;
  oldPrice?: number;
  discountPercent?: number;
  inStock?: boolean;
  slug?: string;
  cashbackPercent?: number;
}

export default function ProductCard({
  id,
  title,
  price,
  imageURL,
  imageUrl,
  category,
  categoryName,
  affiliateLink,
  brand,
  oldPrice,
  discountPercent,
  inStock = true,
  slug,
  cashbackPercent,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Use new architecture fields or fallback to legacy
  const productImage = imageUrl || imageURL || '';
  const productBrand = brand || title.split(' ')[0];
  const productCategory = categoryName || category || '';
  const actualOldPrice = oldPrice || (price * 1.2); // Fallback simulation
  const actualDiscount = discountPercent ?? (oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);
  const actualCashback = cashbackPercent || (Math.floor(Math.random() * 8) + 3);
  const displayDiscount = actualDiscount > 0 ? actualDiscount : 0;
  const originalPrice = actualOldPrice;
  
  const cleanLink = `/api/go/${id}`;
  
  // Fallback image placeholder - trebuie definit ÎNAINTE de a fi folosit
  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23F4F7F6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="%231A2B48"%3EImagine indisponibilă%3C/text%3E%3C/svg%3E';
  
  // Use images directly (most CDNs have CORS enabled)
  const getImageUrl = (url: string) => {
    try {
      if (!url || url === '') return fallbackImage;
      if (url.startsWith('data:')) return url;
      
      // Return direct URL - most modern CDNs support CORS
      return url;
    } catch {
      return fallbackImage;
    }
  };
  
  const imageSource = imgError ? fallbackImage : getImageUrl(productImage);
  
  // Check if image needs unoptimized mode (evomag has complex query params)
  const needsUnoptimized = imageSource.includes('evomag.ro') || imageSource.includes('sign=') || imageSource.startsWith('data:');
  
  // Intersection Observer pentru lazy loading real - imaginile se încarcă doar când sunt vizibile
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
            observer.disconnect(); // Stop observing după ce devine vizibil
          }
        });
      },
      {
        rootMargin: '50px', // Începe încărcarea cu 50px înainte să intre în viewport
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Lazy load images cu delay pentru evomag DOAR când cardul e vizibil
  useEffect(() => {
    if (!isInViewport) return; // Nu încărca până nu e vizibil
    
    if (imageSource.includes('evomag.ro')) {
      // Random delay între 2-3 secunde pentru evomag când devine vizibil
      const delay = Math.random() * 1000 + 2000;
      const timer = setTimeout(() => {
        setShouldLoadImage(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Încarcă imediat pentru alte CDN-uri când devine vizibil
      setShouldLoadImage(true);
    }
  }, [isInViewport, imageSource]);
  
  // Track recently viewed on mount
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const product = { 
      id, 
      title, 
      price, 
      imageURL: productImage, 
      category: productCategory, 
      affiliateLink 
    };
    const filtered = recent.filter((p: any) => p.id !== id);
    const updated = [product, ...filtered].slice(0, 12);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  }, [id, title, price, productImage, productCategory, affiliateLink]);
  
  // Social proof randomization (în producție ar veni de la API)
  const viewersCount = Math.floor(Math.random() * 50) + 10;
  const purchasesCount = Math.floor(Math.random() * 200) + 50;
  const stockStatus = inStock ? (Math.random() > 0.7 ? 'limited' : 'normal') : 'out';
  
  // Badge logic
  const isNew = Math.random() > 0.85;
  const isHotDeal = actualDiscount > 30;
  const isTrending = Math.random() > 0.90;
  const isBestseller = Math.random() > 0.92;
  
  // Rate calculation
  const installments = Math.ceil(price / 200);
  const monthlyPayment = (price / installments).toFixed(2);
  
  // Cashback calculation
  const cashbackAmount = (price * (actualCashback / 100)).toFixed(2);
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    
    // Save to localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!isWishlisted) {
      wishlist.push({ id, title, price, imageURL: productImage, category: productCategory });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } else {
      const filtered = wishlist.filter((item: any) => item.id !== id);
      localStorage.setItem('wishlist', JSON.stringify(filtered));
    }
  };

  return (
    <div 
      ref={cardRef}
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#1A2B48]/30 transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden bg-gray-50">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full"></div>
          </div>
        )}
        {shouldLoadImage ? (
          <img
            src={imageSource}
            alt={title}
            onError={(e) => {
              setImgError(true);
            }}
            onLoad={() => {
              setImgLoaded(true);
            }}
            loading="lazy"
            className={`w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-500 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full"></div>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 bg-white p-2 rounded-full hover:scale-110 transition-all shadow-md z-10"
        >
          <svg 
            className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600'}`}
            stroke="currentColor" 
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
        
        {/* Badges Stack */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {displayDiscount > 10 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              -{displayDiscount}%
            </span>
          )}
          {isNew && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              NOU
            </span>
          )}
        </div>
        
        {/* Free Shipping Badge */}
        {price > 100 && (
          <div className="absolute bottom-3 left-3 bg-[#1DB995] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            Livrare GRATUITĂ
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-gray-600 font-semibold mb-1 uppercase">{brand}</p>
        
        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 h-10">
          {title}
        </h3>
        
        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-600">({purchasesCount})</span>
        </div>
        
        {/* Price */}
        <div className="mb-3">
          {displayDiscount > 10 && (
            <div className="text-sm text-gray-500 line-through mb-1">
              {originalPrice.toFixed(2)} RON
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1DB995]">
              {price.toFixed(2)}
            </span>
            <span className="text-lg text-gray-700">RON</span>
          </div>
        </div>
        
        {/* Installments */}
        <div className="mb-3 text-xs text-gray-600">
          sau <span className="font-bold text-gray-900">{installments}x{monthlyPayment} RON</span> fără dobândă
        </div>
        
        {/* Cashback */}
        <div className="mb-4 bg-[#F4F7F6] border border-[#1DB995]/30 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4 text-[#1DB995]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-[#1DB995]">Cashback {cashbackAmount} RON</span>
            <span className="text-gray-600">({cashbackPercent}%)</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <a
          href={cleanLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-[#E8B042] hover:bg-[#d69e35] text-white py-3 px-4 rounded-lg font-bold text-center transition-all shadow-md hover:shadow-lg"
        >
          Adaugă în coș
        </a>
        
        {/* Stock Status */}
        {stockStatus === 'limited' && (
          <p className="mt-2 text-xs text-red-600 font-semibold text-center">
            ⚠️ Ultimele {Math.floor(Math.random() * 5) + 1} bucăți în stoc
          </p>
        )}
      </div>
    </div>
  );
}
