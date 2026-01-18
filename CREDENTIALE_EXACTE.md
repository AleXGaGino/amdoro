# ✅ Ghid Exact: Credențialele Tale 2Performant

## 🎯 Am Văzut Dashboard-ul Tău! Iată Ce Trebuie Să Faci:

### Pasul 1: Deschide Profile Settings

1. În 2Performant, mergi la **Profile Settings** (unde tocmai ai fost)
2. Scroll în jos până vezi două secțiuni importante:

---

## 📋 Cele 3 Credențiale de Care Ai Nevoie:

### ✅ 1. USER KEY HEADER (API Key)

**Unde îl găsești:**
- În **Profile Settings**
- Secțiunea **"User key header"**
- Sub text: _"This value will be used by the marketer when making API requests"_

**Al tău este:**
```
b3a53653a45d66e937da1c478d5d91ae6ea8df1a50d18e2e5f0607ca7214
```

✅ **DEJA L-AM COMPLETAT în `.env.local`!**

---

### ✅ 2. UNIQUE MARKETER CODE (Codul Tău de Afiliat)

**Unde îl găsești:**
- În **Profile Settings**
- Secțiunea **"Unique Marketer Code"**
- Sub text: _"This code uniquely identifies your marketer account"_

**Al tău este:**
```
1e89fe313
```

**Exemplu de link cu codul tău:**
```
https://event.2performant.com/events/click?ad_type=quicklink&aff_code=1e89fe313&unique=1234560&redirect_to=https://www.example.com
```

✅ **DEJA L-AM COMPLETAT în `.env.local`!**

---

### ⚠️ 3. NETWORK ID (Lipsește - Ai Nevoie De Asta!)

**� SOLUȚIE: Dacă ești redirectat automat către Business League**

### Opțiunea A: Accesează Direct Dashboard-ul (RECOMANDAT)

**Încearcă aceste URL-uri direct în browser:**

1. **Dashboard Principal:**
   ```
   https://account.2performant.com/dashboard
   ```

2. **Campaigns:**
   ```
   https://account.2performant.com/campaigns
   ```

3. **Settings:**
   ```
   https://account.2performant.com/settings
   ```

După ce accesezi orice din acestea, **uită-te în URL** și vei vedea Network ID:
```
https://account.2performant.com/network/12345/dashboard
                                        ^^^^^^
```

### Opțiunea B: Din Business League, Găsește Link către Dashboard

În **Business League**, caută în meniu:
- **"My Account"** sau **"Contul Meu"**
- **"Settings"** sau **"Setări"**
- **"Switch to Classic View"** sau **"Dashboard"**
- Link-uri în header/footer care duc la account.2performant.com

### Opțiunea C: Nu Ai Nevoie de Network ID Pentru Feed-uri! 

**VESTE BUNĂ:** Dacă folosești feed-uri de produse (XML/CSV), **NU ai nevoie de Network ID**!

Doar:
1. ✅ **Unique Marketer Code**: `1e89fe313` (deja l-ai!)
2. ✅ **URL-ul Feed-ului** de la un program de afiliat

**Lasă Network ID gol în `.env.local`:**
```env
NEXT_PUBLIC_2PERFORMANT_NETWORK_ID=
```

**Și rulează direct:**
```bash
python scripts/sync_2performant.py
```

Introdu URL-ul feed-ului când ți se cere și GATA! 🎉

---

## 📝 Fișierul `.env.local` Tău (Complet!)

După ce găsești Network ID-ul, fișierul tău ar trebui să arate așa:

```env
# User key header (✅ COMPLETAT)
NEXT_PUBLIC_2PERFORMANT_API_KEY=b3a53653a45d66e937da1c478d5d91ae6ea8df1a50d18e2e5f0607ca7214

# Unique Marketer Code (✅ COMPLETAT)
NEXT_PUBLIC_2PERFORMANT_AFF_CODE=1e89fe313

# Network ID (⚠️ COMPLETEAZĂ TU din URL)
NEXT_PUBLIC_2PERFORMANT_NETWORK_ID=12345
```

