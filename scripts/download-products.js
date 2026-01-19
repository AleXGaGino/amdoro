#!/usr/bin/env node

/**
 * Download products.json from GitHub Release for Netlify deployment
 * Run this in package.json build script
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Try multiple sources
const DOWNLOAD_SOURCES = [
  // Direct release asset URL (works for public repos)
  'https://github.com/AleXGaGino/amdoro/releases/download/v1.0-data/products.json',
  // GitHub API URL (works for private repos with token, or public without)
  'https://api.github.com/repos/AleXGaGino/amdoro/releases/tags/v1.0-data',
  // Fallback to sample
];

const OUTPUT_PATH = path.join(__dirname, '../data/products.json');
const SAMPLE_PATH = path.join(__dirname, '../data/products.sample.json');

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

function tryDownload(urlIndex = 0) {
  if (urlIndex >= DOWNLOAD_SOURCES.length) {
    console.error('❌ All download sources failed!');
    console.log('\n⚠️  Using sample data for now...');
    
    // Copy sample file as fallback
    if (fs.existsSync(SAMPLE_PATH)) {
      fs.copyFileSync(SAMPLE_PATH, OUTPUT_PATH);
      console.log('✅ Using products.sample.json (1 product for testing)');
      console.log('\n💡 To use real data, upload products.json to GitHub Release:');
      console.log('   1. Go to: https://github.com/AleXGaGino/amdoro/releases/new');
      console.log('   2. Tag: v1.0-data');
      console.log('   3. Upload: data/products.json (155MB)');
      console.log('   4. Publish release');
      console.log('   5. Redeploy on Netlify');
      process.exit(0);
    } else {
      console.log('\n❌ No fallback data available');
      process.exit(1);
    }
  }

  const url = DOWNLOAD_SOURCES[urlIndex];
  console.log(`Trying source ${urlIndex + 1}/${DOWNLOAD_SOURCES.length}: ${url}`);

  // Special handling for GitHub API
  if (url.includes('api.github.com')) {
    https.get(url, {
      headers: {
        'User-Agent': 'Amdoro-Deploy-Script',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const release = JSON.parse(data);
          const asset = release.assets?.find(a => a.name === 'products.json');
          if (asset && asset.browser_download_url) {
            console.log(`  ✓ Found asset, downloading from: ${asset.browser_download_url}`);
            downloadFromUrl(asset.browser_download_url, urlIndex);
          } else {
            console.log(`  ⚠️ Asset not found in release, trying next source...`);
            tryDownload(urlIndex + 1);
          }
        } catch (e) {
          console.log(`  ⚠️ Failed to parse API response, trying next source...`);
          tryDownload(urlIndex + 1);
        }
      });
    }).on('error', () => {
      console.log(`  ⚠️ API request failed, trying next source...`);
      tryDownload(urlIndex + 1);
    });
    return;
  }

  // Regular download
  downloadFromUrl(url, urlIndex);
}

function downloadFromUrl(url, urlIndex) {
  const file = fs.createWriteStream(OUTPUT_PATH);

  https.get(url, (response) => {
    if (response.statusCode === 404) {
      console.log(`  ⚠️ Not found (404), trying next source...`);
      tryDownload(urlIndex + 1);
      return;
    }

    if (response.statusCode === 302 || response.statusCode === 301) {
      // Follow redirect
      https.get(response.headers.location, (redirectResponse) => {
        if (redirectResponse.statusCode !== 200) {
          console.log(`  ⚠️ Redirect failed (${redirectResponse.statusCode}), trying next source...`);
          tryDownload(urlIndex + 1);
          return;
        }

        redirectResponse.pipe(file);
        
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(OUTPUT_PATH);
          if (stats.size < 1000) {
            console.log(`  ⚠️ File too small (${stats.size} bytes), trying next source...`);
            fs.unlinkSync(OUTPUT_PATH);
            tryDownload(urlIndex + 1);
          } else {
            console.log(`✅ Downloaded products.json (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
          }
        });
      }).on('error', () => {
        tryDownload(urlIndex + 1);
      });
    } else if (response.statusCode === 200) {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(OUTPUT_PATH);
        if (stats.size < 1000) {
          console.log(`  ⚠️ File too small (${stats.size} bytes), trying next source...`);
          fs.unlinkSync(OUTPUT_PATH);
          tryDownload(urlIndex + 1);
        } else {
          console.log(`✅ Downloaded products.json (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        }
      });
    } else {
      console.log(`  ⚠️ HTTP ${response.statusCode}, trying next source...`);
      tryDownload(urlIndex + 1);
    }
  }).on('error', (err) => {
    console.log(`  ⚠️ Error: ${err.message}, trying next source...`);
    tryDownload(urlIndex + 1);
  });
}

tryDownload();
