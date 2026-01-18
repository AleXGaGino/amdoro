# 🎯 Programele Tale de Afiliat

Am identificat exact programele la care ești înscris!

## 📋 Programele Tale Active

| Program | Website | Categorie | Link de Tracking |
|---------|---------|-----------|------------------|
| **Aqualine** | www.aqualine.ro | 🏠 Home / Filtre Apă | ✅ Activ |
| **Esteto** | esteto.ro | 💄 Beauty / Cosmetice | ✅ Activ |
| **evoMAG** | www.evomag.ro | 📱 Electronics | ✅ Activ |
| **Somnart** | www.somnart.ro | 🛏️ Home / Mobilier Somn | ✅ Activ |

## 🚀 Cum Să Obții Feed-urile (Pentru Fiecare Program)

### În Business League / Account:

1. **Mergi la "My Programs"** sau **"Programele Mele"**

2. **Pentru fiecare program, click pe el:**
   - Click pe **"Aqualine"**
   - Caută **"Promotional Materials"** sau **"Marketing Tools"**
   - Caută **"Product Feed"**, **"Data Feed"** sau **"XML/CSV"**
   - **Copiază URL-ul**

3. **Repetă pentru toate cele 4 programe**

### Structura Feed-urilor (Probabil)

Feed-urile tale vor arăta probabil așa:

```
https://api.2performant.com/feed/[NETWORK_ID]/aqualine.csv
https://api.2performant.com/feed/[NETWORK_ID]/esteto.csv
https://api.2performant.com/feed/[NETWORK_ID]/evomag.csv
https://api.2performant.com/feed/[NETWORK_ID]/somnart.csv
```

SAU fără Network ID:

```
https://api.2performant.com/feed/aqualine.csv
https://api.2performant.com/feed/esteto.csv
https://api.2performant.com/feed/evomag.csv
https://api.2performant.com/feed/somnart.csv
```

## 📝 Pași Exacti Pentru Tine

### Pasul 1: Găsește Feed-urile

**În Business League:**

1. **Aqualine**
   - Click pe program
   - Caută "Product Feed" sau "Data Feed"
   - Copiază URL-ul (salvează-l undeva)

2. **Esteto**
   - Repetă procesul
   - Copiază URL-ul

3. **evoMAG**
   - Repetă procesul
   - Copiază URL-ul

4. **Somnart**
   - Repetă procesul
   - Copiază URL-ul

### Pasul 2: Adaugă Feed-urile în Cod

**Deschide:** `app/api/auto-sync/route.ts`

**Linia 10-18, înlocuiește cu:**

```typescript
const FEED_URLS = [
  'URL_FEED_AQUALINE_AICI',
  'URL_FEED_ESTETO_AICI',
  'URL_FEED_EVOMAG_AICI',
  'URL_FEED_SOMNART_AICI',
];
```

### Pasul 3: Rulează Sincronizarea

```bash
npm run auto-sync
```

**GATA!** Toate produsele de la cele 4 programe vor fi sincronizate automat!

## 🎨 Categorizare Automată

Produsele vor fi categorizate automat:

| Program | Categorie pe Site |
|---------|-------------------|
| **evoMAG** | Electronics (telefoane, laptopuri, TV) |
| **Esteto** | Fashion (cosmetice, beauty) |
| **Aqualine** | Home (filtre, apă) |
| **Somnart** | Home (saltele, perne, mobilier) |

## 💡 Dacă Nu Găsești Feed-uri

### Opțiunea A: Întreabă Direct 2Performant

Scrie un email la **support@2performant.com**:

```
Bună ziua,

Sunt afiliat înscris la următoarele programe:
- Aqualine
- Esteto  
- evoMAG
- Somnart

Aș dori să obțin URL-urile feed-urilor de produse (CSV sau XML) 
pentru aceste programe.

Vă mulțumesc!
```

### Opțiunea B: Folosește Direct Link-urile

Dacă nu există feed-uri, putem crea o soluție alternativă:

1. **Scraping automat** - site-ul tău accesează merchant-ii și extrage produse
2. **Manual curat** - selectezi manual 10-20 produse top de la fiecare

**Vrei să creez un scraper automat pentru aceste site-uri?**

## 🔍 Verificare în Business League

**Caută în fiecare program:**

1. Click pe **"Aqualine"**
2. Caută tabs/secțiuni:
   - ✅ **"Promotional Materials"**
   - ✅ **"Marketing Tools"**
   - ✅ **"Banners & Links"**
   - ✅ **"Product Feed"** ← AICI!
   - ✅ **"Data Feed"** ← SAU AICI!

3. Dacă vezi **"Download CSV"** sau **"Download XML"**, click și vezi URL-ul

## 📊 Exemple de Site-uri Similare

### evoMAG (Electronics)
- Ar putea avea: **laptopuri, telefoane, TV-uri, gadget-uri**
- Categorie: **Electronics**
- Comisioane: probabil 1-3%

### Esteto (Beauty)
- Ar putea avea: **cosmetice, parfumuri, îngrijire**
- Categorie: **Fashion** (sau cream o categorie "Beauty")
- Comisioane: probabil 5-10%

### Aqualine (Filtre Apă)
- Ar putea avea: **filtre, purificatoare, cartușe**
- Categorie: **Home**
- Comisioane: probabil 3-5%

### Somnart (Mobilier Somn)
- Ar putea avea: **saltele, perne, lenjerii**
- Categorie: **Home**
- Comisioane: probabil 5-8%

## ✅ Action Plan

- [ ] Loghează-te în Business League
- [ ] Accesează "My Programs"
- [ ] Pentru Aqualine: găsește Product Feed → copiază URL
- [ ] Pentru Esteto: găsește Product Feed → copiază URL
- [ ] Pentru evoMAG: găsește Product Feed → copiază URL
- [ ] Pentru Somnart: găsește Product Feed → copiază URL
- [ ] Adaugă toate URL-urile în `app/api/auto-sync/route.ts`
- [ ] Rulează `npm run auto-sync`
- [ ] Verifică `data/products.json` că e populat
- [ ] Testează site-ul: `npm run dev`

## 🆘 Dacă Te Blochezi

**Trimite-mi un screenshot cu:**
1. Pagina programului Aqualine (sau orice altul)
2. Tabs/meniurile disponibile
3. Orice secțiune care conține "feed" sau "products"

**Și îți voi arăta exact unde să dai click!**

---

**🎯 Următorul pas: Găsește acele 4 feed-uri și le adaugi în cod. Apoi `npm run auto-sync` și GATA!**
