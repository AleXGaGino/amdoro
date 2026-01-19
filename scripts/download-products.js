#!/usr/bin/env node

/**
 * Download products.json from GitHub Release for Netlify deployment
 * Run this in package.json build script
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const GITHUB_RELEASE_URL = 'https://github.com/AleXGaGino/amdoro/releases/download/v1.0-data/products.json';
const OUTPUT_PATH = path.join(__dirname, '../data/products.json');

console.log('📦 Downloading products.json from GitHub Release...');

// Check if file already exists (local development)
if (fs.existsSync(OUTPUT_PATH)) {
  const stats = fs.statSync(OUTPUT_PATH);
  console.log(`✅ products.json already exists (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  process.exit(0);
}

// Ensure data directory exists
const dataDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Download from GitHub Release
const file = fs.createWriteStream(OUTPUT_PATH);

https.get(GITHUB_RELEASE_URL, (response) => {
  if (response.statusCode === 302 || response.statusCode === 301) {
    // Follow redirect
    https.get(response.headers.location, (redirectResponse) => {
      redirectResponse.pipe(file);
      
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(OUTPUT_PATH);
        console.log(`✅ Downloaded products.json (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      });
    }).on('error', (err) => {
      fs.unlinkSync(OUTPUT_PATH);
      console.error('❌ Download error (redirect):', err.message);
      process.exit(1);
    });
  } else {
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      const stats = fs.statSync(OUTPUT_PATH);
      console.log(`✅ Downloaded products.json (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    });
  }
}).on('error', (err) => {
  fs.unlinkSync(OUTPUT_PATH);
  console.error('❌ Download error:', err.message);
  console.log('\n💡 Solution: Upload products.json to GitHub Release first:');
  console.log('   1. Go to: https://github.com/AleXGaGino/amdoro/releases/new');
  console.log('   2. Tag: v1.0-data');
  console.log('   3. Upload: data/products.json');
  console.log('   4. Publish release');
  process.exit(1);
});
