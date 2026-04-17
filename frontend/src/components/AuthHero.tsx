import { Radio } from 'lucide-react';
import { Badge } from './ui/badge';

const AuthHero = () => (
  <div className="flex flex-1 flex-wrap content-center items-center justify-start gap-2 pl-[15%]">
    <div className="from-echo-p-deep to-echo-p flex h-13 w-13 items-center justify-center rounded-xl bg-linear-to-br shadow-[0_0_40px_var(--echo-p)]/50">
      <Radio />
    </div>
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
