import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'node:http';
import type { IncomingMessage } from 'node:http';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import * as Sentry from '@sentry/node';
import { AUTH_COOKIE_NAME } from '../constants.js';
import { env } from '../lib/env.js';
import Chat from '../models/Chat.js';

const connectedUsers = new Map<string, WebSocket>();

const authenticateConnection = (request: IncomingMessage): string | null => {
  const rawCookies = request.headers.cookie;
  if (!rawCookies) return null;

  const token = parse(rawCookies)[AUTH_COOKIE_NAME];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === 'string' || !('userId' in decoded)) return null;
    return decoded.userId as string;
  } catch {
    return null;
  }
};

export const initSocket = (httpServer: Server): void => {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', async (socket, request) => {
    const userId = authenticateConnection(request);
    if (!userId) {
      socket.close(1008, 'Unauthorized');
      return;
    }

    connectedUsers.set(userId, socket);
    console.log(`User ${userId} connected. Total: ${connectedUsers.size}`);

    let partnerIds: string[] = [];

    try {
      const userChats = await Chat.find({ participants: userId }).select('participants');
      const allParticipantIds = userChats.flatMap(chat => chat.participants.map(participant => participant.toString()));
      partnerIds = [...new Set(allParticipantIds.filter(id => id !== userId))];

      for (const partnerId of partnerIds) {
        const partnerSocket = connectedUsers.get(partnerId);
        if (partnerSocket?.readyState === WebSocket.OPEN) {
          partnerSocket.send(JSON.stringify({ type: 'user_status_update', payload: { userId, isOnline: true } }));
        }
      }
    } catch (error) {
      Sentry.captureException(error);
    }

    socket.on('close', () => {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected. Total: ${connectedUsers.size}`);

      for (const partnerId of partnerIds) {
        const partnerSocket = connectedUsers.get(partnerId);

        if (partnerSocket?.readyState === WebSocket.OPEN) {
          partnerSocket.send(JSON.stringify({ type: 'user_status_update', payload: { userId, isOnline: false } }));
        }
      }
    });

    socket.on('error', error => {
      Sentry.captureException(error);
    });
  });
};

export const getConnectedUsers = (): Map<string, WebSocket> => connectedUsers;
