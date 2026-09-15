import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  BarChart3,
  Star,
  Link2,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useGetMemberPageQuery } from "../../Redux/api/publicApiSlice";

// ============================================================================
// IMAGES
// ============================================================================

const UNSPLASH = "https://images.unsplash.com";

const HERO_IMAGE = `${UNSPLASH}/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=90`;

const FALLBACK_CARD_IMAGE =
  `${UNSPLASH}/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85`;

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
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
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const heroTextVariants = {
  hidden: {
    opacity: 0,
    x: -30,
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
    scale: 1.08,
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
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -5,
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
        border-[#e8e8e8]
        shadow-[0_3px_12px_rgba(0,0,0,0.07)]
        hover:shadow-[0_10px_28px_rgba(0,0,0,0.13)]
        transition-shadow
        duration-300
        min-h-[350px]
        flex
        flex-col
      "
    >
      {/* ================================================================
          CARD IMAGE
      ================================================================= */}

      <div className="relative h-[105px] shrink-0 overflow-hidden">
        <motion.img
          src={partner.banner_url || FALLBACK_CARD_IMAGE}
          alt={`${partner.name || "Partner"} banner`}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
          "
          onError={(e) => {
            e.currentTarget.src = FALLBACK_CARD_IMAGE;
          }}
        />

        {/* Light overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-white/85
            via-white/25
            to-transparent
          "
        />

        {/* Logo */}
        <motion.div
          whileHover={{
            scale: 1.04,
          }}
          transition={{ duration: 0.2 }}
          className="
            absolute
            left-[18px]
            bottom-[12px]
            h-[42px]
            min-w-[135px]
            px-[12px]
            bg-white
            rounded-[4px]
            flex
            items-center
            justify-center
            shadow-[0_2px_6px_rgba(0,0,0,0.08)]
          "
        >
          <img
            src={partner.logo_url || FALLBACK_CARD_IMAGE}
            alt={`${partner.name || "Partner"} logo`}
            className="
              max-h-[34px]
              max-w-[120px]
              object-contain
            "
            onError={(e) => {
              e.currentTarget.src = FALLBACK_CARD_IMAGE;
            }}
          />
        </motion.div>
      </div>

      {/* ================================================================
          CARD CONTENT
      ================================================================= */}

      <div
        className="
          px-[18px]
          pt-[17px]
          pb-[16px]
          flex
          flex-col
          flex-1
        "
      >
        {/* Partner Name */}
        <h3
          className="
            text-[14px]
            font-bold
            uppercase
            tracking-[0.01em]
            text-[#273238]
            leading-[19px]
            mb-[7px]
            min-h-[19px]
          "
        >
          {partner.name || "Partner"}
        </h3>

        {/* Description */}
        <p
          className="
            text-[12px]
            text-[#666666]
            leading-[18px]
            min-h-[54px]
            line-clamp-3
            overflow-hidden
            mb-[12px]
          "
        >
          {partner.description || "No description available."}
        </p>

        {/* Category */}
        <motion.span
          whileHover={{
            scale: 1.03,
          }}
          transition={{ duration: 0.2 }}
          className="
            self-start
            inline-flex
            items-center
            bg-[#edf2ff]
            text-[#3157b7]
            rounded-full
            px-[12px]
            h-[25px]
            text-[10px]
            uppercase
            font-medium
            tracking-[0.01em]
            mb-[15px]
          "
        >
          {partner.category || "General"}
        </motion.span>

        {/* ============================================================
            BUTTONS
        ============================================================ */}

        <div className="mt-auto">
          {/* Contact Member */}
          <motion.a
            href="/arbutus-web/Contactmain"
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            transition={{ duration: 0.18 }}
            className="
              h-[34px]
              w-full
              border
              border-[#e1e5ea]
              rounded-[6px]
              bg-white
              text-[#3157b7]
              text-[10px]
              font-medium
              flex
              items-center
              justify-center
              gap-[6px]
              hover:bg-[#f7f9ff]
              hover:border-[#cbd6ef]
              transition-colors
              mb-[9px]
            "
          >
            <Link2 size={13} />
            <span>Contact Member</span>
          </motion.a>

          {/* Read More */}
          <motion.a
            href={partner.website_url || "#"}
            target={partner.website_url ? "_blank" : undefined}
            rel={
              partner.website_url
                ? "noopener noreferrer"
                : undefined
            }
            onClick={(e) => {
              if (!partner.website_url) {
                e.preventDefault();
              }
            }}
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            transition={{ duration: 0.18 }}
            className="
              h-[35px]
              w-full
              bg-[#2d58be]
              hover:bg-[#234ba8]
              rounded-[6px]
              text-white
              text-[11px]
              font-medium
              flex
              items-center
              justify-center
              gap-[6px]
              transition-colors
            "
          >
            <span>Read More</span>

            <motion.span
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <ArrowRight size={13} />
            </motion.span>
          </motion.a>
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
  const [sortBy, setSortBy] = useState("order");

  // ==========================================================================
  // API
  // ==========================================================================

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

  // ==========================================================================
  // API DATA
  // ==========================================================================

  const members = response?.data?.items || [];

  const categories =
    response?.data?.filters?.categories || [];

  const sortOptions =
    response?.data?.filters?.sort_options || [
      {
        value: "az",
        label: "Sort by A–Z",
      },
      {
        value: "za",
        label: "Sort by Z–A",
      },
      {
        value: "order",
        label: "Default Order",
      },
    ];

  // ==========================================================================
  // LOCAL FILTER + SORT
  // ==========================================================================

  const filteredPartners = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    let data = [...members];

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

    if (category !== "All Categories") {
      data = data.filter(
        (partner) =>
          partner?.category?.toLowerCase() ===
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
    searchQuery,
    category,
    sortBy,
  ]);

  // ==========================================================================
  // LOADING
  // ==========================================================================

  if (isLoading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#fafafa]
          text-[#273238]
          font-sans
        "
      >
        {/* Header Skeleton */}
        <section
          className="
            bg-white
            min-h-[240px]
            border-b
            border-[#eeeeee]
            overflow-hidden
          "
        >
          <div
            className="
              max-w-[1200px]
              min-h-[240px]
              mx-auto
              grid
              grid-cols-1
              lg:grid-cols-[1.05fr_1fr]
            "
          >
            <div
              className="
                flex
                flex-col
                justify-center
                px-[25px]
                lg:px-[40px]
                py-[30px]
              "
            >
              <div className="w-[100px] h-[10px] bg-gray-200 rounded mb-[14px] animate-pulse" />

              <div className="w-[280px] h-[34px] bg-gray-200 rounded mb-[14px] animate-pulse" />

              <div className="w-[430px] max-w-full h-[38px] bg-gray-200 rounded mb-[18px] animate-pulse" />

              <div className="flex gap-[20px]">
                <div className="w-[110px] h-[34px] bg-gray-200 rounded-full animate-pulse" />
                <div className="w-[150px] h-[34px] bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="min-h-[240px] bg-gray-200 animate-pulse" />
          </div>
        </section>

        {/* Filter Skeleton */}
        <section
          className="
            min-h-[72px]
            bg-white
            border-b
            border-[#eeeeee]
          "
        >
          <div
            className="
              max-w-[1200px]
              min-h-[72px]
              mx-auto
              px-[20px]
              lg:px-0
              py-[15px]
              flex
              flex-col
              md:flex-row
              items-stretch
              md:items-center
              gap-[12px]
              md:gap-[18px]
            "
          >
            <div className="flex-1 h-[40px] bg-gray-200 rounded-full animate-pulse" />

            <div className="w-full md:w-[190px] h-[40px] bg-gray-200 rounded-full animate-pulse" />

            <div className="w-full md:w-[170px] h-[40px] bg-gray-200 rounded-full animate-pulse" />
          </div>
        </section>

        {/* Cards Skeleton */}
        <main
          className="
            max-w-[1200px]
            mx-auto
            px-[20px]
            lg:px-0
            pt-[24px]
            pb-[70px]
          "
        >
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-[18px]
              lg:gap-[22px]
            "
          >
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 20,
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
                    border-[#e8e8e8]
                    min-h-[350px]
                    animate-pulse
                  "
                >
                  <div className="h-[105px] bg-gray-200" />

                  <div className="px-[18px] pt-[17px] pb-[16px]">
                    <div className="h-[16px] w-[70%] bg-gray-200 rounded mb-[12px]" />

                    <div className="h-[50px] bg-gray-200 rounded mb-[12px]" />

                    <div className="h-[25px] w-[120px] bg-gray-200 rounded-full mb-[15px]" />

                    <div className="h-[34px] bg-gray-200 rounded mb-[9px]" />

                    <div className="h-[35px] bg-gray-200 rounded" />
                  </div>
                </motion.div>
              )
            )}
          </div>
        </main>
      </div>
    );
  }

  // ==========================================================================
  // JSX
  // ==========================================================================

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="
        min-h-screen
        bg-[#fafafa]
        text-[#273238]
        font-sans
      "
    >
      {/* ==================================================================
          TOP HEADER
      ================================================================== */}

      <section
        className="
          bg-white
          min-h-[240px]
          border-b
          border-[#eeeeee]
          overflow-hidden
        "
      >
        <div
          className="
            max-w-[1200px]
            min-h-[240px]
            mx-auto
            grid
            grid-cols-1
            lg:grid-cols-[1.05fr_1fr]
          "
        >
          {/* ============================================================
              LEFT HEADER
          ============================================================ */}

          <motion.div
            variants={fadeUpVariants}
            className="
              relative
              z-10
              flex
              flex-col
              justify-center
              px-[25px]
              lg:px-[40px]
              py-[30px]
            "
          >
            {/* Our Network */}
            <motion.div
              variants={heroTextVariants}
              className="flex items-center gap-[10px] mb-[12px]"
            >
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-[#25323a]
                  whitespace-nowrap
                "
              >
                Our Network
              </span>

              <motion.span
                initial={{
                  width: 0,
                  opacity: 0,
                }}
                animate={{
                  width: 38,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.45,
                  duration: 0.45,
                  ease: "easeOut",
                }}
                className="
                  h-[1px]
                  bg-[#d9dde0]
                "
              />
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={heroTextVariants}
              className="
                text-[28px]
                lg:text-[32px]
                font-bold
                text-[#111820]
                leading-tight
                mb-[14px]
              "
            >
              Partner Directory
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={heroTextVariants}
              className="
                text-[12px]
                lg:text-[13px]
                text-[#555f65]
                leading-[19px]
                max-w-[430px]
                mb-[18px]
              "
            >
              Interested in becoming a member of
              Canadian Family Offices?
              <br />
              Learn more and register by visiting
              our contact page.
            </motion.p>

            {/* Header feature items */}
            <motion.div
              variants={containerVariants}
              className="
                flex
                flex-wrap
                items-center
                gap-[20px]
              "
            >
              {/* Insights */}
              <motion.div
                variants={fadeUpVariants}
                whileHover={{ y: -2 }}
                className="flex items-center gap-[8px]"
              >
                <span
                  className="
                    w-[34px]
                    h-[34px]
                    rounded-full
                    bg-[#e7efff]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <BarChart3
                    size={17}
                    strokeWidth={2}
                    className="text-[#3157b7]"
                  />
                </span>

                <span
                  className="
                    text-[12px]
                    text-[#333333]
                    font-medium
                  "
                >
                  Insights
                </span>
              </motion.div>

              {/* Shared Expertise */}
              <motion.div
                variants={fadeUpVariants}
                whileHover={{ y: -2 }}
                className="flex items-center gap-[8px]"
              >
                <span
                  className="
                    w-[34px]
                    h-[34px]
                    rounded-full
                    bg-[#e7efff]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Star
                    size={16}
                    strokeWidth={2}
                    className="text-[#3157b7]"
                  />
                </span>

                <span
                  className="
                    text-[12px]
                    text-[#333333]
                    font-medium
                  "
                >
                  Shared Expertise
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ============================================================
              RIGHT HERO
          ============================================================ */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroImageVariants}
            className="
              relative
              min-h-[240px]
              overflow-hidden
            "
          >
            {/* Hero Image */}
            <motion.img
              src={HERO_IMAGE}
              alt="Mountain lake landscape"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
              "
            />

            {/* White fade */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-white
                via-white/45
                to-transparent
              "
            />

            {/* Hero Text */}
            <motion.div
              initial={{
                opacity: 0,
                x: -25,
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
                top-[55px]
                lg:left-[45px]
                lg:top-[65px]
              "
            >
              <h2
                className="
                  font-serif
                  font-semibold
                  text-[22px]
                  lg:text-[26px]
                  leading-[30px]
                  lg:leading-[35px]
                  tracking-[0.02em]
                  text-[#35434a]
                "
              >
                A STRONGER
                <br />
                TOMORROW
                <br />
                TOGETHER
              </h2>

              <motion.div
                initial={{
                  width: 0,
                  opacity: 0,
                }}
                animate={{
                  width: 40,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.85,
                  duration: 0.45,
                  ease: "easeOut",
                }}
                className="
                  h-[2px]
                  bg-[#536068]
                  mt-[18px]
                "
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================================
          SEARCH + FILTER BAR
      ================================================================== */}

      <motion.section
        variants={fadeUpVariants}
        className="
          min-h-[72px]
          bg-white
          border-b
          border-[#eeeeee]
        "
      >
        <div
          className="
            max-w-[1200px]
            min-h-[72px]
            mx-auto
            px-[20px]
            lg:px-0
            py-[15px]
            flex
            flex-col
            md:flex-row
            items-stretch
            md:items-center
            gap-[12px]
            md:gap-[18px]
          "
        >
          {/* ============================================================
              SEARCH
          ============================================================ */}

          <motion.div
            whileFocus={{ scale: 1.005 }}
            className="relative flex-1"
          >
            <Search
              size={16}
              strokeWidth={2}
              className="
                absolute
                left-[16px]
                top-1/2
                -translate-y-1/2
                text-[#aeb4b9]
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
                h-[40px]
                pl-[42px]
                pr-[15px]
                rounded-full
                bg-[#f6f6f6]
                border
                border-[#eeeeee]
                text-[12px]
                text-[#444444]
                placeholder:text-[#a5abb0]
                outline-none
                focus:border-[#b9c7e8]
                focus:bg-white
                transition-colors
              "
            />
          </motion.div>

          {/* ============================================================
              CATEGORY
          ============================================================ */}

          <motion.div
            whileHover={{ y: -1 }}
            className="
              relative
              w-full
              md:w-[190px]
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
                h-[40px]
                px-[16px]
                pr-[38px]
                rounded-full
                bg-white
                border
                border-[#e8e8e8]
                text-[12px]
                text-[#666666]
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
              size={15}
              strokeWidth={2}
              className="
                absolute
                right-[14px]
                top-1/2
                -translate-y-1/2
                text-[#777777]
                pointer-events-none
              "
            />
          </motion.div>

          {/* ============================================================
              SORT
          ============================================================ */}

          <motion.div
            whileHover={{ y: -1 }}
            className="
              relative
              w-full
              md:w-[170px]
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
                h-[40px]
                px-[16px]
                pr-[38px]
                rounded-full
                bg-white
                border
                border-[#e8e8e8]
                text-[12px]
                text-[#666666]
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
              size={15}
              strokeWidth={2}
              className="
                absolute
                right-[14px]
                top-1/2
                -translate-y-1/2
                text-[#777777]
                pointer-events-none
              "
            />
          </motion.div>
        </div>
      </motion.section>

      {/* ==================================================================
          PARTNER GRID
      ================================================================== */}

      <main
        className="
          max-w-[1200px]
          mx-auto
          px-[20px]
          lg:px-0
          pt-[24px]
          pb-[70px]
        "
      >
        {/* Small fetching indicator */}
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
                mb-[12px]
                text-[11px]
                text-[#8b8b8b]
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
            Unable to load members. Please try again.
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
                  gap-[18px]
                  lg:gap-[22px]
                "
              >
                {filteredPartners.map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* No results */}
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
              No members found matching your search.
            </motion.div>
          )}
      </main>
    </motion.div>
  );
};

export default PartnerDirectory;