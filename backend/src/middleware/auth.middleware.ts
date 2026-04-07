import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as Sentry from '@sentry/node';
import { AUTH_COOKIE_NAME, ERROR_MESSAGES } from '../constants.js';
import { env } from '../lib/env.js';
import User from '../models/User.js';

export const protectRoute = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const token = request.cookies[AUTH_COOKIE_NAME];
    if (!token) return response.status(401).json({ message: ERROR_MESSAGES.unauthorized });

    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === 'string' || !('userId' in decoded)) {
      return response.status(401).json({ message: ERROR_MESSAGES.invalidToken });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return response.status(404).json({ message: ERROR_MESSAGES.userNotFound });

    request.user = user;

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return response.status(401).json({ message: ERROR_MESSAGES.tokenExpired });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return response.status(401).json({ message: ERROR_MESSAGES.invalidToken });
    }

    console.error('Middleware auth error: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};
