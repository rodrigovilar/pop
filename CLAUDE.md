# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PoP (Proof of Patience)** is an educational tool demonstrating Bitcoin's long-term discipline requirements. This is NOT a trading app, price predictor, or profit optimizer - it's a pedagogical tool emphasizing sacrifice, discipline, and low time preference.

## Core Architectural Constraints

### Static-Only Architecture (Non-Negotiable)
- **No backend, no server-side code, no API**
- **No authentication or user accounts**
- Fully static hosting (GitHub Pages / Cloudflare Pages / Netlify / Vercel)
- All computation happens offline via batch scripts
- Frontend only fetches static JSON, renders UI, and manages cache

### Data Model Philosophy
- All heavy computation is **preprocessed offline** and committed to repository
- Data is **monthly sharded** for progressive loading
- Each currency has its own independent dataset (no FX conversion on frontend)
- Data updates happen monthly via batch generation scripts

## Data Architecture

### File Structure
```
public/
  data/
    manifest.v1.json              # Global metadata
    monthly/
      USD/
        YYYY-MM.json              # Monthly data shard per currency
      BRL/
        YYYY-MM.json
      EUR/
        YYYY-MM.json
```

### Monthly File Schema
```json
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

### Data Generation Rules
- Source: historical daily Bitcoin prices
- Daily price: last seen price in UTC
- Entry price: first available day of month
- Regime classification:
  - Bull ≥ +10% vs previous month
  - Bear ≤ -10% vs previous month
  - Otherwise Lateral

## Progressive Loading Strategy

### Load Priority Order
1. Manifest file
2. Current month data
3. Previous month data
4. Last 12 months
5. Remaining months (background)

### Concurrency
- Max 3-5 parallel fetches
- Progressive UI rendering (show data as it loads)

## LocalStorage Cache Management

### Namespacing Pattern
```
btcReport:v1:settings
btcReport:v1:manifest
btcReport:v1:data:<CURRENCY>:<YYYY-MM>
btcReport:v1:index
```

### Cleanup Policy
- Target max usage: 85-90% of available quota
- Never delete: current currency, current language, settings
- Delete priority: oldest months from non-selected currencies, then LRU shards
- Use `navigator.storage.estimate()` when available
- Handle `QuotaExceededError` gracefully

## Localization (i18n)

### Supported Languages (~20)
en (fallback), pt-BR, es, fr, de, it, nl, sv, da, no, fi, pl, cs, tr, ru, uk, ja, ko, zh-Hans, hi

**Note:** RTL languages explicitly excluded for now

### Translation Structure
```
/i18n/en.json
/i18n/pt-BR.json
```

- Key-based strings, lazy loaded
- Use `Intl` API for dates, currencies, percentages (no manual formatting)

## Currency Support (~20)

USD, EUR, BRL, GBP, JPY, CHF, CAD, AUD, NZD, CNY, HKD, SGD, INR, KRW, MXN, ARS, ZAR, TRY, SEK, NOK

**Critical:** Each currency has its own preprocessed dataset. No FX conversion on frontend.

## DCA Simulation Rules

### Inputs
- Start date
- Fixed monthly amount
- Currency

### Constraints
- Monthly purchases only (no arbitrary frequencies)
- No optimization or timing
- No rebalancing
- No selling
- Entry price = first available day of month

### Outputs
- Time spent below cost basis
- Longest negative streak (days)
- Current status (positive/negative)
- Participation in key appreciation days

## Ethical Constraints (CRITICAL)

The application **MUST NEVER**:
- Predict prices
- Encourage trading or timing the market
- Optimize for returns
- Include leverage, speculation, or signals
- Promise ROI or financial outcomes
- Use gamification elements
- Provide financial advice

**Focus:** Time, behavior, emotional cost, discipline - NOT gains.

## UX Narrative Flow

1. Reality shock: most days are negative or lateral
2. Few days explain most appreciation (50%, 80%, 90%)
3. DCA simulation emphasizes discomfort and drawdown periods
4. Discipline > intelligence
5. Time > timing

## Development Philosophy

### What This App IS
- Educational tool for Bitcoin educators
- Demonstration of long-term discipline requirements
- Visualization of emotional cost and sacrifice

### What This App IS NOT
- Trading tool
- Speculation platform
- Marketing funnel
- Price prediction service

## Embedded Manifesto

```
Bitcoin rewards few days —
but demands presence in all of them.

Most of the time there is discomfort.
Few moments justify the sacrifice.

There are no shortcuts.
Only discipline, time, and conviction.
```

## Key Technical Decisions

1. **Monthly sharding** enables progressive loading without overwhelming browser storage
2. **Preprocessed data** keeps frontend simple and fast
3. **One dataset per currency** avoids FX conversion complexity and inaccuracy
4. **LocalStorage with LRU eviction** balances offline capability with quota limits
5. **Static-only hosting** eliminates server costs and complexity while maximizing accessibility
