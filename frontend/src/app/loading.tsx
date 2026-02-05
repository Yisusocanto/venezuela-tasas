export default function Loading() {
  return (
    <div className="w-full md:w-3/4 mx-auto animate-pulse">
      <div className="h-10 w-48 bg-gray-200 rounded mb-6"></div>

      {/* Calculator Skeleton */}
      <div className="h-64 bg-gray-100 rounded-xl mb-8"></div>

      {/* KPI Cards Skeleton */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 h-32 bg-gray-100 rounded-lg"></div>
        <div className="flex-1 h-32 bg-gray-100 rounded-lg"></div>
      </div>
    </div>
  );
}
