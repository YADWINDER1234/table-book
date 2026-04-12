# 🏨 TableBook - Professional Hotel Table Booking System

A modern, production-ready web application for booking tables at restaurants and hotels. Built with React, Node.js, MongoDB, and Tailwind CSS.

## ✨ Features

### Core Features
✅ User Authentication (JWT-based)
✅ Table Booking System with Real-time Availability
✅ Admin Dashboard with Analytics
✅ Booking Management & Cancellation
✅ Email Confirmations (Mock)
✅ Role-based Access Control
✅ Responsive Mobile Design

### Advanced Features
✅ Interactive Date/Time Picker
✅ Real-time Conflict Detection
✅ Booking Status Tracking
✅ Admin Analytics & Reporting
✅ Table Management System
✅ Special Requests Support
✅ Smooth Animations & Transitions

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ 
- **MongoDB** Atlas cluster or local instance
- **npm** or **yarn**

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Update environment variables**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-booking
   JWT_SECRET=your-super-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # Note: Also run: npm install @vitejs/plugin-react
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Update environment variables**
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   App will run on `http://localhost:5173`

---

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1 (555) 123-4567"
}

Response: { accessToken, refreshToken, user }
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { accessToken, refreshToken, user }
```

#### Refresh Token
```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}

Response: { accessToken }
```

### Booking Endpoints

#### Get Available Tables
```
GET /tables/available?date=2024-01-20&startTime=19:00&endTime=20:30&capacity=4
Authorization: Bearer [accessToken]

Response: { availableTables, totalAvailable }
```

#### Create Booking
```
POST /bookings
Authorization: Bearer [accessToken]
Content-Type: application/json

{
  "tableId": "table-id",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1 (555) 123-4567",
  "numberOfGuests": 4,
  "bookingDate": "2024-01-20",
  "startTime": "19:00",
  "endTime": "20:30",
  "specialRequests": "Window seat preferred"
}

Response: { booking }
```

#### Get User Bookings
```
GET /bookings?status=confirmed
Authorization: Bearer [accessToken]

Response: [ bookings ]
```

#### Get Booking Details
```
GET /bookings/:id
Authorization: Bearer [accessToken]

Response: { booking }
```

#### Update Booking
```
PUT /bookings/:id
Authorization: Bearer [accessToken]
Content-Type: application/json

{
  "startTime": "19:30",
  "numberOfGuests": 5,
  "specialRequests": "..."
}

Response: { booking }
```

#### Cancel Booking
```
DELETE /bookings/:id
Authorization: Bearer [accessToken]

Response: { booking }
```

### Admin Endpoints

All admin endpoints require `Authorization: Bearer [accessToken]` header and admin role.

#### Get All Bookings
```
GET /admin/bookings?page=1&limit=20&status=confirmed

Response: { bookings[], pagination }
```

#### Update Booking Status
```
PUT /admin/bookings/:id/status
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Optional notes"
}

Response: { booking }
```

#### Get Dashboard Analytics
```
GET /admin/analytics/dashboard

Response: { summary, todayBookings, trend }
```

#### Manage Tables
```
GET /admin/tables
POST /admin/tables
PUT /admin/tables/:id
DELETE /admin/tables/:id
```

---

## 🗄️ Database Schema

### MongoDB Collections

**Users**
```javascript
{
  _id: ObjectId,
  email: string (unique),
  username: string (unique),
  password: string (hashed),
  firstName: string,
  lastName: string,
  phone: string,
  role: "user" | "admin",
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Tables**
```javascript
{
  _id: ObjectId,
  tableNumber: number (unique),
  capacity: number (2, 4, 6, 8),
  location: "window" | "patio" | "indoor" | "private",
  isActive: boolean,
  description: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Bookings**
```javascript
{
  _id: ObjectId,
  bookingId: string (unique, human-readable),
  userId: ObjectId (ref: Users),
  tableId: ObjectId (ref: Tables),
  guestName: string,
  guestEmail: string,
  guestPhone: string,
  numberOfGuests: number,
  bookingDate: Date,
  startTime: string (HH:MM),
  endTime: string (HH:MM),
  durationMinutes: number,
  specialRequests: string,
  status: "pending" | "confirmed" | "cancelled" | "completed",
  notes: string,
  createdAt: Date,
  updatedAt: Date,
  confirmedAt: Date,
  cancelledAt: Date
}
```

---

## 🧪 Testing the Application

### Test User Credentials
```
Email: demo@example.com
Password: Demo@123
Username: demouser

Or create your own account using signup
```

### Test Admin Credentials
```
Email: admin@hotel.com
Password: Admin@123
```

### Test Workflow
1. Sign up or login
2. Navigate to "Book a Table"
3. Select date, time, and number of guests
4. Choose an available table
5. Enter guest details
6. Confirm booking
7. View booking in "My Bookings"
8. (Admin only) Access admin dashboard for analytics

---

## 📦 Deployment Guide

### Deploy Backend on Render

1. **Create Render Account** at https://render.com

2. **Connect GitHub Repository**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repo

3. **Configure Service**
   - Name: `hotel-booking-api`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Region: Choose closest to your users

4. **Add Environment Variables**
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection
   - `JWT_SECRET`: Strong secret key
   - `JWT_REFRESH_SECRET`: Another secret key
   - `CORS_ORIGIN`: Your Vercel frontend URL

5. **Deploy**
   - Click "Create Web Service"
   - Render will handle automatic deploys on git push

### Deploy Frontend on Vercel

1. **Create Vercel Account** at https://vercel.com

2. **Connect GitHub Repository**
   - Click "New Project"
   - Select your repository
   - Select "frontend" as root directory

3. **Configure Environment Variables**
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://hotel-booking-api.onrender.com/api/v1`)

