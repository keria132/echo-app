import { api } from '@/lib/axios';
import type { Message } from '@/types/message.types';
import { queryOptions, skipToken } from '@tanstack/react-query';

const getMessagesByUserId = async (userId: string) => {
  const response = await api.get<Message[]>('/messages/' + userId);

  return response.data;
};

export const messagesQueryOptions = (userId?: string) =>
  queryOptions({
    queryKey: ['messages', userId],
    queryFn: userId ? () => getMessagesByUserId(userId) : skipToken,
  });
