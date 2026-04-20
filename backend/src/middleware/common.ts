import { Request, Response, NextFunction } from 'express';

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || '';
  
  // Allow multiple origins from comma-separated string, or fallback to any origin if not set
  const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : [];
  
  // Allow any localhost origin for development or explicitly allowed origins
  if (origin.includes('localhost') || origin.includes('127.0.0.1') || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // If not matching above, you can allow all (less secure in prod) or pass the specific origin if you want to support Vercel preview domains dynamically
    // To allow Vercel previews dynamically, we just echo back the origin if it ends with vercel.app
    if (origin && origin.endsWith('vercel.app')) {
      res.header('Access-Control-Allow-Origin', origin);
    } else if (origin) {
      res.header('Access-Control-Allow-Origin', origin); // Just allow any origin that hits it to bypass CORS in dev/staging.
    } else {
      res.header('Access-Control-Allow-Origin', allowedOrigins[0] || '*');
    }
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};
