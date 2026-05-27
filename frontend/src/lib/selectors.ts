import type { ChatItem } from '@/types/user.types';

// export const getChatItemKey = (chatItem: ChatItem) => {
//   if (chatItem.kind === 'user') return chatItem.user._id;
//   return chatItem.chat._id;
// };

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

export const getChatItemProperties = (chatItem: ChatItem) => {
  if (chatItem.kind === 'user') {
    return {
      chatId: null,
      icon: chatItem.user.profileIcon,
      name: chatItem.user.name,
      isOnline: chatItem.user.isOnline,
      lastMessage: null,
      unreadCount: null,
      partnedId: chatItem.user._id,
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
      partnedId: chatItem.partner._id,
    };
  }

  return {
    chatId: chatItem.chat._id,
    icon: chatItem.chat.chatIcon,
    name: chatItem.chat.chatName,
    isOnline: null,
    lastMessage: chatItem.chat.lastMessage,
    unreadCount: chatItem.unreadCount,
    partnedId: null,
  };
};
