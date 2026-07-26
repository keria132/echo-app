import type { MessageStatus } from '@/types/message.types';
import { Check, CheckCheck, CircleAlert, Clock } from 'lucide-react';

interface MessageProps {
  isOwnMessage: boolean;
  text?: string;
  time: string | null;
  image?: string;
  status: MessageStatus;
  ref?: React.RefCallback<HTMLDivElement>;
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

const Message = ({ isOwnMessage, text, time, status, ref }: MessageProps) => {
  if (isOwnMessage)
    return (
      <div className="flex w-fit max-w-1/2 flex-wrap items-end justify-end gap-x-1 self-end">
        {<DeliveryStatus status={status} />}
        <p className="bg-echo-gradient shadow-echo-sm rounded-xl rounded-br px-4 py-2 text-sm">{text}</p>
        {time && <sub className="text-echo-t3 mb-2 flex w-full justify-end text-xs">{time}</sub>}
      </div>
    );

  return (
    <div className="flex w-fit max-w-1/2 flex-col" ref={ref}>
      <p className="bg-echo-raised rounded-xl rounded-bl px-4 py-2 text-sm">{text}</p>
      {time && <sub className="text-echo-t3 mb-2 w-full text-xs">{time}</sub>}
    </div>
  );
};

export default Message;
