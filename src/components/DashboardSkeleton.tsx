
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardSkeleton = () => {
  const isMobile = useIsMobile();
  return (
    <div className="max-w-7xl mx-auto animate-pulse">
      {/* Banner Skeleton */}
      <div className="rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-water-light dark:border-slate-800 mb-8 px-6 py-8 flex items-center gap-5">
        <Skeleton className="h-24 w-24 rounded-full hidden sm:block bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-3/4 max-w-sm bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-6 w-full max-w-md bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className={`grid gap-4 mb-10 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-water-light dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 hover:shadow-none hover:-translate-y-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-3 w-24 bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Documents Skeleton */}
      <Card className="border-water-light dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 shadow-none rounded-2xl hover:shadow-none hover:-translate-y-0">
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
          <Skeleton className="h-7 w-48 bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-8 w-24 bg-slate-200 dark:bg-slate-700" />
        </CardHeader>
        <CardContent className="space-y-3 pt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-10 w-10 rounded-md flex-shrink-0 bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSkeleton;
