import React, { useEffect, useState } from "react";
import { useGetBannersQuery } from "../../Redux/api/publicApiSlice";

const HomeHero = () => {
  const { data } = useGetBannersQuery();
  const banners = data?.data || [];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [banners]);

  const goToSlide = (i) => {
    setIndex(i);
  };

  return (
    <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] overflow-hidden">
      {/* SLIDES WRAPPER */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((item, i) => (
          <div
            key={i}
            className="w-full h-full flex-shrink-0 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            {/* Optional: Gradient overlay for better text readability */}
            <div className="absolute inset-0 to-transparent lg:hidden" />
          </div>
        ))}
      </div>

      {/* DOTS - Responsive positioning and sizing */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer
              hover:opacity-80 ${
              index === i
                ? "w-6 sm:w-8 bg-[#2A57C4]"
                : "w-3 sm:w-4 bg-[#D2D2D2]"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Optional: Navigation Arrows for Desktop */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="hidden lg:flex absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 
              w-10 h-10 items-center justify-center rounded-full 
              bg-white/80 hover:bg-white shadow-lg
              transition-all duration-200 z-10 group"
            aria-label="Previous slide"
          >
            <svg
              className="w-6 h-6 text-gray-800 group-hover:text-[#2A57C4] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => setIndex((prev) => (prev + 1) % banners.length)}
            className="hidden lg:flex absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 
              w-10 h-10 items-center justify-center rounded-full 
              bg-white/80 hover:bg-white shadow-lg
              transition-all duration-200 z-10 group"
            aria-label="Next slide"
          >
            <svg
              className="w-6 h-6 text-gray-800 group-hover:text-[#2A57C4] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
};

export default HomeHero;