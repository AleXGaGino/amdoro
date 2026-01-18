/**
 * Script pentru sincronizarea produselor de la 2Performant
 * Rulează: node scripts/sync-products.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function syncProducts() {
  console.log('🔄 Starting product sync from 2Performant...\n');

  const apiKey = process.env.NEXT_PUBLIC_2PERFORMANT_API_KEY;
  const networkId = process.env.NEXT_PUBLIC_2PERFORMANT_NETWORK_ID;
  const affiliateId = process.env.NEXT_PUBLIC_2PERFORMANT_AFFILIATE_ID;

  // Check credentials
  if (!apiKey || !networkId || !affiliateId) {
    console.error('❌ Error: 2Performant credentials not found!');
    console.log('\nPlease configure your .env.local file with:');
    console.log('- NEXT_PUBLIC_2PERFORMANT_API_KEY');
    console.log('- NEXT_PUBLIC_2PERFORMANT_NETWORK_ID');
    console.log('- NEXT_PUBLIC_2PERFORMANT_AFFILIATE_ID');
    console.log('\nSee INTEGRARE_2PERFORMANT.md for instructions.');
    process.exit(1);
  }

  try {
    // Call the sync API endpoint
    const response = await fetch('http://localhost:3000/api/sync-products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Sync failed');
    }

    const result = await response.json();
    
    console.log('✅ Sync completed successfully!');
    console.log(`📦 Products synced: ${result.count}`);
    console.log(`⏰ Timestamp: ${result.timestamp}`);
    console.log('\n✨ Products are now available in data/products.json');

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure Next.js dev server is running (npm run dev)');
    console.log('2. Verify your API credentials in .env.local');
    console.log('3. Check 2Performant API status and quotas');
    console.log('4. Review INTEGRARE_2PERFORMANT.md for setup instructions');
    process.exit(1);
  }
}

// Run the sync
syncProducts();
