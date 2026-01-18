'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SubMenuProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
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

export default function SubMenu({ activeCategory, setActiveCategory, setActiveSubcategory }: SubMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    setActiveSubcategory(null); // Reset subcategory when changing category
    setIsDropdownOpen(false);
  };

  const handleSubcategoryClick = (categoryName: string, subcategoryName: string) => {
    setActiveCategory(categoryName);
    setActiveSubcategory(subcategoryName);
    setIsDropdownOpen(false);
  };

  // Get top 3 subcategories for each category for quick menu
  const mainCategories = categories.slice(0, 3).flatMap(cat => 
    cat.subcategories.slice(0, 2).map(sub => ({
      name: sub.name,
      category: cat.name,
    }))
  );

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[109px] z-40 shadow-sm">
      <div className="flex items-center relative">
        {/* Left Section: Toate Categoriile - aligned with sidebar */}
        <div 
          className="w-64 flex-shrink-0 border-r border-gray-200 relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-[#1A2B48] text-white hover:bg-[#152236] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Toate categoriile</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && !loading && (
            <div className="absolute top-full left-0 w-[800px] bg-white shadow-2xl border border-gray-200 rounded-b-lg z-50 max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-0">
                {categories.map((category, index) => (
                  <div 
                    key={category.name} 
                    className={`p-4 hover:bg-[#F4F7F6] transition-all ${index % 2 === 0 ? 'border-r border-gray-100' : ''}`}
                  >
                    <button
                      onClick={() => handleCategoryClick(category.name)}
                      className="text-sm font-bold text-[#1A2B48] hover:text-[#1DB995] mb-2 block text-left w-full"
                    >
                      {category.name} ({Math.floor(category.count / 1000)}k+)
                    </button>
                    <div className="space-y-1.5 ml-2">
                      {category.subcategories.slice(0, 10).map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => handleSubcategoryClick(category.name, sub.name)}
                          className="block text-xs text-gray-600 hover:text-[#1DB995] hover:translate-x-1 transition-all text-left w-full"
                        >
                          • {sub.name} ({sub.count})
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Footer with View All */}
              <div className="border-t border-gray-200 p-4 bg-[#F4F7F6]">
                <button
                  onClick={() => handleCategoryClick('All')}
                  className="text-sm font-semibold text-[#1A2B48] hover:text-[#1DB995] flex items-center justify-center gap-2 w-full"
                >
                  <span>Vezi toate categoriile</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Category Links */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide px-6">
          {loading ? (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              {mainCategories.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleSubcategoryClick(item.category, item.name)}
                  className="px-4 py-3 text-sm font-medium whitespace-nowrap transition-all text-gray-700 hover:bg-[#F4F7F6] hover:text-[#1A2B48]"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => handleCategoryClick('All')}
                className="px-4 py-3 text-sm font-medium whitespace-nowrap transition-all text-[#E8B042] hover:bg-[#FFF9ED] font-semibold"
              >
                Toate produsele
              </button>
            </>
          )}
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
    </div>
  );
}
