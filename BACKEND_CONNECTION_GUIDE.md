# 🚀 Complete Backend Deployment & Connection Guide

## 📋 What's the Problem?

Your frontend shows "Failed to fetch" because:
1. ❌ Your backend URL requires authentication (not publicly accessible)
2. ❌ Backend might not be deployed correctly on Vercel
3. ❌ CORS might be blocking requests

---

## 🛠️ Step-by-Step Solution

### **STEP 1: Deploy Backend to Vercel Correctly**

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

5. **Copy the deployment URL** (something like: `https://your-backend.vercel.app`)

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Set **Root Directory** to `backend`
5. Click "Deploy"
6. Copy your deployment URL

---

### **STEP 2: Test Your Backend**

After deployment, test if it works:

**Test in Browser:**
- Visit: `https://YOUR-BACKEND-URL.vercel.app/`
- You should see: `{"message": "NASA App Backend API", "status": "running"}`

**Test Health Endpoint:**
- Visit: `https://YOUR-BACKEND-URL.vercel.app/health`
- You should see: `{"status": "healthy"}`

---

### **STEP 3: Update Your Frontend Configuration**

1. **Update `.env.local`** (already in your project):
   ```env
   NEXT_PUBLIC_API_URL=https://YOUR-ACTUAL-BACKEND-URL.vercel.app
   ```
   Replace `YOUR-ACTUAL-BACKEND-URL` with your real backend URL from Step 1.

2. **Restart your development server**:
   ```bash
   cd frontend/itp-nasa-app
   npm run dev
   ```
   ⚠️ **Important**: You MUST restart after changing .env.local!

---

### **STEP 4: Update Backend CORS**

Your backend needs to allow requests from your frontend domain.

In `backend/main.py`, update the CORS origins:
```python
allow_origins=[
    "http://localhost:3000",  # For local development
    "https://your-frontend.vercel.app",  # Your actual frontend URL
    "*"  # Temporarily allow all (remove in production!)
]
```

After updating, **redeploy your backend**:
```bash
cd backend
vercel --prod
```

---

## 🔍 Debugging: How to Find Issues

### **1. Check Browser Console**

Open Developer Tools (F12) → Console tab. You'll see:
```
🔍 Calling API: https://...
📦 Payload: {...}
📡 Response status: ...
✅ Response data: ... (or ❌ Error: ...)
```

### **2. Common Errors & Solutions**

| Error | Cause | Solution |
|-------|-------|----------|
| `Failed to fetch` | Backend not accessible | Check if backend URL is correct and accessible |
| `CORS error` | Backend doesn't allow frontend domain | Update CORS in backend |
| `404 Not Found` | Wrong endpoint | Check if endpoint is `/api/calculate-sum` |
| `500 Internal Server Error` | Backend code error | Check backend logs on Vercel |

---

## 📝 Quick Checklist

- [ ] Backend deployed to Vercel successfully
- [ ] Backend URL accessible in browser (shows JSON response)
- [ ] `.env.local` has correct `NEXT_PUBLIC_API_URL`
- [ ] Frontend development server restarted after .env change
- [ ] CORS configured with correct frontend URL
- [ ] Browser console shows detailed logs when clicking "Analyze"

---

## 🎯 Testing the Complete Flow

1. **Start your frontend**:
   ```bash
   cd frontend/itp-nasa-app
   npm run dev
   ```

2. **Open browser** to http://localhost:3000

3. **Open Developer Tools** (F12) → Console tab

4. **Enter some data** in the form (any numbers)

5. **Click "Analyze"**

6. **Check the console** - you should see:
   ```
   🔍 Calling API: https://your-backend.vercel.app/api/calculate-sum
   📦 Payload: {sy_snum: 1, sy_pnum: 2, ...}
   📡 Response status: 200
   ✅ Response data: {sum: 123.45, message: "...", field_count: 5}
   ```

7. **Check the UI** - you should see a green box with the result!

---

## 🆘 Still Not Working?

Share with me:
1. Your backend URL (from Vercel)
2. What you see in browser console (the 🔍 📦 📡 messages)
3. Any error messages in the UI

---

## 📚 What You Learned

1. **Environment Variables**: Frontend uses `.env.local` to store configuration
2. **CORS**: Backend must explicitly allow frontend domain
3. **API Communication**: Frontend uses `fetch()` to call backend
4. **Error Handling**: Always add try-catch and show errors to users
5. **Debugging**: Browser console is your best friend!
6. **Deployment**: Vercel needs specific config files (vercel.json, requirements.txt)

---

## 🎓 Key Concepts

### What is CORS?
**C**ross-**O**rigin **R**esource **S**haring - a security feature that controls which websites can call your API.

### Why "Failed to fetch"?
This error happens when the browser cannot connect to the backend. Reasons:
- Backend not running/deployed
- Wrong URL
- Network issue
- CORS blocking

### Environment Variables
Variables that change based on environment (development vs production):
- `NEXT_PUBLIC_API_URL` - tells frontend where backend is
- Must restart app after changing .env files!

---

Good luck! 🚀
