import { Request, Response, NextFunction } from 'express';
import { STATUS } from '../constants/statusCodes';

export const errorMiddleware = (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(STATUS.SERVER_ERROR).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
