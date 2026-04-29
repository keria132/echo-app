import { Outlet } from 'react-router';
import NavigationRail from './chat/NavigationRail';
import { SidebarProvider } from './ui/sidebar';
import ConversationsPanel from './chat/ConversationsPanel';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { chatPartnersQueryOptions } from '@/api/user.api';

const MainLayout = () => {
  const [isConversationsPanelOpen, setIsConversationsPanelOpen] = useState(false);
  useQuery(chatPartnersQueryOptions());

  return (
    <SidebarProvider>
      <div className="bg-echo-bg grain flex h-screen w-full overflow-hidden">
        <NavigationRail setIsConversationsPanelOpen={setIsConversationsPanelOpen} className="z-10" />
        <div className="relative flex flex-1 overflow-hidden">
          <div
            className={cn(
              'shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
              isConversationsPanelOpen ? 'w-90' : 'w-0',
            )}
          >
            <ConversationsPanel className={isConversationsPanelOpen ? '' : 'opacity-0'} />
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
