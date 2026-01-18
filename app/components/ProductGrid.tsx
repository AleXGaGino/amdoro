'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { ProductDisplay } from '@/types';

interface ProductGridProps {
  activeCategory: string;
  searchQuery: string;
  sortBy?: string;
  activeSubcategory?: string | null;
  setActiveSubcategory?: (subcategory: string | null) => void;
}

const PRODUCTS_PER_PAGE = 36;

export default function ProductGrid({ activeCategory, searchQuery, sortBy = 'relevant', activeSubcategory = null, setActiveSubcategory }: ProductGridProps) {
  const [displayedProducts, setDisplayedProducts] = useState<ProductDisplay[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  useEffect(() => {
    setIsLoading(true);
    setCurrentPage(1);
    setDisplayedProducts([]);
    
    // Build query params
    const params = new URLSearchParams({
      category: activeCategory,
      page: '1',
      limit: PRODUCTS_PER_PAGE.toString(),
      search: searchQuery,
      sort: sortBy,
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),
    });
    
    // Add subcategory if selected
    if (activeSubcategory) {
      params.append('subcategory', activeSubcategory);
    }
    
    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setDisplayedProducts(data.products);
        setTotalProducts(data.total);
        setHasMore(data.hasMore);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setIsLoading(false);
      });
  }, [activeCategory, searchQuery, sortBy, priceRange, activeSubcategory]);

  const loadMore = async () => {
    const nextPage = currentPage + 1;
    
    // Build query params
    const params = new URLSearchParams({
      category: activeCategory,
      page: nextPage.toString(),
      limit: PRODUCTS_PER_PAGE.toString(),
      search: searchQuery,
      sort: sortBy,
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),
    });
    
    // Add subcategory if selected
    if (activeSubcategory) {
      params.append('subcategory', activeSubcategory);
    }
    
    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      
      setDisplayedProducts([...displayedProducts, ...data.products]);
      setCurrentPage(nextPage);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Error loading more products:', err);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              {activeSubcategory 
                ? activeSubcategory 
                : activeCategory === 'All' 
                  ? 'Toate Produsele' 
                  : activeCategory
              }
            </h2>
            {activeSubcategory && (
              <p className="text-sm text-gray-500 mb-1">
                <span className="hover:text-[#1DB995] cursor-pointer" onClick={() => setActiveSubcategory && setActiveSubcategory(null)}>
                  {activeCategory}
                </span> › {activeSubcategory}
              </p>
            )}
            <p className="text-gray-600">
              <span className="font-bold text-[#1A2B48]">{totalProducts.toLocaleString('ro-RO')}</span> {totalProducts === 1 ? 'produs' : 'produse'} găsite
              {displayedProducts.length < totalProducts && (
                <span className="text-blue-400"> · Afișate {displayedProducts.length.toLocaleString('ro-RO')}</span>
              )}
            </p>
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
            <span className="text-gray-700 text-sm font-medium">Preț:</span>
            <input 
              type="number" 
              placeholder="Min" 
              value={priceRange.min || ''}
              onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
              className="w-20 px-2 py-1 bg-gray-50 text-gray-900 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1A2B48]"
            />
            <span className="text-gray-500">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={priceRange.max || ''}
              onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
              className="w-20 px-2 py-1 bg-gray-50 text-gray-900 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1A2B48]"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product, index) => (
                <div 
                  key={product.id}
                  style={{
                    animation: `fadeIn 0.5s ease-in-out ${index * 0.05}s both`
                  }}
                >
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    imageURL={product.imageURL}
                    category={product.category}
                    affiliateLink={product.affiliateLink}
                  />
                </div>
              ))}
            </div>
            
            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
            
            {hasMore && (
              <div className="text-center mt-16">
                <button
                  onClick={loadMore}
                  className="group px-10 py-4 bg-[#1DB995] hover:bg-[#18a082] text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                >
                  Încarcă mai multe produse
                  <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F4F7F6] rounded-full mb-4">
              <svg className="w-10 h-10 text-[#1A2B48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-600 text-xl font-semibold">Nu există produse în această categorie.</p>
          </div>
        )}
      </div>
    </section>
  );
}
