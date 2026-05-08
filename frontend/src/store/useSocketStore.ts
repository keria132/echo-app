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

type WSMessageType = {
  type: 'new_message';
  payload: Message;
};

type WSNewChatType = {
  type: 'new_chat';
  payload: Chat;
};

type WSDataType = WSMessageType | WSNewChatType;

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

        if (type === 'new_message') {
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
        }

        if (type === 'new_chat') {
          if (useAppStore.getState().isSoundEnabled) {
            newMessageSound.play().catch(console.error);
          }

          queryClient.setQueryData<Chat[]>(chatsQueryOptions().queryKey, prev =>
            prev ? [payload, ...prev] : [payload],
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
