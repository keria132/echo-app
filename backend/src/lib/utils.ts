import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_COOKIE_NAME, JWT_EXPIRATION_TIME, JWT_EXPIRATION_TIME_MS } from '../constants.js';
import { env } from './env.js';
import { randomBytes } from 'node:crypto';
import User from '../models/User.js';

export const generateToken = (userId: string, response: Response) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });

  response.cookie(AUTH_COOKIE_NAME, token, {
    maxAge: JWT_EXPIRATION_TIME_MS,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return token;
};

export const generateHandle = async (name: string): Promise<string> => {
  const base = name.trim().replace(/\s+/g, '_').toLowerCase();

  for (let i = 0; i < 5; i++) {
    const slug = randomBytes(3).toString('hex');
    const userHandle = `${base}_${slug}`;

    if (!(await User.exists({ userHandle }))) return userHandle;
  }

  throw new Error('Failed to generate a unique handle');
};
