import React from "react";
import { useGetOurValuesQuery } from "../../Redux/api/publicApiSlice";
import { motion } from "framer-motion";

export default function FreemiumContent() {
  const { data, isLoading, isError } = useGetOurValuesQuery();

  // Filter data to only show items with type "alt_database"
  const altDatabaseData = data?.data?.filter(item => item.type === "alt_database") || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      y: -8,
      scale: 1.03,
      boxShadow: "0 20px 40px -12px rgba(26, 66, 162, 0.3)",
      borderColor: "#1A42A2",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  if (isLoading) {
    return (
      <div className="bg-[#EFF4FF] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-3xl font-bold mb-8 text-gray-800"
          >
            Freemium Content
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 min-h-[200px] animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.status || altDatabaseData.length === 0) {
    return (
      <div className="bg-[#EFF4FF] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-3xl font-bold mb-6 text-gray-800"
          >
            Freemium Content
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-lg"
          >
            No data available
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#EFF4FF] to-[#E8EFF8] py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="absolute top-0 right-0 w-96 h-96 bg-[#1A42A2]/5 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-[#1A42A2]/5 rounded-full blur-3xl"
      />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1A42A2 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Heading with decorative elements */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="w-10 h-0.5 bg-gradient-to-r from-transparent to-[#1A42A2]" />
            <span className="text-sm font-semibold text-[#1A42A2] uppercase tracking-wider">
              Premium Insights
            </span>
            <span className="w-10 h-0.5 bg-gradient-to-l from-transparent to-[#1A42A2]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Freemium <span className="text-[#1A42A2]">Content</span>
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Explore our top-performing alternative investment strategies
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {altDatabaseData.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover="hover"
              className="group relative bg-white rounded-xl p-6 border-2 border-[#1A42A2]/20 
                        shadow-sm hover:shadow-xl transition-all duration-300 
                        flex flex-col min-h-[200px] overflow-hidden"
            >
              {/* Gradient Background Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A42A2]/0 via-[#1A42A2]/0 to-[#1A42A2]/5 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top Accent Bar */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1A42A2] to-[#2A57C4] 
                          transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              />

              {/* Card Number Badge */}
              <div className="absolute top-3 right-3 text-xs font-bold text-[#1A42A2]/10 
                            group-hover:text-[#1A42A2]/20 transition-colors duration-300">
                #{String(index + 1).padStart(2, '0')}
              </div>

              {/* Content Container - Fixed height and alignment */}
              <div className="flex flex-col flex-grow">
                {/* Icon with hover effect - Fixed size */}
                <motion.div
                  variants={iconVariants}
                  className="mb-4 relative flex-shrink-0"
                >
                  <div className="bg-gradient-to-br from-[#E6EDFF] to-[#D4E0FF] rounded-xl p-3 
                                w-14 h-14 flex items-center justify-center
                                group-hover:shadow-md transition-all duration-300 relative">
                    <img
                      src={item.image || "/arbutus-web/assets/AltDatabaseHero/icon.svg"}
                      alt={item.title}
                      className="w-8 h-8 object-contain relative z-10"
                      onError={(e) => {
                        e.target.src = "/arbutus-web/assets/AltDatabaseHero/icon.svg";
                      }}
                    />
                    {/* Icon Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-[#1A42A2]/10 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                                  blur-xl" />
                  </div>
                  
                  {/* Decorative Ring */}
                  <div className="absolute -inset-1 rounded-xl border-2 border-[#1A42A2]/0 
                                group-hover:border-[#1A42A2]/10 transition-all duration-500 
                                rotate-0 group-hover:rotate-12" />
                </motion.div>

                {/* Title - Fixed height with ellipsis if needed */}
                <div className="flex-grow flex flex-col">
                  <p className="text-sm font-semibold leading-snug text-gray-800 
                              group-hover:text-[#1A42A2] transition-colors duration-300
                              line-clamp-2 min-h-[2rem]">
                    {item.title}
                  </p>

                  {/* Description - Fixed height with ellipsis */}
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed
                              line-clamp-3 min-h-[2rem]">
                    {item.short_description || item.title}
                  </p>
                </div>

                {/* Bottom Decorative Line - Fixed at bottom */}
                <div className="mt-4 pt-3 border-t border-gray-100/50 
                              group-hover:border-[#1A42A2]/10 transition-colors duration-300
                              flex items-center justify-between flex-shrink-0">
                  <span className="text-[10px] text-gray-400 group-hover:text-[#1A42A2]/60 
                                 transition-colors duration-300 uppercase tracking-wider">
                    {item.type?.replace('_', ' ') || 'Premium'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}