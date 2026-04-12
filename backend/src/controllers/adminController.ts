import { Request, Response } from 'express';
import { Booking, Table, Analytics } from '../models';
import { createError, ErrorCodes } from '../utils/errors';
import { asyncHandler } from '../middleware/errors';
import { getDateRange } from '../utils/dateTime';

export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
  const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

  const filter: any = {};
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.bookingDate = {};
    if (startDate) filter.bookingDate.$gte = new Date(startDate as string);
    if (endDate) filter.bookingDate.$lte = new Date(endDate as string);
  }

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const bookings = await Booking.find(filter)
    .populate(['userId', 'tableId'])
    .sort({ bookingDate: -1 })
    .skip(skip)
    .limit(parseInt(limit as string));

  const total = await Booking.countDocuments(filter);

  res.json({
    success: true,
    data: {
      bookings,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    },
  });
});

export const getBookingStats = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const filter: any = {};
  if (startDate || endDate) {
    filter.bookingDate = {};
    if (startDate) filter.bookingDate.$gte = new Date(startDate as string);
    if (endDate) filter.bookingDate.$lte = new Date(endDate as string);
  }

  const stats = await Booking.aggregate([
    { $match: filter },
    {
      $facet: {
        total: [{ $count: 'count' }],
        byStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ],
        avgGuests: [
          {
            $group: {
              _id: null,
              average: { $avg: '$numberOfGuests' },
            },
          },
        ],
        peakHour: [
          {
            $group: {
              _id: {
                $substr: ['$startTime', 0, 2],
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 1 },
        ],
      },
    },
  ]);

  const result = {
    totalBookings: stats[0].total[0]?.count || 0,
    byStatus: stats[0].byStatus,
    averageGuestSize: Math.round(stats[0].avgGuests[0]?.average || 0),
    peakHour: stats[0].peakHour[0]?._id || '12',
  };

  res.json({
    success: true,
    data: result,
  });
});

export const getDashboardAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Total bookings this month
  const totalBookings = await Booking.countDocuments({
    bookingDate: { $gte: thirtyDaysAgo },
  });

  // Confirmed bookings this month
  const confirmedBookings = await Booking.countDocuments({
    bookingDate: { $gte: thirtyDaysAgo },
    status: 'confirmed',
  });

  // Cancelled bookings this month
  const cancelledBookings = await Booking.countDocuments({
    bookingDate: { $gte: thirtyDaysAgo },
    status: 'cancelled',
  });

  // Today's bookings
  const { start, end } = getDateRange(now);
  const todayBookings = await Booking.find({
    bookingDate: { $gte: start, $lte: end },
  }).populate('tableId');

  // Total tables
  const totalTables = await Table.countDocuments({ isActive: true });

  // Bookings trend (last 7 days)
  const trend = await Booking.aggregate([
    {
      $match: {
        bookingDate: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$bookingDate' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    data: {
      summary: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalTables,
        occupancyRate: totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0,
      },
      todayBookings: {
        count: todayBookings.length,
        bookings: todayBookings,
      },
      trend,
    },
  });
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, notes } = req.body;

  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    throw createError(400, 'Invalid status', ErrorCodes.VALIDATION_ERROR);
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    {
      status,
      notes: notes || undefined,
      confirmedAt: status === 'confirmed' ? new Date() : undefined,
      cancelledAt: status === 'cancelled' ? new Date() : undefined,
    },
    { new: true }
  );

  if (!booking) {
    throw createError(404, 'Booking not found', ErrorCodes.BOOKING_NOT_FOUND);
  }

  res.json({
    success: true,
    data: booking,
  });
});
