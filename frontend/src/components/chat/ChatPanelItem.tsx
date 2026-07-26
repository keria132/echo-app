import { useAppStore } from '@/store/useAppStore';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { cn, formatMessageLastTime } from '@/lib/utils';
import type { ChatItem } from '@/types/user.types';
import { getChatItemProperties, getChatUserId } from '@/lib/selectors';
import { TAILWIND_MD_SCREEN_PX } from '@/constants/tailwind';

interface ChatPanelItemProps {
  chatItem: ChatItem;
}

const ChatPanelItem = ({ chatItem }: ChatPanelItemProps) => {
  const { selectedChat, setSelectedChat, setIsChatPanelOpen } = useAppStore();
  const userId = getChatUserId(chatItem);
  const selectedUserId = getChatUserId(selectedChat);
  const chatProperties = getChatItemProperties(chatItem);

  return (
    <div
      className={cn(
        'hover:bg-echo-raised flex cursor-pointer items-center gap-2 rounded-lg p-2',
        selectedUserId === userId && 'bg-echo-p-pale echo-active-indicator',
      )}
      onClick={() => {
        setSelectedChat(chatItem);
        if (window.innerWidth < TAILWIND_MD_SCREEN_PX) setIsChatPanelOpen(false);
      }}
    >
      <Avatar size="lg">
        <AvatarImage alt="profile picture" src={chatProperties.icon} />
        <AvatarFallback>{chatProperties.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        <AvatarBadge
          className={cn(
            'right-0.5 bottom-0.5 hidden group-data-[size=lg]/avatar:size-2',
            chatProperties.isOnline && 'dark:bg-echo-green inline-flex',
          )}
        />
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 font-semibold">{chatProperties.name}</p>

        <div className="text-echo-t2 w-full truncate text-xs">
          {chatProperties.lastMessage && userId !== chatProperties.lastMessage.senderId && (
            <span className="text-echo-p-light">You: </span>
          )}
          {chatProperties.lastMessage?.text}
        </div>
      </div>
      <div className="relative flex h-full flex-col items-center">
        <p className="text-echo-t2 mt-1 text-xs">
          {chatProperties.lastMessage?.createdAt && formatMessageLastTime(chatProperties.lastMessage.createdAt)}
        </p>
        {!!chatProperties.unreadCount && (
          <Badge variant="notification" className="mt-1">
            {chatProperties.unreadCount > 99 ? '99+' : chatProperties.unreadCount}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ChatPanelItem;
