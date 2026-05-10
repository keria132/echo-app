import { create } from 'zustand';
import { createSocket } from '@/lib/socket';
import type { Message } from '@/types/message.types';
import { getQueryClient } from '@/lib/query';
import { messagesQueryOptions } from '@/api/messages.api';
import { toast } from 'sonner';
import type { Chat } from '@/types/user.types';
import { chatsQueryOptions } from '@/api/user.api';
import notificationSound from '@/assets/sounds/newMessage.mp3';
import { useAppStore } from './useAppStore';

const newMessageSound = new Audio(notificationSound);

interface SocketStoreState {
  socket: WebSocket | null;
  connect: () => void;
  disconnect: () => void;
}

interface StatusUpdatePayload {
  userId: string;
  isOnline: boolean;
}

type WSMessageType = {
  type: 'new_message';
  payload: Message;
};

type WSNewChatType = {
  type: 'new_chat';
  payload: Chat;
};

type WSStatusUpdateType = {
  type: 'user_status_update';
  payload: StatusUpdatePayload;
};

type WSDataType = WSMessageType | WSNewChatType | WSStatusUpdateType;

export const useSocketStore = create<SocketStoreState>((set, get) => ({
  socket: null,

  connect: () => {
    if (get().socket) return;

    const socket = createSocket();

    socket.onopen = () => console.log('WebSocket connected');

    socket.onmessage = event => {
      try {
        const { type, payload }: WSDataType = JSON.parse(event.data);
        const queryClient = getQueryClient();

        switch (type) {
          case 'new_message':
            if (useAppStore.getState().isSoundEnabled) {
              newMessageSound.play().catch(console.error);
            }

            queryClient.setQueryData<Message[]>(messagesQueryOptions(payload.senderId).queryKey, prev =>
              prev ? [...prev, payload] : [payload],
            );

            queryClient.setQueryData<Chat[]>(chatsQueryOptions().queryKey, prev =>
              prev?.map(conv =>
                conv.participants.some(participant => participant._id === payload.senderId)
                  ? {
                      ...conv,
                      lastMessage: { text: payload.text, createdAt: payload.createdAt, senderId: payload.senderId },
                    }
                  : conv,
              ),
            );

            break;

          case 'new_chat':
            if (useAppStore.getState().isSoundEnabled) {
              newMessageSound.play().catch(console.error);
            }

            queryClient.setQueryData<Chat[]>(chatsQueryOptions().queryKey, prev =>
              prev ? [payload, ...prev] : [payload],
            );

            break;

          case 'user_status_update':
            useAppStore.setState(state => {
              if (!state.selectedUser || state.selectedUser._id !== payload.userId) return state;

              return { selectedUser: { ...state.selectedUser, isOnline: payload.isOnline } };
            });

            queryClient.setQueryData<Chat[]>(chatsQueryOptions().queryKey, prev =>
              prev
                ? prev.map(chat => {
                    const updatedParticipant = chat.participants.find(
                      participant => participant._id === payload.userId,
                    );

                    if (updatedParticipant) {
                      return {
                        ...chat,
                        participants: chat.participants.map(participant =>
                          participant._id === payload.userId
                            ? { ...participant, isOnline: payload.isOnline }
                            : participant,
                        ),
                      };
                    }

                    return chat;
                  })
                : prev,
            );
        }
      } catch (error) {
        console.error('Failed to parse WS message:', error);
      }
    };

    socket.onclose = event => {
      console.log('WebSocket disconnected');
      set({ socket: null });

      //TODO: CONSIDER FIRING ONLY FOR CERTAIN CODES, BY INCLUSION NOT BY EXCLUSION
      if (event.code !== 1000 && event.code !== 1008) {
        toast.error('Connection unexpectedly lost. Please refresh.');
      }
    };

    socket.onerror = error => console.error('WebSocket error:', error);

    set({ socket });
  },

  disconnect: () => {
    get().socket?.close();
    set({ socket: null });
  },
}));
