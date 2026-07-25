import type { Chat, ChatItem } from '@/types/user.types';
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

const SOUND_PREFERENCE_NAME = 'isSoundEnabled';

interface AppStoreState {
  selectedChat: ChatItem | null;
  isSoundEnabled: boolean;
  notificationsCount: number;
  isChatPanelOpen: boolean;
  setIsChatPanelOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
  setNotificationCount: (count: number) => void;
  toggleSound: () => void;
  setSelectedChat: (chat: ChatItem) => void;
  upgradeUserToChat: (chat: Chat) => void;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  selectedChat: null,
  isSoundEnabled: localStorage.getItem(SOUND_PREFERENCE_NAME) === 'true',
  notificationsCount: 0,
  isChatPanelOpen: false,
  setIsChatPanelOpen: isOpen =>
    set(state => ({
      isChatPanelOpen: typeof isOpen === 'function' ? isOpen(state.isChatPanelOpen) : isOpen,
    })),
  setNotificationCount: (count: number) => set({ notificationsCount: count }),
  toggleSound: () => {
    const next = !get().isSoundEnabled;

    localStorage.setItem(SOUND_PREFERENCE_NAME, next.toString());
    set({ isSoundEnabled: next });
  },
  setSelectedChat: chat => set({ selectedChat: chat }),
  upgradeUserToChat: chat =>
    set(state => {
      const selectedChat = state.selectedChat;
      if (selectedChat?.kind !== 'user') return state;

      const isUserMatch = chat.participants.some(({ _id }) => _id === selectedChat?.user._id);
      if (!isUserMatch) return state;

      const currentUserId = useAuthStore.getState().user?._id;
      const partner = chat.participants.find(p => p._id !== currentUserId);

      if (!currentUserId || !partner) return state;

      return { selectedChat: { kind: 'direct', chat, partner, unreadCount: chat.unreadCounts[currentUserId] ?? 0 } };
    }),
}));
