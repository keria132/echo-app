import { api } from '@/lib/axios';
import type { User } from '@/types/user.types';
import { queryOptions } from '@tanstack/react-query';

const getChatPartners = async () => {
  const response = await api.get<User[]>('/messages/chats');

  return response.data;
};

export const chatPartnersQueryOptions = () =>
  queryOptions({
    queryKey: ['chatPartners'],
    queryFn: getChatPartners,
  });
