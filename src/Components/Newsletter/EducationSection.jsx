import React from "react";
import { useGetBlogQuery } from "../../Redux/api/publicApiSlice";
import { Link } from "react-router-dom";


const EducationSection = () => {
  const { data, isLoading } = useGetBlogQuery();

  const educationList = data?.data?.education || [];

  const featuredItems = educationList.slice(0, 2);
  const normalItems = educationList.slice(2);

  if (isLoading) {
    return (
      <div className="w-full bg-white px-6 py-10">
        <div className="max-w-7xl mx-auto px-4 animate-pulse">
          <div className="h-10 w-48 bg-gray-200 mb-8"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="h-[550px] bg-gray-200 rounded-xl lg:col-span-2"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!educationList.length) return null;

  return (
    <div className="w-full bg-white px-6 py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl roboto-bold text-[#4A4A4A] inline-block">
            Education
          </h1>
          <div className="mt-2 h-[1px] w-full bg-[#D4D7DC]" />
          <div className="h-0.5 w-20 bg-[#2A57C4] rounded-full" />
        </div>

        {/* 🔹 Top Featured Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className={`relative rounded-xl overflow-hidden ${index === 0 ? "lg:col-span-2" : ""
                }`}
            >
              {/* Image */}
              <Link to={`/NewDetails/${item.slug}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105 ${index === 0 ? "h-[550px]" : "h-96"
                    }`}
                />
              </Link>

              {/* Content */}
              {index === 0 ? (
                <div className="absolute bottom-8 left-0 w-full p-6">
                  <h3 className="text-2xl text-white mb-3 roboto-bold drop-shadow">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/90 mb-3 drop-shadow">
                    {item.post_date} | {item.author_name}
                  </p>
                  <p className="text-white/90 text-xs drop-shadow">
                    {item.long_description}
                  </p>
                </div>
              ) : (
                <div className="p-4">
                  <h3 className="text-lg text-gray-900 mb-1 roboto-bold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {item.post_date} | {item.author_name}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {item.long_description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 🔹 Bottom Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {normalItems.map((item) => (
          <div key={item.id} className="rounded-xl overflow-hidden h-full flex flex-col">
          <Link to={`/NewDetails/${item.slug}`}>
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-64 object-cover rounded-2xl cursor-pointer"
            />
          </Link>
        
          <div className="p-4 flex flex-col h-full">
            <h3 className="text-lg text-gray-900 mb-1 roboto-bold">
              {item.title}
            </h3>
        
            <p className="text-sm text-gray-500 mb-2">
              {item.post_date} | {item.author_name}
            </p>
        
            <p className="text-gray-700 text-sm mb-3 line-clamp-3">
              {item.long_description}
            </p>
        
            <a
              href={`/arbutus-web/NewDetails/${item.slug}`}
              className="mt-auto text-[#2A57C4] text-sm underline font-medium"
            >
              Read More
            </a>
          </div>
        </div>
        
          ))}
        </div>

      </div>
    </div>
  );
};

export default EducationSection;
