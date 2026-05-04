# ✅ Deployment Checklist

## IMMEDIATE ACTIONS REQUIRED

### 1. Update Vercel (Frontend) ⚠️ DO THIS FIRST
- [ ] Go to: https://vercel.com/dashboard
- [ ] Select your project: `audit-log-oplr`
- [ ] Click **Settings** → **Environment Variables**
- [ ] Add new variable:
  - Key: `VITE_API_URL`
  - Value: `https://audit-log-backend.onrender.com/api`
  - Select: **Production**
- [ ] Click **Save**
- [ ] Go to **Deployments** tab
- [ ] Click **Redeploy** on the latest deployment
- [ ] Wait for ✅ (Usually 2-5 minutes)

### 2. Verify Render (Backend) Has All Env Vars ⚠️
- [ ] Go to: https://dashboard.render.com
- [ ] Select backend service: `audit-log-backend` (or similar)
- [ ] Click **Settings** → **Environment**
- [ ] Verify these exist:
  - [ ] `MONGODB_URI` = `mongodb+srv://karanvishwajyoth:Changu%402210@cluster0.hjxkitr.mongodb.net/`
  - [ ] `JWT_SECRET` = `your_super_secret_jwt_key_change_this_in_production_123456789`
  - [ ] `JWT_EXPIRES_IN` = `7d`
  - [ ] `NODE_ENV` = `production`
  - [ ] `FRONTEND_URL` = `https://audit-log-oplr.vercel.app`
- [ ] If any missing, click **Add Environment Variable**
- [ ] If any changed, click **Deploy**
- [ ] Wait for ✅ (Usually 2-5 minutes)

### 3. Test Backend Health ✅
- [ ] Open in browser: `https://audit-log-backend.onrender.com/health`
- [ ] Should see JSON response with `"success": true`
- [ ] If 404 or timeout → Backend not deployed correctly

### 4. Test Frontend ✅
- [ ] Open: `https://audit-log-oplr.vercel.app`
- [ ] Open DevTools (F12) → **Console** tab
- [ ] Should see: `✅ API Base URL configured: https://audit-log-backend.onrender.com/api`
- [ ] Sign in with Firebase
- [ ] Scroll to "Simulate User Actions"
- [ ] Click "Simulate: Create Order"
- [ ] Should show: `✅ Order Action Logged successfully!`
- [ ] If error, check console for details

---

## If Still Having Issues

### Error: "Failed to fetch" or "ERR_CONNECTION_REFUSED"
1. [ ] Verify `VITE_API_URL` is exactly: `https://audit-log-backend.onrender.com/api`
2. [ ] Check backend is running (test `/health`)
3. [ ] Redeploy Vercel frontend

### Error: CORS Error in Console
1. [ ] Verify `FRONTEND_URL` on Render is exactly: `https://audit-log-oplr.vercel.app`
2. [ ] Redeploy Render backend
3. [ ] Hard refresh browser (Ctrl+Shift+R)

### Error: "Please ensure you are logged in"
1. [ ] Sign out completely
2. [ ] Sign in again with Firebase
3. [ ] Try simulate button again
4. [ ] Check browser console for detailed error

### Error: MongoDB Connection Failed
1. [ ] Verify `MONGODB_URI` on Render
2. [ ] Check MongoDB Atlas allows `0.0.0.0/0` IP whitelist
3. [ ] Redeploy Render backend

---

## Files Modified

✅ **Frontend**
- `src/services/apiService.js` - Better API URL handling
- `src/pages/Home.jsx` - Better error messages
- `.env.local` - Local development config
- `.env.example` - Template for setup
- `.env.production` - Production guidance

✅ **Backend**
- `server.js` - Improved CORS logging

✅ **Documentation**
- `DEPLOYMENT_GUIDE.md` - Complete reference
- This file - Quick checklist

---

## Success Indicators ✅

After completing all steps above, you should see:

1. ✅ Frontend loads at `https://audit-log-oplr.vercel.app`
2. ✅ Console shows: `✅ API Base URL configured: https://audit-log-backend.onrender.com/api`
3. ✅ Backend `/health` endpoint returns 200
4. ✅ Can sign in with Firebase
5. ✅ Simulate buttons work without errors
6. ✅ Logs appear in Admin Dashboard

---

## Time Estimate
- Setting env vars: ~5 minutes
- Redeployment wait: ~5-10 minutes
- Testing: ~5 minutes
- **Total: ~15-20 minutes**

---

## Need Help?

Check these in order:
1. Browser Console (F12) for error messages
2. Render Logs tab for backend errors
3. Vercel Deployment logs for frontend errors
4. `DEPLOYMENT_GUIDE.md` for detailed troubleshooting
