/**
 * 2Performant API Client
 * Handles all interactions with 2Performant API
 */

interface Product2P {
  id: string;
  name: string;
  price: string;
  currency: string;
  image: string;
  url: string;
  category: string;
  merchant: string;
  description?: string;
  availability?: string;
}

interface ProductResponse {
  products: Product2P[];
  total: number;
}

interface AffiliateProgram {
  id: number;
  name: string;
  slug: string;
  status: string;
  main_url?: string;
  product_feeds_count?: number;
  products_count?: number;
  category?: {
    name: string;
  };
}

export class TwoPerformantClient {
  private apiKey: string;
  private networkId: string;
  private affCode: string;
  private email: string;
  private password: string;
  private baseUrl = 'https://api.2performant.com';
  private sessionTokens: {
    accessToken?: string;
    client?: string;
    uid?: string;
  } = {};

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_2PERFORMANT_API_KEY || '';
    this.networkId = process.env.NEXT_PUBLIC_2PERFORMANT_NETWORK_ID || '';
    this.affCode = process.env.NEXT_PUBLIC_2PERFORMANT_AFF_CODE || '';
    this.email = process.env.NEXT_PUBLIC_2PERFORMANT_EMAIL || '';
    this.password = process.env.NEXT_PUBLIC_2PERFORMANT_PASSWORD || '';

