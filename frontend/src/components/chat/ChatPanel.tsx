import { Plus, Search } from 'lucide-react';
import { cn, normalizeChatUsers } from '@/lib/utils';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { chatsQueryOptions, searchUsersQueryOptions } from '@/api/user.api';
import ChatsTab from './ChatsTab';
import { useAuthStore } from '@/store/useAuthStore';
import type { ChatListUser } from '@/types/user.types';
import { useHandleSearch } from '@/hooks/useHandleSearch';

const ChatPanel = ({ className }: { className?: string }) => {
  const { searchText, isSearchActive, debouncedHandle, handleSearchUsers } = useHandleSearch();
  const currentUserId = useAuthStore(state => state.user?._id);

  const { data: chats, isLoading, isSuccess, isError, refetch } = useQuery(chatsQueryOptions());
  const {
    data: searchedUsers,
    isLoading: isLoadingSearch,
    isSuccess: isSuccessSearch,
    isError: isErrorSearch,
    refetch: refetchSearch,
  } = useQuery(searchUsersQueryOptions(debouncedHandle));

  const chatListUsers = useMemo<ChatListUser[]>(
    () =>
      isSearchActive ? normalizeChatUsers(searchedUsers, currentUserId) : normalizeChatUsers(chats, currentUserId),
    [isSearchActive, searchedUsers, chats, currentUserId],
  );

  return (
    <div
      className={cn(
        'bg-echo-surface border-echo-border flex h-full w-90 shrink-0 flex-col gap-y-2 border-r p-4 opacity-100 transition-opacity duration-300',
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-extrabold">Messages</h3>
        <Dialog>
          <DialogTrigger className="cursor-pointer">
            <Tooltip>
              <TooltipTrigger asChild>
                <Plus className="text-echo-t2" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new user</p>
              </TooltipContent>
            </Tooltip>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add user by friend code</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <InputGroup className="h-10 w-full">
          <InputGroupInput
            placeholder="Search users..."
            value={searchText}
            onChange={event => handleSearchUsers(event.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
        </InputGroup>
      </div>
      <Tabs className="w-full" defaultValue="all">
        <TabsList variant="line" className="w-full">
          <TabsTrigger value="all" className="data-active:text-echo-p-light!">
            All
          </TabsTrigger>
          <TabsTrigger value="secret" className="data-active:text-echo-p-light!">
            Secret
          </TabsTrigger>
          <TabsTrigger value="archive" className="data-active:text-echo-p-light!">
            Archive
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="w-full">
          <ChatsTab
            chatUsers={chatListUsers}
            isLoading={isSearchActive ? isLoadingSearch : isLoading}
            isSuccess={isSearchActive ? isSuccessSearch : isSuccess}
            isError={isSearchActive ? isErrorSearch : isError}
            refetch={isSearchActive ? refetchSearch : refetch}
            isSearchActive={isSearchActive}
          />
        </TabsContent>
        <TabsContent value="secret">Secret</TabsContent>
        <TabsContent value="archive">Archive</TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatPanel;
