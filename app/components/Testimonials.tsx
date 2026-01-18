'use client';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Maria Popescu",
      role: "Client Verificat",
      image: "https://ui-avatars.com/api/?name=Maria+Popescu&background=3b82f6&color=fff",
      rating: 5,
      text: "Am găsit cele mai bune oferte pentru electronice! Livrarea a fost rapidă și produsele exacte ca în descriere. Recomand cu încredere! 🎉"
    },
    {
      name: "Ion Marinescu",
      role: "Client Verificat",
      image: "https://ui-avatars.com/api/?name=Ion+Marinescu&background=10b981&color=fff",
      rating: 5,
      text: "Site-ul este super rapid și ușor de folosit. Am economisit peste 500 RON la ultima comandă. Mulțumesc echipei amdoro!"
    },
    {
      name: "Elena Ionescu",
      role: "Client Verificat",
      image: "https://ui-avatars.com/api/?name=Elena+Ionescu&background=3b82f6&color=fff",
      rating: 5,
      text: "Compar mereu prețurile aici înainte să cumpăr. M-a ajutat să găsesc oferte incredibile la produsele pe care le doream. 👍"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ce spun <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">clienții noștri</span>
          </h2>
          <p className="text-xl text-blue-300">Peste 10,000+ clienți mulțumiți în România</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all">
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-blue-200 mb-6 leading-relaxed">{testimonial.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-blue-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">10,000+</p>
            <p className="text-blue-300">Clienți Fericiți</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">307K+</p>
            <p className="text-blue-300">Produse</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">4.9/5</p>
            <p className="text-blue-300">Rating Mediu</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">24/7</p>
            <p className="text-blue-300">Suport</p>
          </div>
        </div>
      </div>
    </section>
  );
}
