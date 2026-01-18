'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import SubMenu from './components/SubMenu';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import RelatedProducts from './components/RelatedProducts';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { useDynamicMetadata } from './hooks/useDynamicMetadata';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevant');
  
  // Reset subcategory când schimbăm categoria
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setActiveSubcategory(null);
  };
  
  // Update metadata dynamically based on active category
  useDynamicMetadata({ activeCategory });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <SubMenu 
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        setActiveSubcategory={setActiveSubcategory}
      />
      
      <div className="flex flex-1">
        <Sidebar 
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          activeSubcategory={activeSubcategory}
          setActiveSubcategory={setActiveSubcategory}
        />
        
        <main className="flex-1 min-w-0">
          {/* Sorting Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700">Ordonare după:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:border-[#1A2B48] focus:outline-none focus:ring-2 focus:ring-[#1A2B48] focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="relevant">Cele mai relevante</option>
                  <option value="price-asc">Preț crescător</option>
                  <option value="price-desc">Preț descrescător</option>
                  <option value="newest">Cele mai noi</option>
                  <option value="popular">Cele mai căutate</option>
                  <option value="bestseller">Cele mai vândute</option>
                </select>
              </div>
            </div>
          </div>

          <ProductGrid 
            activeCategory={activeCategory} 
            searchQuery={searchQuery} 
            sortBy={sortBy} 
            activeSubcategory={activeSubcategory}
            setActiveSubcategory={setActiveSubcategory}
          />
          <RelatedProducts category={activeCategory !== 'All' ? activeCategory : 'Electronics'} maxItems={8} />
          <FAQ />
          <Footer />
        </main>
      </div>
    </div>
  );
}
