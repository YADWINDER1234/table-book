# Restaurant Web App - Testing Guide

Complete testing guide for all 18 features implemented in the restaurant web application.

## Table of Contents
1. [Test Environment Setup](#test-environment-setup)
2. [Authentication Testing](#authentication-testing)
3. [Core Features Testing](#core-features-testing)
4. [Admin Features Testing](#admin-features-testing)
5. [Integration Testing](#integration-testing)
6. [Performance Testing](#performance-testing)
7. [Error Handling Testing](#error-handling-testing)

---

## Test Environment Setup

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- Database seeded with sample data
- Browser: Chrome, Firefox, Safari, or Edge

### Test Accounts
```
Admin Account:
  Email: admin@restaurant.com
  Password: password123

User 1:
  Email: john@example.com
  Password: password123

User 2:
  Email: jane@example.com
  Password: password123
```

### Test Data Available
- Tables: 5 (capacity 2-8)
- Menu items: 6 (various categories)
- Promotions: 3 (WELCOME15, LOYALTY20, SAVE50)
- Event packages: 3 (Basic, Premium, Luxury)

---

## Authentication Testing

### Feature 1: User Registration

**Test Case 1.1: Valid Registration**
- [ ] Navigate to `/signup`
- [ ] Fill form with:
  - Name: Test User
  - Email: testuser@example.com
  - Password: TestPass@123
  - Confirm Password: TestPass@123
- [ ] Click Register
- **Expected:** Account created, redirected to login page

**Test Case 1.2: Email Already Exists**
- [ ] Try to register with: john@example.com
- **Expected:** Error message "Email already registered"

**Test Case 1.3: Password Mismatch**
- [ ] Fill password: Test123
- [ ] Fill confirm password: Test456
- **Expected:** Error message "Passwords don't match"

**Test Case 1.4: Invalid Email Format**
- [ ] Enter email: notanemail
- **Expected:** Error message "Invalid email format"

### Feature 2: User Login

**Test Case 2.1: Valid Login**
- [ ] Navigate to `/login`
- [ ] Email: john@example.com
- [ ] Password: password123
- [ ] Click Login
- **Expected:** Redirected to dashboard, JWT token in localStorage

**Test Case 2.2: Invalid Password**
- [ ] Email: john@example.com
- [ ] Password: wrongpassword
- [ ] Click Login
- **Expected:** Error message "Invalid credentials"

**Test Case 2.3: Non-existent Email**
- [ ] Email: nonexistent@example.com
- [ ] Password: password123
- **Expected:** Error message "User not found"

**Test Case 2.4: Session Persistence**
- [ ] Log in successfully
- [ ] Refresh the page
- **Expected:** Still logged in (token persisted)

### Feature 3: Logout

**Test Case 3.1: Valid Logout**
- [ ] Log in successfully
- [ ] Click Logout button
- **Expected:** Redirected to home, token cleared from localStorage

**Test Case 3.2: Protected Routes After Logout**
- [ ] Log out
- [ ] Try to access `/loyalty`
- **Expected:** Redirected to login page

---

## Core Features Testing

### Feature 4: Restaurant Menu

**Test Case 4.1: View All Menu Items**
- [ ] Navigate to `/menu`
- **Expected:**
  - [ ] 6 menu items displayed
  - [ ] Each item shows: name, description, price, image
  - [ ] Ratings displayed (1-5 stars)
  - [ ] Dietary badges visible (Vegetarian, Vegan, GF, DF)

**Test Case 4.2: Filter by Category**
- [ ] Click "Mains" category
- **Expected:** Only main dishes shown

**Test Case 4.3: Filter by Dietary Preference**
- [ ] Click "Vegetarian" filter
- **Expected:** Only vegetarian items shown

**Test Case 4.4: Search Menu Items**
- [ ] Search for "Salmon" (if search implemented)
- **Expected:** Only Salmon item shown

**Test Case 4.5: Menu Item Details**
- [ ] Click on "Grilled Salmon"
- **Expected:**
  - [ ] Full details displayed
  - [ ] Rating breakdown visible
  - [ ] Dietary info clear
  - [ ] Preparation time shown

### Feature 5: Table Booking System

**Test Case 5.1: Make a Reservation**
- [ ] Navigate to `/book`
- [ ] Fill form:
  - [ ] Date: Select future date
  - [ ] Time: Select time slot
  - [ ] Party Size: 4 people
  - [ ] Special requests: "Window seat"
- [ ] Click Book
- **Expected:**
  - [ ] Booking confirmation page
  - [ ] QR code generated
  - [ ] Reference ID provided

**Test Case 5.2: View Bookings**
- [ ] Navigate to `/bookings`
- **Expected:** All user's bookings listed with status

**Test Case 5.3: Cancel Booking**
- [ ] View bookings
- [ ] Click Cancel on a booking
- **Expected:** Booking status changed to "Cancelled"

**Test Case 5.4: Modify Booking**
- [ ] Try to modify existing booking
- **Expected:** Update successful or option to rebook

### Feature 6: Reviews & Ratings

**Test Case 6.1: Submit Review**
- [ ] Navigate to `/reviews`
- [ ] Have at least one completed booking
- [ ] Fill form:
  - [ ] Food Rating: 5 stars
  - [ ] Service Rating: 4 stars
  - [ ] Ambiance Rating: 5 stars
  - [ ] Comment: "Great food and service!"
- [ ] Click Submit
- **Expected:**
  - [ ] Review saved
  - [ ] Confirmation message
  - [ ] Review appears in list

**Test Case 6.2: View Review Statistics**
- [ ] On `/reviews`
- **Expected:**
  - [ ] Average ratings displayed
  - [ ] Rating distribution shown
  - [ ] Review count displayed

**Test Case 6.3: Mark Review Helpful**
- [ ] Find a review
- [ ] Click "Helpful" button
- **Expected:** Helpful count incremented

**Test Case 6.4: Delete Review**
- [ ] Find your review
- [ ] Click Delete
- **Expected:**
  - [ ] Review removed
  - [ ] Confirmation message

### Feature 7: Loyalty Program

**Test Case 7.1: View Loyalty Status**
- [ ] Log in as john@example.com
- [ ] Navigate to `/loyalty`
- **Expected:**
  - [ ] Current tier displayed: "Silver"
  - [ ] Points balance: 1500
  - [ ] Progress to next tier shown
  - [ ] Tier benefits listed

**Test Case 7.2: Check Tier Progression**
- [ ] View loyalty page
- **Expected:**
  - [ ] Bronze: 0-999 pts
  - [ ] Silver: 1000-2999 pts (john is here)
  - [ ] Gold: 3000-4999 pts
  - [ ] Platinum: 5000+ pts

**Test Case 7.3: Redeem Points**
- [ ] Click "Redeem Points"
- [ ] Enter 100 points
- **Expected:**
  - [ ] Points reduced by 100
  - [ ] Confirmation message
  - [ ] Discount code generated

**Test Case 7.4: View Transaction History**
- [ ] Scroll to transaction history
- **Expected:**
  - [ ] All transactions listed
  - [ ] Type (Earn/Redeem), amount, date shown
  - [ ] Running balance calc correct

**Test Case 7.5: Birthday Bonus**
- [ ] Check if birthday bonus available (if birthday matches)
- **Expected:** Bonus points offered

### Feature 8: Promotions & Discounts

**Test Case 8.1: Apply Promo Code**
- [ ] Make a booking
- [ ] Look for promo code widget
- [ ] Try code: WELCOME15
- **Expected:**
  - [ ] Code validated
  - [ ] 15% discount applied
  - [ ] Total price reduced

**Test Case 8.2: Invalid Promo Code**
- [ ] Try code: INVALID123
- **Expected:** Error message "Invalid code"

**Test Case 8.3: Expired Promo Code**
- [ ] Try expired code
- **Expected:** Error message "Promo code expired"

**Test Case 8.4: Tier-Based Promo**
- [ ] Use code LOYALTY20 (needs Gold tier)
- [ ] As Silver tier user
- **Expected:** Error or message "Not eligible for this promotion"

**Test Case 8.5: Referral Program**
- [ ] Log in as referrer
- [ ] Request referral link
- **Expected:**
  - [ ] Unique referral link generated
  - [ ] Can copy/share link
  - [ ] Link format: referral code + tracking

### Feature 9: Multi-Language Support

**Test Case 9.1: Change Language**
- [ ] Find language selector (globe icon)
- [ ] Select "Español"
- **Expected:**
  - [ ] Page refreshes
  - [ ] UI text in Spanish
  - [ ] Language persisted in storage

**Test Case 9.2: Language Persistence**
- [ ] Set language to "Français"
- [ ] Refresh page
- **Expected:** Language still French

**Test Case 9.3: All Languages**
- [ ] Test English (en)
- [ ] Test Spanish (es)
- [ ] Test French (fr)
- **Expected:** All work without errors

---

## Advanced Features Testing

### Feature 10: Group Event Booking

**Test Case 10.1: 3-Step Event Wizard**
- [ ] Navigate to `/group-events`
- [ ] **Step 1 - Event Details:**
  - [ ] Event name: "Company Party"
  - [ ] Event type: "Corporate"
  - [ ] Date: Future date
  - [ ] Guest count: 30
  - [ ] Description: "Annual celebration"
  - [ ] Click Next
- **Expected:** Validation passes, go to Step 2

**Test Case 10.2: Package Selection**
- [ ] **Step 2 - Select Package:**
  - [ ] View Basic ($50/head = $1500 total)
  - [ ] View Premium ($75/head = $2250 total)
  - [ ] View Luxury ($100/head = $3000 total)
  - [ ] Select Premium
- **Expected:**
  - [ ] Price calculated correctly
  - [ ] Package details shown
  - [ ] Go to Step 3

**Test Case 10.3: Special Requests**
- [ ] **Step 3 - Special Requests:**
  - [ ] Request: "No meat options"
  - [ ] Special timing: "6 PM start"
  - [ ] Click Submit
- **Expected:**
  - [ ] Booking created
  - [ ] Confirmation with proposal
  - [ ] Booking ID provided

**Test Case 10.4: Event Proposal**
- [ ] View event after booking
- **Expected:**
  - [ ] Proposal document generated
  - [ ] Cost breakdown visible
  - [ ] Coordinator assigned

### Feature 11: Kitchen Display System

**Test Case 11.1: Order Submission**
- [ ] Member orders items to table
- **Expected:**
  - [ ] Order appears in KDS
  - [ ] Timer starts
  - [ ] Item preparation time set

**Test Case 11.2: Order Status Update**
- [ ] Mark order "Preparing"
- [ ] Kitchen confirms
- **Expected:** Status updated in real-time

### Feature 12: QR Code Generation

**Test Case 12.1: Booking QR Code**
- [ ] Make a booking
- [ ] View confirmation
- **Expected:**
  - [ ] QR code generated
  - [ ] Contains booking ID
  - [ ] Can be scanned

**Test Case 12.2: Download QR Code**
- [ ] Click "Download QR Code"
- **Expected:** QR code PNG downloaded

### Feature 13: Payment Integration

**Test Case 13.1: Stripe Test Payment**
- [ ] Make booking requiring payment
- [ ] Payment form appears
- [ ] Enter test card: 4242 4242 4242 4242
- [ ] Enter expiry: 12/25
- [ ] Enter CVV: 123
- [ ] Click Pay
- **Expected:**
  - [ ] Payment processed
  - [ ] Confirmation received
  - [ ] Booking confirmed

**Test Case 13.2: Payment Failure**
- [ ] Enter declined card: 4000 0000 0000 0002
- **Expected:** Error message "Card declined"

### Feature 14: Email Notifications

**Test Case 14.1: Booking Confirmation Email**
- [ ] Make a booking
- [ ] Check email inbox
- **Expected:**
  - [ ] Confirmation email received
  - [ ] Contains booking details
  - [ ] Includes booking ID
  - [ ] Has QR code attachment

**Test Case 14.2: Review Thank You Email**
- [ ] Submit a review
- **Expected:** Thank you email received

---

## Admin Features Testing

### Feature 15: Admin Dashboard

**Test Case 15.1: Dashboard Access**
- [ ] Log in as admin@restaurant.com
- [ ] Navigate to `/admin`
- **Expected:**
  - [ ] Dashboard loaded
  - [ ] Analytics visible
  - [ ] All admin options available

**Test Case 15.2: Analytics**
- [ ] Dashboard shows:
  - [ ] Total bookings this month
  - [ ] Revenue statistics
  - [ ] Average rating
  - [ ] Popular menu items
- **Expected:** All stats calculate correctly

### Feature 16: Menu Management (Admin)

**Test Case 16.1: Add Menu Item**
- [ ] Click "Add Item"
- [ ] Fill:
  - [ ] Name: "New Pasta"
  - [ ] Price: 15.99
  - [ ] Category: Mains
  - [ ] Dietary: Vegetarian
- [ ] Click Add
- **Expected:** Item appears in menu

**Test Case 16.2: Update Menu Item**
- [ ] Click Edit on item
- [ ] Change price: 16.99
- [ ] Click Save
- **Expected:** Price updated

### Feature 17: Staff Management

**Test Case 17.1: View Staff**
- [ ] Admin section shows 3 staff:
  - [ ] Mike Johnson (Waiter)
  - [ ] Sarah Chef (Chef)
  - [ ] Tom Manager (Manager)
- **Expected:** All staff listed with roles

**Test Case 17.2: Add Staff**
- [ ] Click "Add Staff"
- [ ] Fill form
- **Expected:** New staff added

**Test Case 17.3: Rate Staff Performance**
- [ ] Click "Rate" on staff member
- [ ] Give rating: 4.5/5
- [ ] Add comment: "Great service"
- **Expected:** Rating saved and averaged

### Feature 18: Inventory Management

**Test Case 18.1: View Inventory**
- [ ] Admin → Inventory
- **Expected:** All items listed with stock levels

**Test Case 18.2: Update Stock**
- [ ] Click item
- [ ] Update quantity
- **Expected:** Stock updated and logged

**Test Case 18.3: Low Stock Alert**
- [ ] Set item below threshold
- **Expected:** Alert displayed in admin

---

## Integration Testing

### API Integration

**Test Case API.1: Auth Endpoints**
```
POST /api/v1/auth/login
- Expected: 200 with token for valid credentials
- Expected: 401 for invalid credentials

GET /api/v1/auth/me (with token)
- Expected: 200 with user data
- Expected: 401 without token
```

**Test Case API.2: Booking Endpoints**
```
GET /api/v1/bookings
- Expected: 200 with user's bookings

POST /api/v1/bookings
- Expected: 201 with created booking

PUT /api/v1/bookings/:id
- Expected: 200 with updated booking

DELETE /api/v1/bookings/:id
- Expected: 204 (no content)
```

**Test Case API.3: Menu Endpoints**
```
GET /api/v1/menu
- Expected: 200 with all items

GET /api/v1/menu/:id
- Expected: 200 with item details

POST /api/v1/menu (admin only)
- Expected: 201 with created item
- Expected: 403 for non-admin
```

---

## Performance Testing

### Load Testing

**Test Case PERF.1: Page Load Time**
- [ ] Homepage: < 2 seconds
- [ ] Menu page: < 2 seconds
- [ ] Dashboard: < 3 seconds
- **Tool:** Browser DevTools → Network tab

**Test Case PERF.2: API Response Time**
- [ ] Login: < 500ms
- [ ] Get bookings: < 500ms
- [ ] Get menu: < 300ms
- **Tool:** API monitoring in DevTools

**Test Case PERF.3: Database Performance**
- [ ] Query 1000 bookings: < 1 second
- [ ] Calculate loyalty stats: < 500ms
- **Tool:** MongoDB performance monitoring

---

## Error Handling Testing

### Error Scenarios

**Test Case ERR.1: Network Error**
- [ ] Turn off internet
- [ ] Try to make booking
- **Expected:** Error message "Network error - please try again"

**Test Case ERR.2: Server Error**
- [ ] Stop backend server
- [ ] Try API call
- **Expected:**
  - [ ] Error message "Server unavailable"
  - [ ] Proper 500 error handling

**Test Case ERR.3: Validation Error**
- [ ] Submit empty booking form
- **Expected:** Validation error for each field

**Test Case ERR.4: Authorization Error**
- [ ] Try to access another user's booking
- **Expected:** 403 Forbidden error

**Test Case ERR.5: Rate Limiting** (if implemented)
- [ ] Make 100+ API calls quickly
- **Expected:** Rate limit error after threshold

---

## Regression Testing

### Verify No Broken Features

After any changes, run through:

- [ ] Login/Logout works
- [ ] Menu displays correctly
- [ ] Bookings can be made
- [ ] Reviews can be submitted
- [ ] Loyalty works
- [ ] Promos apply correctly
- [ ] Admin functions work
- [ ] No console errors
- [ ] All pages load without crashes

---

## Accessibility Testing

**Test Case ACC.1: Keyboard Navigation**
- [ ] Tab through all pages
- **Expected:** All clickable elements accessible

**Test Case ACC.2: Screen Reader**
- [ ] Test with screen reader
- **Expected:** All content readable

**Test Case ACC.3: Color Contrast**
- [ ] Check text contrast
- **Expected:** WCAG AA standard

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (Mac & iOS)
- [ ] Edge (latest)
- [ ] Mobile browsers

---

## Test Report Template

Use this template to document your testing:

```
Test Date: ___________
Tester: ___________
Browser: ___________
Environment: DEV / STAGING / PRODUCTION

Features Tested:
[ ] Feature 1: Registration
[ ] Feature 2: Login
[ ] Feature 3: Menu
[ ] Feature 4: Booking
[ ] Feature 5: Reviews
[ ] Feature 6: Loyalty
[ ] Feature 7: Promotions
[ ] Feature 8: Group Events
[ ] Feature 9: Admin Dashboard

Issues Found:
1. _________________ (Severity: High/Medium/Low)
2. _________________ (Severity: High/Medium/Low)

Overall Status: PASS / FAIL
Comments: _________________
```

---

## Continuous Testing

Set up automated tests:
- [ ] Unit tests for backend
- [ ] Integration tests for APIs
- [ ] E2E tests for user flows
- [ ] Performance tests
- [ ] Security tests

---

**Last Updated:** 2024
**Version:** 1.0.0
