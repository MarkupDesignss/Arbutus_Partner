import React from "react";
import { useGetOurValuesQuery } from "../../Redux/api/publicApiSlice";
import FourCardSkeleton from "../../Skeleton/Home/FourCardSkeleton";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Poppins font stack
const POPPINS = "'Poppins', sans-serif";

const FourCardSection = () => {
  const { data, isLoading, isError } = useGetOurValuesQuery();

  // Animation variants
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 40px -12px rgba(42, 87, 196, 0.25)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.15,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const linkVariants = {
    hover: {
      x: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  if (isLoading) {
    return <FourCardSkeleton />;
  }

  if (isError || !data?.status) {
    return null;
  }

  // Filter data to only show items with type "home"
  const homeData = data.data.filter((item) => item.type === "home");

  // If no home data, return null or a fallback
  if (homeData.length === 0) {
    return null;
  }

  return (
    <section
      className="py-12 md:py-14 bg-gradient-to-b from-white via-[#F8FAFF] to-[#EFF4FF] relative overflow-hidden"
      style={{ fontFamily: POPPINS }}
    >
      {/* Decorative Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-1/4 w-72 h-72 bg-[#2A57C4]/5 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2A57C4]/5 rounded-full blur-3xl"
      />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #2A57C4 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-7 h-[2px] bg-[#2A57C4]" />
            <span
              className="text-[10.5px] font-semibold text-[#2A57C4] uppercase"
              style={{
                fontFamily: POPPINS,
                fontWeight: 600,
                letterSpacing: "0.22em",
              }}
            >
              Our Values
            </span>
            <span className="w-7 h-[2px] bg-[#2A57C4]" />
          </div>

          <h2
            className="text-[22px] md:text-[28px] lg:text-[32px] font-bold text-gray-900 leading-tight tracking-tight"
            style={{ fontFamily: POPPINS, fontWeight: 700 }}
          >
            What Drives{" "}
            <span className="text-[#2A57C4]">Our Success</span>
          </h2>

          <p
            className="text-gray-500 mt-2.5 max-w-2xl mx-auto text-[13px] md:text-[14px] leading-snug"
            style={{ fontFamily: POPPINS, fontWeight: 400 }}
          >
            Discover the core principles that guide us
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {homeData.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover="hover"
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 
                         border border-gray-100/50 shadow-sm hover:shadow-2xl
                         transition-all duration-300 flex flex-col h-full
                         overflow-hidden"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2A57C4]/0 via-[#2A57C4]/0 to-[#2A57C4]/5 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              {/* Top Accent Line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2A57C4] to-[#1E3F8A] 
                           transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              />

              {/* Card Number */}
              <div
                className="absolute top-3 right-3 text-[42px] font-bold text-[#2A57C4]/5 
                            group-hover:text-[#2A57C4]/10 transition-colors duration-300 select-none leading-none"
                style={{ fontFamily: POPPINS, fontWeight: 700 }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Icon */}
              <motion.div variants={iconVariants} className="mb-4 relative">
                <div
                  className="bg-gradient-to-br from-[#E6EDFF] to-[#D4E0FF] rounded-2xl p-3.5 
                              w-14 h-14 flex items-center justify-center
                              group-hover:shadow-lg transition-all duration-300 relative"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-7 h-7 object-contain relative z-10"
                  />
                  {/* Icon Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-[#2A57C4]/10 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                                blur-xl" />
                </div>

                {/* Decorative Ring */}
                <div className="absolute -inset-1 rounded-2xl border-2 border-[#2A57C4]/0 
                              group-hover:border-[#2A57C4]/10 transition-all duration-500 
                              rotate-0 group-hover:rotate-12" />
              </motion.div>

              {/* Title */}
              <motion.h3
                className="text-[15px] font-bold mb-2 text-gray-800 group-hover:text-[#2A57C4] 
                           transition-colors duration-300 leading-snug"
                style={{ fontFamily: POPPINS, fontWeight: 700 }}
              >
                {item.title}
              </motion.h3>

              {/* Description */}
              <p
                className="text-[12px] leading-relaxed text-gray-600 flex-grow 
                          group-hover:text-gray-700 transition-colors duration-300"
                style={{ fontFamily: POPPINS, fontWeight: 400 }}
              >
                {item.short_description}
              </p>

              {/* Learn More */}
              <motion.div
                variants={linkVariants}
                className="mt-5 pt-3.5 border-t border-gray-100/50 group-hover:border-[#2A57C4]/10 
                          transition-colors duration-300"
              >
                <Link
                  to="/Aboutmain"
                  className="inline-flex items-center gap-1.5 text-[#2A57C4] text-[12px] font-semibold 
                           group-hover:text-[#1E3F8A] transition-colors duration-300"
                  style={{ fontFamily: POPPINS, fontWeight: 600 }}
                >
                  <span className="relative">
                    About Us
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2A57C4] 
                                  group-hover:w-full transition-all duration-300" />
                  </span>
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    className="inline-block"
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>

              {/* Decorative Dots at Bottom */}
              <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300">
                <div className="w-1 h-1 rounded-full bg-[#2A57C4]/30" />
                <div className="w-1 h-1 rounded-full bg-[#2A57C4]/30" />
                <div className="w-1 h-1 rounded-full bg-[#2A57C4]/30" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FourCardSection;