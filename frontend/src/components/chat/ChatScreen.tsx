import { MessageCircle, ServerCrash } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty';
import { useQuery } from '@tanstack/react-query';
import { messagesQueryOptions } from '@/api/messages.api';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import Message from './Message';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDateKey, formatMessageTime } from '@/lib/utils';
import { useEffect, useMemo, useRef } from 'react';
import type { Message as MessageType } from '@/types/message.types';
import { useMessageObserver } from '@/hooks/useMessageObserver';

type MessageWithSeparator = { type: 'separator'; data: string } | { type: 'message'; data: MessageType };

interface ChatScreenProps {
  chatPartnerId?: string;
  chatId?: string;
  name?: string;
}

const ChatScreen = ({ chatPartnerId, name, chatId }: ChatScreenProps) => {
  const { data: messages, isLoading, isSuccess, isError, refetch } = useQuery(messagesQueryOptions(chatPartnerId));
  const { user } = useAuthStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { refCallback } = useMessageObserver({
    observerRootRef: scrollAreaRef,
    chatId,
    partnerId: chatPartnerId,
    currentUserId: user!._id,
  });

  const sortedMessages = useMemo<MessageWithSeparator[]>(() => {
    if (!messages?.length) return [];

    let lastDateKey = '';

    const results: MessageWithSeparator[] = [];
    messages?.forEach(message => {
      const date = new Date(message.createdAt);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      if (dateKey !== lastDateKey) {
        results.push({ type: 'separator', data: formatDateKey(message.createdAt) });
        lastDateKey = dateKey;
      }

      results.push({ type: 'message', data: message });
    });

    return results;
  }, [messages]);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');

    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  if (isLoading)
    return (
      <div className="flex h-full flex-col gap-1.5 px-4 py-2">
        <Skeleton className="h-9 w-48 rounded-xl rounded-bl" />
        <Skeleton className="h-9 w-32 rounded-xl rounded-bl" />
        <Skeleton className="h-9 w-56 self-end rounded-xl rounded-br" />
        <Skeleton className="h-16 w-64 self-end rounded-xl rounded-br" />
        <Skeleton className="h-9 w-40 rounded-xl rounded-bl" />
        <Skeleton className="h-9 w-52 self-end rounded-xl rounded-br" />
        <Skeleton className="h-9 w-36 rounded-xl rounded-bl" />
        <Skeleton className="h-16 w-60 self-end rounded-xl rounded-br" />
      </div>
    );

  if (isError)
    return (
      <Empty className="border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-10">
            <ServerCrash className="size-5" />
          </EmptyMedia>
          <EmptyTitle className="text-lg">Couldn't load messages</EmptyTitle>
          <EmptyDescription>Something went wrong. Try again.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    );

  if (isSuccess && !messages.length)
    return (
      <Empty className="border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-10">
            <MessageCircle className="size-5" />
          </EmptyMedia>
          <EmptyTitle className="text-lg">No messages yet</EmptyTitle>
          <EmptyDescription>Say hello to {name}!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  return (
    <ScrollArea ref={scrollAreaRef} className="min-h-0 w-full flex-1">
      <div className="flex h-full flex-col gap-1 px-4 py-2">
        {sortedMessages?.map(({ type, data }, index) => {
          if (type === 'separator')
            return (
              <p key={data} className="echo-label text-center">
                {data}
              </p>
            );

          const next = sortedMessages[index + 1];
          const currentTime = formatMessageTime(data.createdAt);
          const currentSender = data.senderId;
          const nextTime = next?.type === 'message' ? formatMessageTime(next.data.createdAt) : null;
          const nextSender = next?.type === 'message' && next.data.senderId;

          return (
            <Message
              key={data._id}
              text={data.text}
              isOwnMessage={data.senderId === user?._id}
              time={currentTime !== nextTime || currentSender !== nextSender ? currentTime : null}
              status={data.status}
              ref={(element: HTMLDivElement) =>
                refCallback({ element, _id: data._id, senderId: data.senderId, status: data.status })
              }
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ChatScreen;
