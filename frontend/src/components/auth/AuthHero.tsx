import { Badge } from '../ui/badge';
import EchoLogo from '../EchoLogo';
import { cn } from '@/lib/utils';

const AuthHero = ({ className }: { className?: string }) => (
  <div className={cn('flex flex-wrap content-center items-center justify-start gap-2', className)}>
    <EchoLogo />
    <h1 className="to-echo-p-light bg-linear-to-br from-white from-40% bg-clip-text p-1 text-5xl font-extrabold tracking-[-2px] text-transparent">
      echo
    </h1>
    <div className="mt-2 flex w-full gap-2">
      <Badge variant="outline" className="px-4">
        React
      </Badge>
      <Badge variant="outline" className="px-4">
        Node.js
      </Badge>
      <Badge variant="outline" className="px-4">
        WebSockets
      </Badge>
    </div>
  </div>
);

export default AuthHero;
