import { Request, Response } from 'express';
import { Table } from '../models';
import { createTableSchema, updateTableSchema } from '../utils/validation';
import { createError, ErrorCodes } from '../utils/errors';
import { asyncHandler } from '../middleware/errors';

export const getAllTables = asyncHandler(async (req: Request, res: Response) => {
  const { location, capacity, isActive } = req.query;
  const filter: any = {};

  if (location) filter.location = location;
  if (capacity) filter.capacity = parseInt(capacity as string);
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const tables = await Table.find(filter).sort({ tableNumber: 1 });

  res.json({
    success: true,
    data: tables,
  });
});

export const getTableById = asyncHandler(async (req: Request, res: Response) => {
  const table = await Table.findById(req.params.id);

  if (!table) {
    throw createError(404, 'Table not found', ErrorCodes.TABLE_NOT_FOUND);
  }

  res.json({
    success: true,
    data: table,
  });
});

export const createTable = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createTableSchema.parse(req.body);

  // Check if table number already exists
  const existingTable = await Table.findOne({ tableNumber: validatedData.tableNumber });
  if (existingTable) {
    throw createError(409, 'Table number already exists', ErrorCodes.VALIDATION_ERROR);
  }

  const table = new Table({
    tableNumber: validatedData.tableNumber,
    capacity: validatedData.capacity,
    location: validatedData.location,
    description: validatedData.description,
  });

  await table.save();

  res.status(201).json({
    success: true,
    data: table,
  });
});

export const updateTable = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = updateTableSchema.parse(req.body);

  const table = await Table.findByIdAndUpdate(req.params.id, validatedData, {
    new: true,
    runValidators: true,
  });

  if (!table) {
    throw createError(404, 'Table not found', ErrorCodes.TABLE_NOT_FOUND);
  }

  res.json({
    success: true,
    data: table,
  });
});

export const deleteTable = asyncHandler(async (req: Request, res: Response) => {
  const table = await Table.findByIdAndDelete(req.params.id);

  if (!table) {
    throw createError(404, 'Table not found', ErrorCodes.TABLE_NOT_FOUND);
  }

  res.json({
    success: true,
    message: 'Table deleted successfully',
  });
});
