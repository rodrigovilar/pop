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

## 🏗️ Architecture

- **Static-only**: No backend, no auth, fully static hosting
- **Preprocessed data**: Monthly sharded JSON files
- **Progressive loading**: Optimized for performance
- **LocalStorage cache**: LRU eviction, quota monitoring
- **i18n**: ~20 languages supported
- **Multi-currency**: ~20 currencies, independent datasets

## 📦 Tech Stack

- TypeScript
- React 18
- Vite
- Vitest (TDD)
- CoinGecko API (data source)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests
npm test

# Run tests with UI
npm test:ui

# Generate data
npm run generate:data

# Build for production
npm run build
```

## 📖 Documentation

See [CLAUDE.md](./CLAUDE.md) for development guidelines and architecture details.

See [bitcoin_temporal_sacrifice_app_spec.md](./bitcoin_temporal_sacrifice_app_spec.md) for complete product specification.

## 📄 License

MIT
