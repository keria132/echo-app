import { useAppStore } from '@/store/useAppStore';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import type { User } from '@/types/user.types';
import { cn } from '@/lib/utils';

interface ConversationsItemProps {
  user: User;
  lastMessage?: string;
  lastOnline?: string;
  messagesCount?: number;
}

const ConversationsItem = ({ user, lastMessage, lastOnline, messagesCount }: ConversationsItemProps) => {
  const { selectedUser, setSelectedUser } = useAppStore();

  return (
    <div
      className={cn(
        'hover:bg-echo-raised flex cursor-pointer items-center gap-2 rounded-lg p-2',
        selectedUser?._id === user._id && 'bg-echo-p-pale echo-active-indicator',
      )}
      onClick={() => setSelectedUser(user)}
    >
      <Avatar size="lg">
        <AvatarImage alt="profile picture" src="https://github.com/shadcnd.png" />
        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        <AvatarBadge className="dark:bg-echo-green right-0.5 bottom-0.5 group-data-[size=lg]/avatar:size-2" />
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 font-semibold">{user.name}</p>
        <p className="text-echo-t2 w-full truncate text-xs">{lastMessage}</p>
      </div>
      <div className="relative flex h-full flex-col items-center">
        {/*TODO: LAST ONLINE LATER IN BACKEND */}
        <p className="text-echo-t2 mt-1 text-xs">{lastOnline}</p>
        {messagesCount && (
          <Badge variant="notification" className="mt-1">
            {messagesCount > 99 ? '99+' : messagesCount}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ConversationsItem;
