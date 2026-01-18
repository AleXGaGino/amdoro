import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, getAvailableBrands, getPriceRange } from '@/lib/products';
import { toProductDisplay } from '@/types';

// Edge runtime pentru performanță maximă
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/products/search - Căutare optimizată cu filtre
 * 
 * Query params:
 * - q: search query
 * - category: category slug
 * - brand: brand name
 * - minPrice: minimum price in RON
 * - maxPrice: maximum price in RON
 * - sort: sorting method
 * - page: page number
 * - limit: results per page
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      search: searchParams.get('search') || searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      sort: searchParams.get('sort') || 'relevant',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '36'),
    };
    
    // Search products
    const { products, total, hasMore } = await searchProducts(params);
    
    // Convert to display format
    const productsDisplay = products.map(p => toProductDisplay(p));
    
    // Get available filters (only if requested for performance)
    const includeFilters = searchParams.get('includeFilters') === 'true';
    let availableFilters;
    
    if (includeFilters) {
      const [brands, priceRange] = await Promise.all([
        getAvailableBrands(params.category),
        getPriceRange(params.category),
      ]);
      
      availableFilters = {
        brands,
        price_range: priceRange,
      };
    }
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      data: {
        products: productsDisplay,
        total,
        page: params.page,
        per_page: params.limit,
        has_more: hasMore,
        filters: {
          category: params.category,
          brand: params.brand,
          price_range: params.minPrice || params.maxPrice 
            ? [params.minPrice || 0, params.maxPrice || 10000]
            : undefined,
          search: params.search,
          sort: params.sort,
        },
        ...(availableFilters && { available_filters: availableFilters }),
      },
      meta: {
        response_time_ms: responseTime,
        cache_hit: false, // TODO: implement Redis caching
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Response-Time': `${responseTime}ms`,
      }
    });
    
  } catch (error: any) {
    console.error('Search API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
