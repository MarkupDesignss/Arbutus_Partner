import React, { useEffect, useRef } from "react";
import { useGetSponsersQuery } from "../../Redux/api/publicApiSlice";

export default function Collerbated() {
  const sliderRef = useRef(null);

  const { data, isLoading } = useGetSponsersQuery();
  const sponsors = data?.data?.filter(item => item.status === "1") || [];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || sponsors.length === 0) return;
    
    slider.innerHTML = slider.innerHTML;

    const clone = slider.innerHTML;
    slider.innerHTML += clone;

    let scrollPosition = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      scrollPosition += scrollSpeed;

      if (scrollPosition >= slider.scrollWidth / 2) {
        scrollPosition = 0;
      }

      slider.style.transform = `translateX(-${scrollPosition}px)`;
      requestAnimationFrame(scroll);
    };

    const animation = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animation);
  }, [sponsors]);

  if (isLoading) return null;

  return (
    <section className="w-full bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold mb-12 goldman-regular">
          Sponsors
        </h2>

        {/* Logos slider */}
        <div className="overflow-hidden">
          <div
            ref={sliderRef}
            className="flex gap-10 will-change-transform"
          >
            {sponsors.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-center min-w-[120px] flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={`Sponsor ${item.id}`}
                  className="h-12 md:h-14 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
