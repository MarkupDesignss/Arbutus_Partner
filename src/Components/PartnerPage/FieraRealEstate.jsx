import React from "react";
import { useParams } from "react-router-dom";
import {
  Home,
  Share2,
  Settings,
  MapPin,
  ArrowRight,
  Twitter,
  Linkedin,
  Link2,
  Mail,
} from "lucide-react";

import { useGetMemberDirectoryByIdQuery } from "../../Redux/api/publicApiSlice";

/* =========================================================
   ICON MAP
========================================================= */

const ICON_STYLES = [
  {
    icon: Home,
    color: "text-lime-700",
    bg: "bg-lime-50",
  },
  {
    icon: Share2,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    icon: Settings,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const normalizeUrl = (url) => {
  if (!url) return "#";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  ) {
    return url;
  }

  return `https://${url}`;
};

const getWebsiteLink = (socialLinks = {}) => {
  return (
    socialLinks?.website ||
    socialLinks?.website_url ||
    socialLinks?.web_url ||
    socialLinks?.url ||
    socialLinks?.web ||
    "#"
  );
};

const getContactLink = (socialLinks = {}) => {
  const contact =
    socialLinks?.contact ||
    socialLinks?.contact_url ||
    socialLinks?.contact_link;

  const email =
    socialLinks?.email ||
    socialLinks?.contact_email;

  if (contact) {
    return normalizeUrl(contact);
  }

  if (email) {
    return `mailto:${email}`;
  }

  return "#";
};

const getTwitterLink = (socialLinks = {}) => {
  return normalizeUrl(
    socialLinks?.twitter ||
      socialLinks?.twitter_url ||
      socialLinks?.x ||
      socialLinks?.x_url
  );
};

const getLinkedinLink = (socialLinks = {}) => {
  return normalizeUrl(
    socialLinks?.linkedin ||
      socialLinks?.linkedin_url ||
      socialLinks?.linkedIn ||
      socialLinks?.linkedIn_url
  );
};

/* =========================================================
   ACTION BUTTON
========================================================= */

const ActionButton = ({
  icon: Icon,
  children,
  href = "#",
}) => {
  const isDisabled = !href || href === "#";

  return (
    <a
      href={isDisabled ? undefined : href}
      target={
        href?.startsWith("mailto:")
          ? undefined
          : "_blank"
      }
      rel={
        href?.startsWith("mailto:")
          ? undefined
          : "noreferrer"
      }
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
        }
      }}
      className={`
        group
        h-[36px]
        min-w-[140px]
        px-4
        flex
        items-center
        justify-center
        gap-2
        rounded-[4px]
        border
        border-[#dce4eb]
        bg-white
        text-[#245aa8]
        text-[10px]
        sm:text-[11px]
        font-medium
        tracking-[0.01em]
        transition-all
        duration-200
        ${
          isDisabled
            ? "opacity-60 cursor-default"
            : "hover:bg-[#f6f9fc] hover:border-[#c7d4df]"
        }
      `}
    >
      <Icon
        size={12}
        strokeWidth={1.8}
        className="shrink-0"
      />

      <span>{children}</span>
    </a>
  );
};

/* =========================================================
   FEATURE CARD
========================================================= */

const FeatureCard = ({
  icon: Icon,
  color,
  bg,
  title,
  text,
}) => {
  return (
    <div className="flex flex-col items-start text-left">
      <div
        className={`
          w-12
          h-12
          rounded-full
          ${bg}
          flex
          items-center
          justify-center
          mb-5
          ${color}
        `}
      >
        <Icon
          size={22}
          strokeWidth={1.75}
        />
      </div>

      <h3
        className="
          text-sm
          font-bold
          tracking-wider
          uppercase
          text-gray-900
          mb-3
        "
      >
        {title}
      </h3>

      <p
        className="
          text-sm
          text-gray-500
          leading-relaxed
        "
      >
        {text}
      </p>
    </div>
  );
};

/* =========================================================
   ARTICLE CARD
========================================================= */

