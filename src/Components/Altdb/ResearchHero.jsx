import React from "react";
import { useGetWebBannersQuery } from "../../Redux/api/publicApiSlice";
import { Link } from "react-router-dom";
import BannerSkeleton from "../../Skeleton/Home/BannerSkeleton";

const ResearchHero = () => {
  const { data, isLoading, isError } = useGetWebBannersQuery();

  if (isLoading) {
    return (
      <section className="relative w-full h-[40vh] md:h-[60vh]">
        <BannerSkeleton />
      </section>
    );
  }

  if (isError || !data?.data) {
    return (
      <section className="relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center">
        <p className="text-red-500">Banner not found</p>
      </section>
    );
  }

  const AltdbPage = data.data.find(
    (page) => page.slug === "alt-db"
  );

  const bannerImage =
    AltdbPage?.banner_image;

  const pageTitle = AltdbPage?.title || "Altdb";


  return (
    <section
      className="
        relative w-full 
        h-[40vh] sm:h-[45vh] md:h-[60vh]
        bg-cover bg-center 
        flex items-center justify-center
      "
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#111431]/40"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        <h1
          className="
            text-center text-white 
            text-xl sm:text-2xl md:text-4xl lg:text-5xl 
            font-bold font-roboto
          "
        >
          {pageTitle}
        </h1>

        <p
          className="
            text-center text-white 
            mt-1 sm:mt-2 
            text-xs sm:text-sm md:text-base 
            font-roboto
          "
        >
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          / {pageTitle}
        </p>
      </div>
    </section>
  );
};

export default ResearchHero;
