import type { User } from '@/types/user.types';
import { create } from 'zustand';

const SOUND_PREFERENCE_NAME = 'isSoundEnabled';

export type Tabs = 'chats' | 'settings' | 'logout' | 'profile';

interface ChatStoreState {
  selectedUser: User | null;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setSelectedUser: (user: User) => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  selectedUser: null,
  isSoundEnabled: localStorage.getItem(SOUND_PREFERENCE_NAME) === 'true',
  toggleSound: () => {
    const next = !get().isSoundEnabled;

    localStorage.setItem(SOUND_PREFERENCE_NAME, next.toString());
    set({ isSoundEnabled: next });
  },
  setSelectedUser: user => set({ selectedUser: user }),
}));
