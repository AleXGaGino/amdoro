-- ============================================
-- AMDORO.RO - SCHEMA BAZĂ DE DATE OPTIMIZATĂ
-- Pentru 300.000+ produse cu căutări sub 200ms
-- ============================================

-- 1. TABEL CATEGORII (Taxonomie)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    amdoro_id VARCHAR(20) UNIQUE NOT NULL, -- cat-001, cat-001-01
    parent_id INTEGER REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    level INTEGER NOT NULL, -- 1=principal, 2=subcategorie
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    meta_title VARCHAR(160),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pentru căutări ierarhice rapide
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_level ON categories(level);

-- ============================================
-- 2. TABEL PRODUSE (Core)
-- ============================================
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    
    -- Identificatori
    feed_product_id VARCHAR(100) NOT NULL, -- ID din feed (2Performant, Profitshare)
    feed_source VARCHAR(50) NOT NULL, -- 'profitshare', '2performant', 'amazon'
    amdoro_sku VARCHAR(100) UNIQUE, -- SKU intern generat
    
    -- Informații de bază
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL, -- brand-nume-produs
    brand VARCHAR(255),
    model VARCHAR(255),
    ean VARCHAR(50),
    
    -- Categorizare
    category_id INTEGER REFERENCES categories(id),
    feed_category_original TEXT, -- Categoria originală din feed
    
    -- Prețuri (în bani - integer pentru precizie)
    price_cents INTEGER NOT NULL, -- Preț în bani (ex: 199900 = 1999.00 RON)
    old_price_cents INTEGER, -- Preț vechi pentru discount
    discount_percent SMALLINT, -- Calculat automat
    
    -- Descriere & SEO
    description TEXT,
    description_enriched TEXT, -- Descriere îmbogățită (nu copiată 100%)
    short_description VARCHAR(500),
    meta_title VARCHAR(160),
    meta_description VARCHAR(320),
    h1_title VARCHAR(200),
    
    -- Imagini
    image_url TEXT NOT NULL,
    images_additional JSONB, -- Array de URL-uri suplimentare
    
    -- Affiliate
    affiliate_link TEXT NOT NULL,
    affiliate_network VARCHAR(50), -- 'profitshare', '2performant', 'amazon'
    commission_percent DECIMAL(5,2),
    
    -- Specificații (JSONB pentru flexibilitate)
    specifications JSONB, -- {"RAM": "16GB", "Storage": "512GB SSD"}
    attributes JSONB, -- Atribute pentru filtrare
    
    -- Stocuri & Disponibilitate
    in_stock BOOLEAN DEFAULT true,
    stock_status VARCHAR(50), -- 'in_stock', 'out_of_stock', 'preorder'
    availability_date TIMESTAMP,
    
    -- Tracking & Analytics
    views_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    conversions_count INTEGER DEFAULT 0,
    revenue_total_cents BIGINT DEFAULT 0,
    
    -- SEO & Indexare
    is_indexed BOOLEAN DEFAULT false, -- Trimis în sitemap
    indexation_priority SMALLINT DEFAULT 5, -- 1-10 (10 = prioritate maximă)
    last_indexed_at TIMESTAMP,
    
    -- Managementul ciclului de viață
    is_active BOOLEAN DEFAULT true,
    feed_last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ultima dată când a apărut în feed
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'discontinued', 'out_of_stock_30d'
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint pentru unicitate per feed
    UNIQUE(feed_source, feed_product_id)
);

-- ============================================
-- INDEXURI CRITICE pentru performanță <200ms
-- ============================================

-- Index compus pentru căutări full-text
CREATE INDEX idx_products_search ON products USING GIN(
    to_tsvector('romanian', 
        COALESCE(title, '') || ' ' || 
        COALESCE(brand, '') || ' ' || 
        COALESCE(model, '') || ' ' ||
        COALESCE(description, '')
    )
);

-- Index pentru filtrare după categorie + preț
CREATE INDEX idx_products_category_price ON products(category_id, price_cents) 
    WHERE is_active = true;

-- Index pentru filtrare după brand
CREATE INDEX idx_products_brand ON products(brand) WHERE is_active = true;

-- Index pentru prețuri (range queries)
CREATE INDEX idx_products_price_range ON products(price_cents) WHERE is_active = true;

-- Index pentru discount-uri
CREATE INDEX idx_products_discounts ON products(discount_percent) 
    WHERE discount_percent > 0 AND is_active = true;

-- Index pentru popularitate (sorting)
CREATE INDEX idx_products_popularity ON products(views_count DESC, clicks_count DESC) 
    WHERE is_active = true;

-- Index pentru produse noi
CREATE INDEX idx_products_recent ON products(created_at DESC) WHERE is_active = true;

-- Index pentru JSONB specifications (filtrare avansată)
CREATE INDEX idx_products_specifications ON products USING GIN(specifications);
CREATE INDEX idx_products_attributes ON products USING GIN(attributes);

-- Index pentru slug (URL lookup)
CREATE INDEX idx_products_slug ON products(slug) WHERE is_active = true;

-- Index pentru managementul stocurilor
CREATE INDEX idx_products_feed_tracking ON products(feed_last_seen, status);

-- Index pentru prioritate indexare SEO
CREATE INDEX idx_products_seo_priority ON products(indexation_priority DESC, is_indexed);

-- ============================================
-- 3. TABEL BRANDS (pentru filtrare optimizată)
-- ============================================
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    products_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brands_slug ON brands(slug);

