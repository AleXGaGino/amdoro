import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, getAvailableBrands, getPriceRange } from '@/lib/products';
import { toProductDisplay } from '@/types';

// Optimized with new architecture
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse parameters with backward compatibility
    const params = {
      category: searchParams.get('category') || undefined,
      subcategory: searchParams.get('subcategory') || undefined,
      search: searchParams.get('search') || '',
      brand: searchParams.get('brand') || undefined,
      minPrice: parseFloat(searchParams.get('minPrice') || '0') || undefined,
      maxPrice: parseFloat(searchParams.get('maxPrice') || '999999') || undefined,
      sort: searchParams.get('sort') || 'relevant',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '36'),
    };
    
    // Handle 'All' category as undefined for better filtering
    if (params.category === 'All') {
      params.category = undefined;
    }
    
    // Search products using new architecture
    const { products, total, hasMore } = await searchProducts(params);
    
    // Convert to display format
    const productsDisplay = products.map(p => toProductDisplay(p));
    
    const responseTime = Date.now() - startTime;
    
    // Return format compatible with existing frontend
    return NextResponse.json({
      products: productsDisplay,
      total,
      page: params.page,
      limit: params.limit,
      hasMore,
      // Additional metadata
      meta: {
        response_time_ms: responseTime,
        filters_applied: {
          category: params.category,
          search: params.search,
          brand: params.brand,
          price_range: [params.minPrice, params.maxPrice],
          sort: params.sort,
        }
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=10, stale-while-revalidate=30',
        'X-Response-Time': `${responseTime}ms`,
      }
    });
    
  } catch (error: any) {
    console.error('Products API error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      message: error.message 
    }, { status: 500 });
  }
}