4. **Deploy**
   - Vercel will auto-deploy on git push
   - Get your live URL from Vercel dashboard

### MongoDB Atlas Setup

1. **Create Free Cluster** at https://www.mongodb.com/cloud/atlas

2. **Create Database User**
   - Go to Security → Database Access
   - Create new user with strong password
   - Select "Read and write to any database"

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Use as `MONGODB_URI` in backend .env

4. **Whitelist IPs**
   - Go to Security → Network Access
   - Add IP addresses (or use 0.0.0.0/0 for development only)
   - For production, add only Render IP

---

## 🔧 Project Structure

```
hotel-booking-system/
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── index.ts             # Entry point
│   │   ├── models/              # MongoDB schemas
│   │   ├── routes/              # API routes
│   │   ├── controllers/         # Business logic
│   │   ├── middleware/          # Auth, error handling
│   │   ├── utils/               # Helpers (JWT, validation, etc.)
│   │   └── config/              # Configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/                     # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # Entry point
│   │   ├── components/          # React components
│   │   │   ├── common/          # Reusable UI
│   │   │   ├── auth/            # Auth forms
│   │   │   ├── booking/         # Booking components
│   │   │   ├── admin/           # Admin dashboard
│   │   │   └── layout/          # Layout components
│   │   ├── pages/               # Page components
│   │   ├── context/             # React Context
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API services
│   │   ├── types/               # TypeScript types
│   │   ├── utils/               # Utilities
│   │   └── styles/              # CSS files
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── ARCHITECTURE.md               # Detailed architecture
└── README.md                     # This file
```

---

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, minimal interface following design trends
- **Responsive**: Fully responsive on mobile, tablet, desktop
- **Accessible**: WCAG compliant, proper semantic HTML
- **Interactive**: Smooth transitions, loading states, validation feedback
- **User-Centric**: Intuitive booking flow, clear status indicators
- **Reusable Components**: Card, Button, Modal, Form inputs built once, used everywhere

---

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based auth
- **CORS**: Configured to prevent unauthorized requests
- **Input Validation**: Zod schemas for runtime validation
- **Error Handling**: No sensitive data in error messages
- **Role-based Access**: Admin-only endpoints protected
- **Environment Variables**: Secrets never in code

---

## 📊 Performance Optimizations

- **Database Indexes**: On frequently queried fields (userId, tableId, bookingDate)
- **Lazy Loading**: Components loaded on demand in React
- **Code Splitting**: Automatic with Vite
- **API Caching**: Token refresh logic optimized
- **Pagination**: Admin booking list paginated for performance
- **Rate Limiting**: Ready for deployment with helmet.js

---

## 🐛 Common Issues & Solutions

### Backend won't connect to MongoDB
```
❌ Error: connect ECONNREFUSED
✅ Solution: 
   - Check MONGODB_URI is correct
   - Verify IP whitelist on MongoDB Atlas
   - Ensure database user has correct permissions
```

### Frontend can't reach API
```
❌ Error: CORS error or 404 on API calls
✅ Solution:
   - Verify backend is running (http://localhost:5000/health)
   - Check VITE_API_URL in frontend .env
   - Ensure CORS_ORIGIN matches frontend URL
```

### Build fails
```
❌ Error: Type errors or missing packages
✅ Solution:
   - Run npm install again
   - Clear node_modules and reinstall
   - Check Node.js version (should be 16+)
   - Run npm run build to see actual errors
```

---

## 📚 Tech Stack Explanation

**Why React?**
- Component reusability & organization
- Rich ecosystem & libraries
- Excellent performance with virtual DOM
- Large community & resources
- Perfect for this project size

**Why Node.js + Express?**
- JavaScript everywhere (frontend & backend)
- Lightweight & fast
- Huge npm package ecosystem
- Perfect for building APIs
- Excellent async handling

**Why MongoDB?**
- Flexible schema (bookings have varying data)
- Great for rapid development
- Scalable for future features
- Document-based (natural for our data)
- Free tier available (Atlas)

**Why Tailwind CSS?**
- Utility-first approach speeds up development
- No naming conflicts
- Easy to maintain & modify
- Beautiful default components
- Responsive design built-in

---

## 🚀 Next Steps & Enhancements

### Phase 2 Features
- [ ] Email notifications (SendGrid integration)
- [ ] SMS confirmations (Twilio)
- [ ] Dark mode toggle
- [ ] User reviews & ratings
- [ ] Payment integration (Stripe)
- [ ] Calendar view for availability
- [ ] Group booking discounts
- [ ] Loyalty program

### Scaling Considerations
- Redis caching for frequently accessed data
- Search indexing for better analytics queries
- CDN for static assets
- Load balancing for multiple API instances
- Monitoring with Sentry/DataDog

---

## 📞 Support & Contact

For issues or questions:
- Create an issue on GitHub
- Check the ARCHITECTURE.md for detailed info
- Review the API documentation above

---

## 📄 License

MIT License - feel free to use this for personal or commercial projects

---

## 🎯 Credits

Built as a complete production-ready redesign of a basic Python Flask booking system into a modern, scalable web application.

**Happy Booking! 🏨✨**
