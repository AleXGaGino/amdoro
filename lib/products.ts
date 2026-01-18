// Utilitare pentru lucru cu datele JSON existente
// Acest modul transformă products.json în structura nouă

import { Product, ProductDisplay, Category, toProductDisplay } from '@/types';
import categoryMappingConfig from '@/config/category-mapping.json';
import { SUBCATEGORY_RULES } from './categories';

// Cache pentru products.json
let productsCache: any[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Încarcă produsele din products.json cu caching
 */
export async function loadProducts(): Promise<any[]> {
  const now = Date.now();
  
  if (productsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return productsCache;
  }
  
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    productsCache = JSON.parse(fileContent);
    cacheTimestamp = now;
    
    return productsCache || [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

/**
 * Convertește produs din JSON la structura Product
 */
export function convertJsonToProduct(jsonProduct: any): Product {
  // Extract price (handle various formats)
  const price = typeof jsonProduct.price === 'string' 
    ? parseFloat(jsonProduct.price.replace(/[^0-9.]/g, ''))
    : jsonProduct.price || 0;
  
  const priceCents = Math.round(price * 100);
  
  // Extract brand from title if not present
  const brand = jsonProduct.brand || extractBrandFromTitle(jsonProduct.title || jsonProduct.name);
  
  // Map category
  const categoryInfo = mapCategory(jsonProduct.category, 'json');
  
  return {
    id: jsonProduct.id,
    feed_product_id: String(jsonProduct.id),
    feed_source: 'json',
    
    title: jsonProduct.title || jsonProduct.name || 'Produs',
    slug: generateSlug(jsonProduct.title || jsonProduct.name, brand),
    brand,
    model: jsonProduct.model,
    ean: jsonProduct.ean,
    
    category_id: categoryInfo.id,
    feed_category_original: jsonProduct.category,
    
    price_cents: priceCents,
    old_price_cents: undefined,
    discount_percent: 0,
    
    description: jsonProduct.description,
    description_enriched: jsonProduct.description,
    short_description: jsonProduct.description?.substring(0, 200),
    meta_title: generateMetaTitle(jsonProduct.title, brand, price),
    meta_description: generateMetaDescription(jsonProduct.title, brand, price, jsonProduct.description),
    h1_title: `${brand ? brand + ' ' : ''}${jsonProduct.title}`,
    
    image_url: jsonProduct.imageURL || jsonProduct.image_url || '',
    images_additional: [],
    
    affiliate_link: jsonProduct.affiliateLink || jsonProduct.affiliate_link || '#',
    affiliate_network: 'json',
    commission_percent: 5,
    
    specifications: {},
    attributes: {},
    
    in_stock: true,
    stock_status: 'in_stock',
    availability_date: undefined,
    
    views_count: 0,
    clicks_count: 0,
    conversions_count: 0,
    revenue_total_cents: 0,
    
    is_indexed: true,
    indexation_priority: 5,
    last_indexed_at: undefined,
    
    is_active: true,
    feed_last_seen: new Date(),
    status: 'active',
    
    created_at: new Date(),
    updated_at: new Date(),
  };
}

/**
 * Mapează categoria din JSON la structura Amdoro
 */
function mapCategory(jsonCategory: string, source: string = 'json'): { id: number; slug: string; name: string } {
  if (!jsonCategory) {
    return { id: 0, slug: 'diverse', name: 'Diverse' };
  }
  
  const categoryLower = jsonCategory.toLowerCase().trim();
  
  // Simple mapping based on keywords
  const mappings: Record<string, { id: number; slug: string; name: string }> = {
    'electronics': { id: 1, slug: 'electronice-it', name: 'Electronice & IT' },
    'laptops': { id: 1, slug: 'electronice-it/laptopuri-calculatoare', name: 'Laptopuri' },
    'laptop': { id: 1, slug: 'electronice-it/laptopuri-calculatoare', name: 'Laptopuri' },
    'phones': { id: 1, slug: 'electronice-it/telefoane-tablete', name: 'Telefoane' },
    'phone': { id: 1, slug: 'electronice-it/telefoane-tablete', name: 'Telefoane' },
    'fashion': { id: 2, slug: 'moda-imbracaminte', name: 'Moda & Îmbrăcăminte' },
    'clothing': { id: 2, slug: 'moda-imbracaminte', name: 'Moda & Îmbrăcăminte' },
    'home': { id: 3, slug: 'casa-gradina', name: 'Casa & Grădina' },
    'sports': { id: 5, slug: 'sport-fitness', name: 'Sport & Fitness' },
    'books': { id: 8, slug: 'carti-media', name: 'Cărți & Media' },
    'toys': { id: 7, slug: 'jucarii-copii', name: 'Jucării & Copii' },
  };
  
  // Check for keyword matches
  for (const [keyword, mapping] of Object.entries(mappings)) {
    if (categoryLower.includes(keyword)) {
      return mapping;
    }
  }
  
  return { id: 0, slug: 'diverse', name: 'Diverse' };
}

/**
 * Extract brand from title
 */
function extractBrandFromTitle(title: string): string | undefined {
  if (!title) return undefined;
  
  const knownBrands = [
    'Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Oppo', 'Vivo',
    'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Razer',
    'Sony', 'LG', 'Philips', 'Bosch', 'Whirlpool', 'Electrolux',
    'Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour',
    'Zara', 'H&M', 'Mango', 'Bershka',
  ];
  
  const titleUpper = title.toUpperCase();
  
  for (const brand of knownBrands) {
    if (titleUpper.includes(brand.toUpperCase())) {
      return brand;
    }
  }
  
  // Fallback: first word
  return title.split(' ')[0];
}

/**
 * Generate SEO-friendly slug
 */
function generateSlug(title: string, brand?: string): string {
  const full = brand ? `${brand} ${title}` : title;
  
  return full
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

/**
 * Generate meta title
 */
function generateMetaTitle(title: string, brand?: string, price?: number): string {
  const brandPrefix = brand ? `${brand} ` : '';
  const priceStr = price ? ` - ${price.toFixed(0)} RON` : '';
  
  return `${brandPrefix}${title}${priceStr} | Amdoro`.substring(0, 60);
}

/**
 * Generate meta description
 */
function generateMetaDescription(title: string, brand?: string, price?: number, description?: string): string {
  const brandStr = brand ? `${brand} ` : '';
  const priceStr = price ? ` la doar ${price.toFixed(0)} RON` : '';
  const desc = description?.substring(0, 80) || '';
  
  return `${brandStr}${title}${priceStr} pe Amdoro.ro. ${desc} Comandă acum cu livrare rapidă!`.substring(0, 160);
}

/**
 * Search products with filters
 */
export async function searchProducts(params: {
  category?: string;
  subcategory?: string;
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
  const allProducts = await loadProducts();
  
  // Filter RAW JSON first (much faster)
  let filtered = allProducts;
  
  // Filter by category on RAW data
  if (params.category && params.category !== 'All') {
    filtered = filtered.filter(p => {
      const category = p.category || '';
      const categoryLower = category.toLowerCase();
      const searchCategory = params.category!.toLowerCase();
      return categoryLower.includes(searchCategory);
    });
  }
  
  // Filter by subcategory using keyword matching
  if (params.subcategory && params.category && params.category !== 'All') {
    const categoryRules = SUBCATEGORY_RULES[params.category as keyof typeof SUBCATEGORY_RULES];
    if (categoryRules) {
      const subcatRule = categoryRules.find(rule => rule.name === params.subcategory);
      if (subcatRule && subcatRule.keywords.length > 0) {
        filtered = filtered.filter(p => {
          const title = (p.title || p.name || '').toLowerCase();
          return subcatRule.keywords.some(keyword => title.includes(keyword.toLowerCase()));
        });
      }
    }
  }
  
  // Filter by search query on RAW data
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(p => {
      const title = (p.title || p.name || '').toLowerCase();
      const description = (p.description || '').toLowerCase();
      return title.includes(searchLower) || description.includes(searchLower);
    });
  }
  
  // Filter by price range on RAW data
  if (params.minPrice !== undefined) {
    filtered = filtered.filter(p => {
      const price = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : (p.price || 0);
      return price >= params.minPrice!;
    });
  }
  if (params.maxPrice !== undefined) {
    filtered = filtered.filter(p => {
      const price = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : (p.price || 0);
      return price <= params.maxPrice!;
    });
  }
  
  // Calculate pagination BEFORE conversion
  const total = filtered.length;
  const page = params.page || 1;
  const limit = params.limit || 36;
  const start = (page - 1) * limit;
  const end = start + limit;
  const hasMore = end < total;
  
  // ONLY convert the products for current page (36 instead of 307k!)
  const pageProducts = filtered.slice(start, end);
  let convertedProducts = pageProducts.map(convertJsonToProduct);
  
  // Filter by brand (needs converted data) - already small dataset
  if (params.brand) {
    // Note: this might reduce results below limit, but that's acceptable for brand filter
    convertedProducts = convertedProducts.filter(p => 
      p.brand?.toLowerCase() === params.brand!.toLowerCase()
    );
  }
  
  // Sort (only sorting current page, not entire dataset)
  switch (params.sort) {
    case 'price-asc':
      convertedProducts.sort((a, b) => a.price_cents - b.price_cents);
      break;
    case 'price-desc':
      convertedProducts.sort((a, b) => b.price_cents - a.price_cents);
      break;
    case 'newest':
      convertedProducts.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      break;
    case 'popular':
      convertedProducts.sort((a, b) => b.views_count - a.views_count);
      break;
    default:
      // relevant - keep original order
      break;
  }
  
  const products = convertedProducts;
  
  return { products, total, hasMore };
}

/**
 * Get available brands for a category
 */
export async function getAvailableBrands(category?: string): Promise<Array<{ name: string; count: number }>> {
  const allProducts = await loadProducts();
  const converted = allProducts.map(convertJsonToProduct);
  
  let filtered = converted;
  
  if (category && category !== 'All') {
    filtered = converted.filter(p => {
      const categorySlug = mapCategory(p.feed_category_original || '', 'json').slug;
      return categorySlug.includes(category.toLowerCase());
    });
  }
  
  // Count brands
  const brandCounts: Record<string, number> = {};
  
  filtered.forEach(p => {
    if (p.brand) {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    }
  });
  
  return Object.entries(brandCounts)
    .map(([name, count]) => ({ name, count }))
    .filter(b => b.count >= 3) // Minimum 3 products
    .sort((a, b) => b.count - a.count)
    .slice(0, 50); // Top 50 brands
}

/**
 * Get price range for a category
 */
export async function getPriceRange(category?: string): Promise<{ min: number; max: number; avg: number }> {
  const allProducts = await loadProducts();
  const converted = allProducts.map(convertJsonToProduct);
  
  let filtered = converted;
  
  if (category && category !== 'All') {
    filtered = converted.filter(p => {
      const categorySlug = mapCategory(p.feed_category_original || '', 'json').slug;
      return categorySlug.includes(category.toLowerCase());
    });
  }
  
  if (filtered.length === 0) {
    return { min: 0, max: 10000, avg: 0 };
  }
  
  const prices = filtered.map(p => p.price_cents / 100);
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((a, b) => a + b, 0) / prices.length,
  };
}
