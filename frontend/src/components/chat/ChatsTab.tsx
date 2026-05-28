import type { RefetchOptions } from '@tanstack/react-query';
import ChatPanelList from './ChatPanelList';
import type { ChatItem } from '@/types/user.types';

interface ChatsTabProps {
  chatItems: ChatItem[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isSearchActive: boolean;
  refetch: (options?: RefetchOptions) => void;
}

const ChatsTab = ({ chatItems, isSearchActive, ...listProps }: ChatsTabProps) => (
  <div className="flex flex-col gap-1">
    <p className="echo-label mt-3 pl-1">Users</p>
    <ChatPanelList chatItems={chatItems} isSearchActive={isSearchActive} {...listProps} />
  </div>
);

export default ChatsTab;
