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

/* ============================================================================
   FALLBACK IMAGES
============================================================================ */

const FALLBACK_CARD_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85";

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=90";

/* ============================================================================
   CONSTANTS
============================================================================ */

const PAGE_MAX_WIDTH = "max-w-[1320px]";

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
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
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

  const contactText =
    partner?.cta_text || "Contact Member";

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
        group
        flex
        min-h-[416px]
        w-full
        flex-col
        overflow-hidden
        rounded-[12px]
        border
        border-[#EBEBEB]
        bg-white
        shadow-[0_2px_12px_rgba(0,0,0,0.03)]
        transition-shadow
        duration-300
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
      "
    >
      {/* ================================================================
          LOGO AREA
      ================================================================= */}

      <div
        className="
          relative
          flex
          h-[108px]
          shrink-0
          items-center
          justify-center
          overflow-hidden
          border-b
          border-[#EBEBEB]
          bg-[#F5F5F5]
          px-[20px]
        "
      >
        <motion.img
          src={
            cleanImageUrl(partner?.logo_url) ||
            FALLBACK_CARD_IMAGE
          }
          alt={`${partner?.name || "Partner"} logo`}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.04 }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className="
            h-auto
            w-auto
            max-h-full
            max-w-full
            object-contain
          "
          onError={(e) => {
            e.currentTarget.src = FALLBACK_CARD_IMAGE;
          }}
        />
      </div>

      {/* ================================================================
          CONTENT
      ================================================================= */}

      <div
        className="
          flex
          flex-1
          flex-col
          px-[24px]
          pt-[22px]
          pb-[20px]
        "
      >
        <h3
          className="
            mb-[6px]
            text-[17px]
            font-semibold
            leading-[24px]
            tracking-[-0.01em]
            text-[#1D2B36]
          "
        >
          {partner?.name || "Partner"}
        </h3>

        <p
          className="
            mb-[14px]
            min-h-[44px]
            overflow-hidden
            line-clamp-2
            text-[14px]
            font-normal
            leading-[22px]
            text-[#5A6872]
          "
        >
          {partner?.description ||
            "No description available."}
        </p>

        {/* CATEGORY */}

        <motion.span
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="
            mb-[20px]
            inline-flex
            h-[28px]
            self-start
            items-center
            justify-center
            rounded-full
            bg-[#E8F0FE]
            px-[14px]
            text-[12px]
            font-normal
            leading-none
            tracking-[0.01em]
            text-[#1A56DB]
          "
        >
          {partner?.category || "General"}
        </motion.span>

        {/* BUTTONS */}

        <div className="mt-auto">
          <div
            className="
              mb-[12px]
              grid
              grid-cols-1
              gap-[10px]
              sm:grid-cols-2
            "
          >
            {/* WEBSITE */}

            <motion.a
              href={hasWebsite ? partner.website_url : "#"}
              target={
                hasWebsite ? "_blank" : undefined
              }
              rel={
                hasWebsite
                  ? "noopener noreferrer"
                  : undefined
              }
              onClick={(e) => {
                if (!hasWebsite) {
                  e.preventDefault();
                }
              }}
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.988 }}
              transition={{ duration: 0.18 }}
              className="
                flex
                h-[42px]
                w-full
                cursor-pointer
                items-center
                justify-center
                gap-[6px]
                rounded-[8px]
                border
                border-[#D9DEE5]
                bg-white
                text-[13px]
                font-normal
                text-[#315DCC]
                transition-all
                hover:border-[#B8C7E8]
                hover:bg-[#F8FAFF]
              "
            >
              <Link2
                size={15}
                strokeWidth={1.8}
                className="shrink-0"
              />

              <span>Website Link</span>
            </motion.a>

            {/* CONTACT */}

            <motion.a
              href={contactUrl}
              target={
                hasCtaUrl ? "_blank" : undefined
              }
              rel={
                hasCtaUrl
                  ? "noopener noreferrer"
                  : undefined
              }
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.988 }}
              transition={{ duration: 0.18 }}
              className="
                flex
                h-[42px]
                w-full
                cursor-pointer
                items-center
                justify-center
                gap-[6px]
                rounded-[8px]
                border
                border-[#D9DEE5]
                bg-white
                text-[13px]
                font-normal
                text-[#315DCC]
                transition-all
                hover:border-[#B8C7E8]
                hover:bg-[#F8FAFF]
              "
            >
              <Mail
                size={15}
                strokeWidth={1.8}
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
              transition={{ duration: 0.18 }}
              className="
                flex
                h-[42px]
                w-full
                cursor-pointer
                items-center
                justify-center
                gap-[8px]
                rounded-[8px]
                bg-[#315DCC]
                text-[13px]
                font-normal
                text-white
                transition-colors
                hover:bg-[#2852B5]
              "
            >
              <span>Read More</span>

              <motion.span
                className="flex items-center"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight
                  size={16}
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
      min-h-[416px]
      w-full
      animate-pulse
      overflow-hidden
      rounded-[12px]
      border
      border-[#EBEBEB]
      bg-white
    "
  >
    <div
      className="
        h-[108px]
        border-b
        border-[#EBEBEB]
        bg-[#F5F5F5]
      "
    />

    <div className="px-[24px] pt-[22px] pb-[20px]">
      <div className="mb-[10px] h-[22px] w-[55%] rounded bg-gray-200" />

      <div className="mb-[15px] h-[44px] rounded bg-gray-200" />

      <div className="mb-[20px] h-[28px] w-[140px] rounded-full bg-gray-200" />

      <div className="mb-[12px] grid grid-cols-2 gap-[10px]">
        <div className="h-[42px] rounded bg-gray-200" />
        <div className="h-[42px] rounded bg-gray-200" />
      </div>

      <div className="h-[42px] rounded bg-gray-200" />
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
    <div className="mt-[42px] flex flex-wrap items-center justify-center gap-[8px]">
      {/* PREVIOUS */}

      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        disabled={
          currentPage === 1 || isFetching
        }
        className={`
          flex
          h-[42px]
          min-w-[42px]
          items-center
          justify-center
          rounded-[7px]
          border
          border-[#E3E3E3]
          bg-white
          px-[12px]
          text-[#315dcc]
          transition-all
          duration-200

          ${
            currentPage === 1 || isFetching
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer hover:border-[#cdd7ec] hover:bg-[#f6f8fd]"
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
            flex
            h-[42px]
            min-w-[42px]
            items-center
            justify-center
            rounded-[7px]
            border
            px-[12px]
            text-[14px]
            font-normal
            transition-all
            duration-200

            ${
              currentPage === page
                ? "cursor-default border-[#315dcc] bg-[#315dcc] text-white shadow-[0_4px_12px_rgba(49,93,204,0.18)]"
                : isFetching
                  ? "cursor-not-allowed border-[#E3E3E3] bg-white text-[#555555] opacity-50"
                  : "cursor-pointer border-[#E3E3E3] bg-white text-[#555555] hover:border-[#cdd7ec] hover:bg-[#f6f8fd] hover:text-[#315dcc]"
            }
          `}
        >
          {page}
        </motion.button>
      ))}

      {/* NEXT */}

      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        disabled={
          currentPage === lastPage || isFetching
        }
        className={`
          flex
          h-[42px]
          min-w-[42px]
          items-center
          justify-center
          rounded-[7px]
          border
          border-[#E3E3E3]
          bg-white
          px-[12px]
          text-[#315dcc]
          transition-all
          duration-200

          ${
            currentPage === lastPage ||
            isFetching
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer hover:border-[#cdd7ec] hover:bg-[#f6f8fd]"
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

  const [category, setCategory] =
    useState("All Categories");

  const [sortBy, setSortBy] = useState("az");

  const [currentPage, setCurrentPage] =
    useState(1);

  const filterBarRef = useRef(null);

  const pendingScrollRef = useRef(false);

  const debouncedSearch = useDebouncedValue(
    searchQuery,
    350,
  );

  /* ==========================================================================
     API
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

  const {
    data: webBannerResponse,
    isLoading: isBannerLoading,
  } = useGetWebBannersQuery();

  /* ==========================================================================
     BANNER DATA
  ========================================================================== */

  const partnerDirectoryPage = useMemo(() => {
    const pages = webBannerResponse?.data || [];

    return (
      pages.find(
        (item) =>
          String(item?.slug || "").toLowerCase() ===
          "partner-directory",
      ) || null
    );
  }, [webBannerResponse]);

  const heroLabel =
    partnerDirectoryPage?.label ||
    "OUR NETWORK";

  const heroTitle =
    partnerDirectoryPage?.title ||
    "Partner Directory";

  const heroImage =
    cleanImageUrl(
      partnerDirectoryPage?.banner_image,
    ) || FALLBACK_HERO_IMAGE;

  /* ==========================================================================
     DATA
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
    pagination?.total || 0,
  );

  const lastPage = Number(
    pagination?.last_page || 1,
  );

  const apiCurrentPage = Number(
    pagination?.current_page || currentPage,
  );

  /* ==========================================================================
     RESET PAGE WHEN FILTER CHANGES
  ========================================================================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, sortBy]);

  /* ==========================================================================
     FILTER + SORT
  ========================================================================== */

  const filteredPartners = useMemo(() => {
    const query = debouncedSearch
      .toLowerCase()
      .trim();

    let data = [...members];

    if (query) {
      data = data.filter(
        (p) =>
          p?.name
            ?.toLowerCase()
            .includes(query) ||
          p?.description
            ?.toLowerCase()
            .includes(query) ||
          p?.category
            ?.toLowerCase()
            .includes(query),
      );
    }

    if (category !== "All Categories") {
      data = data.filter(
        (p) =>
          p?.category?.toLowerCase() ===
          category.toLowerCase(),
      );
    }

    if (sortBy === "az") {
      data.sort((a, b) =>
        (a?.name || "").localeCompare(
          b?.name || "",
        ),
      );
    } else if (sortBy === "za") {
      data.sort((a, b) =>
        (b?.name || "").localeCompare(
          a?.name || "",
        ),
      );
    } else if (sortBy === "order") {
      data.sort(
        (a, b) =>
          Number(a?.display_order || 0) -
          Number(b?.display_order || 0),
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
     PAGINATION SCROLL
  ========================================================================== */

  useEffect(() => {
    if (
      !pendingScrollRef.current ||
      isFetching
    ) {
      return;
    }

    pendingScrollRef.current = false;

    const timer = setTimeout(() => {
      const el = document.getElementById(
        "partner-search-bar",
      );

      if (el) {
        const top =
          el.getBoundingClientRect().top +
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

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > lastPage ||
      page === currentPage
    ) {
      return;
    }

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
      <div className="min-h-screen bg-white">
        {/* ================================================================
            HERO SKELETON
        ================================================================= */}

        <section
          className="
            relative
            flex
            min-h-[242px]
            w-full
            items-center
            overflow-hidden
            bg-gray-100
            animate-pulse
          "
        >
          <div
            className={`
              relative
              z-10
              mx-auto
              flex
              min-h-[242px]
              w-full
              ${PAGE_MAX_WIDTH}
              items-center
              px-6
              lg:px-0
            `}
          >
            <div className="w-full py-[40px] lg:w-[50%]">
              <div className="mb-[18px] h-[14px] w-[120px] rounded bg-gray-300" />

              <div className="mb-[22px] h-[42px] w-[420px] max-w-full rounded bg-gray-300" />

              <div className="flex flex-wrap gap-[16px]">
                <div className="h-[42px] w-[165px] rounded-full bg-gray-300" />

                <div className="h-[42px] w-[215px] rounded-full bg-gray-300" />
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            FILTER SKELETON
        ================================================================= */}

        <section className="bg-white">
          <div
            className={`
              mx-auto
              flex
              ${PAGE_MAX_WIDTH}
              flex-col
              gap-[20px]
              px-6
              py-[30px]
              lg:flex-row
              lg:items-center
              lg:px-0
            `}
          >
            <div className="h-[44px] flex-1 animate-pulse rounded-full bg-gray-200" />

            <div className="h-[44px] w-full animate-pulse rounded-full bg-gray-200 lg:w-[240px]" />

            <div className="h-[44px] w-full animate-pulse rounded-full bg-gray-200 lg:w-[240px]" />
          </div>
        </section>

        {/* ================================================================
            CARD SKELETON
        ================================================================= */}

        <main
          className={`
            mx-auto
            w-full
            ${PAGE_MAX_WIDTH}
            px-6
            pb-[70px]
            lg:px-0
          `}
        >
          <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map(
              (_, i) => (
                <SkeletonCard
                  key={i}
                  index={i}
                />
              ),
            )}
          </div>
        </main>
      </div>
    );
  }

  /* ==========================================================================
     MAIN UI
  ========================================================================== */

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="
        min-h-screen
        bg-white
        font-sans
        text-[#273238]
      "
    >
      {/* ======================================================================
          HERO
      ======================================================================= */}

      <section
        className="
          relative
          flex
          min-h-[242px]
          w-full
          items-center
          overflow-hidden
          bg-[#F9F9F9]
        "
      >
        {/* RIGHT HERO IMAGE */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroImageVariants}
          className="
            absolute
            right-0
            top-0
            h-full
            w-[56%]
            overflow-hidden
          "
        >
          <motion.img
            src={heroImage}
            alt={
              heroTitle ||
              "Partner Directory"
            }
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
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
            "
            onError={(e) => {
              e.currentTarget.src =
                FALLBACK_HERO_IMAGE;
            }}
          />

          {/* IMAGE FADE */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#F9F9F9]
              via-[#F9F9F9]/80
              to-transparent
            "
          />
        </motion.div>

        {/* HERO CONTENT */}

        <div
          className={`
            relative
            z-10
            mx-auto
            flex
            w-full
            ${PAGE_MAX_WIDTH}
            items-center
            justify-between
            px-6
            lg:px-0
          `}
        >
          {/* LEFT */}

          <motion.div
            variants={fadeUpVariants}
            className="
              w-full
              py-[28px]
              lg:w-[50%]
            "
          >
            {/* LABEL */}

            <motion.div
              variants={heroTextVariants}
              className="
                mb-[18px]
                flex
                items-center
                gap-[12px]
              "
            >
              <span
                className="
                  whitespace-nowrap
                  text-[13px]
                  font-semibold
                  uppercase
                  tracking-[0.05em]
                  text-[#36434a]
                "
              >
                {heroLabel}
              </span>

              <span
                className="
                  h-[1px]
                  w-[50px]
                  bg-[#d9dde0]
                "
              />
            </motion.div>

            {/* TITLE */}

            <motion.h1
              variants={heroTextVariants}
              className="
                mb-[20px]
                max-w-[550px]
                text-[32px]
                font-semibold
                leading-[1.12]
                tracking-[-0.02em]
                text-[#111111]
                sm:text-[36px]
                lg:text-[36px]
              "
            >
              {heroTitle}
            </motion.h1>

            {/* HERO PILLS */}

            <motion.div
              variants={containerVariants}
              className="
                flex
                flex-wrap
                items-center
                gap-[16px]
              "
            >
              {/* INSIGHTS */}

              <motion.div
                variants={fadeUpVariants}
                whileHover={{
                  y: -2,
                }}
                className="
                  flex
                  items-center
                  gap-[10px]
                  rounded-full
                  border
                  border-[#F0F0F0]
                  bg-white
                  px-[6px]
                  py-[6px]
                  pr-[18px]
                  shadow-[0_2px_10px_rgba(0,0,0,0.04)]
                "
              >
                <span
                  className="
                    flex
                    h-[34px]
                    w-[34px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#E8F0FE]
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
                    text-[14px]
                    font-normal
                    text-[#222222]
                  "
                >
                  Insights
                </span>
              </motion.div>

              {/* SHARED EXPERTISE */}

              <motion.div
                variants={fadeUpVariants}
                whileHover={{
                  y: -2,
                }}
                className="
                  flex
                  items-center
                  gap-[10px]
                  rounded-full
                  border
                  border-[#F0F0F0]
                  bg-white
                  px-[6px]
                  py-[6px]
                  pr-[18px]
                  shadow-[0_2px_10px_rgba(0,0,0,0.04)]
                "
              >
                <span
                  className="
                    flex
                    h-[34px]
                    w-[34px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#E8F0FE]
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
                    text-[14px]
                    font-normal
                    text-[#222222]
                  "
                >
                  Shared Expertise
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* RIGHT HERO TEXT */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              hidden
              w-[45%]
              pl-[30px]
              text-left
              lg:block
            "
          >
            <h2
              className="
                text-[25px]
                font-semibold
                uppercase
                leading-[1.48]
                tracking-[0.01em]
                text-[#34434B]
              "
            >
              A Stronger
              <br />
              Tomorrow
              <br />
              Together
            </h2>
          </motion.div>
        </div>
      </section>

      {/* ======================================================================
          SEARCH + FILTER
      ======================================================================= */}

      <motion.section
        ref={filterBarRef}
        variants={fadeUpVariants}
        className="
          scroll-mt-[20px]
          bg-white
        "
      >
        <div
          className={`
            mx-auto
            flex
            ${PAGE_MAX_WIDTH}
            flex-col
            items-stretch
            gap-[20px]
            px-6
            py-[31px]
            lg:flex-row
            lg:items-center
            lg:px-0
          `}
        >
          {/* SEARCH */}

          <div
            id="partner-search-bar"
            className="
              relative
              min-w-0
              flex-1
              scroll-mt-[20px]
            "
          >
            <Search
              size={20}
              strokeWidth={1.8}
              className="
                absolute
                left-[20px]
                top-1/2
                -translate-y-1/2
                text-[#7D9CE3]
              "
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value,
                )
              }
              placeholder="Search members by name, industry or keyword..."
              className="
                h-[44px]
                w-full
                rounded-full
                border
                border-transparent
                bg-[#F8F9FA]
                pl-[50px]
                pr-[20px]
                text-[14px]
                font-normal
                text-[#444444]
                outline-none
                placeholder:text-[#7D9CE3]
                transition-all
                focus:border-[#D7E0F6]
                focus:bg-white
              "
            />
          </div>

          {/* CATEGORY */}

          <div
            className="
              relative
              w-full
              shrink-0
              lg:w-[240px]
            "
          >
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value,
                )
              }
              className="
                h-[44px]
                w-full
                cursor-pointer
                appearance-none
                rounded-full
                border
                border-[#E8E8E8]
                bg-white
                px-[20px]
                pr-[45px]
                text-[14px]
                font-normal
                text-[#7895D8]
                outline-none
                transition-colors
                focus:border-[#B9C7E8]
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
                ),
              )}
            </select>

            <ChevronDown
              size={18}
              strokeWidth={2}
              className="
                pointer-events-none
                absolute
                right-[18px]
                top-1/2
                -translate-y-1/2
                text-[#111111]
              "
            />
          </div>

          {/* SORT */}

          <div
            className="
              relative
              w-full
              shrink-0
              lg:w-[240px]
            "
          >
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value,
                )
              }
              className="
                h-[44px]
                w-full
                cursor-pointer
                appearance-none
                rounded-full
                border
                border-[#E8E8E8]
                bg-white
                px-[20px]
                pr-[45px]
                text-[14px]
                font-normal
                text-[#7895D8]
                outline-none
                transition-colors
                focus:border-[#B9C7E8]
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
                ),
              )}
            </select>

            <ChevronDown
              size={18}
              strokeWidth={2}
              className="
                pointer-events-none
                absolute
                right-[18px]
                top-1/2
                -translate-y-1/2
                text-[#111111]
              "
            />
          </div>
        </div>
      </motion.section>

      {/* ======================================================================
          PARTNER GRID
      ======================================================================= */}

      <main
        className={`
          mx-auto
          w-full
          ${PAGE_MAX_WIDTH}
          px-6
          pt-[17px]
          pb-[110px]
          lg:px-0
        `}
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
              py-[100px]
              text-center
              text-[14px]
              font-normal
              text-[#999999]
            "
          >
            Unable to load members. Please try again.
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
                    left-0
                    right-0
                    z-20
                    h-[2px]
                    overflow-hidden
                    rounded-full
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
                      h-full
                      w-[40%]
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
                gap-[20px]
                transition-[filter,opacity]
                duration-300
                ease-out
                sm:grid-cols-2
                lg:grid-cols-3

                ${
                  isFetching
                    ? "blur-[1px] opacity-70"
                    : "blur-0 opacity-100"
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
                  ),
                )}
              </AnimatePresence>
            </motion.div>

            {/* NO RESULTS */}

            <AnimatePresence>
              {!isError &&
                filteredPartners.length ===
                  0 && (
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
                      py-[100px]
                      text-center
                      text-[14px]
                      font-normal
                      text-[#999999]
                    "
                  >
                    No members found matching
                    your search.
                  </motion.div>
                )}
            </AnimatePresence>

            {/* PAGINATION */}

            {totalRecords > 0 &&
              lastPage > 1 && (
                <Pagination
                  currentPage={
                    apiCurrentPage
                  }
                  lastPage={lastPage}
                  onPageChange={
                    handlePageChange
                  }
                  isFetching={isFetching}
                />
              )}

            {/* PAGE INFO */}

            {totalRecords > 0 && (
              <div className="mt-[16px] text-center">
                <span
                  className="
                    text-[13px]
                    font-normal
                    text-[#999999]
                  "
                >
                  Page {apiCurrentPage} of{" "}
                  {lastPage} · {totalRecords}{" "}
                  members
                </span>
              </div>
            )}
          </div>
        )}
      </main>

      {/* EXTRA BOTTOM SPACE */}

      <div className="h-[30px] w-full" />
    </motion.div>
  );
};

export default PartnerDirectory;