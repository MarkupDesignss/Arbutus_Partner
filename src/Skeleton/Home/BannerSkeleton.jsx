import React from "react";

const BannerSkeleton = () => {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center bg-gray-300 animate-pulse">
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content Skeleton */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-8 lg:px-16 text-center">
        
        {/* Title Skeleton */}
        <div className="h-10 md:h-14 w-64 md:w-96 bg-gray-400 rounded mx-auto"></div>

        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-40 bg-gray-400 rounded mx-auto mt-4"></div>
      </div>
    </section>
  );
};

export default BannerSkeleton;
