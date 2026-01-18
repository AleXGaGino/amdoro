# 📘 GHID DE IMPLEMENTARE - Amdoro.ro E-commerce Architecture

## Cuprins
1. [Setup Inițial](#setup-inițial)
2. [Configurare Bază de Date](#configurare-bază-de-date)
3. [Import Feed-uri](#import-feed-uri)
4. [API & Frontend](#api--frontend)
5. [SEO & Indexare](#seo--indexare)
6. [Monitoring & Optimizare](#monitoring--optimizare)

---

## Setup Inițial

### Cerințe Tehnice
- **Server:** VPS/Cloud cu minimum 8GB RAM, 4 CPU cores
- **Database:** PostgreSQL 14+ (optimizat pentru full-text search)
- **Cache:** Redis 6+ (pentru query caching)
- **Node.js:** v18+ (pentru Next.js frontend)
- **Python:** 3.10+ (pentru feed processing)

### Stack Tehnologic
```
Frontend: Next.js 16 + React 19 + Tailwind CSS
Backend API: FastAPI (Python) sau Next.js API Routes
Database: PostgreSQL cu indexuri optimizate
Cache: Redis
CDN: CloudFlare / Bunny CDN
```

---

## Configurare Bază de Date

### 1. Creează baza de date PostgreSQL
```bash
# Linux/Mac
sudo -u postgres psql
CREATE DATABASE amdoro;
CREATE USER amdoro_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE amdoro TO amdoro_user;
\q

# Windows (folosind pgAdmin sau psql.exe)
psql -U postgres
CREATE DATABASE amdoro;
```

### 2. Rulează schema SQL
```bash
psql -U amdoro_user -d amdoro -f database/schema.sql
```

### 3. Verifică indexurile create
```sql
-- Connect la DB
psql -U amdoro_user -d amdoro

-- Check indexes
SELECT tablename, indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'products';

-- Test full-text search performance
EXPLAIN ANALYZE
SELECT * FROM products 
WHERE to_tsvector('romanian', title) @@ to_tsquery('romanian', 'laptop')
LIMIT 10;
```

### 4. Populează categoriile
```sql
-- Insert categorii principale
INSERT INTO categories (amdoro_id, name, slug, level, display_order) VALUES
('cat-001', 'Electronice & IT', 'electronice-it', 1, 1),
('cat-002', 'Moda & Îmbrăcăminte', 'moda-imbracaminte', 1, 2),
('cat-003', 'Casa & Grădina', 'casa-gradina', 1, 3),
('cat-004', 'Electrocasnice', 'electrocasnice', 1, 4),
('cat-005', 'Sport & Fitness', 'sport-fitness', 1, 5),
('cat-006', 'Frumusețe & Sănătate', 'frumusete-sanatate', 1, 6),
('cat-007', 'Jucării & Copii', 'jucarii-copii', 1, 7),
('cat-008', 'Cărți & Media', 'carti-media', 1, 8),
('cat-009', 'Auto & Moto', 'auto-moto', 1, 9),
('cat-010', 'Pet Shop', 'pet-shop', 1, 10);

-- Insert subcategorii (exemplu pentru Electronice)
INSERT INTO categories (amdoro_id, parent_id, name, slug, level) VALUES
('cat-001-01', 1, 'Laptopuri & Calculatoare', 'laptopuri-calculatoare', 2),
('cat-001-02', 1, 'Telefoane & Tablete', 'telefoane-tablete', 2),
('cat-001-03', 1, 'Audio & Video', 'audio-video', 2);

-- Repeat pentru alte categorii...
```

---

## Import Feed-uri

### 1. Configurare Feed Credentials

Creează fișier `.env`:
```bash
# Database
DATABASE_URL=postgresql://amdoro_user:secure_password@localhost/amdoro
REDIS_URL=redis://localhost:6379/0

# Feed URLs (obține din dashboard-urile afiliate)
PROFITSHARE_FEED_URL=https://export.profitshare.ro/feed/your-feed-id.csv
PROFITSHARE_API_KEY=your_api_key

TPERFORMANT_FEED_URL=https://api.2performant.com/feed/your-unique-id.xml
TPERFORMANT_API_KEY=your_api_key

# Amazon (optional - dacă ai acces)
AMAZON_FEED_URL=https://...
AMAZON_ACCESS_KEY=...
```

### 2. Instalează dependențe Python
```bash
cd scripts/
pip install -r requirements.txt
```

Creează `requirements.txt`:
```
asyncio
aiohttp
pandas
sqlalchemy
psycopg2-binary
redis
python-dotenv
lxml
unidecode
```

### 3. Rulează primul import
```bash
# Import inițial (durează ~10-15 minute pentru 300k produse)
python scripts/feed_importer.py

# Verifică rezultatele
psql -U amdoro_user -d amdoro -c "SELECT COUNT(*) FROM products;"
```

### 4. Setup Cron pentru sincronizare zilnică
```bash
# Editează crontab
crontab -e

# Adaugă job pentru sincronizare la 3:00 AM
0 3 * * * cd /path/to/affiliate-mall && python scripts/feed_importer.py >> logs/feed_import.log 2>&1
```

---

## API & Frontend

### 1. Pornește API-ul FastAPI (optional)
```bash
cd api/
pip install fastapi uvicorn redis sqlalchemy psycopg2-binary

# Run API
uvicorn search_api:app --host 0.0.0.0 --port 8000 --workers 4
```

### 2. Configurează Next.js pentru a folosi PostgreSQL direct

Instalează dependințe:
```bash
npm install pg redis
```

Creează `lib/database.ts`:
```typescript
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function searchProducts(params: any) {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, title, slug, brand, price_cents, image_url
      FROM products
      WHERE is_active = true
      ${params.category ? 'AND category_id = $1' : ''}
      LIMIT 36
    `;
    const result = await client.query(query, params.category ? [params.category] : []);
    return result.rows;
  } finally {
    client.release();
  }
}
```

### 3. Actualizează API Routes în Next.js

`app/api/products/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/database';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  
  try {
    const products = await searchProducts({ category, brand });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
```

---

## SEO & Indexare

### 1. Generare Sitemap Dinamic

Creează `scripts/generate_sitemap.py`:
```python
from sqlalchemy import create_engine, text
import xml.etree.ElementTree as ET
from datetime import datetime

engine = create_engine('postgresql://amdoro_user:password@localhost/amdoro')

def generate_sitemap_tier1():
    """Generate high-priority products sitemap"""
    with engine.connect() as conn:
        results = conn.execute(text("""
            SELECT slug, updated_at 
            FROM products 
            WHERE is_active = true AND indexation_priority >= 8
            ORDER BY indexation_priority DESC
            LIMIT 10000
        """))
        
        urlset = ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
        
        for row in results:
            url = ET.SubElement(urlset, 'url')
            ET.SubElement(url, 'loc').text = f'https://amdoro.ro/p/{row[0]}'
            ET.SubElement(url, 'lastmod').text = row[1].strftime('%Y-%m-%d')
            ET.SubElement(url, 'priority').text = '0.8'
            ET.SubElement(url, 'changefreq').text = 'daily'
        
        tree = ET.ElementTree(urlset)
        tree.write('public/sitemap-products-tier1.xml', encoding='utf-8', xml_declaration=True)

# Run
generate_sitemap_tier1()
```

Adaugă la cron:
```bash
0 2 * * * cd /path/to/affiliate-mall && python scripts/generate_sitemap.py
```

### 2. Robots.txt

Creează `public/robots.txt`:
```
User-agent: *
Allow: /

# Permit crawling categorii
Allow: /electronice-it/
Allow: /moda-imbracaminte/

# Blochează filtrări complexe
Disallow: /*?*&*
Disallow: /*?pret=
Disallow: /*?sort=

# Permite branduri importante
Allow: /*?brand=apple*
Allow: /*?brand=samsung*

Disallow: /api/
Disallow: /_next/

Sitemap: https://amdoro.ro/sitemap.xml
Sitemap: https://amdoro.ro/sitemap-products-tier1.xml
```

### 3. Structured Data (JSON-LD)

În `app/components/ProductPage.tsx`:
```typescript
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.title,
  "image": product.image_url,
  "description": product.description,
  "brand": {
    "@type": "Brand",
    "name": product.brand
  },
  "offers": {
    "@type": "Offer",
    "url": `https://amdoro.ro/p/${product.slug}`,
    "priceCurrency": "RON",
    "price": product.price,
    "availability": product.in_stock 
      ? "https://schema.org/InStock" 
      : "https://schema.org/OutOfStock"
  }
};

// În component
<script 
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
/>
```

---

## Monitoring & Optimizare

### 1. Setup Query Performance Monitoring

Instalează `pg_stat_statements`:
```sql
-- În PostgreSQL
CREATE EXTENSION pg_stat_statements;

-- Verifică slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

### 2. Redis Monitoring
```bash
redis-cli

# Check memory usage
INFO memory

# Check hit rate
INFO stats
```

### 3. Application Performance Monitoring

Instalează Sentry:
```bash
npm install @sentry/nextjs

# Configurează în next.config.js
```

### 4. Optimizări Database

```sql
-- Vacuum automat (lunar)
VACUUM ANALYZE products;

-- Reindex pentru performanță
REINDEX TABLE products;

-- Update statistics pentru query planner
ANALYZE products;
```

### 5. CDN Setup pentru imagini

Configurează CloudFlare sau Bunny CDN:
```typescript
// În next.config.js
module.exports = {
  images: {
    domains: ['cdn.amdoro.ro', 'bunnycdn.com'],
    loader: 'cloudinary', // sau custom loader
  }
}
```

---

## Checklist Lansare

- [ ] Database setup complet cu toate indexurile
- [ ] Import feed-uri funcțional (test cu 1000 produse)
- [ ] Categorii populate în DB
- [ ] API endpoint-uri testate (< 200ms response time)
- [ ] Frontend conectat la DB/API
- [ ] Sitemap.xml generat
- [ ] Robots.txt configurat
- [ ] Structured Data implementat
- [ ] CDN configurat pentru imagini
- [ ] Redis cache funcțional
- [ ] Cron jobs setup pentru:
  - [ ] Feed sync zilnic
  - [ ] Sitemap regenerare
  - [ ] Cleanup produse discontinued
- [ ] SSL certificate instalat
- [ ] Google Analytics / Tag Manager
- [ ] Google Search Console verificat
- [ ] Backup automat database (zilnic)
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring (New Relic / DataDog)

---

## Support & Resources

- **Documentație PostgreSQL Full-Text Search:** https://www.postgresql.org/docs/current/textsearch.html
- **Next.js 16 Docs:** https://nextjs.org/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Redis Best Practices:** https://redis.io/topics/optimization

Pentru întrebări sau suport tehnic, consultă documentația în `docs/` sau contactează echipa de dezvoltare.
