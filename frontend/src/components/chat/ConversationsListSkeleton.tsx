import { Skeleton } from '../ui/skeleton';

const ConversationsListSkeleton = () => (
  <div className="flex flex-col gap-1">
    <p className="echo-label mt-3 pl-1">Pinned</p>
    <div className="flex gap-1 overflow-hidden px-1 py-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="shrink-0 basis-2/7 p-1">
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ))}
    </div>

    <p className="echo-label mt-3 pl-1">Recent</p>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-2 rounded-lg p-2">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-2.5 w-44 opacity-60" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-2.5 w-6 opacity-60" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export default ConversationsListSkeleton;
