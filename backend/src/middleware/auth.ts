import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { createError, ErrorCodes } from '../utils/errors';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw createError(401, 'No token provided', ErrorCodes.UNAUTHORIZED);
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
      throw createError(401, 'Invalid or expired token', ErrorCodes.TOKEN_EXPIRED);
    }

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(createError(401, 'Unauthorized', ErrorCodes.UNAUTHORIZED));
  }

  if (req.user.role !== 'admin') {
    return next(createError(403, 'Admin access required', ErrorCodes.FORBIDDEN));
  }

  next();
};
