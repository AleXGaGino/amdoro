import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force Node.js runtime (nu edge runtime)
export const runtime = 'nodejs';

// Cache pentru produse (același mecanism ca în /api/products)
let cachedProducts: any[] | null = null;
let lastModified: number = 0;

function getProducts() {
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  const stats = fs.statSync(filePath);
  
  if (cachedProducts && stats.mtimeMs === lastModified) {
    return cachedProducts;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  cachedProducts = JSON.parse(fileContent);
  lastModified = stats.mtimeMs;
  
  return cachedProducts;
}

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

    // Find the product by ID using cache
    const products = getProducts();
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
