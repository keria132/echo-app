import type { Chat, User } from '@/types/user.types';
import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? `Axios error: ${error.message}`;
  }

  return 'Unexpected error!';
};

export const formatMessageTime = (date: string) =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const isSameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' });
const dateFormatterWithYear = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatDateKey = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, now)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.getFullYear() !== now.getFullYear() ? dateFormatterWithYear.format(date) : dateFormatter.format(date);
};

export const imageToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Failed to read file as string'));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const isChats = (item: User[] | Chat[]): item is Chat[] => 'participants' in item[0];

export const normalizeChatUsers = (items: User[] | Chat[] | undefined, currentUserId: string | undefined) => {
  if (!items || !items.length || !currentUserId) return [];

  if (isChats(items)) {
    return items.flatMap(chat => {
      const partner = chat.participants.find(user => user._id !== currentUserId);

      if (!partner) {
        console.warn(`Chat ${chat._id} has no partner for user ${currentUserId}`);
        return [];
      }

      return {
        _id: partner._id,
        name: partner?.name,
        profileIcon: partner?.profileIcon,
        lastMessage: chat.lastMessage,
        unreadCount: chat.unreadCount,
        isOnline: partner.isOnline,
      };
    });
  } else {
    return items.map(user => ({
      _id: user._id,
      name: user.name,
      profileIcon: user.profileIcon,
      isOnline: user.isOnline,
    }));
  }
};

export const formatMessageLastTime = (date: string): string => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return `${Math.floor(seconds / 604800)}w`;
};
