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

      {/* Cookie Popup */}
      {/* {showPopup && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={handleDecline}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 goldman-regular">
                {policy?.title}
              </h2>

              <p className="text-gray-600 leading-relaxed font-ubuntu">
                We use cookies to enhance your browsing experience and analyze
                our traffic. By clicking <strong>"Accept"</strong>, you consent
                to our use of cookies.
              </p>
            </div>

            <div className="flex gap-3 font-ubuntu">
              <button
                onClick={handleAccept}
                className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              >
                Accept
              </button>

              <button
                onClick={handleDecline}
                className="flex-1 bg-white hover:bg-gray-50 text-cyan-400 font-medium py-3 px-6 rounded-xl border-2 border-cyan-400 transition-all duration-200 hover:scale-105"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}