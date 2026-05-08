import { api } from '@/lib/axios';
import type { Chat, User } from '@/types/user.types';
import { keepPreviousData, queryOptions, skipToken } from '@tanstack/react-query';
import { userEndpoints } from './routes.constants';

const getChats = async () => {
  const response = await api.get<Chat[]>(userEndpoints.chats);

  return response.data;
};

export const chatsQueryOptions = () =>
  queryOptions({
    queryKey: ['chats'],
    queryFn: getChats,
  });

export const searchUsers = async (handle: string, signal: AbortSignal) => {
  const response = await api.get<User[]>(userEndpoints.search, { params: { handle }, signal });

  return response.data;
};

export const searchUsersQueryOptions = (handle: string) =>
  queryOptions({
    queryKey: ['users', handle],
    queryFn: handle ? ({ signal }) => searchUsers(handle, signal) : skipToken,
    placeholderData: keepPreviousData,
    retry: false,
    gcTime: 1000 * 10,
  });
