# GitHub Setup Guide

## 🚀 Quick Start - Push to GitHub

### 1. Create GitHub Repository

Go to [github.com/new](https://github.com/new) and create a new repository:

- **Repository name:** `pop` (or your preferred name)
- **Description:** PoP - Proof of Patience: Educational Bitcoin app teaching discipline and low time preference
- **Visibility:** Public (required for free GitHub Pages)
- **DO NOT** initialize with README, .gitignore, or license (we already have them)

### 2. Push Your Code

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/pop.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main
```

### 3. Configure CoinGecko API Key (Required)

The app needs real Bitcoin price data from CoinGecko.

1. **Get your FREE API key:**
   - Go to https://www.coingecko.com/en/developers/dashboard
   - Create account (free)
   - Copy your "Demo API Key" (starts with `cg-demo-`)

2. **Add to GitHub Secrets:**
   - Go to your repo: https://github.com/YOUR_USERNAME/pop/settings/secrets/actions
   - Click **"New repository secret"**
   - Name: `COINGECKO_API_KEY`
   - Secret: Paste your key (e.g., `cg-demo-xxxxx`)
   - Click **"Add secret"**

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

That's it! GitHub Actions will automatically:
- Fetch real Bitcoin data from CoinGecko (20 currencies!)
- Build your project
- Run all tests
- Deploy to GitHub Pages

### 5. Access Your Site

Your site will be live at:
```
https://YOUR_USERNAME.github.io/pop/
```

First deployment takes 2-3 minutes. Check progress in the **Actions** tab.

## 🔧 Configuration

### Update Repository Name

If you named your repo differently (e.g., `proof-of-patience`):

1. Edit `.github/workflows/deploy.yml`:
   ```yaml
   # Line 48-50
   VITE_BASE_PATH: '/proof-of-patience/'  # Change 'pop' to your repo name
   ```

2. Commit and push:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Update base path for deployment"
   git push
   ```

### Use Custom Domain

If you have a custom domain (e.g., `pop.yoursite.com`):

1. Create `public/CNAME`:
   ```bash
   echo "pop.yoursite.com" > public/CNAME
   ```

2. Update `vite.config.ts`:
   ```typescript
   base: '/',  // Change from process.env.VITE_BASE_PATH
   ```

3. Configure DNS (in your domain provider):
   - **A Records** (for apex domain):
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME Record** (for subdomain):
     ```
     pop.yoursite.com → YOUR_USERNAME.github.io
     ```

4. In GitHub Settings → Pages:
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## 🔍 Verify Deployment

### Check Workflow Status

1. Go to **Actions** tab in your repository
2. Look for "Deploy to GitHub Pages" workflow
3. Should see a green checkmark ✅

### Test Your Site

Visit your deployed site and verify:
- [ ] All 3 pages load (Overview, DCA, About)
- [ ] Navigation works
- [ ] DCA simulation calculates
- [ ] Data loads progressively
- [ ] No console errors (F12 → Console)

### Common Issues

**404 Error on Load:**
- Check `VITE_BASE_PATH` in deploy.yml matches repo name
- Ensure GitHub Pages is enabled in Settings

**Workflow Failed:**
- Check Actions tab for error details
- Usually: TypeScript errors or test failures
- Fix locally, commit, and push again

**Blank Page:**
- Check browser console for errors
- Verify base path is correct
- Check network tab for failed asset loads

## 📊 Monitor

### GitHub Actions

Every push to `main` triggers:
1. **CI Workflow** (checks code quality)
2. **Deploy Workflow** (deploys to Pages)

View in **Actions** tab.

### Site Analytics (Optional)

Add Google Analytics or Plausible:

1. Create analytics account
2. Get tracking code
3. Add to `index.html` or create analytics hook

## 🔄 Update Workflow

### Deploy on Tag (instead of every push)

Edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    tags:
      - 'v*'  # Deploy only on version tags
```

Then deploy with:
```bash
git tag v0.1.0
git push origin v0.1.0
```

### Deploy Multiple Branches

Add preview deployments for PRs:

```yaml
on:
  pull_request:
    branches:
      - main
```

## 🎯 Next Steps

After successful deployment:

1. **Share Your Site**
   - Add URL to repository description
   - Share with Bitcoin educators
   - Post on social media

2. **Add Badges** to README.md:
   ```markdown
   ![Deploy](https://github.com/YOUR_USERNAME/pop/workflows/Deploy/badge.svg)
   ![CI](https://github.com/YOUR_USERNAME/pop/workflows/CI/badge.svg)
   ```

3. **Monitor Usage**
   - GitHub Stars
   - Analytics (if added)
   - User feedback

4. **Iterate**
   - Add more features
   - Improve based on feedback
   - Keep educational focus

## 🆘 Support

- **GitHub Issues**: [github.com/YOUR_USERNAME/pop/issues](https://github.com/YOUR_USERNAME/pop/issues)
- **GitHub Discussions**: Enable in Settings → Features
- **Documentation**: See [DEPLOY.md](./DEPLOY.md) for advanced topics

## 🎉 Success Checklist

- [x] Code built successfully locally
- [x] All 87 tests passing
- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Enabled GitHub Pages
- [ ] Workflow deployed successfully
- [ ] Site accessible at github.io URL
- [ ] All pages working correctly
- [ ] Ready to share with the world!