const ArticleCard = ({ article }) => {
  const {
    image_url,
    title,
    published_date_formatted,
    source_name,
    category,
    media_type,
    insight_topic,
  } = article;

  const isBadge = media_type === "pdf";

  return (
    <article className="flex items-start gap-4 min-w-0">
      {/* IMAGE */}
      <div className="w-[135px] h-[90px] shrink-0 overflow-hidden bg-[#f2f4f5]">
        {image_url ? (
          <img
            src={image_url}
            alt={title || "Article"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        <h4
          className="
            text-[14px]
            sm:text-[15px]
            lg:text-[14px]
            xl:text-[15px]
            font-normal
            leading-[1.45]
            text-[#3d454b]
            line-clamp-3
          "
        >
          {title}
        </h4>

        <div className="flex items-center flex-wrap gap-x-2.5 mt-2">
          {published_date_formatted && (
            <span className="text-[11px] sm:text-[12px] text-[#8b9298]">
              {published_date_formatted}
            </span>
          )}

          {source_name &&
            (isBadge ? (
              <span
                className="
                  inline-flex
                  items-center
                  px-2
                  py-[3px]
                  rounded-[2px]
                  bg-[#123c5a]
                  text-white
                  text-[9px]
                  font-semibold
                  tracking-wide
                "
              >
                {source_name}
              </span>
            ) : (
              <span
                className="
                  text-[10px]
                  sm:text-[11px]
                  font-bold
                  text-[#d71920]
                  whitespace-nowrap
                "
              >
                {source_name}
              </span>
            ))}
        </div>

        <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
          {category?.name && (
            <span className="text-[11px] sm:text-[12px] text-[#245aa8]">
              {category.name}
            </span>
          )}

          {category?.name && insight_topic?.name && (
            <span className="text-[11px] sm:text-[12px] text-[#b0b5b9]">
              |
            </span>
          )}

          {insight_topic?.name && (
            <span className="text-[11px] sm:text-[12px] text-[#245aa8]">
              {insight_topic.name}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   ARTICLES SECTION
========================================================= */

const ArticlesSection = ({ posts = [] }) => {
  const [visibleCount, setVisibleCount] =
    React.useState(9);

  const visibleArticles = posts.slice(
    0,
    visibleCount
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + 3, posts.length)
    );
  };

  if (!posts.length) return null;

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* HEADING */}
        <div className="flex items-center gap-3 mb-9">
          <h3
            className="
              text-[20px]
              font-medium
              text-[#222b31]
            "
          >
            Articles
          </h3>

          <div className="h-px w-9 bg-[#dfe3e6]" />
        </div>

        {/* GRID */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-x-14
            xl:gap-x-20
            gap-y-8
          "
        >
          {visibleArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
            />
          ))}
        </div>

        {/* LOAD MORE */}
        {visibleCount < posts.length && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={handleLoadMore}
              className="
                px-6
                py-2.5
                rounded-[3px]
                border
                border-[#d8e1eb]
                bg-white
                text-[11px]
                font-medium
                text-[#245aa8]
                hover:bg-[#f7f9fc]
                transition-colors
              "
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

/* =========================================================
   HERO SECTION
========================================================= */

const HeroSection = ({
  name,
  tagline,
  category,
  location,
  description,
  logoUrl,
  bannerUrl,
  socialLinks,
}) => {
  const websiteLink =
    getWebsiteLink(socialLinks);

  const contactLink =
    getContactLink(socialLinks);

  const twitterLink =
    getTwitterLink(socialLinks);

  const linkedinLink =
    getLinkedinLink(socialLinks);

  return (
    <header
      className="
        relative
        w-full
        h-[450px]
        sm:h-[400px]
        lg:h-[450px]
        overflow-hidden
        bg-white
      "
    >
      {/* BACKGROUND IMAGE */}
      <img
        src={bannerUrl}
        alt={name || "Member"}
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          object-center
        "
      />



     
      {/* CONTENT */}
      <div className="relative z-10 h-full">
        <div
          className="
            max-w-[1400px]
            mx-auto
            h-full
            px-6
            lg:px-10
          "
        >
          <div
            className="
              w-full
              lg:w-[48%]
              h-full
              flex
              flex-col
              justify-center
            "
          >
            {/* LOGO */}
            {logoUrl && (
              <div className="mb-5">
                <img
                  src={logoUrl}
                  alt={`${name || "Member"} logo`}
                  className="
                    w-[165px]
                    sm:w-[175px]
                    lg:w-[180px]
                    h-auto
                    max-h-[72px]
                    object-contain
                    object-left
                  "
                />
              </div>
            )}

            {/* MEMBER */}
            <span
              className="
                text-[10px]
                sm:text-[11px]
                font-semibold
                tracking-[0.04em]
                uppercase
                text-[#4c5b64]
                mb-1.5
              "
            >
              {tagline || "Member"}
            </span>

            {/* TITLE */}
            <h1
              className="
                text-[31px]
                sm:text-[36px]
                lg:text-[38px]
                xl:text-[40px]
                font-bold
                leading-[1.04]
                tracking-[-0.02em]
                text-[#384952]
                mb-2
              "
            >
              {name}
            </h1>

            {/* META */}
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-3
                gap-y-1
                mb-3.5
              "
            >
              {category && (
                <span
                  className="
                    text-[10px]
                    sm:text-[11px]
                    text-[#59636a]
                  "
                >
                  {category}
                </span>
              )}

              {category && location && (
                <span className="w-[3px] h-[3px] rounded-full bg-[#20282d]" />
              )}

              {location && (
                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[10px]
                    sm:text-[11px]
                    text-[#59636a]
                  "
                >
                  <MapPin
                    size={11}
                    strokeWidth={1.8}
                  />
                  {location}
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            {description && (
              <p
                className="
                  max-w-[475px]
                  text-[10.5px]
                  sm:text-[11px]
                  lg:text-[11.5px]
                  leading-[1.6]
                  text-[#626c72]
                  mb-4.5
                "
              >
                {description}
              </p>
            )}

            {/* BUTTONS */}
            <div
              className="
                grid
                grid-cols-2
                gap-x-2.5
                gap-y-2.5
                w-fit
              "
            >
              {/* WEBSITE */}
              <ActionButton
                icon={Link2}
                href={
                  websiteLink !== "#"
                    ? normalizeUrl(websiteLink)
                    : "#"
                }
              >
                Website Link
              </ActionButton>

              {/* CONTACT */}
              <ActionButton
                icon={Mail}
                href={contactLink}
              >
                Contact Member
              </ActionButton>

              {/* TWITTER */}
              <ActionButton
                icon={Twitter}
                href={twitterLink}
              >
                Twitter
              </ActionButton>

              {/* LINKEDIN */}
              <ActionButton
                icon={Linkedin}
                href={linkedinLink}
              >
                LinkedIn
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

/* =========================================================
   EXPERTISE SECTION
========================================================= */

const ExpertiseSection = ({ expertises = [] }) => {
  if (!expertises.length) return null;

  return (
    <section className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-x-14
            lg:gap-x-16
            gap-y-14
          "
        >
          {expertises.map((item, index) => {
            const style =
              ICON_STYLES[
                index % ICON_STYLES.length
              ];

            return (
              <FeatureCard
                key={
                  item?.id ||
                  `expertise-${index}`
                }
                icon={style.icon}
                color={style.color}
                bg={style.bg}
                title={
                  item?.title ||
                  item?.name ||
                  ""
                }
                text={
                  item?.description ||
                  item?.text ||
                  ""
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   PERSPECTIVE SECTION
========================================================= */

const PerspectiveSection = ({
  perspective,
}) => {
  if (
    !perspective ||
    !perspective.images?.length
  ) {
    return null;
  }

  const images = perspective.images || [];

  return (
    <section
      className="
        bg-white
        py-16
        sm:py-20
        lg:py-[78px]
      "
    >
      <div
        className="
          max-w-[1400px]
          mx-auto
          px-6
          lg:px-10
          grid
          grid-cols-1
          lg:grid-cols-[290px_minmax(0,1fr)]
          gap-10
          lg:gap-[52px]
          items-start
        "
      >
        {/* =================================================
            LEFT IMAGES
        ================================================= */}
        <div className="w-full">
          <div className="flex flex-col gap-[15px]">
            {images.slice(0, 2).map((image, index) => (
              <div
                key={index}
                className="
                  w-full
                  h-[150px]
                  sm:h-[165px]
                  lg:h-[145px]
                  overflow-hidden
                  bg-[#eef1f3]
                "
              >
                <img
                  src={image}
                  alt={`Perspective ${index + 1}`}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-500
                    hover:scale-[1.02]
                  "
                />
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            RIGHT CONTENT
        ================================================= */}
        <div className="pt-0 lg:pt-[1px]">
          {/* LABEL */}
          <div
            className="
              flex
              items-center
              gap-3
              mb-2.5
            "
          >
            <span
              className="
                text-[10px]
                sm:text-[11px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-[#56646d]
              "
            >
              {perspective?.label ||
                "Our Perspective"}
            </span>

            <div className="w-8 h-px bg-[#dce1e4]" />
          </div>

          {/* TITLE */}
          <h2
            className="
              text-[28px]
              sm:text-[31px]
              lg:text-[33px]
              xl:text-[35px]
              font-bold
              leading-[1.12]
              tracking-[-0.01em]
              text-[#3c4d56]
              max-w-[700px]
              mb-4
              uppercase
            "
          >
            {perspective?.title}
          </h2>

          {/* DESCRIPTION */}
          {perspective?.description && (
            <div className="max-w-[850px]">
              <p
                className="
                  text-[10.5px]
                  sm:text-[11px]
                  lg:text-[11.5px]
                  leading-[1.62]
                  text-[#5e696f]
                "
              >
                {perspective.description}
              </p>
            </div>
          )}

          {/* CTA */}
          {perspective?.cta_url && (
            <div className="mt-5">
              <a
                href={normalizeUrl(
                  perspective.cta_url
                )}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-2.5
                  h-[29px]
                  px-3
                  border
                  border-[#dfe5ea]
                  rounded-[3px]
                  bg-white
                  text-[10px]
                  sm:text-[11px]
                  font-medium
                  text-[#2c65a5]
                  hover:bg-[#f8fafc]
                  hover:border-[#cdd7df]
                  transition-all
                "
              >
                {perspective?.cta_text ||
                  "Learn More About Our Approach"}

                <ArrowRight
                  size={12}
                  strokeWidth={1.8}
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const FieraRealEstate = () => {
  const { id } = useParams();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetMemberDirectoryByIdQuery(id, {
    skip: !id,
  });

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-white
        "
      >
        <div
          className="
            w-10
            h-10
            border-4
            border-blue-200
            border-t-[#0B4D8C]
            rounded-full
            animate-spin
          "
        />
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (isError) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-6
          bg-white
          text-red-500
          text-center
        "
      >
        Error:{" "}
        {error?.data?.message ||
          "Failed to load member."}
      </div>
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const member = response?.data;

  if (!member) {
    return null;
  }

  const {
    name,
    category,
    tagline,
    location,
    description,
    logo_url,
    banner_url,
    social_links = {},
    expertises = [],
    perspective = {},
    posts = [],
  } = member;

  return (
    <>
      {/* =====================================================
          ROBOTO
      ===================================================== */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap');

          .fiera-real-estate-page {
            font-family: 'Roboto', Arial, sans-serif;
          }

          .fiera-real-estate-page *,
          .fiera-real-estate-page button,
          .fiera-real-estate-page a,
          .fiera-real-estate-page input,
          .fiera-real-estate-page textarea {
            font-family: inherit;
          }
        `}
      </style>

      <div
        className="
          fiera-real-estate-page
          min-h-screen
          bg-white
          text-[#3d474d]
        "
      >
        {/* ===================================================
            HERO
        =================================================== */}

        <HeroSection
          name={name}
          tagline={tagline}
          category={category}
          location={location}
          description={description}
          logoUrl={logo_url}
          bannerUrl={banner_url}
          socialLinks={social_links}
        />

        {/* ===================================================
            EXPERTISE
        =================================================== */}

        <ExpertiseSection
          expertises={expertises}
        />

        {/* ===================================================
            PERSPECTIVE
        =================================================== */}

        <PerspectiveSection
          perspective={perspective}
        />

        {/* ===================================================
            ARTICLES
        =================================================== */}

        <ArticlesSection
          posts={posts}
        />
      </div>
    </>
  );
};

export default FieraRealEstate;