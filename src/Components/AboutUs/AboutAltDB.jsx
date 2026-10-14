import React from "react";
import { getImagePath } from "../../utils/assetHelper";
import { useGetPageQuery } from "../../Redux/api/publicApiSlice";
import { motion } from "framer-motion";
import { FaArrowRight, FaQuoteLeft } from "react-icons/fa";

// Poppins font stack
const POPPINS = "'Poppins', sans-serif";

const AboutAltDB = () => {
  const { data, isLoading, isError } = useGetPageQuery("about_us");

  if (isLoading) {
    return (
      <section
        className="w-full bg-gradient-to-br from-blue-50 to-white py-12 md:py-16"
        style={{ fontFamily: POPPINS }}
      >
        <div className="max-w-6xl mx-auto px-6">
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

  // Find only About AltDB section
  const aboutSection = data?.data?.sections?.find(
    (item) => item.heading === "About AltDB"
  );

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
  };

  const floatingImageVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.4,
      },
    },
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 md:py-16 overflow-hidden relative"
      style={{ fontFamily: POPPINS }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

      {/* Decorative Dot Pattern */}
      <div className="absolute top-20 left-10 opacity-10">
        <div className="grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-blue-600 rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* LEFT CONTENT */}
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
                About Us
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-[22px] md:text-[28px] lg:text-[32px] font-bold text-gray-900 leading-tight tracking-tight"
              style={{ fontFamily: POPPINS, fontWeight: 700 }}
            >
              {aboutSection?.heading || "About AltDB"}
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="block h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-3"
              ></motion.span>
            </motion.h2>

            <motion.div variants={itemVariants} className="relative">
              <FaQuoteLeft className="absolute -top-1 -left-1 text-blue-200 text-2xl opacity-50" />
              <div
                className="text-[13px] md:text-[13.5px] text-justify text-gray-700 space-y-3 pl-5 leading-relaxed prose prose-sm max-w-none prose-p:mb-2 prose-p:last:mb-0 prose-p:text-[13px]"
                style={{ fontFamily: POPPINS, fontWeight: 400 }}
                dangerouslySetInnerHTML={{
                  __html: aboutSection?.data || "",
                }}
              />
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE SECTION */}
          <motion.div
            variants={itemVariants}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Main Image */}
            <motion.div
              variants={imageVariants}
              whileHover={{ scale: 1.02, rotate: -2 }}
              className="rounded-2xl overflow-hidden shadow-2xl relative group"
            >
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

              <img
                src={
                  aboutSection?.images?.[1] ||
                  getImagePath("AboutUS/Men.png")
                }
                alt="About AltDB"
                className="w-[340px] h-[380px] md:w-[380px] md:h-[420px] object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = getImagePath("AboutUS/Men.png");
                }}
              />

              {/* Decorative Border */}
              <div className="absolute -inset-2 border-2 border-blue-400/20 rounded-2xl -z-10"></div>
            </motion.div>

            {/* Floating Image */}
            {aboutSection?.images?.[0] && (
              <motion.div
                variants={floatingImageVariants}
                whileHover="hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="absolute -bottom-5 -right-5 md:-bottom-8 md:-right-8 w-36 h-36 md:w-48 md:h-48 bg-white rounded-2xl shadow-2xl p-2 border-4 border-white z-20"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <img
                    src={aboutSection.images[0]}
                    alt="AltDB Group"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.src = getImagePath("AboutUS/Group.png");
                    }}
                  />

                  {/* Floating Badge on Image */}
                  <div
                    className="absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] font-bold px-2 py-1 rounded-full shadow-lg"
                    style={{ fontFamily: POPPINS, fontWeight: 700 }}
                  >
                    ✦
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-10 -left-5 md:-bottom-14 md:-left-8 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-3.5 z-20 border border-white/50 hidden sm:block"
              style={{ fontFamily: POPPINS }}
            >
              <div className="flex items-center gap-3.5">
                <div className="text-center">
                  <p
                    className="text-[20px] font-bold text-blue-600 leading-none"
                    style={{ fontFamily: POPPINS, fontWeight: 700 }}
                  >
                    7
                  </p>
                  <p
                    className="text-[10.5px] text-gray-500 mt-0.5"
                    style={{ fontFamily: POPPINS, fontWeight: 400 }}
                  >
                    Asset Classes
                  </p>
                </div>
                <div className="w-px h-9 bg-gray-200"></div>
                <div className="text-center">
                  <p
                    className="text-[20px] font-bold text-blue-600 leading-none"
                    style={{ fontFamily: POPPINS, fontWeight: 700 }}
                  >
                    10
                  </p>
                  <p
                    className="text-[10.5px] text-gray-500 mt-0.5"
                    style={{ fontFamily: POPPINS, fontWeight: 400 }}
                  >
                    CIFSC Categories
                  </p>
                </div>
                <div className="w-px h-9 bg-gray-200"></div>
                <div className="text-center">
                  <p
                    className="text-[20px] font-bold text-blue-600 leading-none"
                    style={{ fontFamily: POPPINS, fontWeight: 700 }}
                  >
                    17
                  </p>
                  <p
                    className="text-[10.5px] text-gray-500 mt-0.5"
                    style={{ fontFamily: POPPINS, fontWeight: 400 }}
                  >
                    Strategies
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutAltDB;