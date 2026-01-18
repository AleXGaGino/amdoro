import { NextResponse } from 'next/server';
import { twoPerformantClient } from '@/app/lib/2performant';
import fs from 'fs/promises';
import path from 'path';

/**
 * API Route: Sync products from 2Performant
 * GET /api/sync-products
 * 
 * This route fetches products from 2Performant API and saves them to products.json
 */
export async function GET(request: Request) {
  try {
    console.log('Starting product sync from 2Performant...');

    // Fetch products from 2Performant
    const response = await twoPerformantClient.fetchProducts({
      limit: 50, // Adjust based on your needs
    });

    if (!response.products || response.products.length === 0) {
      return NextResponse.json(
        { 
          error: 'No products found from 2Performant',
          message: 'Check your API credentials in .env.local'
        },
        { status: 404 }
      );
    }

    // Transform products to our format
    const products = response.products.map((product, index) => 
      twoPerformantClient.transformProduct(product, index)
    );

    // Save to products.json
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'products.json');

    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });

    // Write products to file
    await fs.writeFile(
      filePath,
      JSON.stringify(products, null, 2),
      'utf-8'
    );

    console.log(`Successfully synced ${products.length} products`);

    return NextResponse.json({
      success: true,
      message: 'Products synced successfully',
      count: products.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error syncing products:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to sync products',
        message: error.message,
        details: 'Make sure your 2Performant API credentials are configured in .env.local'
      },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint for manual trigger with options
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, limit = 50 } = body;

    console.log(`Syncing products: category=${category}, limit=${limit}`);

    const response = await twoPerformantClient.fetchProducts({
      category,
      limit,
    });

    const products = response.products.map((product, index) => 
      twoPerformantClient.transformProduct(product, index)
    );

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'products.json');

    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Products synced successfully',
      count: products.length,
      category: category || 'all',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error in POST sync:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to sync products',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
