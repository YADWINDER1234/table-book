# Restaurant Web App - Setup & Deployment Guide

## Quick Start (2-3 minutes)

### Prerequisites
- Node.js 14+ and npm installed
- MongoDB running locally (or MongoDB Atlas account)
- Git installed

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Update .env with your configuration:
# - MONGODB_URI (local or Atlas)
# - JWT_SECRET (generate a random string)
# - STRIPE_SECRET_KEY (from Stripe dashboard)
# - Email credentials (Gmail or other SMTP)

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

**Backend runs on:** `http://localhost:5000`

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file from template
cp .env.example .env.local

# Update .env.local with your configuration:
# - VITE_STRIPE_PUBLISHABLE_KEY
# - Feature flags

# Start frontend development server
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

---

## Detailed Setup Instructions

### Backend Configuration

#### Environment Variables (.env)

Create a `.env` file in the `backend/` directory with these settings:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/restaurant-app
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-app

# Authentication
JWT_SECRET=your-secret-key-generate-a-random-string-min-32-chars
JWT_REFRESH_SECRET=another-secret-key-generate-a-random-string-min-32-chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Frontend CORS
CORS_ORIGIN=http://localhost:5173

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
EMAIL_FROM=noreply@restaurant.com

# Stripe Integration
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Loyalty & Referral
REFERRAL_REWARD_POINTS=500
REFERRAL_MIN_BOOKING_VALUE=50
LOYALTY_POINTS_PER_BOOKING=100
LOYALTY_POINTS_PER_DOLLAR_SPENT=1
BIRTHDAY_BONUS_POINTS=200

# Admin Account
ADMIN_EMAIL=admin@restaurant.com
ADMIN_PASSWORD=Admin@123
```

#### Installing Dependencies

```bash
cd backend
npm install
```

**Key packages installed:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `stripe` - Payment processing
- `nodemailer` - Email notifications
- `uuid` - Unique ID generation
- `qrcode` - QR code generation

#### Database Setup

**Option 1: Local MongoDB**
```bash
# Start MongoDB service (Windows)
mongod

# Or on Mac
brew services start mongodb-community

# Or on Linux
sudo systemctl start mongod
```

**Option 2: MongoDB Atlas**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

#### Seeding Database

```bash
# This creates sample data for testing
npm run seed
```

**Created data includes:**
- 3 users (1 admin, 2 regular users)
- 5 restaurant tables
- 6 menu items (various categories)
- 3 loyalty accounts
- 3 staff members
- 3 event packages
- 3 promotion codes

**Test credentials:**
```
Admin: admin@restaurant.com / password123
User 1: john@example.com / password123
User 2: jane@example.com / password123
```

#### Stripe Setup (Optional but recommended)

1. Create account at https://stripe.com
2. Go to Developers → API Keys
3. Copy Secret Key and Publishable Key
4. Add to `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

#### Starting the Backend

```bash
npm run dev
```

**Expected output:**
```
Server is running on port 5000
Connected to MongoDB at mongodb://localhost:27017/restaurant-app
```

**API Documentation:**
- Base URL: `http://localhost:5000/api/v1`
- Authentication: Bearer token in Authorization header
- See [FEATURES_GUIDE.md](./FEATURES_GUIDE.md) for all endpoints

---

### Frontend Configuration

#### Environment Variables (.env.local)

Create a `.env.local` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
VITE_DEFAULT_LANGUAGE=en
VITE_ENABLE_LOYALTY_PROGRAM=true
VITE_ENABLE_REVIEWS=true
VITE_ENABLE_GROUP_EVENTS=true
VITE_ENABLE_PROMOTIONS=true
VITE_ENABLE_MULTI_LANGUAGE=true
```

#### Installing Dependencies

```bash
cd frontend
npm install
```

**Key packages installed:**
- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - Styling
- `@stripe/react-stripe-js` - Stripe integration
- `framer-motion` - Animations
- `qrcode.react` - QR code component

#### Starting the Frontend

```bash
npm run dev
```

**Expected output:**
```
Local: http://localhost:5173/
```

---

## Testing the Application

### 1. Login Test
```
URL: http://localhost:5173/login
Email: john@example.com
Password: password123
```

### 2. Browse Menu
```
URL: http://localhost:5173/menu
- View menu items by category
- See dietary badges (Vegetarian, Vegan, GF, DF)
- Check ratings and availability
```

### 3. Make a Booking
```
URL: http://localhost:5173/book
- Select date, time, party size
- Choose a table
- Proceed to confirmation
```

### 4. Leave a Review
```
URL: http://localhost:5173/reviews
- Rate food, service, ambiance (1-5 stars)
- Add comments and images
- View review statistics
```

### 5. Loyalty Program
```
URL: http://localhost:5173/loyalty (requires login)
- View loyalty tier (Bronze/Silver/Gold/Platinum)
- Check points balance
- Redeem points for discounts
- See transaction history
```

### 6. Group Events Booking
```
URL: http://localhost:5173/group-events
- Fill 3-step event booking wizard
- Select event package (Basic/Premium/Luxury)
- Get automatic cost estimation
```

### 7. Admin Dashboard
```
URL: http://localhost:5173/admin
Email: admin@restaurant.com
Password: password123

