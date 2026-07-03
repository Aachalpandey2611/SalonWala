import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { ZodError } from 'zod';

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || 'Duplicate field';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleZodError = (err: ZodError) => {
  const errors = err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`);
  const message = `Validation Error: ${errors.join(', ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status || 'error',
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export const globalErrorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.nodeEnv === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error instanceof ZodError) error = handleZodError(error);

    sendErrorProd(error, res);
  }
};

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  _next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};
