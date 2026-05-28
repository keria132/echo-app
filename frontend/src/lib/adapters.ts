import type { Chat, ChatItem, User } from '@/types/user.types';
import * as Sentry from '@sentry/react';

interface ChatAdapterParams {
  chats: Chat[];
  currentUserId: string;
  searchText?: string;
}

interface UserAdapterParams {
  searchedUsers: User[];
  chats: Chat[];
  currentUserId: string;
}

export const chatAdapter = ({ chats, currentUserId }: ChatAdapterParams): ChatItem[] =>
  chats.flatMap((chat): ChatItem[] => {
    if (chat.participants.length > 2) {
      return [{ kind: 'group', chat, unreadCount: chat.unreadCounts[currentUserId] ?? 0 }];
    }

    const partner = chat.participants.find(participant => participant._id !== currentUserId);

    if (!partner) {
      Sentry.captureException(
        new Error(`Error in chat adapter. Chat ${chat._id} has no valid partner for user ${currentUserId}`),
      );
      return [];
    }

    return [{ kind: 'direct', chat, partner: partner, unreadCount: chat.unreadCounts[currentUserId] ?? 0 }];
  });

export const userAdapter = ({ searchedUsers, chats, currentUserId }: UserAdapterParams): ChatItem[] => {
  const chatsMap = new Map<string, Chat>();

  chats.forEach(chat => {
    if (chat.participants.length !== 2) return;

    const partnerId = chat.participants.find(participant => participant._id !== currentUserId)?._id;
    if (!partnerId) return;

    chatsMap.set(partnerId, chat);
  });

  return searchedUsers.map(user => {
    const existingChat = chatsMap.get(user._id);

    return existingChat
      ? {
          kind: 'direct',
          chat: existingChat,
          partner: user,
          unreadCount: existingChat.unreadCounts[currentUserId] ?? 0,
        }
      : { kind: 'user', user };
  });
};
