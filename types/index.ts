// TypeScript Types pentru Amdoro Architecture
// Based on database/schema.sql

export interface Product {
  id: number;
  feed_product_id: string;
  feed_source: 'profitshare' | '2performant' | 'amazon' | 'json';
  amdoro_sku?: string;
  
  // Basic info
  title: string;
  slug: string;
  brand?: string;
  model?: string;
  ean?: string;
  
  // Categorization
  category_id?: number;
  feed_category_original?: string;
  
  // Pricing (in cents for precision)
  price_cents: number;
  old_price_cents?: number;
  discount_percent?: number;
  
  // Description & SEO
  description?: string;
  description_enriched?: string;
  short_description?: string;
  meta_title?: string;
  meta_description?: string;
  h1_title?: string;
  
  // Images
  image_url: string;
  images_additional?: string[];
  
  // Affiliate
  affiliate_link: string;
  affiliate_network?: string;
  commission_percent?: number;
  
  // Specifications
  specifications?: Record<string, string>;
  attributes?: Record<string, string>;
  
  // Stock & Availability
  in_stock: boolean;
  stock_status: 'in_stock' | 'out_of_stock' | 'preorder';
  availability_date?: Date;
  
  // Analytics
  views_count: number;
  clicks_count: number;
  conversions_count: number;
  revenue_total_cents: number;
  
  // SEO & Indexation
  is_indexed: boolean;
  indexation_priority: number; // 1-10
  last_indexed_at?: Date;
  
  // Lifecycle
  is_active: boolean;
  feed_last_seen: Date;
  status: 'active' | 'discontinued' | 'out_of_stock_30d';
  
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  amdoro_id: string;
  parent_id?: number;
  name: string;
  slug: string;
  level: number; // 1=main, 2=subcategory
  display_order: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductSearchParams {
  q?: string; // search query
  category?: string; // category slug
  subcategory?: string;
  brand?: string;
  price_min?: number;
  price_max?: number;
  discount?: boolean;
  in_stock?: boolean;
  sort?: 'relevant' | 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'bestseller';
  page?: number;
  per_page?: number;
  // Faceted filters
  attributes?: Record<string, string[]>;
}

export interface ProductSearchResponse {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
  filters: {
    category?: string;
    brand?: string;
    price_range?: [number, number];
    discount?: boolean;
    in_stock?: boolean;
  };
  available_filters?: {
    brands: Array<{ name: string; count: number }>;
    price_range: { min: number; max: number; avg: number };
    categories: Array<{ slug: string; name: string; count: number }>;
  };
}

export interface CategoryMapping {
  amdoroId: string;
  name: string;
  slug: string;
  feedMappings: {
    profitshare?: string[];
    '2performant'?: string[];
    amazon?: string[];
  };
  subcategories?: Record<string, CategoryMapping>;
}

export interface FacetedSearchConfig {
  filterableAttributes: Record<string, FilterConfig>;
  sortingOptions: Record<string, SortConfig>;
  antiDuplicateRules: Record<string, string>;
  robotsMetaGeneration: RobotsMetaConfig;
}

export interface FilterConfig {
  type: 'multiselect' | 'range' | 'boolean';
  displayName: string;
  indexable: boolean;
  urlParameter: string;
  values?: Array<{ value: string; label: string }>;
  ranges?: Array<{ min: number; max: number; label: string }>;
  priority: number;
}

export interface SortConfig {
  label: string;
  indexable: boolean;
  default?: boolean;
  field?: string;
  direction?: 'ASC' | 'DESC';
  algorithm?: string;
  weights?: Record<string, number>;
}

export interface RobotsMetaConfig {
  algorithm: string;
  conditions: Array<{
    if?: string;
    then?: string;
    default?: string;
  }>;
}

export interface SEOTemplate {
  h1Title: {
    templates: Array<{
      pattern: string;
      example: string;
      useCase?: string;
      priority: number;
    }>;
    maxLength: number;
    fallback: string;
  };
  metaTitle: {
    templates: Array<{
      pattern: string;
      example: string;
      length?: string;
      useCase?: string;
      priority: number;
    }>;
    maxLength: number;
  };
  metaDescription: {
    templates: Array<{
      pattern: string;
      example: string;
      length?: string;
      useCase?: string;
      priority: number;
    }>;
    maxLength: number;
    minLength: number;
  };
}

// Helper type for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Conversion helpers
export const centsToRON = (cents: number): number => cents / 100;
export const ronToCents = (ron: number): number => Math.round(ron * 100);

// Product display type (simplified for frontend)
export interface ProductDisplay {
  id: number;
  title: string;
  slug: string;
  brand?: string;
  price: number; // in RON
  oldPrice?: number;
  discountPercent?: number;
  imageUrl: string;
  categoryName?: string;
  categorySlug?: string;
  inStock: boolean;
  affiliateLink: string;
  cashbackPercent?: number;
}

// Convert DB Product to Display Product
export const toProductDisplay = (product: Product, category?: Category): ProductDisplay => ({
  id: product.id,
  title: product.title,
  slug: product.slug,
  brand: product.brand,
  price: centsToRON(product.price_cents),
  oldPrice: product.old_price_cents ? centsToRON(product.old_price_cents) : undefined,
  discountPercent: product.discount_percent,
  imageUrl: product.image_url,
  categoryName: category?.name,
  categorySlug: category?.slug,
  inStock: product.in_stock,
  affiliateLink: product.affiliate_link,
  cashbackPercent: product.commission_percent,
});
