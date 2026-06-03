import { Card, CardContent } from "./ui/card";

const SearchPropertyCardSkeleton = () => {
  return (
    <Card className="group relative overflow-hidden rounded-xl shadow-none border-0 animate-pulse">
      <CardContent className="p-0">
        {/* Image Skeleton */}
        <div className="rounded-xl overflow-hidden h-[10rem] bg-gray-200"></div>

        {/* Content Skeleton */}
        <div className="py-3 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </div>
      </CardContent>
    </Card>
  );
};
export default SearchPropertyCardSkeleton