import React from "react";
import { useParams } from "react-router-dom";
import {
  Home,
  Share2,
  Settings,
  MapPin,
  ArrowRight,
  Linkedin,
  Link2,
  Mail,
} from "lucide-react";

import { useGetMemberDirectoryByIdQuery } from "../../Redux/api/publicApiSlice";

/* =========================================================
   X (TWITTER) ICON
========================================================= */

const XIcon = ({ size = 12, strokeWidth = 1.8, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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

  const email = socialLinks?.email || socialLinks?.contact_email;

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
      socialLinks?.x_url,
  );
};

const getLinkedinLink = (socialLinks = {}) => {
  return normalizeUrl(
    socialLinks?.linkedin ||
      socialLinks?.linkedin_url ||
      socialLinks?.linkedIn ||
      socialLinks?.linkedIn_url,
  );
};

/* =========================================================
   ACTION BUTTON
========================================================= */

const ActionButton = ({ icon: Icon, children, href = "#" }) => {
  const isDisabled = !href || href === "#";

  return (
    <a
      href={isDisabled ? undefined : href}
      target={href?.startsWith("mailto:") ? undefined : "_blank"}
      rel={href?.startsWith("mailto:") ? undefined : "noreferrer"}
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
        poppins-medium
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
      <Icon size={12} strokeWidth={1.8} className="shrink-0" />

      <span>{children}</span>
    </a>
  );
};

/* =========================================================
   FEATURE CARD
========================================================= */