-- ============================================
-- 4. TABEL ATTRIBUTES (pentru Faceted Search)
-- ============================================
CREATE TABLE product_attributes (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    attribute_name VARCHAR(100) NOT NULL, -- 'RAM', 'Culoare', 'Mărime'
    attribute_value VARCHAR(255) NOT NULL,
    attribute_type VARCHAR(50), -- 'spec', 'filter', 'variant'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pentru filtrare rapidă
CREATE INDEX idx_product_attributes_lookup ON product_attributes(attribute_name, attribute_value);
CREATE INDEX idx_product_attributes_product ON product_attributes(product_id);

-- ============================================
-- 5. TABEL URL REDIRECTS (pentru produse șterse)
-- ============================================
CREATE TABLE url_redirects (
    id SERIAL PRIMARY KEY,
    old_url VARCHAR(500) UNIQUE NOT NULL,
    new_url VARCHAR(500),
    redirect_type SMALLINT DEFAULT 301, -- 301, 302, 404, 410
    reason VARCHAR(100), -- 'product_discontinued', 'out_of_stock', 'category_merged'
    redirect_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP
);

CREATE INDEX idx_url_redirects_old_url ON url_redirects(old_url);

-- ============================================
-- 6. TABEL SITEMAP ENTRIES (pentru indexare)
-- ============================================
CREATE TABLE sitemap_entries (
    id BIGSERIAL PRIMARY KEY,
    url VARCHAR(500) UNIQUE NOT NULL,
    url_type VARCHAR(50) NOT NULL, -- 'product', 'category', 'page'
    priority DECIMAL(2,1) DEFAULT 0.5, -- 0.0 - 1.0
    changefreq VARCHAR(20) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
    lastmod TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    in_sitemap BOOLEAN DEFAULT true,
    sitemap_file VARCHAR(100), -- 'sitemap-products-1.xml'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sitemap_type_priority ON sitemap_entries(url_type, priority DESC);
CREATE INDEX idx_sitemap_file ON sitemap_entries(sitemap_file) WHERE in_sitemap = true;

-- ============================================
-- 7. VIEW pentru căutări rapide
-- ============================================
CREATE MATERIALIZED VIEW products_search_view AS
SELECT 
    p.id,
    p.slug,
    p.title,
    p.brand,
    p.price_cents,
    p.discount_percent,
    p.image_url,
    p.in_stock,
    c.slug as category_slug,
    c.name as category_name,
    p.views_count,
    p.clicks_count,
    to_tsvector('romanian', 
        COALESCE(p.title, '') || ' ' || 
        COALESCE(p.brand, '') || ' ' || 
        COALESCE(p.model, '') || ' ' ||
        COALESCE(p.description, '')
    ) as search_vector
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true;

-- Index pentru search view
CREATE INDEX idx_products_search_view_vector ON products_search_view USING GIN(search_vector);
CREATE INDEX idx_products_search_view_category ON products_search_view(category_slug);

-- Refresh automat al view-ului (executat periodic)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY products_search_view;

-- ============================================
-- 8. FUNCȚIE pentru actualizare automate
-- ============================================

-- Trigger pentru actualizare timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicare trigger pe tabele
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pentru calculare discount automat
CREATE OR REPLACE FUNCTION calculate_discount()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.old_price_cents IS NOT NULL AND NEW.old_price_cents > NEW.price_cents THEN
        NEW.discount_percent := ROUND(((NEW.old_price_cents - NEW.price_cents)::DECIMAL / NEW.old_price_cents * 100));
    ELSE
        NEW.discount_percent := 0;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_product_discount BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION calculate_discount();

-- ============================================
-- 9. QUERIES EXEMPLE pentru teste de performanță
-- ============================================

-- Query 1: Căutare full-text cu filtre (target: <50ms)
/*
EXPLAIN ANALYZE
SELECT id, title, brand, price_cents, image_url, slug
FROM products_search_view
WHERE search_vector @@ to_tsquery('romanian', 'laptop & dell')
    AND category_slug = 'laptopuri-calculatoare'
    AND price_cents BETWEEN 150000 AND 400000
ORDER BY views_count DESC
LIMIT 36;
*/

-- Query 2: Filtrare pe mai multe atribute (target: <100ms)
/*
EXPLAIN ANALYZE
SELECT DISTINCT p.id, p.title, p.price_cents
FROM products p
INNER JOIN product_attributes pa1 ON p.id = pa1.product_id
INNER JOIN product_attributes pa2 ON p.id = pa2.product_id
WHERE p.category_id = 1
    AND pa1.attribute_name = 'RAM' AND pa1.attribute_value = '16GB'
    AND pa2.attribute_name = 'Storage' AND pa2.attribute_value LIKE '%SSD%'
    AND p.is_active = true
LIMIT 36;
*/

-- Query 3: Produse populare într-o categorie (target: <30ms)
/*
EXPLAIN ANALYZE
SELECT id, title, price_cents, views_count
FROM products
WHERE category_id = 1
    AND is_active = true
ORDER BY views_count DESC, clicks_count DESC
LIMIT 36;
*/

-- ============================================
-- 10. COMENZI DE MENTENANȚĂ
-- ============================================

-- Actualizare statistici pentru optimizer
-- ANALYZE products;
-- ANALYZE product_attributes;

-- Vacuum pentru curățare
-- VACUUM ANALYZE products;

-- Reindex pentru performanță
-- REINDEX TABLE products;
