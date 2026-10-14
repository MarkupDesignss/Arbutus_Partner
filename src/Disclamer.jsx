import React from "react";
import PrivacyPolicySkeleton from "./Skeleton/Policy/PrivacyPolicySkeleton";
import { useGetDisClamerQuery } from "./Redux/api/publicApiSlice";

export default function Disclamer() {
  const { data, isLoading, isError } = useGetDisClamerQuery();

  const terms = data?.data;

  if (isLoading) {
    return <PrivacyPolicySkeleton />;
  }

  if (isError || !terms?.status) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-[#1a2332] text-center goldman-regular">
              {terms?.title}
            </h1>

            {/* HTML Content */}
            <div
              className="mt-6 prose prose-lg max-w-none font-ubuntu text-gray-700"
              dangerouslySetInnerHTML={{
                __html: terms?.content?.replace(/\r?\n/g, "<br />"),
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}