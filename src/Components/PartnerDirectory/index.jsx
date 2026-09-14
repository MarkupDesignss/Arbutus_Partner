import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  BarChart3,
  Star,
  Link2,
  ArrowRight,
} from "lucide-react";

// ============================================================================
// LOCAL PARTNER LOGOS
// ============================================================================
import ArbutsLogo from "../../../public/assets/img1.png";
import PbyLogo from "../../../public/assets/img2.png";
import FieraLogo from "../../../public/assets/img6.png";
import CrisisLogo from "../../../public/assets/img3.png";
import FosterLogo from "../../../public/assets/img5.png";
import CansoLogo from "../../../public/assets/img4.png";

// ============================================================================
// UNSPLASH IMAGES
// ============================================================================
const UNSPLASH = "https://images.unsplash.com";

const HERO_IMAGE = `${UNSPLASH}/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=90`;

const CARD_IMAGES = {
  building: `${UNSPLASH}/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85`,
  mountain: `${UNSPLASH}/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85`,
  office: `${UNSPLASH}/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85`,
  forest: `${UNSPLASH}/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85`,
  mountain2: `${UNSPLASH}/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=85`,
};

// ============================================================================
// PARTNERS DATA
// ============================================================================
const PARTNERS = [
  {
    id: 1,
    logo: ArbutsLogo,
    name: "ARBUTS PARTNER",
    description:
      "Enhancing the family office client experience through clarity, access, and trust.",
    tag: "Wealth Management",
    image: CARD_IMAGES.building,
    route: "/FieraRealEstate",
  },
  {
    id: 2,
    logo: PbyLogo,
    name: "PBY CAPITAL",
    description:
      "Providing our clients with the strongest investment strategies possible.",
    tag: "Investment Management",
    image: CARD_IMAGES.mountain,
    route: "/FieraRealEstate",
  },
  {
    id: 3,
    logo: FieraLogo,
    name: "FIERA REAL ESTATE",
    description:
      "A team of experienced real estate practitioners empowering innovative solutions for clients, including those in family offices.",
    tag: "Real Estate",
    image: CARD_IMAGES.building,
    route: "/FieraRealEstate",
  },
  {
    id: 4,
    logo: CrisisLogo,
    name: "CRISIS24 PRIVATE STRATEGIC GROUP",
    description:
      "Delivering trusted advisory, intelligence and risk management solutions worldwide.",
    tag: "Risk & Security",
    image: CARD_IMAGES.mountain2,
    route: "/FieraRealEstate",
  },
  {
    id: 5,
    logo: FosterLogo,
    name: "FOSTER FAMILY OFFICE",
    description:
      "Preserving and growing wealth for future generations through thoughtful stewardship.",
    tag: "Family Office Services",
    image: CARD_IMAGES.forest,
    route: "/FieraRealEstate",
  },
  {
    id: 6,
    logo: CansoLogo,
    name: "CANSO INVESTMENT COUNSEL LTD.",
    description:
      "Disciplined investment management to weather any market turbulence.",
    tag: "Investment Management",
    image: CARD_IMAGES.mountain,
    route: "/FieraRealEstate",
  },
];

// ============================================================================
// PARTNER CARD
// ============================================================================
const PartnerCard = ({ partner }) => {
  return (
    <div
      className="
        group
        bg-white
        rounded-[10px]
        overflow-hidden
        border
        border-[#e8e8e8]
        shadow-[0_3px_12px_rgba(0,0,0,0.07)]
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]
        hover:-translate-y-[2px]
        transition-all
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
        <img
          src={partner.image}
          alt=""
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-[1.04]
          "
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
        <div
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
            src={partner.logo}
            alt={`${partner.name} logo`}
            className="
              max-h-[34px]
              max-w-[120px]
              object-contain
            "
          />
        </div>
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
          {partner.name}
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
          {partner.description}
        </p>

        {/* Category */}
        <span
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
          {partner.tag}
        </span>

        {/* ============================================================
            BUTTONS
        ============================================================ */}

        <div className="mt-auto">
          {/* Contact Member — single CTA */}
          <a
            href="http://localhost:5173/arbutus-web/Contactmain"
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
          </a>

          {/* Read More */}
          <Link
            to={partner.route}
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
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const PartnerDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Sort by A-Z");

  // ==========================================================================
  // FILTER + SEARCH + SORT
  // ==========================================================================

  const filteredPartners = PARTNERS.filter((partner) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      partner.name.toLowerCase().includes(query) ||
      partner.description.toLowerCase().includes(query) ||
      partner.tag.toLowerCase().includes(query);

    const matchesCategory =
      category === "All Categories" ||
      partner.tag.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "Sort by Z-A") {
      return b.name.localeCompare(a.name);
    }

    return a.name.localeCompare(b.name);
  });

  // ==========================================================================
  // JSX
  // ==========================================================================

  return (
    <div
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

          <div
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
            <div className="flex items-center gap-[10px] mb-[12px]">
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

              <span
                className="
                  h-[1px]
                  w-[38px]
                  bg-[#d9dde0]
                "
              />
            </div>

            {/* Heading */}
            <h1
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
            </h1>

            {/* Description */}
            <p
              className="
                text-[12px]
                lg:text-[13px]
                text-[#555f65]
                leading-[19px]
                max-w-[430px]
                mb-[18px]
              "
            >
              Interested in becoming a member of Canadian Family Offices?
              <br />
              Learn more and register by visiting our contact page.
            </p>

            {/* Header feature items */}
            <div className="flex flex-wrap items-center gap-[20px]">
              {/* Insights */}
              <div className="flex items-center gap-[8px]">
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
              </div>

              {/* Shared Expertise */}
              <div className="flex items-center gap-[8px]">
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
                  <Star size={16} strokeWidth={2} className="text-[#3157b7]" />
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
              </div>
            </div>
          </div>

          {/* ============================================================
              RIGHT HERO
          ============================================================ */}

          <div className="relative min-h-[240px] overflow-hidden">
            {/* Hero Image */}
            <img
              src={HERO_IMAGE}
              alt="Mountain lake landscape"
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
            <div
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

              <div
                className="
                  w-[40px]
                  h-[2px]
                  bg-[#536068]
                  mt-[18px]
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          SEARCH + FILTER BAR
      ================================================================== */}

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
          {/* ============================================================
              SEARCH
          ============================================================ */}

          <div className="relative flex-1">
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
          </div>

          {/* ============================================================
              CATEGORY
          ============================================================ */}

          <div className="relative w-full md:w-[190px] shrink-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              <option>All Categories</option>
              <option>Wealth Management</option>
              <option>Investment Management</option>
              <option>Real Estate</option>
              <option>Risk & Security</option>
              <option>Family Office Services</option>
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
          </div>

          {/* ============================================================
              SORT
          ============================================================ */}

          <div className="relative w-full md:w-[170px] shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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
              <option>Sort by A-Z</option>
              <option>Sort by Z-A</option>
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
          </div>
        </div>
      </section>

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
          {filteredPartners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>

        {/* No results */}
        {filteredPartners.length === 0 && (
          <div
            className="
              text-center
              py-[100px]
              text-[14px]
              text-[#999999]
            "
          >
            No members found matching your search.
          </div>
        )}
      </main>
    </div>
  );
};

export default PartnerDirectory;
