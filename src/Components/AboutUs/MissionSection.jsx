import React from "react";
import { useGetPageQuery } from "../../Redux/api/publicApiSlice";
import { getImagePath } from "../../utils/assetHelper";
import { motion } from "framer-motion";
import { FaBullseye, FaRocket, FaStar } from "react-icons/fa";

// Poppins font stack
const POPPINS = "'Poppins', sans-serif";

export default function MissionSection() {
  const { data, isLoading, isError } = useGetPageQuery("about_us");

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
    hidden: { opacity: 0, scale: 0.8, rotate: 5 },
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

  if (isLoading) {
    return (
      <section
        className="bg-gradient-to-b from-[#EFF4FF] to-white py-12 md:py-16"
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
        className="bg-gradient-to-b from-[#EFF4FF] to-white py-12 md:py-16"
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

  // Get only "Our Mission" section
  const missionSection = data?.data?.sections?.find(
    (item) => item.heading === "Our Mission"
  );

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="relative bg-gradient-to-b from-[#EFF4FF] via-white to-[#EFF4FF] flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ fontFamily: POPPINS }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

      {/* Decorative Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-100/30 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-blue-100/20 rounded-full"></div>

      <div className="max-w-7xl w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Image Section */}
          <motion.div
            variants={itemVariants}
            className="w-full flex justify-center relative"
          >
            <motion.div
              variants={imageVariants}
              whileHover={{ scale: 1.02, rotate: -2 }}
              className="relative group"
            >
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                <img
                  src={
                    missionSection?.images?.[0] ||
                    getImagePath("AboutUS/Mission.png")
                  }
                  alt={missionSection?.heading || "Our Mission"}
                  className="
                    w-full
                    max-w-[380px]
                    sm:max-w-[440px]
                    md:max-w-full
                    h-[260px]
                    sm:h-[320px]
                    md:h-[380px]
                    object-cover
                    rounded-3xl
                    transition-transform duration-700
                    group-hover:scale-105
                  "
                  onError={(e) => {
                    e.target.src = getImagePath("AboutUS/Mission.png");
                  }}
                />

                {/* Image Border Decoration */}
                <div className="absolute -inset-2 border-2 border-blue-400/20 rounded-3xl -z-10"></div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center text-center md:text-left space-y-5"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full w-fit mx-auto md:mx-0"
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
                Our Vision
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-[22px] sm:text-[26px] lg:text-[32px] font-bold text-gray-900 leading-tight tracking-tight"
              style={{ fontFamily: POPPINS, fontWeight: 700 }}
            >
              {missionSection?.heading || "Our Mission"}
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="block h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-3 mx-auto md:mx-0"
              ></motion.span>
            </motion.h1>

            <motion.div variants={itemVariants} className="relative">
              <div
                className="space-y-3 text-[13px] sm:text-[13.5px] leading-relaxed text-gray-700 text-justify prose prose-sm max-w-none prose-p:mb-2 prose-p:last:mb-0 prose-p:text-[13px]"
                style={{ fontFamily: POPPINS, fontWeight: 400 }}
                dangerouslySetInnerHTML={{
                  __html: missionSection?.data || "",
                }}
              />
            </motion.div>

            {/* Key Features */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3"
            >
              {[
                { icon: FaRocket, text: "Education" },
                { icon: FaStar, text: "Awareness" },
                { icon: FaBullseye, text: "Independence" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2.5 bg-white/60 backdrop-blur-sm rounded-lg px-3.5 py-2 border border-blue-100/50"
                >
                  <feature.icon className="text-blue-600 text-[13px]" />
                  <span
                    className="text-[12.5px] font-medium text-gray-700"
                    style={{ fontFamily: POPPINS, fontWeight: 500 }}
                  >
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}