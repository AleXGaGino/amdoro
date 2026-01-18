'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import CountdownTimer from './CountdownTimer';
import ProductCardSkeleton from './ProductCardSkeleton';

interface Product {
  id: number;
  title: string;
  price: number;
  imageURL: string;
  category: string;
  affiliateLink: string;
}

export default function FlashSales() {
  const [flashProducts, setFlashProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Flash sale ends in 6 hours from now
  const flashSaleEnd = new Date(Date.now() + 6 * 60 * 60 * 1000);

  useEffect(() => {
    // Fetch random products for flash sale
    fetch('/api/products?limit=8&sort=price-asc')
      .then(res => res.json())
      .then(data => {
        setFlashProducts(data.products);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching flash sale products:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-red-900/30 via-slate-900 to-orange-900/30 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">⚡</span>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Flash <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Sale</span>
              </h2>
            </div>
            <p className="text-xl text-slate-300">Oferte limitate - Grăbește-te!</p>
          </div>
          
          <CountdownTimer endTime={flashSaleEnd} />
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {flashProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                imageURL={product.imageURL}
                category={product.category}
                affiliateLink={product.affiliateLink}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl text-lg hover:scale-105 transition-all shadow-lg shadow-red-500/30">
            Vezi toate ofertele Flash Sale
          </button>
        </div>
      </div>
    </section>
  );
}
