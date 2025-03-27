import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error({
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
      body: req.body,
      stack: err.stack
    });

    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
    return;
  }

  // Unexpected errors
  logger.error({
    message: 'Internal Server Error',
    error: err.message,
    path: req.path,
    method: req.method,
    body: req.body,
    stack: err.stack
  });

  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
}; 