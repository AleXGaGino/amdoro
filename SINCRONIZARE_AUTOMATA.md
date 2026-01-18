# Sincronizare Automată - Configurare Completă

## 🎯 Sincronizare 100% Automată

Am creat un sistem complet automat pentru sincronizarea produselor!

## 📋 Configurare Inițială (O SINGURĂ DATĂ)

### Pasul 1: Adaugă URL-urile Feed-urilor

**Deschide:** `app/api/auto-sync/route.ts`

**La linia 15, adaugă URL-urile feed-urilor tale:**

```typescript
const FEED_URLS = [
  'https://api.2performant.com/feed/emag.csv',
  'https://api.2performant.com/feed/fashiondays.csv',
  'https://api.2performant.com/feed/altex.csv',
  // Adaugă mai multe feed-uri aici
];
```

### Pasul 2: Găsește URL-urile Feed-urilor

**În Business League / Account:**

1. Mergi la **"My Programs"**
2. Click pe fiecare program (eMAG, Fashion Days, etc.)
3. Caută **"Product Feed"** sau **"Data Feed"**
4. Copiază URL-ul și adaugă-l în `FEED_URLS`

**Exemple de feed-uri populare:**
```
eMAG:         https://api.2performant.com/feed/[network_id]/emag.csv
Fashion Days: https://api.2performant.com/feed/[network_id]/fashiondays.csv
Altex:        https://api.2performant.com/feed/[network_id]/altex.csv
CEL.ro:       https://api.2performant.com/feed/[network_id]/cel.csv
```

## 🚀 Utilizare

### Metoda 1: Sincronizare Manuală (Când Vrei Tu)

```bash
# Pornește serverul Next.js (dacă nu rulează deja)
npm run dev

# În alt terminal, rulează sincronizarea
npm run auto-sync
```

**SAU direct în browser:**
```
http://localhost:3000/api/auto-sync
```

### Metoda 2: Sincronizare Automată Zilnică (Windows)

#### Configurare Windows Task Scheduler

**Pasul 1: Creează fișierul batch**

Creează `sync-daily.bat` în root-ul proiectului:

```batch
@echo off
cd /d "C:\Users\alexi\OneDrive\Desktop\sitecumparaturionline\affiliate-mall"
node scripts\auto-sync.js
```

**Pasul 2: Creează Task în Windows**

1. Deschide **Task Scheduler** (caută în Start)
2. Click pe **"Create Basic Task"**
3. **Name:** "2Performant Auto Sync"
4. **Trigger:** "Daily" → Alege ora (ex: 6:00 AM)
5. **Action:** "Start a program"
   - Program: `C:\path\to\sync-daily.bat`
6. Click **"Finish"**

**GATA!** Produsele se vor sincroniza automat în fiecare zi! ✅

### Metoda 3: Sincronizare în Production (Vercel/Netlify)

#### Pentru Vercel

Creează `vercel.json` în root:

```json
{
  "crons": [{
    "path": "/api/auto-sync",
    "schedule": "0 6 * * *"
  }]
}
```

Sincronizare automată în fiecare zi la 6:00 AM! 🚀

#### Pentru Netlify

Folosește Netlify Functions sau un serviciu extern ca:
- **Cron-job.org** (gratuit)
- **EasyCron** (gratuit)

Configurează să apeleze: `https://your-site.com/api/auto-sync`

## 📊 Ce Face Automat

1. ✅ **Descarcă produsele** din toate feed-urile configurate
2. ✅ **Generează link-uri de tracking** cu `aff_code=1e89fe313`
3. ✅ **Categorizează produsele** automat (Electronics, Fashion, Home)
4. ✅ **Filtrează produsele invalide** (fără imagine, preț 0)
5. ✅ **Salvează în `data/products.json`** gata de folosit
6. ✅ **Actualizează site-ul** automat (Next.js reîncarcă datele)

## 🔧 Comandă Nouă în package.json

Am adăugat:

```json
"auto-sync": "node scripts/auto-sync.js"
```

**Utilizare:**
```bash
npm run auto-sync
```

## 📝 Exemplu de Output

```
🚀 Starting automatic product sync...

📥 Fetching feed: https://api.2performant.com/feed/emag.csv
✓ Fetched 150 products from eMAG

📥 Fetching feed: https://api.2performant.com/feed/fashiondays.csv
✓ Fetched 200 products from Fashion Days

✅ Sync completed successfully!

📦 Products synced: 350
📊 Categories:
   - Electronics: 120
   - Fashion: 180
   - Home: 45
   - Other: 5

⏰ Timestamp: 2026-01-18T10:30:00.000Z
🔄 Feeds processed: 2

✨ Products are now available on your site!
```

## 🎯 Fluxul Complet Automatizat

```
Cron Job (6:00 AM zilnic)
    ↓
Apelează /api/auto-sync
    ↓
Descarcă feed-uri de la 2Performant
    ↓
Generează link-uri cu tracking (aff_code=1e89fe313)
    ↓
Salvează în data/products.json
    ↓
Site-ul afișează produsele noi automat
    ↓
Clienții cumpără → Tu primești comision! 💰
```

## ✅ Checklist Setup

- [ ] Am adăugat URL-urile feed-urilor în `app/api/auto-sync/route.ts`
- [ ] Am testat manual: `npm run auto-sync`
- [ ] Produsele apar în `data/products.json`
- [ ] Site-ul afișează produsele noi
- [ ] Am configurat Task Scheduler pentru sync zilnic (opțional)
- [ ] Link-urile trackuiesc în 2Performant Dashboard

## 🔥 Avantaje

✅ **Zero intervenție manuală** - totul e automat
✅ **Produse mereu fresh** - actualizare zilnică
✅ **Prețuri actualizate** - feed-urile au prețuri în timp real
✅ **Stocuri corecte** - produsele indisponibile sunt eliminate
✅ **Tracking automat** - toate link-urile au `aff_code=1e89fe313`

## 💡 Tips

1. **Începe cu 1-2 feed-uri** pentru test
2. **Verifică produsele** în `data/products.json` după primul sync
3. **Monitorizează click-urile** în 2Performant Dashboard
4. **Adaugă mai multe feed-uri** pe măsură ce vezi ce funcționează

## 🆘 Troubleshooting

### "No feed URLs configured"
➡️ Adaugă URL-uri în `app/api/auto-sync/route.ts`

### "Feed fetch failed"
➡️ Verifică că URL-ul feed-ului e corect
➡️ Verifică că ai acces la programul respectiv în 2Performant

### "Site not running"
➡️ Pornește `npm run dev` înainte de sync

### Produsele nu apar pe site
➡️ Restart serverul Next.js după sync
➡️ Verifică `data/products.json` că e populat

---

**🎉 Acum ai sincronizare 100% automată! Set it and forget it!**