const FeatureCard = ({ icon: Icon, color, bg, title, text }) => {
  return (
    <div className="flex flex-col items-start text-left h-full">
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
        <Icon size={22} strokeWidth={1.75} />
      </div>

      <h3
        className="
          text-sm
          poppins-semibold
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
          poppins-medium
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
   ARTICLE CARD (UPDATED: Clickable using format_url)
========================================================= */

const ArticleCard = ({ article }) => {
  const {
    image_url,
    image_badge,
    title,
    published_date_formatted,
    source_name,
    category,
    media_type,
    insight_topic,
    format_url,
  } = article;

  const isBadge = media_type === "pdf";
  const displayTags = [category?.name, insight_topic?.name].filter(Boolean);

  // Determine the link URL (fallback to # if not provided)
  const linkUrl = format_url || "#";
  const isExternal = linkUrl.startsWith("http");

  return (
    <a
      href={linkUrl}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block group"
    >
      <article className="flex items-start gap-4 min-w-0 bg-white p-2 -m-2 rounded-lg transition-colors duration-200 group-hover:bg-[#F8FAFC]">
        {/* IMAGE WITH OVERLAY BADGE */}
        <div className="relative w-[135px] h-[90px] shrink-0 overflow-hidden bg-[#f2f4f5] rounded-[4px]">
          {image_url ? (
            <img
              src={image_url}
              alt={title || "Article"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : null}

          {image_badge && (
            <span className="absolute top-1 right-1 bg-[#123c5a] text-white text-[9px] poppins-semibold px-2 py-[2px] rounded-[2px] uppercase">
              {image_badge}
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1 flex flex-col justify-between min-h-[90px]">
          {/* TITLE */}
          <h4
            style={{
              fontWeight: "normal",
              fontSize: "12px",
              lineHeight: "18px",
            }}
            className="
              poppins-medium
              text-[#3d454b]
              transition-colors duration-200 group-hover:text-[#245aa8] group-hover:underline decoration-[#245aa8]/30 underline-offset-2
            "
          >
            {title}
          </h4>

          {/* META INFO */}
          <div className="flex items-center gap-x-2 mt-2">
            {published_date_formatted && (
              <span className="text-[11px] sm:text-[12px] poppins-medium text-[#8b9298] whitespace-nowrap">
                {published_date_formatted}
              </span>
            )}

            {source_name &&
              (isBadge ? (
                <span className="inline-flex items-center px-2 py-[3px] rounded-[2px] bg-[#123c5a] text-white text-[9px] poppins-semibold tracking-wide whitespace-nowrap">
                  {source_name}
                </span>
              ) : (
                <span className="text-[10px] sm:text-[11px] poppins-medium text-[#d71920] whitespace-nowrap">
                  {source_name}
                </span>
              ))}
          </div>

          {/* TAGS */}
          <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
            {displayTags.map((tag, index) => (
              <React.Fragment key={index}>
                <span className="text-[11px] sm:text-[12px] poppins-medium text-[#245aa8]">
                  {tag}
                </span>
                {index < displayTags.length - 1 && (
                  <span className="text-[11px] sm:text-[12px] poppins-medium text-[#245aa8]">
                    |
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </article>
    </a>
  );
};

/* =========================================================
   ARTICLES SECTION
========================================================= */

const ArticlesSection = ({ posts = [] }) => {
  const [visibleCount, setVisibleCount] = React.useState(9);

  const visibleArticles = posts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, posts.length));
  };

  if (!posts.length) return null;

  return (
    <section
      style={{ marginBottom: "30px" }}
      className="bg-white py-16 lg:py-0"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* HEADING */}
        <div className="flex items-center gap-3 mb-9">
          <h3
            className="
              text-[20px]
              poppins-semibold
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
            <ArticleCard key={article.id} article={article} />
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
                poppins-medium
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
  const websiteLink = getWebsiteLink(socialLinks);
  const twitterLink = getTwitterLink(socialLinks);
  const linkedinLink = getLinkedinLink(socialLinks);
  const contactLink = "https://peartreecanada.com/contact-us/";

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

            {/* MEMBER TAGLINE */}
            {tagline && (
              <span
                className="
                  text-[10px]
                  sm:text-[11px]
                  poppins-semibold
                  tracking-[0.04em]
                  uppercase
                  text-[#4c5b64]
                  mb-1.5
                "
              >
                {tagline}
              </span>
            )}

            {/* TITLE */}
            <h1
              className="
                text-[31px]
                sm:text-[36px]
                lg:text-[38px]
                xl:text-[40px]
                poppins-semibold
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
                    poppins-medium
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
                    poppins-medium
                    text-[#59636a]
                  "
                >
                  <MapPin size={11} strokeWidth={1.8} />
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
                  poppins-medium
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
              <ActionButton
                icon={Link2}
                href={websiteLink !== "#" ? normalizeUrl(websiteLink) : "#"}
              >
                Website Link
              </ActionButton>

              <ActionButton icon={Mail} href={contactLink}>
                Contact Member
              </ActionButton>

              <ActionButton icon={XIcon} href={twitterLink}>
                Twitter
              </ActionButton>

              <ActionButton icon={Linkedin} href={linkedinLink}>
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
    <section className="bg-white pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-14 gap-x-0">
          {expertises.map((item, index) => {
            const style = ICON_STYLES[index % ICON_STYLES.length];
            const isFirst = index % 3 === 0;
            const isSecond = index % 3 === 1;
            const isThird = index % 3 === 2;

            return (
              <div
                key={item?.id || `expertise-${index}`}
                className={`
                  ${!isFirst ? "md:border-l md:border-[#eaeaea]" : ""}
                  ${isFirst ? "md:pr-8" : ""}
                  ${isSecond ? "md:px-8" : ""}
                  ${isThird ? "md:pl-8" : ""}
                `}
              >
                <FeatureCard
                  icon={style.icon}
                  color={style.color}
                  bg={style.bg}
                  title={item?.title || item?.name || ""}
                  text={item?.description || item?.text || ""}
                />
              </div>
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

const PerspectiveSection = ({ perspective }) => {
  if (!perspective || !perspective.title) {
    return null;
  }

  const ctaUrl = "https://peartreecanada.com/contact-us/";
  const images = perspective?.images || [];
  const titleWords = perspective?.title ? perspective.title.split(" ") : [];
  const firstTwoWords = titleWords.slice(0, 2).join(" ");
  const remainingWords = titleWords.slice(2).join(" ");

  return (
    <section className="bg-white pb-20 pt-10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-0">
          {/* LEFT: IMAGE */}
          <div className="lg:col-span-1 lg:pr-8">
            {images.length > 0 ? (
              <div className="w-[400px] h-auto overflow-hidden bg-[#eef1f3] rounded-[4px]">
                <img
                  src={images[0]}
                  alt="Perspective"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            ) : (
              <div className="w-full h-[250px] bg-[#eef1f3] rounded-[4px]"></div>
            )}
          </div>

          {/* RIGHT: TEXT CONTENT */}
          <div className="lg:col-span-2">
            <div>
              {/* LABEL */}
              <div className="mb-4">
                <span className="text-[10px] sm:text-[11px] poppins-semibold uppercase tracking-[0.08em] text-[#56646d]">
                  {perspective?.label || "Our Perspective"}
                </span>
                <div className="w-10 h-px bg-[#dce1e4]" />
              </div>

              {/* TITLE */}
              <h2
                style={{ width: "400px", lineHeight: "36px" }}
                className="text-[28px] sm:text-[32px] lg:text-[30px] poppins-semibold leading-[1.15] tracking-[-0.01em] text-[#3c4d56] mb-5 uppercase"
              >
                {firstTwoWords}
                <br />
                {remainingWords}
              </h2>

              {/* DESCRIPTION */}
              {perspective?.description && (
                <p className="text-[11px] sm:text-[12px] lg:text-[13px] poppins-medium leading-[1.65] text-[#5e696f] mt-2 mb-6">
                  {perspective.description}
                </p>
              )}

              {/* CTA */}
              <div>
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 h-[34px] px-4 border border-[#dfe5ea] rounded-[3px] bg-white text-[10px] sm:text-[11px] poppins-medium text-[#2c65a5] hover:bg-[#f8fafc] hover:border-[#cdd7df] transition-all"
                >
                  {perspective?.cta_text || "Learn More About Our Approach"}
                  <ArrowRight size={12} strokeWidth={1.8} />
                </a>
              </div>
            </div>
          </div>
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

  /* LOADING */
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

  /* ERROR */
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
          poppins-medium
        "
      >
        Error: {error?.data?.message || "Failed to load member."}
      </div>
    );
  }

  /* DATA */
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
      <div
        className="
          fiera-real-estate-page
          min-h-screen
          bg-white
          text-[#3d474d]
        "
      >
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

        <ExpertiseSection expertises={expertises} />

        <PerspectiveSection perspective={perspective} />

        <ArticlesSection posts={posts} />
      </div>
    </>
  );
};

export default FieraRealEstate;
