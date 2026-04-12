# 🚀 Deployment Guide - Production Ready

Complete step-by-step guide to deploy your TableBook application to production.

## Overview

We'll deploy on:
- **Frontend**: Vercel (free tier, ideal for React apps)
- **Backend**: Render.com (free tier, Node.js support)
- **Database**: MongoDB Atlas (free tier)

Total cost: **$0/month** (unless you scale)

---

## Prerequisites

- GitHub repository with your code
- Vercel account (free): https://vercel.com
- Render account (free): https://render.com
- MongoDB Atlas account (done already)

---

## Step 1: Prepare Your Code

### 1.1 Update main README
```markdown
# Production URLs

- **Frontend**: https://your-app.vercel.app
- **API**: https://hotel-booking-api.onrender.com
```

### 1.2 Ensure environment files are set up
```
backend/.env.example     ✓ Created
frontend/.env.example    ✓ Created
```

### 1.3 Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

---

## Step 2: Deploy Backend on Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up (use GitHub to sign up - easier)

### 2.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Click "Connect Repository"
3. Select your GitHub repository
4. Authorize Render to access GitHub

### 2.3 Configure Service
Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `hotel-booking-api` |
| **Environment** | `Node` |
| **Region** | Choose closest to users |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | Free (or Paid for production) |

### 2.4 Add Environment Variables
Click "Advanced" → "Add Environment Variable" for each:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://...` |
| `JWT_SECRET` | Generate: `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Generate: `openssl rand -base64 32` |
| `CORS_ORIGIN` | https://your-app.vercel.app |

### 2.5 Deploy
Click "Create Web Service"

✅ Wait 3-5 minutes for build to complete
✅ You'll get a URL like: `https://hotel-booking-api.onrender.com`
✅ Save this URL for frontend config

### 2.6 Test Backend
```
Visit: https://hotel-booking-api.onrender.com/health
Should show: { "success": true, "message": "Server is running" }
```

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up (use GitHub - easiest)

### 3.2 Create New Project
1. Click "Add New..." → "Project"
2. Click "Continue with GitHub"
3. Find your repository and import

### 3.3 Configure Project

**Framework Preset**: Select "Vite"

**Root Directory**: Click "Edit" → Set to `frontend`

### 3.4 Add Environment Variables

In "Environment Variables" section, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | https://hotel-booking-api.onrender.com/api/v1 |

### 3.5 Deploy
Click "Deploy"

✅ Wait 2-3 minutes for deployment
✅ Get URL like: `https://hotel-booking-frontend.vercel.app`
✅ This is your production app URL!

### 3.6 Test Frontend
```
Visit: https://your-app.vercel.app
Should load the TableBook homepage
```

---

## Step 4: Connect Backend & Frontend

### 4.1 Update Backend CORS
Since frontend is now on Vercel:

1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Find `CORS_ORIGIN` variable
5. Update to: `https://your-app.vercel.app`
6. Click "Save"
7. Backend will auto-redeploy

### 4.2 Verify Connection
1. Open frontend: https://your-app.vercel.app
2. Go to "Sign Up"
3. Fill form and submit
4. Should say "Account created successfully"

✅ Frontend successfully communicates with backend!

---

## Step 5: MongoDB Setup for Production

### 5.1 Update Whitelist
MongoDB Atlas → Security → Network Access:

**Option A: Specific IP** (more secure)
- Get Render IP from service logs
- Add only that IP

**Option B: Allow all** (easier for testing)
- Add `0.0.0.0/0`
- ⚠️ Only recommend for development

### 5.2 Strong Database Password
- Go to Database Access
- Edit database user
- Generate strong password
- Update MONGODB_URI in Render with new credentials

---

## Step 6: Test Production Deployment

### 6.1 Full End-to-End Test

1. **Visit Frontend**: https://your-app.vercel.app

2. **Sign Up**
   - Create account with test email
   - Verify signup works
   - Redirected to home

3. **Book a Table**
   - Click "Book a Table"
   - Select date, time, guests
   - See available tables
   - Select table
   - Enter details
   - Complete booking
   - See confirmation

4. **View Booking**
   - Click "My Bookings"
   - See your booking in list
   - Click to view details

5. **Admin Access** (if you created admin user)
   - Logout
   - Login as admin@hotel.com
   - Go to /admin
   - See dashboard with analytics

✅ **All working?** You're live! 🚀

### 6.2 Monitor Logs

