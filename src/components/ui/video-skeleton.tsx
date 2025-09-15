import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function VideoCardSkeleton() {
  return (
    <Card className="group overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 pt-0 pb-2">
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden w-md">
        <Skeleton className="w-full h-full" />
        {/* Category badge skeleton */}
        <Skeleton className="absolute top-3 left-3 w-20 h-6 rounded-full" />
        {/* Duration badge skeleton */}
        <Skeleton className="absolute bottom-3 right-3 w-14 h-6 rounded-md" />
      </div>

      {/* Content Skeleton */}
      <CardContent className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-7 w-3/5" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Channel and Views skeleton */}
        <div className="flex items-center justify-between ">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-1.5 flex-wrap">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>

        {/* Action button skeleton */}
        <div className="flex justify-end">
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function VideoGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  );
}
