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
  unreadCounts: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  chatIcon?: string;
  chatName?: string;
}

export type ChatItem =
  | { kind: 'direct'; chat: Chat; partner: User; unreadCount: number }
  | { kind: 'group'; chat: Chat; unreadCount: number }
  | { kind: 'user'; user: User };
