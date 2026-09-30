import React from "react";
import { motion } from "framer-motion";

const AlternativeInvesting = () => {
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

  const termData = [
    {
      term: "Liquidity Premium",
      definition:
        "The additional return investors demand for holding illiquid assets.",
      why: "Essential for understanding returns in private markets.",
    },
    {
      term: "Alpha Generation",
      definition:
        "Excess returns above a benchmark achieved through active management.",
      why: "Critical for evaluating fund manager performance.",
    },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white via-[#F8FAFF] to-[#EFF4FF] overflow-hidden">
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
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-[2px] bg-[#2A57C4]" />
            <span className="text-[11px] font-semibold text-[#2A57C4] uppercase tracking-[0.25em]">
              Alternative Investing
            </span>
            <span className="w-8 h-[2px] bg-[#2A57C4]" />
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold leading-tight text-gray-900">
            Alternative Investing Literacy
            <br className="hidden sm:block" />
            <span className="text-[#2A57C4]"> Terms &amp; Definitions</span>
          </h2>

          <p className="mt-4 text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            A quick reference for the concepts that shape modern alternative
            portfolios.
          </p>
        </motion.div>

        {/* =====================================================
            TOP HERO IMAGE (full-width banner)
        ===================================================== */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mb-12 lg:mb-16"
        >
          <div className="relative overflow-hidden shadow-xl group">
            <img
              src="/arbutus-web/assets/Home/AlternativeInvesting/Alternative.png"
              alt="Alternative Investing Illustration"
              className="w-full h-[220px] sm:h-[280px] lg:h-[340px] object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            {/* Caption */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">
                Knowledge Base
              </span>
              <span className="text-white text-sm sm:text-base font-medium">
                Building fluency in alternatives, one term at a time.
              </span>
            </div>

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/70" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/70" />

            {/* LIVE badge */}
            <div className="absolute top-4 right-4 bg-white shadow-lg px-3 py-1.5 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider">
                Live Data
              </span>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            TERMS — GRID FORM (2 columns on desktop)
        ===================================================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {termData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group h-full"
            >
              {/* Big background numeral */}
              <span
                className="
                  absolute -top-8 -left-2
                  text-[110px] md:text-[130px]
                  font-bold text-[#2A57C4]/[0.06]
                  leading-none select-none pointer-events-none
                "
              >
                0{index + 1}
              </span>

              <div
                className="
                  relative h-full flex flex-col
                  bg-white/90 backdrop-blur-sm
                  border border-gray-100
                  p-6 md:p-8
                  shadow-sm hover:shadow-xl
                  transition-all duration-300
                  group-hover:-translate-y-1
                "
              >
                {/* Left gradient accent bar */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2A57C4] to-[#7C3AED]" />

                <div className="pl-4 flex flex-col h-full">
                  {/* Term pill + title */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span
                      className="
                        text-[10px] font-semibold uppercase tracking-[0.2em]
                        text-[#2A57C4] bg-[#E6EDFF]
                        px-3 py-1
                      "
                    >
                      Term 0{index + 1}
                    </span>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      {item.term}
                    </h3>
                  </div>

                  {/* Definition */}
                  <div className="mb-5 flex-1">
                    <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-1">
                      Definition
                    </span>
                    <p className="text-gray-700 text-[15px] leading-relaxed">
                      {item.definition}
                    </p>
                  </div>

                  {/* Why it matters */}
                  <div className="pt-4 border-t border-dashed border-gray-200 mt-auto">
                    <span className="block text-[10px] font-semibold text-[#2A57C4] uppercase tracking-[0.2em] mb-1">
                      Why it matters
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.why}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
          <span className="w-10 h-[2px] bg-[#2A57C4]" />
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.25em]">
            More terms coming soon
          </span>
          <span className="w-10 h-[2px] bg-[#2A57C4]" />
        </motion.div>
      </div>
    </section>
  );
};

export default AlternativeInvesting;
