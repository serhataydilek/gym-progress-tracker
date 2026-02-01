# Deployment Guide

This guide will help you deploy the Gym Progress Tracker to GitHub Pages or Vercel.

## Option 1: GitHub Pages (Recommended)

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Name it: `gym-progress-tracker` (or any name you prefer)
4. Keep it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README (we already have one)
6. Click **Create repository**

### Step 2: Push Your Code

Run these commands in your terminal (in the gym folder):

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/gym-progress-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy your site

### Step 4: Access Your Site

After a few minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/gym-progress-tracker/
```

The GitHub Action will automatically rebuild and deploy whenever you push changes!

---

## Option 2: Vercel (Alternative - Easier Setup)

Vercel is even easier and provides better performance.

### Step 1: Push to GitHub

Follow steps 1-2 from GitHub Pages above.

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **Add New** → **Project**
4. Import your `gym-progress-tracker` repository
5. Click **Deploy**

That's it! Vercel will:
- Automatically detect it's a Vite project
- Build and deploy it
- Give you a URL like: `gym-progress-tracker.vercel.app`
- Auto-deploy on every push to main

---

## Option 3: Netlify (Alternative)

1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click **Add new site** → **Import an existing project**
4. Choose your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **Deploy**

---

## Updating Your Site

After initial deployment, just push changes to GitHub:

```bash
git add .
git commit -m "Your update message"
git push
```

The site will automatically rebuild and deploy!

---

## Custom Domain (Optional)

### For GitHub Pages:
1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In your repo: Settings → Pages → Custom domain
3. Add your domain and follow DNS instructions

### For Vercel/Netlify:
1. Go to project settings → Domains
2. Add your custom domain
3. Follow DNS instructions

---

## Troubleshooting

### GitHub Pages not working?
- Make sure repository is **Public**
- Check Actions tab for build errors
- Verify Pages is set to **GitHub Actions** source

### Build failing?
- Check the Actions tab for error logs
- Ensure all dependencies are in package.json
- Try building locally first: `npm run build`

### Site loads but blank page?
- Check browser console for errors
- Verify `base: './'` is in vite.config.js
- Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## Next Steps

After deployment:
1. Share your site URL with friends!
2. Add it to your GitHub profile README
3. Consider adding:
   - Custom domain
   - Analytics (Google Analytics, Plausible)
   - Error tracking (Sentry)
