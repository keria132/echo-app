import ConversationScreen from '@/components/chat/ConversationScreen';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/store/useChatStore';
import { Ellipsis, ImagePlus, MessageCircle, Send, Smile } from 'lucide-react';

const ChatPage = () => {
  const { selectedUser } = useChatStore();

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
          <AvatarImage alt="profile picture" src="https://github.com/shadcnd.png" />
          <AvatarFallback>{selectedUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 font-semibold">{selectedUser.name}</p>
          {/* TODO: STATUS IS ONLINE, BACKEND FIRST */}
          <p className="text-echo-green w-full text-xs">online</p>
        </div>
        <Button variant="outline" className="size-9 rounded-md p-0">
          <Ellipsis className="text-echo-t2" />
        </Button>
      </div>
      <ConversationScreen selectedUserId={selectedUser._id} name={selectedUser.name} />
      <div className="bg-echo-surface border-echo-border flex items-center gap-2 border-t p-4">
        <Button variant="ghost" className="text-echo-t3 hover:text-echo-t2 rounded-md" size="icon-lg">
          <ImagePlus className="size-5" />
        </Button>
        <Input placeholder="Write a message" />
        <Button variant="ghost" className="text-echo-t3 hover:text-echo-t2 rounded-md" size="icon-lg">
          <Smile className="size-5" />
        </Button>
        <Button variant="primary" size="icon-xl">
          <Send className="size-5" />
        </Button>
      </div>
    </section>
  );
};

export default ChatPage;
