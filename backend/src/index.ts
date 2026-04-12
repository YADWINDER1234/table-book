import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import { connectDB } from './config/database';
import { requestLogger, corsMiddleware } from './middleware/common';
import { errorHandler as errorMiddleware } from './middleware/errors';

// Routes
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';
import adminRoutes from './routes/adminRoutes';
import waitlistRoutes from './routes/waitlistRoutes';
import menuRoutes from './routes/menuRoutes';
import reviewRoutes from './routes/reviewRoutes';
import loyaltyRoutes from './routes/loyaltyRoutes';
import staffRoutes from './routes/staffRoutes';
import orderRoutes from './routes/orderRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import promotionRoutes from './routes/promotionRoutes';
import eventRoutes from './routes/eventRoutes';
import deliveryRoutes from './routes/deliveryRoutes';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Initialize database
connectDB().catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.includes("vercel.app") ||
      origin.includes("localhost")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/waitlist', waitlistRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/loyalty', loyaltyRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/promotions', promotionRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/delivery', deliveryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'API endpoint not found',
    },
  });
});

// Error middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation available on port ${PORT} at /api/v1`);
  console.log(`✅ Database connected\n`);
});

export default app;
