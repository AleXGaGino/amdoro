'use client';

import { useEffect } from 'react';

interface MetadataProps {
  activeCategory: string;
}

const categoryDescriptions: Record<string, string> = {
  All: "Descoperă cele mai bune oferte la toate produsele! Electronics, Fashion, Home și multe altele. Prețuri imbatabile!",
  Electronics: "🔌 Oferte speciale la produse electronice! Telefoane, laptopuri, accesorii și gadget-uri la prețuri avantajoase. Livrare rapidă!",
  Fashion: "👗 Cele mai trenduri articole de modă la prețuri mici! Îmbrăcăminte, încălțăminte și accesorii pentru toate stilurile.",
  Home: "🏠 Transformă-ți casa cu produse premium! Electrocasnice, decorațiuni și accesorii pentru un cămin perfect. Oferte exclusive!"
};

const categoryTitles: Record<string, string> = {
  All: "Cele mai bune oferte",
  Electronics: "Cele mai bune oferte la Electronics",
  Fashion: "Cele mai bune oferte la Fashion",
  Home: "Cele mai bune oferte la Home"
};

export function useDynamicMetadata({ activeCategory }: MetadataProps) {
  useEffect(() => {
    // Update document title
    const title = `${categoryTitles[activeCategory] || 'Cele mai bune oferte'} - Mall-ul tău de Afiliere`;
    document.title = title;

    // Update meta description
    const description = categoryDescriptions[activeCategory] || categoryDescriptions.All;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // Update Open Graph description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);

    // Update Twitter title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', title);

    // Update Twitter description
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', description);

  }, [activeCategory]);
}
