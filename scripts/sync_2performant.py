"""
Script Python pentru parsarea feed-ului XML/CSV de la 2Performant
și convertirea către formatul JSON al site-ului.

Instalare dependințe:
pip install requests xmltodict python-dotenv

Rulare:
python scripts/sync_2performant.py
"""

import os
import json
import csv
import requests
import xmltodict
from datetime import datetime
from dotenv import load_dotenv
from urllib.parse import quote

# Load environment variables
load_dotenv('.env.local')

class TwoPerformantSync:
    def __init__(self):
        self.api_key = os.getenv('NEXT_PUBLIC_2PERFORMANT_API_KEY')
        self.network_id = os.getenv('NEXT_PUBLIC_2PERFORMANT_NETWORK_ID')
        self.aff_code = os.getenv('NEXT_PUBLIC_2PERFORMANT_AFF_CODE')
        
        if not all([self.api_key, self.aff_code]):
            raise ValueError("Missing 2Performant credentials in .env.local")
    
    def generate_affiliate_link(self, product_url):
        """Generate 2Performant tracking link"""
        encoded_url = quote(product_url, safe='')
        unique_id = str(int(datetime.now().timestamp() * 1000))
        
        return f"https://event.2performant.com/events/click?ad_type=quicklink&aff_code={self.aff_code}&unique={unique_id}&redirect_to={encoded_url}"
    
    def categorize_product(self, category):
        """Map 2Performant categories to our categories"""
        category_lower = category.lower()
        
        electronics_keywords = ['electronic', 'telefon', 'laptop', 'gadget', 'calculator', 'tv']
        fashion_keywords = ['fashion', 'imbracaminte', 'incaltaminte', 'haine', 'pantofi', 'bluza']
        home_keywords = ['home', 'casa', 'bucatarie', 'mobilier', 'decoratiuni', 'electrocasnice']
        
        if any(keyword in category_lower for keyword in electronics_keywords):
            return 'Electronics'
        elif any(keyword in category_lower for keyword in fashion_keywords):
            return 'Fashion'
        elif any(keyword in category_lower for keyword in home_keywords):
            return 'Home'
        else:
            return 'Other'
    
    def parse_xml_feed(self, feed_url):
        """Parse XML product feed"""
        print(f"📥 Downloading XML feed from: {feed_url}")
        
        response = requests.get(feed_url, timeout=30)
        response.raise_for_status()
        
        data = xmltodict.parse(response.content)
        products = []
        
        # Adjust based on actual XML structure
        items = data.get('rss', {}).get('channel', {}).get('item', [])
        
        if not isinstance(items, list):
            items = [items]
        
        for index, item in enumerate(items, 1):
            try:
                product_url = item.get('link', '')
                
                product = {
                    'id': index,
                    'title': item.get('title', 'Unknown Product'),
                    'price': float(item.get('price', '0').replace(',', '.')),
                    'imageURL': item.get('image_link', 'https://via.placeholder.com/400'),
                    'category': self.categorize_product(item.get('product_type', 'Other')),
                    'affiliateLink': self.generate_affiliate_link(product_url),
                    'merchant': item.get('brand', ''),
                    'description': item.get('description', '')[:200]  # Limit description
                }
                
                products.append(product)
                
            except Exception as e:
                print(f"⚠️  Warning: Could not parse product {index}: {e}")
                continue
        
        return products
    
    def parse_csv_feed(self, feed_url):
        """Parse CSV product feed"""
        print(f"📥 Downloading CSV feed from: {feed_url}")
        
        response = requests.get(feed_url, timeout=30)
        response.raise_for_status()
        
        # Save temporarily
        with open('temp_feed.csv', 'wb') as f:
            f.write(response.content)
        
        products = []
        
        with open('temp_feed.csv', 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            for index, row in enumerate(reader, 1):
                try:
                    product_url = row.get('URL', row.get('link', ''))
                    
                    product = {
                        'id': index,
                        'title': row.get('Title', row.get('name', 'Unknown Product')),
                        'price': float(row.get('Price', '0').replace(',', '.').replace(' RON', '')),
                        'imageURL': row.get('Image_URL', row.get('image', 'https://via.placeholder.com/400')),
                        'category': self.categorize_product(row.get('Category', 'Other')),
                        'affiliateLink': self.generate_affiliate_link(product_url),
                        'merchant': row.get('Brand', row.get('merchant', '')),
                        'description': row.get('Description', '')[:200]
                    }
                    
                    products.append(product)
                    
                except Exception as e:
                    print(f"⚠️  Warning: Could not parse product {index}: {e}")
                    continue
        
        # Cleanup
        os.remove('temp_feed.csv')
        
        return products
    
    def save_products(self, products, output_file='data/products.json'):
        """Save products to JSON file"""
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Successfully saved {len(products)} products to {output_file}")
    
    def sync(self, feed_url, feed_type='csv'):
        """Main sync method"""
        print(f"🚀 Starting 2Performant sync...")
        print(f"Feed URL: {feed_url}")
        print(f"Feed Type: {feed_type.upper()}\n")
        
        try:
            if feed_type.lower() == 'xml':
                products = self.parse_xml_feed(feed_url)
            else:
                products = self.parse_csv_feed(feed_url)
            
            # Filter out products without images or invalid prices
            products = [p for p in products if p['imageURL'] and p['price'] > 0]
            
            self.save_products(products)
            
            print(f"\n📊 Sync Statistics:")
            print(f"   Total products: {len(products)}")
            print(f"   Electronics: {len([p for p in products if p['category'] == 'Electronics'])}")
            print(f"   Fashion: {len([p for p in products if p['category'] == 'Fashion'])}")
            print(f"   Home: {len([p for p in products if p['category'] == 'Home'])}")
            print(f"   Other: {len([p for p in products if p['category'] == 'Other'])}")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Sync failed: {e}")
            return False


if __name__ == '__main__':
    # Example usage
    print("=" * 60)
    print("2Performant Product Sync")
    print("=" * 60 + "\n")
    
    # Get feed URL from user or use default
    feed_url = input("Enter your 2Performant feed URL (or press Enter to skip): ").strip()
    
    if not feed_url:
        print("\n⚠️  No feed URL provided.")
        print("You need to get your product feed URL from 2Performant dashboard.")
        print("\nSteps:")
        print("1. Go to https://account.2performant.com/")
        print("2. Navigate to 'Campaigns' → Select a campaign")
        print("3. Look for 'Product Feed' or 'XML/CSV Feed'")
        print("4. Copy the feed URL")
        print("\nExample URL format:")
        print("https://api.2performant.com/feed/[network_id]/[campaign_id]?format=csv")
        exit(0)
    
    # Detect feed type
    feed_type = 'xml' if '.xml' in feed_url or 'format=xml' in feed_url else 'csv'
    
    try:
        syncer = TwoPerformantSync()
        success = syncer.sync(feed_url, feed_type)
        
        if success:
            print("\n✨ Sync completed! Your products are ready to use.")
            print("Restart your Next.js server to see the new products.")
        
    except ValueError as e:
        print(f"\n❌ Configuration error: {e}")
        print("Please check your .env.local file.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
