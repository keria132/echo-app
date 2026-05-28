import type { Request, Response } from 'express';
import { ERROR_MESSAGES, USER_PRIVATE_FIELDS } from '../constants.js';
import { getConnectedUsers } from '../lib/socket.js';
import Chat from '../models/Chat.js';
import * as Sentry from '@sentry/node';
import Message from '../models/Message.js';

export const getChats = async (request: Request, response: Response) => {
  try {
    const loggedInUserId = request.user?._id;
    if (!loggedInUserId) throw new Error(ERROR_MESSAGES.loggedUserIdUndefined);

    const onlineUsers = getConnectedUsers();

    const chats = await Chat.find({ participants: loggedInUserId })
      .populate('participants', USER_PRIVATE_FIELDS)
      .sort({ updatedAt: 'desc' });

    const chatsWithStatus = chats.map(chat => {
      const chatObject = chat.toObject();

      //TODO: SKIP GROUPCHATS FOR NOW, PATCH LATER
      if (chatObject.participants.length > 2) return chatObject;

      return {
        ...chatObject,
        participants: chatObject.participants.map(participant => ({
          ...participant,
          isOnline: onlineUsers.has(participant._id.toString()),
        })),
      };
    });

    return response.status(200).json(chatsWithStatus);
  } catch (error) {
    console.error('Error in getChats controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};

export const patchViewed = async (request: Request, response: Response) => {
  try {
    const loggedInUserId = request.user?._id;
    if (!loggedInUserId) throw new Error(ERROR_MESSAGES.loggedUserIdUndefined);

    const { id: chatId } = request.params;
    const { messageIds } = request.body;

    if (!chatId) return response.status(400).json({ message: ERROR_MESSAGES.invalidChatId });
    if (!Array.isArray(messageIds) || !messageIds.length) {
      return response.status(400).json({ message: ERROR_MESSAGES.invalidMessageIds });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: loggedInUserId,
    });
    if (!chat) return response.status(404).json({ message: ERROR_MESSAGES.chatNotFound });

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        senderId: { $ne: loggedInUserId },
        status: { $ne: 'viewed' },
      },
      { $set: { status: 'viewed' } },
    );

    const newUnreadCount = await Message.countDocuments({
      chatId: chatId,
      senderId: { $ne: loggedInUserId },
      status: { $ne: 'viewed' },
    });

    chat.unreadCounts.set(loggedInUserId.toString(), newUnreadCount);
    await chat.save();

    const senderId = chat.participants.find(id => !id.equals(loggedInUserId));

    if (senderId) {
      const senderSocket = getConnectedUsers().get(senderId.toString());
      const isSenderSocketOpen = senderSocket?.readyState === WebSocket.OPEN;

      if (isSenderSocketOpen) {
        senderSocket.send(
          JSON.stringify({
            type: 'messages_viewed',
            payload: {
              chatId,
              messageIds,
              viewedBy: loggedInUserId,
            },
          }),
        );
      }
    }

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in patchViewed controller: ', error);
    Sentry.captureException(error);

    return response.status(500).json({ message: ERROR_MESSAGES.serverError });
  }
};
