# ⚡ Quick Start Guide - 5 Minutes to Running

This guide gets you from zero to running the application locally in 5 minutes.

## Prerequisites Checklist
- [ ] Node.js 16+ installed (`node --version`)
- [ ] MongoDB account (free at mongodb.com/cloud/atlas)
- [ ] Git installed
- [ ] Code editor open

## Step 1: MongoDB Setup (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account & cluster
3. Go to "Database Access" → Create user (save username/password)
4. Go to "Network Access" → Add IP 0.0.0.0/0 (for local dev)
5. Click "Connect" → "Connect Your Application"
6. Copy connection string (will look like: `mongodb+srv://user:pass@cluster.mongodb.net/hotel-booking?retryWrites=true`)
7. Replace `<password>` with your database user password

**Connection string example:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/hotel-booking?retryWrites=true
```

## Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Windows:
copy .env.example .env
# macOS/Linux:
cp .env.example .env

# Edit .env file and add your MongoDB connection string
# Open .env and replace the MONGODB_URI value

# Start backend server
npm run dev
```

✅ You should see: `✅ MongoDB Connected: cluster0.abc123.mongodb.net`
✅ Server running at: `http://localhost:5000`

## Step 3: Frontend Setup (1 minute)

In a **new terminal**:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
# Windows:
copy .env.example .env
# macOS/Linux:
cp .env.example .env

# Start frontend server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

## Test Login

Open http://localhost:5173 and:

1. Click "Sign Up" 
2. Create an account (use any valid email)
3. After signup, you're automatically logged in
4. There you go! 🎉

## Test as Admin

To see admin dashboard:

1. **Create admin account** (only first time):
   ```bash
   # Open MongoDB Atlas
   # Collections → Users → Insert Document
   # Paste:
   {
     "email": "admin@hotel.com",
     "username": "admin",
     "password": "$2a$10$...",  // bcryptjs hash of "Admin@123"
     "firstName": "Admin",
     "lastName": "User",
     "phone": "+1 (555) 123-4567",
     "role": "admin",
     "isActive": true,
     "emailVerified": true
   }
   ```

2. Login with email: `admin@hotel.com` and password: `Admin@123`

## Full Test Workflow

1. ✅ Navigate to http://localhost:5173
2. ✅ Sign up with your details
3. ✅ Click "Book a Table"
4. ✅ Select date (today or tomorrow)
5. ✅ Select time (between 10 AM - 10 PM)
6. ✅ Select number of guests
7. ✅ Available tables appear
8. ✅ Click table → Enter your details → Book
9. ✅ See confirmation with Booking ID
10. ✅ Go to "My Bookings" to see your booking

## Troubleshooting

### "Cannot find module 'express'"
```bash
cd backend
npm install
```

### "MongoDB connection failed"
- Check MongoDB connection string (no typos)
- Verify IP whitelist (should include 0.0.0.0/0 for local dev)
- Ensure database user has correct permissions

### "Cannot GET /api/v1/tables"
- Backend not running? Check http://localhost:5000/health
- Verify VITE_API_URL in frontend/.env is correct
- No spaces or typos in .env files

### "Vite failed to compile"
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Next: Deploy to Production

Once local development works:

1. Deploy backend to [Render](https://render.com)
2. Deploy frontend to [Vercel](https://vercel.com)
3. See DEPLOYMENT.md for step-by-step

## File Structure Tips

```
hotel-booking-system/
├── backend/
│   ├── src/
│   │   ├── index.ts        ← Start server here
│   │   ├── models/         ← Database schemas
│   │   └── routes/         ← API endpoints
│   ├── .env                ← Your secrets
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx         ← Main component
│   │   └── pages/          ← Page components
│   ├── .env                ← API URL
│   └── package.json
```

## Useful Commands

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 (optional) - MongoDB CLI
mongosh "YOUR_CONNECTION_STRING"

# Build for production
cd backend && npm run build
cd frontend && npm run build
```

## Common Errors & Quick Fixes

| Error | Fix |
|-------|-----|
| `Port 5000 already in use` | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| `Port 5173 already in use` | Kill process: `lsof -ti:5173 \| xargs kill -9` |
| `Cannot find MongoDB` | Check connection string in .env |
| `CORS error in console` | Frontend CORS_ORIGIN doesn't match your URL |
| `Module not found` | Run `npm install` again |

## Success Checklist ✅

- [ ] Backend running (http://localhost:5000/health returns OK)
- [ ] Frontend running (http://localhost:5173 loads)
- [ ] Can sign up/login
- [ ] Can see available tables
- [ ] Can create a booking
- [ ] Can view bookings in "My Bookings"
- [ ] Can cancel a booking

**If all checked: You're ready to deploy! 🚀**

---

For more details, see README.md and ARCHITECTURE.md
