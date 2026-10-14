import React, { useState } from "react";
import { useGetPageQuery } from "../../Redux/api/publicApiSlice";
import { motion } from "framer-motion";
import { FaUsers, FaGlobe, FaStar, FaImage } from "react-icons/fa";

// Poppins font stack
const POPPINS = "'Poppins', sans-serif";

const WhatMakesAltDBDifferent = () => {
  const { data, isLoading, isError } = useGetPageQuery("about_us");
  const [imgError, setImgError] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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

  if (isLoading) {
    return (
      <section
        className="w-full bg-gradient-to-br from-blue-50 to-white py-12 md:py-16"
        style={{ fontFamily: POPPINS }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p
                className="mt-4 text-gray-500 text-[13px]"
                style={{ fontFamily: POPPINS, fontWeight: 500 }}
              >
                Loading...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data?.success) {
    return (
      <section
        className="w-full bg-gradient-to-br from-blue-50 to-white py-12 md:py-16"
        style={{ fontFamily: POPPINS }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p
              className="text-red-500 text-[15px] font-medium"
              style={{ fontFamily: POPPINS, fontWeight: 500 }}
            >
              Unable to load content.
            </p>
            <p
              className="text-gray-400 text-[12px] mt-1.5"
              style={{ fontFamily: POPPINS, fontWeight: 400 }}
            >
              Please try again later
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Get "What Makes AltDB Different" section
  const differentSection = data?.data?.sections?.find(
    (item) => item.heading === "What Makes AltDB Different"
  );

  // Image from API (images array)
  const firstImage = differentSection?.images?.[0];
  const imageUrl =
    typeof firstImage === "string"
      ? firstImage
      : firstImage?.url || firstImage?.image || firstImage?.src || null;
  const showImage = !!imageUrl && !imgError;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="w-full bg-gradient-to-b from-white via-blue-50/30 to-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative"
      style={{ fontFamily: POPPINS }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>

      {/* Decorative Dots Pattern */}
      <div className="absolute top-20 right-20 opacity-10 hidden lg:block">
        <div className="grid grid-cols-5 gap-3">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-blue-600 rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
          {/* LEFT: CONTENT */}
          <div className="space-y-7 order-2 lg:order-1">
            <motion.div variants={itemVariants} className="space-y-5">
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full"
              >
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                <span
                  className="text-[10.5px] font-semibold text-blue-700 uppercase"
                  style={{
                    fontFamily: POPPINS,
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                  }}
                >
                  Why Choose Us
                </span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-[22px] sm:text-[26px] lg:text-[32px] font-bold text-gray-900 leading-tight tracking-tight"
                style={{ fontFamily: POPPINS, fontWeight: 700 }}
              >
                {differentSection?.heading || "What Makes AltDB Different"}
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: "80px" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="block h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-3"
                ></motion.span>
              </motion.h2>

              <motion.div
                variants={itemVariants}
                className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-blue-100/50"
              >
                <div
                  className="text-[13px] md:text-[13.5px] text-gray-700 text-justify leading-relaxed space-y-3 prose prose-sm max-w-none prose-p:mb-2 prose-p:last:mb-0 prose-p:text-[13px]"
                  style={{ fontFamily: POPPINS, fontWeight: 400 }}
                  dangerouslySetInnerHTML={{
                    __html: differentSection?.data || "",
                  }}
                />
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-2.5"
              >
                {[
                  { icon: FaUsers, text: "Experience", color: "text-blue-600" },
                  { icon: FaGlobe, text: "Knowledge", color: "text-indigo-600" },
                  { icon: FaStar, text: "Objective", color: "text-yellow-500" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-blue-100/50"
                  >
                    <item.icon className={`${item.color} text-[12px]`} />
                    <span
                      className="text-[11.5px] font-medium text-gray-700"
                      style={{ fontFamily: POPPINS, fontWeight: 500 }}
                    >
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT: IMAGE (or TBD placeholder) */}
          <motion.div
            variants={itemVariants}
            className="relative w-full order-1 lg:order-2"
          >
            <div className="relative h-72 sm:h-96 lg:h-full lg:min-h-[460px] rounded-3xl overflow-hidden shadow-xl border border-blue-100/60 bg-white">
              {showImage ? (
                <>
                  <img
                    src={imageUrl}
                    alt={
                      differentSection?.heading || "What Makes AltDB Different"
                    }
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-3xl">
                  <span
                    className="text-[24px] font-bold text-blue-600 tracking-widest"
                    style={{ fontFamily: POPPINS, fontWeight: 700 }}
                  >
                    TBD
                  </span>
                </div>
              )}
            </div>

            {/* Floating accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl -z-10 hidden sm:block"></div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default WhatMakesAltDBDifferent;