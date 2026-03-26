# Vape Menu Display - Deployment Guide

This guide covers deploying the API server and frontend to Vercel and/or Railway.

## Prerequisites

- Node.js and pnpm installed
- GitHub repository connected to Vercel/Railway
- MongoDB Atlas account (or self-hosted MongoDB)

---

## Part 1: Backend API Server Deployment

### Option A: Vercel Deployment (Recommended for ease)

#### Step 1: GitHub Push (Already Done ✅)

Your code is already pushed to `Smoke-Haven/Smoke-Haven-Catalog`.

#### Step 2: Configure Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project `smoke-haven-catalog-api-server`
3. Go to **Settings → Environment Variables**
4. Add the following variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `mongodb+srv://user:pass@cluster.mongodb.net/vapedb?retryWrites=true&w=majority` | Your MongoDB Atlas connection string |
| `PORT` | `3001` | Default port (Vercel will override) |
| `NODE_ENV` | `production` | Must be production |

**How to get MongoDB Atlas connection string:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Choose your cluster → **Connect**
3. Choose **Drivers** → **Node.js**
4. Copy the connection string
5. Replace `<username>`, `<password>`, and database name as needed

#### Step 3: Redeploy on Vercel

1. Go to Vercel Dashboard → Your project
2. Go to **Deployments**
3. Click the three dots (⋯) on the latest deployment
4. Select **Redeploy**
5. Confirm deployment

The build error should now be fixed. Wait for deployment to complete.

#### Step 4: Get Your Backend URL

Once deployed successfully, you'll see a URL like:
```
https://smoke-haven-catalog-api-server-xxx.vercel.app
```

Save this URL for frontend configuration.

---

### Option B: Railway Deployment (Better Free Tier)

Railway offers a more generous free tier. If you prefer Railway for the backend:

#### Step 1: Connect GitHub to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select `Smoke-Haven/Smoke-Haven-Catalog`
5. Select the repository

#### Step 2: Configure Build Settings

Railway will auto-detect your project. Ensure:
- **Root Directory**: `artifacts/api-server` (if mono-repo)
- **Build Command**: `pnpm install && pnpm run build`
- **Start Command**: `node --enable-source-maps ./dist/index.mjs`

#### Step 3: Add Environment Variables

1. In Railway dashboard → **Variables**
2. Add:
   - `DATABASE_URL`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - `PORT`: `3001` (Railway will assign dynamically)

#### Step 4: Deploy

Click **Deploy** and wait for completion.

#### Step 5: Get Backend URL

Railway provides a public URL. You'll find it in the **Deployments** tab or under **Networking**.

---

## Part 2: Frontend Deployment

### Deploy Frontend to Vercel

#### Step 1: Select Frontend Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import `Smoke-Haven/Smoke-Haven-Catalog` again
4. Select the repository

#### Step 2: Configure Build Settings

When Vercel asks for project settings:

- **Root Directory**: `artifacts/vape-menu`
- **Framework Preset**: Vite
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`

#### Step 3: Add Environment Variables

Click **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend-domain.vercel.app` (or Railway URL) |

If using Vercel for both:
```
VITE_API_URL=https://smoke-haven-catalog-api-server-xxx.vercel.app
```

#### Step 4: Deploy

Click **Deploy** and wait for completion.

Once done, you'll get a frontend URL like:
```
https://smoke-haven-catalog-xxx.vercel.app
```

---

## Part 3: Update Frontend API Configuration

### Update the API Client

The frontend uses `@workspace/api-client-react` which has a `setBaseUrl()` function.

#### Location: `artifacts/vape-menu/src/App.tsx` or `main.tsx`

Add this at the very top of your app initialization:

```typescript
import { setBaseUrl } from "@workspace/api-client-react";

// Initialize API base URL on app start
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
setBaseUrl(apiUrl);
```

Or in the entry point (`main.tsx`):

```typescript
import { setBaseUrl } from "@workspace/api-client-react";

// Set API base URL before React renders
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
setBaseUrl(apiUrl);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

## Verification Checklist

- [ ] API server deployed to Vercel/Railway
- [ ] MongoDB connection successful (check deployment logs)
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable `VITE_API_URL` set correctly
- [ ] API client `setBaseUrl()` configured in frontend
- [ ] Test API endpoint: `https://your-api-domain/api/health`
- [ ] Test menu endpoint: `https://your-api-domain/api/menu`
- [ ] Frontend can fetch menu items from API

---

## Troubleshooting

### Build Fails on Vercel

**Issue:** TypeScript errors during build

**Solution:** 
- Ensure all type annotations are correct
- Check that dependencies are installed (`pnpm install`)
- Clear cache: Vercel Dashboard → Settings → clear cache

### API Connection Fails

**Issue:** Frontend can't reach backend (CORS error)

**Solution:**
- Verify `VITE_API_URL` is set in Vercel
- Check that backend CORS is configured (see `app.ts` - it has `cors()`)
- Verify backend URL is accessible from browser

### MongoDB Connection Error

**Issue:** `DATABASE_URL` not found

**Solution:**
- Verify `DATABASE_URL` is set in Vercel/Railway environment variables
- Test connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/db`
- Check MongoDB Atlas firewall allows Vercel/Railway IPs (usually "Allow from anywhere")

### Port Issues

**Issue:** "PORT environment variable not found"

**Solution:**
- `vercel.json` should handle this automatically
- If issues persist, explicitly set `PORT=3001` in environment variables

---

## Production URLs Summary

After deployment, you should have:

- **Backend API**: `https://smoke-haven-catalog-api-server-xxx.vercel.app`
  - Health check: `GET /api/health`
  - Menu items: `GET /api/menu`

- **Frontend**: `https://smoke-haven-catalog-frontend-xxx.vercel.app`
  - Environment variable: `VITE_API_URL=<backend-url>`

---

## Next Steps

After deployment:
1. Test the frontend in production
2. Verify all API endpoints work
3. Monitor logs on Vercel/Railway Dashboard
4. Set up custom domain if needed
5. Configure analytics and monitoring

