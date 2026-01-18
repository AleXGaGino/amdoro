'use client';

import { useState, useEffect } from 'react';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeSubcategory: string | null;
  setActiveSubcategory: (subcategory: string | null) => void;
}

interface CategoryData {
  name: string;
  slug: string;
  count: number;
  subcategories: SubcategoryData[];
}

interface SubcategoryData {
  name: string;
  slug: string;
  count: number;
  parent: string;
}

export default function Sidebar({ activeCategory, setActiveCategory, activeSubcategory, setActiveSubcategory }: SidebarProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load dynamic categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch('/api/categories?includeSubcategories=true');
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadCategories();
  }, []);
  
  const formatCount = (count: number): string => {
    if (count >= 1000) return `${Math.floor(count / 1000)}k+`;
    return count.toString();
  };
  
  // Get display categories (including "All")
  const displayCategories = [
    { name: 'All', slug: 'all', count: categories.reduce((sum, cat) => sum + cat.count, 0), subcategories: [] },
    ...categories,
  ];
  
  // Get current category's subcategories
  const currentCategoryData = categories.find(cat => cat.name === activeCategory);
  const currentSubcategories = currentCategoryData?.subcategories || null;

  const priceRanges = [
    { label: 'Sub 50 RON', min: 0, max: 50 },
    { label: '50 - 100 RON', min: 50, max: 100 },
    { label: '100 - 200 RON', min: 100, max: 200 },
    { label: '200 - 500 RON', min: 200, max: 500 },
    { label: '500 - 1000 RON', min: 500, max: 1000 },
    { label: 'Peste 1000 RON', min: 1000, max: 999999 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 sticky top-[157px] h-[calc(100vh-157px)] overflow-y-auto flex-shrink-0">
      <div className="p-4">
        {/* Categories Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
            {activeCategory === 'All' ? 'Categorii' : 'Subcategorii'}
          </h3>
          
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              {/* Buton înapoi la categorii principale */}
          {activeCategory !== 'All' && (
            <button
              onClick={() => setActiveCategory('All')}
              className="w-full text-left px-3 py-2.5 mb-2 rounded-md text-sm transition-all flex items-center gap-2 text-[#1A2B48] hover:bg-[#F4F7F6] font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Înapoi la categorii</span>
            </button>
          )}

          <div className="space-y-0.5">
            {activeCategory === 'All' ? (
              // Afișează categoriile principale
              displayCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-all flex items-center gap-2 ${
                    activeCategory === cat.name
                      ? 'bg-[#1A2B48] text-white font-semibold shadow-sm'
                      : 'text-gray-700 hover:bg-[#F4F7F6]'
                  }`}
                >
                  <div className="flex-1 flex items-center justify-between">
                    <span>{cat.name === 'All' ? 'Toate produsele' : cat.name}</span>
                    <span className={`text-xs ${activeCategory === cat.name ? 'text-blue-100' : 'text-gray-400'}`}>
                      {formatCount(cat.count)}
                    </span>
                  </div>
                </button>
              ))
            ) : currentSubcategories && currentSubcategories.length > 0 ? (
              // Afișează subcategoriile categoriei active
              currentSubcategories.map((subcat) => (
                <button
                  key={subcat.slug}
                  onClick={() => setActiveSubcategory(subcat.name)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-all ${
                    activeSubcategory === subcat.name
                      ? 'bg-[#1DB995] text-white font-semibold'
                      : 'text-gray-700 hover:bg-[#F4F7F6] hover:text-[#1DB995]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{subcat.name}</span>
                    <span className={`text-xs ${
                      activeSubcategory === subcat.name ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {formatCount(subcat.count)}
                    </span>
                  </div>
                </button>
              ))
            ) : null}
          </div>
            </>
          )}
        </div>

        {/* Price Filter Section */}
        <div className="mb-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Preț</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.label} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0071DC] border-gray-300 rounded focus:ring-[#0071DC] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-[#0071DC]">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Section */}
        <div className="mb-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Disponibilitate</h3>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#0071DC] border-gray-300 rounded focus:ring-[#0071DC] cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-[#0071DC]">
                În stoc
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#0071DC] border-gray-300 rounded focus:ring-[#0071DC] cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-[#0071DC]">
                Livrare gratuită
              </span>
            </label>
          </div>
        </div>

        {/* Rating Section */}
        <div className="mb-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Rating minim</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2].map((rating) => (
              <label key={rating} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  className="w-4 h-4 text-[#0071DC] border-gray-300 focus:ring-[#0071DC] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-[#0071DC] flex items-center gap-1">
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                  {Array.from({ length: 5 - rating }).map((_, i) => (
                    <span key={i} className="text-gray-300">★</span>
                  ))}
                  <span className="ml-1">& mai mult</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Discount Section */}
        <div className="mb-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Reduceri</h3>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#0071DC] border-gray-300 rounded focus:ring-[#0071DC] cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-[#0071DC]">
                Peste 50% reducere
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#0071DC] border-gray-300 rounded focus:ring-[#0071DC] cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-[#0071DC]">
                30% - 50% reducere
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#0071DC] border-gray-300 rounded focus:ring-[#0071DC] cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-[#0071DC]">
                Sub 30% reducere
              </span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
