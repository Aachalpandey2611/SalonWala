import { Request, Response } from 'express';
import { ValidationService } from '../services/validation.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const validateBookingController = catchAsync(async (req: Request, res: Response) => {
  // Pass the payload directly to the brain
  const result = await ValidationService.validateBooking(req.body);
  
  if (!result.valid) {
    // Fail Fast: we return 400 with the exact business reason, instead of throwing an unhandled AppError
    return res.status(400).json({
      success: false,
      data: result,
      message: 'Validation failed'
    });
  }

  res.status(200).json({
    success: true,
    data: result,
    message: 'Booking is valid'
  });
});

// A mockup for walking validations (which might bypass time limits or advance booking limits)
export const validateWalkInController = catchAsync(async (req: Request, res: Response) => {
  // For walk-ins, we might inject the current time automatically or bypass some checks
  const result = await ValidationService.validateBooking(req.body);
  
  if (!result.valid) {
    return res.status(400).json({
      success: false,
      data: result,
      message: 'Walk-in validation failed'
    });
  }

  res.status(200).json({
    success: true,
    data: result,
    message: 'Walk-in is valid'
  });
});
