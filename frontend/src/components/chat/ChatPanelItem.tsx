import { useAppStore } from '@/store/useAppStore';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { cn, formatMessageLastTime } from '@/lib/utils';
import type { ChatListUser } from '@/types/user.types';

interface ChatPanelItemProps {
  chatUser: ChatListUser;
}

const ChatPanelItem = ({ chatUser }: ChatPanelItemProps) => {
  const { selectedUser, setSelectedUser } = useAppStore();

  return (
    <div
      className={cn(
        'hover:bg-echo-raised flex cursor-pointer items-center gap-2 rounded-lg p-2',
        selectedUser?._id === chatUser._id && 'bg-echo-p-pale echo-active-indicator',
      )}
      onClick={() => setSelectedUser(chatUser)}
    >
      <Avatar size="lg">
        <AvatarImage alt="profile picture" src={chatUser.profileIcon} />
        <AvatarFallback>{chatUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        <AvatarBadge className="dark:bg-echo-green right-0.5 bottom-0.5 group-data-[size=lg]/avatar:size-2" />
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 font-semibold">{chatUser.name}</p>

        <div className="text-echo-t2 w-full truncate text-xs">
          {chatUser._id !== chatUser.lastMessage?.senderId && <span className="text-echo-p-light">You: </span>}
          {chatUser.lastMessage?.text}
        </div>
      </div>
      <div className="relative flex h-full flex-col items-center">
        <p className="text-echo-t2 mt-1 text-xs">
          {chatUser.lastMessage?.createdAt && formatMessageLastTime(chatUser.lastMessage.createdAt)}
        </p>
        {!!chatUser.unreadCount && (
          <Badge variant="notification" className="mt-1">
            {chatUser.unreadCount > 99 ? '99+' : chatUser.unreadCount}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ChatPanelItem;
