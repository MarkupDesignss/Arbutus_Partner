import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const GrandOpeningSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // =========================================================
  // FETCH API DATA
  // =========================================================
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const response = await fetch(
          "https://www.markupdesigns.net/arbutus-partner/api/pages/grand_opening_remarks",
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const json = await response.json();

        if (isMounted) {
          setData(json);
        }
      } catch (error) {
        console.error("Grand Opening fetch error:", error);
        if (isMounted) {
          setIsError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  // =========================================================
  // PARSE API DATA
  // =========================================================
  const page = data?.data || null;
  const pageTitle = page?.title || "Grand Opening Remarks";
  const pageContentHTML = page?.content || "";
  const sections = page?.sections || [];

  // Hero section (first section with image)
  const heroSection = sections[0] || null;
  const heroImage =
    heroSection?.images?.[0] ||
    "/arbutus-web/assets/Home/GrandOpeningSection/GrandOpeningSection.png";

  // Secondary section (Section-1) with 2 images
  const secondarySection = sections[1] || null;
  const secondaryImages = secondarySection?.images || [];

  // =========================================================
  // PARSE HTML CONTENT INTO PARAGRAPHS
  // ---------------------------------------------------------
  // API returns HTML with <p> and <strong> tags.
  // We split into paragraphs and detect which are "callouts"
  // (they contain <strong>) vs regular paragraphs.
  // =========================================================
  const parsedParagraphs = (() => {
    if (!pageContentHTML) return [];

    const tmp = document.createElement("div");
    tmp.innerHTML = pageContentHTML;

    const result = [];
    const paragraphs = tmp.querySelectorAll("p");

    paragraphs.forEach((p) => {
      const html = p.innerHTML.trim();
      const text = p.textContent.trim();

      // Skip empty paragraphs (just &nbsp;)
      if (!text || text === "\u00a0") return;

      // Check if this paragraph is a "callout" (contains <strong>)
      const isCallout = p.querySelector("strong") !== null;

      result.push({
        html,
        text,
        isCallout,
      });
    });

    return result;
  })();

  // =========================================================
  // LOADING SKELETON
  // =========================================================
  if (isLoading) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-6 w-40 bg-gray-200 mx-auto mb-6" />
            <div className="h-10 w-80 bg-gray-200 mx-auto mb-4" />
            <div className="h-[3px] w-24 bg-gray-200 mx-auto mb-12" />
            <div className="h-[340px] bg-gray-200 mb-12" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200" />
                <div className="h-4 bg-gray-200" />
                <div className="h-4 w-3/4 bg-gray-200" />
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200" />
                <div className="h-4 bg-gray-200" />
                <div className="h-4 w-2/3 bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================
  if (isError || !page) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            Unable to load Grand Opening content. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-8 lg:py-8 roboto-regular overflow-hidden">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col"
        >
          {/* =====================================================
              TOP BADGE + HEADING (centered, editorial)
          ===================================================== */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-600 mb-4">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {heroSection?.heading || "Grand Opening"}
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black roboto-bold tracking-tight">
              {pageTitle}
            </h2>

            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: "96px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-[3px] bg-gradient-to-r from-blue-500 to-purple-500 mt-4"
            />
          </motion.div>

          {/* =====================================================
              FULL-WIDTH HERO IMAGE
          ===================================================== */}
          <motion.div
            variants={imageVariants}
            className="relative w-full mb-12 lg:mb-16"
          >
            <div className="relative overflow-hidden shadow-xl group">
              <motion.img
                src={heroImage}
                alt={pageTitle}
                className="w-full h-[260px] sm:h-[340px] lg:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "/arbutus-web/assets/Home/GrandOpeningSection/GrandOpeningSection.png";
                }}
              />

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />

              {/* Caption inside image */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-auto flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                  Est. 2025
                </span>
                <span className="text-white text-sm sm:text-base font-medium">
                  A new chapter in alternative fund discovery.
                </span>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/70" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/70" />
            </div>

            {/* =================================================
                OVERLAPPING STAT CARD
            ================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              whileHover={{ y: -4 }}
              className="
                absolute -bottom-6 right-4 sm:right-8
                bg-white shadow-2xl border border-gray-100
                px-5 py-4 min-w-[210px]
                hidden sm:block
              "
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Global Alt Market
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    $14 Trillion{" "}
                    <span className="text-[10px] font-medium text-gray-500">
                      by 2030
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* =====================================================
              TEXT CONTENT (from API content, split into 2 cols)
          ===================================================== */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
          >
            {/* LEFT: vertical accent + first half of paragraphs */}
            <div className="lg:col-span-5 flex gap-4">
              <div className="hidden lg:flex flex-col items-center pt-1">
                <div className="w-[3px] h-16 bg-gradient-to-b from-blue-500 to-purple-500" />
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400 mt-3"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  Perspective
                </span>
              </div>

              <div className="space-y-4">
                {parsedParagraphs
                  .slice(0, Math.ceil(parsedParagraphs.length / 2))
                  .map((para, index) => {
                    if (para.isCallout) {
                      return (
                        <div
                          key={index}
                          className="bg-blue-50 border-l-4 border-blue-500 p-4"
                        >
                          <p
                            className="text-gray-800 font-medium text-[14px]"
                            dangerouslySetInnerHTML={{
                              __html: para.html,
                            }}
                          />
                        </div>
                      );
                    }

                    return (
                      <p
                        key={index}
                        className="text-gray-700 leading-relaxed text-[15px]"
                        dangerouslySetInnerHTML={{ __html: para.html }}
                      />
                    );
                  })}
              </div>
            </div>

            {/* RIGHT: second half of paragraphs */}
            <div className="lg:col-span-7 space-y-5">
              {parsedParagraphs
                .slice(Math.ceil(parsedParagraphs.length / 2))
                .map((para, index) => {
                  if (para.isCallout) {
                    // The "Future growth expectations" callout gets
                    // a distinct purple/pink treatment
                    const isFutureGrowth =
                      para.text.toLowerCase().includes("future growth") ||
                      para.text.toLowerCase().includes("$14 trillion");

                    if (isFutureGrowth) {
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ y: -3 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                          }}
                          className="
                            bg-gradient-to-r from-purple-50 to-pink-50
                            p-5 border border-purple-100
                            relative
                          "
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500" />
                          <p
                            className="text-gray-800 font-medium text-[14px] pl-2"
                            dangerouslySetInnerHTML={{
                              __html: para.html,
                            }}
                          />
                        </motion.div>
                      );
                    }

                    // Other callouts (e.g. "Why we built AltDB")
                    return (
                      <div
                        key={index}
                        className="bg-blue-50 border-l-4 border-blue-500 p-4"
                      >
                        <p
                          className="text-gray-800 font-medium text-[14px]"
                          dangerouslySetInnerHTML={{ __html: para.html }}
                        />
                      </div>
                    );
                  }

                  return (
                    <p
                      key={index}
                      className="text-gray-700 leading-relaxed text-[15px]"
                      dangerouslySetInnerHTML={{ __html: para.html }}
                    />
                  );
                })}
            </div>
          </motion.div>

          {/* =====================================================
              SECONDARY IMAGES (Section-1 with 2 images)
          ===================================================== */}
          {secondaryImages.length > 0 && (
            <motion.div variants={itemVariants} className="mt-14 lg:mt-20">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[2px] bg-[#2A57C4]" />
                <span className="text-[11px] font-semibold text-[#2A57C4] uppercase tracking-[0.25em]">
                  {secondarySection?.heading || "Gallery"}
                </span>
              </div>

              <div
                className={`grid gap-4 lg:gap-6 ${
                  secondaryImages.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {secondaryImages.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden shadow-lg group"
                  >
                    <img
                      src={img}
                      alt={`${secondarySection?.heading || "Section"} ${
                        index + 1
                      }`}
                      className="w-full h-[240px] sm:h-[280px] lg:h-[340px] object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default GrandOpeningSection;
