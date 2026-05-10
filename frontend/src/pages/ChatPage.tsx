import ChatScreen from '@/components/chat/ChatScreen';
import MessageInput from '@/components/chat/MessageInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { useAppStore } from '@/store/useAppStore';
import { Ellipsis, MessageCircle } from 'lucide-react';

const ChatPage = () => {
  const { selectedUser } = useAppStore();

  if (!selectedUser)
    return (
      <section className="flex h-full w-full flex-col justify-between">
        <Empty className="border-none">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-echo-gradient shadow-echo-sm size-10">
              <MessageCircle className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="text-lg">No conversation selected</EmptyTitle>
            <EmptyDescription>Pick someone from the list to start chatting.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    );

  return (
    <section className="flex h-full w-full flex-col justify-between">
      <div className="bg-echo-surface border-echo-border grid w-full grid-cols-[max-content_1fr_max-content] items-center gap-2 border-b p-4">
        <Avatar size="lg">
          <AvatarImage alt="profile picture" src={selectedUser.profileIcon} />
          <AvatarFallback>{selectedUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 font-semibold">{selectedUser.name}</p>
          <p className="text-echo-green w-full text-xs">{selectedUser.isOnline && 'online'}</p>
        </div>
        <Button variant="outline" className="size-9 rounded-md p-0">
          <Ellipsis className="text-echo-t2" />
        </Button>
      </div>
      <ChatScreen selectedUserId={selectedUser._id} name={selectedUser.name} />
      <MessageInput userId={selectedUser._id} />
    </section>
  );
};

export default ChatPage;
