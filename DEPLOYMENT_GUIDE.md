# Deployment Guide for .tech Domain

## ✅ What Will Work Automatically

1. **localStorage** - Browser-based, works on any domain
2. **Relative API paths** - Already using `/api/*` which works on any domain
3. **React Router** - Client-side routing works on any domain
4. **All UI components** - No domain-specific code

## ⚠️ What Needs Configuration

### 1. Environment Variables

Create a `.env.production` file for production:

```env
VITE_API_URL=https://your-domain.tech
VITE_APP_URL=https://your-domain.tech
```

### 2. Build Configuration

The app is already configured for production builds. Just run:

```bash
npm run build
```

This creates a `dist/` folder with all static files ready to deploy.

### 3. API Routes (if using separate backend)

If you have a separate backend server, update CORS settings:

**Backend (Python/FastAPI):**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-domain.tech",
        "http://localhost:3000"  # Keep for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Backend (Node.js/Express):**
```javascript
app.use(cors({
  origin: [
    'https://your-domain.tech',
    'http://localhost:3000'  // Keep for local dev
  ],
  credentials: true
}));
```

## 🚀 Deployment Options

### Option 1: Static Hosting (Recommended for Vite)

Since this is a Vite app, you can deploy it as static files:

**Netlify:**
1. Connect your GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

**Vercel:**
1. Import your project
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

**Cloudflare Pages:**
1. Connect repository
2. Build command: `npm run build`
3. Build output directory: `dist`

### Option 2: Self-Hosted on Your PC

If you want to host it on your PC:

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Serve with a simple HTTP server:**
   ```bash
   # Using Python
   cd dist
   python -m http.server 8000
   
   # Or using Node.js
   npx serve dist -p 8000
   ```

3. **Set up reverse proxy (nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.tech;
       
       location / {
           root /path/to/your/dist;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **For HTTPS (required for production):**
   - Use Let's Encrypt with Certbot
   - Or use Cloudflare for free SSL

## 📝 Pre-Deployment Checklist

- [ ] Update `.env.production` with your domain
- [ ] Run `npm run build` to test production build
- [ ] Test locally with `npm run preview`
- [ ] Update backend CORS settings (if separate backend)
- [ ] Update any hardcoded URLs in documentation (optional)
- [ ] Test authentication flow
- [ ] Test localStorage functionality
- [ ] Test API calls (if using backend)

## 🔧 Configuration Updates Needed

### Update vite.config.ts for Production

The current `vite.config.ts` has a dev proxy. This is fine - it only affects development. For production, you'll need to:

1. **If using same domain for API:**
   - No changes needed, relative paths work

2. **If using different domain for API:**
   - Update API calls to use environment variable:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || '';
   fetch(`${API_URL}/api/conversations`)
   ```

## 🌐 Domain-Specific Considerations

### localStorage
- ✅ Works on any domain
- ✅ Data is per-domain (your-domain.tech has separate storage from localhost)
- ⚠️ Users will need to sign up again on the new domain (data doesn't transfer)

### Cookies/Sessions
- ✅ Already using relative paths
- ✅ Will work on your domain automatically

### File System Access (Browser File API)
- ⚠️ Only works on `localhost` or `https://` domains
- ✅ Your .tech domain with HTTPS will work fine

## 🐛 Common Issues & Solutions

### Issue: API calls fail after deployment
**Solution:** Check CORS settings on backend, ensure your domain is whitelisted

### Issue: Routes return 404
**Solution:** Configure server to serve `index.html` for all routes (SPA routing)

### Issue: localStorage data missing
**Solution:** This is expected - localStorage is per-domain. Users need to sign up again.

### Issue: Build fails
**Solution:** Check Node.js version (should be 18+), run `npm install` fresh

## 📦 Production Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The `dist/` folder contains everything you need to deploy.

## 🔐 Security Considerations

1. **HTTPS Required:**
   - File System API requires HTTPS
   - Cookies work better with HTTPS
   - Modern browsers require HTTPS for many features

2. **Environment Variables:**
   - Never commit `.env.production` to git
   - Use your hosting platform's environment variable settings

3. **API Security:**
   - Add rate limiting
   - Validate all inputs
   - Use proper authentication

## ✅ Summary

**Good News:**
- ✅ App is ready for production deployment
- ✅ No hardcoded localhost in actual code (only in docs/examples)
- ✅ localStorage works on any domain
- ✅ Relative API paths work everywhere

**What to Do:**
1. Build the app: `npm run build`
2. Deploy `dist/` folder to your hosting
3. Update backend CORS (if separate backend)
4. Set up HTTPS (required for File API)

**When Moving to Your PC:**
- Same process - just build and serve
- Data in localStorage will be separate (per-domain)
- All functionality will work the same

The app is **production-ready**! 🚀


