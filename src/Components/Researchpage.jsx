import React from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaRocket, FaMicroscope, FaFlask, FaLightbulb, FaCogs } from 'react-icons/fa';

const Researchpage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const rotateVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white relative overflow-hidden flex justify-center items-center p-5 font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
     

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl w-full text-center">
        {/* Construction Icon with Animation */}
        <motion.div 
          className="flex justify-center items-center mb-6"
          variants={floatVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={rotateVariants}
            initial="initial"
            animate="animate"
            className="inline-block"
          >
            <FaTools className="text-7xl text-[#667eea] bg-gray-100 p-6 rounded-full border-2 border-gray-200 shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Title Section */}
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-5 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent flex flex-col items-center gap-4"
          variants={itemVariants}
        >
          Research Page
          <motion.span 
            className="text-xl bg-gradient-to-r from-[#f093fb] to-[#f5576c] bg-clip-text text-transparent px-5 py-2 border-2 border-[#f5576c] rounded-full inline-block"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          >
            Under Construction
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Our research team is working on groundbreaking discoveries.
          <br />
          This page is currently being developed with cutting-edge features.
        </motion.p>

        {/* Progress Bar */}
        <motion.div 
          className="max-w-md mx-auto my-10"
          variants={itemVariants}
        >
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mb-2.5">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ duration: 2, delay: 1 }}
            />
          </div>
          <span className="text-sm text-gray-500">Development Progress: 75%</span>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-white shadow-lg p-8 rounded-2xl border border-gray-100 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-[#667eea]"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaMicroscope className="text-4xl text-[#667eea] mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2.5 text-gray-800">Advanced Research</h3>
            <p className="text-gray-600 text-sm leading-relaxed">State-of-the-art laboratory equipment and methodologies</p>
          </motion.div>

          <motion.div 
            className="bg-white shadow-lg p-8 rounded-2xl border border-gray-100 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-[#667eea]"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaFlask className="text-4xl text-[#667eea] mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2.5 text-gray-800">Innovation Lab</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Pioneering new solutions for tomorrow's challenges</p>
          </motion.div>

          <motion.div 
            className="bg-white shadow-lg p-8 rounded-2xl border border-gray-100 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-[#667eea]"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaLightbulb className="text-4xl text-[#667eea] mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2.5 text-gray-800">Breakthrough Ideas</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Transformative concepts shaping the future</p>
          </motion.div>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div 
          className="my-12 p-10 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
          variants={itemVariants}
        >
          <FaRocket className="text-5xl text-[#667eea] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2.5 text-gray-800">Exciting Features Coming Soon!</h2>
          <p className="text-gray-600 mb-6">We're building something extraordinary for you</p>
          <div className="max-w-xs mx-auto h-1 bg-gray-200 rounded-full overflow-hidden relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full absolute"
              animate={{
                x: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ width: '30%' }}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-200"
          variants={itemVariants}
        >
          <div className="flex justify-center items-center gap-6 text-gray-500">
            <FaCogs className="text-2xl" />
            <span className="text-sm">© 2026 Research Division. All rights reserved.</span>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float 8s ease-in-out infinite 2s;
        }
        
        .animate-float-delay2 {
          animation: float 8s ease-in-out infinite 4s;
        }
      `}</style>
    </motion.div>
  );
};

export default Researchpage;