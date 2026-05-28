import { create } from 'zustand';
import { createSocket } from '@/lib/socket';
import type { NewMessagePayload, UpdateMessagePayload } from '@/types/message.types';
import { toast } from 'sonner';
import type { Chat } from '@/types/user.types';
import notificationSound from '@/assets/sounds/newMessage.mp3';
import { useAppStore } from './useAppStore';
import {
  setChatNewMessageCache,
  setChatStatusUpdateCache,
  setNewChatCache,
  setNewMessageCache,
  setViewedMessageCache,
  type ChatStatusUpdatePayload,
} from '@/lib/cache';
import { useAuthStore } from './useAuthStore';
import { getChatUserId } from '@/lib/selectors';

const newMessageSound = new Audio(notificationSound);

interface SocketStoreState {
  socket: WebSocket | null;
  connect: () => void;
  disconnect: () => void;
}

type WSMessageType = {
  type: 'new_message';
  payload: NewMessagePayload;
};

type WSNewChatType = {
  type: 'new_chat';
  payload: Chat;
};

type WSStatusUpdateType = {
  type: 'user_status_update';
  payload: ChatStatusUpdatePayload;
};

type WSMessagesUpdate = {
  type: 'messages_viewed';
  payload: UpdateMessagePayload;
};

type WSDataType = WSMessageType | WSNewChatType | WSStatusUpdateType | WSMessagesUpdate;

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
          case 'new_message': {
            const isMine = payload.message.senderId === useAuthStore.getState().user?._id;

            if (!isMine && useAppStore.getState().isSoundEnabled) {
              newMessageSound.play().catch(console.error);
            }

            if (!isMine) {
              setNewMessageCache(payload.message);
            }

            setChatNewMessageCache(payload);

            break;
          }

          case 'new_chat': {
            if (useAppStore.getState().isSoundEnabled) {
              newMessageSound.play().catch(console.error);
            }

            setNewChatCache(payload);

            useAppStore.getState().upgradeUserToChat(payload);

            break;
          }

          case 'user_status_update': {
            useAppStore.setState(state => {
              const chatId = getChatUserId(state.selectedChat);
              if (!state.selectedChat || chatId !== payload.userId) return state;

              if (state.selectedChat.kind === 'direct') {
                return {
                  selectedChat: {
                    ...state.selectedChat,
                    partner: { ...state.selectedChat.partner, isOnline: payload.isOnline },
                  },
                };
              }

              return state;
            });

            setChatStatusUpdateCache(payload);

            break;
          }

          case 'messages_viewed': {
            setViewedMessageCache(payload.viewedBy, payload.messageIds);

            break;
          }
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
