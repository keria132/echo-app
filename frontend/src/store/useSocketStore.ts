import { create } from 'zustand';
import { createSocket } from '@/lib/socket';
import type { Message } from '@/types/message.types';
import { getQueryClient } from '@/lib/query';
import { messagesQueryOptions } from '@/api/messages.api';
import { toast } from 'sonner';

interface SocketStoreState {
  socket: WebSocket | null;
  connect: () => void;
  disconnect: () => void;
}

type WSMessageType = {
  type: string;
  payload: Message;
};

export const useSocketStore = create<SocketStoreState>((set, get) => ({
  socket: null,

  connect: () => {
    if (get().socket) return;

    const socket = createSocket();

    socket.onopen = () => console.log('WebSocket connected');

    socket.onmessage = event => {
      try {
        const { type, payload }: WSMessageType = JSON.parse(event.data);

        if (type === 'new_message') {
          const queryClient = getQueryClient();
          queryClient.setQueryData<Message[]>(messagesQueryOptions(payload.senderId).queryKey, prev =>
            prev ? [...prev, payload] : [payload],
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
