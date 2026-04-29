import { Check, CheckCheck } from 'lucide-react';

interface MessageProps {
  isOwnMessage: boolean;
  text?: string;
  time: string;
  image?: string;
  isDelivered: boolean;
  isViewed: boolean;
}

const DeliveryStatus = ({ isDelivered, isViewed }: { isDelivered: boolean; isViewed: boolean }) => {
  if (isViewed && isDelivered) return <CheckCheck className="text-echo-p size-4" />;
  if (isDelivered) return <Check className="text-echo-p size-4" />;
  return null;
};

const Message = ({ isOwnMessage, text, time, isDelivered, isViewed }: MessageProps) => {
  if (isOwnMessage)
    return (
      <div className="flex w-fit max-w-1/2 flex-col self-end">
        <p className="bg-echo-gradient shadow-echo-sm rounded-xl rounded-br px-4 py-2 text-sm">{text}</p>
        <sub className="text-echo-t3 flex justify-end gap-2 text-xs">
          {time}
          {<DeliveryStatus isDelivered={isDelivered} isViewed={isViewed} />}
        </sub>
      </div>
    );

  return (
    <div className="flex w-fit max-w-1/2 flex-col">
      <p className="bg-echo-raised rounded-xl rounded-bl px-4 py-2 text-sm">{text}</p>
      <sub className="text-echo-t3 text-xs">{time}</sub>
    </div>
  );
};

export default Message;

{
  /* <div className="flex w-fit max-w-1/2 flex-col">
          <p className="bg-echo-raised rounded-xl rounded-bl px-4 py-2 text-sm">Huh?</p>
          <sub className="text-echo-t3 text-xs">16:36</sub>
        </div>

        <div className="flex w-fit max-w-1/2 flex-col self-end">
          <p className="bg-echo-gradient shadow-echo-sm rounded-xl rounded-br px-4 py-2 text-sm">Nothing much, wby?</p>
          <sub className="text-echo-t3 flex justify-end gap-2 text-xs">
            16:36 <CheckCheck className="text-echo-p size-4" />
          </sub>
        </div>

        <div className="flex w-fit max-w-1/2 flex-col self-end">
          <p className="bg-echo-gradient shadow-echo-sm rounded-xl rounded-br px-4 py-2 text-sm">
            I've been doing, I've been doing, I've been doing, I've been doing, I've been doing,I've been doing,I've
            been doing, I've been doing, wby?
          </p>
          <sub className="text-echo-t3 flex justify-end gap-2 text-xs">
            16:36 <CheckCheck className="text-echo-p size-4" />
          </sub>
        </div> */
}
