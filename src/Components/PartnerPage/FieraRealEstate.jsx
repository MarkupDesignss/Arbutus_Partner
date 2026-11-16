
import React from "react";
import { useParams } from "react-router-dom";
import {
  Home,
  Share2,
  Settings,
  MapPin,
  ArrowRight,
  Linkedin,
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
    strokeWidth={strokeWidth}
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* =========================================================
   ICON STYLES
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

  const value = String(url).trim();

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  ) {
    return value;
  }

  return `https://${value}`;
};

const getWebsiteLink = (socialLinks = {}) => {
  return normalizeUrl(
    socialLinks?.website ||
      socialLinks?.website_url ||
      socialLinks?.web_url ||
      socialLinks?.url ||
      socialLinks?.web ||
      ""
  );
};

const getContactLink = (socialLinks = {}, perspective = {}) => {
  const contact =
    perspective?.cta_url ||
    perspective?.cta_link ||
    perspective?.contact_url ||
    perspective?.contact_link ||
    socialLinks?.contact ||
    socialLinks?.contact_url ||
    socialLinks?.contact_link;

  const email = socialLinks?.email || socialLinks?.contact_email;

  if (contact) return normalizeUrl(contact);

  if (email) return `mailto:${email}`;

  return "https://peartreecanada.com/contact-us/";
};

const getTwitterLink = (socialLinks = {}) => {
  return normalizeUrl(
    socialLinks?.twitter ||
      socialLinks?.twitter_url ||
      socialLinks?.x ||
      socialLinks?.x_url ||
      ""
  );
};

const getLinkedinLink = (socialLinks = {}) => {
  return normalizeUrl(
    socialLinks?.linkedin ||
      socialLinks?.linkedin_url ||
      socialLinks?.linkedIn ||
      socialLinks?.linkedIn_url ||
      ""
  );
};

/* =========================================================
   ACTION BUTTON
========================================================= */

const ActionButton = ({ icon: Icon, children, href = "#" }) => {
  const isDisabled = !href || href === "#";
  const isMail = href?.startsWith("mailto:");
  const isTel = href?.startsWith("tel:");

  return (
    <a
      href={isDisabled ? undefined : href}
      target={isDisabled || isMail || isTel ? undefined : "_blank"}
      rel={
        isDisabled || isMail || isTel
          ? undefined
          : "noopener noreferrer"
      }
      onClick={(event) => {
        if (isDisabled) event.preventDefault();
      }}
      className={`
        flex h-[42px] min-w-[140px] items-center justify-center
        gap-2 rounded-[4px] border border-[#dce4eb] bg-white
        px-4 text-[12px] font-medium tracking-[0.01em]
        text-[#245aa8] shadow-sm transition-all duration-200
        ${
          isDisabled
            ? "cursor-default opacity-60"
            : "hover:border-[#b8c9dc] hover:bg-[#f6f9fc] hover:shadow-md"
        }
      `}
    >
      <Icon size={14} strokeWidth={1.8} className="shrink-0" />
      <span>{children}</span>
    </a>
  );
};

/* =========================================================
   FEATURE CARD
========================================================= */

