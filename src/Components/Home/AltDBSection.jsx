import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  ArrowRight,
  FileText,
  BookOpen,
  Sparkles,
  Zap,
  ChevronRight,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Target,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGetatlsectionQuery } from "../../Redux/api/publicApiSlice";

// Poppins font stack
const POPPINS = "'Poppins', sans-serif";

const AltDBSection = ({ onExploreClick }) => {
  const controls = useAnimation();
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
  });

  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [controls, isInView, hasAnimated]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 30,
      opacity: 0,
    },
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
    hidden: {
      y: 40,
      opacity: 0,
      scale: 0.95,
    },
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

  // =========================
  // SECTION CONTENT
  // =========================
  const contentItems = section?.content || [];

  // =========================
  // ABOUT DATA
  // =========================
  const aboutData = contentItems?.[0] || null;

  // =========================
  // FIND LITERACY HUB ITEM
  // =========================
  const literacyData =
    contentItems.find(
      (item) =>
        item?.title?.trim()?.toLowerCase() === "literacy hub"
    ) || null;

  // =========================
  // RENDER HTML
  // =========================
  const renderHTML = (htmlContent) => {
    if (!htmlContent) return null;

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />
    );
  };

  // =========================
  // EXTRACT DATE
  // =========================
  const extractDate = (htmlContent) => {
    if (!htmlContent) return null;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    const paragraphs = tempDiv.querySelectorAll("p");

    for (const p of paragraphs) {
      const text = p.textContent.trim();

      const monthYearMatch = text.match(
        /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i
      );

      if (monthYearMatch) {
        return monthYearMatch[0];
      }

      const fullDateMatch = text.match(
        /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}$/i
      );

      if (fullDateMatch) {
        return fullDateMatch[0];
      }
    }

    return null;
  };

  // =========================
  // EXTRACT URL
  // =========================
  const extractURL = (htmlContent) => {
    if (!htmlContent) return null;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    const anchor = tempDiv.querySelector("a[href]");

    if (anchor?.href) {
      return anchor.href;
    }

    const text = tempDiv.textContent || "";

    const match = text.match(/https?:\/\/[^\s<>"']+/i);

    if (!match) {
      return null;
    }

    return match[0].replace(/[),.;]+$/, "");
  };

  // =========================
  // EXTRACT FOCUS POINTS
  // =========================
  const extractFocusPoints = (htmlContent) => {
    if (!htmlContent) return null;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    const paragraphs = tempDiv.querySelectorAll("p");
    const focusPoints = [];

    paragraphs.forEach((p) => {
      const text = p.textContent.trim();

      if (
        text.includes("✓") ||
        text.includes("•") ||
        text.includes("We put") ||
        text.includes("AltDB is") ||
        text.includes("focus") ||
        text.includes("Focus") ||
        text.includes("We believe")
      ) {
        focusPoints.push(text);
      }
    });

    return focusPoints.length > 0 ? focusPoints : null;
  };

  // =========================
  // FOCUS DESCRIPTION
  // =========================
  const getFocusDescription = (htmlContent) => {
    if (!htmlContent) {
      return "We are focused on evergreen (open end) funds";
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    const paragraphs = tempDiv.querySelectorAll("p");

    for (const p of paragraphs) {
      const text = p.textContent.trim();

      if (
        text.toLowerCase().includes("focus") ||
        text.toLowerCase().includes("mission") ||
        text.toLowerCase().includes("dedicated")
      ) {
        return text;
      }
    }

    return paragraphs.length > 0
      ? paragraphs[0].textContent.trim()
      : "We are focused on evergreen (open end) funds";
  };

  // =========================
  // COMMENTARY ITEMS
  // =========================
  const researchItems =
    contentItems.length > 1
      ? contentItems
        .filter(
          (item) =>
            item?.title?.trim()?.toLowerCase() !==
            "literacy hub"
        )
        .slice(0, 4)
        .map((item) => ({
          title: item.title,
          description: item.short_description,
          date:
            extractDate(item.short_description) ||
            new Date(section?.created_at || Date.now()).toLocaleDateString(
              "en-US",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            ),
          url: extractURL(item.short_description),
        }))
      : [];

  // =========================
  // LITERACY HUB PARAGRAPHS
  // =========================
  const literacyPoints = (() => {
    if (!literacyData?.short_description) return [];

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = literacyData.short_description;

    return Array.from(tempDiv.querySelectorAll("p"))
      .map((p) => p.textContent.trim())
      .filter(Boolean);
  })();

  // =========================
  // MODAL
  // =========================
  const handleCardClick = (type, item = null) => {
    setSelectedCard({
      type,
      item,
    });

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setTimeout(() => {
      setSelectedCard(null);
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // =========================
  // LITERACY NAVIGATION
  // =========================
  const handleLiteracyItemClick = (item) => {
    navigate("/ArticlePage", {
      state: {
        title: literacyData?.title || "Literacy Hub",
        description: literacyData?.short_description || "",
        date: extractDate(literacyData?.short_description),
        selectedItem: item,
      },
    });
  };

  // =========================
  // MODAL CONTENT
  // =========================
  const renderModalContent = () => {
    if (!selectedCard) return null;

    const { type } = selectedCard;

    if (type === "learnMore" && aboutData) {
      return (
        <div className="space-y-6" style={{ fontFamily: POPPINS }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10">
              <Target className="w-8 h-8 text-blue-600" />
            </div>

            <div>
              <h3
                className="text-[20px] md:text-[22px] font-bold text-gray-900"
                style={{ fontFamily: POPPINS, fontWeight: 700 }}
              >
                {aboutData.title || "About AltDB"}
              </h3>

              <p
                className="text-[12px] text-gray-500"
                style={{ fontFamily: POPPINS, fontWeight: 400 }}
              >
                Everything you need to know
              </p>
            </div>
          </div>

          <div className="bg-blue-50/30 p-5 md:p-6 border border-blue-100">
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed prose-p:text-[13px] prose-p:mb-2 prose-p:last:mb-0"
              style={{ fontFamily: POPPINS }}
            >
              {renderHTML(aboutData.short_description)}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // =========================
  // SECTION DATA
  // =========================
  const heading =
    section?.heading || "Welcome to Alternative Funds Database";

  const description =
    section?.description ||
    "<p>A Comprehensive Guide to Alternative Funds in Canada</p>";

  const focusDescription = getFocusDescription(
    aboutData?.short_description
  );

  const focusPoints =
    extractFocusPoints(aboutData?.short_description) || [
      "We put liquid alternatives, hedge funds and private asset funds all in one place for any investor or industry professional to use.",
      "We believe that to make more intelligent and better informed investment decisions, it all starts with knowing what the universe of alternative funds in Canada contains.",
    ];

  return (
    <>
      <section
        className="w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 py-10 lg:py-14 relative overflow-hidden"
        style={{ fontFamily: POPPINS }}
      >
        {/* =========================
            BACKGROUND
        ========================= */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200/20 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-200/20 blur-3xl" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/10 blur-3xl" />
        </div>

        <div
          ref={ref}
          className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10"
        >
          {/* =========================
              SECTION HEADER
          ========================= */}
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={
              isInView && !hasAnimated
                ? {
                  opacity: 1,
                  y: 0,
                }
                : hasAnimated
                  ? {
                    opacity: 1,
                    y: 0,
                  }
                  : {}
            }
            transition={{
              duration: 0.6,
            }}
            className="text-center mb-7 lg:mb-9"
          >
            <motion.div
              initial={{
                scale: 0,
              }}
              animate={
                isInView && !hasAnimated
                  ? {
                    scale: 1,
                  }
                  : hasAnimated
                    ? {
                      scale: 1,
                    }
                    : {}
              }
              transition={{
                type: "spring",
                stiffness: 200,
                delay: 0.2,
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 border border-blue-100 mb-3"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />

              <span
                className="text-[11px] font-semibold text-blue-600 uppercase"
                style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.08em" }}
              >
                Alternative Investments
              </span>
            </motion.div>

            <motion.h2
              initial={{
                opacity: 0,
              }}
              animate={
                isInView && !hasAnimated
                  ? {
                    opacity: 1,
                  }
                  : hasAnimated
                    ? {
                      opacity: 1,
                    }
                    : {}
              }
              transition={{
                delay: 0.3,
              }}
              className="text-[22px] md:text-[28px] lg:text-[32px] font-bold text-gray-900 leading-tight"
              style={{ fontFamily: POPPINS, fontWeight: 700 }}
            >
              {heading}
            </motion.h2>

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={
                isInView && !hasAnimated
                  ? {
                    opacity: 1,
                  }
                  : hasAnimated
                    ? {
                      opacity: 1,
                    }
                    : {}
              }
              transition={{
                delay: 0.4,
              }}
              className="text-gray-500 mt-2 max-w-2xl mx-auto text-[13px] md:text-[14px] prose prose-sm prose-p:mb-0 prose-p:last:mb-0"
              style={{ fontFamily: POPPINS, fontWeight: 400 }}
            >
              {renderHTML(description)}
            </motion.div>
          </motion.div>

          {/* =========================
              FOUR CARDS
          ========================= */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
          >
            {/* =========================
                CARD 1 - WELCOME
            ========================= */}
            <motion.div
              variants={itemVariants}
              className="
                aspect-square
                flex flex-col
                bg-white/60
                backdrop-blur-sm
                p-4.5
                border border-white/60
                shadow-lg
                hover:shadow-xl
                transition-all duration-300
                cursor-pointer
                overflow-hidden
              "
              style={{ fontFamily: POPPINS }}
              onClick={() => handleCardClick("learnMore")}
            >
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Target className="w-3.5 h-3.5" />

                <span
                  className="text-[10.5px] font-semibold uppercase"
                  style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.06em" }}
                >
                  Welcome
                </span>
              </div>

              <p
                className="text-gray-700 leading-snug text-[12px] line-clamp-3 mb-2.5"
                style={{ fontFamily: POPPINS, fontWeight: 400 }}
              >
                {focusDescription}
              </p>

              <div className="space-y-1.5 flex-1 overflow-hidden">
                {focusPoints.slice(0, 2).map((point, index) => (
                  <p
                    key={index}
                    className="text-gray-600 leading-snug text-[11px] flex items-start gap-1.5 line-clamp-2"
                    style={{ fontFamily: POPPINS, fontWeight: 400 }}
                  >
                    <span className="text-blue-500 mt-0.5 flex-shrink-0">
                      •
                    </span>

                    <span>{point.replace(/^[•✓]\s*/, "")}</span>
                  </p>
                ))}
              </div>

              <button
                type="button"
                className="
                  group
                  inline-flex
                  items-center
                  gap-1.5
                  text-blue-600
                  font-medium
                  text-[11px]
                  hover:text-blue-700
                  transition-colors
                  pt-2
                  mt-auto
                "
                style={{ fontFamily: POPPINS, fontWeight: 500 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick("learnMore");
                }}
              >
                Learn More

                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>

            {/* =========================
                CARD 2 - IMAGE
            ========================= */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="aspect-square"
            >
              <div className="relative overflow-hidden h-full w-full shadow-lg">
                <motion.img
                  whileHover={{
                    scale: 1.05,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  src={
                    section?.image ||
                    "/arbutus-web/assets/Home/Hero/card1.png"
                  }
                  alt={section?.heading || "AltDB"}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* LIVE DATA */}
                <div
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 shadow-md flex items-center gap-1"
                  style={{ fontFamily: POPPINS }}
                >
                  <Zap className="w-3 h-3 text-yellow-500" />

                  <span
                    className="text-[10px] font-medium text-gray-700"
                    style={{ fontFamily: POPPINS, fontWeight: 500 }}
                  >
                    Live Data
                  </span>
                </div>

                {/* STATS */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5">
                  <div
                    className="bg-white/90 backdrop-blur-sm px-2.5 py-1.5 shadow-md flex items-center justify-between"
                    style={{ fontFamily: POPPINS }}
                  >
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-3 h-3 text-blue-600" />

                      <span
                        className="text-[10px] font-medium text-gray-700"
                        style={{ fontFamily: POPPINS, fontWeight: 500 }}
                      >
                        AltDB Screener
                      </span>
                    </div>

                    <span
                      className="text-[10px] text-blue-600 font-semibold"
                      style={{ fontFamily: POPPINS, fontWeight: 600 }}
                    >
                      700+ Funds
                    </span>
                  </div>

                  <div
                    className="bg-white/85 backdrop-blur-sm px-2.5 py-1.5 shadow-md flex items-center justify-between"
                    style={{ fontFamily: POPPINS }}
                  >
                    <div className="flex items-center gap-1.5">
                      <PieChart className="w-3 h-3 text-purple-600" />

                      <span
                        className="text-[10px] font-medium text-gray-700"
                        style={{ fontFamily: POPPINS, fontWeight: 500 }}
                      >
                        Investment Strategies
                      </span>
                    </div>

                    <span
                      className="text-[10px] text-purple-600 font-semibold"
                      style={{ fontFamily: POPPINS, fontWeight: 600 }}
                    >
                      16 Categories
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* =========================
                CARD 3 - LATEST COMMENTARY
            ========================= */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="
                aspect-square
                flex flex-col
                bg-gradient-to-br from-blue-50/90 to-blue-100/40
                backdrop-blur-sm
                p-4.5
                border border-blue-100/40
                shadow-lg
                hover:shadow-xl
                transition-all duration-300
                overflow-hidden
              "
              style={{ fontFamily: POPPINS }}
            >
              {/* HEADER */}
              <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                <div className="p-1.5 bg-blue-500/10">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                </div>

                <h3
                  className="font-semibold text-gray-900 text-[12px]"
                  style={{ fontFamily: POPPINS, fontWeight: 600 }}
                >
                  Latest Commentary
                </h3>
              </div>

              {/* EXACTLY 4 VISIBLE ITEMS */}
              <div className="flex-1 min-h-0">
                <div className="h-full grid grid-rows-4">
                  {researchItems.slice(0, 4).map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="
                        min-h-0
                        flex
                        flex-col
                        justify-center
                        border-b
                        border-blue-100/60
                        last:border-0
                        overflow-hidden
                      "
                    >
                      {/* DATE */}
                      <div
                        className="flex items-center gap-1.5 text-[9px] text-gray-400 mb-0.5 flex-shrink-0"
                        style={{ fontFamily: POPPINS, fontWeight: 400 }}
                      >
                        <Calendar className="w-2.5 h-2.5 flex-shrink-0" />

                        <span className="truncate">
                          {item.date}
                        </span>
                      </div>

                      {/* TITLE */}
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item.title}
                          className="
                            block
                            w-full
                            min-w-0
                            text-left
                            text-gray-700
                            text-[10.5px]
                            font-medium
                            leading-[1.35]
                            truncate
                            hover:text-blue-600
                            transition-colors
                            cursor-pointer
                          "
                          style={{ fontFamily: POPPINS, fontWeight: 500 }}
                        >
                          {item.title}
                        </a>
                      ) : (
                        <p
                          title={item.title}
                          className="
                            block
                            w-full
                            min-w-0
                            text-gray-700
                            text-[10.5px]
                            font-medium
                            leading-[1.35]
                            truncate
                          "
                          style={{ fontFamily: POPPINS, fontWeight: 500 }}
                        >
                          {item.title}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* VIEW ALL */}
              <Link
                to="/ArticlePage"
                className="
                  inline-flex
                  items-center
                  gap-1
                  text-[11px]
                  text-blue-600
                  font-medium
                  hover:text-blue-700
                  transition-colors
                  pt-2
                  mt-2
                  flex-shrink-0
                "
                style={{ fontFamily: POPPINS, fontWeight: 500 }}
              >
                Learn more

                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>

            {/* =========================
                CARD 4 - LITERACY HUB
            ========================= */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="
                aspect-square
                flex flex-col
                bg-gradient-to-br from-purple-50/90 to-purple-100/40
                backdrop-blur-sm
                p-4.5
                border border-purple-100/40
                shadow-lg
                hover:shadow-xl
                transition-all duration-300
                cursor-pointer
                overflow-hidden
              "
              style={{ fontFamily: POPPINS }}
            >
              {/* HEADER */}
              <div className="flex items-center gap-2 mb-2.5 flex-shrink-0">
                <div className="p-1.5 bg-purple-500/10">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                </div>

                <h3
                  className="font-semibold text-gray-900 text-[12px]"
                  style={{ fontFamily: POPPINS, fontWeight: 600 }}
                >
                  {literacyData?.title || "Literacy Hub"}
                </h3>
              </div>

              {/* LITERACY CONTENT */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <div className="h-full flex flex-col justify-between">
                  {literacyPoints.slice(0, 4).map((point, index) => {
                    const isTerm = point
                      .toLowerCase()
                      .startsWith("term:");

                    const isDefinition = point
                      .toLowerCase()
                      .startsWith("definition");

                    return (
                      <div
                        key={`${point}-${index}`}
                        className="
                          flex
                          items-start
                          gap-2
                          py-1.5
                          border-b
                          border-purple-100/50
                          last:border-0
                          min-h-0
                        "
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLiteracyItemClick(point);
                        }}
                      >
                        <span
                          className={`
                            mt-1.5
                            w-1.5
                            h-1.5
                            rounded-full
                            flex-shrink-0
                            ${isTerm
                              ? "bg-purple-600"
                              : "bg-purple-300"
                            }
                          `}
                        />

                        <div className="min-w-0 flex-1">
                          <p
                            className={`
                              leading-snug
                              ${isTerm
                                ? "text-purple-700 font-semibold text-[10.5px]"
                                : "text-gray-600 font-medium text-[10.5px]"
                              }
                            `}
                            style={{
                              fontFamily: POPPINS,
                              fontWeight: isTerm ? 600 : 500,
                            }}
                          >
                            {isDefinition
                              ? "Definition"
                              : point}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EXPLORE */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExploreClick?.();
                }}
                className="
                  inline-flex
                  items-center
                  gap-1
                  text-[11px]
                  text-purple-600
                  font-medium
                  hover:text-purple-700
                  transition-colors
                  pt-2
                  border-t
                  border-purple-100/40
                  mt-2
                  flex-shrink-0
                  cursor-pointer
                  bg-transparent
                "
                style={{ fontFamily: POPPINS, fontWeight: 500 }}
              >
                Explore

                <ArrowRight className="w-3 h-3" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================
          LEARN MORE MODAL ONLY
      ========================= */}
      {isModalOpen && (
        <div
          className="
            fixed inset-0
            z-50
            flex items-center justify-center
            p-4
            bg-black/50
            backdrop-blur-sm
            animate-in
            fade-in
            duration-200
          "
          onClick={handleOverlayClick}
          style={{ fontFamily: POPPINS }}
        >
          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
              y: 20,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              y: 20,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 120,
            }}
            className="
              bg-white
              shadow-2xl
              max-w-3xl
              w-full
              max-h-[90vh]
              overflow-y-auto
              relative
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="
                absolute
                top-3
                right-3
                p-2
                hover:bg-gray-100
                cursor-pointer
                transition-colors
                z-10
              "
            >
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors" />
            </button>

            {/* CONTENT */}
            <div className="p-5 lg:p-7">
              {renderModalContent()}
            </div>

            {/* FOOTER */}
            <div className="border-t border-gray-100 px-5 lg:px-7 py-3 bg-gray-50/50">
              <button
                type="button"
                onClick={handleCloseModal}
                className="
                  w-full
                  py-2.5
                  bg-gray-100
                  hover:bg-gray-200
                  text-gray-700
                  font-medium
                  transition-colors
                  text-[12px]
                "
                style={{ fontFamily: POPPINS, fontWeight: 500 }}
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