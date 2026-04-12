# 🏨 Hotel Table Booking System - Architecture Document

## Executive Summary
This document outlines the complete architecture redesign of a basic hotel table booking system into a production-ready, modern web application following industry best practices.

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Tech Stack Rationale](#tech-stack-rationale)
3. [Database Schema](#database-schema)
4. [API Architecture](#api-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Component Structure](#component-structure)
7. [Authentication Flow](#authentication-flow)
8. [Deployment Strategy](#deployment-strategy)

---

## System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   User App   │  │   Admin      │  │   Auth UI    │       │
│  │   (Booking)  │  │  (Dashboard) │  │  (Login)     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↕ (REST API)
┌─────────────────────────────────────────────────────────────┐
│              API Layer (Node.js + Express)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Auth Routes │  │ Booking API  │  │  Admin API   │       │
│  │  (JWT)       │  │  (Tables)    │  │ (Analytics)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│  Middleware: Auth, Validation, Error Handling, CORS        │
└─────────────────────────────────────────────────────────────┘
                            ↕ (Database)
┌─────────────────────────────────────────────────────────────┐
│              Data Layer (MongoDB)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Users      │  │  Bookings    │  │   Tables     │       │
│  │ Collection   │  │ Collection   │  │ Collection   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Rationale

| Layer | Technology | Why? |
|-------|-----------|------|
| **Frontend** | React 18 | Component-based, large ecosystem, performance |
| **Styling** | Tailwind CSS | Utility-first, highly customizable, responsive |
| **Components** | Shadcn/ui | Pre-built accessible components, high quality |
| **Backend** | Node.js + Express | JavaScript, fast, lightweight, perfect for APIs |
| **Database** | MongoDB | Flexible schema, great for booking systems, scalable |
| **Auth** | JWT + Refresh Tokens | Stateless, secure, industry standard |
| **Validation** | Zod | TypeScript-first, runtime validation, type safe |
| **State** | Context API / Zustand | No external dependencies, sufficient for app size |

---

## Database Schema

### 1. **Users Collection**
```javascript
{
  _id: ObjectId,
  email: string (unique),
  username: string (unique),
  password: string (hashed),
  firstName: string,
  lastName: string,
  phone: string,
  avatar: string (URL),
  role: enum ["user", "admin"],
  isActive: boolean,
  emailVerified: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Tables Collection**
```javascript
{
  _id: ObjectId,
  tableNumber: number,
  capacity: number (2, 4, 6, 8),
  location: enum ["window", "patio", "indoor", "private"],
  isActive: boolean,
  description: string,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **Bookings Collection**
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
  startTime: string (HH:MM format),
  endTime: string (HH:MM format),
  durationMinutes: number (default: 90),
  specialRequests: string,
  status: enum ["pending", "confirmed", "cancelled", "completed"],
  notes: string,
  createdAt: Date,
  updatedAt: Date,
  confirmedAt: Date,
  cancelledAt: Date
}
```

### 4. **Analytics Collection** (for performance)
```javascript
{
  _id: ObjectId,
  date: Date,
  totalBookings: number,
  completedBookings: number,
  cancelledBookings: number,
  totalRevenue: number,
  peakHourBookings: Map<hour, count>,
  tablesUtilization: Map<tableId, percentage>,
  averageGuestSize: number
}
```

### 5. **Notifications Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  bookingId: ObjectId (ref: Bookings),
  type: enum ["confirmation", "reminder", "cancellation"],
  message: string,
  isRead: boolean,
  createdAt: Date
}
```

---

## API Architecture

### Base URL: `/api/v1`

### Authentication Routes
```
POST   /auth/register        - Register new user
POST   /auth/login           - Login with email/password
POST   /auth/refresh         - Refresh access token
POST   /auth/logout          - Logout user
POST   /auth/verify-email    - Verify email token
```

### Booking Routes (User)
```
GET    /bookings             - List user's bookings
POST   /bookings             - Create new booking
GET    /bookings/:id         - Get booking details
PUT    /bookings/:id         - Update booking
DELETE /bookings/:id         - Cancel booking
GET    /tables/available     - Get available tables
POST   /bookings/:id/confirm - Confirm booking
```

### Admin Routes
```
GET    /admin/bookings       - List all bookings
GET    /admin/tables         - Manage tables
POST   /admin/tables         - Create table
PUT    /admin/tables/:id     - Update table
DELETE /admin/tables/:id     - Delete table
GET    /admin/analytics      - Get analytics data
GET    /admin/users          - List users
```

### Error Response Format
```javascript
{
  success: false,
  error: {
    code: "BOOKING_TIME_CONFLICT",
    message: "Table already booked for this time",
    details: { conflictingBookingId: "..." }
  }
}
```

---

## Frontend Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/              (Reusable UI components)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── auth/                (Authentication components)
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── booking/             (Booking features)
│   │   │   ├── BookingForm.tsx
│   │   │   ├── TableSelector.tsx
│   │   │   ├── DateTimePicker.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   ├── admin/               (Admin dashboard)
│   │   │   ├── BookingList.tsx
│   │   │   ├── TableManager.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── UserManagement.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Layout.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── NotificationContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBooking.ts
│   │   └── useTables.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── BookingPage.tsx
│   │   ├── MyBookings.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── NotFound.tsx
│   │   └── Login.tsx
│   ├── services/
│   │   ├── api.ts              (Axios instance)
│   │   ├── authService.ts
│   │   ├── bookingService.ts
│   │   └── adminService.ts
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── styles/
│   │   └── globals.css         (Tailwind config)
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   └── booking.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Component Structure

### Component Hierarchy
```
<App>
  ├── <Header>
  ├── <Router>
  │   ├── <Home>
  │   ├── <AuthLayout>
  │   │   ├── <LoginForm>
  │   │   └── <SignupForm>
  │   ├── <ProtectedRoute>
  │   │   ├── <BookingPage>
  │   │   │   ├── <DatePicker>
  │   │   │   ├── <TimePicker>
  │   │   │   ├── <GuestSelector>
  │   │   │   └── <TableSelector>
  │   │   ├── <MyBookingsPage>
  │   │   │   └── <BookingCard>
  │   │   └── <AdminDashboard> (role === admin)
  │   │       ├── <Analytics>
  │   │       ├── <BookingManagement>
  │   │       └── <TableManagement>
```

### Reusable Component Examples

**Button Component** - Tailwind-based with variants
**Card Component** - Container component with shadow and border
**Modal Component** - Animated modal with overlay and actions
**Form Components** - Input, Select, Checkbox with labels and validation
**DataTable** - Sortable, filterable table for admin views

---

## Authentication Flow

```
User Input (Email + Password)
         ↓
[POST /api/v1/auth/login]
         ↓
Server: Hash password & compare
         ↓
Generate JWT + Refresh Token
         ↓
Response with accessToken (short-lived) + refreshToken (long-lived)
         ↓
Store both in httpOnly cookies (or localStorage with caution)
         ↓
Include JWT in Authorization header for all API calls
         ↓
Token expires → Use refreshToken to get new accessToken
```

### Token Structure
```
Access Token: Expires in 15 minutes
{
  sub: userId,
  email: user@email.com,
  role: "user" | "admin",
  exp: timestamp
}

Refresh Token: Expires in 7 days
{
  sub: userId,
  type: "refresh",
  exp: timestamp
}
```

---

## Feature Implementation Timeline

### Phase 1: Core Infrastructure (Week 1)
- ✅ Backend setup (Express, MongoDB, authentication)
- ✅ Frontend setup (React, Tailwind, routing)
- ✅ Database schema design
- ✅ Basic CRUD API endpoints

### Phase 2: User Booking (Week 2)
- ✅ Booking form with date/time/guest picker
- ✅ Real-time table availability checking
- ✅ Booking confirmation with email (mock)
- ✅ User can view/manage their bookings

### Phase 3: Admin Dashboard (Week 3)
- ✅ Admin authentication & role-based access
- ✅ Booking management (view, edit, cancel)
- ✅ Table management (CRUD operations)
- ✅ Basic analytics (bookings per day, tables utilization)

### Phase 4: Advanced Features (Week 4)
- ✅ Dark/light mode toggle
- ✅ Calendar-based booking interface
- ✅ Email notifications (mock)
- ✅ Search & filter bookings
- ✅ Responsive mobile design
- ✅ Animations & loading states

---

## Deployment Strategy

### Frontend Deployment (Vercel)
```
1. Connect GitHub repository
2. Select frontend/ directory as root
3. Environment variables: REACT_APP_API_URL
4. Auto-deploy on git push to main
```

### Backend Deployment (Render.com)
```
1. Connect GitHub repository
2. Select backend/ directory as root
3. Environment variables: MONGODB_URI, JWT_SECRET, etc.
4. Auto-deploy on git push to main
```

### Database (MongoDB Atlas)
```
1. Create cluster on MongoDB Atlas
2. Set whitelist IPs (Render + local dev)
3. Create database user with strong password
4. Connection string in backend .env
```

### Environment Variables

**Backend .env**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pwd@cluster.mongodb.net/hotel
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=https://yourdomain.vercel.app
SENDGRID_API_KEY=your-sendgrid-key
```

**Frontend .env**
```
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

---

## Best Practices Implemented

✅ **TypeScript**: Full type safety across frontend & backend
✅ **Component Reusability**: DRY principles, modular components
✅ **Separation of Concerns**: Clear layer separation (UI, Logic, API)
✅ **Error Handling**: Comprehensive error handling & user feedback
✅ **Performance**: Lazy loading, code splitting, memoization
✅ **Security**: JWT auth, password hashing, input validation, CORS
✅ **Responsive Design**: Mobile-first approach with Tailwind breakpoints
✅ **Code Organization**: Clear naming, folder structure, documentation
✅ **API Versioning**: `/api/v1` for future compatibility
✅ **Database Indexing**: Indexes on frequently queried fields

---

## Success Metrics

- **Performance**: Load time < 3s, API responses < 200ms
- **User Experience**: Intuitive booking flow, 1-click confirmation
- **Admin Capabilities**: Real-time analytics, bulk operations
- **Scalability**: Handles 1000+ concurrent users
- **Reliability**: 99.9% uptime, proper error recovery
- **Security**: Zero SQL injection, secure password storage, JWT validation

---

## Next Steps

1. Clone the repository
2. Follow the setup guides for frontend & backend
3. Run locally and test end-to-end
4. Deploy to Vercel (frontend) and Render (backend)
5. Monitor performance and gather user feedback

---

**Document Version**: 1.0
**Last Updated**: April 2026
**Author**: Senior Full-Stack Engineer
