import React, { useState } from "react";
import { useParams } from "react-router-dom";

import {
  ArrowRight,
  MapPin,
  Linkedin,
  Mail,
  Globe2,
  BriefcaseBusiness,
  Users,
  ChartNoAxesCombined,
  ExternalLink,
} from "lucide-react";

import { useGetMemberDirectoryByIdQuery } from "../../Redux/api/publicApiSlice";

/* =========================================================
   CONFIGURATION
========================================================= */

// Set true only if the website navbar is position: fixed.
const NAVBAR_IS_FIXED = false;
const NAVBAR_HEIGHT = 64;

// Original fallback URL preserved.
const DEFAULT_CONTACT_URL = "https://peartreecanada.com/contact-us/";

/* =========================================================
   X / TWITTER ICON
========================================================= */

const XIcon = ({ size = 16, className = "" }) => (
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
   HELPERS
========================================================= */

const safeLink = (value) => {
  if (!value || typeof value !== "string") {
    return null;
  }

  const url = value.trim();

  if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) {
    return url;
  }

  if (/^(?!javascript:)[\w.-]+\.[a-z]{2,}(?:[/?#].*)?$/i.test(url)) {
    return `https://${url}`;
  }

  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }

  return null;
};

const socialLink = (social = {}, keys = []) => {
  const value = keys.map((key) => social?.[key]).find(Boolean);

  return safeLink(value);
};

const getDisplayText = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return value?.name || value?.title || "";
};

const getContactLink = (social = {}, perspective = {}) => {
  const contact =
    perspective?.cta_url ||
    perspective?.cta_link ||
    perspective?.contact_url ||
    perspective?.contact_link ||
    social?.contact ||
    social?.contact_url ||
    social?.contact_link;

  if (contact) {
    return safeLink(contact) || DEFAULT_CONTACT_URL;
  }

  const email = social?.email || social?.contact_email;

  if (email) {
    return `mailto:${email}`;
  }

  return DEFAULT_CONTACT_URL;
};

