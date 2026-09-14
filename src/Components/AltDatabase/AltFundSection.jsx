import React from "react";
import { motion } from "framer-motion";

export default function AltFundSection() {
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

  const leftCardVariants = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const rightCardVariants = {
    hidden: {
      opacity: 0,
      x: 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      rotate: -2,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const titleVariants = {
    hover: {
      x: 5,
      color: "#2A57C4",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      color: "#1E3F8A",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const dividerVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="w-full py-4 mb-10 roboto-regular relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-96 h-96 bg-[#2A57C4] rounded-full blur-3xl"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-0 right-0 w-64 h-64 bg-[#2A57C4] rounded-full blur-3xl"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 left-0 w-64 h-64 bg-[#2A57C4] rounded-full blur-3xl"
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 relative">
        {/* Center Divider (Desktop only) */}
        <motion.div
          variants={dividerVariants}
          className="hidden md:block absolute left-1/2 top-0 h-full w-px"
        >
          <div className="w-full h-full bg-gradient-to-b from-transparent via-[#2A57C4]/30 to-transparent" />
        </motion.div>

        {/* Decorative Dot on Divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-3 h-3 bg-[#2A57C4] rounded-full shadow-lg shadow-[#2A57C4]/30"
        />

        {/* Left Card */}
        <motion.div
          variants={leftCardVariants}
          whileHover="hover"
          className="flex flex-col items-start px-10 md:px-12 relative group"
        >
          {/* Card Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A57C4]/0 via-[#2A57C4]/0 to-[#2A57C4]/5 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

          {/* Image with animation */}
          <motion.div
            variants={imageVariants}
            whileHover="hover"
            className="relative"
          >
            <img
              src="/arbutus-web/assets/AltDatabaseHero/Img2.png"
              alt="Missing Alt Fund"
              className="w-56 h-56 object-contain mb-6 relative z-10"
            />
            
            {/* Image Glow Effect */}
            <div className="absolute inset-0 bg-[#2A57C4]/10 rounded-full blur-2xl 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Decorative Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#2A57C4]/0 
                          group-hover:border-[#2A57C4]/10 transition-all duration-500 
                          rotate-0 group-hover:rotate-12 scale-105" />
          </motion.div>

          {/* Title with animation */}
          <motion.h2
            variants={titleVariants}
            whileHover="hover"
            className="text-xl font-semibold mb-3 text-left roboto-bold 
                       group-hover:text-[#2A57C4] transition-colors duration-300"
          >
            Are we missing an Alt Fund?
          </motion.h2>

          {/* Description with animation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm leading-relaxed text-justify max-w-md 
                       group-hover:text-gray-700 transition-colors duration-300"
          >
            Click the link and let us know the fund name (Note: link opens in new
            tab to{" "}
            <motion.a
              href="mailto:info@altdb.ca"
              variants={linkVariants}
              whileHover="hover"
              className="text-[#2A57C4] font-medium inline-block"
            >
              info@altdb.ca
            </motion.a>
            . <strong>Subject:</strong> missing alt fund for your database)
          </motion.p>

          {/* Decorative Bottom Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60%" }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 h-0.5 bg-gradient-to-r from-[#2A57C4]/30 to-transparent"
          />
        </motion.div>

        {/* Right Card */}
        <motion.div
          variants={rightCardVariants}
          whileHover="hover"
          className="flex flex-col items-start px-10 md:px-12 mt-16 md:mt-0 lg:ml-12 relative group"
        >
          {/* Card Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#2A57C4]/0 via-[#2A57C4]/0 to-[#2A57C4]/5 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

          {/* Image with animation */}
          <motion.div
            variants={imageVariants}
            whileHover="hover"
            className="relative"
          >
            <img
              src="/arbutus-web/assets/AltDatabaseHero/Img1.png"
              alt="Add Fund"
              className="w-56 h-56 object-contain mb-6 relative z-10"
            />
            
            {/* Image Glow Effect */}
            <div className="absolute inset-0 bg-[#2A57C4]/10 rounded-full blur-2xl 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Decorative Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#2A57C4]/0 
                          group-hover:border-[#2A57C4]/10 transition-all duration-500 
                          rotate-0 group-hover:-rotate-12 scale-105" />
          </motion.div>

          {/* Title with animation */}
          <motion.h2
            variants={titleVariants}
            whileHover="hover"
            className="text-xl font-semibold mb-3 text-left roboto-bold 
                       group-hover:text-[#2A57C4] transition-colors duration-300"
          >
            Want to add your fund to AltDB?
          </motion.h2>

          {/* Description with animation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm leading-relaxed text-justify max-w-md 
                       group-hover:text-gray-700 transition-colors duration-300"
          >
            Send us your latest fact sheet via this Link (Note: link opens in new
            tab to{" "}
            <motion.a
              href="mailto:info@altdb.ca"
              variants={linkVariants}
              whileHover="hover"
              className="text-[#2A57C4] font-medium inline-block"
            >
              info@altdb.ca
            </motion.a>
            . <strong>Subject:</strong> fact sheet for your database)
          </motion.p>

          {/* Decorative Bottom Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60%" }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 h-0.5 bg-gradient-to-r from-transparent to-[#2A57C4]/30"
          />
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 left-10 w-2 h-2 bg-[#2A57C4] rounded-full"
      />
      
      <motion.div
        animate={{
          y: [0, 10, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-20 right-20 w-3 h-3 bg-[#2A57C4] rounded-full"
      />
      
      <motion.div
        animate={{
          y: [0, -8, 0],
          opacity: [0.1, 0.4, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-20 right-32 w-1.5 h-1.5 bg-[#2A57C4] rounded-full"
      />
    </motion.div>
  );
}