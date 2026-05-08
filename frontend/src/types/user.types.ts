export interface User {
  _id: string;
  name: string;
  profileIcon: string;
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
  lastMessage?: {
    text: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount?: number;
}
