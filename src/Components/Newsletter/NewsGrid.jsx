import React from "react";
import { useGetBlogQuery } from "../../Redux/api/publicApiSlice";
import NewsGridSkeleton from "../../Skeleton/Blogs/NewsGridSkeleton";
import { Link } from "react-router-dom";


const NewsCard = ({ image, title, date, author, slug }) => (
  <Link to={`/NewDetails/${slug}`}>
    <div className="relative overflow-hidden rounded-lg group cursor-pointer h-64">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 "
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      <div className="relative h-full flex flex-col justify-end p-6">
        <h3 className="text-white text-lg mb-3 leading-tight roboto-bold">
          {title}
        </h3>
        <div className="flex items-center roboto-regular text-white/80 text-xs">
          <span>{date}</span>
          <span className="mx-2">|</span>
          <span>By {author}</span>
        </div>
      </div>
    </div>
  </Link>
);


const NewsGrid = () => {
  const { data, isLoading, isError } = useGetBlogQuery();

  const newsList = data?.data?.news || [];

  if (isLoading) {
    return (
      <NewsGridSkeleton />
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load news
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl roboto-bold text-[#4A4A4A] inline-block">
            News
          </h1>
          <div className="mt-2 h-[1px] w-full bg-[#D4D7DC]"></div>
          <div className="h-0.5 w-20 bg-[#2A57C4] rounded-full"></div>
        </div>

        {/* NEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <NewsCard
              key={news.id}
              image={news.image}
              title={news.title}
              slug={news.slug}
              date={new Date(news.post_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              author={news.author_name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsGrid;
