import { Request, Response } from 'express';
import Review from '../models/Review';
import Booking from '../models/Booking';
import { AppError } from '../utils/errors';

export const createReview = async (req: Request, res: Response) => {
  try {
    const { bookingId, ratings, comment, images } = req.body;
    const userId = (req as any).userId;

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }

    if (booking.userId.toString() !== userId) {
      throw new AppError(403, 'Unauthorized to review this booking');
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      throw new AppError(400, 'Review already exists for this booking');
    }

    const newReview = new Review({
      bookingId,
      userId,
      tableId: booking.tableId,
      ratings,
      comment,
      images: images || [],
      verified: true,
    });

    await newReview.save();

    // Update booking with review flag
    booking.notes = (booking.notes || '') + '\n[Reviewed]';
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: newReview,
    });
  } catch (error) {
    throw error;
  }
};

export const getReviewsByTable = async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const skip = ((Number(page) - 1) * Number(limit)) as number;

    const reviews = await Review.find({ tableId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('userId', 'name');

    const total = await Review.countDocuments({ tableId });

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch reviews');
  }
};

export const getReviewsByUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 })
      .populate('tableId', 'location capacity')
      .populate('bookingId');

    res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch user reviews');
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ratings, comment, images } = req.body;
    const userId = (req as any).userId;

    const review = await Review.findById(id);
    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    if (review.userId.toString() !== userId) {
      throw new AppError(403, 'Unauthorized to update this review');
    }

    review.ratings = ratings || review.ratings;
    review.comment = comment || review.comment;
    if (images) review.images = images;

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const review = await Review.findById(id);
    if (!review) {
      throw new AppError(404, 'Review not found');
    }

    if (review.userId.toString() !== userId) {
      throw new AppError(403, 'Unauthorized to delete this review');
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    throw error;
  }
};

export const markHelpful = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body; // true or false

    const review = await Review.findById(id);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (helpful) {
      review.helpful += 1;
    } else {
      review.unhelpful += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review marked',
      data: review,
    });
  } catch (error) {
    throw error;
  }
};

export const getReviewStats = async (req: Request, res: Response) => {
  try {
    const totalReviews = await Review.countDocuments();

    const avgRatings = await Review.aggregate([
      {
        $group: {
          _id: null,
          food: { $avg: '$ratings.food' },
          service: { $avg: '$ratings.service' },
          ambiance: { $avg: '$ratings.ambiance' },
          overall: { $avg: '$ratings.overall' },
        },
      },
    ]);

    const ratingDistribution = await Review.aggregate([
      {
        $group: {
          _id: '$ratings.overall',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        averageRatings: avgRatings[0] || {},
        ratingDistribution,
      },
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch review stats');
  }
};
