# Restaurant Web App - Getting Started (Complete Guide)

Welcome to the Restaurant Web App! This comprehensive system includes 18 advanced features for managing a modern restaurant operation.

## 📋 Quick Overview

This is a full-stack restaurant management system built with:
- **Backend:** Node.js, Express, MongoDB, TypeScript
- **Frontend:** React, Tailwind CSS, TypeScript
- **Features:** 18 complete features including bookings, loyalty program, reviews, events, inventory, staff management, and more

---

## 🚀 Quick Start (5 minutes)

### 1. **Verify Your Setup**
Run the verification script for your OS:

**Windows:**
```bash
verify-setup.bat
```

**Mac/Linux:**
```bash
bash verify-setup.sh
```

This checks:
- Node.js and npm installed
- Required files present
- Environment setup
- Dependencies ready

### 2. **Automated Start**

**Windows:**
```bash
start-dev.bat
```

**Mac/Linux:**
```bash
bash start-dev.sh
```

This automatically:
- Creates `.env` files from templates
- Installs dependencies
- Starts backend (port 5000)
- Starts frontend (port 5173)

### 3. **Access the App**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/v1

### 4. **Test Login**
```
Email: john@example.com
Password: password123
```

---

## 📚 Documentation Structure

### For Setup & Installation
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre-launch verification

### For Features & API
- **[FEATURES_GUIDE.md](FEATURES_GUIDE.md)** - Complete feature documentation (2500+ lines)
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture overview
- **[FEATURES_GUIDE.md](FEATURES_GUIDE.md)** - All 18 features explained

### For Testing
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Comprehensive testing guide with test cases
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre-launch checklist

### Helper Scripts
- **[verify-setup.bat](verify-setup.bat)** - Windows verification
- **[verify-setup.sh](verify-setup.sh)** - Mac/Linux verification
- **[start-dev.bat](start-dev.bat)** - Windows development start
- **[start-dev.sh](start-dev.sh)** - Mac/Linux development start

---

## 🏗️ Project Structure

```
restaurant-web-app/
│
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Main server
│   │   ├── models/                  # 8 MongoDB models
│   │   ├── controllers/             # 8 feature controllers
│   │   ├── routes/                  # 8 route modules
│   │   ├── middleware/              # Auth & error handling
│   │   ├── utils/                   # Helpers & utilities
│   │   └── scripts/
│   │       └── seedAdvanced.ts      # Database seeding
│   ├── .env.example                 # Environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                  # Main app & routing
│   │   ├── pages/                   # 4 feature pages
│   │   ├── components/              # React components
│   │   ├── services/
│   │   │   └── bookingService.ts    # 30+ API methods
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Auth state management
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript types
│   │   └── utils/                   # i18n, formatters, QR codes
│   ├── .env.example                 # Environment template
│   ├── vite.config.ts              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS setup
│   └── package.json
│
├── Documentation/
│   ├── SETUP_GUIDE.md              # Setup instructions
│   ├── FEATURES_GUIDE.md           # Feature documentation
│   ├── ARCHITECTURE.md             # Architecture overview
│   ├── DEPLOYMENT_CHECKLIST.md     # Pre-launch checks
│   ├── TESTING_GUIDE.md            # Testing procedures
│   └── README.md
│
├── Auto-Run Scripts/
│   ├── verify-setup.bat/.sh        # Verification script
│   └── start-dev.bat/.sh           # Development start script
│
└── Legacy/
    └── restaurant-web-app-main/    # Original project files
```

---

## 📖 Step-by-Step Setup Guide

### Step 1: Environment Configuration

**Backend (.env)**
```bash
# Navigate to backend directory
cd backend

# Create .env from template
cp .env.example .env  # or copy on Windows

# Edit .env with:
# - MONGODB_URI=mongodb://localhost:27017/restaurant-app
# - JWT_SECRET=your-random-string (min 32 chars)
# - Stripe keys from Stripe dashboard
# - Email credentials for notifications
# - Admin credentials
```

**Frontend (.env.local)**
```bash
# Navigate to frontend directory
cd frontend

# Create .env.local from template
cp .env.example .env.local

# Edit .env.local with:
# - VITE_API_URL=http://localhost:5000/api/v1
# - VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
# - Language settings
# - Feature flags
```

### Step 2: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in separate terminal)
cd frontend
npm install
```

### Step 3: Database Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB
mongod

# From backend directory, seed data
npm run seed
```

**Option B: MongoDB Atlas**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Add connection string to backend/.env
4. Run `npm run seed`

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Expected Output:**
- Backend: "Server is running on port 5000"
- Frontend: "Local: http://localhost:5173"

---

## 🔑 Test Credentials

After running `npm run seed`, use these accounts:

```
Admin Account:
  Email: admin@restaurant.com
  Password: password123

Regular User 1:
  Email: john@example.com
  Password: password123

Regular User 2:
  Email: jane@example.com
  Password: password123
```

---

## 🎯 18 Features Implemented

### Core Restaurant Features
1. **User Authentication** - Registration, login, logout, JWT tokens
2. **Table Booking System** - Make, view, modify, cancel reservations
3. **Restaurant Menu** - Browse categories, dietary filters, ratings
4. **Review & Ratings** - Submit reviews, 5-star ratings, helpful voting

### Customer Experience
5. **Loyalty Program** - Tier system (Bronze/Silver/Gold/Platinum), points tracking
6. **Promotions & Discounts** - Promo codes, referral program, code validation
7. **Multi-Language Support** - English, Spanish, French
8. **QR Code Generation** - Booking QR codes, downloadable formats

