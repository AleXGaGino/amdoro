import { NextRequest, NextResponse } from 'next/server';
import { loadProducts } from '@/lib/products';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const params = await context.params;
    
    // Parse the product ID from the URL parameter
    const productId = parseInt(params.id, 10);

    // Validate the ID is a number
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID. Must be a number.' },
        { status: 400 }
      );
    }

    // Load products using the same cache mechanism as /api/products
    const products = await loadProducts();
    
    // Check if products loaded successfully
    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Product database not available' },
        { status: 503 }
      );
    }
    
    const product = products.find((p) => p.id === productId);

    // If product not found, return 404
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if affiliate link exists
    if (!product.affiliateLink) {
      return NextResponse.json(
        { error: 'Affiliate link not available for this product' },
        { status: 404 }
      );
    }

    // Perform a 307 Temporary Redirect to the affiliate link
    // 307 preserves the HTTP method (GET in this case)
    return NextResponse.redirect(product.affiliateLink, 307);
    
  } catch (error) {
    console.error('Error in redirect API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
