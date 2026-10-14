import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Poppins font stack
const POPPINS = "'Poppins', sans-serif";

const AlternativeInvesting = () => {
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
          "https://www.markupdesigns.net/arbutus-partner/api/pages/alternative_investing_literacy_terms_and_definitions",
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const json = await response.json();

        if (isMounted) {
          setData(json);
        }
      } catch (error) {
        console.error("Alternative Investing fetch error:", error);
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // =========================================================
  // PARSE API DATA
  // =========================================================
  const page = data?.data || null;
  const sections = page?.sections || [];

  const heroSection = sections[0] || null;

  const termData = sections.slice(1).map((section, index) => ({
    id: section?.id ?? index,
    term: section?.heading || `Term ${index + 1}`,
    definition: section?.data || "",
    image: section?.images?.[0] || null,
    label: section?.label || "Term",
    number: String(index + 1).padStart(2, "0"),
  }));

  // Helper: render HTML definition safely
  const renderHTML = (htmlContent) => {
    if (!htmlContent) return null;
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  // Strip HTML for plain-text preview
  const stripHTML = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // =========================================================
  // LOADING SKELETON
  // =========================================================
  if (isLoading) {
    return (
      <section
        className="relative py-12 md:py-20 bg-gradient-to-b from-white via-[#F8FAFF] to-[#EFF4FF] overflow-hidden"
        style={{ fontFamily: POPPINS }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="animate-pulse">
            <div className="h-4 w-48 bg-gray-200 mx-auto mb-5" />
            <div className="h-10 w-96 bg-gray-200 mx-auto mb-4" />
            <div className="h-4 w-64 bg-gray-200 mx-auto mb-14" />
            <div className="h-[280px] bg-gray-200 mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200" />
              <div className="h-64 bg-gray-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR / EMPTY STATE
  // =========================================================
  if (isError || !page) {
    return (
      <section
        className="relative py-12 md:py-20 bg-gradient-to-b from-white via-[#F8FAFF] to-[#EFF4FF]"
        style={{ fontFamily: POPPINS }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <p
            className="text-gray-500 text-[13px]"
            style={{ fontFamily: POPPINS, fontWeight: 400 }}
          >
            Unable to load Alternative Investing content. Please try again
            later.
          </p>
        </div>
      </section>
    );
  }

  // =========================================================
  // HERO VALUES
  // =========================================================
  const heroImage =
    heroSection?.images?.[0] ||
    "/arbutus-web/assets/Home/AlternativeInvesting/Alternative.png";

  const heroHeading =
    heroSection?.heading ||
    page?.title ||
    "Alternative Investing Literacy – Terms and Definitions";

  return (
    <section
      className="relative py-8 md:py-12 bg-gradient-to-b from-white via-[#F8FAFF] to-[#EFF4FF] overflow-hidden"
      style={{ fontFamily: POPPINS }}
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-[#2A57C4]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-[#7C3AED]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-7 h-[2px] bg-[#2A57C4]" />
            <span
              className="text-[10.5px] font-semibold text-[#2A57C4] uppercase"
              style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.22em" }}
            >
              Alternative Investing
            </span>
            <span className="w-7 h-[2px] bg-[#2A57C4]" />
          </div>

          <h2
            className="text-[22px] md:text-[28px] lg:text-[32px] font-bold leading-tight text-gray-900 tracking-tight"
            style={{ fontFamily: POPPINS, fontWeight: 700 }}
          >
            {heroHeading.includes("–") ? (
              <>
                {heroHeading.split("–")[0].trim()}
                <br className="hidden sm:block" />
                <span className="text-[#2A57C4]">
                  {" "}
                  {heroHeading.split("–").slice(1).join("–").trim()}
                </span>
              </>
            ) : (
              heroHeading
            )}
          </h2>

          <p
            className="mt-3 text-gray-500 text-[13px] md:text-[14px] max-w-2xl mx-auto leading-snug"
            style={{ fontFamily: POPPINS, fontWeight: 400 }}
          >
            A quick reference for the concepts that shape modern alternative
            portfolios.
          </p>
        </motion.div>

        {/* =====================================================
            TOP HERO IMAGE
        ===================================================== */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mb-10 lg:mb-14"
        >
          <div className="relative overflow-hidden shadow-xl group">
            <img
              src={heroImage}
              alt={heroHeading}
              className="w-full h-[220px] sm:h-[280px] lg:h-[340px] object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "/arbutus-web/assets/Home/AlternativeInvesting/Alternative.png";
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 flex flex-col gap-1">
              <span
                className="text-[10px] font-semibold uppercase text-white/80"
                style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.22em" }}
              >
                Knowledge Base
              </span>
              <span
                className="text-white text-[13px] sm:text-[14px] font-medium"
                style={{ fontFamily: POPPINS, fontWeight: 500 }}
              >
                Building fluency in alternatives, one term at a time.
              </span>
            </div>

            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/70" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/70" />

            <div
              className="absolute top-4 right-4 bg-white shadow-lg px-3 py-1.5 flex items-center gap-2"
              style={{ fontFamily: POPPINS }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span
                className="text-[10px] font-semibold text-gray-700 uppercase"
                style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.06em" }}
              >
                Live Data
              </span>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            TERMS — GRID FORM
        ===================================================== */}
        {termData.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {termData.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="relative group h-full"
              >
                <span
                  className="
                    absolute -top-8 -left-2
                    text-[100px] md:text-[120px]
                    font-bold text-[#2A57C4]/[0.06]
                    leading-none select-none pointer-events-none
                  "
                  style={{ fontFamily: POPPINS, fontWeight: 700 }}
                >
                  {item.number}
                </span>

                <div
                  className="
                    relative h-full flex flex-col
                    bg-white/90 backdrop-blur-sm
                    border border-gray-100
                    p-6 md:p-7
                    shadow-sm hover:shadow-xl
                    transition-all duration-300
                    group-hover:-translate-y-1
                  "
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2A57C4] to-[#7C3AED]" />

                  <div className="pl-4 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3.5 flex-wrap">
                      <span
                        className="
                          text-[10px] font-semibold uppercase
                          text-[#2A57C4] bg-[#E6EDFF]
                          px-3 py-1
                        "
                        style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.18em" }}
                      >
                        {item.label || "Term"} {item.number}
                      </span>

                      <h3
                        className="text-[18px] md:text-[20px] font-bold text-gray-900 leading-tight"
                        style={{ fontFamily: POPPINS, fontWeight: 700 }}
                      >
                        {item.term}
                      </h3>
                    </div>

                    {item.image && (
                      <div className="mb-3.5 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.term}
                          className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <div className="mb-4 flex-1">
                      <span
                        className="block text-[10px] font-semibold text-gray-400 uppercase mb-1"
                        style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.18em" }}
                      >
                        Definition
                      </span>
                      <div
                        className="text-gray-700 text-[13px] leading-relaxed prose prose-sm max-w-none prose-p:text-[13px] prose-p:mb-2 prose-p:last:mb-0"
                        style={{ fontFamily: POPPINS, fontWeight: 400 }}
                      >
                        {renderHTML(item.definition)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div
            className="text-center text-gray-400 text-[13px] py-10"
            style={{ fontFamily: POPPINS }}
          >
            No terms available.
          </div>
        )}

        {/* =====================================================
            BOTTOM CTA LINE
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center justify-center gap-3 pt-10"
        >
          <span className="w-9 h-[2px] bg-[#2A57C4]" />
          <span
            className="text-[10.5px] font-semibold text-gray-400 uppercase"
            style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.22em" }}
          >
            More terms coming soon
          </span>
          <span className="w-9 h-[2px] bg-[#2A57C4]" />
        </motion.div>
      </div>
    </section>
  );
};

export default AlternativeInvesting;