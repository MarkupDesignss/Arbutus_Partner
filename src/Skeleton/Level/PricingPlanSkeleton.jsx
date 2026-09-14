import React from "react";

const PricingPlanSkeleton = () => {
  return (
    <div className="min-h-screen py-12 px-4 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-10">
          <div className="h-10 w-80 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-[500px] bg-gray-200 rounded mx-auto"></div>
        </div>

        {/* Toggle Skeleton */}
        <div className="flex justify-center mb-16">
          <div className="h-12 w-64 bg-gray-200 rounded-full"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-gray-200 p-8"
            >
              {/* Title */}
              <div className="h-6 w-32 bg-gray-200 rounded mb-3"></div>

              {/* Description */}
              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-6"></div>

              {/* Price */}
              <div className="h-10 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-6"></div>

              {/* Features (ONLY 3 as you wanted) */}
              <div className="space-y-3 mb-8">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
              </div>

              {/* Button */}
              <div className="h-12 w-full bg-gray-200 rounded-lg"></div>

              {/* Footer text */}
              <div className="h-4 w-48 bg-gray-200 rounded mx-auto mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlanSkeleton;
