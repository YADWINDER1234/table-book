import { Request, Response } from 'express';
import { User } from '../models';
import { registerSchema, loginSchema } from '../utils/validation';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { createError, ErrorCodes } from '../utils/errors';
import { asyncHandler } from '../middleware/errors';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);

  // Check if user exists
  const existingUser = await User.findOne({
    $or: [{ email: validatedData.email }, { username: validatedData.username }],
  });

  if (existingUser) {
    throw createError(
      409,
      existingUser.email === validatedData.email ? 'Email already registered' : 'Username already taken',
      existingUser.email === validatedData.email ? ErrorCodes.EMAIL_ALREADY_EXISTS : ErrorCodes.USERNAME_ALREADY_EXISTS
    );
  }

  // Create new user
  const user = new User({
    email: validatedData.email,
    username: validatedData.username,
    password: validatedData.password,
    firstName: validatedData.firstName,
    lastName: validatedData.lastName,
    phone: validatedData.phone,
    role: 'user',
  });

  await user.save();

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken(user._id.toString());

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);

  const user = await User.findOne({ email: validatedData.email }).select('+password');

  if (!user || !(await user.comparePassword(validatedData.password))) {
    throw createError(401, 'Invalid email or password', ErrorCodes.INVALID_CREDENTIALS);
  }

  if (!user.isActive) {
    throw createError(403, 'Account is disabled', ErrorCodes.FORBIDDEN);
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken(user._id.toString());

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createError(400, 'Refresh token is required', ErrorCodes.VALIDATION_ERROR);
  }

  const { verifyRefreshToken } = await import('../utils/jwt');
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    throw createError(401, 'Invalid refresh token', ErrorCodes.TOKEN_EXPIRED);
  }

  const user = await User.findById(decoded.userId);

  if (!user || !user.isActive) {
    throw createError(401, 'User not found or inactive', ErrorCodes.UNAUTHORIZED);
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  res.json({
    success: true,
    data: { accessToken },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Unauthorized', ErrorCodes.UNAUTHORIZED);
  }

  const user = await User.findById(req.user.userId).select('-password');
  
  if (!user) {
    throw createError(404, 'User not found', ErrorCodes.USER_NOT_FOUND);
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        loyaltyTier: (user as any).loyaltyTier,
        loyaltyPoints: (user as any).loyaltyPoints,
      }
    }
  });
});
