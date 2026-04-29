import { Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ConversationsList from './ConversationsList';

const ConversationsPanel = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'bg-echo-surface border-echo-border flex h-full w-90 shrink-0 flex-col gap-y-2 border-r p-4 opacity-100 transition-opacity duration-300',
      className,
    )}
  >
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
      <h3 className="text-xl font-extrabold">Messages</h3>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="size-9 rounded-md p-0">
            <Plus className="text-echo-t2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <InputGroup className="h-10 w-full">
        <InputGroupInput placeholder="Search users..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
    </div>
    <Tabs className="w-full" defaultValue="all">
      <TabsList variant="line" className="w-full">
        <TabsTrigger value="all" className="data-active:text-echo-p-light!">
          All
        </TabsTrigger>
        <TabsTrigger value="secret" className="data-active:text-echo-p-light!">
          Secret
        </TabsTrigger>
        <TabsTrigger value="archive" className="data-active:text-echo-p-light!">
          Archive
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="w-full">
        <ConversationsList />
      </TabsContent>
      <TabsContent value="secret">Secret</TabsContent>
      <TabsContent value="archive">Archive</TabsContent>
    </Tabs>
  </div>
);

export default ConversationsPanel;
