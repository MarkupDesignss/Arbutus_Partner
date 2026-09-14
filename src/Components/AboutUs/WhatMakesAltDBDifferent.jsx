import React from "react";
import { useGetPageQuery } from "../../Redux/api/publicApiSlice";
import { motion } from "framer-motion";
import { 
  FaChartLine, 
  FaRocket, 
  FaCalendarAlt, 
  FaCoins, 
  FaWater, 
  FaShieldAlt,
  FaUsers,
  FaGlobe,
  FaStar
} from "react-icons/fa";

const WhatMakesAltDBDifferent = () => {
  const { data, isLoading, isError } = useGetPageQuery("about_us");

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

  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.03,
      y: -3,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

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

  // Get "What Makes AltDB Different" section
  const differentSection = data?.data?.sections?.find(
    (item) => item.heading === "What Makes AltDB Different"
  );

  // Statistics
  const statistics = data?.data?.statistics;
  const hasStatistics = data?.data?.has_statistics;

  // Icon mapping for statistics
  const getStatIcon = (key) => {
    const icons = {
      fund_size: FaCoins,
      target_return: FaChartLine,
      realized_return: FaRocket,
      launch_year: FaCalendarAlt,
      min_investment: FaCoins,
      liquidity_level: FaWater,
      liquidity_options: FaShieldAlt,
    };
    return icons[key] || FaChartLine;
  };

  // Format stat label
  const formatLabel = (key) => {
    const labels = {
      fund_size: "Fund Size",
      target_return: "Target Return",
      realized_return: "Realized Return",
      launch_year: "Launch Year",
      min_investment: "Min. Investment",
      liquidity_level: "Liquidity Level",
      liquidity_options: "Liquidity Options",
    };
    return labels[key] || key.replace(/_/g, ' ').toUpperCase();
  };

  // Format value for display
  const formatValue = (key, value) => {
    if (key === 'fund_size' && typeof value === 'number') {
      return `$${value.toLocaleString()}`;
    }
    if (key === 'min_investment' && typeof value === 'number') {
      return `$${value.toLocaleString()}`;
    }
    return value;
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="w-full bg-gradient-to-b from-white via-blue-50/30 to-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* LEFT CONTENT */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Why Choose Us</span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight"
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
              className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50"
            >
              <div
                className="text-sm md:text-base text-gray-700 text-justify leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html: differentSection?.data || "",
                }}
              />
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-2"
            >
              {[
                { icon: FaUsers, text: "Trusted by 1000+ Users", color: "text-blue-600" },
                { icon: FaGlobe, text: "Global Presence", color: "text-indigo-600" },
                { icon: FaStar, text: "5 Star Rated", color: "text-yellow-500" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-blue-100/50"
                >
                  <item.icon className={`${item.color} text-sm`} />
                  <span className="text-xs font-medium text-gray-700">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT STATISTICS CARD */}
          {hasStatistics && (
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                variants={statCardVariants}
                whileHover="hover"
                className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100/50 p-6 relative overflow-hidden"
              >
                {/* Card Gradient Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between mb-4"
                  >
                    <div>
                      <motion.h3
                        variants={itemVariants}
                        className="text-xl font-bold text-gray-900"
                      >
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          Key Statistics
                        </span>
                      </motion.h3>
                      <motion.p
                        variants={itemVariants}
                        className="text-xs text-gray-500"
                      >
                        Performance metrics at a glance
                      </motion.p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      Latest
                    </span>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(statistics || {}).map(([key, value], index) => {
                      const Icon = getStatIcon(key);
                      
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className={`col-span-${key === 'liquidity_options' ? '2' : '1'} bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-300`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                              {formatLabel(key)}
                            </p>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
                              <Icon className="text-[10px]" />
                            </div>
                          </div>
                          <p className="text-base font-bold text-gray-800 mt-1">
                            {formatValue(key, value)}
                          </p>
                          {/* Small indicator bar */}
                          <div className="mt-1.5 h-0.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "70%" }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            ></motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Additional Info */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-4 pt-3 border-t border-gray-100/50"
                  >
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <FaCalendarAlt className="text-blue-400 text-[10px]" />
                      <span>Updated quarterly • Last update: Q1 2026</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default WhatMakesAltDBDifferent;