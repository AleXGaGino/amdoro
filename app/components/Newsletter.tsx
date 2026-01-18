'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aici ai putea adăuga logică pentru salvarea email-ului
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 3000);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 via-slate-900 to-green-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-green-600 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-sm font-semibold text-blue-300">Newsletter Exclusiv</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Primești <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">-15% DISCOUNT</span>
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Abonează-te și fii primul care află despre ofertele exclusive și reducerile speciale!
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="flex items-center gap-3 text-left">
              <div className="bg-green-500 p-2 rounded-lg flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white font-semibold">Oferte Exclusive</p>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="bg-green-500 p-2 rounded-lg flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white font-semibold">Early Access</p>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="bg-green-500 p-2 rounded-lg flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white font-semibold">Fără Spam</p>
            </div>
          </div>

          {/* Subscribe Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email-ul tău..."
                  required
                  className="flex-1 px-6 py-4 bg-slate-800/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap"
                >
                  Abonează-te
                </button>
              </div>
              <p className="text-sm text-blue-300 mt-3">
                Îți respectăm confidențialitatea. Te poți dezabona oricând.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto bg-green-500/20 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="font-bold text-lg">Te-ai abonat cu succes!</p>
              </div>
              <p className="text-blue-200 mt-2">Verifică-ți inbox-ul pentru codul de discount.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
