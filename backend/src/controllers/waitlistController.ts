import { Request, Response } from 'express';
import Waitlist from '../models/Waitlist';

export const joinWaitlist = async (req: Request, res: Response) => {
  try {
    const { requestedDate, partySize } = req.body;
    
    // Check if user is already on waitlist for this date
    const existingEntry = await Waitlist.findOne({
      userId: req.user?.userId,
      requestedDate: new Date(requestedDate),
      status: 'waiting'
    });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_WAITLISTED',
          message: 'You are already on the waitlist for this date.'
        }
      });
    }

    const waitlistEntry = await Waitlist.create({
      userId: req.user?.userId,
      requestedDate: new Date(requestedDate),
      partySize: Number(partySize),
      status: 'waiting'
    });

    res.status(201).json({
      success: true,
      data: waitlistEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Server error adding to waitlist' } });
  }
};
