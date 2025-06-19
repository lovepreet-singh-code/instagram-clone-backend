import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
//import { STATUS, MSG } from '../constants';
import { STATUS } from '../constants/statusCodes';
import { MSG } from '../constants/messages';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(STATUS.UNAUTHORIZED).json({ message: MSG.UNAUTHORIZED });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(STATUS.UNAUTHORIZED).json({ message: MSG.UNAUTHORIZED });
  }
};
