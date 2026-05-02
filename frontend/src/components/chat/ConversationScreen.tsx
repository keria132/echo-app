import { MessageCircle, ServerCrash } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty';
import { useQuery } from '@tanstack/react-query';
import { messagesQueryOptions } from '@/api/messages.api';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import Message from './Message';
import { useAuthStore } from '@/store/useAuthStore';
import { formatMessageTime } from '@/lib/utils';

const ConversationScreen = ({ selectedUserId, name }: { selectedUserId: string; name: string }) => {
  const { data: messages, isLoading, isSuccess, isError, refetch } = useQuery(messagesQueryOptions(selectedUserId));
  const { user } = useAuthStore();

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
    <ScrollArea className="min-h-0 w-full flex-1">
      <div className="flex h-full flex-col gap-3 px-4 py-2">
        {/* TODO: SORT MESSAGES BASED ON THE DAY AND AUTOSCROLL*/}
        {messages?.map(({ _id, senderId, text, status, createdAt }) => (
          <Message
            key={_id}
            text={text}
            isOwnMessage={senderId === user?._id}
            time={formatMessageTime(createdAt)}
            status={status}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ConversationScreen;
