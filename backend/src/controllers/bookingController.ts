import { Request, Response } from 'express';
import { Booking, Table, User } from '../models';
import { createBookingSchema, updateBookingSchema } from '../utils/validation';
import { generateBookingId, verifyAccessToken } from '../utils/jwt';
import { createError, ErrorCodes } from '../utils/errors';
import { asyncHandler } from '../middleware/errors';
import { doTimesOverlap, calculateDuration, getDateRange } from '../utils/dateTime';
import { sendBookingConfirmationEmail } from '../utils/email';

export const getAvailableTables = asyncHandler(async (req: Request, res: Response) => {
  const { date, startTime, endTime, capacity } = req.query;

  if (!date || !startTime || !endTime || !capacity) {
    throw createError(400, 'Missing required parameters', ErrorCodes.VALIDATION_ERROR);
  }

  const bookingDate = new Date(date as string);
  const { start, end } = getDateRange(bookingDate);

  // Get all tables with the required capacity
  const availableTables = await Table.find({
    capacity: parseInt(capacity as string),
    isActive: true,
  });

  // Check which tables are booked during this time
  const bookedTables = await Booking.find({
    tableId: { $in: availableTables.map((t) => t._id) },
    bookingDate: { $gte: start, $lte: end },
    status: { $in: ['confirmed', 'pending'] },
  });

  const bookedTableIds = new Set<string>();

  for (const booking of bookedTables) {
    if (doTimesOverlap(booking.startTime, booking.endTime, startTime as string, endTime as string)) {
      bookedTableIds.add(booking.tableId.toString());
    }
  }

  const free = availableTables.filter((table) => !bookedTableIds.has(table._id.toString()));

  res.json({
    success: true,
    data: {
      availableTables: free,
      totalAvailable: free.length,
    },
  });
});

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Unauthorized', ErrorCodes.UNAUTHORIZED);
  }

  const validatedData = createBookingSchema.parse(req.body);

  // Verify table exists
  const table = await Table.findById(validatedData.tableId);
  if (!table || !table.isActive) {
    throw createError(404, 'Table not found', ErrorCodes.TABLE_NOT_FOUND);
  }

  // Check table capacity
  if (table.capacity < validatedData.numberOfGuests) {
    throw createError(400, `Table capacity is ${table.capacity}`, ErrorCodes.VALIDATION_ERROR);
  }

  // Check for conflicts
  const bookingDate = new Date(validatedData.bookingDate);
  const { start, end } = getDateRange(bookingDate);

  const existingBooking = await Booking.findOne({
    tableId: validatedData.tableId,
    bookingDate: { $gte: start, $lte: end },
    status: { $in: ['confirmed', 'pending'] },
  });

  if (
    existingBooking &&
    doTimesOverlap(existingBooking.startTime, existingBooking.endTime, validatedData.startTime, validatedData.endTime)
  ) {
    throw createError(409, 'Table already booked for this time', ErrorCodes.TABLE_ALREADY_BOOKED);
  }

  const duration = validatedData.durationMinutes || calculateDuration(validatedData.startTime, validatedData.endTime);

  const booking = new Booking({
    bookingId: generateBookingId(),
    userId: req.user.userId,
    tableId: validatedData.tableId,
    guestName: validatedData.guestName,
    guestEmail: validatedData.guestEmail,
    guestPhone: validatedData.guestPhone,
    numberOfGuests: validatedData.numberOfGuests,
    bookingDate,
    startTime: validatedData.startTime,
    endTime: validatedData.endTime,
    durationMinutes: duration,
    specialRequests: validatedData.specialRequests,
    status: 'pending',
  });

  await booking.save();

  // Populate references
  await booking.populate(['userId', 'tableId']);

  // Send confirmation email (non-blocking)
  sendBookingConfirmationEmail({
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    bookingId: booking.bookingId,
    bookingDate: booking.bookingDate,
    startTime: booking.startTime,
    endTime: booking.endTime,
    numberOfGuests: booking.numberOfGuests,
    tableNumber: table.tableNumber,
    tableLocation: table.location,
    specialRequests: booking.specialRequests,
  });

  res.status(201).json({
    success: true,
    data: booking,
  });
});

export const getUserBookings = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Unauthorized', ErrorCodes.UNAUTHORIZED);
  }

  const { status, startDate, endDate } = req.query;
  const filter: any = { userId: req.user.userId };

  if (status) {
    filter.status = status;
  }

  if (startDate || endDate) {
    filter.bookingDate = {};
    if (startDate) filter.bookingDate.$gte = new Date(startDate as string);
    if (endDate) filter.bookingDate.$lte = new Date(endDate as string);
  }

  const bookings = await Booking.find(filter)
    .populate('tableId')
    .sort({ bookingDate: -1 });

  res.json({
    success: true,
    data: bookings,
  });
});

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Unauthorized', ErrorCodes.UNAUTHORIZED);
  }

  const booking = await Booking.findById(req.params.id).populate('tableId');

  if (!booking) {
    throw createError(404, 'Booking not found', ErrorCodes.BOOKING_NOT_FOUND);
  }

  // Check ownership
  if (booking.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw createError(403, 'Access denied', ErrorCodes.FORBIDDEN);
  }

  res.json({
    success: true,
    data: booking,
  });
});

export const updateBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Unauthorized', ErrorCodes.UNAUTHORIZED);
  }

  const validatedData = updateBookingSchema.parse(req.body);

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw createError(404, 'Booking not found', ErrorCodes.BOOKING_NOT_FOUND);
  }

  // Check ownership
  if (booking.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw createError(403, 'Access denied', ErrorCodes.FORBIDDEN);
  }

  // Check if booking can be modified
  if (booking.status === 'cancelled' || booking.status === 'completed') {
    throw createError(400, 'Cannot modify completed or cancelled bookings', ErrorCodes.VALIDATION_ERROR);
  }

  if (validatedData.startTime || validatedData.endTime) {
    const startTime = validatedData.startTime || booking.startTime;
    const endTime = validatedData.endTime || booking.endTime;

    // Check for conflicts
    const { start, end } = getDateRange(booking.bookingDate);
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      tableId: booking.tableId,
      bookingDate: { $gte: start, $lte: end },
      status: { $in: ['confirmed', 'pending'] },
    });

    if (conflict && doTimesOverlap(conflict.startTime, conflict.endTime, startTime, endTime)) {
      throw createError(409, 'Time slot conflict', ErrorCodes.BOOKING_CONFLICT);
    }

    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.durationMinutes = calculateDuration(startTime, endTime);
  }

  if (validatedData.numberOfGuests) {
    const table = await Table.findById(booking.tableId);
    if (table && table.capacity < validatedData.numberOfGuests) {
      throw createError(400, `Table capacity is ${table.capacity}`, ErrorCodes.VALIDATION_ERROR);
    }
    booking.numberOfGuests = validatedData.numberOfGuests;
  }

  if (validatedData.specialRequests !== undefined) {
    booking.specialRequests = validatedData.specialRequests;
  }

  await booking.save();

  res.json({
    success: true,
    data: booking,
  });
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createError(401, 'Unauthorized', ErrorCodes.UNAUTHORIZED);
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw createError(404, 'Booking not found', ErrorCodes.BOOKING_NOT_FOUND);
  }

  // Check ownership
  if (booking.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw createError(403, 'Access denied', ErrorCodes.FORBIDDEN);
  }

  if (booking.status === 'cancelled') {
    throw createError(400, 'Booking is already cancelled', ErrorCodes.VALIDATION_ERROR);
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  await booking.save();

  res.json({
    success: true,
    data: booking,
  });
});
