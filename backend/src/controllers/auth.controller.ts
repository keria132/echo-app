import type { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { signupSchema } from '../schemas/auth.schema.js';
import User from '../models/User.js';
import { ERROR_MESSAGES, SALT_ROUNDS } from '../constants.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import z from 'zod';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import { env } from '../lib/env.js';

export const signup = async (request: Request, response: Response) => {
  try {
    const parseResult = signupSchema.safeParse(request.body);

    if (!parseResult.success) {
      const errors = z.treeifyError(parseResult.error);

      return response.status(400).json({ errors });
    }

    const { name, email, password } = parseResult.data;

    const user = await User.findOne({ email });
    if (user) return response.status(400).json({ message: ERROR_MESSAGES.emailExists });

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    generateToken(newUser._id.toString(), response);

    let emailSent = false;

    try {
      await sendWelcomeEmail(newUser.email, newUser.name, env.CLIENT_URL);
      emailSent = true;
    } catch (error) {
      console.error('Failed to send welcome email: ', error);
      Sentry.captureException(error);
    }

    return response.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profileIcon: newUser.profileIcon,
      emailSent,
    });
  } catch (error) {
    console.error(ERROR_MESSAGES.signupError + ': ', error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};
