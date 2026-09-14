import React from "react";

export default function PrivacyPolicySkeleton() {
  return (
    <div className="bg-[#f5f1eb] min-h-screen">
      <main className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 animate-pulse">
          
          {/* Title Skeleton */}
          <div className="flex justify-center mb-6">
            <div className="h-7 w-40 bg-gray-200 rounded-lg" />
          </div>

          {/* Paragraph Skeletons */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-[95%]" />
            <div className="h-4 bg-gray-200 rounded w-[90%]" />

            <div className="h-4 bg-gray-200 rounded w-full mt-6" />
            <div className="h-4 bg-gray-200 rounded w-[92%]" />

            {/* Sub heading */}
            <div className="h-5 bg-gray-300 rounded w-48 mt-8" />

            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-[96%]" />
            <div className="h-4 bg-gray-200 rounded w-[88%]" />

            {/* Sub heading */}
            <div className="h-5 bg-gray-300 rounded w-48 mt-8" />

            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-[94%]" />
            <div className="h-4 bg-gray-200 rounded w-[90%]" />
          </div>
        </div>
      </main>
    </div>
  );
}
