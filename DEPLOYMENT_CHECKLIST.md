# Restaurant Web App - Deployment Checklist

Use this checklist to verify all components are properly configured before launching the application.

## Pre-Deployment Phase

### Environment Setup
- [ ] Node.js 14+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] MongoDB running locally OR MongoDB Atlas account created
- [ ] Stripe account created (for payment features)
- [ ] Gmail/SMTP account configured for emails

### Backend Configuration

#### Installation
- [ ] `backend/package.json` reviewed and all dependencies listed
- [ ] `npm install` completed successfully in backend directory
- [ ] No installation errors or warnings
- [ ] `node_modules/` directory created

#### Environment Variables
- [ ] `backend/.env` created from `.env.example`
- [ ] `MONGODB_URI` configured:
  - [ ] Local: `mongodb://localhost:27017/restaurant-app`
  - [ ] OR Atlas: Connection string with credentials
- [ ] `JWT_SECRET` set to a random 32+ character string
- [ ] `JWT_REFRESH_SECRET` configured
- [ ] `JWT_EXPIRE` set (default: 15m)
- [ ] `JWT_REFRESH_EXPIRE` set (default: 7d)
- [ ] `PORT` configured (default: 5000)
- [ ] `NODE_ENV=development` for dev, `production` for prod
- [ ] `CORS_ORIGIN` set to frontend URL (`http://localhost:5173` for dev)

#### Email Configuration
- [ ] `SMTP_HOST` configured (e.g., smtp.gmail.com)
- [ ] `SMTP_PORT` set (usually 587)
- [ ] `SMTP_USER` set to email address
- [ ] `SMTP_PASS` set to app password (not regular password)
- [ ] `EMAIL_FROM` configured

#### Stripe Integration
- [ ] `STRIPE_SECRET_KEY` added (sk_test_... for dev)
- [ ] `STRIPE_PUBLISHABLE_KEY` added (pk_test_... for dev)
- [ ] `STRIPE_WEBHOOK_SECRET` configured (for production)

#### Feature Configuration
- [ ] `REFERRAL_REWARD_POINTS` set
- [ ] `REFERRAL_MIN_BOOKING_VALUE` set
- [ ] `LOYALTY_POINTS_PER_BOOKING` configured
- [ ] `LOYALTY_POINTS_PER_DOLLAR_SPENT` set
- [ ] `BIRTHDAY_BONUS_POINTS` configured
- [ ] `INVENTORY_LOW_STOCK_THRESHOLD` set
- [ ] `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured

#### Database Verification
- [ ] MongoDB connection tested (`mongod` running)
- [ ] Database created or Atlas cluster accessible
- [ ] Collections are empty (ready for seeding)

#### Database Seeding
- [ ] `npm run seed` executed successfully
- [ ] Sample data created:
  - [ ] 3 users (1 admin, 2 regular)
  - [ ] 5 restaurant tables
  - [ ] 6 menu items
  - [ ] 3 loyalty accounts
  - [ ] 3 staff members
  - [ ] 3 event packages
  - [ ] 3 promotion codes

#### Backend Start-up
- [ ] `npm run dev` runs without errors
- [ ] Server listening on port 5000
- [ ] "Connected to MongoDB" message appears
- [ ] No console errors on startup

### Frontend Configuration

#### Installation
- [ ] `frontend/package.json` reviewed
- [ ] `npm install` completed successfully
- [ ] No installation errors or warnings
- [ ] `node_modules/` directory created

#### Environment Variables (.env.local)
- [ ] `frontend/.env.local` created from `.env.example`
- [ ] `VITE_API_URL=http://localhost:5000/api/v1`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` configured (pk_test_...)
- [ ] `VITE_DEFAULT_LANGUAGE` set (en, es, or fr)
- [ ] `VITE_ENABLE_LOYALTY_PROGRAM=true`
- [ ] `VITE_ENABLE_REVIEWS=true`
- [ ] `VITE_ENABLE_GROUP_EVENTS=true`
- [ ] `VITE_ENABLE_PROMOTIONS=true`
- [ ] `VITE_ENABLE_MULTI_LANGUAGE=true`

