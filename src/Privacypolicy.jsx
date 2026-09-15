import React, { useState } from "react";
import { X } from "lucide-react";
import { useGetprivacyPolicyQuery } from "./Redux/api/publicApiSlice";
import PrivacyPolicySkeleton from "./Skeleton/Policy/PrivacyPolicySkeleton";

export default function Privacypolicy() {
  const [showPopup, setShowPopup] = useState(true);

  const { data, isLoading, isError } = useGetprivacyPolicyQuery();

  const policy = data?.data;

  const handleAccept = () => {
    setShowPopup(false);
    document.cookie = "termsAccepted=true; max-age=31536000; path=/";
  };

  const handleDecline = () => {
    setShowPopup(false);
  };

  if (isLoading) {
    return <PrivacyPolicySkeleton />;
  }

  if (isError || !policy?.status) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Title */}
          <h1 className="text-4xl font-bold text-[#1a2332] text-center goldman-regular">
            {policy?.title}
          </h1>

          {/* Content */}
          <div
            className="mt-8 prose prose-lg max-w-none font-ubuntu text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: policy?.content?.replace(/\r?\n/g, "<br />"),
            }}
          />
        </div>
      </main>

    
    </div>
  );
}