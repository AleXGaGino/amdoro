# Configurare 2Performant API

## Pași pentru Integrare

### 1. Obține Credențialele API

1. Accesează **2Performant Dashboard**: https://account.2performant.com/
2. Mergi la **Settings** → **API Access**
3. Generează un **API Key** (sau folosește cel existent)
4. Salvează următoarele date:
   - **API Key**
   - **Network ID** (găsești în URL-ul dashboard-ului)
   - **Affiliate ID** (ID-ul tău de afiliat)

### 2. Creează Fișierul .env.local

Creează fișierul `.env.local` în rădăcina proiectului:

```env
# 2Performant API Credentials
NEXT_PUBLIC_2PERFORMANT_API_KEY=your_api_key_here
NEXT_PUBLIC_2PERFORMANT_NETWORK_ID=your_network_id
NEXT_PUBLIC_2PERFORMANT_AFFILIATE_ID=your_affiliate_id

# Optional: Cache settings
PRODUCT_CACHE_DURATION=3600000
```

**IMPORTANT**: Nu comite acest fișier în Git! E deja în .gitignore.

### 3. Endpoint-uri API 2Performant

#### Feed-uri Disponibile:
- **Produse XML/CSV**: https://api.2performant.com/feed
- **API REST**: https://api.2performant.com/v1/
- **Deep Links**: Pentru generare link-uri de tracking

#### Documentație Oficială:
- API Docs: https://developers.2performant.com/
- Dashboard: https://account.2performant.com/

### 4. Structura Integrării

```
affiliate-mall/
├── .env.local                    # Credențiale API (nu se commitează)
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   └── route.ts         # Fetch produse de la 2Performant
│   │   ├── refresh-products/
│   │   │   └── route.ts         # Refresh cache produse
│   │   └── go/[id]/
│   │       └── route.ts         # Redirect cu tracking
│   └── lib/
│       ├── 2performant.ts       # Client API 2Performant
│       └── cache.ts             # Cache management
```

### 5. Tipuri de Integrare

#### A. Feed XML/CSV (Simplu, Recomandat pentru început)
- Descarcă feed-ul de produse periodic
- Parsează și salvează în JSON local
- Actualizare: o dată pe zi/oră

#### B. API REST (Avansat)
- Fetch produse în timp real
- Generare deep links automat
- Tracking și statistici live

### 6. Comenzi Utile

```bash
# Sincronizează produsele o dată
npm run sync-products

# Pornește cron job pentru sincronizare automată
npm run start-sync

# Test API connection
npm run test-api
```

## Următorii Pași

1. ✅ Completează credențialele în `.env.local`
2. ✅ Rulează script-ul de sincronizare
3. ✅ Verifică produsele în `data/products.json`
4. ✅ Testează site-ul cu produse reale

## Securitate

- **API Key** trebuie păstrat secret
- Folosește variabile de mediu (`.env.local`)
- Nu expune niciodată API key-ul în frontend
- Toate request-urile către 2Performant se fac server-side

## Suport

- 2Performant Support: support@2performant.com
- Developer Docs: https://developers.2performant.com/
- Dashboard: https://account.2performant.com/
