
# Bitcoin Temporal Sacrifice App
## Product + Technical Specification (v1)

---

## 1. Purpose and Product Philosophy

This application is an **educational and pedagogical tool** designed to help Bitcoin educators clearly demonstrate that:

- Entering Bitcoin is **not about fast enrichment**
- It requires **sacrifice, discipline, and low time preference**
- Most of the experience is drawdown, lateralization, and discomfort
- A **small number of days** explain most of the long-term appreciation
- These days are **unpredictable** and only reward those who remained positioned

The application must **never**:
- Predict prices
- Encourage trading or timing
- Optimize for returns
- Include leverage, speculation, or signals

The app focuses on **time, behavior, and emotional cost**, not gains.

---

## 2. Core Educational Concepts

### 2.1 Few Days Matter
Across Bitcoin’s history:
- Only a small set of days explain 50%, 80%, or 90% of appreciation
- These days usually occur **after long periods of drawdown or lateralization**
- Missing these days invalidates years of waiting

### 2.2 Low Time Preference
The app visually and numerically demonstrates:
- How long users would stay in negative territory
- How rare positive reinforcement is
- Why discipline matters more than intelligence

### 2.3 Discipline Over Timing
DCA simulations emphasize:
- Consistency
- Emotional endurance
- Process over outcome

---

## 3. Functional Scope

### 3.1 Static-Only Architecture
- No backend
- No authentication
- No user accounts
- No server-side computation
- Fully static hosting (GitHub Pages / Cloudflare Pages / Netlify / Vercel)

### 3.2 Preprocessed Data Model
All heavy computation is done **offline** via batch scripts and committed to the repository.

The frontend only:
- Fetches static JSON
- Renders UI
- Manages cache and state

---

## 4. Data Architecture

### 4.1 Monthly Sharded Data
Data is generated **once per month** and stored as independent JSON shards.

```
public/
  data/
    manifest.v1.json
    monthly/
      USD/
        YYYY-MM.json
      BRL/
        YYYY-MM.json
      EUR/
        YYYY-MM.json
```

### 4.2 Monthly File Schema

```
{
  "month": "YYYY-MM",
  "currency": "USD",
  "entryDate": "YYYY-MM-DD",
  "entryPrice": number,
  "daysPositive": number,
  "daysNegative": number,
  "daysTotal": number,
  "pctChangeVsPrevMonthStart": number | null,
  "regime": "BULL" | "BEAR" | "LATERAL" | "N/A"
}
```

### 4.3 Manifest File

```
{
  "version": "v1",
  "asset": "BTC",
  "monthsAvailable": [...],
  "currencies": [...],
  "rules": {
    "dailyPrice": "last_seen_price_utc",
    "entry": "first_available_day_of_month",
    "regimeThreshold": 0.10
  },
  "generatedAt": "ISO_TIMESTAMP"
}
```

---

## 5. Data Generation Rules

- Source: historical daily Bitcoin prices
- Daily price: **last seen price in UTC**
- Entry price: **first available day of month**
- Regime classification:
  - Bull ≥ +10%
  - Bear ≤ -10%
  - Otherwise Lateral

Batch runs:
- Monthly
- Updates manifest
- Generates new month per currency

---

## 6. Localization (i18n / l10n)

### 6.1 Languages (~20)
- en (fallback)
- pt-BR
- es, fr, de, it, nl
- sv, da, no, fi
- pl, cs, tr
- ru, uk
- ja, ko, zh-Hans, hi

> RTL languages explicitly excluded (for now).

### 6.2 Translation Model
- One JSON file per language
- Key-based strings
- Lazy loaded

```
/i18n/en.json
/i18n/pt-BR.json
```

### 6.3 Formatting
- Dates, currencies, percentages via `Intl`
- No manual month or number formatting

---

## 7. Currency Strategy

### 7.1 Supported Currencies (~20)
USD, EUR, BRL, GBP, JPY,
CHF, CAD, AUD, NZD,
CNY, HKD, SGD,
INR, KRW,
MXN, ARS,
ZAR, TRY,
SEK, NOK

### 7.2 One Dataset per Currency
- No FX conversion on frontend
- Each currency has its own monthly shards

---

## 8. Progressive Loading Strategy

### 8.1 Load Order
1. Manifest
2. Current month
3. Previous month
4. Last 12 months
5. Remaining months (background)

### 8.2 Concurrency
- Max 3–5 parallel fetches
- Progressive UI rendering

---

## 9. LocalStorage Cache Management

### 9.1 What Is Cached
- User settings (locale, currency)
- Manifest
- Monthly shards (per currency)
- Access metadata

### 9.2 Namespacing
```
btcReport:v1:settings
btcReport:v1:manifest
btcReport:v1:data:<CURRENCY>:<YYYY-MM>
btcReport:v1:index
```

### 9.3 Storage Monitoring
- Use `navigator.storage.estimate()` when available
- Track approximate byte size per item
- Detect `QuotaExceededError` on write

### 9.4 Cleanup Policy
- Target max usage: ~85–90%
- Never delete:
  - Current currency
  - Current language
  - Settings
- Remove:
  1. Oldest months from non-selected currencies
  2. Least-recently-used shards
- Cleanup is **incremental**, not aggressive

---

## 10. UX Narrative Flow

1. Reality shock: most days are negative or lateral
2. Few days explain most appreciation
3. DCA simulation emphasizes discomfort
4. Discipline > intelligence
5. Time > timing

---

## 11. DCA Simulation Rules

Inputs:
- Start date
- Fixed monthly amount
- Currency

Rules:
- Monthly purchases only
- No optimization
- No rebalancing
- No selling

Outputs:
- Time spent below cost basis
- Longest negative streak
- Current status (positive/negative)
- Highlight participation in key appreciation days

---

## 12. Ethical Constraints

- No price prediction
- No ROI promises
- No financial advice
- No gamification
- No alerts or signals

The app teaches **behavior**, not profit.

---

## 13. Manifesto (Embedded)

"""
Bitcoin rewards few days —
but demands presence in all of them.

Most of the time there is discomfort.
Few moments justify the sacrifice.

There are no shortcuts.
Only discipline, time, and conviction.
"""

---

## 14. Intended Use

- Bitcoin education
- Evangelization
- Presentations
- Self-reflection

Not intended for:
- Trading
- Speculation
- Marketing funnels

---

END OF SPECIFICATION
