import { messagesQueryOptions } from '@/api/messages.api';
import type { Message } from '@/types/message.types';
import { getQueryClient } from './query';
import { chatsQueryOptions } from '@/api/user.api';
import type { Chat } from '@/types/user.types';

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

export const setChatLastMessageCache = (message: Message, matchId?: string) => {
  queryClient.setQueryData<Chat[]>(chatsQueryOptions().queryKey, prev =>
    prev?.map(conv =>
      conv.participants.some(participant => participant._id === (matchId ?? message.senderId))
        ? {
            ...conv,
            lastMessage: { text: message.text, createdAt: message.createdAt, senderId: message.senderId },
          }
        : conv,
    ),
  );
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
