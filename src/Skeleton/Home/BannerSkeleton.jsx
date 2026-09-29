
import React from "react";

const BannerSkeleton = () => {
  return (
    <section
      className="
        relative w-full
        h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh]
        flex items-center justify-center
        bg-gray-300 animate-pulse
      "
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content Skeleton */}
      <div
        className="
          relative z-10
          w-full max-w-[1200px]
          mx-auto
          px-4 sm:px-6 md:px-8 lg:px-16
          text-center
        "
      >
        {/* Title Skeleton */}
        <div
          className="
            h-8 sm:h-9 md:h-12 lg:h-14
            w-52 sm:w-64 md:w-80 lg:w-96
            bg-gray-400
            rounded
            mx-auto
          "
        ></div>

        {/* Breadcrumb Skeleton */}
        <div
          className="
            h-3 sm:h-4
            w-32 sm:w-40
            bg-gray-400
            rounded
            mx-auto
            mt-3 sm:mt-4
          "
        ></div>
      </div>
    </section>
  );
};

export default BannerSkeleton;