    if (!this.apiKey || !this.affCode) {
      console.warn('2Performant credentials not configured. Using demo mode.');
    }
  }

  /**
   * Authenticate with 2Performant API using email and password
   * Returns session tokens needed for subsequent requests
   */
  private async authenticate(): Promise<boolean> {
    if (!this.email || !this.password) {
      console.log('⚠️  No email/password configured, skipping authentication');
      return false;
    }

    try {
      console.log('🔐 Authenticating with 2Performant API...');
      
      const response = await fetch(`${this.baseUrl}/users/sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-key': this.apiKey,
        },
        body: JSON.stringify({
          user: {
            email: this.email,
            password: this.password,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Authentication failed: ${response.status}`, errorText);
        return false;
      }

      // Extract session tokens from headers
      this.sessionTokens = {
        accessToken: response.headers.get('access-token') || undefined,
        client: response.headers.get('client') || undefined,
        uid: response.headers.get('uid') || undefined,
      };

      console.log('✅ Authentication successful!');
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  /**
   * Get all affiliate programs the user is enrolled in (accepted status)
   */
  async getAffiliatePrograms(): Promise<AffiliateProgram[]> {
    // First authenticate
    const authenticated = await this.authenticate();
    if (!authenticated) {
      console.log('⚠️  Using fallback - authentication required for real data');
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/affiliate/programs?filter[relation]=accepted&perpage=100`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'access-token': this.sessionTokens.accessToken || '',
          'client': this.sessionTokens.client || '',
          'uid': this.sessionTokens.uid || '',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error ${response.status}:`, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📡 Retrieved ${data.programs?.length || 0} affiliate programs`);
      return data.programs || [];
    } catch (error) {
      console.error('Error fetching affiliate programs:', error);
      return [];
    }
  }

  /**
   * Get product feed from a specific program
   */
  async getProgramFeed(feedUrl: string): Promise<Product2P[]> {
    try {
      const response = await fetch(feedUrl, {
        headers: {
          'User-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Feed error: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('text/csv')) {
        return this.parseCSVFeed(await response.text());
      } else if (contentType.includes('xml')) {
        return this.parseXMLFeed(await response.text());
      }

      return [];
    } catch (error) {
      console.error('Error fetching program feed:', error);
      return [];
    }
  }

  /**
   * Parse CSV feed
   */
  private parseCSVFeed(csv: string): Product2P[] {
    const products: Product2P[] = [];
    const lines = csv.split('\n');
    
    if (lines.length < 2) return products;

    // Get headers
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Parse products
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',');
      const product: any = {};

      headers.forEach((header, index) => {
        product[header] = values[index]?.trim() || '';
      });

      // Map common CSV field names to our interface
      products.push({
        id: product.id || product.product_id || `prod_${i}`,
        name: product.name || product.title || product.product_name || '',
        price: product.price || product.sale_price || '0',
        currency: product.currency || 'RON',
        image: product.image || product.image_url || product.thumbnail || '',
        url: product.url || product.link || product.product_url || '',
        category: product.category || product.categories || 'Other',
        merchant: product.merchant || product.brand || '',
        description: product.description || '',
        availability: product.availability || product.stock || 'in_stock',
      });
    }

    return products;
  }

  /**
   * Parse XML feed
   */
  private parseXMLFeed(xml: string): Product2P[] {
    const products: Product2P[] = [];
    
    // Simple XML parsing for common feed formats
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    const matches = xml.match(itemRegex);

    if (!matches) return products;

    for (const match of matches) {
      const itemXml = match;
      
      const product: Product2P = {
        id: this.extractXMLTag(itemXml, 'id') || this.extractXMLTag(itemXml, 'g:id') || '',
        name: this.extractXMLTag(itemXml, 'title') || this.extractXMLTag(itemXml, 'g:title') || '',
        price: this.extractXMLTag(itemXml, 'price') || this.extractXMLTag(itemXml, 'g:price') || '0',
        currency: 'RON',
        image: this.extractXMLTag(itemXml, 'image_link') || this.extractXMLTag(itemXml, 'g:image_link') || '',
        url: this.extractXMLTag(itemXml, 'link') || this.extractXMLTag(itemXml, 'g:link') || '',
        category: this.extractXMLTag(itemXml, 'category') || this.extractXMLTag(itemXml, 'g:product_type') || 'Other',
        merchant: this.extractXMLTag(itemXml, 'brand') || this.extractXMLTag(itemXml, 'g:brand') || '',
        description: this.extractXMLTag(itemXml, 'description') || this.extractXMLTag(itemXml, 'g:description') || '',
        availability: this.extractXMLTag(itemXml, 'availability') || this.extractXMLTag(itemXml, 'g:availability') || 'in_stock',
      };

      if (product.name && product.url) {
        products.push(product);
      }
    }

    return products;
  }

  /**
   * Extract value from XML tag
   */
  private extractXMLTag(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[(.*?)\\]\\]><\/${tag}>|<${tag}[^>]*>(.*?)<\/${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? (match[1] || match[2] || '').trim() : '';
  }

  /**
   * Generate affiliate tracking link (deep link)
   */
  generateAffiliateLink(productUrl: string): string {
    if (!this.affCode) {
      return productUrl;
    }

    // 2Performant deep link format
    // https://event.2performant.com/events/click?ad_type=quicklink&aff_code=YOUR_CODE&unique=UNIQUE_ID&redirect_to=PRODUCT_URL
    const encodedUrl = encodeURIComponent(productUrl);
    const uniqueId = Date.now().toString();
    
    return `https://event.2performant.com/events/click?ad_type=quicklink&aff_code=${this.affCode}&unique=${uniqueId}&redirect_to=${encodedUrl}`;
  }

  /**
   * Fetch products from 2Performant feed
   * This is a simplified example - adjust based on actual API structure
   */
  async fetchProducts(options: {
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ProductResponse> {
    const { category, limit = 50, offset = 0 } = options;

    try {
      // Note: Adjust this URL based on actual 2Performant API endpoint
      // This is a placeholder - check 2Performant documentation for exact endpoint
      const url = new URL(`${this.baseUrl}/v1/products`);
      url.searchParams.append('api_key', this.apiKey);
      url.searchParams.append('network_id', this.networkId);
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('offset', offset.toString());
      
      if (category) {
        url.searchParams.append('category', category);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Always fetch fresh data
      });

      if (!response.ok) {
        throw new Error(`2Performant API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        products: data.products || [],
        total: data.total || 0,
      };

    } catch (error) {
      console.error('Error fetching products from 2Performant:', error);
      throw error;
    }
  }

  /**
   * Fetch product feed (XML/CSV)
   * Alternative method using feed URL
   */
  async fetchProductFeed(feedUrl: string): Promise<string> {
    try {
      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AffiliateMall/1.0)',
        },
      });

      if (!response.ok) {
        throw new Error(`Feed fetch error: ${response.status}`);
      }

      return await response.text();

    } catch (error) {
      console.error('Error fetching product feed:', error);
      throw error;
    }
  }

  /**
   * Transform 2Performant product to our format
   */
  transformProduct(product: Product2P, index: number): any {
    return {
      id: index + 1,
      title: product.name,
      price: parseFloat(product.price) || 0,
      imageURL: product.image || 'https://via.placeholder.com/400x400?text=No+Image',
      category: this.categorizeProduct(product.category),
      affiliateLink: this.generateAffiliateLink(product.url),
      merchant: product.merchant,
      description: product.description,
      availability: product.availability,
    };
  }

  /**
   * Map 2Performant categories to our categories
   */
  private categorizeProduct(category: string): string {
    const categoryLower = category.toLowerCase();

    if (categoryLower.includes('electronic') || 
        categoryLower.includes('telefon') || 
        categoryLower.includes('laptop') ||
        categoryLower.includes('gadget')) {
      return 'Electronics';
    }

    if (categoryLower.includes('fashion') || 
        categoryLower.includes('imbracaminte') || 
        categoryLower.includes('incaltaminte') ||
        categoryLower.includes('haine')) {
      return 'Fashion';
    }

    if (categoryLower.includes('home') || 
        categoryLower.includes('casa') || 
        categoryLower.includes('bucatarie') ||
        categoryLower.includes('mobilier')) {
      return 'Home';
    }

    return 'Other';
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.fetchProducts({ limit: 1 });
      return true;
    } catch (error) {
      console.error('2Performant API connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const twoPerformantClient = new TwoPerformantClient();
