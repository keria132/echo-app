import { Outlet } from 'react-router';
import NavigationRail from './chat/NavigationRail';
import ChatPanel from './chat/ChatPanel';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { chatsQueryOptions } from '@/api/user.api';

const MainLayout = () => {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  useQuery(chatsQueryOptions());

  return (
    <div className="bg-echo-bg grain flex h-screen w-full overflow-hidden">
      <NavigationRail setIsChatPanelOpen={setIsChatPanelOpen} className="z-10" />
      <div className="relative flex flex-1 overflow-hidden">
        <div
          className={cn(
            'shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
            isChatPanelOpen ? 'w-90' : 'w-0',
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
