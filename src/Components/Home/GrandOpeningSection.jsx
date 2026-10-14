import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Poppins font stack
const POPPINS = "'Poppins', sans-serif";

const FALLBACK_IMAGE =
  "/arbutus-web/assets/Home/GrandOpeningSection/GrandOpeningSection.png";

const GrandOpeningSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showMore, setShowMore] = useState(false);

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
          "https://www.markupdesigns.net/arbutus-partner/api/pages/grand_opening_remarks"
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

  // =========================================================
  // ANIMATION
  // =========================================================
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // =========================================================
  // API DATA
  // =========================================================
  const page = data?.data || null;

  const pageTitle = page?.title || "Grand Opening Remarks";
  const pageContentHTML = page?.content || "";
  const sections = page?.sections || [];

  const heroSection = sections[0] || null;

  const heroImage =
    heroSection?.images?.[0] || FALLBACK_IMAGE;

  // =========================================================
  // PARSE API HTML CONTENT
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

      if (!text || text === "\u00a0") return;

      const isCallout = p.querySelector("strong") !== null;

      result.push({ html, text, isCallout });
    });

    return result;
  })();

  // =========================================================
  // COLUMN SPLIT
  // =========================================================
  const firstColumnContent = parsedParagraphs.slice(0, 4);
  const visibleFirstColumn = firstColumnContent.slice(0, 3);
  const hiddenFirstColumn = firstColumnContent.slice(3);

  const secondColumnContent = parsedParagraphs.slice(4);

  // =========================================================
  // COMMON TEXT CLASS
  // =========================================================
  const textClass =
    "text-[#1d3557] text-[12.5px] sm:text-[13px] leading-[1.75]";

  // =========================================================
  // PARAGRAPH RENDER
  // =========================================================
  const renderParagraph = (para, index) => {
    const isFutureGrowth =
      para.text.toLowerCase().includes("future growth") ||
      para.text.toLowerCase().includes("$14 trillion");

    if (isFutureGrowth) {
      return (
        <motion.div
          key={index}
          variants={itemVariants}
          className="relative pl-4 py-2 border-l-[3px] border-[#2A57C4] bg-blue-50/50 rounded-none"
        >
          <p
            className={`${textClass} font-medium`}
            style={{ fontFamily: POPPINS, fontWeight: 500 }}
            dangerouslySetInnerHTML={{ __html: para.html }}
          />
        </motion.div>
      );
    }

    return (
      <motion.p
        key={index}
        variants={itemVariants}
        className={textClass}
        style={{ fontFamily: POPPINS, fontWeight: 400 }}
        dangerouslySetInnerHTML={{ __html: para.html }}
      />
    );
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (isLoading) {
    return (
      <section
        className="w-full bg-gradient-to-b from-white to-gray-50 py-10 lg:py-14 overflow-hidden"
        style={{ fontFamily: POPPINS }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-6 w-40 bg-gray-200 rounded-none mx-auto mb-5" />
            <div className="h-10 w-80 bg-gray-200 rounded-none mx-auto mb-4" />
            <div className="h-[3px] w-24 bg-gray-200 mx-auto mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              <div className="h-[430px] space-y-4 bg-white border border-gray-100 rounded-none p-6">
                <div className="h-4 bg-gray-200 rounded-none" />
                <div className="h-4 bg-gray-200 rounded-none" />
                <div className="h-4 w-10/12 bg-gray-200 rounded-none" />
                <div className="h-4 bg-gray-200 rounded-none" />
                <div className="h-4 w-11/12 bg-gray-200 rounded-none" />
              </div>

              <div className="h-[430px] space-y-4 bg-white border border-gray-100 rounded-none p-6">
                <div className="h-4 bg-gray-200 rounded-none" />
                <div className="h-4 bg-gray-200 rounded-none" />
                <div className="h-4 w-10/12 bg-gray-200 rounded-none" />
                <div className="h-4 bg-gray-200 rounded-none" />
                <div className="h-20 bg-gray-200 rounded-none" />
              </div>

              <div className="h-[430px] bg-gray-200 rounded-none" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================
  if (isError || !page) {
    return (
      <section
        className="w-full bg-gradient-to-b from-white to-gray-50 py-16"
        style={{ fontFamily: POPPINS }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p
            className="text-gray-500 text-[13px]"
            style={{ fontFamily: POPPINS, fontWeight: 400 }}
          >
            Unable to load Grand Opening content. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full bg-gradient-to-b from-white to-gray-50 py-8 lg:py-10 overflow-hidden"
      style={{ fontFamily: POPPINS }}
    >
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col"
        >
          {/* =====================================================
              TOP HEADING
          ===================================================== */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center text-center mb-7 lg:mb-9"
          >
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-blue-50 border border-blue-100 rounded-none text-[10.5px] sm:text-[11px] font-semibold uppercase text-blue-600 mb-3"
              style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.14em" }}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {heroSection?.heading || "Grand Opening"}
            </span>

            <h2
              className="text-[22px] md:text-[28px] lg:text-[32px] font-bold text-gray-900 tracking-tight leading-tight"
              style={{ fontFamily: POPPINS, fontWeight: 700 }}
            >
              {pageTitle}
            </h2>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: inView ? "96px" : 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="h-[3px] rounded-none bg-gradient-to-r from-blue-500 to-purple-500 mt-3.5"
            />
          </motion.div>

          {/* =====================================================
              3 COLUMN GRID
          ===================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* ===================================================
                COLUMN 1
            =================================================== */}
            <motion.div variants={itemVariants} className="min-w-0 flex">
              <div className="relative rounded-none bg-white border border-gray-100 shadow-sm p-5 lg:p-6 w-full flex flex-col">
                <div className="hidden lg:block absolute left-0 top-5 w-[3px] h-12 rounded-none bg-gradient-to-b from-blue-500 to-purple-500" />

                <div className="space-y-3">
                  {visibleFirstColumn.map((para, index) =>
                    renderParagraph(para, index)
                  )}

                  <motion.div
                    initial={false}
                    animate={{
                      height: showMore ? "auto" : 0,
                      opacity: showMore ? 1 : 0,
                    }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-1 space-y-3">
                      {hiddenFirstColumn.map((para, index) =>
                        renderParagraph(para, index + 10)
                      )}
                    </div>
                  </motion.div>

                  {hiddenFirstColumn.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowMore((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 mt-1 text-[11.5px] font-semibold text-[#2A57C4] hover:text-[#173F9A] transition-colors duration-200 border-b border-[#2A57C4] pb-[2px]"
                      style={{ fontFamily: POPPINS, fontWeight: 600 }}
                    >
                      {showMore ? "Read Less" : "Read More"}
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          showMore ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m6 9 6 6 6-6"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ===================================================
                COLUMN 2
            =================================================== */}
            <motion.div variants={itemVariants} className="min-w-0 flex">
              <div className="rounded-none bg-white border border-gray-100 shadow-sm p-5 lg:p-6 w-full flex flex-col">
                <div className="space-y-4">
                  {secondColumnContent.length > 0 ? (
                    secondColumnContent.map((para, index) =>
                      renderParagraph(para, index + 20)
                    )
                  ) : (
                    <>
                      <p
                        className={textClass}
                        style={{ fontFamily: POPPINS, fontWeight: 400 }}
                      >
                        Why Alternative funds matter more than ever before.
                        There is a growing consensus that public market returns
                        may be constrained resulting in a lost decade.
                      </p>

                      <p
                        className={textClass}
                        style={{ fontFamily: POPPINS, fontWeight: 400 }}
                      >
                        Through democratised finance, all investors and
                        allocators can access liquid alternative (public)
                        funds, and those investors who are an eligible
                        investor, accredited investor, or have an advisor
                        that is a registered portfolio manager, have a wide
                        and growing array of offering memorandum based
                        (private) funds for investment consideration.
                      </p>

                      <div className="relative pl-4 py-2 border-l-[3px] border-[#2A57C4] bg-blue-50/50 rounded-none">
                        <p
                          className={`${textClass} font-medium`}
                          style={{ fontFamily: POPPINS, fontWeight: 500 }}
                        >
                          Future growth expectations: the global alternatives
                          market quadrupled to $10 Trillion since 2007, and is
                          expected to reach $14 Trillion by 2030 (Source:
                          Holden).
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ===================================================
                COLUMN 3 - IMAGE
            =================================================== */}
            <motion.div
              variants={imageVariants}
              className="relative w-full min-w-0 flex"
            >
              <div className="relative overflow-hidden rounded-none shadow-lg group w-full h-[320px] sm:h-[380px] lg:h-[430px]">
                <img
                  src={heroImage}
                  alt={pageTitle}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/70" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/70" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-white/60" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-white/60" />
              </div>
            </motion.div>
          </div>

          {/* =====================================================
              SECONDARY IMAGES
          ===================================================== */}
          {sections[1]?.images?.length > 0 && (
            <motion.div variants={itemVariants} className="mt-10 lg:mt-12">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-[2px] bg-[#2A57C4]" />
                <span
                  className="text-[11.5px] font-semibold text-[#2A57C4] uppercase"
                  style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.22em" }}
                >
                  {sections[1]?.heading || "Gallery"}
                </span>
              </div>

              <div
                className={`grid gap-4 ${
                  sections[1].images.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {sections[1].images.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-none shadow-lg group"
                  >
                    <img
                      src={img}
                      alt={`${sections[1]?.heading || "Section"} ${index + 1}`}
                      className="w-full h-[220px] sm:h-[260px] lg:h-[320px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
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