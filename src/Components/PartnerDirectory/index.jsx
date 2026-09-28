import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  BarChart3,
  Star,
  Link2,
  ArrowRight,
  Mail,
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

const cleanImageUrl = (url) => {
  if (!url) return "";

  const value = String(url).trim();

  const markdownMatch = value.match(/\((https?:\/\/[^)]+)\)/);

  if (markdownMatch?.[1]) {
    return markdownMatch[1];
  }

  return value;
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
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

// ============================================================================
// PARTNER CARD
// ============================================================================

const PartnerCard = ({ partner }) => {
  const hasWebsite = Boolean(partner?.website_url);
  const memberId = partner?.id;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -4,
        transition: {
          duration: 0.2,
          ease: "easeOut",
        },
      }}
      className="
        group
        bg-white
        rounded-[10px]
        overflow-hidden
        border
        border-[#E8E8E8]
        shadow-[0_2px_10px_rgba(0,0,0,0.06)]
        hover:shadow-[0_10px_28px_rgba(0,0,0,0.11)]
        transition-shadow
        duration-300
        min-h-[425px]
        flex
        flex-col
        w-full
      "
    >
      {/* ================================================================
          CARD LOGO / BANNER
      ================================================================= */}

      <div
        className="
          relative
          h-[115px]
          shrink-0
          overflow-hidden
          bg-[#F6F6F600]
          flex
          items-center
          justify-center
          px-[25px]
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
            max-w-full
            max-h-full
            w-auto
            h-auto
            object-contain
          "
          onError={(e) => {
            e.currentTarget.src = FALLBACK_CARD_IMAGE;
          }}
        />
      </div>

      {/* ================================================================
          CARD CONTENT
      ================================================================= */}

      <div
        className="
          flex
          flex-col
          flex-1
          px-[26px]
          pt-[24px]
          pb-[18px]
          bg-[#F6F6F600]
        "
      >
        {/* Partner Name */}

        <h3
          className="
            text-[18px]
            font-bold
            text-[#37434a]
            leading-[24px]
            tracking-[-0.01em]
            mb-[7px]
          "
        >
          {partner?.name || "Partner"}
        </h3>

        {/* Description */}

        <p
          className="
            text-[14px]
            font-normal
            text-[#666666]
            leading-[23px]
            line-clamp-2
            min-h-[46px]
            overflow-hidden
            mb-[13px]
          "
        >
          {partner?.description || "No description available."}
        </p>

        {/* Category */}

        <motion.span
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="
            self-start
            inline-flex
            items-center
            justify-center
            bg-[#eef2fb]
            text-[#315dcc]
            rounded-full
            px-[14px]
            h-[28px]
            text-[12px]
            leading-none
            font-medium
            tracking-[0.01em]
            mb-[18px]
          "
        >
          {partner?.category || "General"}
        </motion.span>

        {/* ================================================================
            BUTTONS
        ================================================================= */}

        <div className="mt-auto">
          {/* Website + Contact */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] mb-[16px]">
            {/* Website Link — unchanged (opens external website) */}

            <motion.a
              href={hasWebsite ? partner.website_url : "#"}
              target={hasWebsite ? "_blank" : undefined}
              rel={hasWebsite ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (!hasWebsite) {
                  e.preventDefault();
                }
              }}
              whileHover={{
                scale: 1.012,
              }}
              whileTap={{
                scale: 0.988,
              }}
              transition={{ duration: 0.18 }}
              className="
                h-[43px]
                w-full
                border
                border-[#E8E8E8]
                rounded-[7px]
                bg-white
                text-[#315dcc]
                text-[14px]
                font-medium
                flex
                items-center
                justify-center
                gap-[10px]
                hover:bg-[#f8faff]
                hover:border-[#cad4ea]
                transition-all
              "
            >
              <Link2
                size={16}
                strokeWidth={1.9}
                className="shrink-0"
              />

              <span>Website Link</span>
            </motion.a>

            {/* Contact Member */}

            <motion.a
              href="/arbutus-web/Contactmain"
              whileHover={{
                scale: 1.012,
              }}
              whileTap={{
                scale: 0.988,
              }}
              transition={{ duration: 0.18 }}
              className="
                h-[43px]
                w-full
                border
                border-[#E8E8E8]
                rounded-[7px]
                bg-white
                text-[#315dcc]
                text-[14px]
                font-medium
                flex
                items-center
                justify-center
                gap-[10px]
                hover:bg-[#f8faff]
                hover:border-[#cad4ea]
                transition-all
              "
            >
              <Mail
                size={16}
                strokeWidth={1.9}
                className="shrink-0"
              />

              <span>Contact Member</span>
            </motion.a>
          </div>

          {/* ================================================================
              READ MORE → navigate to /FieraRealEstate/:id
          ================================================================= */}

          <Link to={`/FieraRealEstate/${memberId}`} className="block">
            <motion.div
              whileHover={{
                scale: 1.008,
              }}
              whileTap={{
                scale: 0.992,
              }}
              transition={{ duration: 0.18 }}
              className="
                h-[42px]
                w-full
                bg-[#315dcc]
                hover:bg-[#2852b5]
                rounded-[7px]
                text-white
                text-[14px]
                font-medium
                flex
                items-center
                justify-center
                gap-[8px]
                transition-colors
                cursor-pointer
              "
            >
              <span>Read More</span>

              <motion.span
                className="flex items-center"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PartnerDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("az");

  // ========================================================================
  // MEMBER API
  // ========================================================================

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetMemberPageQuery({
    page: 1,
    per_page: 9,
    search: searchQuery,
    category:
      category === "All Categories"
        ? ""
        : category,
    sort_by: sortBy,
  });

  // ========================================================================
  // WEB BANNER API
  // ========================================================================

  const {
    data: webBannerResponse,
    isLoading: isBannerLoading,
  } = useGetWebBannersQuery();

  // ========================================================================
  // PARTNER DIRECTORY WEB PAGE
  // ========================================================================

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

  // ========================================================================
  // HERO DATA
  // ========================================================================

  const heroLabel =
    partnerDirectoryPage?.label || "Our Network";

  const heroTitle =
    partnerDirectoryPage?.title || "Partner Directory";

  const heroImage =
    cleanImageUrl(
      partnerDirectoryPage?.banner_image
    ) || FALLBACK_HERO_IMAGE;

  // ========================================================================
  // API DATA
  // ========================================================================

  const members =
    response?.data?.items || [];

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

  // ========================================================================
  // FILTER + SORT
  // ========================================================================

  const filteredPartners = useMemo(() => {
    const query =
      searchQuery.toLowerCase().trim();

    let data = [...members];

    // Search
    if (query) {
      data = data.filter((partner) => {
        return (
          partner?.name
            ?.toLowerCase()
            .includes(query) ||
          partner?.description
            ?.toLowerCase()
            .includes(query) ||
          partner?.category
            ?.toLowerCase()
            .includes(query)
        );
      });
    }

    // Category
    if (category !== "All Categories") {
      data = data.filter(
        (partner) =>
          partner?.category?.toLowerCase() ===
          category.toLowerCase()
      );
    }

    // Sort
    if (sortBy === "az") {
      data.sort((a, b) =>
        (a?.name || "").localeCompare(
          b?.name || ""
        )
      );
    }

    if (sortBy === "za") {
      data.sort((a, b) =>
        (b?.name || "").localeCompare(
          a?.name || ""
        )
      );
    }

    if (sortBy === "order") {
      data.sort(
        (a, b) =>
          Number(a?.display_order || 0) -
          Number(b?.display_order || 0)
      );
    }

    return data;
  }, [
    members,
    searchQuery,
    category,
    sortBy,
  ]);

  // ========================================================================
  // LOADING STATE
  // ========================================================================

  if (isLoading || isBannerLoading) {
    return (
      <div className="min-h-screen bg-[#F6F6F600]">
        {/* Hero Skeleton */}

        <section className="bg-[#F6F6F600] min-h-[210px] overflow-hidden">
          <div
            className="
              max-w-7xl
              mx-auto
              min-h-[210px]
              grid
              grid-cols-1
              lg:grid-cols-[1.05fr_0.95fr]
            "
          >
            <div
              className="
                flex
                flex-col
                justify-center
                px-[25px]
                sm:px-[40px]
                lg:px-0
                lg:pr-[50px]
                py-[30px]
              "
            >
              <div className="w-[120px] h-[14px] bg-gray-200 rounded mb-[18px] animate-pulse" />

              <div className="w-[350px] max-w-full h-[38px] bg-gray-200 rounded mb-[22px] animate-pulse" />

              <div className="flex items-center gap-[18px]">
                <div className="w-[42px] h-[42px] bg-gray-200 rounded-full animate-pulse" />
                <div className="w-[75px] h-[15px] bg-gray-200 rounded animate-pulse" />

                <div className="w-[42px] h-[42px] bg-gray-200 rounded-full animate-pulse ml-[10px]" />
                <div className="w-[135px] h-[15px] bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="min-h-[210px] bg-gray-200 animate-pulse" />
          </div>
        </section>

        {/* Filter Skeleton */}

        <section className="bg-[#F6F6F600]">
          <div
            className="
              max-w-7xl
              mx-auto
              px-[20px]
              lg:px-0
              py-[28px]
              flex
              flex-col
              lg:flex-row
              gap-[20px]
            "
          >
            <div className="flex-1 h-[47px] bg-gray-200 rounded-full animate-pulse" />

            <div className="w-full lg:w-[255px] h-[47px] bg-gray-200 rounded-full animate-pulse" />

            <div className="w-full lg:w-[255px] h-[47px] bg-gray-200 rounded-full animate-pulse" />
          </div>
        </section>

        {/* Card Skeleton */}

        <main
          className="
            max-w-7xl
            mx-auto
            px-[20px]
            lg:px-0
            pb-[70px]
          "
        >
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-[20px]
            "
          >
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <motion.div
                  key={index}
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
                    bg-white
                    rounded-[10px]
                    overflow-hidden
                    border
                    border-[#E8E8E8]
                    min-h-[425px]
                    animate-pulse
                    w-full
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
              )
            )}
          </div>
        </main>
      </div>
    );
  }

  // ========================================================================
  // JSX
  // ========================================================================

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="
        min-h-screen
        bg-[#F6F6F600]
        text-[#273238]
        font-sans
      "
    >
      {/* ====================================================================
          HERO
      ==================================================================== */}

      <section
        className="
          bg-[#F6F6F600]
          min-h-[210px]
          overflow-hidden
        "
      >
        <div
          className="
            max-w-7xl
            min-h-[210px]
            mx-auto
            grid
            grid-cols-1
            lg:grid-cols-[1.02fr_0.98fr]
          "
        >
          {/* ================================================================
              HERO LEFT
          ================================================================= */}

          <motion.div
            variants={fadeUpVariants}
            className="
              relative
              z-10
              flex
              flex-col
              justify-center
              px-[25px]
              sm:px-[40px]
              lg:px-0
              lg:pr-[55px]
              py-[30px]
            "
          >
            {/* Label */}

            <motion.div
              variants={heroTextVariants}
              className="
                flex
                items-center
                gap-[10px]
                mb-[22px]
              "
            >
              <span
                className="
                  text-[14px]
                  font-bold
                  uppercase
                  tracking-[0.01em]
                  text-[#36434a]
                  whitespace-nowrap
                "
              >
                {heroLabel}
              </span>

              <span
                className="
                  h-[2px]
                  w-[54px]
                  bg-[#d9dde0]
                "
              />
            </motion.div>

            {/* Title */}

            <motion.h1
              variants={heroTextVariants}
              className="
                text-[31px]
                sm:text-[30px]
                lg:text-[30px]
                font-semibold
                text-[#111111]
                leading-[1.12]
                tracking-[-0.02em]
                mb-[22px]
              "
            >
              {heroTitle}
            </motion.h1>

            {/* Feature Items */}

            <motion.div
              variants={containerVariants}
              className="
                flex
                flex-wrap
                items-center
                gap-[26px]
              "
            >
              {/* Insights */}

              <motion.div
                variants={fadeUpVariants}
                whileHover={{ y: -2 }}
                className="
                  flex
                  items-center
                  gap-[10px]
                "
              >
                <span
                  className="
                    w-[42px]
                    h-[42px]
                    rounded-full
                    bg-[#e4ebfa]
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <BarChart3
                    size={20}
                    strokeWidth={2}
                    className="text-[#315dcc]"
                  />
                </span>

                <span
                  className="
                    text-[17px]
                    text-[#222222]
                    font-normal
                  "
                >
                  Insights
                </span>
              </motion.div>

              {/* Shared Expertise */}

              <motion.div
                variants={fadeUpVariants}
                whileHover={{ y: -2 }}
                className="
                  flex
                  items-center
                  gap-[10px]
                "
              >
                <span
                  className="
                    w-[42px]
                    h-[42px]
                    rounded-full
                    bg-[#e4ebfa]
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <Star
                    size={19}
                    strokeWidth={2}
                    fill="currentColor"
                    className="text-[#315dcc]"
                  />
                </span>

                <span
                  className="
                    text-[17px]
                    text-[#222222]
                    font-normal
                  "
                >
                  Shared Expertise
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ================================================================
              HERO RIGHT IMAGE
          ================================================================= */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroImageVariants}
            className="
              relative
              min-h-[210px]
              overflow-hidden
              -ml-[1px]
            "
          >
            <motion.img
              src={heroImage}
              alt={heroTitle || "Partner Directory"}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 1.25,
                ease: "easeOut",
              }}
              className="
                absolute
                inset-0
                w-full
                text-[12px]
                h-full
                object-cover
                object-center
              "
              onError={(e) => {
                e.currentTarget.src = FALLBACK_HERO_IMAGE;
              }}
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-white
                via-white/70
                via-[18%]
                to-transparent
              "
            />

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-[55px]
                bg-gradient-to-t
                from-white/70
                to-transparent
              "
            />

            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.35,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute
                left-[30px]
                sm:left-[45px]
                lg:left-[48px]
                top-[38px]
                sm:top-[48px]
                lg:top-[52px]
              "
            >
              <h2
                className="
                  font-serif
                  font-semibold
                  text-[22px]
                  sm:text-[25px]
                  lg:text-[27px]
                  leading-[1.42]
                  tracking-[-0.01em]
                  text-[#3b474c]
                "
              >
                A STRONGER
                <br />
                TOMORROW
                <br />
                TOGETHER
              </h2>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          SEARCH + FILTER BAR
      ==================================================================== */}

      <motion.section
        variants={fadeUpVariants}
        className="
          bg-[#F6F6F600]
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-[20px]
            lg:px-0
            py-[28px]
            flex
            flex-col
            lg:flex-row
            items-stretch
            lg:items-center
            gap-[20px]
          "
        >
          {/* Search */}

          <div className="relative flex-1">
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
                setSearchQuery(e.target.value)
              }
              placeholder="Search members by name, industry or keyword..."
              className="
                w-full
                h-[47px]
                pl-[58px]
                pr-[20px]
                rounded-full
                bg-[#f7f7f7]
                border
                border-transparent
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

          {/* Category */}

          <div
            className="
              relative
              w-full
              lg:w-[255px]
              shrink-0
            "
          >
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="
                appearance-none
                w-full
                h-[47px]
                px-[18px]
                pr-[48px]
                rounded-full
                bg-white
                border
                border-[#E8E8E8]
                text-[14px]
                text-[#7895d8]
                outline-none
                cursor-pointer
                focus:border-[#b9c7e8]
              "
            >
              <option value="All Categories">
                All Categories
              </option>

              {categories.map((item, index) => (
                <option
                  key={`${item}-${index}`}
                  value={item}
                >
                  {item}
                </option>
              ))}
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

          {/* Sort */}

          <div
            className="
              relative
              w-full
              lg:w-[255px]
              shrink-0
            "
          >
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="
                appearance-none
                w-full
                h-[47px]
                px-[18px]
                pr-[48px]
                rounded-full
                bg-white
                border
                border-[#E8E8E8]
                text-[14px]
                text-[#7895d8]
                outline-none
                cursor-pointer
                focus:border-[#b9c7e8]
              "
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
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

      {/* ====================================================================
          PARTNER GRID
      ==================================================================== */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-[20px]
          lg:px-0
          pt-[17px]
          pb-[70px]
        "
      >
        {/* Fetching */}

        <AnimatePresence>
          {isFetching && (
            <motion.div
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -5,
              }}
              className="
                mb-[14px]
                text-[12px]
                text-[#888888]
              "
            >
              Updating members...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}

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
            Unable to load members. Please try
            again.
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredPartners.length > 0 && (
              <motion.div
                key={`${category}-${sortBy}-${searchQuery}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    duration: 0.2,
                  },
                }}
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-[20px]
                "
              >
                {filteredPartners.map(
                  (partner) => (
                    <PartnerCard
                      key={partner.id}
                      partner={partner}
                    />
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* No Results */}

        {!isError &&
          filteredPartners.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.35,
              }}
              className="
                text-center
                py-[100px]
                text-[14px]
                text-[#999999]
              "
            >
              No members found matching your
              search.
            </motion.div>
          )}
      </main>
    </motion.div>
  );
};

export default PartnerDirectory;