import { cn } from '@/lib/utils';
import { Radio } from 'lucide-react';

const EchoLogo = ({ className, iconClassName }: { className?: string; iconClassName?: string }) => (
  <div
    className={cn(
      'from-echo-p-deep to-echo-p flex h-13 w-13 items-center justify-center rounded-xl bg-linear-to-br shadow-[0_0_40px_var(--echo-p)]/50',
      className,
    )}
  >
    <Radio className={iconClassName} />
  </div>
);

export default EchoLogo;
