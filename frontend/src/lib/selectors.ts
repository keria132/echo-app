import type { Chat, ChatItem } from '@/types/user.types';

interface GetChatItemPropsReturn {
  chatId?: string;
  icon?: string;
  name?: string;
  isOnline?: boolean;
  lastMessage?: Chat['lastMessage'];
  unreadCount?: number;
  partnerId?: string;
}

export const getChatKey = (chatItem: ChatItem) => {
  if (chatItem.kind === 'user') return chatItem.user._id;
  return chatItem.chat._id;
};

export const getChatUserId = (chatItem: ChatItem | null) => {
  if (!chatItem) return null;
  if (chatItem.kind === 'user') return chatItem.user._id;
  if (chatItem.kind === 'direct') return chatItem.partner._id;
  return chatItem.chat._id;
};

export const getChatItemProperties = (chatItem: ChatItem): GetChatItemPropsReturn => {
  if (chatItem.kind === 'user') {
    return {
      icon: chatItem.user.profileIcon,
      name: chatItem.user.name,
      isOnline: chatItem.user.isOnline,
      partnerId: chatItem.user._id,
    };
  }

  if (chatItem.kind === 'direct') {
    return {
      chatId: chatItem.chat._id,
      icon: chatItem.partner.profileIcon,
      name: chatItem.partner.name,
      isOnline: chatItem.partner.isOnline,
      lastMessage: chatItem.chat.lastMessage,
      unreadCount: chatItem.unreadCount,
      partnerId: chatItem.partner._id,
    };
  }

  return {
    chatId: chatItem.chat._id,
    lastMessage: chatItem.chat.lastMessage,
    unreadCount: chatItem.unreadCount,
  };
};
