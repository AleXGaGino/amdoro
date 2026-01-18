'use client';

import Link from 'next/link';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({ searchQuery, setSearchQuery }: NavbarProps) {
  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Top Bar - Info */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs">
            <div className="flex items-center gap-4 text-gray-600">
              <span>Suport: 0800 123 456</span>
              <span>contact@amdoro.ro</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-gray-600 hover:text-[#0071DC] transition-colors">
                Comenzile mele
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#0071DC] transition-colors">
                Ajutor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="flex items-center h-20">
          {/* Left Section: Logo & Brand - aligned with sidebar width */}
          <div className="w-64 px-4 flex-shrink-0 border-r border-gray-200">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/logo/Amdoro_Logo.png" 
                alt="amdoro" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-3xl font-black text-[#1A2B48]">
                  amdoro
                </h1>
                <p className="text-sm text-gray-600 font-medium -mt-1">Magazin Online</p>
              </div>
            </Link>
          </div>

          {/* Right Section: Search Bar + Actions */}
          <div className="flex-1 flex items-center justify-between gap-6 px-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Caută în peste 300.000 de produse..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1A2B48] focus:border-transparent focus:bg-white transition-all"
                />
                <button className="absolute right-1.5 top-1.5 bg-[#E8B042] hover:bg-[#d69e35] p-2 rounded-md transition-all">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="#" className="flex items-center gap-2 px-3 py-2 hover:bg-[#F4F7F6] rounded-md transition-all group">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-[#1A2B48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500">Bună!</span>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1A2B48]">Contul meu</span>
                </div>
              </Link>

              <Link href="#" className="flex items-center gap-2 px-3 py-2 hover:bg-[#F4F7F6] rounded-md transition-all group">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-[#1A2B48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500">Lista</span>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1A2B48]">Favorite</span>
                </div>
              </Link>

              <Link href="#" className="flex items-center gap-2 px-3 py-2 bg-[#1DB995] hover:bg-[#18a082] rounded-md transition-all group relative">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-blue-100">Coșul tău</span>
                  <span className="text-sm font-bold text-white">0 produse</span>
                </div>
                <span className="absolute -top-1 -right-1 bg-[#E8B042] text-[#1A2B48] text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">0</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
