import { Request, Response } from 'express';
import Staff from '../models/Staff';
import { AppError } from '../utils/errors';

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const { role, department, isActive } = req.query;

    let filter: any = {};
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (isActive) filter.isActive = isActive === 'true';

    const staff = await Staff.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: staff,
      count: staff.length,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch staff');
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);

    if (!staff) {
      throw new AppError(404, 'Staff member not found');
    }

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    throw error;
  }
};

export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, role, department, employmentDate } = req.body;

    // Check if email exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      throw new AppError(400, 'Email already registered');
    }

    const newStaff = new Staff({
      name,
      email,
      phone,
      role,
      department,
      employmentDate,
    });

    await newStaff.save();

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: newStaff,
    });
  } catch (error) {
    throw error;
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check email uniqueness if being updated
    if (updates.email) {
      const existing = await Staff.findOne({ email: updates.email, _id: { $ne: id } });
      if (existing) {
        throw new AppError(400, 'Email already in use');
      }
    }

    const staff = await Staff.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!staff) {
      throw new AppError(404, 'Staff member not found');
    }

    res.status(200).json({
      success: true,
      message: 'Staff member updated successfully',
      data: staff,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete by marking as inactive
    const staff = await Staff.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!staff) {
      throw new AppError(404, 'Staff member not found');
    }

    res.status(200).json({
      success: true,
      message: 'Staff member deactivated',
      data: staff,
    });
  } catch (error) {
    throw error;
  }
};

export const updateStaffAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    const staff = await Staff.findByIdAndUpdate(id, { availability }, { new: true });

    if (!staff) {
      throw new AppError(404, 'Staff member not found');
    }

    res.status(200).json({
      success: true,
      message: 'Availability updated',
      data: staff,
    });
  } catch (error) {
    throw error;
  }
};

export const rateStaffPerformance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const staff = await Staff.findById(id);
    if (!staff) {
      throw new AppError(404, 'Staff member not found');
    }

    // Update performance rating
    const currentRating = staff.performance.rating || 0;
    const currentReviews = staff.performance.totalReviews || 0;

    staff.performance.rating = (currentRating * currentReviews + rating) / (currentReviews + 1);
    staff.performance.totalReviews = currentReviews + 1;

    if (comment) {
      staff.performance.commendations?.push(comment);
    }

    await staff.save();

    res.status(200).json({
      success: true,
      message: 'Performance rating updated',
      data: staff,
    });
  } catch (error) {
    throw error;
  }
};

export const getStaffStats = async (req: Request, res: Response) => {
  try {
    const totalStaff = await Staff.countDocuments();
    const activeStaff = await Staff.countDocuments({ isActive: true });

    const staffByRole = await Staff.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const staffByDepartment = await Staff.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStaff,
        activeStaff,
        staffByRole,
        staffByDepartment,
      },
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch staff stats');
  }
};
