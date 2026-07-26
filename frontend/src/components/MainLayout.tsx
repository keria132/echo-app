import { Outlet } from 'react-router';
import NavigationRail from './NavigationRail';
import ChatPanel from './chat/ChatPanel';
import { useEffect } from 'react';
import { cn, updateNotifications } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { chatsQueryOptions } from '@/api/chat.api';
import { useAppStore } from '@/store/useAppStore';

const MainLayout = () => {
  const { isChatPanelOpen } = useAppStore();
  const { data: chats } = useQuery(chatsQueryOptions());

  useEffect(() => {
    if (chats) updateNotifications(chats);
  }, [chats]);

  return (
    <div className="bg-echo-bg grain flex h-screen w-full overflow-hidden">
      <NavigationRail className="z-10" />
      <div className="relative flex flex-1 overflow-hidden">
        <div
          className={cn(
            'shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
            'md:relative md:block',
            'absolute inset-y-0 left-0 z-10',
            isChatPanelOpen ? 'w-full md:w-90' : 'pointer-events-none w-0',
          )}
        >
          <ChatPanel className={isChatPanelOpen ? '' : 'opacity-0'} />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
