import React from "react";
import { motion } from "framer-motion";

// Poppins font stack
const POPPINS = "'Poppins', sans-serif";

const items = [
  {
    title: "Top 5 Asset Class Performers (1 Year Return)",
    icon: (
      <img
        src="/arbutus-web/assets/Home/Fivecard/f1.png"
        alt="Asset Class Performers"
        className="w-7 h-7 object-contain"
      />
    ),
  },
  {
    title: "Top 5 Yielders (Last 12 Months Distribution Yield)",
    icon: (
      <img
        src="/arbutus-web/assets/Home/Fivecard/f2.png"
        alt="Top Yielders"
        className="w-7 h-7 object-contain"
      />
    ),
  },
  {
    title: "Top 5 Alternative Asset Performers (OM) 1 Year",
    icon: (
      <img
        src="/arbutus-web/assets/Home/Fivecard/f3.png"
        alt="Alternative Asset Performers"
        className="w-7 h-7 object-contain"
      />
    ),
  },
  {
    title: "Top 5 Alternative Strategy Performers (OM) 1 Year",
    icon: (
      <img
        src="/arbutus-web/assets/Home/Fivecard/f4.png"
        alt="Alternative Strategy Performers"
        className="w-7 h-7 object-contain"
      />
    ),
  },
  {
    title:
      "Top 5 Liquid Alternative Performers (Prospectus) 1 Year",
    icon: (
      <img
        src="/arbutus-web/assets/Home/Fivecard/f5.png"
        alt="Liquid Alternative Performers"
        className="w-7 h-7 object-contain"
      />
    ),
  },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),

  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const iconVariants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export default function TopFiveResults() {
  return (
    <section
      className="w-full bg-gradient-to-b from-[#EFF4FF] to-[#E8EFFB] py-10 md:py-14 relative overflow-hidden"
      style={{ fontFamily: POPPINS }}
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#2A57C4]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2A57C4]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative z-10">
        {/* =====================================================
            HEADING
        ===================================================== */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="text-center text-[22px] sm:text-[26px] md:text-[32px] font-bold mb-8 md:mb-10 text-gray-900 leading-tight tracking-tight"
          style={{ fontFamily: POPPINS, fontWeight: 700 }}
        >
          Latest Top 5 Results (MM/DD/Year)
        </motion.h2>

        {/* =====================================================
            CARDS
        ===================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 mt-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{
                once: true,
                margin: "-50px",
              }}
              variants={cardVariants}
              className={`
                relative
                group
                w-full
                aspect-square
                min-h-[220px]
                bg-white/70
                backdrop-blur-sm
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-4
                py-5
                overflow-hidden
                shadow-sm
                hover:shadow-xl
                transition-shadow
                duration-300

                ${
                  index === 0
                    ? "lg:rounded-l-2xl"
                    : ""
                }

                ${
                  index === items.length - 1
                    ? "lg:rounded-r-2xl"
                    : ""
                }

                ${
                  index !== items.length - 1
                    ? "lg:border-r border-gray-200/70"
                    : ""
                }

                border
                border-gray-200/60
                rounded-2xl
                lg:rounded-none
              `}
            >
              {/* =================================================
                  HOVER OVERLAY
              ================================================= */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-[#2A57C4]/0
                  via-[#2A57C4]/0
                  to-[#2A57C4]/5
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-500
                  pointer-events-none
                "
              />

              {/* =================================================
                  NUMBER
              ================================================= */}
              <div
                className="
                  absolute
                  top-3
                  right-3
                  text-[10.5px]
                  sm:text-[11px]
                  font-bold
                  text-[#2A57C4]/20
                  group-hover:text-[#2A57C4]/40
                  transition-colors
                  duration-300
                "
                style={{ fontFamily: POPPINS, fontWeight: 700 }}
              >
                #{index + 1}
              </div>

              {/* =================================================
                  ICON
              ================================================= */}
              <motion.div
                variants={iconVariants}
                className="
                  relative
                  shrink-0
                  mb-3.5
                  bg-gradient-to-br
                  from-[#E6EDFF]
                  to-[#D4E0FF]
                  rounded-full
                  p-3.5
                  shadow-md
                  group-hover:shadow-lg
                  transition-shadow
                  duration-300
                "
              >
                <div className="relative z-10">
                  {item.icon}
                </div>

                {/* Ring */}
                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    border-2
                    border-[#2A57C4]/10
                    group-hover:border-[#2A57C4]/30
                    transition-all
                    duration-300
                    scale-110
                  "
                />
              </motion.div>

              {/* =================================================
                  FULL TITLE
              ================================================= */}
              <p
                className="
                  relative
                  z-10
                  w-full
                  max-w-[185px]
                  text-[12px]
                  sm:text-[12.5px]
                  md:text-[13px]
                  lg:text-[12px]
                  xl:text-[12.5px]
                  font-bold
                  leading-[1.45]
                  text-gray-800
                  break-words
                  whitespace-normal
                "
                style={{ fontFamily: POPPINS, fontWeight: 700 }}
              >
                {item.title}
              </p>

              {/* =================================================
                  DECORATIVE DOTS
              ================================================= */}
              <div
                className="
                  absolute
                  bottom-3
                  left-1/2
                  -translate-x-1/2
                  flex
                  gap-1
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-300
                "
              >
                <div className="w-1 h-1 rounded-full bg-[#2A57C4]/30" />
                <div className="w-1 h-1 rounded-full bg-[#2A57C4]/30" />
                <div className="w-1 h-1 rounded-full bg-[#2A57C4]/30" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}