# Full-Stack Deployment Guide

## Your Deployment URLs
- **Frontend**: https://audit-log-oplr.vercel.app/
- **Backend**: https://audit-log-backend.onrender.com

---

## Step 1: Configure Backend on Render

### Environment Variables to Add in Render Dashboard:

```
MONGODB_URI = mongodb+srv://karanvishwajyoth:Changu%402210@cluster0.hjxkitr.mongodb.net/
JWT_SECRET = your_super_secret_jwt_key_change_this_in_production_123456789
JWT_EXPIRES_IN = 7d
NODE_ENV = production
PORT = (Render auto-assigns, leave empty or use 5000)
FRONTEND_URL = https://audit-log-oplr.vercel.app
```

**Important**: `FRONTEND_URL` must match your Vercel deployment exactly (including https://)

### Steps in Render Dashboard:
1. Go to your backend service
2. Click **Settings** → **Environment**
3. Add each variable above
4. Click **Deploy** (or redeploy)

---

## Step 2: Configure Frontend on Vercel

### Environment Variables to Add in Vercel Dashboard:

```
VITE_API_URL = https://audit-log-backend.onrender.com/api
```

### Steps in Vercel Dashboard:
1. Go to your project **Settings** → **Environment Variables**
2. Add `VITE_API_URL` with value: `https://audit-log-backend.onrender.com/api`
3. Make sure it's set for **Production** environment
4. Click **Save** and **Redeploy** (or trigger a manual deploy)

---

## Step 3: Verify Deployment

### Test Backend API:
Open in browser: `https://audit-log-backend.onrender.com/health`

Expected response:
```json
{
  "success": true,
  "message": "Audit Log API is running",
  "timestamp": "2026-05-05T...",
  "environment": "production"
}
```

### Check Console Logs:
In your browser's **DevTools** (F12) → **Console** tab:
- ✅ Should show: `✅ API Base URL configured: https://audit-log-backend.onrender.com/api`
- ❌ Should NOT show: `VITE_API_URL is not set`

### Test Simulate Buttons:
1. Go to https://audit-log-oplr.vercel.app
2. Sign in with Firebase
3. Scroll to "Simulate User Actions" section
4. Click "Simulate: Create Order"
5. Should see success message (not login error)

---

## Common Issues & Fixes

### Issue 1: "Error logging action. Please ensure you are logged in."
**Cause**: Backend unreachable or VITE_API_URL not set

**Fix**:
- ✅ Verify `VITE_API_URL` in Vercel dashboard
- ✅ Check `/health` endpoint returns 200
- ✅ Rebuild Vercel deployment

### Issue 2: CORS Error in Console
**Cause**: Backend doesn't recognize frontend origin

**Fix**:
- ✅ Set `FRONTEND_URL` on Render to exact Vercel URL
- ✅ Verify it includes `https://` (not `http://`)
- ✅ Redeploy backend

### Issue 3: ERR_CONNECTION_REFUSED
**Cause**: Frontend trying to call `localhost:5000` instead of deployed backend

**Fix**:
- ✅ Ensure `VITE_API_URL` is set in Vercel
- ✅ Check it's exactly: `https://audit-log-backend.onrender.com/api`
- ✅ Trigger rebuild (push to GitHub or manual deploy in Vercel)

### Issue 4: 401 Unauthorized Errors
**Cause**: Backend token invalid or expired

**Fix**:
- ✅ Sign out completely in app
- ✅ Sign in again with Firebase
- ✅ Make sure backend can create JWT token

### Issue 5: MongoDB Connection Error
**Cause**: `MONGODB_URI` not set or wrong on Render

**Fix**:
- ✅ Verify `MONGODB_URI` in Render environment variables
- ✅ Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- ✅ Redeploy backend

---

## Environment Variable Checklist

### Backend (Render)
- [ ] MONGODB_URI = Your MongoDB connection string
- [ ] JWT_SECRET = Secure secret key
- [ ] JWT_EXPIRES_IN = 7d (or your preference)
- [ ] NODE_ENV = production
- [ ] FRONTEND_URL = https://audit-log-oplr.vercel.app

### Frontend (Vercel)
- [ ] VITE_API_URL = https://audit-log-backend.onrender.com/api

### Local Development (.env.local)
- [ ] VITE_API_URL = http://localhost:5000/api (when running backend locally)

---

## Debugging Commands

### Check Backend Logs:
```bash
# In Render dashboard, click "Logs" tab to see real-time output
```

### Check Frontend Logs:
1. Open Vercel deployment → **Deployments** tab
2. Click the deployment → **Functions** tab
3. Or check browser DevTools → **Console**

### Local Testing:
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev
```

---

## Key Differences: Local vs Production

| Item | Local | Production |
|------|-------|------------|
| Backend URL | http://localhost:5000 | https://audit-log-backend.onrender.com |
| Frontend URL | http://localhost:5173 | https://audit-log-oplr.vercel.app |
| API Endpoint | http://localhost:5000/api | https://audit-log-backend.onrender.com/api |
| JWT in Code | Not needed (dev mode) | Required for production |
| VITE_API_URL | http://localhost:5000/api | https://audit-log-backend.onrender.com/api |
| FRONTEND_URL | http://localhost:5173 | https://audit-log-oplr.vercel.app |

---

## What Was Fixed

### 1. Frontend API Service (apiService.js)
- ✅ Explicit handling of VITE_API_URL
- ✅ No longer falls back to `window.location.origin + /api` (broken on Vercel)
- ✅ Better error messages with debugging hints
- ✅ Consistent response format

### 2. Error Messages (Home.jsx)
- ✅ More helpful alerts that guide users to check:
  - Firebase login status
  - Backend connectivity
  - Environment variable setup

### 3. Backend CORS (server.js)
- ✅ Added detailed logging of allowed origins
- ✅ Better error messages for CORS failures
- ✅ Explicit allowed methods and headers

### 4. Environment Configuration
- ✅ `.env.example` for local setup
- ✅ `.env.local` for development
- ✅ `.env.production` for production guidance

---

## Next Steps

1. **Update Vercel with `VITE_API_URL`**
   - Go to Vercel Settings → Environment Variables
   - Add: `VITE_API_URL = https://audit-log-backend.onrender.com/api`
   - Redeploy

2. **Verify Render has `FRONTEND_URL`**
   - Go to Render Settings → Environment
   - Add: `FRONTEND_URL = https://audit-log-oplr.vercel.app`
   - Redeploy

3. **Test the deployment**
   - Open https://audit-log-oplr.vercel.app/health
   - Sign in with Firebase
   - Click simulate buttons

4. **Monitor logs**
   - Check Render logs for backend issues
   - Check browser console for frontend issues
