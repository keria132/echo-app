import { create } from 'zustand';

export const useAuthStore = create(() => ({
  user: {},
  isLoggedIn: false,
}));
