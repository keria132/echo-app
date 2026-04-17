import { create } from 'zustand';
import { api } from '../lib/axios';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/utils';
import type { User } from '@/types/global.types';
import type { LoginSchemaType } from '@/schemas/auth.schema';
import type { SignupPayload } from '@/types/auth.types';

interface AuthStoreState {
  user: null | User;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  authenticate: () => Promise<void>;
  signup: (data: SignupPayload) => Promise<void>;
  login: (data: LoginSchemaType) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>(set => ({
  user: null,
  isAuthenticated: false,
  isSigningUp: false,
  isLoggingIn: false,
  authenticate: async () => {
    try {
      const response = await api.get('/auth/check');
      set({ user: response.data });
    } catch {
      set({ user: null });
    } finally {
      set({ isAuthenticated: true });
    }
  },

  signup: async data => {
    set({ isSigningUp: true });

    try {
      const response = await api.post('/auth/signup', data);
      set({ user: response.data });

      toast.success('You successfully signed up');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async data => {
    set({ isLoggingIn: true });

    try {
      const response = await api.post('/auth/login', data);
      set({ user: response.data });

      toast.success('You successfully logged in');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const response = await api.delete('/auth/logout');
      set({ user: null });

      toast.success(response.data.message);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  },
}));
