import { messagesQueryOptions, sendMessage } from '@/api/messages.api';
import { getQueryClient } from '@/lib/query';
import type { Message } from '@/types/message.types';
import { useMutation } from '@tanstack/react-query';
import notificationSound from '@/assets/sounds/notification.mp3';
import { useAppStore } from '@/store/useAppStore';

const messageSendSound = new Audio(notificationSound);

export const useMessageMutation = (senderId: string, receiverId: string) => {
  const queryClient = getQueryClient();
  const { isSoundEnabled } = useAppStore.getState();

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

      queryClient.setQueryData(messagesQueryOptions(receiverId).queryKey, prev =>
        prev ? [...prev, optimisticMessage] : [optimisticMessage],
      );

      return { previousMessages, messageTempId: optimisticMessage._id };
    },

    onSuccess: (data, _, context) => {
      queryClient.setQueryData(
        messagesQueryOptions(receiverId).queryKey,
        prev => prev?.map(message => (message._id === context.messageTempId ? data : message)) ?? [],
      );

      if (isSoundEnabled) {
        messageSendSound.play().catch(console.error);
      }
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
