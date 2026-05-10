export interface User {
  _id: string;
  name: string;
  handle: string;
  profileIcon: string;
  isOnline?: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  participants: User[];
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatListUser {
  _id: string;
  name: string;
  profileIcon: string;
  unreadCount?: number;
  isOnline?: boolean;
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: string;
  };
}
