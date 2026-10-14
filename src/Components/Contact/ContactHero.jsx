import React from "react";
import { useGetWebBannersQuery } from "../../Redux/api/publicApiSlice";
import { Link } from "react-router-dom";
import BannerSkeleton from "../../Skeleton/Home/BannerSkeleton";

// Poppins font stack
const POPPINS = "'Poppins', sans-serif";

const ContactHero = () => {
  const { data, isError, isLoading } = useGetWebBannersQuery();

  if (isLoading) {
    return (
      <section className="relative w-full h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh]">
        <BannerSkeleton />
      </section>
    );
  }

  if (isError || !data?.data) {
    return (
      <section
        className="relative w-full h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh] flex items-center justify-center"
        style={{ fontFamily: POPPINS }}
      >
        <p
          className="text-red-500 text-[13px]"
          style={{ fontFamily: POPPINS, fontWeight: 500 }}
        >
          Banner not found
        </p>
      </section>
    );
  }

  const contactPage = data.data.find((page) =>
    page.title.toLowerCase() === "contact"
  );

  const bannerImage = contactPage?.banner_image;
  const pageTitle = contactPage?.title || "Contact";

  return (
    <section
      className="
        relative w-full 
        h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh]
        bg-cover bg-center 
        flex items-center justify-center
      "
      style={{
        backgroundImage: `url(${bannerImage})`,
        fontFamily: POPPINS,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#111431]/40"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        <h1
          className="
            text-center text-white 
            text-[22px] sm:text-[26px] md:text-[30px] lg:text-[34px] 
            font-bold tracking-tight leading-tight
          "
          style={{ fontFamily: POPPINS, fontWeight: 700 }}
        >
          {pageTitle}
        </h1>

        <p
          className="
            text-center text-white/85 
            mt-1.5 sm:mt-2 
            text-[12px] sm:text-[13px] md:text-[14px] 
          "
          style={{ fontFamily: POPPINS, fontWeight: 400 }}
        >
          <Link
            to="/"
            className="hover:underline underline-offset-4 transition-colors hover:text-white"
            style={{ fontFamily: POPPINS, fontWeight: 400 }}
          >
            Home
          </Link>{" "}
          / {pageTitle}
        </p>
      </div>
    </section>
  );
};

export default ContactHero;