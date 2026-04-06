import type { UserModelType } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserModelType;
    }
  }
}
