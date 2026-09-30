import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const GrandOpeningSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24 roboto-regular overflow-hidden">
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
              Grand Opening
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black roboto-bold tracking-tight">
              Grand Opening Remarks
            </h2>

            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: "96px" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-[3px] bg-gradient-to-r from-blue-500 to-purple-500 mt-4"
            />
          </motion.div>

          {/* =====================================================
              FULL-WIDTH HERO IMAGE (NOT side-by-side)
          ===================================================== */}
          <motion.div
            variants={imageVariants}
            className="relative w-full mb-12 lg:mb-16"
          >
            <div className="relative overflow-hidden shadow-xl group">
              {/* Image */}
              <motion.img
                src="/arbutus-web/assets/Home/GrandOpeningSection/GrandOpeningSection.png"
                alt="Grand Opening"
                className="w-full h-[260px] sm:h-[340px] lg:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />

              {/* Caption inside image (bottom-left) */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-auto flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                  Est. 2025
                </span>
                <span className="text-white text-sm sm:text-base font-medium">
                  A new chapter in alternative fund discovery.
                </span>
              </div>
            </div>

            {/* =================================================
                OVERLAPPING STAT CARD (unique touch)
                Sits at the bottom-right, slightly outside image
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
              TEXT CONTENT (below image, full width, 2-col reading)
          ===================================================== */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
          >
            {/* Left: vertical accent + lead paragraph */}
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
                <p className="text-gray-700 leading-relaxed text-[15px]">
                  In the past 30 years over open end fund investing in Canada,
                  the market has evolved from actively managed, to passive ETFs
                  (Exchange Traded Funds), to hedge funds, liquid alternatives,
                  and now private asset funds (private equity, private credit,
                  private real estate and more).
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-gray-800 font-medium text-[14px]">
                    Why we built AltDB. To go beyond the world of traditional
                    60/40 investing with improved confidence and awareness.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: continued paragraphs + stat callout */}
            <div className="lg:col-span-7 space-y-5">
              <p className="text-gray-700 leading-relaxed text-[15px]">
                <span className="text-gray-900 font-semibold">
                  Why alternative funds matter more than ever before.
                </span>{" "}
                There is a growing consensus that public market returns may be
                constrained resulting in a lost decade.
              </p>

              <p className="text-gray-700 leading-relaxed text-[15px]">
                Through democratised finance, all investors and allocators can
                access liquid alternative (public) funds, and those investors
                who are eligible or accredited have a wide and growing array of
                offering memorandum based (private) funds to chose from.
              </p>

              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="
                  bg-gradient-to-r from-purple-50 to-pink-50
                  p-5 border border-purple-100
                  relative
                "
              >
                {/* small corner accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500" />

                <p className="text-gray-800 font-medium text-[14px] pl-2">
                  <span className="text-purple-600 font-bold">
                    Future growth expectations:
                  </span>{" "}
                  the global alternatives market quadrupled to $10 Trillion
                  since 2007, and is expected to reach{" "}
                  <span className="text-purple-600 font-bold">
                    $14 Trillion
                  </span>{" "}
                  by 2030
                  <span className="text-xs text-gray-500 ml-1">
                    (Source: Holden)
                  </span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GrandOpeningSection;
