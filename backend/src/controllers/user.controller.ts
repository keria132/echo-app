import type { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import cloudinary from '../lib/cloudinary.js';
import User from '../models/User.js';
import { ERROR_MESSAGES } from '../constants.js';

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
