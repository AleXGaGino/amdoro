/**
 * Automatic Product Sync Script
 * 
 * Acest script sincronizează automat produsele din feed-urile configurate
 * Rulează: node scripts/auto-sync.js
 * 
 * Pentru sincronizare automată zilnică, adaugă în Windows Task Scheduler
 */

require('dotenv').config({ path: '.env.local' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function autoSync() {
  console.log('🚀 Starting automatic product sync...\n');

  try {
    // Check if dev server is running
    const response = await fetch(`${SITE_URL}/api/auto-sync`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (error.instructions) {
        console.log('⚙️  Configuration needed:\n');
        error.instructions.forEach((instruction, idx) => {
          console.log(`   ${idx + 1}. ${instruction}`);
        });
        console.log('\n📝 Example feed URLs:');
        console.log('   - https://api.2performant.com/feed/emag.csv');
        console.log('   - https://api.2performant.com/feed/fashiondays.csv');
        console.log('   - https://api.2performant.com/feed/altex.csv\n');
      } else {
        throw new Error(error.message || 'Sync failed');
      }
      
      process.exit(1);
    }

    const result = await response.json();
    
    console.log('✅ Sync completed successfully!\n');
    console.log(`📦 Products synced: ${result.count}`);
    console.log(`📊 Categories:`);
    console.log(`   - Electronics: ${result.categories.Electronics}`);
    console.log(`   - Fashion: ${result.categories.Fashion}`);
    console.log(`   - Home: ${result.categories.Home}`);
    console.log(`   - Other: ${result.categories.Other}`);
    console.log(`\n⏰ Timestamp: ${result.timestamp}`);
    console.log(`🔄 Feeds processed: ${result.feeds}\n`);
    console.log('✨ Products are now available on your site!');

  } catch (error) {
    console.error('❌ Auto-sync failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Next.js dev server is running (npm run dev)');
    console.log('2. Configure feed URLs in app/api/auto-sync/route.ts');
    console.log('3. Check your internet connection');
    console.log('4. Verify feed URLs are accessible\n');
    process.exit(1);
  }
}

// Run the sync
autoSync();
