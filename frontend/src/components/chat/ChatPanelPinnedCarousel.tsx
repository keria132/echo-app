import { Card, CardAction, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

const ChatPanelPinnedCarousel = () => (
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
              <h4 className="text-3xl font-bold">NV</h4>
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
  </Carousel>
);

export default ChatPanelPinnedCarousel;
