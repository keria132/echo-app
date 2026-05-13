import { create } from 'zustand';
import { createSocket } from '@/lib/socket';
import type { Message } from '@/types/message.types';
import { toast } from 'sonner';
import type { Chat } from '@/types/user.types';
import notificationSound from '@/assets/sounds/newMessage.mp3';
import { useAppStore } from './useAppStore';
import {
  setChatLastMessageCache,
  setChatStatusUpdateCache,
  setNewChatCache,
  setNewMessageCache,
  type ChatStatusUpdatePayload,
} from '@/lib/cache';

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

type WSStatusUpdateType = {
  type: 'user_status_update';
  payload: ChatStatusUpdatePayload;
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

        switch (type) {
          case 'new_message':
            if (useAppStore.getState().isSoundEnabled) {
              newMessageSound.play().catch(console.error);
            }

            setNewMessageCache(payload);
            setChatLastMessageCache(payload);

            break;

          case 'new_chat':
            if (useAppStore.getState().isSoundEnabled) {
              newMessageSound.play().catch(console.error);
            }

            setNewChatCache(payload);

            break;

          case 'user_status_update':
            useAppStore.setState(state => {
              if (!state.selectedUser || state.selectedUser._id !== payload.userId) return state;

              return { selectedUser: { ...state.selectedUser, isOnline: payload.isOnline } };
            });

            setChatStatusUpdateCache(payload);
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
