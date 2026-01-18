# Affiliate Link Redirect API

## Overview
The API route at `/app/api/go/[id]/route.ts` provides clean, short URLs for affiliate links instead of exposing long tracking URLs.

## How It Works

1. **User clicks** "Vezi Oferta" button on a product card
2. **Browser navigates** to `/api/go/123` (where 123 is the product ID)
3. **API finds** the product in products.json by ID
4. **Server performs** a 307 redirect to the actual affiliate link
5. **User lands** on the 2Performant affiliate page

## Benefits

✅ **Clean URLs**: `/api/go/1` instead of `https://2performant.com/l/example-product-1`
✅ **Better UX**: Shorter, more professional links
✅ **Easier tracking**: Can add analytics before redirect
✅ **Link management**: Change affiliate URLs without updating frontend
✅ **Security**: Affiliate URLs not exposed in HTML source

## Usage Examples

### In React Components
```typescript
// Product with ID 5
<a href="/api/go/5" target="_blank">View Product</a>

// Dynamic product ID
<a href={`/api/go/${productId}`} target="_blank">View Product</a>
```

### Direct Access
```
http://localhost:3000/api/go/1  → Redirects to Sony headphones
http://localhost:3000/api/go/2  → Redirects to Levi's jeans
http://localhost:3000/api/go/3  → Redirects to Ninja blender
```

## API Response Codes

| Code | Meaning | When |
|------|---------|------|
| 307 | Temporary Redirect | Product found, redirecting to affiliate link |
| 400 | Bad Request | Invalid product ID (not a number) |
| 404 | Not Found | Product ID doesn't exist or no affiliate link |
| 500 | Internal Error | Server error during processing |

## Testing

### Test Valid Product
```bash
curl -I http://localhost:3000/api/go/1
# Should return 307 redirect
```

### Test Invalid Product
```bash
curl http://localhost:3000/api/go/999
# Returns: {"error":"Product not found"}
```

### Test Invalid ID Format
```bash
curl http://localhost:3000/api/go/abc
# Returns: {"error":"Invalid product ID. Must be a number."}
```

## Edge Runtime

The route uses Edge Runtime for:
- **Faster responses** (lower latency)
- **Global deployment** (closer to users)
- **Better performance** (optimized for redirects)

## Future Enhancements

You can extend this API to:

1. **Add Click Tracking**
```typescript
// Log clicks to database
await logClick(productId, request.headers);
```

2. **Add Analytics**
```typescript
// Track with Google Analytics
await trackEvent('product_click', { productId });
```

3. **Add UTM Parameters**
```typescript
const url = new URL(product.affiliateLink);
url.searchParams.append('utm_source', 'affiliate-mall');
url.searchParams.append('utm_medium', 'redirect');
return NextResponse.redirect(url.toString(), 307);
```

4. **Add Rate Limiting**
```typescript
// Prevent abuse
const clicks = await checkRateLimit(ip);
if (clicks > 100) return NextResponse.json({ error: 'Too many requests' }, 429);
```

## Implementation Details

The ProductCard component now uses:
```typescript
const cleanLink = `/api/go/${id}`;
<a href={cleanLink} target="_blank">Vezi Oferta</a>
```

Instead of:
```typescript
<a href={affiliateLink} target="_blank">Vezi Oferta</a>
```

This keeps affiliate tracking URLs server-side only.
