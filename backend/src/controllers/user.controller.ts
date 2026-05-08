import type { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import cloudinary from '../lib/cloudinary.js';
import User from '../models/User.js';
import { ERROR_MESSAGES, USER_PRIVATE_FIELDS } from '../constants.js';
import Chat from '../models/Chat.js';

export const getChats = async (request: Request, response: Response) => {
  try {
    const loggedInUserId = request.user?._id;
    if (!loggedInUserId) throw new Error(ERROR_MESSAGES.loggedUserIdUndefined);

    const chats = await Chat.find({ participants: loggedInUserId })
      .populate('participants', USER_PRIVATE_FIELDS)
      .sort({ updatedAt: 'desc' });

    return response.status(200).json(chats);
  } catch (error) {
    console.error('Error in getChats controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};

export const searchUser = async (request: Request, response: Response) => {
  try {
    const loggedInUserId = request.user?._id;
    if (!loggedInUserId) throw new Error(ERROR_MESSAGES.loggedUserIdUndefined);

    const { handle } = request.query;
    if (!handle || typeof handle !== 'string') {
      return response.status(400).json({ message: ERROR_MESSAGES.searchUser });
    }

    const users = await User.find({ handle, _id: { $ne: loggedInUserId } }).select(USER_PRIVATE_FIELDS);

    return response.status(200).json(users);
  } catch (error) {
    console.error('Error in searchUser controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};

export const updateProfile = async (request: Request, response: Response) => {
  try {
    const { profileIcon } = request.body;
    if (!profileIcon) return response.status(400).json({ message: ERROR_MESSAGES.profileIcon });

    const loggedInUserId = request.user?._id;
    if (!loggedInUserId) throw new Error(ERROR_MESSAGES.loggedUserIdUndefined);

    const uploadResult = await cloudinary.uploader.upload(profileIcon);

    const updatedUser = await User.findByIdAndUpdate(
      loggedInUserId,
      { profileIcon: uploadResult.secure_url },
      { new: true },
    ).select(USER_PRIVATE_FIELDS);

    return response.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateProfile controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};
