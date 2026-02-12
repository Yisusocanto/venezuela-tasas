import { Card, Skeleton } from "@heroui/react";

export default function Loading() {
  return (
    <div className="w-full flex flex-col gap-8 md:w-3/4 mx-auto mb-20">
      {/* Header Section */}
      <div className="mb-6 mt-12 space-y-3">
        <Skeleton className="rounded-lg w-2/3 md:w-1/3 h-10" />
        <Skeleton className="rounded-lg w-1/2 md:w-1/4 h-6" />
      </div>

      {/* Calculator Skeleton */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="rounded-lg w-1/3 h-8" />
          <Skeleton className="rounded-full w-10 h-10" />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="rounded-lg w-full h-14" />
          <Skeleton className="rounded-lg w-full h-14" />
        </div>
        <Skeleton className="rounded-lg w-full h-12 mt-4" />
      </Card>

      {/* KPI Cards Skeleton */}
      <div className="flex flex-col md:flex-row gap-4">
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            className="flex flex-col w-full md:w-1/3 border p-6 space-y-4"
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="rounded-xl w-10 h-10" />
                <Skeleton className="rounded-lg w-16 h-8" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="rounded-lg w-24 h-10" />
              <Skeleton className="rounded-lg w-32 h-4" />
            </div>
          </Card>
        ))}
      </div>

      {/* Search Section Skeleton */}
      <Card className="p-8 gap-6 border">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="rounded-full w-10 h-10" />
          <Skeleton className="rounded-lg w-1/3 h-8" />
        </div>
        <div className="w-full h-px bg-default-200 mb-6" />{" "}
        {/* Separator simulation */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="rounded-lg w-full h-14" />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="rounded-lg w-full h-14" />
          </div>
          <Skeleton className="rounded-lg w-full md:w-auto h-14" />
        </div>
      </Card>
    </div>
  );
}
