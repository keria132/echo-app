import { Request, Response } from 'express';
import User from '../models/User.js';
import * as Sentry from '@sentry/node';
import { ERROR_MESSAGES, USER_PRIVATE_FIELDS } from '../constants.js';
import Message from '../models/Message.js';
import cloudinary from '../lib/cloudinary.js';
import { Types } from 'mongoose';

type RequestParams = { userId: string };

export const getAllContacts = async (request: Request, response: Response) => {
  try {
    const loggedInUserId = request.user?._id;
    if (!loggedInUserId) throw new Error(ERROR_MESSAGES.loggedUserIdUndefined);

    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(USER_PRIVATE_FIELDS);

    return response.status(200).json(users);
  } catch (error) {
    console.error('Error inside getAllContacts controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};

export const getMessagesByUserId = async (request: Request<RequestParams>, response: Response) => {
  try {
    const myId = request.user?._id;
    if (!myId) throw new Error(ERROR_MESSAGES.loggedUserIdUndefined);

    const { userId } = request.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId },
      ],
    });

    return response.status(200).json(messages);
  } catch (error) {
    console.error('Error inside getMessages controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};

export const sendMessage = async (request: Request<RequestParams>, response: Response) => {
  try {
    const { text, image } = request.body;
    if (!text && !image)
      return response.status(400).json({ message: 'Cannot send blank message, text or image is required' });

    const { userId: receiverId } = request.params;

    const isReceiverExists = await User.exists({ _id: receiverId });
    if (!isReceiverExists) return response.status(404).json({ message: 'User receiver is not found' });

    const senderId = request.user?._id;
    if (!senderId) throw new Error(ERROR_MESSAGES.loggedUserIdUndefined);
    if (senderId.equals(receiverId)) return response.status(400).json({ message: 'Cannot send a message to yourself' });

    let imageUrl = '';
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      ...(imageUrl && { image: imageUrl }),
    });

    await newMessage.save();

    return response.status(201).json(newMessage);
  } catch (error) {
    console.error('Error inside sendMessage controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};

export const getChatPartners = async (request: Request, response: Response) => {
  try {
    const loggedInUserId = request.user?._id;
    if (!loggedInUserId) throw new Error(ERROR_MESSAGES.loggedUserIdUndefined);

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnersIds = new Set<Types.ObjectId>();

    messages.forEach(({ senderId, receiverId }) => {
      const partnerId = senderId.equals(loggedInUserId) ? receiverId : senderId;
      chatPartnersIds.add(partnerId);
    });

    const chatPartners = await User.find({ _id: { $in: [...chatPartnersIds] } }).select(USER_PRIVATE_FIELDS);

    return response.status(200).json(chatPartners);
  } catch (error) {
    console.error('Error inside getChatPartners controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};
