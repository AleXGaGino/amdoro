# 🚀 Deployment pe Netlify - Ghid Complet

## 📋 Pregătire

### Pas 1: Upload products.json pe GitHub Release

Deoarece `products.json` (155MB) e prea mare pentru git, îl urcăm ca Release Asset:

1. **Mergi la**: https://github.com/AleXGaGino/amdoro/releases/new

2. **Completează**:
   - **Tag version**: `v1.0-data`
   - **Release title**: `Data Release - Products Feed`
   - **Description**: `Contains products.json (307,593 products, 155MB) for deployment`

3. **Upload fișier**:
   - Click pe "Attach binaries by dropping them here or selecting them"
   - Selectează `data/products.json` de pe local
   - Așteaptă upload-ul să se termine

4. **Publish Release** ✅

### Pas 2: Configurare Netlify

1. **Conectează Repository**:
   - Mergi pe [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Selectează "Deploy with GitHub"
   - Autorizează și selectează repo: `AleXGaGino/amdoro`

2. **Build Settings**:
   ```
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables** (opțional pentru viitor):
   ```
   NEXT_PUBLIC_SITE_URL=https://amdoro.netlify.app
   ```

4. **Deploy Site** ✅

## 🔄 Cum funcționează

### La fiecare deploy:

1. **Netlify clonează** repo-ul de pe GitHub (fără products.json)
2. **Rulează `prebuild`**: `node scripts/download-products.js`
   - Descarcă products.json din GitHub Release
   - Îl pune în `data/products.json`
3. **Rulează `build`**: `next build`
   - Next.js build-uiește aplicația
   - products.json e disponibil pentru API-uri
4. **Deploy** pe CDN-ul Netlify ✅

### Script-ul `download-products.js`:

- ✅ Verifică dacă products.json există deja (local dev)
- ✅ Descarcă din GitHub Release dacă lipsește
- ✅ Urmărește redirecturi automat
- ✅ Afișează progres și dimensiune
- ✅ Exit cu error dacă fail (stopează build-ul)

## 📊 Alternative pentru Producție

### Opțiune A: GitHub Release (actual) ✅
**Pro**: 
- Gratis, simplu, funcționează instant
- Fișiere nelimitate în Release
- Download rapid

**Contra**: 
- Manual upload la fiecare update de produse

### Opțiune B: Database (recomandat long-term)
**Migrare la PostgreSQL/Supabase**:
```bash
# Supabase free tier: 500MB database, 2GB bandwidth
# Creează cont pe supabase.com
# Importă products.json în PostgreSQL
# API-urile vor query direct din DB
```

**Pro**:
- Sync automat de produse
- Queries rapide, indexate
- Scalabil la milioane de produse

**Contra**:
- Setup inițial mai complex (deja ai schema.sql pregătit!)

### Opțiune C: Cloudflare R2 (storage)
**Pro**: 
- 10GB gratis pe lună
- Upload/update automat
- CDN global

**Contra**: 
- Necesită API key setup

## 🧪 Testare Locală

Test dacă download-ul funcționează:
```bash
# Șterge products.json local (temporary)
rm data/products.json

# Rulează script-ul
npm run prebuild

# Verifică
ls -lh data/products.json
# Should show: 155MB downloaded
```

## 🔐 Securitate

**Ce e exclus din git** (`.gitignore`):
- ✅ `data/products.json` - 155MB
- ✅ `feed.csv` - feed raw
- ✅ `.env*` - credențiale API
- ✅ `node_modules/` - dependencies
- ✅ `.next/` - build output

**Ce e pe GitHub**:
- ✅ Tot codul sursă (TypeScript, React, API-uri)
- ✅ Configurații (next.config.ts, tsconfig.json)
- ✅ Documentație (README, ghiduri)
- ✅ Scripts (sync, download, etc.)

## 📝 Update Produse în Producție

### Metodă 1: Manual (pentru rare updates)
1. Rulezi local: `npm run sync-products` (descarcă feed-uri noi)
2. Upload new `products.json` pe GitHub Release (același tag `v1.0-data`)
3. Redeploy pe Netlify (Trigger deploy) → va descărca versiunea nouă

### Metodă 2: Automat (recomandat)
**Setup Netlify Build Hook**:
1. Netlify Dashboard → Site settings → Build & deploy → Build hooks
2. Creează hook: `https://api.netlify.com/build_hooks/YOUR_HOOK_ID`
3. GitHub Actions workflow:
   ```yaml
   # .github/workflows/sync-products.yml
   name: Sync Products Daily
   on:
     schedule:
       - cron: '0 2 * * *' # Daily at 2 AM
   jobs:
     sync:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - run: npm install
         - run: npm run sync-products
         - run: gh release upload v1.0-data data/products.json --clobber
         - run: curl -X POST ${{ secrets.NETLIFY_BUILD_HOOK }}
   ```

## 🆘 Troubleshooting

### Build fail: "products.json not found"
**Fix**: Verifică că ai creat GitHub Release cu tag `v1.0-data` și ai upload-at products.json

### Build timeout (>15 min pe free tier)
**Fix**: products.json trebuie descărcat rapid. Verifică că GitHub Release e public.

### API routes returnează date vechi
**Fix**: Clear Netlify cache și redeploy:
```bash
# Netlify Dashboard → Deploys → Trigger deploy → Clear cache and deploy
```

## ✅ Checklist Deploy

- [ ] Upload products.json pe GitHub Release (v1.0-data)
- [ ] Verifică că release e public (nu draft)
- [ ] Connect repo pe Netlify
- [ ] Set build command: `npm run build` (prebuild automat)
- [ ] Deploy și verifică logs pentru "✅ Downloaded products.json"
- [ ] Test site: categorii, produse, imagini
- [ ] Setup custom domain (optional)

## 🎯 Next Steps

După deploy:
1. ✅ Test toate categoriile (Electronics, Fashion, Home)
2. ✅ Verifică că imaginile se încarcă progresiv (lazy loading)
3. ✅ Check performance (ar trebui <1s First Contentful Paint)
4. ✅ Setup analytics (Google Analytics sau Plausible)
5. ✅ Add sitemap.xml pentru SEO (Next.js generate automat)
6. ✅ Test affiliate links (click → redirect la 2performant/profitshare)

## 📞 Support

Probleme? Check:
- GitHub Release assets: https://github.com/AleXGaGino/amdoro/releases
- Netlify build logs: Dashboard → Deploys → [Latest] → Deploy log
- Next.js docs: https://nextjs.org/docs/deployment

---

**Creat**: 2026-01-19  
**Versiune**: 1.0  
**Products**: 307,593  
**Status**: ✅ Production Ready