const getExternalProps = (href) => {
  if (/^https?:\/\//i.test(href || "")) {
    return {
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }

  return {};
};

/* =========================================================
   ACTION BUTTON
========================================================= */

const ActionButton = ({ icon: Icon, href, children, primary = false }) => {
  if (!href) return null;

  return (
    <a
      href={href}
      {...getExternalProps(href)}
      className={`
        group
        inline-flex
        min-h-[44px]
        items-center
        justify-center
        gap-2
        rounded-lg
        px-4
        py-2.5
        text-[12px]
        font-semibold
        transition-all
        duration-200
        hover:-translate-y-0.5
        ${
          primary
            ? `
              bg-[#3478e8]
              text-white
              shadow-md
              shadow-blue-950/15
              hover:bg-[#2465d4]
            `
            : `
              border
              border-white/35
              bg-white/10
              text-white
              hover:bg-white/20
            `
        }
      `}
    >
      {Icon && <Icon size={15} className="shrink-0" />}

      <span>{children}</span>

      {primary && <ArrowRight size={14} />}
    </a>
  );
};

/* =========================================================
   HERO SECTION
   FULL WIDTH IMAGE - NO GREY SIDE GAPS
========================================================= */

const HeroSection = ({
  name,
  tagline,
  category,
  location,
  description,
  logoUrl,
  bannerUrl,
  socialLinks = {},
  perspective = {},
}) => {
  const twitterLink = socialLink(socialLinks, [
    "twitter",
    "twitter_url",
    "x",
    "x_url",
  ]);

  const linkedinLink = socialLink(socialLinks, [
    "linkedin",
    "linkedin_url",
    "linkedIn",
    "linkedIn_url",
  ]);

  const contactUrl = getContactLink(socialLinks, perspective);

  return (
    <section className="w-full overflow-hidden bg-[#102640]">
      <div
        className="
          grid
          w-full
          grid-cols-1
          lg:grid-cols-[42%_58%]
        "
      >
        {/* =========================================
            RIGHT BANNER IMAGE
            FULL COVER - GAP FREE
        ========================================= */}

        <div
          className="
            relative
            order-1
            h-[340px]
            w-full
            min-w-0
            overflow-hidden
            bg-[#dce7f2]
            sm:h-[450px]
            lg:order-2
            lg:h-[650px]
            xl:h-[690px]
          "
        >
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt={`${name || "Member"} banner`}
              className="
                absolute
                inset-0
                block
                h-full
                w-full
                object-cover
                object-top
              "
              loading="eager"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#7290b2]">
              <Globe2 size={75} strokeWidth={1} />
            </div>
          )}
        </div>

        {/* =========================================
            LEFT CONTENT PANEL
        ========================================= */}

        <div
          className="
            relative
            order-2
            flex
            min-w-0
            items-center
            bg-[#102640]
            px-6
            py-12
            sm:px-10
            sm:py-16
            lg:order-1
            lg:min-h-[650px]
            lg:px-10
            lg:py-16
            xl:min-h-[690px]
            xl:px-14
          "
        >
          {/* SUBTLE BACKGROUND DESIGN */}

          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              h-[350px]
              w-[350px]
              rounded-full
              bg-blue-500/5
              blur-3xl
            "
          />

          <div className="relative z-10 w-full max-w-[610px]">
            {/* LOGO + TAGLINE */}

            <div className="mb-6 flex flex-wrap items-center gap-3">
              {logoUrl && (
                <div
                  className="
                    flex
                    min-h-[58px]
                    max-w-[210px]
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    px-4
                    py-2
                    shadow-md
                  "
                >
                  <img
                    src={logoUrl}
                    alt={`${name || "Member"} logo`}
                    className="
                      max-h-[47px]
                      max-w-[175px]
                      object-contain
                    "
                  />
                </div>
              )}

              {tagline && (
                <span
                  className="
                    rounded-full
                    border
                    border-white/30
                    bg-white/10
                    px-4
                    py-2
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-white/90
                  "
                >
                  {tagline}
                </span>
              )}
            </div>

            {/* BLUE LINE */}

            <div
              className="
                mb-6
                h-[3px]
                w-12
                rounded-full
                bg-[#7bb2ff]
              "
            />

            {/* COMPANY NAME */}

            <h1
              className="
                max-w-[620px]
                break-words
                text-[30px]
                font-bold
                leading-[1.16]
                tracking-[-0.025em]
                text-white
                sm:text-[35px]
                lg:text-[38px]
                xl:text-[42px]
              "
            >
              {name}
            </h1>

            {/* CATEGORY + LOCATION */}

            {(category || location) && (
              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  gap-x-5
                  gap-y-3
                  text-[12px]
                  font-medium
                  text-blue-100
                "
              >
                {category && (
                  <span className="inline-flex items-center gap-2">
                    <BriefcaseBusiness size={15} />

                    {getDisplayText(category)}
                  </span>
                )}

                {location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={15} />

                    {getDisplayText(location)}
                  </span>
                )}
              </div>
            )}

            {/* DESCRIPTION */}

            {description && (
              <p
                className="
                  mt-6
                  max-w-[540px]
                  text-[13px]
                  font-normal
                  leading-[1.9]
                  text-[#d4dfeb]
                  sm:text-[14px]
                "
              >
                {description}
              </p>
            )}

            {/* TWITTER + LINKEDIN + CONTACT */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <ActionButton href={twitterLink} icon={XIcon}>
                Twitter
              </ActionButton>

              <ActionButton href={linkedinLink} icon={Linkedin}>
                LinkedIn
              </ActionButton>

              <ActionButton href={contactUrl} icon={Mail} primary>
                Contact Us
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   FEATURE ICON STYLES
========================================================= */

const ICON_STYLES = [
  {
    icon: BriefcaseBusiness,
    color: "text-[#245fc8]",
    bg: "bg-[#eaf2ff]",
  },
  {
    icon: Users,
    color: "text-[#128a91]",
    bg: "bg-[#e7f8f8]",
  },
  {
    icon: ChartNoAxesCombined,
    color: "text-[#6c59c7]",
    bg: "bg-[#f0edff]",
  },
];

/* =========================================================
   FEATURE ICON
========================================================= */

const FeatureIcon = ({ iconUrl, Icon, color, bg }) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={`
        mb-6
        flex
        h-14
        w-14
        items-center
        justify-center
        overflow-hidden
        rounded-2xl
        ${bg}
        ${color}
      `}
    >
      {iconUrl && !imageFailed ? (
        <img
          src={iconUrl}
          alt=""
          className="h-11 w-11 object-contain"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <Icon size={25} strokeWidth={1.7} />
      )}
    </div>
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
  description,
}) => {
  return (
    <article
      className="
        group
        h-full
        rounded-2xl
        border
        border-[#e5ebf4]
        bg-white
        p-7
        shadow-[0_10px_40px_rgba(23,51,86,0.04)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-[0_18px_50px_rgba(23,51,86,0.10)]
        sm:p-8
      "
    >
      <FeatureIcon iconUrl={iconUrl} Icon={Icon} color={color} bg={bg} />

      <h3
        className="
          text-[15px]
          font-bold
          uppercase
          leading-6
          tracking-[0.025em]
          text-[#162b43]
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-3
          text-[14px]
          leading-[1.85]
          text-[#637389]
        "
      >
        {description}
      </p>

      <div
        className="
          mt-7
          h-[2px]
          w-10
          bg-[#5d92ee]
          transition-all
          group-hover:w-20
        "
      />
    </article>
  );
};

/* =========================================================
   EXPERTISE SECTION
========================================================= */

const ExpertiseSection = ({ expertises = [] }) => {
  if (!Array.isArray(expertises) || !expertises.length) {
    return null;
  }

  return (
    <section
      className="
        bg-[#f5f8fc]
        py-16
        sm:py-20
        lg:py-24
      "
    >
      <div
        className="
          mx-auto
          max-w-[1320px]
          px-5
          sm:px-8
          lg:px-12
        "
      >
        {/* SECTION HEADING */}

        <div className="mb-10">
          <span
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#3169cf]
            "
          >
            What Sets Us Apart
          </span>

          <h2
            className="
              mt-3
              text-3xl
              font-bold
              tracking-tight
              text-[#142941]
              sm:text-4xl
            "
          >
            Expertise &amp; Opportunities
          </h2>

          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-7
              text-slate-500
              sm:text-base
            "
          >
            Explore the strengths, strategies and opportunities within our
            partner network.
          </p>
        </div>

        {/* DYNAMIC CARDS */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {expertises.map((item, index) => {
            const style = ICON_STYLES[index % ICON_STYLES.length];

            const apiIcon = item?.icon_url || item?.icon || null;

            return (
              <FeatureCard
                key={item?.id || index}
                icon={style.icon}
                iconUrl={apiIcon}
                color={style.color}
                bg={style.bg}
                title={item?.title || item?.name || ""}
                description={item?.description || item?.text || ""}
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

const PerspectiveSection = ({ perspective = {}, socialLinks = {} }) => {
  if (!perspective?.title) {
    return null;
  }

  const images = Array.isArray(perspective?.images) ? perspective.images : [];

  const image = images[0] || null;

  const ctaUrl = getContactLink(socialLinks, perspective);

  return (
    <section
      className="
        bg-white
        py-16
        sm:py-20
        lg:py-24
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-[1320px]
          grid-cols-1
          items-center
          gap-10
          px-5
          sm:px-8
          lg:grid-cols-2
          lg:gap-16
          lg:px-12
        "
      >
        {/* LEFT IMAGE */}

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-[#e8eff8]
            shadow-[0_20px_55px_rgba(25,48,76,0.12)]
          "
        >
          <div className="aspect-[5/4]">
            {image ? (
              <img
                src={image}
                alt={perspective.title}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  items-center
                  justify-center
                  text-[#6a8ebd]
                "
              >
                <Globe2 size={80} strokeWidth={1} />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CONTENT */}

        <div>
          <span
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#3169cf]
            "
          >
            {perspective?.label || "Our Perspective"}
          </span>

          <h2
            className="
              mt-4
              text-3xl
              font-bold
              uppercase
              leading-tight
              tracking-tight
              text-[#142941]
              sm:text-4xl
            "
          >
            {perspective.title}
          </h2>

          {perspective.description && (
            <p
              className="
                mt-6
                whitespace-pre-line
                text-[15px]
                leading-[1.95]
                text-[#5d6e81]
              "
            >
              {perspective.description}
            </p>
          )}

          {/* CTA */}

          <a
            href={ctaUrl}
            {...getExternalProps(ctaUrl)}
            className="
              mt-8
              inline-flex
              items-center
              gap-3
              rounded-xl
              bg-[#245fc8]
              px-6
              py-3.5
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-[#194da8]
            "
          >
            {perspective?.cta_text || "Contact Us"}

            <ArrowRight size={17} />
          </a>
        </div>
      </div>
    </section>
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

  const tags = [getDisplayText(category), getDisplayText(insight_topic)].filter(
    Boolean,
  );

  const articleUrl = safeLink(format_url);

  const isPdf = media_type === "pdf";

  const content = (
    <article
      className="
        group
        h-full
        overflow-hidden
        rounded-2xl
        border
        border-[#e5ebf4]
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* ARTICLE IMAGE */}

      <div
        className="
          relative
          aspect-[16/9]
          overflow-hidden
          bg-[#eaf0f8]
        "
      >
        {image_url ? (
          <img
            src={image_url}
            alt={title || "Article"}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-[#7b99c1]
            "
          >
            <Globe2 size={44} />
          </div>
        )}

        {image_badge && (
          <span
            className="
              absolute
              right-3
              top-3
              rounded-md
              bg-[#173b65]
              px-2.5
              py-1
              text-[10px]
              font-semibold
              uppercase
              text-white
            "
          >
            {image_badge}
          </span>
        )}
      </div>

      {/* ARTICLE DETAILS */}

      <div className="p-6">
        {/* DATE + SOURCE */}

        <div
          className="
            mb-3
            flex
            flex-wrap
            items-center
            gap-2
            text-[11px]
            font-medium
            text-[#718197]
          "
        >
          {published_date_formatted && <span>{published_date_formatted}</span>}

          {source_logo ? (
            <img
              src={source_logo}
              alt={source_name || "Source"}
              className="
                max-h-5
                max-w-24
                object-contain
              "
            />
          ) : source_name ? (
            <span
              className={
                isPdf
                  ? "rounded bg-[#173b65] px-2 py-1 text-[10px] text-white"
                  : "text-[#d71920]"
              }
            >
              {source_name}
            </span>
          ) : null}
        </div>

        {/* TITLE */}

        <h3
          className="
            text-[16px]
            font-bold
            leading-[1.55]
            text-[#172c44]
            transition-colors
            group-hover:text-[#245fc8]
          "
        >
          {title}
        </h3>

        {/* TAGS */}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="
                  rounded-full
                  bg-[#eef4ff]
                  px-3
                  py-1
                  text-[11px]
                  font-medium
                  text-[#2d65bb]
                "
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* READ ARTICLE */}

        {articleUrl && (
          <div
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              text-xs
              font-semibold
              text-[#2766d0]
            "
          >
            Read Article
            <ExternalLink size={13} />
          </div>
        )}
      </div>
    </article>
  );

  if (!articleUrl) {
    return content;
  }

  return (
    <a
      href={articleUrl}
      {...getExternalProps(articleUrl)}
      className="block h-full"
    >
      {content}
    </a>
  );
};

/* =========================================================
   ARTICLES SECTION
========================================================= */

const ArticlesSection = ({ posts = [] }) => {
  const [visibleCount, setVisibleCount] = useState(9);

  if (!Array.isArray(posts) || !posts.length) {
    return null;
  }

  const visibleArticles = posts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((current) => Math.min(current + 3, posts.length));
  };

  return (
    <section
      className="
        bg-[#f5f8fc]
        py-16
        sm:py-20
        lg:py-24
      "
    >
      <div
        className="
          mx-auto
          max-w-[1320px]
          px-5
          sm:px-8
          lg:px-12
        "
      >
        {/* SECTION HEADING */}

        <div className="mb-10">
          <span
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#3169cf]
            "
          >
            Insights &amp; Updates
          </span>

          <h2
            className="
              mt-3
              text-3xl
              font-bold
              tracking-tight
              text-[#142941]
              sm:text-4xl
            "
          >
            Latest Articles
          </h2>
        </div>

        {/* ARTICLE GRID */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {visibleArticles.map((article, index) => (
            <ArticleCard key={article?.id || index} article={article} />
          ))}
        </div>

        {/* LOAD MORE */}

        {visibleCount < posts.length && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="
                rounded-xl
                border
                border-[#b9cbed]
                bg-white
                px-7
                py-3
                text-sm
                font-semibold
                text-[#245fc8]
                transition-colors
                hover:bg-[#eaf2ff]
              "
            >
              Load More Articles
            </button>
          </div>
        )}
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

  /* =========================
     LOADING
  ========================= */

  if (isLoading) {
    return (
      <div
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          bg-[#f5f8fc]
        "
      >
        <div
          className="
            h-12
            w-12
            animate-spin
            rounded-full
            border-4
            border-blue-100
            border-t-[#245fc8]
          "
          role="status"
          aria-label="Loading member"
        />
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (isError) {
    return (
      <div
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          px-5
          text-center
          text-red-600
        "
      >
        Error: {error?.data?.message || "Failed to load member."}
      </div>
    );
  }

  /* =========================
     API DATA
  ========================= */

  const member = response?.data;

  if (!member) {
    return (
      <div
        className="
          flex
          min-h-[50vh]
          items-center
          justify-center
          text-slate-500
        "
      >
        Member not found.
      </div>
    );
  }

  const {
    name,
    tagline,
    category,
    location,
    description,
    logo_url,
    banner_url,
    social_links = {},
    expertises = [],
    perspective = {},
    posts = [],
  } = member;

  /* =========================
     FINAL PAGE
  ========================= */

  return (
    <main
      className="
        fiera-real-estate-page
        min-h-screen
        bg-white
        text-[#3d474d]
      "
      style={{
        paddingTop: NAVBAR_IS_FIXED ? `${NAVBAR_HEIGHT}px` : undefined,
      }}
    >
      {/* HERO */}

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

      {/* EXPERTISE */}

      <ExpertiseSection expertises={expertises} />

      {/* PERSPECTIVE */}

      <PerspectiveSection
        perspective={perspective}
        socialLinks={social_links}
      />

      {/* ARTICLES */}

      <ArticlesSection posts={posts} />
    </main>
  );
};

export default FieraRealEstate;
