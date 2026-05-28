import type { Chat } from './user.types';

export type MessageStatus = 'sending' | 'failed' | 'sent' | 'viewed';

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  status: MessageStatus;
}

export interface NewMessagePayload {
  message: Message;
  unreadCounts: Chat['unreadCounts'];
}

export interface UpdateMessagePayload {
  chatId: string;
  messageIds: string[];
  viewedBy: string;
}
