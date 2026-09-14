import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { 
  ArrowRight, FileText, BookOpen, 
  Sparkles, Zap, ChevronRight,
  Calendar, Clock, BarChart3, PieChart,
  Target, X,
} from "lucide-react";
import { useGetatlsectionQuery } from "../../Redux/api/publicApiSlice";

const AltDBSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [controls, isInView, hasAnimated]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80,
      },
    },
    hover: {
      y: -6,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 150,
      },
    },
  };

  const { data } = useGetatlsectionQuery();

  const section = data?.data?.[0];
  
  // Dynamic content mapping
  const aboutData = section?.content?.[0] || null;
  
  // Map content items dynamically - first item is About, rest are research/literacy
  const contentItems = section?.content || [];
  
  // Get research items (all except first item)
  const researchItems = contentItems.length > 1 
    ? contentItems.slice(1).map(item => ({
        title: item.title,
        description: item.short_description,
        date: new Date(section?.created_at || Date.now()).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      }))
    : [];

  // Get literacy items (all except first item)
  const literacyItems = contentItems.length > 1 
    ? contentItems.slice(1).map(item => ({
        title: item.title,
        description: item.short_description,
        date: new Date(section?.created_at || Date.now()).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      }))
    : [];

  // Helper function to render HTML content safely
  const renderHTML = (htmlContent) => {
    if (!htmlContent) return null;
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  // Extract focus points from aboutData short_description
  const extractFocusPoints = (htmlContent) => {
    if (!htmlContent) return null;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const paragraphs = tempDiv.querySelectorAll('p');
    const focusPoints = [];
    
    paragraphs.forEach(p => {
      const text = p.textContent.trim();
      if (text.includes('✓') || text.includes('•') || 
          text.includes('We put') || text.includes('AltDB is') || 
          text.includes('focus') || text.includes('Focus')) {
        focusPoints.push(text);
      }
    });
    
    return focusPoints.length > 0 ? focusPoints : null;
  };

  // Extract the focus description from aboutData
  const getFocusDescription = (htmlContent) => {
    if (!htmlContent) return "We are focused on evergreen (open end) funds";
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const paragraphs = tempDiv.querySelectorAll('p');
    for (let p of paragraphs) {
      const text = p.textContent.trim();
      if (text.toLowerCase().includes('focus') || 
          text.toLowerCase().includes('mission') || 
          text.toLowerCase().includes('dedicated')) {
        return text;
      }
    }
    
    return paragraphs.length > 0 ? paragraphs[0].textContent.trim() : "We are focused on evergreen (open end) funds";
  };

  const handleCardClick = (type, item = null) => {
    setSelectedCard({ type, item });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Modal Content
  const renderModalContent = () => {
    if (!selectedCard) return null;

    const { type, item } = selectedCard;

    if (type === 'learnMore' && aboutData) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{aboutData.title || 'About AltDB'}</h3>
              <p className="text-sm text-gray-500">Everything you need to know</p>
            </div>
          </div>
          
          <div className="bg-blue-50/30 rounded-xl p-6 border border-blue-100">
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              {renderHTML(aboutData.short_description)}
            </div>
          </div>
        </div>
      );
    }

    if (type === 'research' && item) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50/30 rounded-xl p-6 border border-blue-100">
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              {renderHTML(item.description)}
            </div>
          </div>
        </div>
      );
    }

    if (type === 'literacy' && item) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-2xl">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                {item.date}
              </p>
            </div>
          </div>
          
          <div className="bg-purple-50/30 rounded-xl p-6 border border-purple-100">
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              {renderHTML(item.description)}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Get heading and description from API
  const heading = section?.heading || "Welcome to Alternative Funds Database";
  const description = section?.description || "<p>A Comprehensive Guide to Alternative Funds in Canada</p>";
  
  // Extract focus data from aboutData
  const focusDescription = getFocusDescription(aboutData?.short_description);
  const focusPoints = extractFocusPoints(aboutData?.short_description) || [
    "We put liquid alternatives, hedge funds and private asset funds all in one place.",
    "AltDB is an easy to use screener based on real world allocator criteria."
  ];

  return (
    <>
      <section className="w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 py-12 lg:py-16 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10" ref={ref}>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView && !hasAnimated ? { opacity: 1, y: 0 } : hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView && !hasAnimated ? { scale: 1 } : hasAnimated ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-4"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Alternative Investments</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={isInView && !hasAnimated ? { opacity: 1 } : hasAnimated ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900"
            >
              {heading}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView && !hasAnimated ? { opacity: 1 } : hasAnimated ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-gray-500 mt-2 max-w-2xl mx-auto text-sm md:text-base"
            >
              {renderHTML(description)}
            </motion.div>
          </motion.div>

          {/* GRID - All cards with equal height */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-6"
          >
            {/* LEFT CONTENT - Fixed height card */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-1 h-[320px] lg:h-[380px] flex flex-col bg-white/50 backdrop-blur-sm rounded-2xl p-5 lg:p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleCardClick('learnMore')}
            >
              <div className="flex-1 flex flex-col justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView && !hasAnimated ? { opacity: 1, x: 0 } : hasAnimated ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-blue-600">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Our Focus</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm line-clamp-2">
                    {focusDescription}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView && !hasAnimated ? { opacity: 1, x: 0 } : hasAnimated ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 }}
                  className="space-y-1.5 flex-1"
                >
                  {focusPoints.slice(0, 2).map((point, index) => (
                    <p key={index} className="text-gray-600 leading-relaxed text-sm flex items-start gap-2 line-clamp-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{point.replace(/^[•✓]\s*/, '')}</span>
                    </p>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView && !hasAnimated ? { opacity: 1 } : hasAnimated ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 }}
                  className="pt-2"
                >
                  <button 
                    className="group inline-flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick('learnMore');
                    }}
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* CENTER IMAGE CARD - Fixed height */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="lg:col-span-1 h-[320px] lg:h-[380px]"
            >
              <div className="relative rounded-2xl overflow-hidden h-full w-full">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src={section?.image || "/arbutus-web/assets/Home/Hero/card1.png"}
                  alt={section?.heading || "AltDB"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-lg flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-700">Live Data</span>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView && !hasAnimated ? { opacity: 1, y: 0 } : hasAnimated ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-medium text-gray-700">AltDB Screener</span>
                    </div>
                    <span className="text-xs text-blue-600 font-semibold">2,500+ Funds</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PieChart className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-xs font-medium text-gray-700">Asset Classes</span>
                    </div>
                    <span className="text-xs text-purple-600 font-semibold">12 Categories</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* RIGHT CARD 1 - Research - Fixed height */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-blue-50/80 to-blue-100/30 backdrop-blur-sm rounded-2xl p-5 lg:p-6 text-sm h-[320px] lg:h-[380px] border border-blue-100/30 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => handleCardClick('research', researchItems[0])}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Latest Research
                  </h3>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 overflow-hidden">
                {researchItems.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView && !hasAnimated ? { opacity: 1, x: 0 } : hasAnimated ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="group/item p-2 rounded-lg hover:bg-white/50 transition-all duration-200 cursor-pointer border-b border-blue-100/30 last:border-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick('research', item);
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                    <p className="text-gray-700 text-sm font-medium group-hover/item:text-blue-600 transition-colors line-clamp-1">
                      {item.title}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors pt-2 border-t border-blue-100/30 mt-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick('research', researchItems[0]);
                }}
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </motion.div>

            {/* RIGHT CARD 2 - Literacy - Fixed height */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-purple-50/80 to-purple-100/30 backdrop-blur-sm rounded-2xl p-5 lg:p-6 text-sm h-[320px] lg:h-[380px] border border-purple-100/30 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => handleCardClick('literacy', literacyItems[0])}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-500/10 rounded-lg">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Literacy Hub
                  </h3>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 overflow-hidden">
                {literacyItems.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={isInView && !hasAnimated ? { opacity: 1, x: 0 } : hasAnimated ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: -4 }}
                    className="group/item p-2 rounded-lg hover:bg-white/50 transition-all duration-200 cursor-pointer border-b border-purple-100/30 last:border-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick('literacy', item);
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                    <p className="text-gray-700 text-sm font-medium group-hover/item:text-purple-600 transition-colors line-clamp-1">
                      {item.title}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-1 text-xs text-purple-600 font-medium hover:text-purple-700 transition-colors pt-2 border-t border-purple-100/30 mt-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick('literacy', literacyItems[0]);
                }}
              >
                Explore
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modal/Popup */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors z-10"
            >
              <X className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
            </button>

            {/* Modal Content */}
            <div className="p-6 lg:p-8">
              {renderModalContent()}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 px-6 lg:p-8 py-4 bg-gray-50/50 rounded-b-3xl">
              <button
                onClick={handleCloseModal}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AltDBSection;