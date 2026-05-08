import type { RefetchOptions } from '@tanstack/react-query';
import type { ChatListUser } from '@/types/user.types';
import ChatPanelList from './ChatPanelList';

interface ChatsTabProps {
  chatUsers: ChatListUser[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isSearchActive: boolean;
  refetch: (options?: RefetchOptions) => void;
}

const ChatsTab = ({ chatUsers = [], isSearchActive, ...listProps }: ChatsTabProps) => (
  <div className="flex flex-col gap-1">
    <p className="echo-label mt-3 pl-1">{isSearchActive ? 'Users' : 'Chats'}</p>
    <ChatPanelList chatUsers={chatUsers} isSearchActive={isSearchActive} {...listProps} />
  </div>
);

export default ChatsTab;
