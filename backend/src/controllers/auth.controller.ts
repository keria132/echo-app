import type { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { loginSchema, signupSchema } from '../schemas/auth.schema.js';
import User from '../models/User.js';
import { AUTH_COOKIE_NAME, ERROR_MESSAGES, SALT_ROUNDS } from '../constants.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import z from 'zod';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import { env } from '../lib/env.js';
import cloudinary from '../lib/cloudinary.js';

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

    sendWelcomeEmail(newUser.email, newUser.name, env.CLIENT_URL).catch(error => {
      console.error('Failed to send welcome email: ', error);
      Sentry.captureException(error);
    });

    return response.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profileIcon: newUser.profileIcon,
    });
  } catch (error) {
    console.error(ERROR_MESSAGES.signupError + ': ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};

export const login = async (request: Request, response: Response) => {
  try {
    const parseResult = loginSchema.safeParse(request.body);

    if (!parseResult.success) {
      const errors = z.treeifyError(parseResult.error);

      return response.status(400).json({ errors });
    }

    const { email, password } = parseResult.data;

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(400).json({ message: ERROR_MESSAGES.invalidLogin });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return response.status(400).json({ message: ERROR_MESSAGES.invalidLogin });
    }

    generateToken(user._id.toString(), response);

    return response.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileIcon: user.profileIcon,
    });
  } catch (error) {
    console.error('Error in login controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};

export const logout = (_request: Request, response: Response) => {
  response.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return response.status(200).json({ message: 'Logout successful!' });
};

export const updateProfile = async (request: Request, response: Response) => {
  try {
    const { profileIcon } = request.body;
    if (!profileIcon) return response.status(400).json({ message: ERROR_MESSAGES.profileIcon });

    const userId = request.user?._id;

    const uploadResult = await cloudinary.uploader.upload(profileIcon);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileIcon: uploadResult.secure_url },
      { new: true },
    ).select('-password');

    return response.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateProfile controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};
