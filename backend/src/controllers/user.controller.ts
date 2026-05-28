import type { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import cloudinary from '../lib/cloudinary.js';
import User from '../models/User.js';
import { ERROR_MESSAGES, USER_PRIVATE_FIELDS } from '../constants.js';
import { getConnectedUsers } from '../lib/socket.js';

export const searchUser = async (request: Request, response: Response) => {
  try {
    const loggedInUserId = request.user?._id;
    if (!loggedInUserId) throw new Error(ERROR_MESSAGES.loggedUserIdUndefined);

    const { handle } = request.query;
    if (!handle || typeof handle !== 'string') {
      return response.status(400).json({ message: ERROR_MESSAGES.searchUser });
    }

    const onlineUsers = getConnectedUsers();

    const users = await User.find({
      handle: { $regex: `^${handle}`, $options: 'i' },
      _id: { $ne: loggedInUserId },
    }).select(USER_PRIVATE_FIELDS);

    //TODO: WE BROADCAST ONLINE STATUS FOR SEARCHED USERS ONLY ONCE PER REQUEST,
    //CONSIDER ATTACHING WEBSOCKETS EVENT TO BROADCAST STATUS LIVE FOR SEARCHED RESULTS
    const usersWithStatus = users.map(user => {
      const userObject = user.toObject();

      return {
        ...userObject,
        isOnline: onlineUsers.has(userObject._id.toString()),
      };
    });

    return response.status(200).json(usersWithStatus);
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
