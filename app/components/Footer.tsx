export default function Footer() {
  return (
    <footer className="bg-[#1A2B48] text-white py-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo/Amdoro_Logo.png" alt="amdoro" className="h-10 w-auto" />
              <div>
                <h3 className="text-2xl font-bold text-white">
                  amdoro
                </h3>
                <p className="text-xs text-gray-300">Magazin Online</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Cea mai mare platformă de oferte din România. Peste 307,000 de produse actualizate zilnic pentru tine.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Link-uri Rapide</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-[#1DB995] transition">Acasă</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#1DB995] transition">Despre Noi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#1DB995] transition">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#1DB995] transition">Blog</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white mb-4">Categorii</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-[#1DB995] transition">Electronics</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#1DB995] transition">Fashion</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#1DB995] transition">Casă & Grădină</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#1DB995] transition">Sports</a></li>
            </ul>
          </div>
        </div>
        
        {/* Affiliate Disclosure */}
        <div className="border-t border-gray-700 pt-8 mb-6">
          <div className="bg-[#152236] border border-gray-700 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="bg-[#E8B042]/10 p-2 rounded-lg">
                <svg className="w-6 h-6 text-[#E8B042]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-white mb-2">Declarație de Afiliere</h5>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Acest site conține link-uri de afiliat. Putem primi un comision pentru achizițiile făcute prin intermediul acestor link-uri, fără costuri suplimentare pentru dvs. Vă mulțumim pentru sprijin!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} <span className="font-bold text-white">amdoro</span>. Toate drepturile rezervate.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <a href="#" className="text-gray-400 hover:text-[#1DB995] text-sm transition">Termeni și Condiții</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-gray-400 hover:text-[#1DB995] text-sm transition">Politica de Confidentialitate</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-gray-400 hover:text-[#1DB995] text-sm transition">GDPR</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
