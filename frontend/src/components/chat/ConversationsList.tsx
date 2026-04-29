import { Card, CardAction, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { useQuery } from '@tanstack/react-query';
import { chatPartnersQueryOptions } from '@/api/user.api';
import ConversationsListSkeleton from './ConversationsListSkeleton';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty';
import { MessageSquareDashed, ServerCrash } from 'lucide-react';
import { Button } from '../ui/button';
import ConversationsItem from './ConversationsItem';

const ConversationsList = () => {
  const { data: chatPartners, isLoading, isSuccess, isError, refetch } = useQuery(chatPartnersQueryOptions());

  if (isLoading) return <ConversationsListSkeleton />;

  if (isError) {
    return (
      <Empty className="mt-8 border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ServerCrash />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>Couldn't load your conversations.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (isSuccess && !chatPartners.length) {
    return (
      <Empty className="mt-8 border-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareDashed />
          </EmptyMedia>
          <EmptyTitle>No conversations yet</EmptyTitle>
          <EmptyDescription>Start a new chat.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button variant="primary">Add new user</Button>
          <Button variant="outline" disabled>
            Import backup data
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="echo-label mt-3 pl-1">Pinned</p>
      <Carousel
        className="w-full"
        opts={{
          align: 'start',
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem className="basis-2/7 pl-1" key={index}>
              <Card className="ring-echo-p/38 from-echo-p-pale to-echo-p-deep relative m-1 gap-y-1 bg-linear-10 ring-[1.5px]">
                <CardHeader>
                  <CardAction>
                    <div className="bg-echo-raised/80 border-echo-p-deep absolute top-1.5 right-1.5 size-2.25 rounded-full border ring ring-black" />
                  </CardAction>
                </CardHeader>
                <CardContent className="mt-2 flex justify-center p-0">
                  <h4 className="text-3xl font-bold">NE</h4>
                </CardContent>
                <CardFooter className="border-0 bg-gradient-to-b from-transparent to-black/75 p-2 pt-3">
                  <p className="text-xs">Neil V.</p>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="dark:bg-input dark:border-echo-p-deep dark:hover:bg-echo-p-deep -left-3 transition-all duration-150 disabled:opacity-0" />
        <CarouselNext className="dark:bg-input dark:border-echo-p-deep dark:hover:bg-echo-p-deep -right-3 transition-all duration-150 disabled:opacity-0" />
        {/* TODO: MOVE STYLES TO CAROUSEL UI COMPONENT*/}
      </Carousel>

      <p className="echo-label mt-3 pl-1">Recent</p>
      {chatPartners?.map(user => (
        <ConversationsItem
          key={user._id}
          user={user}
          lastMessage="Are you free tomorrow dhj hj dwhauidwd kd, cheacb hdej h hjkdwa hj?"
          lastOnline="1h"
          messagesCount={3}
        />
      ))}
    </div>
  );
};

export default ConversationsList;
