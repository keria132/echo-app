import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRATION_TIME, JWT_EXPIRATION_TIME_MS } from '../constants.js';
import { env } from './env.js';

export const generateToken = (userId: string, response: Response) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });

  response.cookie('jwt', token, {
    maxAge: JWT_EXPIRATION_TIME_MS,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return token;
};
