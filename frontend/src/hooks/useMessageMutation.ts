import { messagesQueryOptions, sendMessage } from '@/api/messages.api';
import { getQueryClient } from '@/lib/query';
import { useAppStore } from '@/store/useAppStore';
import type { Message } from '@/types/message.types';
import { useMutation } from '@tanstack/react-query';
import notificationSound from '@/assets/sounds/notificationSound.mp3';
import { setChatLastMessageCache, setNewMessageCache } from '@/lib/cache';

const newMessageSound = new Audio(notificationSound);

export const useMessageMutation = (senderId: string, receiverId: string) => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (payload: { text: string; image?: string }) => sendMessage(receiverId, payload),

    onMutate: async payload => {
      await queryClient.cancelQueries({ queryKey: messagesQueryOptions(receiverId).queryKey });

      const previousMessages = queryClient.getQueryData(messagesQueryOptions(receiverId).queryKey);

      const optimisticMessage: Message = {
        _id: crypto.randomUUID(),
        senderId: senderId,
        receiverId: receiverId,
        text: payload.text,
        image: '',
        status: 'sending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNewMessageCache(optimisticMessage, receiverId);

      return { previousMessages, messageTempId: optimisticMessage._id };
    },

    onSuccess: (data, _, context) => {
      if (useAppStore.getState().isSoundEnabled) {
        newMessageSound.play().catch(console.error);
      }

      queryClient.setQueryData(
        messagesQueryOptions(receiverId).queryKey,
        prev => prev?.map(message => (message._id === context.messageTempId ? data : message)) ?? [],
      );

      setChatLastMessageCache(data, receiverId);
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(
        messagesQueryOptions(receiverId).queryKey,
        prev =>
          prev?.map(message => (message._id === context?.messageTempId ? { ...message, status: 'failed' } : message)) ??
          [],
      );
    },
  });
};
