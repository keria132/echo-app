import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import type { LucideIcon } from 'lucide-react';

interface NotificationBadgeProps {
  notification?: number | null;
  className?: string;
  icon: LucideIcon;
  onClick?: () => void;
  iconClassName?: string;
  isActive?: boolean;
}

const NavigationItem = ({
  notification,
  className,
  icon: Icon,
  onClick,
  iconClassName,
  isActive,
}: NotificationBadgeProps) => (
  <div
    className={cn(
      'before:bg-echo-p relative before:absolute before:top-1/2 before:-left-2.75 before:h-6 before:w-0.75',
      'cursor-pointer before:-translate-y-1/2 before:rounded-r-[3px] before:opacity-0 before:transition-opacity',
      isActive && 'before:opacity-100',
      className,
    )}
    onClick={onClick}
  >
    {
      <Icon
        className={cn(
          'text-echo-t3 hover:bg-echo-raised hover:text-echo-t2 size-10 rounded-lg p-2',
          isActive && 'bg-echo-p-pale text-echo-p-light',
          iconClassName,
        )}
      />
    }
    {notification && (
      <Badge
        variant="notification"
        className="border-echo-surface pointer-events-none absolute top-0 right-0 size-auto min-h-4.5 min-w-3.5 border-2 px-0.5"
      >
        {notification}
      </Badge>
    )}
  </div>
);

export default NavigationItem;
