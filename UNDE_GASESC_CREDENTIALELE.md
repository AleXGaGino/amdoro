# 📍 Unde Găsești Credențialele 2Performant

## 🔐 Ghid Pas cu Pas

### 1. API KEY

**Pasul 1:** Loghează-te pe 2Performant
- Mergi la: https://account.2performant.com/login
- Introdu email-ul și parola ta

**Pasul 2:** Accesează Settings
- În meniul principal, caută iconița de **Settings** (⚙️) sau **Setări**
- Sau mergi direct la: https://account.2performant.com/settings

**Pasul 3:** API Access
- În meniul din stânga, caută **"API"** sau **"API Access"**
- Dacă nu există un API Key, apasă butonul **"Generate API Key"**
- **Copiază API Key-ul** afișat (arată așa: `abc123def456...`)

⚠️ **IMPORTANT:** 
- API Key-ul este secret! Nu îl împărtăși cu nimeni
- Dacă nu vezi opțiunea de API, contactează support@2performant.com

---

### 2. NETWORK ID

**Metoda 1: Din URL (CEL MAI SIMPLU)**

Când ești logat în dashboard-ul 2Performant, uită-te la URL:

```
https://account.2performant.com/network/12345/dashboard
                                    ^^^^^^
                                 ACESTA E NETWORK ID-ul tău!
```

**Metoda 2: Din Account Settings**
- Mergi la **Settings** → **Account**
- Caută câmpul **"Network ID"** sau **"ID rețea"**
- Notează numărul (de obicei 4-5 cifre)

**Exemplu:**
- Dacă URL-ul este `https://account.2performant.com/network/56789/...`
- Atunci Network ID = `56789`

---

### 3. AFFILIATE ID (Cel mai important pentru tracking!)

**Pasul 1:** Mergi la Dashboard
- Click pe **"Dashboard"** în meniul principal

**Pasul 2:** Caută ID-ul în diverse locuri:

**Locație A: În URL-ul profilului**
```
https://account.2performant.com/affiliate/67890/profile
                                        ^^^^^^
                                    AFFILIATE ID
```

**Locație B: Account Settings**
- **Settings** → **Profile** sau **Account Details**
- Caută **"Affiliate ID"**, **"Publisher ID"** sau **"ID Afiliat"**
- Poate fi afișat ca: `Affiliate #67890`

**Locație C: În Link-urile Generate**
- Mergi la orice **Campaign** (program de afiliat)
- Click pe **"Get Links"** sau **"Obține Link-uri"**
- Link-ul generat va arăta așa:
  ```
  https://event.2performant.com/events/click?aff_id=67890&...
                                                   ^^^^^^
                                              AFFILIATE ID
  ```

---

## 📋 Rezumat: Unde să Cauți

| Credențial | Unde se Găsește | Arată Ca |
|------------|----------------|-----------|
| **API Key** | Settings → API Access | `abc123def456ghi789...` (lung) |
| **Network ID** | În URL-ul dashboard-ului | `12345` (4-5 cifre) |
| **Affiliate ID** | În URL-ul profilului sau link-uri | `67890` (4-6 cifre) |

---

## 🎯 Exemplu Complet

După ce găsești toate informațiile, completează în `.env.local`:

```env
# Exemplu cu date reale (NU folosi acestea, sunt exemple!)
NEXT_PUBLIC_2PERFORMANT_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
NEXT_PUBLIC_2PERFORMANT_NETWORK_ID=12345
NEXT_PUBLIC_2PERFORMANT_AFFILIATE_ID=67890
```

---

## 🔍 Verificare Rapidă

### Test 1: Verifică că ai tot
```bash
# Rulează în terminal
cat .env.local
```

Ar trebui să vezi toate cele 3 linii completate (fără spații goale).

### Test 2: Verifică un link de tracking manual

Deschide în browser:
```
https://event.2performant.com/events/click?ad_type=quicklink&aff_id=YOUR_AFFILIATE_ID&redirect_to=https://emag.ro
```

Înlocuiește `YOUR_AFFILIATE_ID` cu ID-ul tău real.

**Dacă funcționează:** Vei fi redirectat către eMAG și click-ul va apărea în 2Performant Dashboard → Statistics

**Dacă NU funcționează:** Affiliate ID-ul este greșit

---

## ❓ Probleme Comune

### "Nu găsesc API Key în Settings"
**Soluție:**
1. Verifică dacă contul tău are acces la API (unele conturi noi nu au)
2. Contactează support 2Performant: support@2performant.com
3. Sau folosește metoda cu Feed-uri CSV/XML (nu necesită API Key)

### "Nu sunt sigur care e Network ID-ul"
**Soluție:**
- Copiază numărul din URL când ești logat
- Sau întreabă support 2Performant direct
- De obicei primești un email de bun venit cu aceste detalii

### "Am mai multe Network ID-uri"
**Soluție:**
- Unii afiliați au acces la mai multe rețele
- Folosește Network ID-ul unde ai cele mai multe campanii active
- Verifică în Dashboard care rețea are cele mai multe programe

### "Link-urile nu trackuiesc în Dashboard"
**Soluție:**
1. Verifică că Affiliate ID este corect (testează manual link-ul de mai sus)
2. Așteaptă 2-3 minute (statisticile nu sunt instant)
3. Verifică în Dashboard → Statistics → Clicks
4. Asigură-te că folosești `/api/go/[id]` pentru redirects

---

## 📞 Contact Suport 2Performant

Dacă ai probleme să găsești credențialele:

**Email:** support@2performant.com

**În email, cere:**
```
Bună ziua,

Am nevoie de următoarele informații pentru integrare API:
1. API Key (sau cum pot să-l generez)
2. Network ID
3. Affiliate ID / Publisher ID

Multumesc!
```

**Răspund de obicei în:** 1-2 zile lucrătoare

---

## ✅ Checklist Final

După ce completezi `.env.local`, verifică:

- [ ] API Key are minim 20-30 caractere (e lung!)
- [ ] Network ID are 4-5 cifre
- [ ] Affiliate ID are 4-6 cifre
- [ ] Nu sunt spații înainte sau după valorile completate
- [ ] Fișierul se numește exact `.env.local` (cu punct la început!)
- [ ] Fișierul este în root-ul proiectului (lângă package.json)

**Gata! Acum poți rula:**
```bash
python scripts/sync_2performant.py
```

---

## 🎓 Extra: Metoda Fără API (Pentru Începători)

Dacă întâmpini dificultăți cu API-ul, poți folosi **Feed-uri Direct**:

1. Mergi la **Campaigns** în 2Performant
2. Alege un program (ex: eMAG, Fashion Days)
3. Caută **"Product Feed"** sau **"Data Feed"**
4. Copiază URL-ul feed-ului CSV/XML
5. Rulează:
   ```bash
   python scripts/sync_2performant.py
   ```
6. Lipește URL-ul când ți se cere

**Avantaj:** Nu ai nevoie de API Key, doar de Affiliate ID (pentru tracking).

**Dezavantaj:** Trebuie să actualizezi manual feed-ul periodic.
