import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

export const validateObjectId = (paramName: string) => (request: Request, response: Response, next: NextFunction) => {
  const id = request.params[paramName];
  if (!id || Array.isArray(id) || !Types.ObjectId.isValid(id))
    return response.status(400).json({ message: `Invalid ${paramName}` });

  return next();
};
