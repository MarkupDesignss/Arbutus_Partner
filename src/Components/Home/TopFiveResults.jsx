import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const items = [
  {
    title: "Top 5 Asset Class Performers (1 year)",
    icon: (
      <img
        src="/arbutus-web/assets/Home/Fivecard/f1.png"
        alt="icon"
        className="w-8 h-8 object-contain"
      />
    ),
  },
  {
    title: "Top 5 Yielders (Distn Yield) any fund",
    icon: (
      <img
        src="/arbutus-web/assets/Home/Fivecard/f2.png"
        alt="icon"
        className="w-8 h-8 object-contain"
      />
    ),
  },
  {
    title: "Top 5 3yr STD Dev (Sharpe) any fund",
    icon: (
      <img
        src="/arbutus-web/assets/Home/Fivecard/f3.png"
        alt="icon"
        className="w-8 h-8 object-contain"
      />
    ),
  },
  {
    title: "Top 5 Alt Strategy (OM)",
    icon: (
      <img
        src="/arbutus-web/assets/Home/Fivecard/f4.png"
        alt="icon"
        className="w-8 h-8 object-contain"
      />
    ),
  },
  {
    title: "Top 5 Liquid Alt",
    icon: (
      <img
        src="/arbutus-web/assets/Home/Fivecard/f5.png"
        alt="icon"
        className="w-8 h-8 object-contain"
      />
    ),
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
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
    <div className="w-full bg-gradient-to-b from-[#EFF4FF] to-[#E8EFFB] py-16 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#2A57C4]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2A57C4]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl md:text-3xl font-bold mb-12 text-gray-800"
        >
          Latest Monthly "Top 5" Results as of Month / Year 
          <span className="block text-sm font-medium text-[#2A57C4] mt-2">
            Sign up to view full details
          </span>
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0">
          {items.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              className={`relative flex flex-col items-center text-center px-4 md:px-6 py-8 md:py-10 h-full 
                bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-none
                ${index === 0 ? 'md:rounded-l-2xl' : ''} 
                ${index === items.length - 1 ? 'md:rounded-r-2xl' : ''}
                ${index !== items.length - 1 ? 'md:border-r border-gray-200/50' : ''}
                border-b md:border-b-0 border-gray-200/50
                shadow-sm hover:shadow-xl transition-shadow duration-300
                group`}
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#2A57C4]/0 via-[#2A57C4]/0 to-[#2A57C4]/5 rounded-2xl md:rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Number Badge */}
              <div className="absolute top-3 right-3 text-xs font-bold text-[#2A57C4]/20 group-hover:text-[#2A57C4]/40 transition-colors duration-300">
                #{index + 1}
              </div>

              {/* Icon */}
              <motion.div 
                variants={iconVariants}
                className="mb-4 bg-gradient-to-br from-[#E6EDFF] to-[#D4E0FF] rounded-full p-4 shadow-md group-hover:shadow-lg transition-shadow duration-300 relative"
              >
                <div className="relative z-10">
                  {item.icon}
                </div>
                {/* Icon Ring Effect */}
                <div className="absolute inset-0 rounded-full border-2 border-[#2A57C4]/10 group-hover:border-[#2A57C4]/30 transition-all duration-300 scale-110"></div>
              </motion.div>

              {/* Title */}
              <motion.p
                className={`text-sm md:text-base font-bold leading-snug text-gray-800 mb-4
                  ${index === 0 ? "line-clamp-3 min-h-[4.5rem]" : "line-clamp-2 min-h-[3rem]"}`}
              >
                {item.title}
              </motion.p>

              {/* Learn More */}
              <Link 
                to="/Levelmain" 
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#2A57C4] 
                  hover:text-[#1E3F8A] transition-colors duration-300 group/link"
              >
                <span className="relative">
                  Learn More
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2A57C4] group-hover/link:w-full transition-all duration-300"></span>
                </span>
                <motion.span 
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </Link>

              {/* Decorative Dot Pattern */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-1 h-1 rounded-full bg-[#2A57C4]/30"></div>
                <div className="w-1 h-1 rounded-full bg-[#2A57C4]/30"></div>
                <div className="w-1 h-1 rounded-full bg-[#2A57C4]/30"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link 
            to="/Levelmain" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#2A57C4] text-white rounded-full 
              font-semibold shadow-lg hover:shadow-xl hover:bg-[#1E3F8A] 
              transition-all duration-300 transform hover:scale-105"
          >
            <span>View Full Results</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}