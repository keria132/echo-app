import { api } from '@/lib/axios';
import type { Chat } from '@/types/user.types';
import { chatEndpoints } from './routes.constants';
import { queryOptions } from '@tanstack/react-query';

const getChats = async () => {
  const response = await api.get<Chat[]>(chatEndpoints.base);

  return response.data;
};

export const patchChatViewed = async (chatId: string, payload: { messageIds: string[] }) => {
  await api.patch(chatEndpoints.base + chatId + '/viewed', payload);
};

export const chatsQueryOptions = () =>
  queryOptions({
    queryKey: ['chats'],
    queryFn: getChats,
  });