**Backend Logs** (Render):
- Dashboard → Select service → Logs
- Should see: `✅ Server running on port 5000`

**Frontend Logs** (Vercel):
- Dashboard → Select project → Deployments → View logs
- Should see successful build

---

## Step 7: Maintain Your Stack

### Regular Maintenance

**Weekly**
- Check Render logs for errors
- Monitor MongoDB storage usage

**Monthly**
- Update dependencies: `npm update`
- Test all features in production
- Backup database snapshots

**On Code Changes**
```bash
# Automatic with GitHub integration:
git push origin main
# → Render rebuilds backend
# → Vercel rebuilds frontend
# → Live in 2-5 minutes
```

### Monitoring & Alerts

**Set up Render alerts**:
- Dashboard → Settings → Notifications
- Get email on deployment fails

**Monitor MongoDB**:
- Atlas → Alerts
- Set up alerts for storage usage

---

## Common Production Issues

### "Backend not responding"
```
❌ 502 Bad Gateway
✅ Solution:
   1. Check Render logs for errors
   2. Verify MongoDB connection string
   3. Verify all env vars set correctly
   4. Restart service (Manual restart in Render)
```

### "CORS error in production"
```
❌ Cross-Origin Request Blocked
✅ Solution:
   1. Update CORS_ORIGIN in Render to match Vercel URL
   2. Wait for service to redeploy
   3. Clear browser cache
   4. Test again
```

### "Database connection timeout"
```
❌ MongoDB timeout or refused
✅ Solution:
   1. Check IP whitelist in MongoDB Atlas
   2. Verify connection string has <username> and <password> filled
   3. Ensure database user has "readWrite" role
   4. Check network access tab for Render IP
```

### "Build fails on Vercel"
```
❌ Build error during deployment
✅ Solution:
   1. Check Build Logs in Vercel
   2. Ensure all dependencies in package.json
   3. Check for TypeScript errors
   4. Verify environment variables set
```

---

## Performance Tips

### Optimize Images
- Compress images before uploading
- Use WebP format
- Lazy load images

### Database Indexes
Already configured in schema for:
- `userId` (for user bookings)
- `tableId` (for table queries)
- `bookingDate` (for date range queries)

### Caching
- Vercel CDN caches static assets
- Consider Redis for frequently accessed data (future enhancement)

---

## Security Checklist

- [ ] Environment variables never in code
- [ ] Strong `JWT_SECRET` generated (use `openssl`)
- [ ] Database password strong & unique
- [ ] MongoDB IP whitelisted (specific IPs if possible)
- [ ] HTTPS enabled (auto on Vercel & Render)
- [ ] CORS configured correctly
- [ ] Rate limiting ready (middleware in place)

---

## Scaling Considerations

### When to upgrade

**Free tier limits:**
- Render: 750 hours/month (1 service max)
- Vercel: 100 GB/month bandwidth
- MongoDB Atlas: 512 MB storage

**When to upgrade to paid:**
- Your app gets >100 daily active users
- Data exceeds 500 MB
- Need custom domain with SSL

### Scaling steps
1. Upgrade Render to Paid (cheaper than AWS)
2. Upgrade MongoDB to Shared Cluster ($10/month)
3. Use Vercel Pro if need more bandwidth
4. Add Redis caching layer
5. Implement CDN for static assets

---

## Rollback Plan

If something breaks in production:

**Option 1: Revert Code**
```bash
git revert <commit-hash>
git push origin main
# Auto-redeploys in 2-5 minutes
```

**Option 2: Use Previous Deployment**

**Vercel**:
- Dashboard → Deployments → Click previous deployment
- Click "Redeploy"

**Render**:
- Dashboard → Service → Manual Deploy
- Select previous commit

---

## Final Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] MongoDB Atlas configured
- [ ] Environment variables set in both services
- [ ] CORS updated to production URLs
- [ ] End-to-end test passed
- [ ] Logs monitored
- [ ] Backup strategy in place
- [ ] Team has access to dashboards

---

## Success! 🎉

Your TableBook app is now live!

**Sharing with others:**
- Send them: https://your-app.vercel.app
- They can sign up and book tables
- You can see bookings in admin dashboard

**Next Steps:**
- Share with friends/colleagues for feedback
- Gather usage analytics
- Plan Phase 2 features (payments, emails, etc.)
- Consider mobile app

---

## Support

Stuck? Check these resources:
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com

Happy deploying! 🚀