#### Dependencies Check
- [ ] React 18+ installed
- [ ] React Router installed
- [ ] Axios installed
- [ ] Tailwind CSS configured
- [ ] Stripe React SDK installed
- [ ] Framer Motion installed (for animations)
- [ ] All 14+ dependencies present

#### Frontend Files
- [ ] `src/App.tsx` contains all routes
- [ ] `src/pages/` directory contains all 4 pages:
  - [ ] `MenuPage.tsx` (menu browsing)
  - [ ] `ReviewPage.tsx` (review submission)
  - [ ] `LoyaltyPage.tsx` (loyalty program)
  - [ ] `EventBookingPage.tsx` (group events)
- [ ] `src/components/` contains utility components
- [ ] `src/services/bookingService.ts` has 30+ methods
- [ ] `src/context/AuthContext.tsx` for auth state
- [ ] `src/types/index.ts` has all TypeScript types
- [ ] `src/utils/i18n.ts` for translations
- [ ] `src/utils/qrCode.ts` for QR generation

#### Frontend Start-up
- [ ] `npm run dev` runs without errors
- [ ] Frontend accessible at `http://localhost:5173`
- [ ] No console errors on startup
- [ ] Styles load correctly (Tailwind CSS working)

---

## Integration Testing

### Authentication Flow
- [ ] Login page accessible at `/login`
- [ ] Can log in with test credentials:
  - [ ] Email: john@example.com / Password: password123
  - [ ] Email: jane@example.com / Password: password123
  - [ ] Email: admin@restaurant.com / Password: password123
- [ ] JWT token stored in localStorage
- [ ] Logout clears token
- [ ] Protected routes require authentication

### Menu Feature
- [ ] `/menu` page loads
- [ ] All 6 menu items display
- [ ] Category filtering works
- [ ] Dietary badges appear (Vegetarian, Vegan, GF, DF)
- [ ] Ratings display correctly
- [ ] Images load from backend
- [ ] Add to cart functionality works (if implemented)

### Booking System
- [ ] `/book` page accessible
- [ ] Date/time picker works
- [ ] Party size selector functions
- [ ] Available tables load
- [ ] Booking confirmation works
- [ ] `/bookings` page shows user bookings
- [ ] Booking status updates in real-time

### Review System
- [ ] `/reviews` page accessible
- [ ] Star rating selector works (1-5 stars)
- [ ] Can submit review with text
- [ ] Image upload field present
- [ ] Review submission successful
- [ ] Review stats display
- [ ] Other reviews visible

### Loyalty Program
- [ ] `/loyalty` page accessible (requires login)
- [ ] Current tier displays (Bronze/Silver/Gold/Platinum)
- [ ] Points balance shown
- [ ] Progress to next tier visible
- [ ] Redemption form works
- [ ] Transaction history displays
- [ ] Tier benefits listed

### Group Events
- [ ] `/group-events` page accessible
- [ ] 3-step wizard displays
- [ ] Event details form works
- [ ] Package selection calculates cost
- [ ] Special requests form submits
- [ ] Booking confirmation works

### Admin Dashboard
- [ ] `/admin` accessible with admin account
- [ ] Dashboard displays analytics
- [ ] Menu management accessible
- [ ] Booking management works
- [ ] Staff management shows 3 staff
- [ ] Event management displays packages
- [ ] Statistics calculate correctly

### API Integration
- [ ] All 30+ bookingService methods callable
- [ ] GET endpoints return data
- [ ] POST endpoints create records
- [ ] PUT endpoints update records
- [ ] DELETE endpoints remove records
- [ ] Error handling works (401, 403, 404, 500)
- [ ] CORS headers correct

---

## Performance Checklist

### Backend Performance
- [ ] Database queries use indexes
- [ ] No N+1 query problems
- [ ] Response times < 500ms
- [ ] Memory usage stable
- [ ] No memory leaks after 1+ hour runtime
- [ ] Error logging works

### Frontend Performance
- [ ] Page loads in < 3 seconds
- [ ] Components render without lag
- [ ] Smooth animations (Framer Motion)
- [ ] No console warnings or errors
- [ ] Images optimized
- [ ] CSS compiled (Tailwind)

