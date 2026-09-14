import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AlternativeInvesting = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.02,
      rotate: 2,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  const termData = [
    {
      term: "Liquidity Premium",
      definition: "The additional return investors demand for holding illiquid assets.",
      why: "Essential for understanding returns in private markets.",
    },
    {
      term: "Alpha Generation",
      definition: "Excess returns above a benchmark achieved through active management.",
      why: "Critical for evaluating fund manager performance.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white via-[#F8FAFF] to-[#EFF4FF] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
        className="absolute top-0 right-0 w-96 h-96 bg-[#2A57C4]/5 rounded-full blur-3xl"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-[#2A57C4]/5 rounded-full blur-3xl"
      ></motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* MAIN ROW */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-16"
        >
          {/* LEFT IMAGE */}
          <motion.div
            variants={imageVariants}
            whileHover="hover"
            className="w-full md:w-auto flex justify-center md:justify-start relative"
          >
            {/* Glow Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -inset-4 bg-[#2A57C4]/10 rounded-full blur-2xl"
            ></motion.div>

            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/arbutus-web/assets/Home/AlternativeInvesting/Alternative.png"
                alt="Alternative Investing Illustration"
                className="w-full max-w-[320px] md:max-w-[420px] lg:max-w-[480px] h-auto object-contain rounded-2xl shadow-2xl"
              />
              {/* Decorative Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-[#2A57C4]/10 pointer-events-none"></div>
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-2 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-gray-700">Live Data</span>
            </motion.div>
          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-2xl md:ml-8 lg:ml-12"
          >
            {/* Heading */}
            <motion.div
              variants={itemVariants}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-1 h-6 bg-[#2A57C4] rounded-full"></span>
                <span className="text-sm font-semibold text-[#2A57C4] uppercase tracking-wider">
                  Alternative Investing
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug text-gray-800">
                Alternative Investing Literacy –{" "}
                <span className="text-[#2A57C4]">Terms and Definitions</span>
              </h2>
            </motion.div>

            {/* Term Cards */}
            <div className="space-y-6">
              {termData.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100/50 group"
                >
                  {/* Term Badge */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2A57C4] to-[#1E3F8A] flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#2A57C4] bg-[#E6EDFF] px-3 py-1 rounded-full">
                          Term
                        </span>
                        <h3 className="text-lg font-bold text-gray-800">
                          {item.term}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Definition
                          </span>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {item.definition}
                          </p>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          whileHover={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <span className="text-xs font-semibold text-[#2A57C4] uppercase tracking-wider">
                              Why it matters
                            </span>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {item.why}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AlternativeInvesting;