### Advanced Features
9. **Group Event Booking** - 3-step wizard, event packages, proposals
10. **Payment Integration** - Stripe payments, secure transactions
11. **Kitchen Display System** - Order tracking, status updates
12. **Email Notifications** - Booking confirmations, reviews, alerts

### Operations & Management
13. **Admin Dashboard** - Analytics, statistics, user management
14. **Menu Management** - Add/edit/delete items, availability control
15. **Staff Management** - Employee records, roles, performance ratings
16. **Inventory Management** - Stock tracking, expiry dates, low stock alerts
17. **Order Management** - Pre-orders, payment tracking, bill splitting
18. **Referral Program** - Unique codes, reward tracking, automatic distribution

---

## 🧪 Testing

Before deploying, run the testing guide:

```bash
cd frontend
# Access all pages and test features

# Visit:
# - http://localhost:5173 (home)
# - http://localhost:5173/menu (menu)
# - http://localhost:5173/book (booking)
# - http://localhost:5173/reviews (reviews)
# - http://localhost:5173/loyalty (loyalty)
# - http://localhost:5173/group-events (events)
# - http://localhost:5173/admin (admin dashboard)
```

See **[TESTING_GUIDE.md](TESTING_GUIDE.md)** for comprehensive test cases.

---

## 🚨 Troubleshooting

### Frontend not loading
```
❌ Problem: Cannot connect to API
✅ Solution: Check if backend is running on port 5000
```

### Backend won't start
```
❌ Problem: Cannot connect to database
✅ Solution: Ensure MongoDB is running or check MONGODB_URI in .env
```

### Port already in use
```
❌ Problem: Port 5000 already in use
✅ Windows: netstat -ano | findstr :5000, then kill process
✅ Mac/Linux: lsof -i :5000, then kill process
```

### Missing dependencies
```
❌ Problem: npm install fails
✅ Solution: 
  - npm cache clean --force
  - Delete node_modules/
  - npm install again
```

---

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/restaurant-app` |
| `JWT_SECRET` | Auth token secret | Random 32+ char string |
| `PORT` | Backend port | `5000` |
| `STRIPE_SECRET_KEY` | Stripe secret | `sk_test_...` |
| `SMTP_USER` | Email address | `your-email@gmail.com` |
| `ADMIN_EMAIL` | Admin account | `admin@restaurant.com` |

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api/v1` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe public | `pk_test_...` |
| `VITE_DEFAULT_LANGUAGE` | Default language | `en` |
| `VITE_ENABLE_*` | Feature flags | `true` |

---

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`

### Change Branding
- Logo: `frontend/public/logo.png`
- App name: Update in components and config

### Add Features
1. Create model in `backend/src/models/`
2. Add controller in `backend/src/controllers/`
3. Add routes in `backend/src/routes/`
4. Create frontend component/page
5. Add service methods to `bookingService.ts`

---

## 🚀 Deployment

### Deploy Backend
```bash
# Build
npm run build

# Deploy to Heroku
heroku create restaurant-api
git push heroku main
```

### Deploy Frontend
```bash
# Build
npm run build

# Deploy to Vercel
npm install -g vercel
vercel

# Or deploy to Netlify
# Connect GitHub repo and deploy
```

---

## 📊 API Documentation

All endpoints documented in **[FEATURES_GUIDE.md](FEATURES_GUIDE.md)**

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
```
Header: Authorization: Bearer <JWT_TOKEN>
```

### Example Request
```bash
curl -X POST http://localhost:5000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token" \
  -d '{"date":"2024-02-20","time":"19:00","partySize":4}'
```

---

## 💡 Next Steps

1. **Explore the Code**
   - Review `backend/src/models/` for data structure
   - Check `backend/src/controllers/` for business logic
   - Study `frontend/src/services/bookingService.ts` for API integration

2. **Customize for Your Business**
   - Update menu items
   - Configure pricing
   - Add business rules
   - Customize email templates

3. **Add More Features**
   - Online ordering
   - Delivery tracking
   - Membership features
   - Advanced analytics

4. **Deploy to Production**
   - Set up production database
   - Configure live Stripe keys
   - Set up email service
   - Deploy to hosting provider

5. **Monitor & Maintain**
   - Check logs for errors
   - Monitor database performance
   - Collect user feedback
   - Plan updates and improvements

---

## 📞 Support Resources

- **MongoDB Docs:** https://docs.mongodb.com
- **Express.js:** https://expressjs.com
- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Stripe Docs:** https://stripe.com/docs
- **Vite:** https://vitejs.dev

---

## 📄 License

MIT License - See LICENSE file for details

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Can login with test credentials
- [ ] Menu displays all items
- [ ] Can make a booking
- [ ] Loyalty page shows points
- [ ] Admin dashboard accessible
- [ ] No console errors
- [ ] Database has sample data

---

## 🎉 You're Ready!

Your Restaurant Web App is fully configured and ready to use. Start exploring the features, customize for your business, and deploy when ready!

**Questions?** See the detailed guides:
- Setup issues → [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Features → [FEATURES_GUIDE.md](FEATURES_GUIDE.md)
- Testing → [TESTING_GUIDE.md](TESTING_GUIDE.md)
- Architecture → [ARCHITECTURE.md](ARCHITECTURE.md)

**Last Updated:** 2024 | **Version:** 1.0.0
