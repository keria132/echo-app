import { MessageSquareDashed, ServerCrash } from 'lucide-react';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty';
import { ChatPanelListSkeleton } from './ChatPanelListSkeleton';
import { Button } from '../ui/button';
import type { RefetchOptions } from '@tanstack/react-query';
import type { ChatListUser } from '@/types/user.types';
import ChatPanelItem from './ChatPanelItem';

interface ChatPanelListProps {
  chatUsers: ChatListUser[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isSearchActive: boolean;
  refetch: (options?: RefetchOptions) => void;
}

const ChatPanelList = ({ chatUsers, isLoading, isSuccess, isError, isSearchActive, refetch }: ChatPanelListProps) => {
  if (isLoading) return <ChatPanelListSkeleton />;

  if (isError) {
    return (
      <Empty className="mt-8 border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ServerCrash />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>Couldn't get the response.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (isSuccess && !chatUsers?.length) {
    return (
      <Empty className="mt-8 border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareDashed />
          </EmptyMedia>
          <EmptyTitle>{isSearchActive ? 'No users found' : 'No conversations yet'}</EmptyTitle>
          <EmptyDescription>{isSearchActive ? 'No users match the @handle' : 'Start a new chat.'}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          {!isSearchActive && (
            <>
              <Button variant="primary">Add new user</Button>
              <Button variant="outline" disabled>
                Import backup data
              </Button>
            </>
          )}
        </EmptyContent>
      </Empty>
    );
  }

  return chatUsers?.map(chatUser => <ChatPanelItem key={chatUser._id} chatUser={chatUser} />);
};

export default ChatPanelList;
