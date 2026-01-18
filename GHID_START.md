# Ghid Rapid: Începe să Vinzi cu 2Performant

## 🎯 Pași Simpli pentru a Începe

### Pasul 1: Configurează Credențialele (5 minute)

1. **Accesează 2Performant Dashboard**
   - Mergi la: https://account.2performant.com/
   - Loghează-te cu contul tău

2. **Obține API Key**
   - Settings → API Access
   - Copiază API Key-ul tău

3. **Găsește ID-urile**
   - **Network ID**: În URL-ul dashboard-ului (ex: `/network/12345/`)
   - **Affiliate ID**: În Settings → Account Details

4. **Completează `.env.local`**
   ```env
   NEXT_PUBLIC_2PERFORMANT_API_KEY=abc123xyz...
   NEXT_PUBLIC_2PERFORMANT_NETWORK_ID=12345
   NEXT_PUBLIC_2PERFORMANT_AFFILIATE_ID=67890
   ```

### Pasul 2: Obține Feed-ul de Produse

**Opțiunea A: Feed XML/CSV (CEL MAI SIMPLU)**

1. În dashboard-ul 2Performant:
   - Mergi la **Campaigns**
   - Selectează un program de afiliat (ex: eMAG, Fashion Days, etc.)
   - Caută secțiunea **"Product Feed"** sau **"Data Feed"**
   - Copiază URL-ul feed-ului (XML sau CSV)

2. Rulează scriptul Python:
   ```bash
   python scripts/sync_2performant.py
   ```
   - Introdu URL-ul feed-ului când ți se cere
   - Scriptul va descărca și procesa produsele automat

**Opțiunea B: API REST (AVANSAT)**

1. Pornește serverul Next.js:
   ```bash
   npm run dev
   ```

2. Sincronizează produsele:
   ```bash
   npm run sync-products
   ```

### Pasul 3: Verifică Produsele

1. Verifică fișierul generat:
   ```bash
   cat data/products.json
   ```

2. Deschide site-ul:
   ```
   http://localhost:3000
   ```

3. Produsele tale 2Performant ar trebui să fie vizibile! 🎉

## 📋 Exemple de Feed-uri Populare

### eMAG
```
https://api.2performant.com/feed/[NETWORK_ID]/emag?format=csv
```

### Fashion Days
```
https://api.2performant.com/feed/[NETWORK_ID]/fashiondays?format=xml
```

### Altex
```
https://api.2performant.com/feed/[NETWORK_ID]/altex?format=csv
```

*Înlocuiește [NETWORK_ID] cu ID-ul tău real*

## 🔄 Actualizare Automată

### Opțiune 1: Cron Job Manual

Crează un script în Windows Task Scheduler:
```bash
cd C:\path\to\affiliate-mall
python scripts\sync_2performant.py
```

Setează să ruleze zilnic la 6:00 AM.

### Opțiune 2: API Endpoint

Folosește un serviciu ca Cron-job.org pentru a apela:
```
http://your-domain.com/api/sync-products
```

### Opțiune 3: Vercel Cron (Production)

În `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/sync-products",
    "schedule": "0 6 * * *"
  }]
}
```

## 🚀 Testare Rapidă

### Test 1: Verifică Credențialele
```bash
# Verifică dacă .env.local este configurat
cat .env.local
```

### Test 2: Sincronizează 1 Produs
```bash
# Folosește feed-ul de test cu limit mic
python scripts/sync_2performant.py
```

### Test 3: Verifică Link-urile de Afiliat
```bash
# Deschide în browser
http://localhost:3000/api/go/1
```

Ar trebui să te redirecteze către link-ul de tracking 2Performant!

## ❓ Depanare Probleme Comune

### "Missing 2Performant credentials"
✅ Verifică că ai completat toate cele 3 câmpuri în `.env.local`
✅ Restart serverul Next.js după modificări

### "No products found"
✅ Verifică că URL-ul feed-ului este corect
✅ Asigură-te că ai access la campania respectivă în 2Performant
✅ Verifică că programul de afiliat este activ

### "Feed format error"
✅ Verifică dacă feed-ul este CSV sau XML
✅ Încearcă să descarci manual feed-ul în browser
✅ Contactează support 2Performant dacă feed-ul pare corupt

### Link-urile nu trackuiesc
✅ Verifică AFFILIATE_ID în `.env.local`
✅ Asigură-te că folosești `/api/go/[id]` pentru redirects
✅ Verifică în 2Performant Dashboard → Statistics dacă apar click-uri

## 📊 Monitorizare Vânzări

1. **Dashboard 2Performant**
   - Statistics → Clicks
   - Statistics → Conversions
   - Statistics → Commissions

2. **Verifică Link-urile**
   - Toate link-urile trebuie să conțină `aff_id=YOUR_ID`
   - Click-urile ar trebui să apară în 2-3 minute în dashboard

3. **Optimizare**
   - Monitorizează ce categorii au cele mai multe click-uri
   - Adaugă mai multe produse din categoriile populare
   - Testează diferite merchant-uri

## 💡 Tips pentru Success

1. **Diversifică Produsele**
   - Folosește mai multe feed-uri (eMAG, Fashion Days, Altex)
   - Combină categoriile populare

2. **Actualizează Regulat**
   - Prețurile se schimbă des
   - Stocul poate să dispară
   - Rulează sync zilnic

3. **Optimizează SEO**
   - Folosește titluri descriptive
   - Adaugă meta descriptions personalizate
   - Îmbunătățește imaginile

4. **Trackuiește Performanța**
   - Google Analytics pentru traffic
   - 2Performant Dashboard pentru conversii
   - Testează diferite call-to-action-uri

## 📞 Suport

- **2Performant Support**: support@2performant.com
- **Developer Docs**: https://developers.2performant.com/
- **Dashboard**: https://account.2performant.com/
- **Forum**: https://forum.2performant.com/

## ✅ Checklist de Start

- [ ] Am completat `.env.local` cu credențialele mele
- [ ] Am obținut URL-ul feed-ului de produse
- [ ] Am rulat `python scripts/sync_2performant.py`
- [ ] Am verificat că produsele apar în `data/products.json`
- [ ] Am testat site-ul la `http://localhost:3000`
- [ ] Am verificat că link-urile redirectează corect
- [ ] Am setat actualizare automată zilnică
- [ ] Am verificat primul click în 2Performant Dashboard

---

**Gata! Acum poți începe să câștigi comisioane! 💰**
