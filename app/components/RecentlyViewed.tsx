'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  title: string;
  price: number;
  imageURL: string;
  category: string;
  affiliateLink: string;
}

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load from localStorage
    const recent = localStorage.getItem('recentlyViewed');
    if (recent) {
      setRecentProducts(JSON.parse(recent).slice(0, 8));
    }
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Vizualizate Recent</span>
          </h2>
          <p className="text-slate-300">Continuă de unde ai rămas</p>
        </div>

        <div className="relative">
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {recentProducts.map((product) => (
                <div key={product.id} className="w-72 flex-shrink-0">
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
          </div>

          {/* Scroll Indicators */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none">
            <div className="relative max-w-7xl mx-auto px-4">
              <div className="absolute left-0 w-20 h-full bg-gradient-to-r from-slate-900 to-transparent" />
              <div className="absolute right-0 w-20 h-full bg-gradient-to-l from-black to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
