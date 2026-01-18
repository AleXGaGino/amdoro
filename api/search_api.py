"""
AMDORO.RO - Fast Product Search API
Optimizat pentru răspunsuri < 200ms
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pydantic import BaseModel
import redis
import json
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import hashlib
from datetime import timedelta

app = FastAPI(title="Amdoro Product Search API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://amdoro.ro", "http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Database & Cache
engine = create_engine('postgresql://user:pass@localhost/amdoro', pool_size=20)
Session = sessionmaker(bind=engine)
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Cache TTL
CACHE_TTL_SEARCH = 300  # 5 minutes
CACHE_TTL_PRODUCT = 3600  # 1 hour
CACHE_TTL_CATEGORY = 600  # 10 minutes


class ProductResponse(BaseModel):
    id: int
    title: str
    slug: str
    brand: Optional[str]
    price: float
    old_price: Optional[float]
    discount_percent: Optional[int]
    image_url: str
    category_name: str
    category_slug: str
    in_stock: bool
    affiliate_link: str


class SearchResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    per_page: int
    filters: dict


def get_cache_key(prefix: str, **kwargs) -> str:
    """Generează cache key unic"""
    key_data = json.dumps(kwargs, sort_keys=True)
    hash_suffix = hashlib.md5(key_data.encode()).hexdigest()[:8]
    return f"{prefix}:{hash_suffix}"


@app.get("/api/products/search", response_model=SearchResponse)
async def search_products(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Category slug"),
    brand: Optional[str] = Query(None, description="Brand name"),
    price_min: Optional[int] = Query(None, description="Min price in RON"),
    price_max: Optional[int] = Query(None, description="Max price in RON"),
    discount: Optional[bool] = Query(None, description="Only discounted products"),
    in_stock: Optional[bool] = Query(True, description="Only in stock"),
    sort: str = Query("relevant", description="Sort by: relevant, price-asc, price-desc, newest, popular"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(36, ge=1, le=100, description="Results per page")
):
    """
    Căutare optimizată de produse
    
    Performance target: < 200ms pentru majoritatea cererilor
    """
    
    # Generate cache key
    cache_key = get_cache_key(
        "search",
        q=q, category=category, brand=brand,
        price_min=price_min, price_max=price_max,
        discount=discount, in_stock=in_stock,
        sort=sort, page=page, per_page=per_page
    )
    
    # Check cache
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    session = Session()
    
    try:
        # Build query
        query = """
            SELECT 
                p.id,
                p.title,
                p.slug,
                p.brand,
                p.price_cents,
                p.old_price_cents,
                p.discount_percent,
                p.image_url,
                p.in_stock,
                p.affiliate_link,
                c.name as category_name,
                c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = true
        """
        
        params = {}
        
        # Full-text search
        if q:
            query += """ AND to_tsvector('romanian', p.title || ' ' || COALESCE(p.brand, '') || ' ' || COALESCE(p.description, ''))
                        @@ plainto_tsquery('romanian', :search_query) """
            params['search_query'] = q
        
        # Category filter
        if category:
            query += " AND c.slug = :category "
            params['category'] = category
        
        # Brand filter
        if brand:
            query += " AND LOWER(p.brand) = LOWER(:brand) "
            params['brand'] = brand
        
        # Price range
        if price_min:
            query += " AND p.price_cents >= :price_min "
            params['price_min'] = price_min * 100
        if price_max:
            query += " AND p.price_cents <= :price_max "
            params['price_max'] = price_max * 100
        
        # Discount filter
        if discount:
            query += " AND p.discount_percent > 0 "
        
        # Stock filter
        if in_stock:
            query += " AND p.in_stock = true "
        
        # Sorting
        if sort == "price-asc":
            query += " ORDER BY p.price_cents ASC"
        elif sort == "price-desc":
            query += " ORDER BY p.price_cents DESC"
        elif sort == "newest":
            query += " ORDER BY p.created_at DESC"
        elif sort == "popular":
            query += " ORDER BY p.views_count DESC, p.clicks_count DESC"
        elif sort == "discount":
            query += " ORDER BY p.discount_percent DESC"
        else:  # relevant
            if q:
                query += """ ORDER BY 
                    ts_rank(to_tsvector('romanian', p.title || ' ' || COALESCE(p.brand, '')), 
                            plainto_tsquery('romanian', :search_query)) DESC,
                    p.views_count DESC
                """
            else:
                query += " ORDER BY p.indexation_priority DESC, p.views_count DESC"
        
        # Pagination
        offset = (page - 1) * per_page
        query += f" LIMIT {per_page} OFFSET {offset}"
        
        # Execute query
        results = session.execute(text(query), params).fetchall()
        
        # Count total (with same filters but without pagination)
        count_query = query.split("ORDER BY")[0].replace(
            "SELECT p.id, p.title, p.slug, p.brand, p.price_cents, p.old_price_cents, p.discount_percent, p.image_url, p.in_stock, p.affiliate_link, c.name as category_name, c.slug as category_slug",
            "SELECT COUNT(*)"
        )
        total = session.execute(text(count_query), params).scalar()
        
        # Format response
        products = [
            ProductResponse(
                id=row[0],
                title=row[1],
                slug=row[2],
                brand=row[3],
                price=row[4] / 100.0,
                old_price=row[5] / 100.0 if row[5] else None,
                discount_percent=row[6],
                image_url=row[7],
                in_stock=row[8],
                affiliate_link=row[9],
                category_name=row[10],
                category_slug=row[11]
            )
            for row in results
        ]
        
        response = SearchResponse(
            products=products,
            total=total,
            page=page,
            per_page=per_page,
            filters={
                "category": category,
                "brand": brand,
                "price_range": [price_min, price_max] if price_min or price_max else None,
                "discount": discount,
                "in_stock": in_stock
            }
        )
        
        # Cache result
        redis_client.setex(
            cache_key,
            CACHE_TTL_SEARCH,
            json.dumps(response.dict())
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()


@app.get("/api/products/{slug}")
async def get_product_by_slug(slug: str):
    """Obține detalii produs după slug"""
    
    cache_key = f"product:{slug}"
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    session = Session()
    
    try:
        result = session.execute(
            text("""
                SELECT 
                    p.id, p.title, p.slug, p.brand, p.model,
                    p.price_cents, p.old_price_cents, p.discount_percent,
                    p.description, p.description_enriched,
                    p.image_url, p.images_additional,
                    p.specifications, p.in_stock, p.affiliate_link,
                    c.name as category_name, c.slug as category_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.slug = :slug AND p.is_active = true
                LIMIT 1
            """),
            {'slug': slug}
        ).fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Increment views
        session.execute(
            text("UPDATE products SET views_count = views_count + 1 WHERE slug = :slug"),
            {'slug': slug}
        )
        session.commit()
        
        product = {
            "id": result[0],
            "title": result[1],
            "slug": result[2],
            "brand": result[3],
            "model": result[4],
            "price": result[5] / 100.0,
            "old_price": result[6] / 100.0 if result[6] else None,
            "discount_percent": result[7],
            "description": result[8],
            "description_enriched": result[9],
            "image_url": result[10],
            "images_additional": result[11],
            "specifications": result[12],
            "in_stock": result[13],
            "affiliate_link": result[14],
            "category_name": result[15],
            "category_slug": result[16]
        }
        
        # Cache
        redis_client.setex(cache_key, CACHE_TTL_PRODUCT, json.dumps(product))
        
        return product
        
    finally:
        session.close()


@app.get("/api/categories")
async def get_categories():
    """Lista toate categoriile"""
    
    cache_key = "categories:all"
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    session = Session()
    
    try:
        results = session.execute(
            text("""
                SELECT id, name, slug, parent_id, level
                FROM categories
                WHERE is_active = true
                ORDER BY display_order, name
            """)
        ).fetchall()
        
        categories = [
            {
                "id": row[0],
                "name": row[1],
                "slug": row[2],
                "parent_id": row[3],
                "level": row[4]
            }
            for row in results
        ]
        
        redis_client.setex(cache_key, CACHE_TTL_CATEGORY, json.dumps(categories))
        
        return categories
        
    finally:
        session.close()


@app.get("/api/filters/{category_slug}")
async def get_available_filters(category_slug: str):
    """
    Obține filtre disponibile pentru o categorie
    (branduri, price ranges, etc.)
    """
    
    cache_key = f"filters:{category_slug}"
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    session = Session()
    
    try:
        # Get brands
        brands = session.execute(
            text("""
                SELECT DISTINCT p.brand, COUNT(*) as count
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE c.slug = :category AND p.is_active = true AND p.brand IS NOT NULL
                GROUP BY p.brand
                HAVING COUNT(*) >= 3
                ORDER BY count DESC
                LIMIT 50
            """),
            {'category': category_slug}
        ).fetchall()
        
        # Get price range
        price_stats = session.execute(
            text("""
                SELECT 
                    MIN(price_cents) as min_price,
                    MAX(price_cents) as max_price,
                    AVG(price_cents) as avg_price
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE c.slug = :category AND p.is_active = true
            """),
            {'category': category_slug}
        ).fetchone()
        
        filters = {
            "brands": [
                {"name": brand[0], "count": brand[1]}
                for brand in brands
            ],
            "price_range": {
                "min": int(price_stats[0] / 100) if price_stats[0] else 0,
                "max": int(price_stats[1] / 100) if price_stats[1] else 0,
                "avg": int(price_stats[2] / 100) if price_stats[2] else 0
            }
        }
        
        redis_client.setex(cache_key, CACHE_TTL_CATEGORY, json.dumps(filters))
        
        return filters
        
    finally:
        session.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
