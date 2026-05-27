import { messagesQueryOptions } from '@/api/messages.api';
import type { Message, NewMessagePayload } from '@/types/message.types';
import { getQueryClient } from './query';
import type { Chat } from '@/types/user.types';
import { updateNotifications } from './utils';
import { chatsQueryOptions } from '@/api/chat.api';

export interface ChatStatusUpdatePayload {
  userId: string;
  isOnline: boolean;
}

const queryClient = getQueryClient();

export const setNewMessageCache = (message: Message, matchId?: string) => {
  queryClient.setQueryData<Message[]>(messagesQueryOptions(matchId ?? message.senderId).queryKey, prev =>
    prev ? [...prev, message] : [message],
  );
};

export const replaceOptimisticMessageCache = (data: Message, receiverId: string, messageTempId: string) => {
  queryClient.setQueryData(
    messagesQueryOptions(receiverId).queryKey,
    prev => prev?.map(message => (message._id === messageTempId ? data : message)) ?? [],
  );
};

export const setChatNewMessageCache = ({ message, unreadCounts }: NewMessagePayload) => {
  queryClient.setQueryData<Chat[]>(chatsQueryOptions().queryKey, prev => {
    if (!prev) return prev;

    const updated = prev.map(conv =>
      conv.participants.some(p => p._id === message.senderId) &&
      conv.participants.some(p => p._id === message.receiverId)
        ? {
            ...conv,
            unreadCounts,
            lastMessage: { text: message.text, createdAt: message.createdAt, senderId: message.senderId },
          }
        : conv,
    );

    updateNotifications(updated);

    return updated;
  });
};

export const setNewChatCache = (chat: Chat) => {
  queryClient.setQueryData<Chat[]>(chatsQueryOptions().queryKey, prev => (prev ? [chat, ...prev] : [chat]));
};

export const setChatStatusUpdateCache = (payload: ChatStatusUpdatePayload) => {
  queryClient.setQueryData<Chat[]>(chatsQueryOptions().queryKey, prev =>
    prev
      ? prev.map(chat => {
          const updatedParticipant = chat.participants.find(participant => participant._id === payload.userId);

          if (updatedParticipant) {
            return {
              ...chat,
              participants: chat.participants.map(participant =>
                participant._id === payload.userId ? { ...participant, isOnline: payload.isOnline } : participant,
              ),
            };
          }

          return chat;
        })
      : prev,
  );
};

export const setViewedMessageCache = (partnerId: string, messageIds: string[]) => {
  const messageIdsSet = new Set(messageIds);

  queryClient.setQueryData<Message[]>(
    messagesQueryOptions(partnerId).queryKey,
    prev => prev?.map(message => (messageIdsSet.has(message._id) ? { ...message, status: 'viewed' } : message)) ?? [],
  );
};

export const setChatViewedMessageCache = (viewedBy: string, chatId: string, viewedMessagesCount: number) => {
  queryClient.setQueryData<Chat[]>(chatsQueryOptions().queryKey, prev => {
    const updated =
      prev?.map(chat =>
        chat._id === chatId
          ? {
              ...chat,
              unreadCounts: {
                ...chat.unreadCounts,
                [viewedBy]: Math.max(0, (chat.unreadCounts[viewedBy] ?? 0) - viewedMessagesCount),
              },
            }
          : chat,
      ) ?? [];

    updateNotifications(updated);

    return updated;
  });
};
