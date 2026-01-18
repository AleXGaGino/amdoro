'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Cum funcționează amdoro?",
      answer: "amdoro agregă cele mai bune oferte de la partenerii noștri verificați. Când dai click pe 'Vezi Oferta', ești redirecționat către magazinul partener unde poți finaliza comanda în siguranță."
    },
    {
      question: "Sunt prețurile actualizate?",
      answer: "Da! Actualizăm automat prețurile și disponibilitatea produselor zilnic pentru a ne asigura că vezi întotdeauna cele mai bune și mai actuale oferte."
    },
    {
      question: "Este sigur să cumpăr prin amdoro?",
      answer: "Absolut! Lucrăm doar cu parteneri verificați și de încredere. Toate tranzacțiile sunt procesate direct pe site-urile partenerilor, care sunt securizate și certificate."
    },
    {
      question: "Pot returna produsele?",
      answer: "Politicile de returnare depind de magazinul partener de la care cumperi. Toate magazinele noastre partenere oferă garanții și politici de returnare conform legislației românești."
    },
    {
      question: "Cum primesc produsele?",
      answer: "După ce plasezi comanda pe site-ul partenerului, produsele sunt livrate direct de ei. Primești tracking number și toate detaliile de livrare prin email."
    },
    {
      question: "amdoro percepe comisioane suplimentare?",
      answer: "Nu! Prețurile pe care le vezi sunt exacte. amdoro primește un mic comision de la parteneri, dar tu plătești exact același preț ca și cum ai merge direct pe site-ul lor."
    }
  ];

  return (
    <section className="py-20 bg-[#F4F7F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-[#1A2B48] mb-4">
            Întrebări <span className="text-[#1DB995]">Frecvente</span>
          </h2>
          <p className="text-xl text-gray-600">Tot ce trebuie să știi despre amdoro</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-[#1A2B48] text-lg">{faq.question}</span>
                <svg
                  className={`w-6 h-6 text-[#1DB995] transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Nu ai găsit răspunsul pe care îl căutai?</p>
          <button className="px-8 py-3 bg-[#E8B042] hover:bg-[#d69e35] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg">
            Contactează-ne
          </button>
        </div>
      </div>
    </section>
  );
}
