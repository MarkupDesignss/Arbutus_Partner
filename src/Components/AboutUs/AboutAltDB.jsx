import React from "react";
import { getImagePath } from "../../utils/assetHelper";
import { useGetPageQuery } from "../../Redux/api/publicApiSlice";
import { motion } from "framer-motion";
import { FaArrowRight, FaQuoteLeft } from "react-icons/fa";

const AboutAltDB = () => {
  const { data, isLoading, isError } = useGetPageQuery("about_us");

  if (isLoading) {
    return (
      <section className="w-full bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Loading...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data?.success) {
    return (
      <section className="w-full bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-500 text-lg font-medium">Unable to load content.</p>
            <p className="text-gray-400 text-sm mt-2">Please try again later</p>
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
      className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 md:py-20 overflow-hidden relative"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">About Us</span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
            >
              {aboutSection?.heading || "About AltDB"}
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="block h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-3"
              ></motion.span>
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <FaQuoteLeft className="absolute -top-2 -left-2 text-blue-200 text-3xl opacity-50" />
              <div
                className="text-sm md:text-base text-justify font-roboto text-gray-700 space-y-4 pl-6"
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
                className="w-[380px] h-[420px] md:w-[420px] md:h-[460px] object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
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
                className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-40 h-40 md:w-52 md:h-52 bg-white rounded-2xl shadow-2xl p-2 border-4 border-white z-20"
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
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
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
              className="absolute -bottom-12 -left-6 md:-bottom-16 md:-left-10 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-4 z-20 border border-white/50 hidden sm:block"
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">5+</p>
                  <p className="text-xs text-gray-500">Years</p>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">1K+</p>
                  <p className="text-xs text-gray-500">Users</p>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">99%</p>
                  <p className="text-xs text-gray-500">Satisfaction</p>
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