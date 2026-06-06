import ChatScreen from '@/components/chat/ChatScreen';
import MessageInput from '@/components/chat/MessageInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { getChatItemProperties } from '@/lib/selectors';
import { useAppStore } from '@/store/useAppStore';
import { Ellipsis, MessageCircle } from 'lucide-react';

const ChatPage = () => {
  const { selectedChat } = useAppStore();

  if (!selectedChat)
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

  const chatProperties = getChatItemProperties(selectedChat);

  return (
    <section className="flex h-full w-full flex-col justify-between">
      <div className="bg-echo-surface border-echo-border grid w-full grid-cols-[max-content_1fr_max-content] items-center gap-2 border-b p-2 md:p-4">
        <Avatar size="lg">
          <AvatarImage alt="profile picture" src={chatProperties.icon} />
          <AvatarFallback>{chatProperties.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 font-semibold">{chatProperties.name}</p>
          <p className="text-echo-green w-full text-xs">{chatProperties.isOnline && 'online'}</p>
        </div>
        <Button variant="outline" size="icon-lg" className="rounded-md p-0">
          <Ellipsis className="text-echo-t2" />
        </Button>
      </div>
      <ChatScreen chatPartnerId={chatProperties.partnerId} name={chatProperties.name} chatId={chatProperties.chatId} />
      {chatProperties.partnerId && <MessageInput userId={chatProperties.partnerId} />}
    </section>
  );
};

export default ChatPage;
