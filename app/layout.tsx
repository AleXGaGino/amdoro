import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Cele mai bune oferte - Mall-ul tău de Afiliere",
    template: "%s - Mall-ul tău de Afiliere"
  },
  description: "Descoperă cele mai bune oferte la produse de calitate! Electronics, Fashion, Home și multe altele. Prețuri avantajoase și livrare rapidă. Găsește oferta perfectă pentru tine!",
  keywords: ["oferte", "reduceri", "shopping online", "electronics", "fashion", "home", "prețuri mici", "produse calitate", "magazine online", "2performant"],
  authors: [{ name: "Affiliate Mall" }],
  creator: "Affiliate Mall",
  publisher: "Affiliate Mall",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://affiliate-mall.ro",
    title: "Cele mai bune oferte într-un singur loc - Mall-ul tău de Afiliere",
    description: "🛍️ Descoperă oferte exclusive la Electronics, Fashion, Home și multe altele! Prețuri imbatabile și livrare rapidă. Începe să economisești astăzi!",
    siteName: "Affiliate Mall",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Affiliate Mall - Cele mai bune oferte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cele mai bune oferte - Mall-ul tău de Afiliere",
    description: "Descoperă oferte exclusive la produse de calitate! Electronics, Fashion, Home și multe altele.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://affiliate-mall.ro",
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
