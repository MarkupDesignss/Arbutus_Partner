import React from "react";

const NewsCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-lg h-64 bg-gray-200 animate-pulse">
      {/* Image placeholder */}
      <div className="absolute inset-0 bg-gray-300"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>

      {/* Text placeholders */}
      <div className="relative h-full flex flex-col justify-end p-6 space-y-3">
        <div className="h-5 w-3/4 bg-gray-400 rounded"></div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-20 bg-gray-400 rounded"></div>
          <div className="h-3 w-1 bg-gray-400 rounded"></div>
          <div className="h-3 w-24 bg-gray-400 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const NewsGridSkeleton = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading skeleton */}
        <div className="mb-8">
          <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="mt-2 h-[1px] w-full bg-gray-300"></div>
          <div className="h-0.5 w-20 bg-gray-400 rounded-full mt-1"></div>
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <NewsCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsGridSkeleton;
