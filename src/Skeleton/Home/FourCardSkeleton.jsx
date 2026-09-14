import React from "react";

const FourCardSkeleton = () => {
  return (
    <section className="bg-white py-2 animate-pulse">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white border-2 border-blue-200 rounded-xl p-6
                         flex flex-col h-full"
            >
              {/* Icon Skeleton */}
              <div className="w-8 h-8 bg-gray-300 rounded mb-4"></div>

              {/* Title Skeleton */}
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-3"></div>

              {/* Description Skeleton */}
              <div className="space-y-2 flex-grow">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-11/12"></div>
                <div className="h-3 bg-gray-200 rounded w-10/12"></div>
              </div>

              {/* Link Skeleton */}
              <div className="h-3 bg-gray-300 rounded w-20 mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourCardSkeleton;
