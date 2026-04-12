import { Request, Response } from 'express';
import { GroupEvent, EventPackage } from '../models/Event';
import { AppError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

export const createGroupEvent = async (req: Request, res: Response) => {
  try {
    const {
      eventName,
      description,
      eventDate,
      eventType,
      estimatedGuests,
      specialRequirements,
    } = req.body;
    const organizerId = (req as any).userId;

    // Calculate tables needed (assuming 4 guests per table)
    const totalTables = Math.ceil(estimatedGuests / 4);
    const eventId = `EVT-${Date.now()}-${uuidv4().slice(0, 8)}`;

    const event = new GroupEvent({
      eventId,
      eventName,
      organizerId,
      description,
      eventDate,
      eventType,
      estimatedGuests,
      totalTables,
      specialRequirements,
      status: 'enquiry',
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event enquiry created',
      data: event,
    });
  } catch (error) {
    throw error;
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await GroupEvent.findById(id)
      .populate('organizerId', 'name email phone')
      .populate('bookingIds')
      .populate('dedicatedCoordinator', 'name email');

    if (!event) {
      throw new AppError(404, 'Event not found');
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    throw error;
  }
};

export const updateEventStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, dedicatedCoordinator, budget } = req.body;

    const event = await GroupEvent.findByIdAndUpdate(
      id,
      { status, dedicatedCoordinator, budget },
      { new: true }
    );

    if (!event) {
      throw new AppError(404, 'Event not found');
    }

    res.status(200).json({
      success: true,
      message: 'Event status updated',
      data: event,
    });
  } catch (error) {
    throw error;
  }
};

export const getAllGroupEvents = async (req: Request, res: Response) => {
  try {
    const { status, userId } = req.query;

    let filter: any = {};
    if (status) filter.status = status;
    if (userId) filter.organizerId = userId;

    const events = await GroupEvent.find(filter)
      .populate('organizerId', 'name email')
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch events');
  }
};

export const addBookingToEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { bookingId } = req.body;

    const event = await GroupEvent.findByIdAndUpdate(
      eventId,
      { $push: { bookingIds: bookingId } },
      { new: true }
    );

    if (!event) {
      throw new AppError(404, 'Event not found');
    }

    res.status(200).json({
      success: true,
      message: 'Booking added to event',
      data: event,
    });
  } catch (error) {
    throw error;
  }
};

export const generateEventProposal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await GroupEvent.findById(id)
      .populate('organizerId', 'name email phone')
      .populate('dedicatedCoordinator', 'name email');

    if (!event) {
      throw new AppError(404, 'Event not found');
    }

    const pricePerHead = 50; // Base price
    const estimatedCost = event.estimatedGuests * pricePerHead;

    const proposal = {
      eventId: event.eventId,
      eventName: event.eventName,
      eventType: event.eventType,
      eventDate: event.eventDate,
      estimatedGuests: event.estimatedGuests,
      totalTables: event.totalTables,
      specialRequirements: event.specialRequirements,
      estimatedCostPerHead: pricePerHead,
      totalEstimatedCost: estimatedCost,
      inclusions: [
        'Table reservations',
        'Standard menu options',
        'Basic decorations',
        'Dedicated staff coordination',
      ],
      organizerName: (event.organizerId as any).name,
      organizerEmail: (event.organizerId as any).email,
      coordinator: (event.dedicatedCoordinator as any)?.name || 'To be assigned',
    };

    res.status(200).json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    throw error;
  }
};

// Event Packages
export const getAllEventPackages = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;

    let filter: any = {};
    if (isActive === 'true') filter.isActive = true;

    const packages = await EventPackage.find(filter).sort({ pricePerHead: 1 });

    res.status(200).json({
      success: true,
      data: packages,
      count: packages.length,
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch event packages');
  }
};

export const createEventPackage = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      minGuests,
      maxGuests,
      pricePerHead,
      inclusions,
      duration,
      decorOptions,
      musicOptions,
      customMenuAvailable,
    } = req.body;

    const pkg = new EventPackage({
      name,
      description,
      minGuests,
      maxGuests,
      pricePerHead,
      inclusions,
      duration,
      decorOptions,
      musicOptions,
      customMenuAvailable,
    });

    await pkg.save();

    res.status(201).json({
      success: true,
      message: 'Event package created',
      data: pkg,
    });
  } catch (error) {
    throw error;
  }
};

export const updateEventPackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const pkg = await EventPackage.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!pkg) {
      throw new AppError(404, 'Package not found');
    }

    res.status(200).json({
      success: true,
      message: 'Package updated',
      data: pkg,
    });
  } catch (error) {
    throw error;
  }
};

export const getEventStats = async (req: Request, res: Response) => {
  try {
    const totalEvents = await GroupEvent.countDocuments();
    const confirmedEvents = await GroupEvent.countDocuments({ status: 'confirmed' });
    const totalGuestsExpected = await GroupEvent.aggregate([
      { $group: { _id: null, total: { $sum: '$estimatedGuests' } } },
    ]);

    const eventsByType = await GroupEvent.aggregate([
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        confirmedEvents,
        totalGuestsExpected: totalGuestsExpected[0]?.total || 0,
        eventsByType,
      },
    });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch event stats');
  }
};
