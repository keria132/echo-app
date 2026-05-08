import { Request, Response } from 'express';
import User from '../models/User.js';
import * as Sentry from '@sentry/node';
import { ERROR_MESSAGES, USER_PRIVATE_FIELDS } from '../constants.js';
import Message from '../models/Message.js';
import cloudinary from '../lib/cloudinary.js';
import { getConnectedUsers } from '../lib/socket.js';
import Chat from '../models/Chat.js';

type RequestParams = { userId: string };

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
    if (!text && !image) return response.status(400).json({ message: ERROR_MESSAGES.blankMessage });

    const { userId: receiverId } = request.params;

    const isReceiverExists = await User.exists({ _id: receiverId });
    if (!isReceiverExists) return response.status(404).json({ message: ERROR_MESSAGES.messageReceiverNotFound });

    const senderId = request.user?._id;
    if (!senderId) throw new Error(ERROR_MESSAGES.loggedUserIdUndefined);
    if (senderId.equals(receiverId)) return response.status(400).json({ message: ERROR_MESSAGES.selfMessage });

    let imageUrl: string | null = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const senderSocket = getConnectedUsers().get(senderId.toString());
    const receiverSocket = getConnectedUsers().get(receiverId);
    const isReceiverSocketOpen = receiverSocket?.readyState === WebSocket.OPEN;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      ...(imageUrl && { image: imageUrl }),
    });

    await newMessage.save();

    const lastMessageData = {
      text,
      senderId,
      createdAt: newMessage.createdAt,
    };

    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!existingChat) {
      const newChat = await Chat.create({
        participants: [senderId, receiverId],
        lastMessage: lastMessageData,
      });

      const populatedChat = await newChat.populate('participants', USER_PRIVATE_FIELDS);

      if (isReceiverSocketOpen) {
        receiverSocket.send(JSON.stringify({ type: 'new_chat', payload: populatedChat }));
      }

      senderSocket?.send(JSON.stringify({ type: 'new_chat', payload: populatedChat }));
    } else {
      existingChat.lastMessage = lastMessageData;
      existingChat.save();
    }

    if (isReceiverSocketOpen) {
      receiverSocket.send(JSON.stringify({ type: 'new_message', payload: newMessage }));
    }

    return response.status(201).json(newMessage);
  } catch (error) {
    console.error('Error inside sendMessage controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};
