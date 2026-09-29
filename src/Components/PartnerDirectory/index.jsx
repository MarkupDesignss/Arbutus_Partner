import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  BarChart3,
  Star,
  Link2,
  ArrowRight,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  useGetMemberPageQuery,
  useGetWebBannersQuery,
} from "../../Redux/api/publicApiSlice";

const FALLBACK_CARD_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85";

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=90";

/* ============================================================================
   HELPERS
============================================================================ */

const cleanImageUrl = (url) => {
  if (!url) return "";

  const value = String(url).trim();

  const markdownMatch = value.match(/\((https?:\/\/[^)]+)\)/);

  if (markdownMatch?.[1]) {
    return markdownMatch[1];
  }

  return value;
};

const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
};

/* ============================================================================
   ANIMATION VARIANTS
============================================================================ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.985,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  exit: {
    opacity: 0,
    y: -10,
    scale: 0.985,
    transition: {
      duration: 0.22,
      ease: "easeIn",
    },
  },
};

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const heroTextVariants = {
  hidden: {
    opacity: 0,
    x: -25,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const heroImageVariants = {
  hidden: {
    scale: 1.06,
    opacity: 0,
  },

  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

/* ============================================================================
   PARTNER CARD
============================================================================ */

const PartnerCard = ({ partner }) => {
  const hasWebsite = Boolean(partner?.website_url);
  const hasCtaUrl = Boolean(partner?.cta_url);

  const memberId = partner?.id;

  const contactUrl = hasCtaUrl
    ? partner.cta_url
    : "/arbutus-web/Contactmain";

  const contactText = partner?.cta_text || "Contact Member";

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{
        y: -4,
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      }}
      className="
        group bg-white rounded-[10px] overflow-hidden
        border border-[#E8E8E8]
        shadow-[0_2px_10px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_28px_rgba(0,0,0,0.11)]
        transition-shadow duration-300
        min-h-[425px] flex flex-col w-full
      "
    >
      {/* CARD IMAGE / LOGO */}
      <div
        className="
          relative h-[115px] shrink-0 overflow-hidden
          bg-transparent flex items-center
          justify-center px-[25px]
        "
      >
        <motion.img
          src={cleanImageUrl(partner?.logo_url) || FALLBACK_CARD_IMAGE}
          alt={`${partner?.name || "Partner"} logo`}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.04 }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className="
            max-w-full max-h-full
            w-auto h-auto object-contain
          "
          onError={(e) => {
            e.currentTarget.src = FALLBACK_CARD_IMAGE;
          }}
        />
      </div>

      {/* CARD CONTENT */}
      <div className="flex flex-col flex-1 px-[26px] pt-[24px] pb-[18px]">
        <h3
          className="
            text-[18px] font-bold text-[#37434a]
            leading-[24px] tracking-[-0.01em] mb-[7px]
          "
        >
          {partner?.name || "Partner"}
        </h3>

        <p
          className="
            text-[14px] font-normal text-[#666666]
            leading-[23px] line-clamp-2 min-h-[46px]
            overflow-hidden mb-[13px]
          "
        >
          {partner?.description || "No description available."}
        </p>

        <motion.span
          whileHover={{ scale: 1.02 }}
          transition={{
            duration: 0.2,
          }}
          className="
            self-start inline-flex items-center justify-center
            bg-[#eef2fb] text-[#315dcc]
            rounded-full px-[14px] h-[28px]
            text-[12px] leading-none font-medium
            tracking-[0.01em] mb-[18px]
          "
        >
          {partner?.category || "General"}
        </motion.span>

        {/* BUTTONS */}
        <div className="mt-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] mb-[16px]">
            {/* WEBSITE */}
            <motion.a
              href={hasWebsite ? partner.website_url : "#"}
              target={hasWebsite ? "_blank" : undefined}
              rel={hasWebsite ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (!hasWebsite) {
                  e.preventDefault();
                }
              }}
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.988 }}
              transition={{
                duration: 0.18,
              }}
              className="
                h-[43px] w-full
                border border-[#E8E8E8]
                rounded-[7px] bg-white
                text-[#315dcc] text-[14px]
                font-medium flex items-center
                justify-center gap-[10px]
                hover:bg-[#f8faff]
                hover:border-[#cad4ea]
                transition-all cursor-pointer
              "
            >
              <Link2
                size={16}
                strokeWidth={1.9}
                className="shrink-0"
              />

              <span>Website Link</span>
            </motion.a>

            {/* CONTACT */}
            <motion.a
              href={contactUrl}
              target={hasCtaUrl ? "_blank" : undefined}
              rel={hasCtaUrl ? "noopener noreferrer" : undefined}
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.988 }}
              transition={{
                duration: 0.18,
              }}
              className="
                h-[43px] w-full
                border border-[#E8E8E8]
                rounded-[7px] bg-white
                text-[#315dcc] text-[14px]
                font-medium flex items-center
                justify-center gap-[10px]
                hover:bg-[#f8faff]
                hover:border-[#cad4ea]
                transition-all cursor-pointer
              "
            >
              <Mail
                size={16}
                strokeWidth={1.9}
                className="shrink-0"
              />

              <span>{contactText}</span>
            </motion.a>
          </div>

          {/* READ MORE */}
          <Link
            to={`/FieraRealEstate/${memberId}`}
            className="block"
          >
            <motion.div
              whileHover={{ scale: 1.008 }}
              whileTap={{ scale: 0.992 }}
              transition={{
                duration: 0.18,
              }}
              className="
                h-[42px] w-full
                bg-[#315dcc]
                hover:bg-[#2852b5]
                rounded-[7px]
                text-white text-[14px]
                font-medium
                flex items-center
                justify-center gap-[8px]
                transition-colors
                cursor-pointer
              "
            >
              <span>Read More</span>

              <motion.span
                className="flex items-center"
                whileHover={{ x: 3 }}
                transition={{
                  duration: 0.2,
                }}
              >
                <ArrowRight
                  size={17}
                  strokeWidth={2}
                />
              </motion.span>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/* ============================================================================
   SKELETON CARD
============================================================================ */

const SkeletonCard = ({ index = 0 }) => (
  <motion.div
    initial={{
      opacity: 0,
      y: 15,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      delay: index * 0.05,
      duration: 0.35,
    }}
    className="
      bg-white rounded-[10px] overflow-hidden
      border border-[#E8E8E8]
      min-h-[425px] animate-pulse w-full
    "
  >
    <div className="h-[115px] bg-gray-200" />

    <div className="px-[26px] pt-[24px] pb-[18px]">
      <div className="h-[22px] w-[55%] bg-gray-200 rounded mb-[10px]" />

      <div className="h-[45px] bg-gray-200 rounded mb-[15px]" />

      <div className="h-[28px] w-[140px] bg-gray-200 rounded-full mb-[18px]" />

      <div className="grid grid-cols-2 gap-[10px] mb-[16px]">
        <div className="h-[43px] bg-gray-200 rounded" />
        <div className="h-[43px] bg-gray-200 rounded" />
      </div>

      <div className="h-[42px] bg-gray-200 rounded" />
    </div>
  </motion.div>
);

/* ============================================================================
   PAGINATION
============================================================================ */

const Pagination = ({
  currentPage,
  lastPage,
  onPageChange,
  isFetching,
}) => {
  if (!lastPage || lastPage <= 1) {
    return null;
  }

  const pages = [];

  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  return (
    <div
      className="
        flex flex-wrap items-center
        justify-center gap-[8px] mt-[42px]
      "
    >
      {/* PREVIOUS */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isFetching}
        className={`
          h-[42px] min-w-[42px] px-[12px]
          rounded-[7px]
          border border-[#E3E3E3]
          bg-white text-[#315dcc]
          flex items-center justify-center
          transition-all duration-200
          ${
            currentPage === 1 || isFetching
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer hover:bg-[#f6f8fd] hover:border-[#cdd7ec]"
          }
        `}
      >
        <ChevronLeft size={18} />
      </button>

      {/* PAGE NUMBERS */}
      {pages.map((page) => (
        <motion.button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          disabled={isFetching}
          whileTap={{ scale: 0.96 }}
          className={`
            h-[42px] min-w-[42px] px-[12px]
            rounded-[7px]
            border
            text-[14px] font-medium
            flex items-center justify-center
            transition-all duration-200
            ${
              currentPage === page
                ? "bg-[#315dcc] border-[#315dcc] text-white shadow-[0_4px_12px_rgba(49,93,204,0.18)] cursor-default"
                : isFetching
                ? "bg-white border-[#E3E3E3] text-[#555555] opacity-50 cursor-not-allowed"
                : "bg-white border-[#E3E3E3] text-[#555555] hover:bg-[#f6f8fd] hover:border-[#cdd7ec] hover:text-[#315dcc] cursor-pointer"
            }
          `}
        >
          {page}
        </motion.button>
      ))}

      {/* NEXT */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage || isFetching}
        className={`
          h-[42px] min-w-[42px] px-[12px]
          rounded-[7px]
          border border-[#E3E3E3]
          bg-white text-[#315dcc]
          flex items-center justify-center
          transition-all duration-200
          ${
            currentPage === lastPage || isFetching
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer hover:bg-[#f6f8fd] hover:border-[#cdd7ec]"
          }
        `}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

const PartnerDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("az");

  const [currentPage, setCurrentPage] = useState(1);

  /* SEARCH / FILTER BAR REF */
  const filterBarRef = useRef(null);
  const pendingScrollRef = useRef(false);

  const debouncedSearch = useDebouncedValue(
    searchQuery,
    350
  );

  /* ==========================================================================
     MEMBER API
  ========================================================================== */

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetMemberPageQuery({
    page: currentPage,
    per_page: 9,
  });

  /* ==========================================================================
     WEB BANNER API
  ========================================================================== */

  const {
    data: webBannerResponse,
    isLoading: isBannerLoading,
  } = useGetWebBannersQuery();

  /* ==========================================================================
     PARTNER DIRECTORY PAGE
  ========================================================================== */

  const partnerDirectoryPage = useMemo(() => {
    const pages = webBannerResponse?.data || [];

    return (
      pages.find(
        (item) =>
          String(item?.slug || "").toLowerCase() ===
          "partner-directory"
      ) || null
    );
  }, [webBannerResponse]);

  /* ==========================================================================
     HERO DATA
  ========================================================================== */

  const heroLabel =
    partnerDirectoryPage?.label || "Our Network";

  const heroTitle =
    partnerDirectoryPage?.title || "Partner Directory";

  const heroImage =
    cleanImageUrl(
      partnerDirectoryPage?.banner_image
    ) || FALLBACK_HERO_IMAGE;

  /* ==========================================================================
     API DATA
  ========================================================================== */

  const members = response?.data?.items || [];

  const categories =
    response?.data?.filters?.categories || [];

  const sortOptions =
    response?.data?.filters?.sort_options || [
      {
        value: "az",
        label: "Sort by A-Z",
      },
      {
        value: "za",
        label: "Sort by Z-A",
      },
      {
        value: "order",
        label: "Default Order",
      },
    ];

  const pagination =
    response?.data?.pagination || {};

  const totalRecords = Number(
    pagination?.total || 0
  );

  const lastPage = Number(
    pagination?.last_page || 1
  );

  const apiCurrentPage = Number(
    pagination?.current_page || currentPage
  );

  /* ==========================================================================
     RESET PAGE ON FILTER
  ========================================================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, sortBy]);

  /* ==========================================================================
     FILTER + SORT
  ========================================================================== */

  const filteredPartners = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();

    let data = [...members];

    if (query) {
      data = data.filter(
        (p) =>
          p?.name?.toLowerCase().includes(query) ||
          p?.description?.toLowerCase().includes(query) ||
          p?.category?.toLowerCase().includes(query)
      );
    }

    if (category !== "All Categories") {
      data = data.filter(
        (p) =>
          p?.category?.toLowerCase() ===
          category.toLowerCase()
      );
    }

    if (sortBy === "az") {
      data.sort((a, b) =>
        (a?.name || "").localeCompare(
          b?.name || ""
        )
      );
    } else if (sortBy === "za") {
      data.sort((a, b) =>
        (b?.name || "").localeCompare(
          a?.name || ""
        )
      );
    } else if (sortBy === "order") {
      data.sort(
        (a, b) =>
          Number(a?.display_order || 0) -
          Number(b?.display_order || 0)
      );
    }

    return data;
  }, [
    members,
    debouncedSearch,
    category,
    sortBy,
  ]);

  /* ==========================================================================
     PENDING SCROLL EFFECT
     — Runs AFTER new data arrives (isFetching becomes false)
  ========================================================================== */

  useEffect(() => {
    if (!pendingScrollRef.current) return;
    if (isFetching) return;

    pendingScrollRef.current = false;

    // Wait for layout/framer-motion + ScrollToTop (100ms) to settle
    const timer = setTimeout(() => {
      const el = document.getElementById("partner-search-bar");

      if (el) {
        const top =
          el.getBoundingClientRect().top + window.scrollY - 20;

        window.scrollTo({
          top: Math.max(top, 0),
          behavior: "smooth",
        });
      } else if (filterBarRef.current) {
        const top =
          filterBarRef.current.getBoundingClientRect().top +
          window.scrollY -
          20;

        window.scrollTo({
          top: Math.max(top, 0),
          behavior: "smooth",
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isFetching]);

  /* ==========================================================================
     PAGE CHANGE
  ========================================================================== */

  const handlePageChange = (page) => {
    if (page < 1) return;
    if (page > lastPage) return;
    if (page === currentPage) return;

    // Mark that we need to scroll once data loads
    pendingScrollRef.current = true;

    setCurrentPage(page);
  };

  /* ==========================================================================
     INITIAL LOADING
  ========================================================================== */

  const isInitialLoading =
    (isLoading || isBannerLoading) &&
    members.length === 0;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#F6F6F600]">
        {/* HERO SKELETON */}
        <section
          className="
            relative w-full min-h-[360px]
            overflow-hidden bg-gray-200
            animate-pulse
          "
        >
          <div className="absolute inset-0 bg-gray-200" />

          <div
            className="
              relative z-10 max-w-7xl mx-auto
              min-h-[360px] flex items-center
              px-[20px] sm:px-[40px] lg:px-0
            "
          >
            <div className="w-full lg:w-[60%] py-[50px]">
              <div className="w-[120px] h-[14px] bg-gray-300 rounded mb-[18px]" />

              <div className="w-[420px] max-w-full h-[44px] bg-gray-300 rounded mb-[25px]" />

              <div className="flex flex-wrap gap-[18px]">
                <div className="w-[170px] h-[42px] bg-gray-300 rounded-full" />

                <div className="w-[220px] h-[42px] bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* FILTER SKELETON */}
        <section className="bg-[#F6F6F600]">
          <div
            className="
              max-w-7xl mx-auto
              px-[20px] lg:px-0 py-[28px]
              flex flex-col lg:flex-row gap-[20px]
            "
          >
            <div className="flex-1 h-[47px] bg-gray-200 rounded-full animate-pulse" />

            <div className="w-full lg:w-[255px] h-[47px] bg-gray-200 rounded-full animate-pulse" />

            <div className="w-full lg:w-[255px] h-[47px] bg-gray-200 rounded-full animate-pulse" />
          </div>
        </section>

        {/* CARD SKELETON */}
        <main
          className="
            max-w-7xl mx-auto
            px-[20px] lg:px-0 pb-[70px]
          "
        >
          <div
            className="
              grid grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-[20px]
            "
          >
            {Array.from({ length: 9 }).map(
              (_, i) => (
                <SkeletonCard
                  key={i}
                  index={i}
                />
              )
            )}
          </div>
        </main>
      </div>
    );
  }

  /* ==========================================================================
     JSX
  ========================================================================== */

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="
        min-h-screen bg-[#F6F6F600]
        text-[#273238] font-sans
      "
    >
      {/* ================= HERO BANNER ================= */}
      <section className="relative w-full overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroImageVariants}
          className="
            absolute inset-0 w-full h-full
            overflow-hidden
          "
        >
          <motion.img
            src={heroImage}
            alt={heroTitle || "Partner Directory"}
            initial={{
              scale: 1.05,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              duration: 1.25,
              ease: "easeOut",
            }}
            className="
              absolute inset-0
              w-full h-full
              object-cover object-center
            "
            onError={(e) => {
              e.currentTarget.src =
                FALLBACK_HERO_IMAGE;
            }}
          />

          <div
            className="
              absolute inset-0
              bg-gradient-to-r
              from-white via-white/90
              via-[38%] to-white/10
            "
          />

          <div
            className="
              absolute inset-x-0 bottom-0
              h-[80px]
              bg-gradient-to-t
              from-white/70 to-transparent
            "
          />
        </motion.div>

        <div
          className="
            relative z-10
            max-w-7xl mx-auto
            min-h-[360px]
            flex items-center
            px-[20px] sm:px-[40px]
            lg:px-0
          "
        >
          <motion.div
            variants={fadeUpVariants}
            className="
              w-full lg:w-[62%]
              py-[55px]
            "
          >
            <motion.div
              variants={heroTextVariants}
              className="
                flex items-center gap-[10px]
                mb-[22px]
              "
            >
              <span
                className="
                  text-[14px] font-bold
                  uppercase tracking-[0.01em]
                  text-[#36434a]
                  whitespace-nowrap
                "
              >
                {heroLabel}
              </span>

              <span
                className="
                  h-[2px] w-[54px]
                  bg-[#d9dde0]
                "
              />
            </motion.div>

            <motion.h1
              variants={heroTextVariants}
              className="
                text-[25px] sm:text-[30px]
                lg:text-[30px] font-medium
                text-[#111111]
                leading-[1.08]
                tracking-[-0.025em]
                mb-[30px]
                max-w-[550px]
              "
            >
              {heroTitle}
            </motion.h1>

            <motion.div
              variants={containerVariants}
              className="
                flex flex-wrap
                items-center gap-[18px]
              "
            >
              <motion.div
                variants={fadeUpVariants}
                whileHover={{
                  y: -2,
                }}
                className="
                  flex items-center gap-[9px]
                  bg-white/80
                  backdrop-blur-[5px]
                  rounded-full
                  px-[8px] pr-[16px]
                  py-[4px]
                  shadow-[0_4px_18px_rgba(0,0,0,0.05)]
                "
              >
                <span
                  className="
                    w-[36px] h-[36px]
                    rounded-full
                    bg-[#e4ebfa]
                    flex items-center
                    justify-center
                    shrink-0
                  "
                >
                  <BarChart3
                    size={18}
                    strokeWidth={2}
                    className="text-[#315dcc]"
                  />
                </span>

                <span
                  className="
                    text-[16px]
                    text-[#222222]
                    font-normal
                  "
                >
                  Insights
                </span>
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                whileHover={{
                  y: -2,
                }}
                className="
                  flex items-center gap-[9px]
                  bg-white/80
                  backdrop-blur-[5px]
                  rounded-full
                  px-[8px] pr-[16px]
                  py-[4px]
                  shadow-[0_4px_18px_rgba(0,0,0,0.05)]
                "
              >
                <span
                  className="
                    w-[36px] h-[36px]
                    rounded-full
                    bg-[#e4ebfa]
                    flex items-center
                    justify-center
                    shrink-0
                  "
                >
                  <Star
                    size={17}
                    strokeWidth={2}
                    fill="currentColor"
                    className="text-[#315dcc]"
                  />
                </span>

                <span
                  className="
                    text-[16px]
                    text-[#222222]
                    font-normal
                  "
                >
                  Shared Expertise
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= SEARCH + FILTER BAR ================= */}
      <motion.section
        ref={filterBarRef}
        variants={fadeUpVariants}
        className="
          bg-[#F6F6F600]
          scroll-mt-[20px]
        "
      >
        <div
          className="
            max-w-7xl mx-auto
            px-[20px] lg:px-0
            py-[28px]
            flex flex-col
            lg:flex-row
            items-stretch
            lg:items-center
            gap-[20px]
          "
        >
          {/* SEARCH */}
          <div
            id="partner-search-bar"
            className="relative flex-1 scroll-mt-[20px]"
          >
            <Search
              size={19}
              strokeWidth={1.8}
              className="
                absolute
                left-[27px]
                top-1/2
                -translate-y-1/2
                text-[#7d9ce3]
              "
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Search members by name, industry or keyword..."
              className="
                w-full h-[47px]
                pl-[58px] pr-[20px]
                rounded-full
                bg-[#f7f7f7]
                border border-transparent
                text-[14px]
                text-[#444444]
                placeholder:text-[#7d9ce3]
                outline-none
                focus:bg-white
                focus:border-[#d7e0f6]
                transition-all
              "
            />
          </div>

          {/* CATEGORY */}
          <div
            className="
              relative
              w-full lg:w-[255px]
              shrink-0
            "
          >
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="
                appearance-none
                w-full h-[47px]
                px-[18px] pr-[48px]
                rounded-full
                bg-white
                border border-[#E8E8E8]
                text-[14px]
                text-[#7895d8]
                outline-none
                cursor-pointer
                focus:border-[#b9c7e8]
                transition-colors
              "
            >
              <option value="All Categories">
                All Categories
              </option>

              {categories.map(
                (item, index) => (
                  <option
                    key={`${item}-${index}`}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={17}
              strokeWidth={1.8}
              className="
                absolute
                right-[19px]
                top-1/2
                -translate-y-1/2
                text-[#111111]
                pointer-events-none
              "
            />
          </div>

          {/* SORT */}
          <div
            className="
              relative
              w-full lg:w-[255px]
              shrink-0
            "
          >
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              className="
                appearance-none
                w-full h-[47px]
                px-[18px] pr-[48px]
                rounded-full
                bg-white
                border border-[#E8E8E8]
                text-[14px]
                text-[#7895d8]
                outline-none
                cursor-pointer
                focus:border-[#b9c7e8]
                transition-colors
              "
            >
              {sortOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={17}
              strokeWidth={1.8}
              className="
                absolute
                right-[19px]
                top-1/2
                -translate-y-1/2
                text-[#111111]
                pointer-events-none
              "
            />
          </div>
        </div>
      </motion.section>

      {/* ================= PARTNER GRID ================= */}
      <main
        className="
          max-w-7xl mx-auto
          px-[20px] lg:px-0
          pt-[17px]
          pb-[70px]
        "
      >
        {isError ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="
              text-center
              py-[100px]
              text-[14px]
              text-[#999999]
            "
          >
            Unable to load members.
            Please try again.
          </motion.div>
        ) : (
          <div className="relative">
            {/* REFRESHING BAR */}
            <AnimatePresence>
              {isFetching && (
                <motion.div
                  key="refreshing-bar"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="
                    absolute
                    -top-[6px]
                    left-0 right-0
                    h-[2px]
                    overflow-hidden
                    rounded-full
                    z-20
                  "
                >
                  <motion.div
                    initial={{
                      x: "-40%",
                    }}
                    animate={{
                      x: "140%",
                    }}
                    transition={{
                      duration: 1.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      h-full w-[40%]
                      rounded-full
                      bg-gradient-to-r
                      from-transparent
                      via-[#315dcc]
                      to-transparent
                    "
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* GRID */}
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-[20px]
                transition-[filter,opacity]
                duration-300
                ease-out
                ${
                  isFetching
                    ? "opacity-70 blur-[1px]"
                    : "opacity-100 blur-0"
                }
              `}
            >
              <AnimatePresence mode="popLayout">
                {filteredPartners.map(
                  (partner) => (
                    <PartnerCard
                      key={partner.id}
                      partner={partner}
                    />
                  )
                )}
              </AnimatePresence>
            </motion.div>

            {/* NO RESULTS */}
            <AnimatePresence>
              {!isError &&
                filteredPartners.length === 0 && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.98,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="
                      text-center
                      py-[100px]
                      text-[14px]
                      text-[#999999]
                    "
                  >
                    No members found
                    matching your
                    search.
                  </motion.div>
                )}
            </AnimatePresence>

            {/* PAGINATION */}
            {totalRecords > 0 &&
              lastPage > 1 && (
                <Pagination
                  currentPage={apiCurrentPage}
                  lastPage={lastPage}
                  onPageChange={
                    handlePageChange
                  }
                  isFetching={
                    isFetching
                  }
                />
              )}

            {/* PAGE INFO */}
            {totalRecords > 0 && (
              <div className="text-center mt-[14px]">
                <span
                  className="
                    text-[13px]
                    text-[#999999]
                  "
                >
                  Page{" "}
                  {apiCurrentPage} of{" "}
                  {lastPage}
                  {" · "}
                  {totalRecords}{" "}
                  members
                </span>
              </div>
            )}
          </div>
        )}
      </main>
    </motion.div>
  );
};

export default PartnerDirectory;