---

## Security Checklist

### Backend Security
- [ ] Passwords hashed with bcryptjs
- [ ] JWT secrets are random and long
- [ ] API endpoints use authentication middleware
- [ ] Admin endpoints use admin authorization
- [ ] No sensitive data in error messages
- [ ] CORS properly configured
- [ ] SQL injection prevention (Mongoose handles this)

### Frontend Security
- [ ] No API keys hardcoded
- [ ] Sensitive data in .env.local only
- [ ] HTTPS ready (for production)
- [ ] Stripe data encrypted in transit
- [ ] No password storage in localStorage

---

## Documentation Checklist

- [ ] `SETUP_GUIDE.md` reviewed (this file)
- [ ] `FEATURES_GUIDE.md` available for reference
- [ ] `ARCHITECTURE.md` reviewed for understanding
- [ ] `README.md` updated with project info
- [ ] Code comments present in complex functions
- [ ] API endpoints documented

---

## Deployment Readiness

### For Production Deployment

#### Backend
- [ ] Environment variables updated for production
- [ ] Database URI points to production MongoDB
- [ ] `NODE_ENV=production`
- [ ] JWT secrets changed (new random values)
- [ ] Stripe live keys configured
- [ ] Email service configured for production
- [ ] Error logging configured (Sentry, etc.)
- [ ] Database backups configured

#### Frontend
- [ ] Build successful: `npm run build`
- [ ] All environment variables set
- [ ] Stripe public key is live key
- [ ] API URL points to production backend
- [ ] Analytics configured (optional)

#### Hosting
- [ ] Backend deployment target selected (Heroku, AWS, etc.)
- [ ] Frontend deployment target selected (Vercel, Netlify, etc.)
- [ ] Domain name configured
- [ ] SSL certificate installed
- [ ] CI/CD pipeline configured
- [ ] Monitoring setup (error tracking, analytics)

---

## Final Verification

Run this before declaring ready:

```bash
# Backend
cd backend
npm run build     # Ensure no TypeScript errors
npm run seed      # Fresh data
npm run dev       # Verify startup

# Frontend (new terminal)
cd frontend
npm run build     # Ensure no build errors
npm run dev       # Verify frontend loads
```

### Manual Testing (5 minutes)
1. [ ] Log in with test account
2. [ ] Browse menu (/menu)
3. [ ] Make a booking (/book)
4. [ ] Submit a review (/reviews)
5. [ ] View loyalty info (/loyalty)
6. [ ] Check admin dashboard (/admin)

---

## Initial Launch Checklist

- [ ] Both backend and frontend running in separate terminals
- [ ] No console errors
- [ ] All pages load correctly
- [ ] API calls work correctly
- [ ] Database operations work
- [ ] Authentication working
- [ ] Sample data accessible
- [ ] Ready for testing with real users

---

## Post-Launch Monitoring

- [ ] Monitor backend logs for errors
- [ ] Check database performance
- [ ] Track API response times
- [ ] Monitor frontend user experience
- [ ] Collect user feedback
- [ ] Fix any issues that arise
- [ ] Plan for feature enhancements

---

## Troubleshooting Reference

**Port Already in Use:**
- Windows: `netstat -ano | findstr :5000` then kill process
- Mac/Linux: `lsof -i :5000` then kill process

**Database Connection Error:**
- Ensure MongoDB is running
- Double-check connection string
- Verify credentials for Atlas

**CORS Error:**
- Check backend CORS_ORIGIN setting
- Verify frontend VITE_API_URL
- Ensure both on correct ports

**Missing Dependencies:**
- Run `npm install` in both directories
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Stripe Integration Issues:**
- Use test keys (sk_test_, pk_test_)
- Check Stripe dashboard for errors
- Test with Stripe test card: 4242 4242 4242 4242

---

## Next Steps After Launch

1. User testing and feedback collection
2. Bug fixes and performance optimization
3. Feature enhancements based on feedback
4. Mobile app development (PWA or native)
5. Additional integrations (SMS, voice, etc.)
6. Advanced analytics and reporting

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** Complete - Ready for Deployment ✅
