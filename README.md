# PoP - Proof of Patience

Educational Bitcoin app teaching discipline and low time preference.

> Bitcoin rewards few days — but demands presence in all of them.

## 🎯 Purpose

This is an **educational tool** to demonstrate that Bitcoin investing requires:
- Sacrifice and discipline
- Low time preference
- Emotional endurance through drawdowns
- Participation in unpredictable key appreciation days

**NOT** a trading tool, price predictor, or profit optimizer.

## ✨ Features

### 🎓 Educational Philosophy
- **Manifesto-driven UX**: Core philosophy front and center
- **Reality check**: Visual emphasis on negative/lateral days
- **No gamification**: No charts, no predictions, no profit promises
- **Discipline over timing**: Focus on behavior, not returns

### 📊 Data & Analytics
- **72 months** of historical data (2020-2025)
- **Interactive DCA simulator** with real-time results
- **Drawdown tracking**: Days in discomfort and longest streaks
- **Regime classification**: BULL/BEAR/LATERAL
- **Multi-currency**: USD, EUR, BRL, and 17 more
- **Real data**: CoinGecko API integration

### 🎮 Interactive Pages
- **Overview**: Manifesto + Recent months visualization
- **DCA Simulation**: Interactive form with comprehensive results
- **About**: Educational purpose and philosophy

### ⚡ Performance
- **Progressive loading**: Manifest → Current → Previous → Recent → Background
- **LocalStorage cache**: LRU eviction with quota monitoring
- **Static-only**: No backend, deployable to GitHub Pages/Vercel/Netlify
- **Bundle size**: 158KB (50KB gzipped)

### 🌍 Internationalization
- **20 languages** supported (en, pt-BR, es, fr, de, it, nl, sv, da, no, fi, pl, cs, tr, ru, uk, ja, ko, zh-Hans, hi)
- **Intl API**: Native number/currency/date formatting
- **Lazy loading**: Only load needed translations

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Static Frontend               │
│  (React + TypeScript + Vite)           │
└─────────────────────────────────────────┘
                  │
                  ├─► Progressive Loader
                  │   ├─ Manifest
                  │   ├─ Current Month
                  │   ├─ Recent 12 Months
                  │   └─ Background Loading
                  │
                  ├─► Cache Manager (LRU)
                  │   └─ LocalStorage
                  │
                  ├─► DCA Engine
                  │   └─ Simulation Logic
                  │
                  └─► i18n System
                      └─ 20 Languages

┌─────────────────────────────────────────┐
│        Preprocessed Data (Static)       │
│  /public/data/monthly/{CURRENCY}/       │
│     - 2020-01.json                      │
│     - 2020-02.json                      │
│     - ...                               │
│  /public/data/manifest.v1.json          │
└─────────────────────────────────────────┘
```

## 📦 Tech Stack

- **TypeScript** - Type safety
- **React 18** - UI framework
- **Vite** - Build tool
- **Vitest** - Testing (87 tests, 100% passing)
- **CoinGecko API** - Data source
- **LocalStorage** - Client-side cache
- **Intl API** - Internationalization

## 🚀 Getting Started

### Development

```bash
# Install dependencies
npm install

# Run dev server (http://localhost:5173)
npm run dev

# Run tests
npm test

# Run tests with UI
npm test:ui

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

### Data Generation

```bash
# Generate mock data (for development)
npm run generate:data -- --test --mock

# Generate data for specific currency (requires API key)
COINGECKO_API_KEY=your_key npm run generate:data -- --currency=USD

# Generate all currencies (requires API key)
COINGECKO_API_KEY=your_key npm run generate:data
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Test Coverage

```
Test Files:  8 passed (8)
Tests:       87 passed (87)
├─ Setup:              3 tests
├─ Data Generation:   26 tests
├─ DCA Engine:        13 tests
├─ Cache Manager:     16 tests
├─ Data Loader:       10 tests
└─ i18n:              19 tests
```

## 🎨 Components

### Pages
- **Overview**: Manifesto + Recent months with regime visualization
- **DCASimulation**: Interactive simulator with results and insights
- **About**: Purpose, principles, and philosophy

### UI Components
- **Navigation**: Tab-based navigation between pages
- **Manifesto**: Educational philosophy display
- **MonthOverview**: Visual day distribution (positive/negative/lateral)
- **LoadingState**: Progressive loading feedback with phase tracking

### Hooks & Context
- **useData**: React hook for progressive data loading
- **I18nContext**: Language management with lazy loading

## 🗂️ Project Structure

```
pop/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts (I18n)
│   ├── hooks/           # Custom hooks (useData)
│   ├── lib/             # Core logic
│   │   ├── cacheManager.ts
│   │   ├── dataLoader.ts
│   │   ├── dcaEngine.ts
│   │   └── i18n.ts
│   └── types/           # TypeScript types
├── scripts/             # Data generation
│   ├── generateData.ts
│   └── lib/
├── tests/               # Test files
├── i18n/                # Translation files
├── public/
│   └── data/            # Generated data
└── package.json
```

## 📖 Documentation

- [CLAUDE.md](./CLAUDE.md) - Development guidelines
- [bitcoin_temporal_sacrifice_app_spec.md](./bitcoin_temporal_sacrifice_app_spec.md) - Product specification

## 🚢 Deployment

### GitHub Pages (Automated - Recommended)

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

**Quick Start:**

```bash
# 1. Create a GitHub repository named "pop"
# 2. Push your code
git remote add origin https://github.com/YOUR_USERNAME/pop.git
git branch -M main
git push -u origin main

# 3. Enable GitHub Pages
# Go to Settings → Pages → Source: GitHub Actions

# 4. Access your site
# https://YOUR_USERNAME.github.io/pop/
```

The workflow automatically:
- ✅ Runs all tests
- ✅ Type checks
- ✅ Builds production bundle
- ✅ Deploys to GitHub Pages

**Important:** Update the base path in `.github/workflows/deploy.yml` if your repo has a different name:
```yaml
VITE_BASE_PATH: '/your-repo-name/'
```

📖 **Full deployment guide:** See [DEPLOY.md](./DEPLOY.md) for detailed instructions, custom domains, and alternative platforms.

### Alternative Platforms

- **Vercel**: `vercel` (instant deployment)
- **Netlify**: Drag & drop `dist/`
- **Cloudflare Pages**: Connect repo

## 🧪 Testing Philosophy

Built with **TDD** (Test-Driven Development):
1. Write failing tests (RED)
2. Implement minimal code to pass (GREEN)
3. Refactor (REFACTOR)

All core logic has comprehensive test coverage.

## 🎯 Roadmap

- [ ] Add more languages (Arabic, Hebrew for RTL support)
- [ ] Key Days analysis page
- [ ] Export simulation results
- [ ] Dark mode
- [ ] PWA support (offline-first)

## 📄 License

MIT

---

**Disclaimer**: This is an educational tool. Not financial advice. Bitcoin teaches behavior, not profit.
