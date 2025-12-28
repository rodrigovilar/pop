# Deployment Guide

## GitHub Pages (Recommended)

### Automatic Deployment (CI/CD)

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

#### Setup Steps:

1. **Create GitHub Repository**
   ```bash
   # On GitHub, create a new repository named "pop"
   # Then push your code:
   git remote add origin https://github.com/YOUR_USERNAME/pop.git
   git branch -M main
   git push -u origin main
   ```

2. **Configure GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy on every push to `main`

3. **Update Base Path** (if needed)
   - If your repo is named differently, update `.github/workflows/deploy.yml`:
     ```yaml
     VITE_BASE_PATH: '/your-repo-name/'
     ```

4. **Access Your Site**
   - Your site will be available at:
     ```
     https://YOUR_USERNAME.github.io/pop/
     ```

### Manual Deployment

If you prefer manual deployment:

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy:pages
```

## Vercel (Alternative)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Production Deployment**
   ```bash
   vercel --prod
   ```

## Netlify (Alternative)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --dir=dist --prod
   ```

## Custom Domain

### GitHub Pages with Custom Domain

1. Add a `CNAME` file to the `public/` folder:
   ```
   yourdomain.com
   ```

2. Configure DNS:
   - Add an `A` record pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or a `CNAME` record pointing to `YOUR_USERNAME.github.io`

3. Update `vite.config.ts`:
   ```typescript
   base: '/', // Change from '/pop/' to '/'
   ```

### Vercel/Netlify with Custom Domain

Follow the platform-specific instructions in their dashboards.

## Environment Variables

If you need to use real CoinGecko data:

1. **GitHub Actions**: Add secrets in repository settings
   ```
   Settings → Secrets → Actions → New repository secret
   Name: COINGECKO_API_KEY
   Value: your_api_key_here
   ```

2. **Local Development**: Create `.env` file
   ```bash
   COINGECKO_API_KEY=your_api_key_here
   ```

## Pre-deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] Type check passing (`npm run type-check`)
- [ ] Mock data generated (`npm run generate:data -- --test --mock`)
- [ ] Updated base path if needed
- [ ] Checked responsive design
- [ ] Tested in multiple browsers

## Post-deployment Verification

1. **Check all pages load**
   - Overview
   - DCA Simulation
   - About

2. **Test functionality**
   - Navigation works
   - DCA simulation calculates correctly
   - Data loads progressively
   - i18n works (if implemented)

3. **Performance**
   - Lighthouse score > 90
   - Bundle loads quickly
   - Images/data cached properly

## Troubleshooting

### 404 on GitHub Pages routes

GitHub Pages doesn't support client-side routing by default. Add a `404.html` that redirects to `index.html`:

```html
<!-- public/404.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/pop/'">
  </head>
</html>
```

### Base path issues

Make sure `VITE_BASE_PATH` matches your repository name:
- Repository: `https://github.com/user/pop` → `VITE_BASE_PATH: '/pop/'`
- Root domain: `https://user.github.io` → `VITE_BASE_PATH: '/'`

### Build fails in CI

Check GitHub Actions logs for specific errors. Common issues:
- Node version mismatch (use Node 20)
- Missing dependencies (run `npm ci`)
- TypeScript errors (run `npm run type-check` locally)

## Monitoring

- **GitHub Actions**: Check workflow runs in the "Actions" tab
- **Pages Status**: Check deployment status in Settings → Pages
- **Analytics**: Add Google Analytics or Plausible for usage tracking

## Rollback

To rollback to a previous version:

```bash
# Find the commit hash
git log --oneline

# Reset to previous commit
git reset --hard COMMIT_HASH

# Force push
git push -f origin main
```

Or redeploy a specific commit via GitHub Actions.