Features:
- View booking analytics
- Manage menu items
- Monitor staff performance
- Check inventory levels
```

---

## Troubleshooting

### Backend Issues

**Port 5000 already in use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**MongoDB connection failed**
- Verify MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- For Atlas, ensure IP is whitelisted

**Stripe keys not working**
- Use test keys (sk_test_, pk_test_)
- Get keys from https://dashboard.stripe.com
- Ensure keys are in `.env`

### Frontend Issues

**Port 5173 already in use**
```bash
# Change port in vite.config.ts
# Or kill process using the port
```

**API calls failing (CORS error)**
- Ensure backend is running on http://localhost:5000
- Check `VITE_API_URL` in `.env.local`
- Verify backend `.env` has correct `CORS_ORIGIN`

**Images not loading**
- Ensure `VITE_API_URL` is correct
- Check menu item image paths in database

### General Issues

**npm install fails**
```bash
# Clear cache and try again
npm cache clean --force
npm install

# Or use yarn
yarn install
```

**Database is empty**
- Run seeding script: `npm run seed` (from backend directory)
- Or manually insert documents via MongoDB Atlas UI

**Lost test credentials**
- Reseed database: `npm run seed`
- Default credentials will be restored

---

## Production Deployment

### Backend Deployment (Heroku example)

```bash
# 1. Create Heroku app
heroku create restaurant-api

# 2. Set environment variables
heroku config:set \
  MONGODB_URI=your_atlas_uri \
  JWT_SECRET=your_secret_key \
  STRIPE_SECRET_KEY=your_key \
  NODE_ENV=production

# 3. Deploy
git push heroku main
```

### Frontend Deployment (Vercel example)

```bash
# 1. Build for production
npm run build

# 2. Deploy to Vercel
npm install -g vercel
vercel

# 3. Set environment variables in Vercel dashboard
# - VITE_API_URL (production backend URL)
# - VITE_STRIPE_PUBLISHABLE_KEY
```

### Environment Variables for Production

**Backend:**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod_user:password@cluster.mongodb.net/restaurant-app
JWT_SECRET=very-long-random-string-min-64-chars
CORS_ORIGIN=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_...
```

**Frontend:**
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Next Steps

1. **Customize Branding**
   - Update colors in `frontend/tailwind.config.js`
   - Change logo in `frontend/public`
   - Modify company name in config

2. **Email Notifications**
   - Customize email templates (currently in `backend/utils/email.ts`)
   - Set up production email service

3. **Payment Processing**
   - Activate Stripe webhooks
   - Implement payment confirmation emails

4. **Deploy to Production**
   - Choose hosting provider (Heroku, AWS, Vercel)
   - Set up CI/CD pipeline
   - Configure custom domain

5. **Monitor & Maintain**
   - Set up error tracking (Sentry)
   - Enable analytics (Google Analytics)
   - Regular database backups

---

## File Structure Reference

```
backend/
├── src/
│   ├── index.ts                 # Main server file
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── models/                  # 8 data models
│   ├── controllers/             # 8 feature controllers
│   ├── routes/                  # 8 route files
│   ├── middleware/              # Auth, errors, common
│   ├── utils/                   # JWT, validation, email
│   └── scripts/
│       └── seedAdvanced.ts      # Database seeding
├── .env.example                 # Environment template
└── package.json

frontend/
├── src/
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # React entry point
│   ├── components/              # React components
│   ├── pages/                   # 4 feature pages
│   ├── services/
│   │   └── bookingService.ts    # 30+ API methods
│   ├── context/
│   │   └── AuthContext.tsx      # Auth state
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   └── utils/                   # i18n, formatters
├── .env.example                 # Environment template
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind setup
└── package.json

Documentation/
├── FEATURES_GUIDE.md            # Comprehensive feature docs
├── ARCHITECTURE.md              # Architecture overview
├── DEPLOYMENT.md                # Deployment guide
├── QUICKSTART.md                # Quick start guide
└── README.md                    # Project overview
```

---

## Support & Resources

- **API Documentation:** See [FEATURES_GUIDE.md](./FEATURES_GUIDE.md)
- **Architecture:** See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **MongoDB:** https://docs.mongodb.com
- **Express.js:** https://expressjs.com
- **React:** https://react.dev
- **Stripe:** https://stripe.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## License

MIT License - See LICENSE file for details
