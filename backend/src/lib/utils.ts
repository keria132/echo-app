import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES, JWT_EXPIRATION_TIME, JWT_EXPIRATION_TIME_MS } from '../constants.js';

export const generateToken = (userId: string, response: Response) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) throw new Error(ERROR_MESSAGES.jwtSecretFailure);

  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: JWT_EXPIRATION_TIME });

  response.cookie('jwt', token, {
    maxAge: JWT_EXPIRATION_TIME_MS,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return token;
};