const FeatureCard = ({
  icon: Icon,
  iconUrl,
  color,
  bg,
  title,
  text,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const hasCustomIcon = Boolean(iconUrl) && !imageError;

  return (
    <div className="flex h-full flex-col items-start text-left">
      <div
        className={`
          mb-5 flex h-14 w-14 shrink-0 items-center justify-center
          overflow-hidden rounded-full border border-[#edf1f5]
          ${bg} ${color}
        `}
      >
        {hasCustomIcon ? (
          <img
            src={iconUrl}
            alt={title || "Feature icon"}
            className="h-11 w-11 object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <Icon size={23} strokeWidth={1.75} />
        )}
      </div>

      <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.04em] text-[#172033]">
        {title}
      </h3>

      <p className="text-sm font-normal leading-[1.8] text-[#667085]">
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
    image_badge,
    title,
    published_date_formatted,
    source_name,
    source_logo,
    category,
    media_type,
    insight_topic,
    format_url,
  } = article;

  const isBadge = media_type === "pdf";
  const displayTags = [category?.name, insight_topic?.name].filter(Boolean);

  const linkUrl = format_url || "#";
  const isExternal = /^https?:\/\//i.test(linkUrl);

  return (
    <a
      href={linkUrl === "#" ? undefined : linkUrl}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={(event) => {
        if (linkUrl === "#") event.preventDefault();
      }}
      className="group block min-w-0"
    >
      <article className="-m-2 flex min-w-0 items-start gap-4 rounded-lg bg-white p-2 transition-colors duration-200 group-hover:bg-[#f8fafc]">
        {/* IMAGE */}
        <div className="relative h-[90px] w-[120px] shrink-0 overflow-hidden rounded-[4px] bg-[#f2f4f5] sm:w-[135px]">
          {image_url && (
            <img
              src={image_url}
              alt={title || "Article"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}

          {image_badge && (
            <span className="absolute right-1 top-1 rounded-[2px] bg-[#123c5a] px-2 py-[2px] text-[9px] font-semibold uppercase text-white">
              {image_badge}
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex min-h-[90px] min-w-0 flex-1 flex-col justify-between">
          <h4 className="text-[12px] font-normal leading-[18px] text-[#3d454b] transition-colors duration-200 group-hover:text-[#245aa8] group-hover:underline decoration-[#245aa8]/30 underline-offset-2">
            {title}
          </h4>

          {/* META */}
          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            {published_date_formatted && (
              <span className="whitespace-nowrap text-[11px] font-medium text-[#8b9298]">
                {published_date_formatted}
              </span>
            )}

            {source_logo ? (
              <img
                src={source_logo}
                alt={source_name || "Source"}
                className="h-[18px] max-w-[90px] shrink-0 object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : source_name ? (
              isBadge ? (
                <span className="inline-flex whitespace-nowrap rounded-[2px] bg-[#123c5a] px-2 py-[3px] text-[9px] font-semibold tracking-wide text-white">
                  {source_name}
                </span>
              ) : (
                <span className="text-[11px] font-medium text-[#d71920]">
                  {source_name}
                </span>
              )
            ) : null}
          </div>

          {/* TAGS */}
          {displayTags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
              {displayTags.map((tag, index) => (
                <React.Fragment key={`${tag}-${index}`}>
                  {index > 0 && (
                    <span className="text-[11px] text-[#245aa8]">|</span>
                  )}

                  <span className="text-[11px] font-medium text-[#245aa8]">
                    {tag}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}
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
    <section className="mb-[30px] bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="mb-9 flex items-center gap-3">
          <h3 className="text-[20px] font-semibold text-[#222b31]">
            Articles
          </h3>

          <div className="h-px w-9 bg-[#dfe3e6]" />
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-16">
          {visibleArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {visibleCount < posts.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="rounded-[4px] border border-[#d8e1eb] bg-white px-6 py-2.5 text-[12px] font-medium text-[#245aa8] transition-colors hover:bg-[#f7f9fc]"
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
   - CLEAR IMAGE
   - NO BLUR
   - CONTENT BELOW NAVBAR
   - IMPROVED TEXT VISIBILITY
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
  perspective,
}) => {
  const twitterLink = getTwitterLink(socialLinks);
  const linkedinLink = getLinkedinLink(socialLinks);
  const contactLink = getContactLink(socialLinks, perspective);

  return (
    <header
      className="
        relative
        isolate
        z-0
        block
        w-full
        min-h-[450px]
        overflow-hidden
        bg-[#eaf0f5]
        sm:min-h-[480px]
        lg:min-h-[530px]
      "
    >
      {/* CLEAR BACKGROUND IMAGE: NO FILTER / NO BLUR */}
      {bannerUrl && (
        <img
          src={bannerUrl}
          alt=""
          aria-hidden="true"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-center
          "
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}



{/* BLACK GRADIENT - GRADUALLY FADES OUT */}
<div
  className="
    pointer-events-none
    absolute
    inset-0
    bg-gradient-to-r
    from-black/55
    via-black/20
    to-transparent
  "
/>



      {/* CONTENT */}
      <div className="relative z-10 flex min-h-[450px] items-center sm:min-h-[480px] lg:min-h-[530px]">
        <div className="mx-auto flex w-full max-w-[1560px] items-center px-5 py-12 sm:px-8 lg:px-12 lg:py-14 xl:px-16">
          <div className="flex w-full max-w-[620px] flex-col items-start">
            {/* LOGO */}
            {logoUrl && (
              <div className="mb-5">
                <img
                  src={logoUrl}
                  alt={`${name || "Member"} logo`}
                  className="max-h-[65px] w-[135px] object-contain object-left sm:w-[155px] lg:w-[175px]"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* TAGLINE */}
            {tagline && (
              <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#344b59] sm:text-xs">
                {tagline}
              </span>
            )}

            {/* TITLE */}
            <h1 className="mb-3 max-w-full break-words text-[30px] font-bold leading-[1.12] tracking-[-0.025em] text-[#263b49] sm:text-[36px] lg:text-[44px] xl:text-[48px]">
              {name}
            </h1>

            {/* CATEGORY & LOCATION */}
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              {category && (
                <span className="text-xs font-medium text-[#344b59] sm:text-sm">
                  {category}
                </span>
              )}

              {category && location && (
                <span className="h-1 w-1 rounded-full bg-[#344b59]" />
              )}

              {location && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-[#344b59] sm:text-sm">
                  <MapPin size={14} strokeWidth={1.8} />
                  {location}
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            {description && (
              <p className="mb-6 max-w-[520px] text-[13px] font-medium leading-6 text-[#455762] sm:text-sm">
                {description}
              </p>
            )}

            {/* SOCIAL / CONTACT BUTTONS */}
            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
              <ActionButton icon={XIcon} href={twitterLink}>
                Twitter
              </ActionButton>

              <ActionButton icon={Linkedin} href={linkedinLink}>
                LinkedIn
              </ActionButton>

              <ActionButton icon={Mail} href={contactLink}>
                Contact Us
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
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-y-0">
          {expertises.map((item, index) => {
            const style = ICON_STYLES[index % ICON_STYLES.length];
            const isFirst = index % 3 === 0;
            const isSecond = index % 3 === 1;
            const isThird = index % 3 === 2;

            const apiIcon = item?.icon || item?.icon_url || null;

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
                  iconUrl={apiIcon}
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

const PerspectiveSection = ({ perspective = {}, socialLinks = {} }) => {
  if (!perspective || !perspective.title) return null;

  const ctaUrl = getContactLink(socialLinks, perspective);
  const images = perspective?.images || [];

  const titleWords = perspective?.title
    ? perspective.title.split(" ")
    : [];

  const firstTwoWords = titleWords.slice(0, 2).join(" ");
  const remainingWords = titleWords.slice(2).join(" ");

  const isExternal = /^https?:\/\//i.test(ctaUrl);

  return (
    <section className="bg-white pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-0">
          {/* IMAGE */}
          <div className="lg:col-span-1 lg:pr-8">
            {images.length > 0 ? (
              <div className="aspect-[4/3] w-full max-w-[400px] overflow-hidden rounded-[4px] bg-[#eef1f3]">
                <img
                  src={images[0]}
                  alt="Perspective"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="aspect-[4/3] w-full max-w-[400px] rounded-[4px] bg-[#eef1f3]" />
            )}
          </div>

          {/* TEXT */}
          <div className="min-w-0 lg:col-span-2">
            <div className="mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#56646d]">
                {perspective?.label || "Our Perspective"}
              </span>

              <div className="mt-1 h-px w-10 bg-[#dce1e4]" />
            </div>

            <h2 className="mb-5 max-w-full break-words text-[26px] font-semibold uppercase leading-[1.2] tracking-[-0.01em] text-[#3c4d56] sm:text-[32px] lg:max-w-[600px]">
              {firstTwoWords}
              {remainingWords && (
                <>
                  <br className="hidden sm:block" />
                  {` ${remainingWords}`}
                </>
              )}
            </h2>

            {perspective?.description && (
              <p className="mb-6 mt-2 text-[12px] font-medium leading-[1.8] text-[#5e696f] sm:text-[13px]">
                {perspective.description}
              </p>
            )}

            <a
              href={ctaUrl === "#" ? undefined : ctaUrl}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              onClick={(event) => {
                if (ctaUrl === "#") event.preventDefault();
              }}
              className="inline-flex h-[38px] items-center gap-2.5 rounded-[3px] border border-[#dfe5ea] bg-white px-4 text-[11px] font-medium text-[#2c65a5] transition-all hover:border-[#cdd7df] hover:bg-[#f8fafc]"
            >
              {perspective?.cta_text || "Contact Us"}
              <ArrowRight size={14} strokeWidth={1.8} />
            </a>
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-[#0B4D8C]" />
      </div>
    );
  }

  /* ERROR */
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-red-500">
        Error: {error?.data?.message || "Failed to load member."}
      </div>
    );
  }

  /* DATA */
  const member = response?.data;

  if (!member) return null;

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
    <div className="fiera-real-estate-page relative isolate min-h-screen w-full overflow-x-clip bg-white text-[#3d474d]">
      <HeroSection
        name={name}
        tagline={tagline}
        category={category}
        location={location}
        description={description}
        logoUrl={logo_url}
        bannerUrl={banner_url}
        socialLinks={social_links}
        perspective={perspective}
      />

      <ExpertiseSection expertises={expertises} />

      <PerspectiveSection
        perspective={perspective}
        socialLinks={social_links}
      />

      <ArticlesSection posts={posts} />
    </div>
  );
};

export default FieraRealEstate;
