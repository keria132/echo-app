import type { MessageStatus } from '@/types/message.types';
import { Check, CheckCheck, CircleAlert, Clock } from 'lucide-react';

interface MessageProps {
  isOwnMessage: boolean;
  text?: string;
  time: string | null;
  image?: string;
  status: MessageStatus;
}

const DeliveryStatus = ({ status }: { status: MessageStatus }) => {
  switch (status) {
    case 'sending':
      return <Clock className="text-echo-t3 size-3.5" />;

    case 'failed':
      return <CircleAlert className="text-destructive size-3.5" />;

    case 'viewed':
      return <CheckCheck className="text-echo-p size-4" />;

    case 'sent':
      return <Check className="text-echo-t3 size-4" />;
  }
};

const Message = ({ isOwnMessage, text, time, status }: MessageProps) => {
  if (isOwnMessage)
    return (
      <div className="flex w-fit max-w-1/2 flex-wrap items-end justify-end gap-x-1 self-end">
        {<DeliveryStatus status={status} />}
        <p className="bg-echo-gradient shadow-echo-sm rounded-xl rounded-br px-4 py-2 text-sm">{text}</p>
        {time && <sub className="text-echo-t3 mb-2 flex w-full justify-end gap-2 text-xs">{time}</sub>}
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
