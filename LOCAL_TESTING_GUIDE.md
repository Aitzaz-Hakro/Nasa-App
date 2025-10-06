# 🧪 Local Testing Guide (Before Deploying to Vercel)

## Test Your Backend Locally First!

Before deploying to Vercel, let's make sure everything works locally.

---

## 🏃 Step 1: Run Backend Locally

### Install Dependencies:
```bash
cd backend
pip install fastapi uvicorn pydantic
```

### Start Backend Server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Test Backend:
Open browser to: http://localhost:8000

You should see:
```json
{"message": "NASA App Backend API", "status": "running"}
```

---

## 🎨 Step 2: Update Frontend to Use Local Backend

### Update `.env.local`:
```env
# Use local backend for testing
NEXT_PUBLIC_API_URL=http://localhost:8000

# Comment out Vercel URL for now
# NEXT_PUBLIC_API_URL=https://exovision-4plewpcr5-razakhan143s-projects.vercel.app
```

### Restart Frontend:
```bash
cd frontend/itp-nasa-app
npm run dev
```

---

## 🧪 Step 3: Test Complete Flow

1. **Backend running?** Check http://localhost:8000
2. **Frontend running?** Check http://localhost:3000
3. **Open DevTools** (F12) → Console
4. **Fill form** with any data
5. **Click Analyze**
6. **Check console** for logs
7. **Check UI** for results

---

## ✅ If It Works Locally

Great! Now you know:
- ✅ Your code is correct
- ✅ Frontend can call backend
- ✅ The issue is deployment-related

**Next step:** Deploy backend correctly to Vercel (see BACKEND_CONNECTION_GUIDE.md)

---

## ❌ If It Doesn't Work Locally

Check these:

### Backend not starting?
```bash
# Check if port 8000 is already in use
netstat -ano | findstr :8000

# Kill the process if needed (use PID from above)
taskkill /PID <PID> /F
```

### Frontend can't connect?
- Make sure `.env.local` has `http://localhost:8000` (not https!)
- Restart frontend after changing .env
- Check CORS settings in backend

### CORS error in console?
Update `main.py`:
```python
allow_origins=["*"]  # Allow all for local testing
```

---

## 📊 Expected Console Output (Success)

```
🔍 Calling API: http://localhost:8000/api/calculate-sum
📦 Payload: {sy_snum: 1, sy_pnum: 2, disc_year: 2020, ...}
📡 Response status: 200
✅ Response data: {
  sum: 2023,
  message: "Successfully calculated sum of 3 non-zero fields",
  field_count: 3
}
```

---

## 🎯 Quick Local Test Commands

### Terminal 1 (Backend):
```bash
cd d:\Nasa App\backend
uvicorn main:app --reload --port 8000
```

### Terminal 2 (Frontend):
```bash
cd "d:\Nasa App\frontend\itp-nasa-app"
npm run dev
```

### Browser:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend Health: http://localhost:8000/health

---

Good luck! 🚀
