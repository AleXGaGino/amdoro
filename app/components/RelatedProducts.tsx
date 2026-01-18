'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

interface Product {
  id: number;
  title: string;
  price: number;
  imageURL: string;
  category: string;
  affiliateLink: string;
}

interface RelatedProductsProps {
  currentProductId?: number;
  category: string;
  maxItems?: number;
}

export default function RelatedProducts({ 
  currentProductId, 
  category, 
  maxItems = 8 
}: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?category=${category}&limit=${maxItems + 1}`)
      .then(res => res.json())
      .then(data => {
        // Filter out current product if provided
        const filtered = currentProductId
          ? data.products.filter((p: Product) => p.id !== currentProductId)
          : data.products;
        
        setRelatedProducts(filtered.slice(0, maxItems));
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching related products:', err);
        setIsLoading(false);
      });
  }, [category, currentProductId, maxItems]);

  if (!isLoading && relatedProducts.length === 0) return null;

  return (
    <section className="py-16 bg-[#F4F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-[#1A2B48] mb-2">
            Produse <span className="text-[#1DB995]">similare</span>
          </h2>
          <p className="text-gray-600">S-ar putea să îți placă și acestea</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
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
      </div>
    </section>
  );
}
