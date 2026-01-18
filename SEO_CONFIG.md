# SEO Configuration for Affiliate Mall

## Metadata Implementation

The site now includes comprehensive SEO optimization with:

### Base Metadata (layout.tsx)
- **Dynamic Titles**: Template-based titles that update per page
- **Meta Description**: Engaging description encouraging clicks
- **Keywords**: Targeted Romanian keywords for better search visibility
- **Robots Configuration**: Proper indexing instructions for search engines

### Open Graph Tags (Facebook & WhatsApp)
```typescript
openGraph: {
  type: "website",
  locale: "ro_RO",
  url: "https://affiliate-mall.ro",
  title: "Cele mai bune oferte într-un singur loc",
  description: "🛍️ Descoperă oferte exclusive...",
  siteName: "Affiliate Mall",
  images: [{ url: "/og-image.jpg", width: 1200, height: 630 }]
}
```

### Dynamic Metadata by Category
The `useDynamicMetadata` hook automatically updates:
- Page title
- Meta description
- OpenGraph tags
- Twitter Card tags

**Category-specific titles:**
- All: "Cele mai bune oferte - Mall-ul tău de Afiliere"
- Electronics: "Cele mai bune oferte la Electronics - Mall-ul tău de Afiliere"
- Fashion: "Cele mai bune oferte la Fashion - Mall-ul tău de Afiliere"
- Home: "Cele mai bune oferte la Home - Mall-ul tău de Afiliere"

## Setup Instructions

### 1. Create Open Graph Image
Create an image at `public/og-image.jpg` with dimensions:
- Width: 1200px
- Height: 630px
- Content: Your brand logo and catchy tagline

### 2. Update Site URL
Replace `https://affiliate-mall.ro` in `app/layout.tsx` with your actual domain.

### 3. Add Verification Codes (Optional)
In `app/layout.tsx`, add your verification codes:
```typescript
verification: {
  google: 'your-google-verification-code',
  yandex: 'your-yandex-verification-code',
}
```

### 4. Test Your Metadata

**Facebook/WhatsApp Sharing:**
- Test at: https://developers.facebook.com/tools/debug/

**Twitter Cards:**
- Test at: https://cards-dev.twitter.com/validator

**Google Search:**
- Submit sitemap at: https://search.google.com/search-console

## Best Practices

1. **Title Length**: Keep under 60 characters for Google display
2. **Description Length**: 150-160 characters optimal
3. **Keywords**: Focus on Romanian market terms
4. **Images**: Always include high-quality OG images
5. **Mobile**: Ensure responsive meta viewport (already configured)

## Category Descriptions

Each category has optimized descriptions with:
- Emojis for visual appeal ✅
- Action words (Descoperă, Transformă)
- Benefits (prețuri mici, livrare rapidă)
- Clear call-to-action

## Monitoring

Track your SEO performance:
- Google Analytics (add tracking code)
- Google Search Console
- Facebook Pixel (for ad campaigns)
- Heat mapping tools for user behavior
