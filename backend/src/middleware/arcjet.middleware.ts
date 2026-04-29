import type { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import aj from '../lib/arcjet.js';
import { ERROR_MESSAGES } from '../constants.js';
import { isSpoofedBot } from '@arcjet/inspect';

export const arcjetProtected = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return response.status(429).json({ message: ERROR_MESSAGES.tooManyRequests });
      } else if (decision.reason.isBot()) {
        return response.status(403).json({ message: ERROR_MESSAGES.botDenied });
      } else {
        return response.status(403).json({ message: ERROR_MESSAGES.securityDenied });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return response.status(403).json({ message: ERROR_MESSAGES.spoofDenied });
    }

    return next();
  } catch (error) {
    console.error('Arcjet Protection Error: ', error);
    Sentry.captureException(error);

    return next();
  }
};
