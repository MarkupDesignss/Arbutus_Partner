import React, { useState } from "react";
import { useGetPageQuery } from "../../Redux/api/publicApiSlice";
import { motion } from "framer-motion";
import { FaStar, FaAward, FaImage } from "react-icons/fa";

// Poppins font stack
const POPPINS = "'Poppins', sans-serif";

export default function InvestmentKIDCard() {
  const { data, isLoading, isError } = useGetPageQuery("about_us");
  const [imgError, setImgError] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.03,
      rotate: 2,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  const floatingBadgeVariants = {
    hidden: { opacity: 0, scale: 0, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.5,
      },
    },
    hover: {
      scale: 1.1,
      rotate: -5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  if (isLoading) {
    return (
      <section
        className="py-12 md:py-16 bg-gradient-to-b from-white to-blue-50/30"
        style={{ fontFamily: POPPINS }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
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
        className="py-12 md:py-16 bg-gradient-to-b from-white to-blue-50/30"
        style={{ fontFamily: POPPINS }}
      >
        <div className="max-w-7xl mx-auto px-6">
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

  // Get "Our Commitment To Objectivity" section
  const commitmentSection = data?.data?.sections?.find(
    (item) => item.heading === "Our Commitment To Objectivity"
  );

  // Image from API (images array)
  const firstImage = commitmentSection?.images?.[0];
  const imageUrl =
    typeof firstImage === "string"
      ? firstImage
      : firstImage?.url || firstImage?.image || firstImage?.src || null;

  // Show image only if API provides one and no load error
  const showImage = !!imageUrl && !imgError;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="max-w-7xl w-full mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ fontFamily: POPPINS }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>

      {/* Decorative Pattern */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-100/30 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-100/20 rounded-full"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-10 lg:gap-14 relative z-10">
        {/* LEFT Section - Image or TBD */}
        <motion.div
          variants={itemVariants}
          className="w-full flex items-center justify-center relative order-1 md:order-1"
        >
          <motion.div
            variants={imageVariants}
            whileHover="hover"
            className="relative group w-full h-full flex items-center justify-center"
          >
            {/* Main Image / TBD Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[460px]">
              {showImage ? (
                <>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                  <img
                    src={imageUrl}
                    alt={
                      commitmentSection?.heading ||
                      "Our Commitment To Objectivity"
                    }
                    onError={() => setImgError(true)}
                    className="
                      w-full
                      h-full
                      object-cover
                      rounded-3xl
                      transition-transform duration-700
                      group-hover:scale-105
                    "
                    loading="lazy"
                  />

                  {/* Image Border Decoration */}
                  <div className="absolute -inset-2 border-2 border-blue-400/20 rounded-3xl -z-10"></div>
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

            {/* Floating Badge 1 - Top Right */}
            {showImage && (
              <motion.div
                variants={floatingBadgeVariants}
                whileHover="hover"
                className="absolute top-3 right-3 md:top-4 md:right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-full shadow-xl z-20 flex items-center gap-1.5"
                style={{ fontFamily: POPPINS }}
              >
                <FaStar className="text-yellow-300 text-[12px]" />
                <span
                  className="text-[11px] font-bold"
                  style={{ fontFamily: POPPINS, fontWeight: 700 }}
                >
                  Top Rated
                </span>
              </motion.div>
            )}

            {/* Floating Badge 2 - Bottom Left */}
            {showImage && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl p-2.5 z-20 border border-blue-100/50"
                style={{ fontFamily: POPPINS }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                    <FaAward className="text-[13px]" />
                  </div>
                  <div>
                    <p
                      className="text-[11.5px] font-bold text-gray-800"
                      style={{ fontFamily: POPPINS, fontWeight: 700 }}
                    >
                      Trusted
                    </p>
                    <p
                      className="text-[10px] text-gray-500"
                      style={{ fontFamily: POPPINS, fontWeight: 400 }}
                    >
                      by 1000+ users
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* RIGHT Section - Content */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col justify-center space-y-5 order-2 md:order-2"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full w-fit"
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
              Our Commitment
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-[22px] sm:text-[26px] lg:text-[32px] text-gray-900 leading-tight font-bold tracking-tight"
            style={{ fontFamily: POPPINS, fontWeight: 700 }}
          >
            {commitmentSection?.heading || "Our Commitment To Objectivity"}
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "80px" }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="block h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-3"
            ></motion.span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-blue-100/50"
          >
            <div
              className="text-[13px] md:text-[13.5px] text-gray-700 leading-relaxed text-justify space-y-3 prose prose-sm max-w-none prose-p:mb-2 prose-p:last:mb-0 prose-p:text-[13px]"
              style={{ fontFamily: POPPINS, fontWeight: 400 }}
              dangerouslySetInnerHTML={{
                __html: commitmentSection?.data || "",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}