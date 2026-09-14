import React from "react";
import { useGetBlogQuery } from "../../Redux/api/publicApiSlice";

const Newsletter = () => {
  const { data, isLoading } = useGetBlogQuery();

  const newsletter = data?.data?.news?.[0];

  if (isLoading) {
    return (
      <div className="w-full bg-white px-6 py-6">
        <div className="max-w-7xl mx-auto px-4 animate-pulse">
          <div className="h-10 w-64 bg-gray-200 mb-6"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="h-96 bg-gray-200 rounded-xl"></div>

            <div className="space-y-4">
              <div className="h-6 bg-gray-200 w-3/4"></div>
              <div className="h-4 bg-gray-200 w-1/2"></div>
              <div className="h-4 bg-gray-200 w-full"></div>
              <div className="h-4 bg-gray-200 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!newsletter) return null;

  const longDescription =
    newsletter.long_description?.split(/\r?\n\r?\n/) || [];

  const sideContent = longDescription.slice(0, 2);
  const bottomContent = longDescription.slice(2);

  return (
    <div className="w-full bg-white px-6 py-6">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl roboto-bold text-[#4A4A4A] inline-block">
            Newsletter
          </h1>
          <div className="mt-2 h-[1px] w-full bg-[#D4D7DC]"></div>
          <div className="h-0.5 w-20 bg-[#2A57C4] rounded-full"></div>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-10">

          {/* Left Image */}
          <div className="rounded-xl overflow-hidden shadow-md">
            <img
              src={newsletter.image}
              alt={newsletter.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Right Content */}
          <div>
            <h3 className="text-2xl text-gray-900 mb-1 roboto-bold">
              {newsletter.title}
            </h3>

            <p className="text-sm text-gray-500 mb-4 roboto-regular">
              {newsletter.post_date} · By {newsletter.author_name}
            </p>

            {/* Short + Partial Long Description */}
            <div className="text-gray-700 text-[15px] leading-relaxed roboto-regular space-y-3">
              <p>{newsletter.short_description}</p>

              {sideContent.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section – Remaining Long Description */}
        {bottomContent.length > 0 && (
          <div className="space-y-4 text-gray-700 text-[15px] leading-relaxed roboto-regular">
            {bottomContent.map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Newsletter;
