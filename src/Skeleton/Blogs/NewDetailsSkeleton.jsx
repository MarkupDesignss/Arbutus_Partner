import React from 'react';

const SkeletonBox = ({ className }) => (
  <div
    className={`bg-slate-200 animate-pulse rounded ${className}`}
  />
);

export default function NewDetailsSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">

            {/* Header */}
            <div className="space-y-4">
              <SkeletonBox className="h-8 w-3/4" />
              <SkeletonBox className="h-4 w-1/3" />
              <SkeletonBox className="h-5 w-full" />
            </div>

            {/* Hero Image */}
            <SkeletonBox className="h-[350px] w-full rounded-2xl" />

            {/* Table of Contents */}
            <div className="bg-white p-4 space-y-3">
              <SkeletonBox className="h-6 w-1/2" />
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBox key={i} className="h-4 w-full" />
              ))}
            </div>

            {/* Article Section */}
            <div className="bg-white p-4 space-y-4">
              <SkeletonBox className="h-6 w-2/3" />
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBox key={i} className="h-4 w-full" />
              ))}
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">

            {/* Latest News Skeleton */}
            <div className="bg-white p-6 space-y-4">
              <SkeletonBox className="h-6 w-1/2" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <SkeletonBox className="w-20 h-20 rounded-lg" />
                  <SkeletonBox className="h-5 w-full" />
                </div>
              ))}
            </div>

            {/* Education Skeleton */}
            <div className="bg-white p-6 space-y-4">
              <SkeletonBox className="h-6 w-1/2" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <SkeletonBox className="w-20 h-20 rounded-lg" />
                  <SkeletonBox className="h-5 w-full" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
