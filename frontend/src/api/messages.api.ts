import { api } from '@/lib/axios';
import type { Message } from '@/types/message.types';
import { queryOptions, skipToken } from '@tanstack/react-query';

export const MESSAGES_QUERY_KEY = 'messages';

const getMessagesByUserId = async (userId: string) => {
  const response = await api.get<Message[]>('/messages/' + userId);

  return response.data;
};

export const sendMessage = async (userId: string, payload: { text: string; image?: string }) => {
  const response = await api.post<Message>(`/messages/send/${userId}`, payload);

  return response.data;
};

export const messagesQueryOptions = (userId?: string) =>
  queryOptions({
    queryKey: [MESSAGES_QUERY_KEY, userId],
    queryFn: userId ? () => getMessagesByUserId(userId) : skipToken,
  });
