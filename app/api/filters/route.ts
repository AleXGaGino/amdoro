import { NextRequest, NextResponse } from 'next/server';
import { getAvailableBrands, getPriceRange } from '@/lib/products';

/**
 * GET /api/filters - Obține filtre disponibile pentru o categorie
 * Query params:
 * - category: category slug
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    
    // Get filters in parallel
    const [brands, priceRange] = await Promise.all([
      getAvailableBrands(category),
      getPriceRange(category),
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        brands,
        price_range: priceRange,
        category,
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      }
    });
    
  } catch (error: any) {
    console.error('Filters API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch filters',
    }, { status: 500 });
  }
}
