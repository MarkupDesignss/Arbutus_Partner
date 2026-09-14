import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const GrandOpeningSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -3 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-20 roboto-regular overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* LEFT TEXT */}
          <motion.div className="space-y-5 text-sm lg:pr-8" variants={itemVariants}>
            <motion.h2
              variants={itemVariants}
              className="text-4xl lg:text-5xl font-bold text-black roboto-bold relative inline-block"
            >
              Grand Opening Remarks
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={inView ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-gray-700 leading-relaxed"
            >
              In the past 30 years over open end fund investing in Canada, the
              market has evolved from actively managed, to passive ETFs
              (Exchange Traded Funds), to hedge funds, liquid alternatives, and
              now private asset funds (private equity, private credit, private
              real estate and more).
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg"
            >
              <p className="text-gray-800 font-medium">
                Why we built AltDB. To go beyond the world of traditional 60/40
                investing with improved confidence and awareness.
              </p>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-700 leading-relaxed"
            >
              Why Alternative funds matter more than ever before. There is a
              growing consensus that public market returns may be constrained
              resulting in a lost decade.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-gray-700 leading-relaxed"
            >
              Through democratised finance, all investors and allocators can
              access liquid alternative (public) funds, and those investors who
              are eligible or accredited have a wide and growing array of
              offering memorandum based (private) funds to chose from.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-100"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-gray-800 font-medium">
                <span className="text-purple-600 font-bold">Future growth expectations:</span>{" "}
                the global alternatives market quadrupled to $10 Trillion since 2007,
                and is expected to reach{" "}
                <span className="text-purple-600 font-bold">$14 Trillion</span> by 2030
                <span className="text-sm text-gray-500 ml-2">(Source: Holden)</span>
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            variants={imageVariants}
            className="w-full flex items-center justify-center"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 group">
              {/* Badge on Top-Right Corner */}
              <motion.div
                className="absolute top-4 right-4 z-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg"
                initial={{ opacity: 0, scale: 0.5, x: 20, y: -20 }}
                animate={inView ? { opacity: 1, scale: 1, x: 0, y: 0 } : { opacity: 0, scale: 0.5, x: 20, y: -20 }}
                transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Grand Opening
                </span>
              </motion.div>

              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 z-10"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
              
              <motion.img
                src="/arbutus-web/assets/Home/GrandOpeningSection/GrandOpeningSection.png"
                alt="Crowdfunding"
                className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-500 group-hover:scale-110"
                whileHover={{ 
                  scale: 1.08,
                  rotate: 0,
                  transition: { duration: 0.4 }
                }}
              />
              
              {/* Image overlay with scale and translate on hover */}
              <motion.div
                className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 z-10"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              />
              
              {/* Bottom gradient */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GrandOpeningSection;