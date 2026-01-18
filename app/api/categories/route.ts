import { NextResponse } from 'next/server';
import { loadProducts } from '@/lib/products';
import { buildCategoryTree, extractBrands, getPriceRanges } from '@/lib/categories';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSubcategories = searchParams.get('includeSubcategories') !== 'false';
    const includeBrands = searchParams.get('includeBrands') === 'true';
    const includePriceRanges = searchParams.get('includePriceRanges') === 'true';
    const category = searchParams.get('category');
    
    const startTime = Date.now();
    const products = await loadProducts();
    
    // Filter by category if specified
    let filteredProducts = products;
    if (category && category !== 'All') {
      filteredProducts = products.filter(p => {
        const cat = p.category || '';
        return cat.toLowerCase().includes(category.toLowerCase());
      });
    }
    
    const response: any = {};
    
    // Build category tree
    if (includeSubcategories) {
      response.categories = buildCategoryTree(products);
    }
    
    // Extract brands
    if (includeBrands) {
      response.brands = extractBrands(filteredProducts);
    }
    
    // Get price ranges
    if (includePriceRanges) {
      response.priceRanges = getPriceRanges(filteredProducts, category || undefined);
    }
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      ...response,
      meta: {
        response_time_ms: responseTime,
        total_products: products.length,
        filtered_products: filteredProducts.length,
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        'X-Response-Time': `${responseTime}ms`,
      },
    });
  } catch (error) {
    console.error('Error in /api/categories:', error);
    return NextResponse.json(
      { error: 'Failed to load categories' },
      { status: 500 }
    );
  }
}