---

## 🚀 Cum Să Testezi Dacă Merge

### Test 1: Verifică Link-ul de Tracking

Deschide în browser (înlocuiește `1e89fe313` cu codul tău, dar e deja corect!):
```
https://event.2performant.com/events/click?ad_type=quicklink&aff_code=1e89fe313&unique=123456&redirect_to=https://emag.ro
```

**Dacă merge:** Vei fi redirectat către eMAG și click-ul va apărea în **Statistics** → **Clicks**

### Test 2: Rulează Sincronizarea

După ce completezi Network ID, rulează:
```bash
python scripts/sync_2performant.py
```

---

## 🔍 Diferența Față de Ce Credeam Înainte

| Ce Credeam | Realitatea |
|------------|-----------|
| `AFFILIATE_ID` (numeric) | `AFF_CODE` (alfanumeric: `1e89fe313`) |
| `aff_id=12345` | `aff_code=1e89fe313` |
| "API Key" generic | "User key header" specific |
| Un singur dashboard | Două dashboard-uri (Account + Business League) |

**✅ Am actualizat tot codul să folosească structura corectă!**

---

## 🏢 Diferența Între Dashboard-uri

### Business League (businessleague.2performant.com)
```
https://businessleague.2performant.com/affiliate/affiliate_profile
```
**Folosit pentru:**
- ✅ Profilul tău public de afiliat
- ✅ Statistici și rank în comunitate
- ✅ Competiții și premii
- ❌ NU găsești credențiale API aici

### Account Dashboard (account.2performant.com)
```
https://account.2performant.com/
```
**Folosit pentru:**
- ✅ Settings și credențiale API
- ✅ Campaigns și link-uri
- ✅ Network ID în URL
- ✅ Product feeds
- ✅ **ACEST DASHBOARD E NECESAR PENTRU INTEGRARE**

---

## 📊 Structura Link-ului Tău de Tracking

```
https://event.2performant.com/events/click
  ?ad_type=quicklink              ← Tip de ad
  &aff_code=1e89fe313            ← CODUL TĂU (nu numeric!)
  &unique=1737200000000          ← Timestamp unic
  &redirect_to=https://emag.ro   ← URL produsului
```

---

## ✅ Next Steps (SIMPLIFICAT - Fără Network ID!)

### Metoda 1: Feed Direct (CEL MAI SIMPLU - RECOMANDAT!)

1. **În Business League, găsește Campaigns:**
   - Caută meniu **"Programs"** sau **"Campanii"**
   - Selectează un merchant (eMAG, Fashion Days, Altex, etc.)
   - Caută **"Product Feed"**, **"Data Feed"** sau **"XML/CSV"**
   - Copiază URL-ul feed-ului

2. **Rulează sincronizarea:**
   ```bash
   python scripts/sync_2performant.py
   ```

3. **Introdu URL-ul feed-ului când ți se cere**

4. **GATA!** Produsele vor fi în `data/products.json` cu tracking-ul tău!

### Metoda 2: Găsește Network ID (Dacă Vrei Totuși)

**Încearcă URL-urile astea DIRECT în browser:**

1. https://account.2performant.com/dashboard
2. https://account.2performant.com/campaigns  
3. https://account.2performant.com/settings

**Când se încarcă pagina, COPIAZĂ RAPID URL-ul din browser!**

Ar trebui să vezi:
```
https://account.2performant.com/network/12345/...
```

**Acel `12345` e Network ID-ul!**

---

## 💡 Reminder Important

**Link-urile tale de tracking vor arăta așa:**
```
/api/go/1 → redirectează către →
https://event.2performant.com/events/click?aff_code=1e89fe313&...
```

**Nu așa (greșit):**
```
https://event.2performant.com/events/click?aff_id=67890&...
```

**✅ Tot codul e actualizat cu `aff_code`!**

---

## 🎉 Gata!

Ai **2 din 3** credențiale completate deja!

Doar găsește **Network ID** din URL și ești gata să începi! 🚀
